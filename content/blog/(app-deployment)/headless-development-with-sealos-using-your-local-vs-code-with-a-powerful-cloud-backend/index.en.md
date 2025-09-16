---
title: "Headless Development with Sealos: Using Your Local VS Code with a Powerful Cloud Backend"
imageTitle: Sealos Headless Dev in VS Code
description: Explore how Sealos enables a headless development workflow by connecting your local VS Code to a scalable cloud backend. This guide covers setup, key concepts, and best practices for a seamless cloud-backed development experience.
date: "2025-09-04"
tags:
  [
    "headless-development",
    "sealos",
    "vs-code",
    "cloud-backend",
    "remote-development",
    "cloud-development",
  ]
authors: ["default"]
---

Imagine writing code on a lightweight laptop while compiling, training, and running services on powerful cloud machines—without sacrificing your local editing comfort, extensions, or shortcuts. That’s the promise of headless development: keep your familiar local UI (like VS Code) but shift computing, storage, and runtime to the cloud. With Sealos—a cloud operating system built on Kubernetes—you can spin up isolated, secure developer workspaces on-demand, attach persistent storage, add managed databases, and connect from your local VS Code in minutes.

This article explains what headless development is, why it’s becoming essential, how it works with Sealos, and how you can set it up for real-world projects. You’ll also see practical examples, tips, and small snippets to make headless development feel natural from day one.

## What Is Headless Development?

Headless development decouples your editor UI from the compute environment where your code runs. In practice:

- You use your local VS Code for editing, navigation, extensions, and Git tooling.
- Your code executes on a remote machine (or container/VM) with more CPU, RAM, and possibly GPUs.
- Your files live on the remote environment (mounted volumes or cloud storage).
- VS Code connects to that environment via SSH or a reverse tunnel; the “VS Code Server” runs remotely to provide a native editing experience.

Think of it as “remote dev” without a browser IDE requirement. You retain your local VS Code experience while gaining cloud power and consistency.

## Why Headless Development Matters

Headless development addresses many challenges teams face today:

- Performance: Heavy builds, test suites, or ML training are faster on cloud instances with more cores, RAM, and GPUs.
- Consistency: Standardize environments (OS, libraries, services) across contributors to eliminate “works on my machine.”
- Flexibility: Move between devices seamlessly; your dev environment stays in the cloud with persistent volumes.
- Security: Keep source code and secrets within a controlled network boundary; grant access via SSH keys or tunnels.
- Collaboration: Provision identical dev workspaces from images; share devcontainer configs; enable preview environments per feature branch.
- Battery and noise: Stop overheating your laptop with long builds or Docker-heavy workflows.

Sealos amplifies these benefits by providing a multi-tenant, Kubernetes-based platform with app templates, persistent storage, managed data services, and quotas—all packaged as a “cloud OS” you can use directly or run yourself. Learn more at https://sealos.io.

## How Headless Development Works on Sealos

Sealos organizes resources into isolated namespaces with quotas for CPU, memory, storage, and network. Within a namespace, you can:

- Deploy containers (e.g., an Ubuntu or language-specific image) as dev workspaces.
- Attach PersistentVolumeClaims (PVCs) to keep your source code and artifacts across restarts.
- Add managed services (databases, message queues, object storage) from the Sealos app marketplace.
- Expose services via ingress or port-forwarding.
- Optionally use GPUs if your Sealos cluster provides GPU nodes.

Then, connect your local VS Code to that remote workspace using one of two primary methods:

- Remote - SSH: Open an SSH server in your workspace and connect with VS Code’s Remote - SSH extension.
- VS Code Tunnel: Use a reverse tunnel initiated from your workspace to your local VS Code, reducing inbound networking configuration.

### Architecture at a Glance

- Local: VS Code UI, extensions, Git credentials, terminal.
- Sealos: Remote compute (container/VM), storage (PVC, object storage), managed databases, networking and access controls.
- Connection: SSH or VS Code tunnel establishes a secure channel. VS Code Server is installed on first connection to enable features like IntelliSense and the integrated terminal.

## Choosing a Connectivity Method

Both SSH and tunnels work well. Your choice depends on network policies and convenience.

| Method            | Pros                                      | Cons                                         | Best For                                  |
| ----------------- | ----------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| Remote - SSH      | Simple, widely used; easy to automate     | Requires inbound port; firewall setup needed | Stable networks with allowed inbound SSH  |
| VS Code Tunnel    | No inbound ports; traverses firewalls/NAT | Requires VS Code CLI on remote               | Restricted networks, easier initial setup |
| Browser IDE (alt) | Zero local setup; works anywhere          | Different UX than local VS Code              | Demos, quick edits, thin clients          |

This article focuses on keeping your local VS Code while using SSH or tunnels.

## Setting Up a Cloud Workspace on Sealos

You have two general paths:

- Use an app/template from Sealos’ app marketplace to get a ready-made dev box.
- Run your own container with a base image plus SSH server and any language runtimes you need.

Below are typical steps. The exact UI/labels may vary depending on your Sealos deployment or version. Refer to Sealos docs for the latest workflow.

### Option A: Launch a Ready-Made Dev Box

- In Sealos, create or select your workspace/namespace.
- Open the App Launchpad (or equivalent) and search for a “Dev” or “Ubuntu” template. Many setups let you:
  - Select a container image (e.g., Ubuntu, Debian, or a language-specific base).
  - Allocate CPU/memory and attach a persistent disk (PVC).
  - Set environment variables.
  - Expose ports (optional).
- Deploy the app. You’ll get a running container with persistent storage ready to configure with SSH or a tunnel.

Tip: Some images already include SSH servers (e.g., linuxserver/openssh-server). If you choose a plain base image, you can install and configure SSH yourself.

### Option B: Define Your Own Workspace (Kubernetes YAML)

If you prefer declarative control, you can define a Deployment and PVC. The snippet below uses a popular Ubuntu base and mounts a volume at /workspace:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: devbox-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 50Gi
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devbox
spec:
  replicas: 1
  selector:
    matchLabels:
      app: devbox
  template:
    metadata:
      labels:
        app: devbox
    spec:
      containers:
        - name: devbox
          image: ubuntu:22.04
          command: ["/bin/bash", "-c", "sleep infinity"]
          resources:
            requests:
              cpu: "2"
              memory: "4Gi"
            limits:
              cpu: "4"
              memory: "8Gi"
          volumeMounts:
            - mountPath: /workspace
              name: dev-data
      volumes:
        - name: dev-data
          persistentVolumeClaim:
            claimName: devbox-pvc
```

Apply this via Sealos’ Kubernetes UI or a terminal session with kubectl. Once running, you can exec into the container to install tooling (SSH, runtimes) and set up users.

## Connecting VS Code via SSH

SSH gives you a straightforward pathway if inbound connections are allowed. The high-level steps:

1. Create a non-root user and install an SSH server in your workspace container.
2. Add your public key to authorized_keys.
3. Optionally expose/ingress port 22 (or use a NodePort/LoadBalancer if your Sealos cluster allows it).
4. Use the VS Code “Remote - SSH” extension to connect.

Below are typical commands run inside your workspace container:

```bash
# Update and install packages
apt-get update && apt-get install -y openssh-server sudo git curl

# Create a non-root user
useradd -m -s /bin/bash dev
echo "dev ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/dev
chmod 440 /etc/sudoers.d/dev

# Configure SSH
mkdir -p /home/dev/.ssh
chmod 700 /home/dev/.ssh
# Paste your public key into authorized_keys (replace the echo line accordingly)
echo "ssh-ed25519 AAAA... your_key_here" >> /home/dev/.ssh/authorized_keys
chmod 600 /home/dev/.ssh/authorized_keys
chown -R dev:dev /home/dev/.ssh

# Harden SSH: disable root login and password auth
sed -i 's/#\?PermitRootLogin .*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/#\?PasswordAuthentication .*/PasswordAuthentication no/' /etc/ssh/sshd_config

# Start SSHD (and create the run directory if needed)
mkdir -p /var/run/sshd
service ssh start
```

If your Sealos environment provides a service or ingress for port 22, expose it:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: devbox-ssh
spec:
  type: ClusterIP
  selector:
    app: devbox
  ports:
    - name: ssh
      protocol: TCP
      port: 22
      targetPort: 22
```

You can then:

- Use port-forwarding from your laptop: kubectl port-forward svc/devbox-ssh 2222:22
- Or publish externally via a LoadBalancer or ingress (if your Sealos environment allows non-HTTP ingress for SSH).

On your local machine, update SSH config:

```bash
# ~/.ssh/config
Host sealos-dev
  HostName 127.0.0.1
  Port 2222
  User dev
  IdentityFile ~/.ssh/id_ed25519
  ServerAliveInterval 30
  ServerAliveCountMax 120
```

Open VS Code, install “Remote - SSH,” and connect to “sealos-dev”.

## Connecting VS Code via Tunnels (No Inbound Ports)

When opening port 22 is inconvenient, use VS Code’s tunnel feature. It sets up a secure reverse tunnel from your workspace to your local VS Code without exposing a public port.

High-level workflow:

1. Install the VS Code CLI on the remote (Linux) workspace.
2. Authenticate the tunnel with your Microsoft/GitHub account (one-time).
3. Start the tunnel.
4. On your laptop, connect via “Remote Tunnels” inside VS Code.

Typical commands on the remote workspace:

```bash
# Example for Debian/Ubuntu to install VS Code CLI (see official docs for latest)
curl -L https://aka.ms/install-vscode-server/setup.sh | sh

# Authenticate (opens a device code flow)
code tunnel --accept-server-license-terms --name sealos-dev

# The terminal will show the tunnel status and an ID.
# Keep this process running; use tmux/screen if needed:
# tmux new -s tunnel 'code tunnel --name sealos-dev --accept-server-license-terms'
```

On your local VS Code:

- Install “Remote Development” pack (includes Remote Tunnels).
- Open the Remote Explorer panel, choose “Tunnels,” and connect to “sealos-dev.”

No public ports, no firewalls to wrangle.

Note: VS Code CLI and tunnel features evolve; consult the official docs for the current installation script and auth method.

## Example: Node.js API + Postgres on Sealos

Here’s a simple workflow showcasing a full, cloud-backed dev experience with your local VS Code editor.

1. Provision Postgres:
   - In Sealos, open the app marketplace and deploy a Postgres instance in your namespace (or deploy via YAML/Helm).
   - Record the service name, credentials, and port. Attach persistent storage if needed.
2. Start a dev workspace:
   - Launch a dev container as shown earlier; attach a PVC at /workspace.
   - Connect via SSH or VS Code tunnel from your local VS Code.
3. Prepare your project:
   - In the VS Code remote terminal, clone your repo:
     ```bash
     cd /workspace
     git clone https://github.com/your-org/your-node-api.git
     cd your-node-api
     ```
   - Install Node.js (e.g., via nvm) and dependencies:
     ```bash
     curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
     source ~/.bashrc
     nvm install 20
     npm ci
     ```
4. Connect to Postgres:
   - If the DB runs inside the same namespace, use the ClusterIP service (e.g., postgres.default.svc.cluster.local:5432).
   - Export env vars or create a .env file (don’t commit secrets):
     ```bash
     export DATABASE_URL=postgres://user:password@postgres:5432/appdb
     ```
   - Test DB connection with a migration or health check.
5. Run and debug:
   - Start your API:
     ```bash
     npm run dev
     ```
   - Expose the app to your laptop:
     - If using SSH, use VS Code’s automatic port forwarding (it detects listening ports).
     - Or with kubectl on your laptop: kubectl port-forward deploy/devbox 3000:3000
   - Set breakpoints locally in VS Code; the code runs remotely on Sealos.

With this setup, compute-heavy tasks and services stay in the cloud, while you get instant edits, IntelliSense, and debugging from your local VS Code.

## Reproducibility with Dev Containers

Dev Containers help you define your environment in a versioned devcontainer.json and Dockerfile so every workspace is identical. In a headless setup:

- Build a dev container image locally or in CI.
- Push it to a registry accessible by Sealos.
- Deploy the image as your dev workspace on Sealos, attach a PVC, and connect with VS Code.

Minimal example:

```json
// .devcontainer/devcontainer.json
{
  "name": "Node.js Dev",
  "image": "ghcr.io/your-org/dev-node:20",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    }
  },
  "remoteUser": "dev",
  "mounts": ["source=dev-pvc,target=/workspace,type=volume"],
  "postCreateCommand": "npm ci"
}
```

```dockerfile
# Dockerfile for dev image
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install basic tooling
RUN apt-get update && apt-get install -y git curl sudo openssh-server && \
    useradd -m -s /bin/bash dev && echo "dev ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/dev && chmod 440 /etc/sudoers.d/dev && \
    mkdir -p /var/run/sshd

# Optionally preinstall language toolchains to speed up onboarding
```

You can still connect with Remote - SSH or tunnels. The benefit is consistency: every teammate gets the same versions and packages, pre-warmed for faster productivity.

## Tips for Performance, Cost, and UX

- Right-size resources:
  - Start with requests/limits aligned to your workload (e.g., 2–4 vCPU, 4–8 GiB RAM for typical web dev).
  - Scale up temporarily for heavy operations (builds, data jobs), then scale down.
- Persistent volumes:
  - Store your code and caches (node_modules, .m2, venv) on PVCs for faster restarts.
  - Consider multiple volumes for separation of concerns (source vs data).
- GPUs on demand:
  - If your Sealos cluster offers GPU nodes, label your workspace to schedule on them only when needed (e.g., separate “training” workspace).
- Sleep/stop policies:
  - Suspend non-active workspaces to save cost; rely on PVCs for instant resume.
- Terminal hygiene:
  - Use tmux or screen to keep SSH/tunnel processes alive across restarts.
- File watching limits:
  - For large repos, adjust inotify watchers on the remote:
    ```bash
    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
    sudo sysctl -p
    ```
- Node linking and symlinks:
  - Place your project in the PVC path consistently to avoid broken symlinks between sessions.

## Security Essentials

- SSH keys only:
  - Disable password auth; never expose root. Rotate keys periodically.
- Least privilege:
  - Run as a dedicated non-root user. Limit capabilities in container specs.
- Secrets management:
  - Inject secrets via Sealos/Kubernetes Secrets or sealed secrets; never commit .env files.
- Network policy:
  - Restrict egress/ingress in your namespace to necessary endpoints.
- Backups:
  - Snapshot PVCs and back up databases using Sealos-provided tooling or your backup solution.
- Audit trails:
  - Use Sealos logs and Kubernetes events for visibility into deployments and access.

## Troubleshooting Common Issues

- VS Code Server fails to start:
  - Check remote disk space and permissions on ~/.vscode-server or ~/.vscode-remote.
  - Ensure the remote user owns the workspace directories.
- SSH disconnects:
  - Add keep-alives in both SSH config and server. Check idling firewalls.
- Permission errors on PVC:
  - Some volumes default to root ownership. Use an initContainer or fsGroup in the Pod spec:
    ```yaml
    securityContext:
      fsGroup: 1000
      runAsUser: 1000
      runAsGroup: 1000
    ```
- Slow file operations:
  - Avoid remote-to-local sync for large repos; edit directly on the remote.
  - Cache dependencies on PVCs to avoid repeated downloads.
- Port forwarding conflicts:
  - Make sure the port isn’t already in use locally. Change local port or stop conflicting processes.

## Practical Applications and Patterns

- Polyglot microservices:
  - Run multiple services inside your Sealos namespace. Use VS Code tasks to start/attach. Port-forward locally for debugging.
- Data science and ML:
  - Keep datasets and conda environments on PVCs; burst to GPU nodes when training; track experiments with MLFlow deployed via Sealos.
- Secure enterprise dev:
  - Keep source and secrets inside Sealos; developers connect via SSH keys or tunnels. Use org-wide base images for compliance.
- Education and workshops:
  - Provide per-student workspaces and standardized images. Students connect from their own laptops with local VS Code.
- Preview environments:
  - Spin up a workspace per branch. Integrate with CI to deploy a temporary namespace on Sealos and clean up when merged.

## Where Sealos Fits Best

Sealos shines when you want a cloud-native foundation without babysitting low-level infrastructure:

- Multi-tenant isolation via namespaces and quotas
- Persistent storage and managed databases from an app marketplace
- One-click app deployment and easy service exposure
- Kubernetes under the hood for portability and scale
- Optional GPU support depending on the cluster

Explore Sealos at https://sealos.io for documentation, product updates, and examples.

## A Minimal End-to-End Flow

To recap, here’s a concise checklist for getting productive quickly:

1. Create a namespace in Sealos and allocate resources.
2. Launch a dev workspace:
   - Choose an image, attach a 20–100 GiB PVC for code and caches, allocate 2–8 vCPU and 4–16 GiB RAM.
3. Secure access:
   - Install openssh-server and create a non-root user with your SSH key, or install the VS Code CLI and start a tunnel.
4. Connect from local VS Code:
   - Remote - SSH to the workspace or Remote Tunnels. Verify code editing and terminal work.
5. Add services:
   - Deploy Postgres/Redis or other dependencies via the Sealos app marketplace; connect via cluster DNS.
6. Iterate:
   - Clone repos, install dependencies, run tests, debug. Use port-forwarding for local browser testing.
7. Persist and scale:
   - Keep data on PVCs, adjust resource limits as needed, and snapshot periodically.

## Conclusion

Headless development merges the best of both worlds: your local VS Code experience and the power, consistency, and security of a cloud backend. With Sealos, you can provision durable developer workspaces, attach persistent storage, add managed services, and connect seamlessly via SSH or tunnels. The result is faster builds and tests, easier onboarding, consistent environments, and the freedom to work from any device.

Whether you’re building microservices, training models, or teaching a class, Sealos provides the cloud operating system pieces—Kubernetes, storage, networking, and apps—so you can focus on shipping code. Start with a small workspace, connect your local VS Code, and scale as your needs grow.
