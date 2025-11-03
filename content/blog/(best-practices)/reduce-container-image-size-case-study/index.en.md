---
title: 'Case Study: How We Reduced a Container Image by 99.7% (800GB to 2GB)'
description: 'Discover how the Sealos team solved a critical disk exhaustion issue by optimizing a bloated 800GB container image down to 2GB. Learn our methods for squashing layers and manipulating OCI images to reclaim storage and boost performance.'
date: 2025-10-24
imageTitle: Reduce Container Image Size
tags:
  [
    'Cloud Development',
    'Sealos',
    'DevBox',
    'Containerd',
    'Kubernetes',
    'Remote Development',
  ]
authors: ['default']
---

# Case Study: How We Reduced a Container Image by 99.7% (800GB to 2GB)

This case study is a real-world story from the Sealos platform engineering team. We believe in transparency, and this is a detailed account of how we diagnosed and resolved a critical production issue, sharing our hands-on experience to help the broader cloud-native community.

### TL;DR

We had a problem with runaway container image bloat, which was causing critical disk exhaustion on our production nodes. We fixed it by building a custom tool to remove a problematic 11GB file and squash 272 image layers into one, and the result was a 99.7% reduction in image size, from 800GB down to 2.05GB.

### 1. The Problem: Critical Disk Exhaustion Caused by Container Image Bloat

It was 2 PM when the PagerDuty alert blared for the fifth time that week: "Disk Usage > 90% on `devbox-node-4`." Our Sealos cluster's development environment node was once again evicting pods, grinding developer productivity to a halt. This was a classic symptom of [Kubernetes](https://kubernetes.io/docs/concepts/overview/) disk space exhaustion, but the root cause was elusive. The node was equipped with a hefty 2TB SSD, yet a simple `df -h` confirmed only 10% of its space remained.

Our initial reaction was to treat the symptom. We expanded the node's storage to 2.5TB, assuming a transient workload spike. The next day, the alert returned, mocking our efforts. The problem wasn't a spike; it was a cryptic, relentless consumption of storage stemming from what we would later discover was extreme container image bloat. For a platform promising stable and predictable development environments, this failure was an unacceptable breach of trust.

### 2. Why It Matters: The Business Context

The [Sealos devbox feature](/products/devbox) is supposed to give developers one-click, isolated, cloud-based environments that feel just like working locally. To make that happen, we had to meet a few tough product requirements:
1.  **Keep existing habits:** Developers should be able to use their local IDEs like VS Code without changing their workflow.
2.  **No new concepts:** Users shouldn't need to learn Docker or Kubernetes to write code.
3.  **Simplicity is key:** The whole experience needs to be dead simple.

This led us to a design that bends some of the typical rules for containers. For example, we put an `sshd` server in the container to support IDE connections. We also let developers "commit" their changes, which treats the container more like a persistent, stateful workspace than an immutable artifact. In a development context, this is a great feature.

But that's where we ran into trouble. We were building a user-friendly abstraction on top of Kubernetes, which isn't really designed for this kind of stateful, VM-like behavior. The persistent disk space exhaustion wasn't just a technical bug; it was a direct result of the trade-offs we made between our user-centric design and the mechanics of container runtimes. Unreliable environments mean frustrated developers, and we weren't just fixing a disk issue—we were protecting the core promise of our product.

### 3. Investigation: Pinpointing the I/O Storm with iotop and du

We started the hands-on investigation by trying to find what was causing all the I/O. The first tool we reached for was `iotop`, and it gave us a clear signal right away: several **[containerd](https://containerd.io/)** processes were writing to disk at a sustained rate of over 100MB/s. For a runtime managing mostly idle dev environments, that was way too high.

![Terminal output from the iotop command showing containerd processes with disk write speeds over 100MB/s.](./images/containerd-high-disk-io-iotop.png)

This told us the problem was inside the containers. We started digging through containerd's storage directory, using `du` to find the biggest directories in the overlayfs snapshots.

```bash
du -h -d4 /var/lib/containerd/io.containerd.snapshotter.v1.overlayfs/snapshots/ \
  | sort -hr | head -20
```

The output was strange. We expected to see large user files, but instead, we saw the same 11GB file over and over again.

```plain
11G     /var/lib/containerd/.../snapshots/560660/fs/var/log/btmp
11G     /var/lib/containerd/.../snapshots/560659/fs/var/log/btmp
11G     /var/lib/containerd/.../snapshots/560652/fs/var/log/btmp
11G     /var/lib/containerd/.../snapshots/560631/fs/var/log/btmp
11G     /var/lib/containerd/.../snapshots/560620/fs/var/log/btmp
```

The file `/var/log/btmp` records failed login attempts in Linux. It should be a few kilobytes, maybe. An 11GB `btmp` file is completely unheard of. We took a look inside one of them with the `last` command.

```bash
last -f /var/lib/containerd/.../snapshots/560576/fs/var/log/btmp | tail -10
```

Our terminals filled with a constant stream of failed SSH login attempts, with timestamps showing dozens of attempts per second. It was obvious the container had been under a brute-force attack for months, and our system had recorded every single attempt.

### 4. Root Cause: How OverlayFS Copy-on-Write Amplified a Brute-Force Attack

The discovery of the brute-force attack was only the first layer of the problem. Why did it cause such catastrophic disk usage? This analysis revealed the root cause of our container image bloat: a perfect storm created by the intersection of container image architecture and a series of security oversights.

**Primary Technical Contradiction: Copy-on-Write vs. Log Files**

The core of the issue was a disastrous interaction between **[OverlayFS](https://www.kernel.org/doc/html/latest/filesystems/overlayfs.html)**'s Copy-on-Write (CoW) mechanism and the ever-growing `btmp` file, a textbook example of poor **OverlayFS copy-on-write performance** when handling large, frequently modified files. The problematic user image had an astonishing **272 layers**, each representing a `commit` operation.

![Terminal screenshot showing a single container image composed of 272 layers, indicating image bloat.](./images/bloated-container-image-272-layers.png)

Here's how the disaster unfolded:

1.  A user's container is under a brute-force attack, and `/var/log/btmp` grows to 11GB.
2.  The user performs a `commit`, creating a new image layer.
3.  A single new failed login is appended to `/var/log/btmp`.
4.  Because of CoW, OverlayFS doesn't just write the new line. It copies the *entire 11GB file* into the new, upper layer.
5.  This process repeated 271 times.

Even if the user deleted the `btmp` file in the latest layer, the 271 copies of the 11GB file would still exist in the layers underneath. The disk space was locked away, impossible to recover with standard container commands.

This technical problem was made possible by a few oversights in our platform design:

  * **Defense #1 (Missing): A Cap on Image Layers.** We had no guardrails to stop a user's image from growing to hundreds of layers, which allowed the CoW issue to multiply.
  * **Defense #2 (Missing): Secure Base Image.** Our early `devbox` images left SSH password authentication enabled and exposed to the internet, without any rate-limiting tools like `fail2ban`.
  * **Defense #3 (Missing): Log Rotation.** We assumed containers were ephemeral and didn't configure `logrotate` for system logs like `btmp`. This let the log file grow without any limits.

### 5. Solution: Building a Custom OCI Tool to Squash 272 Image Layers

Standard `docker` commands couldn't fix this. We had to manipulate the [OCI image](https://github.com/opencontainers/image-spec)'s immutable history directly. This meant building our own tool and a dedicated environment to perform the operation.

**Architecture Rework: The `image-manip` Tool**

We wrote a small CLI tool called `image-manip` that lets us treat OCI images like data structures we can modify. We used two of its functions for this job:

1. **`image-manip remove /var/log/btmp <image>`**: This command adds a new layer with an OverlayFS "whiteout" file. This marker tells the container runtime to ignore `/var/log/btmp` in all the lower layers, effectively deleting it from the merged filesystem.

2. **`image-manip squash`**: This was the most important part. The tool spins up a temporary container, applies all 272 layers to an empty filesystem, and then exports the final result as a single, new layer. This flattens the entire bloated history into one clean state.

**Tool Innovation: A High-Performance Environment**

We couldn't run these intensive operations on our production nodes. We set up dedicated `devbox-image-squash-server` nodes (8-core CPU, 16GB RAM). To handle the I/O, we created a striped [LVM (Logical Volume Management)](https://www.redhat.com/sysadmin/lvm-logical-volume-management) volume across two 1TB ESSD cloud disks.

```bash
# Create LVM volume group
pvcreate /dev/vdb /dev/vdc
vgcreate vg_containerd /dev/vdb /dev/vdc
lvcreate -i 2 -I 4 -l 100%Free -n lv_containerd vg_containerd
mkfs.xfs /dev/vg_containerd/lv_containerd
```

We ran a [`fio`](https://fio.readthedocs.io/en/latest/) benchmark to make sure the setup could handle the load, and it hit 90.1k random write IOPS.

```bash
fio -direct=1 -iodepth=32 -rw=randwrite -ioengine=libaio \
    -bs=4k -numjobs=4 -time_based=1 -runtime=1000 \
    -group_reporting -filename=/var/lib/containerd/fio -size=10G
```

Finally, we tweaked the OS to give `containerd` the highest I/O priority possible.

```bash
# Prioritize containerd I/O
cat > /etc/systemd/system/containerd.service.d/ioscheduling.conf <<EOF
[Service]
IOSchedulingClass=realtime
IOSchedulingPriority=0
EOF

# Use the 'none' scheduler for high-performance NVMe
echo none > /sys/block/vdb/queue/scheduler
echo none > /sys/block/vdc/queue/scheduler
```

On September 11 at 10:00 AM, we started the process on the 800GB, 272-layer image. The `remove` operation, which adds a "whiteout" layer,  was instant.

```bash
# 💀 The old way: a mountain of layers
create diff for snapshot file-removal-514774748-OJFv cost 12.555249ms
```

Then came the `squash` operation. After an hour of the machine working hard, the logs showed us what we wanted to see.

```plain
INFO[0000] start to squash 272 layers...
INFO[0060] applied layer 1/272
INFO[0120] applied layer 2/272
...
INFO[3627] apply 272 layers took 1h0m26.977030719s
# 🚀 The magic fix: collapsing 272 layers into one
INFO[3756] rebase image successfully, cost 1h2m36.074285014s
```

### 6. Validation: The Proof Is in the Data

The new, squashed image was only **2.05GB**. That's a 390-to-1 reduction.

We pushed the new image and restarted the user's `devbox`. It came up without any issues. We checked the filesystem to confirm the `btmp` file was gone.

```bash
devbox@linux:~$ ls -lah /var/log/
total 84K
-rw-r--r-- 1 root root     0 Aug 12  2024 btmp  # File exists, but is now 0 bytes
-rw-r--r-- 1 root root  6.0K Nov 19  2024 alternatives.log
```

The impact on the platform was immediate and easy to measure. The numbers speak for themselves.

| Metric | Before Fix | After Fix | Improvement |
| :--- | :--- | :--- | :--- |
| **Disk Space Alerts (30 days)** | 23 | **0** | **100% Reduction** |
| **Avg. Node Disk I/O** | 120 MB/s | 26 MB/s | **78% Decrease** |
| **Avg. Container Image Pull Time** | 75 seconds | 26 seconds | **65% Faster** |
| **Max Container Image Size** | 800 GB | 2.05 GB | **390x Smaller** |
| **Estimated Storage Cost**| \~$520/cluster/mo| ~$70/cluster/mo | **$450/mo Savings** |

---

### 7. Lessons Learned & Next Steps

This whole incident was a tough but important lesson. Our fix worked, but it was a manual, reactive fix for a problem that shouldn't have happened in the first place. Here are our main takeaways.

**Q: What was the primary cause of the extreme container image bloat?**

**A:** It was the combination of OverlayFS's Copy-on-Write (CoW) behavior and a large, frequently updated log file (`/var/log/btmp`). Every small update to the 11GB file caused the entire file to be copied into a new layer, and this happened over 270 times.

**Q: Why couldn't you just delete the file with a standard `docker commit`?**

**A:** Deleting a file in a new layer only adds a "whiteout" marker that hides the file. The original 271 copies of the 11GB file would still be stored in the underlying layers, taking up disk space. We had to do a full layer squash to actually get rid of the data and reclaim the space.

**Q: What is the key lesson for other platform engineers from this experience?**

**A:** The key insight is to treat container images not as black boxes, but as structured archives that you can manipulate. If you understand the underlying tech, like the OCI image spec, you can do advanced optimizations that go way beyond what standard tools offer. This is crucial for preventing problems like this before they start.

Our next step is to move from firefighting to fire prevention. We've already put automated monitoring in place to alert us if any user image grows beyond 50 layers or 10GB. More importantly, all new `devbox` base images now ship with password authentication disabled by default and a proper `logrotate` configuration.
