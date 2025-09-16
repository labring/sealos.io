---
title: "Migration Guide: Moving Your Node.js & Postgres App from Heroku to Sealos in Under an Hour"
imageTitle: "Node.js & Postgres: Heroku to Sealos Migration"
description: "A practical, step-by-step migration guide to move your Node.js and PostgreSQL app from Heroku to Sealos with minimal downtime. Learn proven workflows for data transfer, deployment, and environment setup to complete the migration in under an hour."
date: 2025-09-05
tags: ["nodejs", "postgresql", "heroku", "sealos", "migration-guide"]
authors: ["default"]
---

If you’ve outgrown Heroku’s dyno model, want more control, or need cost predictability as your app scales, you’re not alone. Many teams are moving to platforms that provide the convenience of PaaS with the flexibility of Kubernetes. Sealos is one such platform: a cloud operating system that lets you deploy containerized apps, databases, domains, storage, and scheduled jobs via a clean UI—without forcing you to become a Kubernetes expert.

This guide shows you how to migrate a production Node.js app with a Heroku Postgres database to Sealos in under an hour. We’ll cover what Sealos is, why it’s a good fit, how it maps to Heroku concepts, and give you a step-by-step plan—from containerizing your app to cutting over with minimal downtime.

What you’ll accomplish

- Package your Node.js app into a Docker image.
- Provision a Postgres database on Sealos.
- Export and import your data from Heroku Postgres.
- Configure environment variables and secrets.
- Deploy your web and worker processes.
- Point your domain at Sealos and enable HTTPS.
- Validate, cut over, and roll back if needed.

What you need

- A working Node.js app running on Heroku (web dyno, optional worker dyno).
- Access to your Heroku app and Heroku Postgres (CLI installed and authenticated).
- A Sealos account (see sealos.io).
- A container registry account (Docker Hub or GitHub Container Registry).
- Docker installed locally, or a CI service to build images.

Why move from Heroku to Sealos

- Control and portability: Move from black-box dynos to open container images you own. Your app becomes portable across environments.
- Cost clarity: Scale CPU/RAM to what you actually need and add storage and databases on demand.
- Integrated platform: Deploy apps from images, provision databases, attach volumes for persistent files, manage domains and TLS, and schedule cron jobs—all from a single UI.
- Kubernetes benefits, without the pain: Sealos provides a developer-friendly layer over Kubernetes constructs like Deployments, Services, Secrets, and CronJobs.

How Sealos maps to Heroku

Here’s how common Heroku concepts translate to Sealos:

- Heroku App → Sealos App in a namespace (logical project boundary)
- Dyno (web) → Deployment + Service (managed via the App Launchpad)
- Dyno (worker) → Deployment with custom command (no public Service)
- Procfile → Container CMD/ENTRYPOINT
- Buildpacks → Dockerfile (you control runtime, OS, deps)
- Config Vars → Environment variables + Secrets
- Heroku Postgres → PostgreSQL database (provisioned from Sealos app store) or an external provider
- Logplex → Built-in logs viewer; integrate external logging if desired
- Heroku Scheduler → Sealos CronJobs
- Releases → Image tags in your container registry

Note: Sealos can be used from its UI or programmatically. You don’t need to learn Kubernetes to complete this migration.

Step 1: Audit your Heroku app

Before touching production, gather key info from Heroku:

- App name and pipeline stages
- Node.js version (package.json "engines")
- Process types (Procfile)
- Config vars (heroku config)
- Add-ons (heroku addons), especially Heroku Postgres plan and version
- Attachments to your database (heroku pg:info)
- Any Heroku features you rely on (e.g., SSL redirect, heroku-buildpack-\*, scheduler)

Helpful commands:

- heroku apps:info -a your-app
- heroku buildpacks -a your-app
- heroku config -a your-app
- heroku ps -a your-app
- heroku addons -a your-app
- heroku pg:info -a your-app

Record:

- DATABASE_URL and any other secrets
- Port usage: your app must respect process.env.PORT
- Any local writes (uploads, cache, temp): On Heroku, the filesystem is ephemeral; on Sealos you can attach persistent volumes

Step 2: Containerize your Node.js app

On Heroku, buildpacks detect runtime and run your app. On Sealos, you’ll deploy a Docker image. If your app doesn’t have a Dockerfile yet, add one. A production-ready, multi-stage Dockerfile for Node.js might look like this:

```dockerfile
# syntax=docker/dockerfile:1.6

# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies separately for better caching
COPY package*.json ./
# If you use pnpm or yarn, adjust accordingly
RUN npm ci

# Copy source
COPY . .

# Build (if you have a build step; otherwise skip)
# For example, building TypeScript or bundling assets
# RUN npm run build

# 2) Runtime stage
FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app

# Copy only needed files
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy runtime artifacts (dist, public, etc.)
COPY --from=builder /app ./

# Ensure the app listens on the PORT env variable
ENV PORT=3000
EXPOSE 3000

# Optional healthcheck (adjust path)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/health || exit 1

# For Heroku parity, ensure CMD matches your Procfile's web command
# e.g., "web: node server.js"
CMD ["node", "server.js"]
```

Local test:

- Build: docker build -t yourname/yourapp:latest .
- Run: docker run -e PORT=3000 -p 3000:3000 yourname/yourapp:latest
- Verify: open http://localhost:3000. Make sure your app reads DATABASE_URL and PORT from environment variables.

If your Heroku Procfile includes a worker, plan to run that as a separate Sealos app or deployment with a different command, e.g.:

- Web: CMD ["node", "server.js"]
- Worker: CMD ["node", "worker.js"]

Step 3: Push your image to a registry

Sealos can pull images from public registries like Docker Hub or GitHub Container Registry (GHCR).

Option A: Docker Hub

- docker login
- docker tag yourname/yourapp:latest your-dockerhub-username/yourapp:1.0.0
- docker push your-dockerhub-username/yourapp:1.0.0

Option B: GitHub Container Registry (GHCR)

- Create a Personal Access Token (with write:packages) or use GitHub Actions.
- Authenticate: echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin
- docker tag yourname/yourapp:latest ghcr.io/USERNAME/yourapp:1.0.0
- docker push ghcr.io/USERNAME/yourapp:1.0.0

Optional: CI/CD with GitHub Actions

```yaml
name: Build and push

on:
  push:
    branches: [main]

jobs:
  docker:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}/app:latest
```

Step 4: Provision PostgreSQL on Sealos

From Sealos (see sealos.io for the Cloud console):

- Open the app marketplace/store and select PostgreSQL.
- Choose:
  - Version (match or exceed Heroku’s version)
  - Storage size
  - Database name, username, password (store these securely)
- Deploy and wait for the instance to become ready.
- Copy the connection details (host, port, database, user, password, SSL options) into your notes. Most clients expect a DATABASE_URL like:
  - postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require

If you prefer a third-party managed Postgres (e.g., Neon, Supabase, RDS), you can use that instead and skip to Step 5 with those credentials.

Step 5: Migrate the database from Heroku

Fast path (low downtime, acceptable for many apps):

1. Take an initial dump from Heroku Postgres

```bash
# Replace with your Heroku app
heroku pg:backups:capture -a your-heroku-app
heroku pg:backups:download -a your-heroku-app # yields latest.dump
```

Alternative using pg_dump:

```bash
# Get the Heroku DATABASE_URL
heroku config:get DATABASE_URL -a your-heroku-app
# Dump custom format for pg_restore
pg_dump --format=custom --no-acl --no-owner --dbname "$HEROKU_DATABASE_URL" --file heroku.dump
```

2. Restore into Sealos Postgres

- Ensure your local machine or a jump host can reach the Sealos Postgres endpoint. If Sealos provides only internal connectivity, use a temporary bastion pod. Many setups expose Postgres via a public host/port protected by strong credentials and SSL.
- Create the target database and role if needed, then restore:

```bash
# Example: using a URL like postgresql://user:pass@host:port/db?sslmode=require
export TARGET_DB_URL="postgresql://USER:PASS@HOST:5432/DBNAME?sslmode=require"

# Create DB if not exists (if your URL references the DB, you may skip this)
createdb "$TARGET_DB_URL" || true

# Restore
pg_restore --clean --no-acl --no-owner --dbname "$TARGET_DB_URL" heroku.dump
```

3. Validate data

- Compare table counts and recent rows.
- Run a quick smoke test locally by pointing your app to the new database.

Minimal-downtime cutover (optional):

- Schedule a brief read-only window or maintenance mode.
- Stop background jobs that write to the DB.
- Take a final differential snapshot or a last pg_dump/pg_restore.
- Switch your app’s DATABASE_URL to Sealos and redeploy.

Step 6: Create secrets and environment config in Sealos

In Sealos:

- Create a Secret for DATABASE_URL and any other sensitive values (JWT secrets, API keys).
- Create or set environment variables for non-sensitive config (NODE_ENV, APP_BASE_URL, etc.).

Example DATABASE_URL formats:

- Without SSL: postgresql://user:pass@host:5432/dbname
- With SSL required (common for cloud DBs): postgresql://user:pass@host:5432/dbname?sslmode=require

In Node.js, most Postgres clients (pg, Prisma, Sequelize) accept DATABASE_URL. For pg, you can enforce SSL with:

```js
// Example: pg Pool with SSL enabled via connection string or config
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If you need to accept self-signed certs, use rejectUnauthorized: false in dev only
  ssl: process.env.DATABASE_URL?.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = pool;
```

Step 7: Deploy your web app on Sealos

Using Sealos App Launchpad:

- Create a new App.
- Select your image: e.g., ghcr.io/USERNAME/yourapp:1.0.0.
- Container port: 3000 (or whatever your app listens on).
- Replicas: start with 1–2 (scale later as needed).
- Resources: choose CPU/RAM sized similarly to your Heroku dyno.
- Set environment variables and mount the Secret you created earlier (DATABASE_URL, etc.).
- Health checks: configure path /health or similar for readiness/liveness.
- Volumes (optional): If your app writes user uploads, sessions, or temp files, attach a persistent volume and configure your app to use it. Consider moving user uploads to object storage for scalability (Sealos often offers S3-compatible object storage in its app store).
- Deploy and wait for a green status.

Step 8: Add your domain and TLS

In Sealos:

- Open Domains/Ingress and add your custom domain (e.g., app.example.com).
- Map it to the web app’s service/port.
- Enable automatic TLS (Let’s Encrypt) if available.
- Set DNS:
  - Create a CNAME from app.example.com to the domain endpoint provided by Sealos.
  - Wait for DNS to propagate; verify HTTP and HTTPS.

Step 9: Deploy background workers and cron jobs

If your Heroku app uses workers:

- Create another App in Sealos using the same image.
- Override command/entrypoint to your worker process, e.g., node worker.js.
- No need to expose a port.
- Configure env vars and secrets as with the web app.

If you used Heroku Scheduler:

- Create a CronJob in Sealos (schedule in crontab syntax).
- Example command: node scripts/cleanup.js
- Set environment variables and a schedule like 0 2 \* \* \* for nightly at 2 AM.

Step 10: Cut over with confidence

A checklist to reduce risk:

Before switching DNS

- Verify health: app’s /health is passing.
- Logs: open Sealos logs for web and worker; watch for errors.
- DB connectivity: run a quick query or a test endpoint.
- Background jobs: confirm they start and process messages.
- Security: confirm HTTPS and HSTS (if you enforce it).
- Uploads: if applicable, test writing to storage.

Cutover sequence

- Put Heroku in maintenance mode (optional): heroku maintenance:on -a your-heroku-app
- Update any third-party callbacks/webhooks to your new domain.
- Change DNS to point to Sealos domain endpoint.
- Invalidate CDN caches if used.
- Turn off maintenance: your cutover occurs once DNS propagates.

Rollback plan

- Keep Heroku app running until you confirm stability.
- If needed, switch DNS back to Heroku and investigate logs on Sealos.

Practical examples and snippets

Procfile to Docker CMD mapping

- Heroku Procfile:

  - web: node server.js
  - worker: node worker.js

- In your Dockerfile:
  - CMD ["node", "server.js"] for web image
- For the worker on Sealos, override command in the UI to node worker.js.

Express server listening on PORT (Heroku parity and Sealos-friendly):

```js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/health", (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
```

Postgres SSL gotcha

Heroku enforces SSL on Postgres. Your new Sealos Postgres might:

- Require SSL: use ?sslmode=require in the DATABASE_URL.
- Not require SSL: you can omit it, but consider enabling SSL for security if accessed over the public internet.

Connection pooling

Heroku limits connections. If you rely on PgBouncer on Heroku, replicate that in Sealos:

- Deploy a PgBouncer instance (from Sealos app store, if available) and point your app to it.
- Or use a higher max_connections DB and tune pool size:
  - In Node pg, use a Pool with max set reasonably (e.g., 5–10 per replica).
  - Keep-alive settings can help avoid dropped connections.

```js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PGPOOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

Static files and uploads

On Heroku, ephemeral files vanish after deploy. If your app writes user uploads:

- Move uploads to object storage (S3-compatible). If Sealos provides object storage in the marketplace, consider it to simplify management.
- If you must store files locally, attach a persistent volume to your Sealos app and configure your app to write there. This is fine for small-scale scenarios.

Readiness and liveness probes

A liveness probe kills a stuck container, and a readiness probe gates traffic until your app is ready:

- Liveness: GET /health returns 200 when alive.
- Readiness: same endpoint works, but ensure it only returns 200 when DB connections and migrations are complete.

Optional: Zero-downtime image rollouts

When you push a new image tag, Sealos can roll out updates by spinning up new replicas before terminating old ones (rolling update strategy) if configured. To reduce risk:

- Use distinct image tags per release (e.g., 1.0.1, 1.0.2) rather than latest.
- Configure a readiness probe so traffic only hits ready pods.

End-to-end example: migrate data using pg_dump/pg_restore

1. From Heroku:

```bash
export HEROKU_APP=your-heroku-app
export HEROKU_DB_URL=$(heroku config:get DATABASE_URL -a "$HEROKU_APP")

pg_dump --format=custom --no-acl --no-owner --dbname "$HEROKU_DB_URL" --file heroku.dump
```

2. To Sealos Postgres:

```bash
export TARGET_DB_URL="postgresql://USER:PASS@HOST:5432/DBNAME?sslmode=require"
pg_restore --clean --no-acl --no-owner --dbname "$TARGET_DB_URL" heroku.dump
```

3. Verify in psql:

```bash
psql "$TARGET_DB_URL" -c "\dt"
psql "$TARGET_DB_URL" -c "SELECT COUNT(*) FROM your_table;"
```

Common pitfalls and how to avoid them

- Missing PORT env: Ensure your server binds to process.env.PORT. Hard-coding 8080 or 3000 without honoring PORT can break routing.
- Node version mismatch: Align Node.js version in your Dockerfile with package.json engines to avoid runtime surprises.
- SSL errors in Postgres: If you see self-signed certificate errors, add ?sslmode=require to your connection string. Avoid disabling SSL in production.
- Too many DB connections: Set a reasonable pool max and/or deploy PgBouncer.
- File persistence assumptions: Heroku’s ephemeral filesystem may have hidden reliance on caches or uploads. Decide on object storage vs. persistent volume before go-live.
- Environment secrets in plain text: Store secrets in Sealos Secrets, not as plain env vars.
- Long startup without readiness probe: Configure readiness to prevent traffic until startup completes (e.g., after migrations).
- Websockets and sticky sessions: If you rely on in-memory sessions, move to an external session store (Redis) to avoid issues when scaling replicas. Sealos often provides Redis in its app store.

Observability and logs

- Logs: Use the Sealos UI to stream logs for web and worker apps. Standard output from Node.js is captured automatically.
- Metrics: Watch CPU/memory usage and scale replicas or resources accordingly.
- External log aggregation: If you need centralized logs, add a sidecar or agent (e.g., Vector, Fluent Bit) or send structured logs to a third-party service.

Security considerations

- TLS everywhere: Enable HTTPS on your domain and use SSL to the database.
- Secrets management: Keep secrets in Sealos Secrets, not hard-coded.
- Principle of least privilege: Create separate DB users for app and admin tasks.
- Network exposure: Only expose public ports for web services; keep workers private.

Performance tuning

- App-level:
  - Enable compression and caching headers for static assets.
  - Use a CDN in front of your Sealos app for global performance.
- Database:
  - Add indexes for frequent queries.
  - Use connection pooling and tune pool size per replica.
- Scaling:
  - Horizontal: increase replicas for web app.
  - Vertical: increase CPU/RAM limits in Sealos if your app needs more headroom.

FAQ

- Do I need Kubernetes knowledge to use Sealos?
  - No. The App Launchpad abstracts Deployments, Services, and Ingress behind a simple UI. You can still bring YAML if you want, but it’s not required.
- Can I keep using a managed Postgres like Neon or RDS?
  - Yes. Just set DATABASE_URL to your external provider and skip the Sealos Postgres provisioning.
- What about Heroku add-ons (email, queues)?
  - You can integrate the same third-party services by copying config vars. For Redis/queues, check the Sealos app store for a Redis deployment or use a managed provider.
- How do I set up CI/CD?
  - Build and push your Docker image from GitHub Actions or another CI, then deploy by updating the image tag in Sealos. Advanced teams can adopt GitOps (e.g., Argo CD) if desired.

A simple migration timeline (under an hour)

- Minutes 0–10: Audit Heroku, create Dockerfile, build image.
- Minutes 10–20: Push image to registry; provision Postgres on Sealos.
- Minutes 20–35: Dump Heroku DB and restore to Sealos; validate.
- Minutes 35–50: Create Sealos app(s), configure env/Secrets, deploy, add domain/TLS.
- Minutes 50–60: Smoke test, switch DNS, monitor logs, and finalize.

Why Sealos is a good long-term fit

- Developer experience: Simple, UI-driven deployments with advanced capabilities when you need them.
- Integrated platform: Apps, databases, domains, persistent storage, and scheduled jobs in one place.
- Kubernetes-native: Gain portability and ecosystem compatibility without managing cluster complexity day-to-day.

Useful links

- Sealos website: https://sealos.io
- Documentation and product overview: explore the App Launchpad, database apps (like PostgreSQL), and domains/TLS features from the site to understand the latest capabilities and UI steps.

Conclusion

Migrating a Node.js and Postgres app from Heroku to Sealos can be done in well under an hour with the right prep. By containerizing your app, provisioning a Postgres instance, importing your data, and setting up environment variables and domains, you’ll gain control and portability while keeping a streamlined developer experience.

Sealos gives you the ease of a PaaS backed by the power of Kubernetes: deploy images, attach persistent storage, configure secrets, run background workers and cron jobs, and manage domains and TLS—all from one place. With a careful cutover plan and a few best practices—honor PORT, enforce SSL, tune DB connections, and set health probes—you’ll be live on Sealos quickly and confidently, ready to scale on your terms.
