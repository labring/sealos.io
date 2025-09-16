---
title: 'GitOps on Autopilot: Implementing a CI/CD Pipeline with Sealos and GitHub Actions'
imageTitle: 'GitOps on Autopilot: Sealos & GitHub Actions'
description: 'Explore how to automate CI/CD with GitOps using Sealos and GitHub Actions. This guide covers pipeline setup, deployment workflows, and best practices for secure, scalable automation.'
date: 2025-09-03
tags: ['GitOps', 'CI/CD', 'Sealos', 'GitHub Actions', 'Automation', 'DevOps']
authors: ['default']
---

Software delivery shouldn’t depend on late-night kubectl commands, manual edits, or tribal knowledge. You commit code, a robot does the rest. That’s the promise of GitOps—your cluster simply reflects what’s declared in Git, while automated pipelines handle the “how.” In this article, we’ll build a practical GitOps pipeline that pairs Sealos (a cloud operating system built on Kubernetes) with GitHub Actions and Argo CD to put your deployments on autopilot.

You’ll learn what GitOps is, why it matters, how the pieces fit together, and how to implement a real-world setup with multi-environment promotion, image scanning, and optional self-hosted GitHub runners on your Sealos cluster.

---

## What Is GitOps?

GitOps is an operational model where Git is the single source of truth for both application code and the desired state of your infrastructure and applications. Instead of running imperative commands to change environments, you declaratively define the desired state in Git and let a controller (e.g., Argo CD) reconcile your cluster to match that state.

Key ideas:

- Declarative definitions: Everything from Deployments to Ingress is expressed in code (YAML, Helm charts, Kustomize overlays).
- Pull-based reconciliation: A controller continuously watches Git and converges your cluster toward the specified state.
- Versioned, auditable changes: Every change is a Git commit or pull request, providing traceability and rollbacks.

Think of GitOps as an “autopilot” for your Kubernetes clusters—consistent, auditable, and repeatable.

---

## Why Sealos and GitHub Actions?

- Sealos: Sealos is a cloud operating system built around Kubernetes. It simplifies running and managing clusters, multi-tenancy, and platform services on top of Kubernetes. You can run it yourself or use Sealos-hosted options to quickly provision a cluster and manage apps.
- GitHub Actions: A powerful CI platform that integrates tightly with GitHub, supports reusable workflows, and scales from hobby to enterprise use cases.

Together with Argo CD (for continuous delivery), this stack gives you:

- End-to-end automation: Build, test, package, and deliver via GitHub Actions, then deploy via Argo CD.
- Clear separation of concerns: App repo for code, config repo for environment manifests.
- Repeatability and security: PR-based changes, signed container images (optional), and policy enforcement.

---

## Architecture Overview

We’ll implement a two-repo GitOps setup with Argo CD reconciling your Sealos cluster:

- App repository (e.g., my-org/demo-app)

  - Source code
  - Dockerfile
  - CI workflow to build/test and push images to a registry (e.g., GHCR)
  - A job to update the config repository with the new image tag

- Config repository (e.g., my-org/demo-config)

  - Kustomize or Helm definitions
  - Environments: dev, staging, prod (as folders)
  - Argo CD Application manifests referencing these folders

- Sealos cluster
  - Kubernetes cluster where your apps run
  - Argo CD installed; Auto-sync enabled
  - Optional: Ingress, secrets management (Sealed Secrets/External Secrets), policy, observability

Flow:

1. Developer merges code to main in the app repo.
2. GitHub Actions builds a container image, pushes it to GHCR, and creates a PR to bump the image tag in the config repo (for dev).
3. Argo CD sees the updated config repo and synchronizes the Sealos cluster.
4. Promotion from dev → staging → prod is performed via PRs in the config repo.

---

## Prerequisites

- A running Sealos-based Kubernetes cluster and access to its kubeconfig.
- kubectl installed locally and configured for your cluster.
- GitHub repositories:
  - One for the application code
  - One for Kubernetes manifests/config
- Container registry access (GHCR is convenient with GitHub Actions).
- Basic familiarity with Kubernetes and GitHub Actions.

Note: If you’re using a hosted Sealos platform, you can create a Kubernetes cluster and download the kubeconfig through the Sealos console. If self-hosting Sealos, follow the official documentation to provision the cluster, then verify access with:

```
kubectl get nodes
```

---

## Step 1: Create the App Repo

For illustration, we’ll use a minimal Node.js service.

### Example: Node.js App

server.js:

```js
const http = require('http');
const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
  res.end(`Hello from GitOps! Version: ${process.env.VERSION || 'dev'}`);
});
server.listen(port, () => console.log(`Listening on ${port}`));
```

package.json:

```json
{
  "name": "gitops-demo",
  "version": "1.0.0",
  "main": "server.js",
  "license": "MIT",
  "scripts": {
    "start": "node server.js",
    "test": "node -e \"process.exit(0)\""
  }
}
```

Dockerfile:

```
FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
```

Build locally to test:

```
docker build -t ghcr.io/<your-org>/gitops-demo:dev .
docker run -p 3000:3000 ghcr.io/<your-org>/gitops-demo:dev
```

---

## Step 2: Create the Config Repo with Kustomize

Structure your config repo like this:

```
demo-config/
  base/
    deployment.yaml
    service.yaml
    kustomization.yaml
  environments/
    dev/
      kustomization.yaml
    staging/
      kustomization.yaml
    prod/
      kustomization.yaml
  argocd/
    app-dev.yaml
    app-staging.yaml
    app-prod.yaml
```

### Base manifests

base/deployment.yaml:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gitops-demo
spec:
  replicas: 2
  selector:
    matchLabels:
      app: gitops-demo
  template:
    metadata:
      labels:
        app: gitops-demo
    spec:
      containers:
        - name: app
          image: ghcr.io/your-org/gitops-demo:latest
          env:
            - name: VERSION
              value: 'latest'
          ports:
            - containerPort: 3000
          readinessProbe:
            httpGet:
              path: /
              port: 3000
          livenessProbe:
            httpGet:
              path: /
              port: 3000
```

base/service.yaml:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: gitops-demo
spec:
  selector:
    app: gitops-demo
  ports:
    - port: 80
      targetPort: 3000
      protocol: TCP
```

base/kustomization.yaml:

```yaml
resources:
  - deployment.yaml
  - service.yaml

images:
  - name: ghcr.io/your-org/gitops-demo
    newTag: latest
```

### Environment overlays

environments/dev/kustomization.yaml:

```yaml
resources:
  - ../../base
namePrefix: dev-
images:
  - name: ghcr.io/your-org/gitops-demo
    newTag: dev
configMapGenerator:
  - name: app-config
    literals:
      - ENV=dev
```

environments/staging/kustomization.yaml:

```yaml
resources:
  - ../../base
namePrefix: stg-
images:
  - name: ghcr.io/your-org/gitops-demo
    newTag: staging
configMapGenerator:
  - name: app-config
    literals:
      - ENV=staging
```

environments/prod/kustomization.yaml:

```yaml
resources:
  - ../../base
namePrefix: prod-
images:
  - name: ghcr.io/your-org/gitops-demo
    newTag: stable
configMapGenerator:
  - name: app-config
    literals:
      - ENV=prod
```

Note: Argo CD will apply these overlays per environment. Our CI will update the image tags for each environment via PRs.

---

## Step 3: Install Argo CD on Sealos

Install Argo CD on your Sealos Kubernetes cluster:

```
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

Wait until all pods are ready:

```
kubectl -n argocd rollout status deploy/argocd-server
```

To access the Argo CD UI (for initial setup), you can port-forward:

```
kubectl -n argocd port-forward svc/argocd-server 8080:80
```

Default admin password (on initial install) can be obtained from:

```
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

For production, configure a proper Ingress and SSO/OIDC. Ensure network access is secured.

---

## Step 4: Bootstrap Argo CD Applications

Create Argo CD Applications that point to your config repo’s environment folders. Example for dev:

argocd/app-dev.yaml:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: demo-dev
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/demo-config.git
    targetRevision: main
    path: environments/dev
  destination:
    server: https://kubernetes.default.svc
    namespace: demo-dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

Apply it:

```
kubectl apply -f argocd/app-dev.yaml
```

Repeat for staging and prod (change name, namespace, and path accordingly).

---

## Step 5: Configure GitHub Actions for CI

In your app repository, add a workflow to build, test, and push images to GHCR, then propose a change in the config repo to bump the image tag for the dev environment.

.github/workflows/ci.yml:

```yaml
name: CI

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  packages: write
  id-token: write
  pull-requests: write

env:
  IMAGE_NAME: ghcr.io/your-org/gitops-demo

jobs:
  build-test-push:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout app
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=,suffix=,format=short
            type=raw,value=dev

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}

      - name: Set IMAGE_TAG env
        run: echo "IMAGE_TAG=${GITHUB_SHA::7}" >> $GITHUB_ENV

      - name: Checkout config repo
        uses: actions/checkout@v4
        with:
          repository: your-org/demo-config
          token: ${{ secrets.CONFIG_REPO_TOKEN }}
          path: demo-config

      - name: Update dev image tag with yq
        run: |
          cd demo-config/environments/dev
          wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/download/v4.44.2/yq_linux_amd64
          chmod +x /usr/local/bin/yq
          yq -i '.images[] |= select(.name == "ghcr.io/your-org/gitops-demo").newTag = env(IMAGE_TAG)' kustomization.yaml

      - name: Create PR to config repo
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.CONFIG_REPO_TOKEN }}
          commit-message: 'chore(dev): bump image to ${{ env.IMAGE_TAG }}'
          title: 'Promote dev image to ${{ env.IMAGE_TAG }}'
          body: 'Automated update from CI. This will trigger Argo CD to deploy to dev.'
          branch: ci/bump-dev-${{ env.IMAGE_TAG }}
          base: main
          path: demo-config
```

Notes:

- The workflow uses the GitHub-provided GITHUB_TOKEN for pushing to GHCR. Ensure packages: write permission is enabled.
- To create PRs in the config repo, you typically need a token with repo write permissions. Use CONFIG_REPO_TOKEN as a repository secret in the app repo (preferably from a GitHub App or a fine-scoped PAT).
- This creates a PR for dev. For staging/prod, promotion should be manual via PRs in the config repo to keep control.

---

## Step 6: Argo CD Auto-sync in Sealos

Once the PR in the config repo is merged, Argo CD will:

- Detect the tag bump in environments/dev/kustomization.yaml.
- Apply changes to your Sealos cluster in the demo-dev namespace.
- Keep reconciling and self-healing as needed.

You can watch status in the Argo CD UI or via:

```
kubectl -n argocd get applications.argoproj.io
```

---

## Step 7: Expose Your Application

Depending on your Sealos cluster setup, you can expose the service via an Ingress, a LoadBalancer, or port-forwarding.

Example Ingress (if you have an Ingress controller):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gitops-demo
  annotations:
    kubernetes.io/ingress.class: nginx
spec:
  rules:
    - host: demo-dev.example.com
      http:
        paths:
          - backend:
              service:
                name: dev-gitops-demo
                port:
                  number: 80
            path: /
            pathType: Prefix
```

Add this to environments/dev as another Kustomize resource and configure DNS accordingly.

---

## Step 8: Promotion Strategy (Staging and Production)

To promote to staging:

- Create a PR in the config repo that bumps environments/staging/kustomization.yaml image tag to the tested dev image tag.
- Merge the PR → Argo CD deploys to staging.

Similarly for production:

- Controlled via PRs to environments/prod, such as bumping the tag from stable to the new version.

This PR-based promotion ensures:

- Human review gates between environments.
- Full auditability and rollback via Git history.

---

## Optional Enhancements

### 1) Self-Hosted GitHub Actions Runners on Sealos

For faster builds or private networking, run self-hosted runners in your Sealos cluster using the actions-runner-controller.

High-level steps:

- Install actions-runner-controller with Helm.
- Create a RunnerDeployment pointing at your GitHub repo/org.
- Label and scale as needed.

Example RunnerDeployment:

```yaml
apiVersion: actions.summerwind.dev/v1alpha1
kind: RunnerDeployment
metadata:
  name: demo-runners
spec:
  replicas: 2
  template:
    spec:
      repository: your-org/demo-app
      labels:
        - sealos
        - build
```

Then, change runs-on in your workflows to match the runner labels. Ensure appropriate GitHub credentials are configured per controller’s docs.

### 2) Image Scanning and Policy

- Scan images during CI using Trivy:

```yaml
- name: Trivy scan
  uses: aquasecurity/trivy-action@0.20.0
  with:
    image-ref: ${{ env.IMAGE_NAME }}:${{ env.IMAGE_TAG }}
    format: 'table'
    exit-code: '1'
    severity: 'CRITICAL,HIGH'
```

- Enforce policies with Kyverno:
  - Require signed images (with cosign).
  - Block images with critical vulnerabilities.
  - Enforce label standards.

### 3) Secret Management

Avoid storing plaintext secrets in Git:

- Sealed Secrets: Encrypt secrets in Git; decrypt in cluster.
- External Secrets Operator: Sync secrets from a secret manager (e.g., AWS Secrets Manager, Vault).

Example Sealed Secret workflow:

- Encrypt a Kubernetes Secret into a SealedSecret.
- Commit SealedSecret YAML to the config repo.
- Argo CD applies it; controller decrypts at runtime.

### 4) Progressive Delivery (Canary, Blue/Green)

Use Argo Rollouts for advanced deployment strategies:

- Canary: Gradually shift traffic while monitoring metrics.
- Blue/Green: Swap traffic between stable and new versions instantly with rollback.

Example Rollout partial spec:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: gitops-demo
spec:
  strategy:
    canary:
      steps:
        - setWeight: 25
        - pause: { duration: 60 }
        - setWeight: 50
        - pause: { duration: 120 }
        - setWeight: 100
```

### 5) Observability

Instrument your cluster:

- Prometheus + Grafana for metrics.
- Loki for logs.
- Tempo/Jaeger for traces.

Use dashboards to observe rollout health and resource consumption on Sealos.

---

## Security and Access Considerations

- Least privilege for CI:
  - Use a GitHub App or a minimal-scoped PAT for CONFIG_REPO_TOKEN.
  - If possible, use fine-grained PATs with repo and pull request scopes.
- Container registry:
  - Prefer OIDC/BYO credentials or the built-in GITHUB_TOKEN for GHCR.
  - Consider image signing with cosign and enforce verification via Kyverno or admission controllers.
- Cluster access:
  - Argo CD pulls from Git and requires no CI connectivity into the cluster—keep clusters private.
- Branch protection:
  - Protect main branches in both repos; require PR reviews and status checks.

---

## Troubleshooting Tips

- Argo CD application stuck OutOfSync:

  - Check the Application events: kubectl -n argocd describe app demo-dev
  - Ensure the path and targetRevision in Application specs are correct.
  - Verify that Argo CD has permission to create the target namespace.

- Image never updates:

  - Confirm the config repo PR merged and the new tag is in environments/dev/kustomization.yaml.
  - Verify Argo CD auto-sync is enabled.
  - Check the container image exists in the registry and is accessible by your cluster (pull secrets if needed).

- GitHub Action fails to create PR:

  - Ensure CONFIG_REPO_TOKEN has write permissions to the config repo.
  - Check branch protection rules and required checks.

- Kubernetes resources not created:
  - Ensure Kustomize overlays resolve correctly. Run locally:
    ```
    kustomize build environments/dev
    ```
  - Validate manifests with kubectl:
    ```
    kustomize build environments/dev | kubectl apply --dry-run=client -f -
    ```

---

## Putting It All Together: A Day in the Life

1. You push a change to server.js.
2. GitHub Actions builds a new image and pushes to GHCR.
3. The workflow opens a PR in the config repo to bump the dev tag to the new image.
4. You or an automated policy merges the PR.
5. Argo CD reconciles the Sealos cluster and updates dev.
6. After verification, you create a PR to bump staging, then production tags—keeping a clear audit trail of what went where and when.

No kubectl apply. No snowflake clusters. Everything is declarative, observable, and repeatable.

---

## Practical Applications

- Microservices at scale: Each service gets its own app repo and a shared config monorepo, or both split per team. Argo CD manages hundreds of Applications with app-of-apps patterns.
- Regulated environments: PR-based changes with signed commits, policies, and audit logs meet compliance requirements.
- Multi-tenant platforms: Sealos helps run isolated namespaces or tenants while keeping a unified GitOps control plane.
- Education and onboarding: New engineers learn by opening PRs rather than memorizing bespoke CLI incantations.

---

## Conclusion

GitOps turns operations into code and code into reliable delivery. By combining Sealos for Kubernetes-based cloud infrastructure, GitHub Actions for CI, and Argo CD for CD, you get a pipeline that:

- Automates deployments end to end
- Enforces consistency with Git as the source of truth
- Simplifies promotion across environments with PRs
- Improves security, auditability, and rollback

Start small—one service, one environment—then scale to multi-service, multi-environment delivery. With your GitOps autopilot engaged, you’ll spend less time firefighting and more time delivering value.
