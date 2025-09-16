---
title: 'From Localhost to Production in 15 Minutes: A Full-Stack CDE Workflow with Sealos DevBox'
imageTitle: 'Localhost to Production in 15 Minutes'
description: 'An end-to-end guide to taking a project from localhost to production in minutes using Sealos DevBox. Learn a practical full-stack CDE workflow with actionable steps and best practices.'
date: 2025-09-03
tags:
  ['cde-workflow', 'devbox', 'localhost', 'full-stack', 'deployment', 'sealos']
authors: ['default']
---

If you’ve ever said “it works on my machine,” this guide is for you. The gap between a fast local prototype and a reliable production deployment can be wide: mismatched dependencies, fragile scripts, manual database setup, secrets sprawled across machines, and CI pipelines that take days to stitch together. Cloud Development Environments (CDEs) compress that timeline.

In this article, you’ll learn how to go from localhost to production in about 15 minutes with a repeatable, modern workflow using Sealos DevBox—a CDE that runs on Kubernetes. We’ll build a simple full-stack app, add a managed PostgreSQL database, containerize it, and ship it to production with either a UI click or a single `kubectl apply`. Along the way, you’ll see how to set up preview environments per pull request and wire up CI/CD so your app continuously deploys.

Whether you’re a solo builder or part of a platform team, this is a practical blueprint you can adopt, adapt, and scale.

---

### What you’ll get

- A clear mental model for CDEs and how they reduce friction
- A concrete, time-boxed end-to-end workflow using Sealos DevBox
- Minimal but realistic examples: Node.js + PostgreSQL, Dockerfile, GitHub Actions, Kubernetes manifests
- A path to ephemeral preview environments for every pull request

---

## What is a Cloud Development Environment (CDE)?

A Cloud Development Environment is a fully-featured dev environment that runs remotely—typically inside a container or VM—with your code, dependencies, and tools pre-installed. You access it via a browser-based IDE or SSH. Crucially, CDEs plug right into the same infrastructure and network boundaries as your production platform, making “dev-prod parity” real.

Why a CDE is a big deal:

- Consistency: All developers get the same stack and versions.
- Speed: Ready-to-code environments in seconds; no local setup or OS drift.
- Security: Secrets stay in the cloud; fewer credentials on laptops.
- Collaboration: Shareable URLs for running apps, terminals, and sessions.
- Parity: Develop and test against production-like services (databases, cache) without exposing your laptop.
- Automation: Spin up ephemeral environments per branch/PR.

#### Localhost vs. CDE at a glance

| Concern        | Localhost                         | CDE (e.g., Sealos DevBox)                  |
| -------------- | --------------------------------- | ------------------------------------------ |
| Setup time     | Slow; install toolchains and SDKs | Fast; prebuilt images and templates        |
| Consistency    | Varies per machine                | Uniform across developers                  |
| Secrets        | Often stored locally              | Centralized and encrypted                  |
| Network access | Limited to local network          | Close to prod services, private networking |
| Collaboration  | Hard to share running state       | Shareable HTTPS preview URLs               |
| Cleanup        | Manual, error-prone               | Ephemeral, automated lifecycle             |

## Meet Sealos DevBox

[Sealos](https://sealos.io) is a cloud operating system built on Kubernetes. Sealos DevBox is its CDE product: a browser-accessible development workspace that runs in your own namespace on a Sealos cluster (including Sealos Cloud). It integrates with the broader Sealos ecosystem—like managed databases, object storage, app deployments, and domains—so you can go from “hello world” to a production app without leaving the platform.

Key capabilities you’ll use in this guide:

- Containerized dev workspace with VS Code in the browser and a full Linux shell
- One-click app marketplace (e.g., PostgreSQL, Redis)
- Persistent storage for your workspace
- HTTPS preview URLs for any port you expose
- Easy promotion to production with the “App” launcher or `kubectl`
- Built-in ingress and automatic TLS for subdomains

When to use DevBox:

- Spinning up a dev environment for new contributors
- Fast demos and PoCs without touching your local machine
- Branch-specific preview environments
- Secure development for sensitive projects

## The 15-Minute Full-Stack Workflow: Overview

Here’s the path we’ll take:

1. Initialize a Node.js + PostgreSQL example (2 minutes)
2. Launch a DevBox and clone your repo (2 minutes)
3. Provision a managed PostgreSQL instance from the Sealos marketplace (2 minutes)
4. Run and share your app via a preview URL (2 minutes)
5. Containerize with a minimal Dockerfile (2 minutes)
6. Build and push the image (2 minutes)
7. Deploy to production with Sealos App or `kubectl` (3 minutes)
8. Optional: Add CI/CD and preview environments (5–10 minutes, done once)

Timings are realistic once you’ve done it once or twice.

## Prerequisites

- A Sealos account (e.g., Sealos Cloud or your own Sealos cluster)
- A Git repository (GitHub, GitLab, etc.)
- Optional: Docker Hub or GHCR account for your container images
- Optional: `kubectl` and a kubeconfig for your Sealos namespace (available from the Sealos console), if you prefer CLI deployment

No local Node.js or Docker is required; DevBox provides everything.

## Step-by-Step: From Localhost to Production

### 1) Create a Minimal Full-Stack App (Node.js + PostgreSQL)

We’ll create a simple Express server that reads from PostgreSQL. You can fork or paste this into a new repo.

Files:

- package.json
- server.js
- .env.example
- .dockerignore
- Dockerfile (later)

package.json:

```json
{
  "name": "sealos-devbox-demo",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development nodemon server.js",
    "start": "node server.js",
    "migrate": "node server.js migrate"
  },
  "dependencies": {
    "express": "^4.19.2",
    "pg": "^8.11.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

server.js:

```js
import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const app = express();
const port = process.env.PORT || 3000;

const databaseUrl = process.env.DATABASE_URL || '';
const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: process.env.DB_SSL === 'true',
    })
  : null;

async function migrate() {
  if (!pool) {
    console.error('DATABASE_URL is not set');
    process.exit(1);
  }
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
    INSERT INTO items (name)
    VALUES ('Hello from PostgreSQL'), ('Sealos DevBox Rocks')
    ON CONFLICT DO NOTHING;
  `);
  console.log('Migration complete');
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' });
});

app.get('/api/items', async (req, res) => {
  if (!pool)
    return res.status(500).json({ error: 'DATABASE_URL not configured' });
  const { rows } = await pool.query(
    'SELECT id, name FROM items ORDER BY id DESC',
  );
  res.json(rows);
});

// Simple landing page
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Sealos DevBox Demo</title></head>
      <body>
        <h1>Sealos DevBox Demo</h1>
        <p>Try <a href="/api/health">/api/health</a> and <a href="/api/items">/api/items</a></p>
      </body>
    </html>
  `);
});

if (process.argv[2] === 'migrate') {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
} else {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}
```

.env.example:

```
PORT=3000
DATABASE_URL=postgres://username:password@host:5432/dbname
DB_SSL=true
```

.dockerignore:

```
node_modules
npm-debug.log
.git
.env
```

That’s enough to demonstrate a full-stack path with a database and HTTP endpoints.

### 2) Launch a Sealos DevBox and Clone Your Repo

- Log into your Sealos console.
- Create a new DevBox:
  - Choose a Node.js template or a base Ubuntu image.
  - Allocate CPU/RAM (2 vCPU / 4 GB RAM is fine) and a small persistent volume (e.g., 10 GB).
  - Launch and open the web IDE (VS Code in the browser).
- In the DevBox terminal:
  - Clone your repo: `git clone https://github.com/yourname/sealos-devbox-demo && cd sealos-devbox-demo`
  - Install deps: `npm install`

Tip: If your team standardizes DevBoxes with a preloaded image, you can cut this to seconds.

### 3) Provision PostgreSQL from the Sealos Marketplace

- Open the Sealos App/Marketplace and install PostgreSQL.
  - Select a small plan to start.
  - Wait for it to become “Running.”
- Copy the connection details:
  - Host, port, username, password, database name, SSL settings.
- In your DevBox, export environment variables (or create a `.env` file for local dev inside DevBox):

```bash
export DATABASE_URL="postgres://USER:PASSWORD@HOST:5432/DBNAME"
export DB_SSL=true
```

- Migrate the database:

```bash
npm run migrate
```

You should see “Migration complete.”

### 4) Run and Share the App

Start the server:

```bash
npm run dev
```

Expose the port:

- DevBox will detect the listening port and provide a preview URL, or you can manually expose port 3000 in the DevBox interface.
- Open the provided HTTPS URL. Visit `/` and `/api/items`.

Share the preview link with a teammate for quick feedback. This is often the “wow” moment: you’re cloud-native from the start, with no local networking hacks.

### 5) Containerize the App

Create a production-grade Dockerfile:

```
# syntax=docker/dockerfile:1

# Build stage (not actually building anything—just installing deps)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Runtime stage
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY server.js ./server.js
EXPOSE 3000
CMD ["node", "server.js"]
```

This multi-stage Dockerfile:

- Uses `npm ci` for deterministic installs
- Produces a small final image
- Exposes port 3000

Build the image locally in DevBox (optional):

```bash
docker build -t your-dockerhub-username/sealos-devbox-demo:latest .
```

If the DevBox image includes Docker-in-Docker or a build service, you can build and push directly. Otherwise, wire CI in the next step.

### 6) Build and Push the Image (GitHub Actions)

Add a GitHub Actions workflow to build on every push to main and publish to Docker Hub (or GHCR). Save this as `.github/workflows/build.yml` in your repo:

```yaml
name: build-and-push
on:
  push:
    branches: ['main']
  workflow_dispatch: {}

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Set up QEMU
        # optional for multi-arch
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: your-dockerhub-username/sealos-devbox-demo:latest
          platforms: linux/amd64
```

Create the Docker Hub credentials as GitHub repo secrets. Replace the image name with GHCR if you prefer.

Once this runs, your image is available for deployment.

### 7) Deploy to Production on Sealos

You have two easy options: click-based and YAML-based.

#### Option A: Deploy via Sealos App UI

- Open the Sealos App launcher.
- Create a new App:
  - Container image: `your-dockerhub-username/sealos-devbox-demo:latest`
  - Port: 3000
  - Environment variables:
    - `DATABASE_URL` = postgres connection string (from step 3)
    - `DB_SSL` = true
  - Resource requests/limits: start small, e.g., 0.25 CPU / 256 MB
  - Autoscaling: optional
- Expose the service publicly:
  - Assign a subdomain (Sealos will provide a default or you can set one)
  - Enable TLS (typically automatic for platform subdomains)
- Save and deploy. Within seconds you’ll have a live, TLS-terminated URL.

#### Option B: Deploy via Kubernetes Manifests

If you prefer configuration as code, use `kubectl` with a Deployment, Service, and Ingress. Create a folder `k8s/` in your repo with:

k8s/deployment.yaml:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devbox-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: devbox-demo
  template:
    metadata:
      labels:
        app: devbox-demo
    spec:
      containers:
        - name: web
          image: your-dockerhub-username/sealos-devbox-demo:latest
          ports:
            - containerPort: 3000
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: devbox-demo-secrets
                  key: DATABASE_URL
            - name: DB_SSL
              value: 'true'
          resources:
            requests:
              cpu: '100m'
              memory: '128Mi'
            limits:
              cpu: '500m'
              memory: '512Mi'
---
apiVersion: v1
kind: Secret
metadata:
  name: devbox-demo-secrets
type: Opaque
stringData:
  DATABASE_URL: 'postgres://USER:PASSWORD@HOST:5432/DBNAME'
---
apiVersion: v1
kind: Service
metadata:
  name: devbox-demo
spec:
  type: ClusterIP
  selector:
    app: devbox-demo
  ports:
    - port: 80
      targetPort: 3000
      protocol: TCP
```

k8s/ingress.yaml:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: devbox-demo
  annotations:
    kubernetes.io/ingress.class: 'nginx'
    # If Sealos provides automatic TLS, you might only need to specify the host.
    # For cert-manager, add appropriate annotations and a tls block.
spec:
  rules:
    - host: your-subdomain.your-sealos-domain.example
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: devbox-demo
                port:
                  number: 80
```

Apply:

```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

Within moments, your app should be reachable via the host you configured. On Sealos, subdomains can often be set up via the UI and mapped to your Ingress behind the scenes.

### 8) Add HTTPS and Custom Domain

- For platform-provided subdomains, TLS is typically automatic.
- For a custom domain:
  - Create a DNS A or CNAME record pointing to the ingress/controller address provided by Sealos.
  - Enable TLS via the Sealos UI (if supported) or add a cert-manager Issuer/Certificate in YAML.
- Verify at `https://yourdomain.com`.

### 9) Wire Up Continuous Deployment (CD)

Let’s extend your GitHub Actions to deploy automatically after building the image. This example uses `kubectl` with a kubeconfig stored as a GitHub secret.

Add `.github/workflows/deploy.yml`:

```yaml
name: deploy
on:
  push:
    branches: ['main']
  workflow_dispatch: {}

env:
  KUBE_NAMESPACE: your-sealos-namespace

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install kubectl
        uses: azure/setup-kubectl@v4
        with:
          version: 'v1.29.3'

      - name: Write kubeconfig
        run: |
          echo "${KUBECONFIG_B64}" | base64 -d > kubeconfig
        env:
          KUBECONFIG_B64: ${{ secrets.KUBECONFIG_B64 }}

      - name: Set context
        run: |
          export KUBECONFIG=$PWD/kubeconfig
          kubectl config use-context your-sealos-context
          kubectl config set-context --current --namespace=${KUBE_NAMESPACE}
          echo "KUBECONFIG=$PWD/kubeconfig" >> $GITHUB_ENV

      - name: Update image and apply manifests
        run: |
          # Update Deployment image tag if needed; otherwise use :latest or digest-pinned tags
          kubectl apply -f k8s/deployment.yaml
          kubectl apply -f k8s/ingress.yaml
```

Notes:

- Create a `KUBECONFIG_B64` secret by base64-encoding your kubeconfig file from Sealos.
- For safer rollouts, consider using immutable tags (e.g., Git SHA) and `kubectl set image` to update the Deployment.

With this in place, pushing to main builds a new image and applies the latest manifests. Your app updates automatically.

### 10) Ephemeral Preview Environments per Pull Request

One of the biggest wins from CDEs is spin-up/tear-down of isolated preview stacks. You can extend your CI to create an App per PR and clean it up on merge/close.

Strategy:

- Name everything with the PR number: `devbox-demo-pr-123`.
- Use a kustomize overlay or template to set the Deployment name, Ingress host, and any secrets.
- On `pull_request` events:
  - Build and push an image tagged with the PR SHA.
  - Deploy a copy of the stack with a unique subdomain like `pr-123.your-sealos-domain.example`.
- On `pull_request.closed`: delete the resources.

A minimal GitHub Actions sketch:

```yaml
name: pr-preview
on:
  pull_request:
    types: [opened, synchronize, reopened, closed]

jobs:
  preview:
    if: github.event.action != 'closed'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}
      - name: Build and push PR image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: your-dockerhub-username/sealos-devbox-demo:pr-${{ github.event.number }}
      - name: Deploy PR preview
        env:
          KUBECONFIG_B64: ${{ secrets.KUBECONFIG_B64 }}
          PR: ${{ github.event.number }}
        run: |
          echo "$KUBECONFIG_B64" | base64 -d > kubeconfig
          export KUBECONFIG=$PWD/kubeconfig
          cat k8s/deployment.yaml \
            | sed "s#image: .*$#image: your-dockerhub-username/sealos-devbox-demo:pr-${PR}#g" \
            | sed "s/name: devbox-demo/name: devbox-demo-pr-${PR}/g" \
            | kubectl apply -f -
          cat k8s/ingress.yaml \
            | sed "s/devbox-demo/devbox-demo-pr-${PR}/g" \
            | sed "s/your-subdomain.your-sealos-domain.example/pr-${PR}.your-sealos-domain.example/g" \
            | kubectl apply -f -
  cleanup:
    if: github.event.action == 'closed'
    runs-on: ubuntu-latest
    steps:
      - name: Delete PR resources
        env:
          KUBECONFIG_B64: ${{ secrets.KUBECONFIG_B64 }}
          PR: ${{ github.event.number }}
        run: |
          echo "$KUBECONFIG_B64" | base64 -d > kubeconfig
          export KUBECONFIG=$PWD/kubeconfig
          kubectl delete ingress devbox-demo-pr-${PR} --ignore-not-found
          kubectl delete svc devbox-demo --ignore-not-found
          kubectl delete deploy devbox-demo-pr-${PR} --ignore-not-found
```

This is intentionally simple. In production, use Helm or Kustomize, include per-PR Secrets via templating, and consider a dedicated namespace per PR.

## How It Works (Under the Hood)

- DevBox runs as a container in your Sealos namespace, with persistent storage mounted. It hosts a web IDE and exposes your app ports via the platform ingress to generate HTTPS preview URLs.
- Managed apps (PostgreSQL, Redis, etc.) run as separate pods or services in your cluster or as managed offerings, reachable within the cluster network. DevBox connects using internal addresses, improving parity and security.
- Production apps are either created via the Sealos App UI (which generates Kubernetes resources) or directly via your manifests using `kubectl`. In both cases, your workloads run on Kubernetes behind Sealos’s ingress with TLS termination.
- With CI/CD, GitHub Actions pushes container images to your registry and updates the cluster via kubeconfig, automating deployments.

This architecture eliminates the “works on my machine” gap by aligning dev, staging, and prod environments.

## Practical Applications

- SaaS MVPs: Ship a secure, database-backed app without setting up local infra.
- Data dashboards: Build dashboards that connect to managed DBs and preview them securely with stakeholders.
- Microservices: Spin up per-service DevBoxes, share dependencies (e.g., Redis), and deploy iteratively.
- Education and workshops: Onboard students or contributors quickly with ready-to-code environments.
- Platform teams: Standardize golden paths and templates (DevBox + App + Database) across orgs.

## Best Practices and Considerations

Performance and cost:

- Right-size your DevBox. Start small (2 vCPU, 4 GB) and scale if you need more.
- Stop or hibernate DevBoxes when not in use.
- Use autoscaling in production to handle spikes.

Security:

- Manage secrets centrally. Use Sealed Secrets, external secret managers, or platform-provided secret storage. Avoid committing `.env` files.
- Limit database access to cluster networks. Prefer internal service endpoints over public ones.
- Enable TLS everywhere. Sealos’s ingress makes this easy for subdomains; set up cert-manager for custom domains if needed.

Reliability:

- Pin image tags by commit SHA rather than `latest` for deterministic rollouts.
- Use readiness/liveness probes in your Deployment to improve resilience.
- Add a migration job or initContainer for safe database schema changes.

Developer UX:

- Bake toolchains into a custom DevBox base image (Node.js, pnpm, Python, etc.) for fast start.
- Use dotfiles or a devcontainer.json-like setup to configure the editor, extensions, and shell.
- Share DevBox URL and documentation in your repo’s README for onboarding.

Observability:

- Integrate app logs with Sealos’s logging stack or a SaaS. Configure stdout/stderr collection.
- Add basic tracing/metrics to key endpoints.
- Monitor pods and HPA behavior; set requests/limits thoughtfully.

## Troubleshooting: Common Issues

- DB connection error:

  - Check `DATABASE_URL` formatting (`postgres://user:pass@host:5432/db`).
  - Ensure SSL flag matches your DB setup (`DB_SSL=true` if required).
  - Verify network access from DevBox to DB service.

- Port not reachable:

  - Confirm app listens on `0.0.0.0` (default in Express is fine).
  - Check the DevBox port exposure settings or the Ingress host path.

- CI image push fails:

  - Ensure registry credentials are correct and have write access.
  - Keep image tags short and avoid illegal characters (use PR number, SHA).

- Deployment rolling restarts:

  - Look at pod logs: `kubectl logs deploy/devbox-demo -c web`.
  - Verify memory/CPU limits are not too low; increase if OOMKilled.
  - Add liveness/readiness probes to give the app time to warm up.

- TLS certificate issues on custom domain:
  - DNS must resolve to the platform ingress IP/hostname.
  - If using cert-manager, check Issuer/Certificate resources and Ingress annotations.

## Where Sealos Fits in Your Stack

Sealos is more than a CDE. The big picture:

- Dev: Sealos DevBox for cloud-native development
- Data: Managed apps like PostgreSQL, Redis from the marketplace
- Deploy: App launcher for one-click deployments; optional `kubectl` for IaC workflows
- Network: Built-in ingress, domains, and TLS
- Storage: Object storage and persistent volumes
- Scale: Kubernetes HPA, multi-tenant isolation, and resource quotas

Explore more at https://sealos.io to see how DevBox integrates with the platform and how teams use Sealos to standardize the entire software lifecycle on Kubernetes.

## Why This Matters

Shipping faster is not about cutting corners. It’s about removing friction:

- You stop fighting local environment drift.
- You prototype against real services from the start.
- You get predictable, reproducible deployments.
- You enable teammates and reviewers with shareable preview links.
- You turn tribal setup knowledge into a repeatable platform workflow.

CDEs like Sealos DevBox make “dev-prod parity” practical—even for small teams.

## Conclusion

In 15 minutes, you can go from a blank repo to a production-grade, TLS-enabled app backed by a managed PostgreSQL database—without installing anything on your laptop. The workflow looks like this:

- Start in a Sealos DevBox to code in a clean, consistent environment
- Add a managed database in a couple of clicks
- Run and share your app via HTTPS preview URLs
- Containerize with a minimal Dockerfile
- Build and push images via CI
- Deploy to production from the Sealos App UI or with `kubectl`
- Optional: spin up ephemeral preview environments per PR

This isn’t just convenience—it’s a foundation for shipping faster, with fewer surprises, and with a platform that scales with you. Try it on your next project and make “it works on my machine” a relic of the past.
