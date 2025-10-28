---
title: 'What is GitOps? A Beginner''s Guide to "Push-to-Deploy" Workflows'
slug: 'what-is-gitops-a-beginners-guide-to-push-to-deploy-workflows'
category: 'what-is'
imageTitle: 'GitOps Beginners Guide'
description: 'Explore the fundamentals of GitOps and how push-to-deploy workflows automate infrastructure and application delivery. This beginner-friendly guide covers core concepts, tooling, and practical patterns.'
date: 2025-10-18
tags:
  [
    'GitOps',
    'Push-to-Deploy',
    'Continuous Deployment',
    'DevOps',
    'Infrastructure as Code',
    'Kubernetes',
  ]
authors: ['default']
---

Ever pushed a change to production and held your breath, hoping nothing breaks? Or spent hours debugging an issue only to find the staging environment was subtly different from production? You're not alone. Managing modern, cloud-native infrastructure is complex. Environments drift, manual deployments are error-prone, and tracking who changed what, when, and why can feel like a detective story.

What if there was a better way? What if you could manage your entire infrastructure with the same rigor, transparency, and collaboration you use for your application code? What if a simple `git push` could securely and reliably update your applications and infrastructure?

This is the promise of **GitOps**. It’s a powerful operational framework that takes the best practices from DevOps—like version control, collaboration, and CI/CD automation—and applies them directly to infrastructure management. By making Git the single source of truth for your entire system, GitOps provides a clear, auditable, and automated path from code to cluster.

This guide will demystify GitOps. We'll explore what it is, why it's transforming modern operations, how it works, and how you can get started on your journey to a more stable, secure, and efficient "push-to-deploy" workflow.

## What is GitOps? The Core Concept

At its heart, GitOps is a paradigm for managing infrastructure and applications where the desired state of the entire system is declaratively defined and version-controlled in a Git repository.

Let's break that down:

- **Declarative:** Instead of writing scripts that say _how_ to achieve a state (imperative), you create configuration files (like Kubernetes YAML) that describe _what_ the final state should look like. For example, "I want three replicas of my web server running version 1.2."
- **Version-Controlled in Git:** These declarative files live in a Git repository. This makes Git the **single source of truth**. The state defined in the `main` branch is the state that should be live in production.
- **Automated Reconciliation:** A software agent constantly compares the live state of your infrastructure (e.g., your Kubernetes cluster) with the desired state in the Git repository. If there's a difference (a "drift"), the agent automatically updates the live environment to match the repository.

Think of it like a thermostat. You declaratively set the desired temperature (the state in Git). The thermostat (the GitOps agent) constantly monitors the room's actual temperature (the live system state) and automatically turns the heat or AC on or off to match your desired setting. You don't tell it _how_ to heat the room; you just declare the result you want.

## The Four Principles of GitOps

The concept of GitOps was first formalized by Weaveworks, who outlined four key principles that define a true GitOps workflow.

#### 1. The Entire System is Described Declaratively

As mentioned, all resources—infrastructure, networking, monitoring, and applications—are defined in a declarative format. For Kubernetes users, this typically means YAML manifests. For infrastructure, it could be Terraform or CloudFormation files. This approach is crucial because it provides an unambiguous description of the system that both humans and machines can understand.

#### 2. The Canonical Desired System State is Versioned in Git

Git is the ultimate source of truth. If you want to deploy a new application, scale a service, or change a configuration, you don't SSH into a server or use a manual dashboard. You make a change to the configuration file and submit a pull request. This leverages Git's powerful features for operations:

- **Audit Trail:** A complete history of every change, who made it, and why.
- **Rollbacks:** A bad deployment can be reverted with a single `git revert` command.
- **Collaboration:** Pull requests enable peer review and discussion for infrastructure changes, just like application code.

#### 3. Approved Changes are Automatically Applied to the System

Once changes are approved and merged into the target branch (e.g., `main`), they are automatically applied to the live environment. This is handled by a software agent that syncs the state from the Git repository to the cluster. This automated process removes the need for manual `kubectl apply` commands or direct cluster credentials in your CI pipeline, reducing the risk of human error.

#### 4. Software Agents Ensure Correctness and Alert on Divergence

A GitOps agent continuously runs inside your environment, acting as a control loop. Its job is twofold:

- **Ensure Correctness:** It constantly compares the live system state against the desired state in Git.
- **Alert on Divergence:** If the live state ever drifts from the Git state (e.g., due to a manual, out-of-band change), the agent can either automatically correct it (self-healing) or alert the team to the discrepancy. This closes the loop and guarantees that your Git repository is a true reflection of your running infrastructure.

## How Does GitOps Work? A Step-by-Step Workflow

Let's walk through a typical GitOps workflow for a developer wanting to deploy a new version of an application.

1.  **Code Change:** A developer makes a change to the application code and pushes it to the _application code repository_.
2.  **Continuous Integration (CI):** This push triggers a CI pipeline (e.g., using Jenkins, GitLab CI, or GitHub Actions). The pipeline runs tests, builds a new container image, and pushes it to a container registry (like Docker Hub or Harbor). The image is tagged with a unique identifier, often the Git commit hash.
3.  **Configuration Update:** Here's the key GitOps step. The CI pipeline (or a dedicated tool) automatically creates a commit in a separate _configuration repository_. This commit updates the Kubernetes manifest file, changing the `image` tag to point to the new container image built in the previous step.
4.  **Pull Request and Merge:** The change is submitted as a pull request to the configuration repository. The operations team or senior developers review the proposed change (e.g., deploying image `v1.2.1` to production), approve it, and merge it into the `main` branch.
5.  **GitOps Agent Detection:** A GitOps agent (like Argo CD or Flux), running inside the Kubernetes cluster, is configured to watch the configuration repository. It detects that the `main` branch has been updated.
6.  **Reconciliation:** The agent compares the new manifests in Git with the resources currently running in the cluster. It sees that the running deployment is using the old image tag, while the Git repository specifies the new one.
7.  **Deployment:** The agent "pulls" the change and applies it to the cluster, triggering a rolling update of the application to the new version. The live state now matches the desired state in Git.

This entire process, from merging the pull request to the live deployment, happens automatically, securely, and with a full audit trail.

## Push vs. Pull: Two Flavors of GitOps

There are two primary models for how changes get from Git to the cluster. The pull-based model is generally considered the more secure and robust approach.

### Pull-Based GitOps (Agent-driven)

This is the model described in the workflow above and is considered the canonical approach.

- **How it works:** An operator (agent) runs inside the Kubernetes cluster. It periodically "pulls" from the Git repository to check for new commits. If it finds any, it applies the changes to the cluster from within.
- **Pros:**
  - **High Security:** Cluster credentials are not exposed outside the cluster boundary. The agent only needs read-only access to the Git repository.
  - **Drift Detection:** Because the agent lives in the cluster, it can constantly monitor for any differences between the desired and actual states.
  - **Scalability:** Each cluster manages its own state, making it easy to manage many clusters from a central set of configuration repositories.

### Push-Based GitOps (CI-driven)

This is an older model that is simpler to set up but has significant drawbacks.

- **How it works:** The CI/CD pipeline (e.g., Jenkins) is responsible for _pushing_ changes directly to the Kubernetes cluster after a change is merged in Git.
- **Cons:**
  - **Lower Security:** The CI system needs direct administrative access to the Kubernetes cluster. This exposes powerful credentials outside the cluster, widening the attack surface.
  - **No Drift Detection:** The CI pipeline only acts when a change is pushed. It has no awareness of the cluster's state at other times and cannot detect or correct manual changes.

| Feature             | Pull-Based Model (Recommended)                                 | Push-Based Model                                           |
| :------------------ | :------------------------------------------------------------- | :--------------------------------------------------------- |
| **Trigger**         | Agent inside the cluster pulls changes.                        | CI pipeline outside the cluster pushes changes.            |
| **Security**        | **High.** Cluster credentials remain within the cluster.       | **Lower.** CI system requires admin access to the cluster. |
| **Drift Detection** | **Yes.** The agent constantly compares live vs. desired state. | **No.** The pipeline is unaware of out-of-band changes.    |
| **Scalability**     | Excellent for managing multiple clusters.                      | Can become complex and fragile at scale.                   |
| **Key Tools**       | Argo CD, Flux CD                                               | Jenkins, GitLab CI (with custom scripts)                   |

## Why Adopt GitOps? The Key Benefits

Adopting GitOps isn't just about following a trend; it delivers tangible business and technical advantages.

#### Increased Developer Velocity

By automating the deployment pipeline, developers can release features faster and more independently. The "push-to-deploy" workflow means that once their code is tested and their configuration PR is merged, their work is done. They don't need to learn `kubectl` or wait for an operations team to perform a manual deployment.

#### Enhanced Security and Compliance

GitOps creates an unbreakable audit log. Every change to the production environment is tied to a Git commit, which is tied to a pull request and an author. This makes security audits and compliance checks straightforward. Furthermore, by limiting direct cluster access and using the pull-based model, you dramatically reduce the risk of unauthorized changes.

#### Improved Reliability and Stability

- **Mean Time to Recovery (MTTR):** When a bad deployment occurs, recovery is as fast and simple as `git revert`. This rolls the system back to the last known good state, and the GitOps agent handles the rest.
- **Disaster Recovery:** If a cluster is completely lost, you can bring up a new one and simply point your GitOps agent at the configuration repository. The agent will rebuild the entire environment from scratch based on the declarative manifests.

#### Greater Transparency and Collaboration

With the entire system state visible in Git, everyone on the team—developers, operations, and security—can see what's running, what has changed, and what's planned. Using pull requests for infrastructure changes fosters a culture of review and collaboration, catching potential issues before they reach production.

## Popular GitOps Tools and Platforms

The GitOps ecosystem has matured rapidly, with two main projects leading the way in the Cloud Native Computing Foundation (CNCF).

- **Argo CD:** A declarative, GitOps continuous delivery tool for Kubernetes. It is known for its powerful web UI, which provides a fantastic real-time visualization of application status and the differences between the live and desired states. It's very application-centric and easy for teams to adopt.
- **Flux CD:** A toolkit for keeping Kubernetes clusters in sync with sources of configuration (like Git repositories) and automating updates to configuration when there is new code to deploy. Flux is known for its modular, "do one thing well" approach and deep integration into the Kubernetes ecosystem.

### Simplifying the Foundation for GitOps with Sealos

Before you can even start with GitOps, you need a stable, running Kubernetes cluster. Setting up and managing Kubernetes can be a significant hurdle, involving complex networking, certificate management, and node provisioning.

This is where a platform like **Sealos** can be invaluable. Sealos is a cloud operating system that radically simplifies the deployment and management of high-availability Kubernetes clusters, whether on-premise or in the cloud.

With Sealos, you can get a production-ready Kubernetes cluster running in minutes. This provides the perfect, solid foundation on top of which you can layer your GitOps tools. Instead of wrestling with `kubeadm` or complex installation scripts, you can use Sealos to handle the cluster lifecycle, allowing your team to focus on what matters: implementing a robust GitOps workflow with tools like Argo CD or Flux.

## Getting Started with Your First GitOps Workflow

Ready to dip your toes in the water? Here’s a high-level roadmap to get started.

1.  **Prerequisites:**

    - A Kubernetes cluster. (As mentioned, using a tool like [Sealos](https://sealos.io) can make this the easiest step).
    - A Git repository for your application code.
    - A separate Git repository for your Kubernetes configuration manifests.
    - A container registry to store your application images.

2.  **Choose and Install a GitOps Tool:** Select an agent like Argo CD or Flux. Follow their official documentation to install the agent into your Kubernetes cluster. This is typically a one-time setup.

3.  **Structure Your Repositories:** Create a new Git repository for your configuration. Inside, create a directory for your first application.

4.  **Create Your First Application Manifest:** Add a Kubernetes manifest file (e.g., `deployment.yaml`) to your configuration repository. This file will declaratively define your application.

    ```yaml
    # my-app/deployment.yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: my-nginx-app
    spec:
      replicas: 2 # Start with two replicas
      selector:
        matchLabels:
          app: nginx
      template:
        metadata:
          labels:
            app: nginx
        spec:
          containers:
            - name: nginx
              image: nginx:1.21.6 # A specific, pinned version
              ports:
                - containerPort: 80
    ```

5.  **Connect the Agent to Your Repo:** Configure your GitOps agent (e.g., via the Argo CD UI or a Flux Kustomization object) to watch your configuration repository and the specific path where your application manifest lives.

6.  **Watch the Magic:** As soon as you configure the agent, it will pull the manifest from Git and deploy your Nginx application to the cluster. You can use `kubectl get deployments` to see it running.

7.  **Make a Change:** Now, for the real test. Edit the `deployment.yaml` file in your Git repository. Change `replicas: 2` to `replicas: 3`. Commit and push the change to your `main` branch.

Within a few moments, without any manual intervention, you will see your GitOps agent detect the change and scale your deployment. You'll now have three Nginx pods running in your cluster. You have just completed your first GitOps loop!

## Conclusion: GitOps is the Future of Operations

GitOps is more than just a buzzword; it represents a fundamental shift towards a more automated, reliable, and secure model for managing cloud-native systems. By establishing Git as the single source of truth, you unlock powerful workflows that increase developer velocity, strengthen security, and dramatically improve system stability.

The journey starts with understanding the core principles: a declarative system state, versioned in Git, with changes automatically applied and reconciled by software agents. By embracing this model, you can finally tame the complexity of modern infrastructure, eliminate configuration drift, and empower your teams to build and deploy with confidence. The "push-to-deploy" future is here, and it's version-controlled.
