---
title: 'Beyond kubectl apply: 5 GitOps Best Practices for Production-Ready CI/CD on Sealos'
slug: 'beyond-kubectl-apply-5-gitops-best-practices-for-production-ready-ci-cd-on-sealos'
category: 'best-practices'
imageTitle: 'GitOps Best Practices on Sealos'
description: 'This article outlines five practical GitOps best practices to achieve production-ready CI/CD on Sealos, with actionable guidance on adoption, automation, and reliability. Implementing these patterns helps teams ship faster while maintaining safety and compliance.'
date: 2025-10-25
tags: ['gitops', 'ci-cd', 'sealos', 'production-readiness', 'best-practices']
authors: ['default']
---

If you've worked with Kubernetes, the command `kubectl apply -f deployment.yaml` is likely etched into your muscle memory. It's the trusty hammer in your toolbox—simple, direct, and effective for getting an application running. But as you move from a development sandbox to the high-stakes world of production, you quickly realize that relying on manual `kubectl` commands is like building a skyscraper with that same hammer. It's slow, error-prone, lacks an audit trail, and simply doesn't scale.

This is where GitOps comes in. It's a transformative paradigm for continuous delivery that uses Git as the single source of truth for declarative infrastructure and applications. By defining your entire system in a Git repository, you unlock powerful workflows for automated, secure, and auditable deployments.

But simply pointing a GitOps tool at a repository of YAML files is just the beginning. To truly harness its power for production environments, you need to move beyond the basics. This article explores five essential best practices that will elevate your GitOps strategy from a simple proof-of-concept to a robust, production-ready CI/CD machine, and how a platform like [Sealos](https://sealos.io) can accelerate this journey.

### First, a Quick GitOps Refresher

Before diving into the best practices, let's briefly recap the core principle of GitOps.

> **GitOps:** A model for continuous deployment where Git is the central source of truth. The desired state of your entire system (applications, infrastructure, configuration) is declared in a Git repository. An automated agent running in your Kubernetes cluster continuously monitors this repository and reconciles the live state of the cluster to match the state defined in Git.

**The typical workflow looks like this:**

1.  A developer pushes a change to the application's configuration in a Git repository.
2.  This change is reviewed and merged via a standard Pull Request (PR).
3.  A GitOps operator (like Argo CD or Flux) running in the cluster detects the change in the Git repository.
4.  The operator automatically applies the necessary changes to the cluster to match the new desired state.

This process ensures every change is version-controlled, reviewed, and automatically applied, creating a reliable and transparent "digital paper trail" for your entire system.

---

## 1. Structure Your Git Repositories for Clarity and Scale

One of the first and most critical decisions in your GitOps journey is how to structure your repositories. A poorly organized repo can become a tangled mess of conflicting configurations, making it difficult to manage environments and track changes. The two primary approaches are the monorepo and the polyrepo.

#### Monorepo vs. Polyrepo

| Approach     | Description                                                                                                                                                       | Pros                                                                                                                                                                       | Cons                                                                                                                                         |
| :----------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **Monorepo** | A single Git repository contains both your application source code and your Kubernetes deployment manifests.                                                      | - Atomic commits across app code and config.<br>- Simplified dependency management.<br>- Easier for small teams to get started.                                            | - Can become slow and unwieldy.<br>- Complex CI/CD pipeline configuration.<br>- Tightly couples app lifecycle with infrastructure lifecycle. |
| **Polyrepo** | Separate repositories are used for application source code and deployment configurations. This is the most common and recommended approach for production GitOps. | - Clear separation of concerns.<br>- Independent lifecycles for app and infra.<br>- Better access control and security.<br>- Scales well with multiple teams and services. | - Cross-repository changes require coordination.<br>- Can lead to repository sprawl if not managed.                                          |

**Best Practice:** For most production use cases, **adopt a polyrepo strategy with a dedicated configuration repository.**

This means you'll have:

- **Application Repositories:** One or more repos containing the source code for your microservices. The CI pipeline here is responsible for building, testing, and pushing a container image to a registry.
- **Configuration Repository (The "GitOps Repo"):** A single repository that declaratively defines the desired state of your entire cluster, including all applications and their configurations for different environments.

A common and effective structure for your configuration repository uses environment-specific branches or directories.

#### Example: Environment-per-Branch Strategy

In this model, each long-lived branch corresponds to an environment:

- `dev`: The state of the development environment.
- `staging`: The state of the staging/testing environment.
- `main` (or `prod`): The state of the production environment. This branch should be heavily protected.

Changes are promoted from one environment to the next by creating Pull Requests between these branches (e.g., a PR from `dev` to `staging`).

## 2. Implement a Promotion Pipeline via Pull Requests

With your repository structure in place, the next step is to define how changes move from development to production. Manual `git merge` commands are a recipe for disaster. Instead, you should enforce a strict promotion pipeline built around Pull Requests (PRs).

This process turns Git into a powerful workflow engine for change management.

### The Promotion Workflow

1.  **Change Initiation:** A developer wants to deploy a new version of an application. They create a new branch from `dev` in the configuration repository and update the relevant YAML file (e.g., changing the image tag in a `Deployment` manifest).
2.  **PR to Staging:** The developer opens a PR from their feature branch to the `staging` branch. This is the crucial first gate.
3.  **Automated Checks:** The PR triggers a series of automated checks:
    - **Linting:** Ensure YAML files are well-formed.
    - **Validation:** Use tools like `kubeval` or `conftest` to validate manifests against Kubernetes schemas or custom policies (e.g., "all deployments must have resource limits").
    - **Security Scans:** Scan manifests for security misconfigurations.
4.  **Review and Merge to Staging:** Once checks pass, the team reviews the PR. Upon approval, it's merged into the `staging` branch. The GitOps operator sees the update and deploys the change to the staging cluster.
5.  **Testing in Staging:** The application is now live in the staging environment for automated end-to-end tests, QA, and performance testing.
6.  **PR to Production:** After successful validation in staging, a new PR is opened from the `staging` branch to the `main` branch.
7.  **Final Approval and Merge to Production:** This PR requires stricter review, often from senior engineers or team leads. Once approved and merged, the GitOps operator deploys the change to the production cluster.

This PR-based flow provides full traceability. Every change to production is linked to a reviewed, approved, and tested PR, giving you a complete audit log of who changed what, when, and why.

## 3. Manage Secrets Securely (Don't `base64` and Chill)

This is non-negotiable for production. Committing plain-text or even `base64` encoded Kubernetes `Secret` manifests to Git is a major security vulnerability. Anyone with read access to the repository can easily decode them.

You need a robust solution for managing secrets that integrates with the GitOps workflow. The goal is to be able to safely commit an encrypted version of your secrets to Git, with decryption happening only inside the cluster.

### Popular Solutions for GitOps Secrets Management

- **Sealed Secrets:** A popular open-source solution from Bitnami. It works by using a public/private key pair.

  - A controller in the cluster holds the private key.
  - You use a CLI tool (`kubeseal`) with the public key to encrypt your standard Kubernetes `Secret` into a `SealedSecret` custom resource.
  - You can safely commit this `SealedSecret` manifest to your Git repository.
  - The controller in the cluster detects the `SealedSecret` and decrypts it into a regular `Secret` that your applications can use.

  ```yaml
  # This is a SealedSecret manifest - it's safe to commit to Git
  apiVersion: bitnami.com/v1alpha1
  kind: SealedSecret
  metadata:
    name: my-database-secret
    namespace: production
  spec:
    encryptedData:
      password: AgB...[long encrypted string]...
      username: AgB...[another long encrypted string]...
    template:
      metadata:
        name: my-database-secret
        namespace: production
  ```

- **External Secret Operators:** Tools like the [External Secrets Operator](https://external-secrets.io/) or HashiCorp Vault integrations allow you to store secrets in a dedicated secrets manager (like AWS Secrets Manager, Google Secret Manager, Azure Key Vault, or HashiCorp Vault).
  - You commit a manifest to Git that _references_ the secret in the external manager.
  - An operator in the cluster reads this manifest, fetches the secret from the external manager, and injects it as a standard Kubernetes `Secret`.

**Best Practice:** Choose a secrets management strategy early. **Sealed Secrets** is an excellent starting point due to its simplicity and tight integration with the Kubernetes ecosystem. For more complex needs or existing investment in cloud secret managers, the External Secrets Operator is a powerful choice.

## 4. Automate Image Updates and Rollbacks

A common friction point in GitOps is updating the application version. The CI pipeline for your application builds a new image and pushes it to a registry (e.g., `myapp:v1.2.1`). But how does the configuration repository get updated with this new image tag?

Manually creating a PR to bump the image tag is tedious and breaks the "continuous" flow of CI/CD. The solution is to automate this process.

### Automating Image Tag Updates

Tools like **Argo CD Image Updater** or **Flux Image Automation Controller** are designed for this. They act as a bridge between your container registry and your GitOps repository.

**The automated workflow:**

1.  Your application's CI pipeline builds and pushes a new image, `myapp:v1.2.1`, to your registry.
2.  The Image Updater tool, which is configured to monitor that image repository, detects the new tag.
3.  Based on a defined policy (e.g., update on any new semantic version), the tool automatically clones the configuration repository, updates the image tag in the correct YAML file, and commits the change.
4.  It then pushes this commit back to the repository, often directly to the `dev` branch or by creating a new PR.

This closes the loop, creating a fully automated pipeline from `git push` in the application repo to a deployment in your development environment.

### The Power of `git revert` for Rollbacks

One of the most elegant benefits of GitOps is how it simplifies rollbacks. If a deployment to production introduces a bug, you don't need to scramble with `kubectl` commands. The fix is simple, safe, and audited:

> **To roll back, you just revert the problematic commit in your Git repository.**

`git revert <commit-hash>`

Once the revert commit is pushed to the `main` branch, the GitOps operator will see that the desired state has changed back to the previous version and automatically roll back the application in the cluster. It's that simple.

## 5. Embrace Progressive Delivery for Risk Mitigation

Deploying directly to 100% of your production traffic is risky, no matter how much you've tested in staging. A single bug can cause a major outage. Progressive Delivery is an advanced practice that mitigates this risk by gradually exposing a new version to users.

The two most common patterns are:

- **Canary Releases:** A new version of the application is deployed alongside the stable version, and a small percentage of live traffic (e.g., 5%) is routed to it. You monitor key metrics like error rates and latency. If the new version performs well, you gradually increase its traffic until it handles 100%, at which point the old version is retired.
- **Blue-Green Deployments:** The new version ("green") is deployed alongside the old version ("blue"), but it doesn't receive any live traffic initially. You can run final tests against the green environment. When you're ready, you switch the router to send 100% of traffic from the blue version to the green version. This makes rollbacks nearly instantaneous—you just switch the router back.

### Implementing Progressive Delivery in GitOps

Implementing this requires more than just a GitOps operator. You typically need a combination of:

- **A Service Mesh (like Istio or Linkerd) or a smart Ingress Controller (like NGINX or Traefik):** These tools control the traffic routing between different versions of your application.
- **A Progressive Delivery Operator (like [Argo Rollouts](https://argo-rollouts.readthedocs.io/en/stable/) or [Flagger](https://flagger.app/)):** These operators extend Kubernetes `Deployments` with advanced deployment strategies. They automate the process of a canary release by gradually shifting traffic and monitoring metrics from a provider like Prometheus. If metrics degrade, they automatically roll back the deployment.

With Argo Rollouts, for example, you would replace your `Deployment` object with a `Rollout` object in your GitOps repository. The operator then takes over, orchestrating the complex traffic shifting and analysis for you.

---

## Putting It All Together on Sealos

Implementing these best practices requires a solid Kubernetes foundation. Managing, securing, and scaling a production-grade Kubernetes cluster is a significant undertaking. This is where a cloud operating system like **Sealos** shines, by providing the robust, managed platform on which you can build your advanced GitOps workflows.

Here’s how Sealos simplifies the journey:

- **Production-Ready Kubernetes in Minutes:** Sealos allows you to deploy a highly available Kubernetes cluster on any cloud with a single command. This removes the immense operational burden of cluster lifecycle management, letting you focus on your applications and GitOps pipelines.
- **Integrated Application Management:** The **[Sealos App Launchpad](https://sealos.io/docs/guides/app-launchpad/introduction)** provides a user-friendly interface for deploying applications. You can configure it to pull from your GitOps repository, giving you a powerful UI on top of your declarative configuration. This is perfect for teams who want both the power of GitOps and the convenience of a GUI.
- **Simplified Stateful Services:** GitOps excels with stateless applications, but managing databases and other stateful services can be complex. Sealos offers managed, highly available database services (e.g., PostgreSQL, MySQL, MongoDB) that can be provisioned with a few clicks. This allows your GitOps repository to focus on your stateless application logic while Sealos handles the persistence layer.
- **The Perfect Foundation for Progressive Delivery:** To implement canary releases, you need a stable environment with a well-configured ingress controller and service mesh. Sealos provides a certified, vanilla Kubernetes experience, making it straightforward to install and manage tools like Istio, Linkerd, NGINX Ingress, and progressive delivery operators like Flagger or Argo Rollouts.

By leveraging Sealos for the underlying infrastructure, your team is free to perfect the GitOps workflows that deliver real business value, without getting bogged down in the complexities of Kubernetes administration.

## Conclusion: From Command-Line to Continuous Confidence

Moving beyond `kubectl apply` is a crucial step in maturing your cloud-native operations. By embracing GitOps, you trade imperative, error-prone commands for a declarative, auditable, and automated system that brings stability and velocity to your development lifecycle.

By implementing these five best practices, you can build a truly production-ready CI/CD system:

1.  **Structure your repos** for a clear separation of concerns.
2.  Use a **PR-based promotion pipeline** for audited change management.
3.  **Manage secrets securely** by encrypting them before they ever touch Git.
4.  **Automate image updates** to close the loop between CI and CD.
5.  Adopt **progressive delivery** to deploy with confidence and minimize risk.

This journey may seem complex, but platforms like Sealos abstract away the infrastructural heavy lifting, making it easier than ever to build these sophisticated, powerful, and reliable deployment systems. The result is less time fighting fires and more time delivering value—the ultimate goal of any modern engineering team.
