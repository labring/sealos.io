---
title: 'The End of "Works on My Machine": Achieving 100% Reproducible Builds with DevBox'
imageTitle: 100% Reproducible Builds with DevBox
description: 'Explore how DevBox enables fully reproducible builds, eliminating "works on my machine" issues. Learn practical steps to achieve 100% reproducibility across diverse environments.'
date: 2025-09-12
tags:
  [
    "devops",
    "reproducible-builds",
    "devbox",
    "environment-management",
    "ci-cd",
    "software-packaging",
  ]
authors: ["default"]
---

If you’ve ever lost a day to “it works on my machine,” you’re not alone. Mysterious version mismatches, “missing” dependencies, and subtle OS differences have haunted software teams for decades. The good news: those days are numbered. With DevBox, you can make your developer environments and builds reproducible across laptops, CI, and production—no guesswork, no snowflake machines, and no yak shaving.

This article explains what DevBox is, why reproducibility matters, how DevBox works under the hood, and how to apply it in real projects. We’ll walk through practical examples and show how to integrate DevBox with CI, containers, and remote development environments so your team can deliver faster with less friction.

## What Is DevBox?

DevBox is a per-project, reproducible development environment tool built on Nix, the purely functional package manager famous for its deterministic builds and isolated dependency graphs. DevBox lets you:

- Declare your environment (tools, language runtimes, and services) in a simple devbox.json file
- Pin exact versions, generating a lockfile so the environment is reproducible for every teammate and in CI
- Enter an isolated shell or run commands in the environment without polluting your global system
- Generate Dockerfiles and editor configs (like VS Code devcontainers) to unify local and containerized workflows

Think of DevBox as an “environment as code” layer that’s faster to pick up than raw Nix, while retaining Nix’s determinism, isolation, and huge package ecosystem.

### Why Not Just Use Docker?

Docker is great for packaging and deploying applications, but it isn’t a silver bullet for developer onboarding or cross-OS parity. Many teams still develop locally and only containerize for production, which reintroduces drift. Others try to do everything in containers and hit friction in areas like file I/O performance on macOS/Windows, GPU access, or IDE integration.

DevBox complements Docker. It gives you a reproducible environment for local development and CI that can generate a Dockerfile when you need to ship. You get one source of truth for toolchains across laptops, CI, and images.

## Why Reproducible Builds Matter

Reproducibility is more than convenience. It impacts speed, quality, and security across the SDLC.

- Faster onboarding: New team members can “clone and go”—no arcane setup docs or inconsistent versions.
- Less CI flakiness: Deterministic environments reduce intermittent build failures caused by dependency drift.
- Consistent local vs production: Eliminate “but it passes locally” differences by pinning runtimes and tools.
- Improved incident response: Rebuild past versions exactly to reproduce and fix bugs.
- Supply chain security: Locked, content-addressed dependencies reduce exposure to malicious or compromised packages.
- Compliance and auditability: Traceability of dependencies and deterministic rebuilds support regulatory requirements.

## How DevBox Achieves Reproducibility

DevBox leverages Nix’s core strengths and adds developer-friendly ergonomics.

- Pinned dependencies
  - You list packages (e.g., nodejs@18, python@3.11) in devbox.json.
  - DevBox generates a devbox.lock file to pin exact versions and their transitive dependencies.
- Isolated environments
  - Dependencies are installed into the Nix store and don’t touch system-level package managers.
  - Multiple projects can coexist with different versions without conflicts.
- Hermetic builds (where possible)
  - Nix’s build sandboxing limits impurity from the host (e.g., PATH pollution), reducing “randomness.”
- Cross-platform consistency
  - The same devbox.json works on macOS (including Apple Silicon), Linux, and WSL (Windows).
- Single source of truth
  - The devbox.json file defines packages, environment variables, shell hooks, and scripts that are shared across your team and CI.

### The Files That Matter

- devbox.json — Your environment manifest (packages, scripts, env vars).
- devbox.lock — Automatically generated lockfile that pins exact versions (committed to version control).

## Quick Start: From Zero to Reproducible Dev Environment

Let’s create a small project to see DevBox in action.

### Install DevBox

On macOS or Linux:

```bash
curl -fsSL https://get.jetify.com/devbox | bash
# Restart your shell or source your profile to add DevBox to PATH
```

On CI, you can run the same installer in a step.

### Initialize a Project

```bash
mkdir myapp && cd myapp
devbox init
```

This creates a minimal devbox.json. Now add packages:

```bash
# Example: Node.js and pnpm
devbox add nodejs@18 pnpm@8
```

You can now enter an isolated shell that has Node 18 and pnpm available:

```bash
devbox shell
node -v
pnpm -v
exit
```

Alternatively, run commands without entering a shell:

```bash
devbox run -- node -v
devbox run -- pnpm -v
```

DevBox generates a devbox.lock that pins the exact toolchain. Commit both files.

### A More Complete devbox.json Example

Here’s a multi-language environment with scripts and environment variables:

```json
{
  "packages": ["nodejs@18", "pnpm@8", "python@3.11", "poetry", "postgresql"],
  "env": {
    "PYTHONUNBUFFERED": "1",
    "NODE_ENV": "development"
  },
  "shell": {
    "init_hook": [
      "echo 'Welcome to DevBox – reproducible dev env activated'",
      "export PIP_DISABLE_PIP_VERSION_CHECK=1"
    ],
    "scripts": {
      "test:py": "pytest -q",
      "test:js": "pnpm test",
      "format": "pnpm prettier --write . && black .",
      "db:start": "pg_ctl -D $PWD/.pgdata -l $PWD/.pg.log start || initdb -D $PWD/.pgdata && pg_ctl -D $PWD/.pgdata -l $PWD/.pg.log start"
    }
  }
}
```

Now you can run:

```bash
# Install and lock dependencies (optional; DevBox also does this lazily)
devbox install

# Use scripts defined in devbox.json
devbox run test:py
devbox run test:js
devbox run db:start
```

Everything is reproducible across teammates and CI because the tool versions are locked.

## Practical Examples

### Example 1: Python Service with Poetry

1. Create the environment:
   ```bash
   devbox init
   devbox add python@3.11 poetry
   ```
2. Initialize your project:
   ```bash
   devbox run -- poetry init -n
   devbox run -- poetry add fastapi uvicorn
   ```
3. Run your app:
   ```bash
   devbox run -- poetry run uvicorn myapp:app --reload
   ```
   All team members get the exact same Python and Poetry versions, making issues like “works with Python 3.10 but not 3.11” disappear.

### Example 2: Node + Turbo Repo Monorepo

1. Add Node and pnpm:
   ```bash
   devbox add nodejs@18 pnpm@8
   ```
2. Configure scripts in devbox.json:
   ```json
   {
     "packages": ["nodejs@18", "pnpm@8"],
     "shell": {
       "scripts": {
         "bootstrap": "pnpm install",
         "build": "pnpm -r build",
         "test": "pnpm -r test"
       }
     }
   }
   ```
3. Run your workflows:
   ```bash
   devbox run bootstrap
   devbox run build
   devbox run test
   ```

### Example 3: Local Postgres for Integration Tests

You can use Postgres from Nix without global installs:

```bash
devbox add postgresql
devbox run -- initdb -D .pgdata
devbox run -- pg_ctl -D .pgdata -l .pg.log start
devbox run -- createdb mydb
devbox run -- psql -d mydb -c "select 'ok';"
```

The database is local to your project directory. Teammates can reproduce the exact setup with identical binaries.

## DevBox + Docker: Reproducible Images from the Same Source of Truth

DevBox can generate a Dockerfile based on your devbox.json, aligning local and containerized environments.

```bash
devbox generate dockerfile
```

This produces a Dockerfile that installs the exact pinned packages. You can then build:

```bash
docker build -t myapp:devbox .
```

Advantages:

- Single source of truth: One manifest for both local dev and containers
- Less drift: No more hand-maintained Dockerfiles diverging from local setup
- Faster builds: Nix’s binary caches speed up CI and local rebuilds

For teams using VS Code devcontainers, you can also generate that config:

```bash
devbox generate devcontainer
```

Now your editor’s containerized environment matches the local and CI environment exactly.

## CI/CD Integration

CI should run in the exact environment your developers use. With DevBox, that’s straightforward.

### GitHub Actions Example

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install DevBox
        run: curl -fsSL https://get.jetify.com/devbox | bash

      - name: Restore Nix cache (optional, Cachix)
        uses: cachix/cachix-action@v12
        with:
          name: your-cachix-cache
          authToken: ${{ secrets.CACHIX_AUTH_TOKEN }}

      - name: Prepare environment
        run: devbox install

      - name: Run tests
        run: devbox run test

      - name: Build Docker image (optional)
        run: |
          devbox generate dockerfile
          docker build -t myorg/myapp:${{ github.sha }} .
```

Notes:

- devbox install pre-fetches dependencies so subsequent steps run faster.
- For large projects, consider a binary cache (e.g., Cachix) to speed up CI rebuilds.
- By pinning in devbox.lock, you guarantee deterministic CI runs across PRs and branches.

### GitLab, Jenkins, and Others

The pattern is the same:

- Install DevBox
- Run devbox install to realize the environment
- Run your scripts (devbox run <script> or devbox run -- <cmd>)
- Optionally generate Dockerfiles for consistent images

## How DevBox Compares to Alternatives

| Approach                | Reproducibility | Host Pollution | Multi-OS Parity | Learning Curve | Performance (local dev) | Single Source of Truth |
| ----------------------- | --------------- | -------------- | --------------- | -------------- | ----------------------- | ---------------------- |
| Global package managers | Low             | High           | Medium          | Low            | High                    | No                     |
| pyenv/rbenv/asdf        | Medium          | Medium         | Medium          | Medium         | High                    | Partial                |
| Docker-only dev         | Medium–High     | Low            | High            | Low–Medium     | Variable (FS I/O costs) | Often separate         |
| Raw Nix/Flakes          | High            | Low            | High            | High           | High                    | Yes                    |
| DevContainers           | Medium–High     | Low            | High            | Low–Medium     | Variable                | Separate devcontainer  |
| DevBox (Nix-based)      | High            | Low            | High            | Low–Medium     | High                    | Yes                    |

DevBox hits a sweet spot: most of Nix’s reproducibility with a far gentler UX, plus first-class integrations for Docker and editors.

## Advanced Features and Patterns

### Scripts as First-Class Workflows

Define team-wide workflows in devbox.json so everyone uses the same incantations:

```json
{
  "shell": {
    "scripts": {
      "lint": "ruff check . && eslint .",
      "test": "pytest -q && pnpm -r test",
      "migrate": "alembic upgrade head"
    }
  }
}
```

Then run with:

```bash
devbox run lint
devbox run test
devbox run migrate
```

This standardizes commands across different OS and shells.

### Environment Variables and Secrets

Use env in devbox.json for non-sensitive defaults. For secrets, rely on your CI secret management or local .env files sourced in init_hook:

```json
{
  "env": {
    "APP_ENV": "dev"
  },
  "shell": {
    "init_hook": ["[ -f .env ] && set -a && . ./.env && set +a || true"]
  }
}
```

Now .env isn’t committed, but gets loaded locally in a consistent manner.

### Services for Local Dev

Package-managed services like PostgreSQL, Redis, or MinIO can be added via DevBox. Keep all service binaries consistent across teammates. For complex orchestration or multi-service stacks, generate a Dockerfile or use docker-compose while still maintaining a single source of truth via devbox.json.

### Multi-Project and Monorepos

- Put a devbox.json in each service directory. Each service can pin its own toolchains while sharing organization-wide conventions.
- Create a root-level devbox.json for monorepo-wide tooling (linters, bundlers, task runners).
- DevBox isolates environments per directory, avoiding cross-service pollution.

### Pinning and Updates

- devbox.lock ensures deterministic installs. Commit it.
- To update, bump versions in devbox.json and run devbox install. Review lockfile changes in your PR for transparency.

### Hermetic Builds and Non-Determinism

Even with a pinned environment, some builds can be non-deterministic due to:

- Timestamps or time-dependent behavior
- Network access during build
- Random seeds not fixed
- CPU-specific optimizations

Mitigations:

- Use reproducible build flags where available (e.g., SOURCE_DATE_EPOCH)
- Vendor dependencies or rely on Nix fetchers with pinned hashes
- Disable network access during builds when possible
- Set deterministic seeds in tests and compilers

DevBox reduces the surface area of nondeterminism; you can eliminate the rest with good build hygiene.

## Security and Supply Chain Considerations

- Content-addressed store: Nix computes hashes for dependencies, making it harder for tampering to go unnoticed.
- Immutable pins: devbox.lock fixes versions and source hashes, reducing “drive-by” updates.
- SBOMs and scanning: Because the environment is deterministic, generating Software Bill of Materials (SBOM) and running vulnerability scans is more reliable and repeatable.
- Verified builds: Combined with a binary cache you control, you can promote artifacts through environments with confidence.

## Using DevBox with Remote Development

Whether your team prefers local laptops or cloud workspaces, reproducibility matters.

- Local-first: Run DevBox directly on macOS, Linux, or WSL without global installs.
- Containerized dev: Generate a devcontainer.json for VS Code, or a Dockerfile for hosted dev environments.
- Cloud-native workspaces: Platforms like Sealos (sealos.io) make it easy to spin up ephemeral Kubernetes workspaces with persistent storage. Running DevBox inside these cloud workspaces gives every engineer the same pinned toolchain with on-demand compute and no laptop heat. DevBox ensures the environment is identical locally and in the cloud; Sealos ensures it’s available anywhere with a browser.

This hybrid approach lets you develop locally when convenient and burst into the cloud for heavier workloads—without environment drift.

## Putting It All Together: A Real-World Workflow

Consider a monorepo with a FastAPI backend and a React frontend.

1. Repository layout:
   - backend/
     - devbox.json pins python@3.11, poetry, postgresql
   - frontend/
     - devbox.json pins nodejs@18, pnpm@8
   - devbox.json at repo root for shared tooling (e.g., pre-commit, eslint/ruff)
2. Local dev:
   - Backend: devbox run -- poetry run uvicorn app.main:app --reload
   - Frontend: devbox run -- pnpm dev
   - Postgres: devbox run -- pg_ctl -D .pgdata -l .pg.log start
3. CI:
   - Check out repo, install DevBox, devbox install per service
   - Run devbox run test in each service directory
   - Generate Dockerfiles from devbox.json and build images for consistent staging/prod
4. Remote:
   - Spin up a cloud workspace (e.g., on Sealos) with the repo
   - Install DevBox and run the same devbox run commands in a browser-based IDE
   - Share reproducible runs between local and remote without drift

Benefits:

- Every contributor uses the same toolchains and workflows
- CI is deterministic and mirrors local dev
- Docker images are generated from the same source of truth
- Switching between local and cloud dev is seamless

## Best Practices Checklist

- Commit devbox.json and devbox.lock
- Define common scripts in devbox.json and use devbox run in docs and CI
- Prefer pinned versions (nodejs@18, python@3.11, etc.)
- Avoid network access during build steps when possible
- Use binary caches (e.g., Cachix) for faster CI
- Generate Dockerfiles and devcontainers from DevBox to prevent drift
- Document the “one-liner” onboarding: curl … | bash && devbox install && devbox run bootstrap
- For secrets, use CI secret managers and local .env files loaded via init_hook

## Troubleshooting Tips

- Command not found after add: Try devbox install or re-enter devbox shell.
- Apple Silicon differences: DevBox handles multi-arch Nix packages, but some niche binaries may not be available for a given arch. Consider Rosetta or alternative packages when needed.
- Slow first install: The first realization compiles or downloads binaries. Subsequent builds are cached. Use a binary cache in CI to speed things up.
- Conflicting system tools: Ensure you’re running commands via devbox run or within devbox shell to avoid PATH conflicts.

## A Note on “100% Reproducible”

In practice, DevBox delivers deterministic dev environments and highly reproducible builds. Absolute mathematical reproducibility can still be affected by factors like CPU flags, non-deterministic compilers, or time-based artifacts. For most teams and projects, DevBox gets you as close to 100% as you’ll need—eliminating the “works on my machine” class of problems and dramatically reducing CI flakiness and onboarding friction.

## Conclusion

“Works on my machine” is a symptom of environmental drift—different tool versions, OS quirks, and undocumented setup steps. DevBox ends that by turning your environment into versioned code: pinned, isolated, and shareable across laptops, CI, and containers.

- It’s simple: define packages and scripts in devbox.json
- It’s deterministic: devbox.lock pins exact versions and transitive dependencies
- It’s flexible: run locally, in containers, or in cloud workspaces like Sealos
- It’s fast: Nix’s binary caches accelerate builds everywhere

Adopting DevBox gives your team a single source of truth for environments, consistent builds, and a smoother path from laptop to production. The result: less time debugging machines, more time shipping software.
