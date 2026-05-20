# Sealos S2I Template Articles — Next.js

## Template Article 1 — Beginner

# How to Deploy a Next.js App to Sealos in 5 Minutes

**Meta title:** Deploy Next.js to Sealos in 5 Minutes | Next.js Hosting Guide  
**Meta description:** Learn how to deploy a Next.js app from GitHub to Sealos using Source-to-Image. This Next.js deployment guide covers repo import, build detection, public access, and live hosting.  
**Target keywords:** deploy Next.js, Next.js hosting, Next.js deployment guide, deploy Next.js app, Sealos Next.js deployment  
**Estimated reading time:** 5 minutes

## Prerequisites

Before you deploy Next.js to Sealos, prepare:

- A GitHub account
- A Next.js repository on GitHub
- A Sealos account
- A working `package.json` with build and start scripts
- The application port, usually `3000`

Example `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 3000"
  }
}
```

## What You Will Build

You will deploy a Next.js app from a GitHub repository to Sealos. Sealos S2I detects the framework, builds a container image, creates the application runtime, exposes a public address, and runs the app online.

## Step 1: Open Sealos and Start a New App

Go to the Sealos dashboard and open **App Launchpad** or the S2I deployment entry.

Choose **Deploy from Source Code** and select GitHub as the source provider.

**Screenshot:** `screenshot-01-sealos-dashboard-app-launchpad.png`  
**Caption:** Sealos dashboard with App Launchpad selected.

## Step 2: Connect Your GitHub Repository

Authorize Sealos to access your GitHub account. Select the repository that contains your Next.js app.

Recommended repository structure:

```txt
my-nextjs-app/
├── app/
├── public/
├── package.json
├── next.config.js
└── README.md
```

For Pages Router projects:

```txt
my-nextjs-app/
├── pages/
├── public/
├── package.json
└── next.config.js
```

**Screenshot:** `screenshot-02-github-repository-selection.png`  
**Caption:** GitHub repository picker inside the Sealos S2I deployment flow.

## Step 3: Confirm Next.js Build Detection

Sealos S2I scans the repository and detects Next.js through `package.json` dependencies such as `next`, `react`, and `react-dom`.

Use these build settings:

| Field | Value |
|---|---|
| Framework | Next.js |
| Install command | `npm install` or `npm ci` |
| Build command | `npm run build` |
| Start command | `npm run start` |
| Container port | `3000` |

For pnpm projects:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm start -- -p 3000
```

For yarn projects:

```bash
yarn install --frozen-lockfile
yarn build
yarn start -p 3000
```

**Screenshot:** `screenshot-03-nextjs-build-settings.png`  
**Caption:** S2I framework detection and build settings for a Next.js app.

## Step 4: Configure Resources and Public Access

Choose the initial CPU and memory allocation.

Recommended starter settings:

| Setting | Starter Value |
|---|---:|
| CPU | 0.5–1 core |
| Memory | 512 MiB–1 GiB |
| Replicas | 1 |
| Port | 3000 |
| Public access | Enabled |

Enable public access so Sealos creates a public URL for your Next.js hosting environment.

**Screenshot:** `screenshot-04-resources-and-public-access.png`  
**Caption:** Resource, replica, port, and public access configuration in Sealos.

## Step 5: Add Environment Variables

Add variables required by your Next.js app.

Common examples:

```bash
NEXT_PUBLIC_SITE_URL=https://your-app.example.com
NEXT_PUBLIC_API_URL=https://api.example.com
NODE_ENV=production
```

Use `NEXT_PUBLIC_` only for values that can be safely exposed to the browser. Server-side secrets should use regular environment variable names:

```bash
DATABASE_URL=postgresql://user:password@host:5432/db
AUTH_SECRET=your-secret
```

**Screenshot:** `screenshot-05-nextjs-environment-variables.png`  
**Caption:** Environment variable editor in Sealos App Launchpad.

## Step 6: Deploy the Next.js App

Click **Deploy Application**.

Sealos will:

1. Pull source code from GitHub
2. Detect the Next.js framework
3. Build the app
4. Create a container image
5. Start the application
6. Run health checks
7. Expose the public address

Wait until the application status becomes **Running**.

**Screenshot:** `screenshot-06-deployment-progress.png`  
**Caption:** Build and deployment progress for a Next.js app on Sealos.

## Step 7: Open the Public URL

Click the **Public Address** in the application detail page.

Your Next.js app is now live on Sealos.

**Screenshot:** `screenshot-07-nextjs-live-public-url.png`  
**Caption:** Running Next.js app opened from the Sealos public address.

## Common Errors and Fixes

### 1. `next: command not found`

**Cause:** Dependencies were skipped or the lockfile points to a mismatched package manager.

**Fix:**

Use the package manager that matches your lockfile:

| Lockfile | Install command |
|---|---|
| `package-lock.json` | `npm ci` |
| `pnpm-lock.yaml` | `pnpm install --frozen-lockfile` |
| `yarn.lock` | `yarn install --frozen-lockfile` |

### 2. Build fails during `next build`

**Cause:** TypeScript, ESLint, missing environment variables, or invalid imports can fail production builds.

**Fix:**

Run locally first:

```bash
npm run build
```

Then add missing variables in Sealos and commit any build fixes to GitHub.

### 3. App starts but public URL shows a gateway error

**Cause:** The Next.js server is listening on a port that differs from the Sealos container port.

**Fix:**

Set the start script and Sealos port to `3000`:

```json
{
  "scripts": {
    "start": "next start -p 3000"
  }
}
```

### 4. Static assets return 404

**Cause:** `assetPrefix`, `basePath`, or CDN settings point to another host.

**Fix:**

Check `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: undefined
};

module.exports = nextConfig;
```

### 5. Environment variables appear empty in the browser

**Cause:** Browser-exposed values need the `NEXT_PUBLIC_` prefix and a fresh build.

**Fix:**

Add the variable as `NEXT_PUBLIC_*`, redeploy, and rebuild through S2I.

## Next Steps

- Continue with **Next.js + PostgreSQL Full-Stack Deployment Guide on Sealos**: `/guides/s2i/nextjs-postgresql-sealos`
- Prepare production settings with **Complete Checklist for Next.js Production Deployment on Sealos**: `/guides/s2i/nextjs-production-deployment-sealos`

---

## Template Article 2 — Advanced

# Deploy a Next.js + PostgreSQL Full-Stack App on Sealos

**Meta title:** Next.js + PostgreSQL Deployment on Sealos | Full-Stack Guide  
**Meta description:** Deploy a full-stack Next.js app with PostgreSQL on Sealos. This Next.js deployment guide covers database creation, DATABASE_URL, environment variables, persistent storage, and production-ready hosting.  
**Target keywords:** Next.js PostgreSQL deployment, deploy Next.js with PostgreSQL, Next.js hosting, Next.js deployment guide, full-stack Next.js deployment  
**Estimated reading time:** 9 minutes

## Prerequisites

Prepare:

- A GitHub account
- A Next.js repository with database code
- A Sealos account
- A PostgreSQL database requirement
- A migration tool such as Prisma, Drizzle, Sequelize, or raw SQL
- Basic knowledge of environment variables

Example stack:

```txt
Next.js App Router
PostgreSQL
Prisma ORM
Sealos S2I
Sealos Database
```

## What You Will Build

You will deploy a Next.js full-stack application that connects to PostgreSQL on Sealos. The app will use Sealos S2I for source deployment and Sealos Database for managed PostgreSQL.

## Step 1: Prepare the Next.js Repository

A typical Prisma-based Next.js app looks like this:

```txt
my-nextjs-postgres-app/
├── app/
├── prisma/
│   └── schema.prisma
├── package.json
├── next.config.js
└── .env.example
```

Example `schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

Example `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start -p 3000",
    "db:migrate": "prisma migrate deploy"
  },
  "dependencies": {
    "@prisma/client": "latest",
    "prisma": "latest",
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  }
}
```

**Screenshot:** `screenshot-01-nextjs-postgres-repo-structure.png`  
**Caption:** GitHub repository structure for a Next.js + PostgreSQL app.

## Step 2: Create PostgreSQL in Sealos

Open the Sealos dashboard and click **Database**.

Create a new PostgreSQL database:

| Field | Suggested Value |
|---|---|
| Database type | PostgreSQL |
| Version | PostgreSQL 14+ |
| Replicas | 1 for starter, 2+ for higher availability |
| Storage | 3 GiB+ |
| CPU | 0.5–1 core |
| Memory | 512 MiB–1 GiB |

Click **Deploy** and wait until the database status is running.

**Screenshot:** `screenshot-02-create-postgresql-database.png`  
**Caption:** Creating a PostgreSQL database in the Sealos Database app.

## Step 3: Copy the PostgreSQL Connection String

Open the PostgreSQL database detail page and copy the connection details.

A typical connection string format:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

For Prisma, add the schema parameter when needed:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

**Screenshot:** `screenshot-03-postgresql-connection-details.png`  
**Caption:** PostgreSQL connection details in Sealos.

## Step 4: Deploy the Next.js App from GitHub

Open **App Launchpad** or the S2I source deployment entry.

Select:

| Field | Value |
|---|---|
| Source | GitHub |
| Repository | Your Next.js repo |
| Framework | Next.js |
| Build command | `npm run build` |
| Start command | `npm run start` |
| Port | `3000` |

**Screenshot:** `screenshot-04-s2i-nextjs-postgres-build-config.png`  
**Caption:** S2I build configuration for a Next.js + PostgreSQL app.

## Step 5: Configure Environment Variables

Add database and app variables in the Sealos environment variable editor.

Example:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-app.example.com
AUTH_SECRET=replace-with-a-secure-secret
```

For Prisma, keep `DATABASE_URL` server-side. Browser code should call an API route or server action.

**Screenshot:** `screenshot-05-configure-database-url.png`  
**Caption:** Adding `DATABASE_URL` and production variables in Sealos.

## Step 6: Run Database Migrations

Use one of these approaches.

### Option A: Run migrations during build

Update `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start -p 3000"
  }
}
```

This works for small teams and simple deployments.

### Option B: Run migrations from a one-off terminal

Open the app terminal in Sealos after deployment and run:

```bash
npx prisma migrate deploy
```

This gives you more control for production changes.

**Screenshot:** `screenshot-06-run-prisma-migrations.png`  
**Caption:** Running Prisma migrations from the Sealos application terminal.

## Step 7: Configure Persistent Storage When the App Needs Files

PostgreSQL data is persisted by the Sealos Database app. Add application-level persistent storage when the Next.js app writes files, uploads assets, or stores generated content.

Examples:

| Use case | Suggested mount path |
|---|---|
| Uploaded files | `/app/uploads` |
| Generated reports | `/app/storage` |
| Cache that should survive restarts | `/app/cache` |

In App Launchpad, open the storage section and add a persistent volume.

**Screenshot:** `screenshot-07-persistent-storage-nextjs.png`  
**Caption:** Adding persistent storage for application-generated files.

## Step 8: Deploy and Verify the Full-Stack App

Click **Deploy Application** and wait for status **Running**.

Verify:

1. Open the public address.
2. Trigger a page or API route that reads from PostgreSQL.
3. Create a test record.
4. Refresh the page and confirm the record persists.
5. Restart the application and confirm the record remains available.

Example health route:

```ts
// app/api/health/db/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  await prisma.$queryRaw`SELECT 1`;
  return NextResponse.json({ database: 'ok' });
}
```

**Screenshot:** `screenshot-08-nextjs-postgres-live-check.png`  
**Caption:** Verifying a live Next.js app connected to PostgreSQL on Sealos.

## Common Errors and Fixes

### 1. `PrismaClientInitializationError`

**Cause:** `DATABASE_URL` has an invalid host, password, database name, or schema parameter.

**Fix:**

Copy the connection string again from Sealos Database and confirm it is saved in the app environment variables.

### 2. `relation does not exist`

**Cause:** Migrations have yet to run against the Sealos PostgreSQL database.

**Fix:**

Run:

```bash
npx prisma migrate deploy
```

Then redeploy or restart the app.

### 3. Build succeeds, runtime database requests fail

**Cause:** The build process generated Prisma Client, while runtime uses a missing or outdated variable.

**Fix:**

Set `DATABASE_URL` in Sealos App Launchpad and redeploy so the runtime receives the variable.

### 4. File uploads disappear after restart

**Cause:** Files are stored inside the container filesystem.

**Fix:**

Add persistent storage and write uploads to the mounted path, such as `/app/uploads`.

### 5. API route times out

**Cause:** Database queries are slow, connection pooling is undersized, or the app instance has limited CPU/memory.

**Fix:**

Increase app resources, review queries, add indexes, and set an appropriate connection pool size for the ORM.

## Next Steps

- Start with the beginner guide: `/guides/s2i/deploy-nextjs-sealos`
- Continue with the production checklist: `/guides/s2i/nextjs-production-deployment-sealos`

---

## Template Article 3 — Production

# Complete Checklist for Next.js Production Deployment on Sealos

**Meta title:** Next.js Production Deployment on Sealos | Complete Checklist  
**Meta description:** Use this complete Next.js production deployment checklist for Sealos. Configure custom domains, HTTPS, environment variables, PostgreSQL backups, monitoring, logs, autoscaling, and rollback.  
**Target keywords:** Next.js production deployment, Next.js hosting, Next.js deployment guide, deploy Next.js production, Next.js rollback  
**Estimated reading time:** 12 minutes

## Prerequisites

You should already have:

- A Next.js app deployed on Sealos
- A GitHub repository connected to S2I
- Production environment variables prepared
- A custom domain
- PostgreSQL configured if the app needs a database
- Access to App Launchpad, Database, logs, events, and monitoring in Sealos

## Production Goal

A production-ready Next.js deployment on Sealos should have:

- Stable build and start commands
- Correct environment variables
- Public access through a custom domain
- HTTPS enabled
- Database backups
- Persistent storage for app-generated files
- Logs and monitoring
- Autoscaling or replica planning
- Versioned releases and rollback procedure

## Checklist Overview

| Area | Production Check |
|---|---|
| Build | `next build` succeeds in CI/S2I |
| Runtime | `next start -p 3000` listens on the configured port |
| Domain | Custom domain points to Sealos |
| HTTPS | TLS certificate is active |
| Secrets | Server secrets stored as environment variables |
| Database | PostgreSQL credentials and backups configured |
| Storage | Persistent volume mounted for uploaded files |
| Monitoring | CPU, memory, replicas, logs, and events checked |
| Rollback | Previous release and rollback path verified |

## Step 1: Lock the Production Build Settings

Use explicit scripts in `package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p 3000"
  }
}
```

For Prisma:

```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "start": "next start -p 3000",
    "db:migrate": "prisma migrate deploy"
  }
}
```

Recommended Sealos settings:

| Field | Value |
|---|---|
| Build command | `npm run build` |
| Start command | `npm run start` |
| Container port | `3000` |
| Health path | `/` or `/api/health` |
| Public access | Enabled |

**Screenshot:** `screenshot-01-production-build-settings.png`  
**Caption:** Production build and runtime settings for Next.js on Sealos.

## Step 2: Configure Production Environment Variables

Add only production values in Sealos.

Example:

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://www.example.com
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
AUTH_SECRET=replace-with-secure-random-string
NEXTAUTH_URL=https://www.example.com
```

Recommended practice:

| Variable Type | Example | Browser Exposure |
|---|---|---|
| Public site URL | `NEXT_PUBLIC_SITE_URL` | Yes |
| Database URL | `DATABASE_URL` | Server only |
| Auth secret | `AUTH_SECRET` | Server only |
| API base URL | `NEXT_PUBLIC_API_URL` | Yes, when safe |

**Screenshot:** `screenshot-02-production-env-vars.png`  
**Caption:** Production environment variables in Sealos App Launchpad.

## Step 3: Add a Custom Domain

Open the application detail page in App Launchpad and click **Custom Domain**.

1. Enable public access.
2. Copy the CNAME target provided by Sealos.
3. Open your DNS provider.
4. Create a CNAME record for your domain.
5. Return to Sealos.
6. Add the custom domain.
7. Deploy or update the application.

Example DNS:

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | Sealos-provided target |
| CNAME | `app` | Sealos-provided target |

**Screenshot:** `screenshot-03-custom-domain-cname.png`  
**Caption:** Adding a custom domain to a Next.js app in Sealos.

## Step 4: Verify HTTPS

After DNS propagation, open:

```txt
https://www.example.com
```

Verify:

- The browser shows a secure lock icon.
- The certificate matches your domain.
- App redirects and OAuth callback URLs use HTTPS.
- `NEXT_PUBLIC_SITE_URL` and auth callback URLs match the final domain.

**Screenshot:** `screenshot-04-https-certificate-active.png`  
**Caption:** HTTPS-enabled Next.js app running on a custom domain.

## Step 5: Configure PostgreSQL Backups

Open the Sealos Database app and select your PostgreSQL instance.

Production backup checklist:

- Confirm the database uses persistent storage.
- Enable automatic backups where available.
- Record the backup schedule.
- Test restore on a staging database.
- Keep migration files versioned in GitHub.

Suggested backup policy:

| App Type | Backup Frequency | Retention |
|---|---:|---:|
| Small internal app | Daily | 7–14 days |
| SaaS app | Daily + pre-release snapshot | 14–30 days |
| High-change app | Multiple times per day | 30+ days |

**Screenshot:** `screenshot-05-postgresql-backup-settings.png`  
**Caption:** PostgreSQL backup configuration in Sealos Database.

## Step 6: Add Persistent Storage for Runtime Files

Next.js apps that handle uploads, generated PDFs, exports, or local media need persistent storage.

Add a persistent volume in App Launchpad:

| Use case | Mount path |
|---|---|
| Uploads | `/app/uploads` |
| Exports | `/app/exports` |
| Generated assets | `/app/storage` |

Store long-lived media in object storage when the app serves user-uploaded files at scale.

**Screenshot:** `screenshot-06-production-persistent-volume.png`  
**Caption:** Persistent volume configuration for a production Next.js app.

## Step 7: Configure Monitoring and Logs

Open the application detail page and check:

- CPU usage
- Memory usage
- Pod status
- Replica status
- Application logs
- System events
- Restart count
- Public endpoint response

Recommended production checks:

| Signal | Healthy Pattern |
|---|---|
| CPU | Stable under normal traffic |
| Memory | No steady climb across time |
| Restarts | Rare and explainable |
| Logs | No repeated uncaught exceptions |
| Events | No scheduling or pull errors |
| Latency | Stable for main pages and API routes |

**Screenshot:** `screenshot-07-monitoring-logs-events.png`  
**Caption:** Monitoring, logs, and events for a Next.js production deployment.

## Step 8: Configure Replicas and Autoscaling

Start with:

| Traffic Level | Replicas | CPU | Memory |
|---|---:|---:|---:|
| Small project | 1 | 0.5–1 core | 512 MiB–1 GiB |
| Production starter | 2 | 1 core | 1–2 GiB |
| Growing SaaS | 2+ with autoscaling | 1–2 cores | 2+ GiB |

Enable autoscaling when traffic changes significantly during the day. Use CPU and memory thresholds that match real app behavior.

**Screenshot:** `screenshot-08-nextjs-autoscaling.png`  
**Caption:** Replica and autoscaling settings for Next.js hosting on Sealos.

## Step 9: Configure Atomic Rollback

A safe production deployment needs a verified rollback path.

For a Next.js app on Sealos, use a versioned release flow:

1. Keep every production release tied to a Git commit.
2. Deploy a new version through S2I.
3. Wait for the app to pass health checks.
4. Keep the previous version available.
5. If the new version fails, switch traffic back to the previous known-good release.
6. For database-backed apps, create a pre-release database backup or snapshot before migrations.
7. Store migration rollback notes with each release.

Atomic rollback checklist:

| Item | Required Action |
|---|---|
| App image | Keep previous release available |
| Git commit | Tag production releases |
| Database | Take a backup before schema changes |
| Persistent files | Use persistent volume snapshots where available |
| Health check | Verify `/api/health` before traffic switch |
| Data rescue | Export new user data before destructive rollback |

Example release note:

```md
Release: 2026.05.18-nextjs-prod
Git commit: abc123
Database migration: 20260518_add_billing_table
Pre-release backup: pg-backup-20260518-0900
Health check: /api/health
Rollback target: 2026.05.17-nextjs-prod
```

**Screenshot:** `screenshot-09-versioned-release-rollback.png`  
**Caption:** Versioned release and rollback target for a production Next.js app.

## Step 10: Run a Final Production Smoke Test

Before announcing the release, test:

- Homepage loads through the custom domain
- HTTPS works
- Login and session flow works
- API routes respond
- Database read/write works
- File upload works when used
- Logs show successful requests
- Monitoring shows stable CPU and memory
- Previous release is available for rollback

Example health endpoint:

```ts
// app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'nextjs',
    timestamp: new Date().toISOString()
  });
}
```

**Screenshot:** `screenshot-10-final-production-smoke-test.png`  
**Caption:** Final production smoke test for a Next.js app on Sealos.

## Common Errors and Fixes

### 1. Custom domain still opens the default Sealos address

**Cause:** DNS propagation is still in progress, or the CNAME value differs from the Sealos target.

**Fix:**

Check DNS:

```bash
dig www.example.com CNAME
```

Then confirm the CNAME value matches the Sealos-provided target.

### 2. HTTPS certificate is pending

**Cause:** DNS has yet to resolve to the expected target or the domain was added before propagation completed.

**Fix:**

Confirm DNS first, then redeploy or update the domain setting in Sealos.

### 3. Production build passes, login callback fails

**Cause:** Auth callback URLs still point to a preview or old domain.

**Fix:**

Update:

```bash
NEXTAUTH_URL=https://www.example.com
NEXT_PUBLIC_SITE_URL=https://www.example.com
```

Then redeploy.

### 4. App memory grows after deployment

**Cause:** Server-side code keeps large objects, unbounded caches, or long-lived database clients per request.

**Fix:**

Review memory-heavy code, reuse database clients, set cache limits, and increase memory while investigating.

### 5. Rollback restores the app while database schema is newer

**Cause:** A schema migration changed the database after the previous app version was released.

**Fix:**

Pair every app release with a database backup and migration note. Restore the compatible backup or run a forward-compatible migration before switching traffic.

## Next Steps

- Beginner guide: `/guides/s2i/deploy-nextjs-sealos`
- Full-stack guide: `/guides/s2i/nextjs-postgresql-sealos`
- Apply this same structure to React, Vue, Nuxt, Angular, Svelte, Astro, Remix, Node.js, NestJS, Django, Flask, FastAPI, Laravel, Spring Boot, Rails, Go, and Rust.
