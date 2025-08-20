---
title: 'How Sealos DevBox Cut Container Commit Time from 15 Minutes to 1 Second'
imageTitle: 'DevBox Container Performance Optimization'
description: 'A deep dive into how Sealos DevBox solved a critical containerd bottleneck, slashing container commit times from 846 seconds to under 1 second and boosting productivity for 10,000+ developers.'
date: 2025-08-07
tags: ['Sealos DevBox', 'Container Performance', 'containerd Optimization', 'Cloud Development', 'DevBox']
authors: ['default']
---

**TL;DR:** We identified and fixed an extreme performance bottleneck in our **[Sealos DevBox](/products/devbox)** platform where container commits took up to 15 minutes. By replacing an inefficient O(n²) filesystem walk in containerd's diff service with a filesystem-aware method that reads changes directly from the OverlayFS `upperdir`, we cut incremental commit times by over 98%—from 39 seconds to just 0.46 seconds.

## The Problem: Unacceptable Latency in DevBox Container Commits

**Sealos DevBox**, our cloud development environment platform serving tens of thousands of developers, hit a critical performance wall. The container commit feature—a cornerstone of a developer's workflow for saving their workspace state—became painfully slow. As usage scaled, commit times ballooned, leading to frustrating delays and workflow disruptions.

Our monitoring revealed some alarming metrics under load:

-   **Initial 10GB Environment Commit:** 846 seconds (~14 minutes)
-   **Incremental 1KB File Change Commit:** 39 seconds
-   **CPU Utilization:** Spiked to 100% during every commit operation

For a feature designed to be nearly instantaneous, these latencies were a significant roadblock to productivity and a poor user experience for every developer on the **DevBox** platform.

## Background: Why Fast Container Commits are Crucial for DevBox

In **Sealos DevBox**, a "container commit" captures the current state of a running development environment and saves it as a new OCI image layer. This mechanism is what allows developers to persist work, share reproducible environments, and resume sessions instantly. This entire process runs within an isolated Kubernetes Pod, giving developers a consistent and powerful environment.

The performance of this commit operation is fundamental to the **DevBox** value proposition, which stands apart from other development models.

| Feature                  | Traditional Local Dev | Cloud IDEs | **Sealos DevBox**                                  |
| ------------------------ | --------------------- | ---------- | -------------------------------------------------- |
| **Setup Time**           | Hours to days         | Minutes    | **Minutes**                                        |
| **Environment Consistency**| Poor                  | Good       | **Perfectly Consistent** (via image layers)        |
| **Resource Requirements**  | High local specs      | Browser only | **Browser only**                                   |
| **State Persistence**    | Manual                | Varies     | **Automated & Instant** (via optimized commits)    |
| **IDE Support**          | Native                | Limited    | **Any IDE** (via remote connection)                |
| **Environment Isolation**  | Docker/VM             | Container  | **Secure Kubernetes Pod**                          |

Slow commits directly undermined the "instant" and "fluid" experience we promise our users.

## Investigating the DevBox Performance Bottleneck

To pinpoint the bottleneck, we used `pprof` to generate flame graphs of the `containerd` process during a commit. We designed two specific test cases to replicate the user-reported issues.

**Test 1: Large Initial Commit**
Simulates the first save of a large project.

```bash
# Generate 10GB of data (100 files, 100MB each)
mkdir -p random_files
for i in {1..100}; do
    dd if=/dev/urandom of=random_files/file_$i.bin bs=1M count=100
done
# Trigger commit operation
```

**Test 2: Small Incremental Update**
Simulates a common developer workflow: saving a minor code change.

```bash
# Add a single 1KB file to the existing 10GB container
dd if=/dev/urandom of=random_files/file_101.bin bs=1K count=1
# Trigger commit operation
```

The initial test results confirmed our monitoring data:

| Test Scenario                  | Commit Time          | Expected Time |
| ------------------------------ | -------------------- | ------------- |
| **Test 1: 10GB Initial Commit**  | **846.99s**          | ~60s          |
| **Test 2: 1KB Incremental Commit** | **39.14s**           | <1s           |

The flame graphs for both tests were nearly identical, pointing to a massive CPU-bound operation deep within containerd's diff service, regardless of the change size. This was our smoking gun.

![DevBox Commit Performance Flame Graph Before Optimization - Test 001](./images/devbox-commit-performance-flame-graph-before-optimization.png)

![DevBox Commit Performance Flame Graph Before Optimization - Test 002](./images/devbox-commit-performance-flame-graph-after-optimization.png)

## Root Cause: An O(n²) Filesystem Diff in containerd

Our code analysis led us to `containerd`'s default diff service, which used a function called `doubleWalkDiff`. This function calculates changes by performing a full, recursive walk of two directory trees: the base image's filesystem (`lowerdir`) and the container's merged view.

This approach has a time complexity of **O(n²)**, as it compares every file and directory from the source with the target. This meant that even for a tiny 1KB change, the algorithm was wastefully traversing and comparing the entire 10GB of existing data.

```go
// Before: O(n²) comparison disaster
func Changes(ctx context.Context, a, b string, changeFn ChangeFunc) error {
    if a == "" {
        log.G(ctx).Debugf("Using single walk diff for %s", b)
        return addDirChanges(ctx, changeFn, b)
    }
    
    // The performance killer: comparing two complete directory trees
    log.G(ctx).Debugf("Using double walk diff for %s from %s", b, a)
    return doubleWalkDiff(ctx, changeFn, a, b)  // 💀 Death by recursion
}}
```

This discovery was the key: the tool was working as designed, but the design was not optimized for our high-performance **DevBox** use case.

## The Fix: Leveraging OverlayFS `upperdir` for an O(m) Diff

The solution came from a deeper understanding of [OverlayFS](https://www.kernel.org/doc/html/latest/filesystems/overlayfs.html). An OverlayFS mount consists of a read-only `lowerdir` and a writable `upperdir`. Crucially, all modifications within the container—creations, modifications, and deletions—are recorded *exclusively* in the `upperdir`.

The `upperdir` itself is the diff. The `doubleWalkDiff` function was redundantly recalculating what the filesystem had already tracked.

The fix was to bypass this generic walk and generate the diff by reading only the `upperdir`. We found that `containerd`'s continuity library already supported this via `fs.DiffDirChanges` when used with an `fs.DiffSourceOverlayFS` flag.

```go
// Patched function using the efficient OverlayFS-aware diff method
func writeDiff(ctx context.Context, w io.Writer, lower mount.Mount, upperRoot string, sourceDateEpoch time.Time) error {
    return mount.WithTempMount(ctx, lower, func(lowerRoot string) error {
        cw := archive.NewChangeWriter(w, upperRoot, opts...)
        
        // The game-changer: directly use upperdir as the diff source
        if err := fs.DiffDirChanges(
            ctx, 
            lowerRoot, 
            upperRoot, 
            fs.DiffSourceOverlayFS,  // 🚀 The magic flag
            cw.HandleChange
        ); err != nil {
            return fmt.Errorf("failed to calculate diff changes: %w", err)
        }
        
        return cw.Close()
    })
}
```

This simple change transformed the operation's complexity from O(n²) to **O(m)**, where `m` is the size of the modifications, not the entire filesystem.

## Deployment and Configuration on Sealos Cloud

We rolled out the optimized `containerd` binary across our [Sealos Cloud](https://os.sealos.io).

#### 1. Build the Optimized Binary

```bash
# Clone our forked containerd with the patch
git clone https://github.com/labring/containerd
cd containerd
git checkout f7b2ff2c4c9dc05494dcb0b5346f19ad5b33ef53

# Build the binary
make binary
```

#### 2. Deploy to Kubernetes Nodes

```bash
# Stop the running service
systemctl stop containerd

# Backup the original and deploy the new binary
cp /usr/bin/containerd /usr/bin/containerd.backup
cp bin/containerd /usr/bin/containerd
chmod +x /usr/bin/containerd
```

#### 3. Enable the New Diff Plugin

We activated the new diff plugin by editing `/etc/containerd/config.toml`:

```toml
[plugins."io.containerd.service.v1.diff-service"]
  default = ["overlayfs-diff"]
```

#### 4. Restart and Validate

```bash
systemctl start containerd
# Verify the plugin is loaded
ctr plugins ls | grep overlayfs-diff
```

## Validation: Dramatic Performance Gains

The impact was immediate and transformative for the **Sealos DevBox** platform.

### Lab Test Results

| Test Scenario                  | Before    | After     | Improvement        |
| ------------------------------ | --------- | --------- | ------------------ |
| **Test 1: 10GB Initial Commit**  | 846.99s   | 266.83s   | **3.17x faster**   |
| **Test 2: 1KB Incremental Commit** | 39.14s    | 0.46s     | **85.08x faster** |

### Production Impact

Across our production clusters serving over 10,000 active developers:

-   **P99 commit latency** plummeted from over 900s to ~180s.
-   **Average CPU utilization** during commits dropped by 75%.
-   **Support tickets** related to slow **DevBox** commits fell to zero.

## Analysis and Limitations

This optimization proves the immense value of using filesystem-aware algorithms over generic ones. While `containerd`'s default diff mechanism ensures portability, it carries a severe performance penalty when a specialized method is available.

It's important to note that this solution is specific to environments using `containerd` with the **OverlayFS snapshotter**. Systems relying on other snapshotters (e.g., ZFS, Btrfs) would not benefit from this patch and would require their own purpose-built diff implementations.

## Next Steps: Targeting New Bottlenecks in DevBox

With the diffing bottleneck eliminated, our new flame graphs show that `tar` and `gzip` operations are the next performance frontier, especially for large initial commits. Our future work for **DevBox** performance will focus on:

-   Implementing parallel compression to better utilize multi-core CPUs.
-   Investigating faster compression algorithms like `zstd`.
-   Exploring incremental tar generation to avoid re-archiving unchanged files.

Our implementation is open-source and can be reviewed in our [containerd repository fork](https://github.com/labring/containerd/commit/f7b2ff2c4c9dc05494dcb0b5346f19ad5b33ef53). This performance boost is now standard in all [Sealos DevBox](/products/devbox) environments.

## Frequently Asked Questions

### Q: How did Sealos DevBox achieve sub-second container commit times?
**A:** **DevBox** now uses a custom-patched `containerd` with an OverlayFS-aware diff algorithm. Instead of inefficiently comparing the entire filesystem (an O(n²) task), it intelligently reads changes directly from the OverlayFS `upperdir` layer. This reduces the work to O(m)—proportional to the change size—making incremental commits exceptionally fast.

### Q: Is this optimization applicable to all container environments?
**A:** This specific fix is for container runtimes using `containerd` with the OverlayFS snapshotter, which is a common setup in modern Kubernetes environments like the one **DevBox** is built on. The underlying principle—using filesystem-specific logic—can be applied elsewhere, but the code is specific to OverlayFS.

### Q: What is the main benefit of faster commits for a developer using DevBox?
**A:** Faster commits create a seamless, uninterrupted workflow. Developers on **DevBox** can now save their environment state frequently without a second thought, which encourages experimentation, reduces the risk of lost work, and speeds up CI/CD pipelines that rely on creating image snapshots.

### Q: What tools helped diagnose this DevBox performance issue?
**A:** We used `pprof` to collect CPU profiles from the live `containerd` process and generated flame graphs to visualize the performance hotspots. This quickly and clearly identified the `doubleWalkDiff` function as the primary bottleneck in our **DevBox** environment.

### Q: What is the next performance bottleneck for container commits?
**A:** After solving the diffing issue, the main bottlenecks are now the archiving (`tar`) and compression (`gzip`) stages. These processes are the most time-consuming parts of a commit, especially when dealing with large new files.