---
title: "Setting Up a Collaborative Python Data Science Environment with DevBox"
imageTitle: "DevBox: Collaborative Python Data Science"
description: "This guide walks you through setting up a shared Python data science workspace using DevBox, ensuring consistent environments across the team. Learn how to manage dependencies, notebooks, and version control for seamless collaboration."
date: 2025-09-06
tags: ["python", "data-science", "devbox", "collaboration", "environment-setup"]
authors: ["default"]
---

Modern data science teams juggle Python versions, OS differences, notebook quirks, and a zoo of native dependencies. Onboard a new collaborator and you’ll often hear: “It works on my machine.” Weeks later, the same project behaves differently in CI or production. If you’ve felt the pain, this guide will show you how to turn the chaos into a smooth, reproducible, collaborative workflow using DevBox—a Nix-powered tool for creating consistent developer environments.

By the end, you’ll have a fully reproducible Python data science stack that:

- Onboards teammates in minutes, not days
- Keeps notebooks, linters, and tests in sync
- Works the same on macOS and Linux
- Scales to containers and the cloud when you need it

Let’s dive in.

---

## What Is DevBox?

DevBox is a developer tool that uses the Nix package manager under the hood to create isolated, reproducible environments on a per-project basis. You declare what you need (e.g., Python 3.11, Git, SQLite, DuckDB), and DevBox:

- Downloads and configures those exact versions, isolated from your system
- Produces a lock file to pin versions across the team
- Exposes a predictable environment through a shell or scripts

In practice:

- You track only a few small config files in Git (devbox.json and devbox.lock)
- Teammates run devbox init/DevBox commands and get the same environment
- No more OS-specific brew/apt instructions, no more “works on my laptop” differences

DevBox can also generate a Dockerfile from your environment for containerized workflows and integrates nicely with direnv, VS Code, and CI systems.

---

## Why a Collaborative Data Science Environment Matters

Data science projects benefit from DevBox’s repeatability and structure. Here’s why:

- Reproducibility across time and machines. An experiment from six months ago should run today without dependency roulette.
- Faster onboarding. Newcomers can get up and running with a single command instead of following a multi-page setup doc.
- Cross-platform consistency. DevBox abstracts away the macOS vs. Linux package pain.
- Collaboration-friendly notebooks. Tools like Jupytext and pre-commit hooks keep notebooks in sync and diffs readable.
- Quality and security. Linting, formatting, testing, and pinned dependencies reduce drift and risk.

---

## How DevBox Works (High-Level)

- Packages from Nixpkgs: DevBox installs system-level packages (like Python, Git, SQLite) from a huge, reproducible catalog.
- Project isolation: Each project’s environment is defined in devbox.json and locked with devbox.lock.
- Shells and scripts: Access your environment interactively with devbox shell or run predefined commands with devbox run.
- Integrations: With direnv, the environment activates automatically when you cd into the project. VS Code settings and Dockerfiles can be generated from DevBox config.

---

## What We’ll Build

We’ll set up a collaborative Python data science stack with:

- Python 3.11
- uv (fast Python package & environment manager)
- JupyterLab + ipykernel + Jupytext
- Core libs: numpy, pandas, scikit-learn, matplotlib, seaborn, duckdb
- Tooling: ruff (lint/format), black, pytest, pre-commit, nbstripout, git-lfs
- Optional services: SQLite and DuckDB locally; Postgres in dev
- Automation: scripts for notebooks, linting, and tests
- CI and containerization ready

---

## Prerequisites

- Git installed
- macOS or Linux
- Optional: direnv for automatic environment activation in a project directory
- Install DevBox:
  - macOS (Homebrew): brew install jetpack-io/devbox/devbox
  - Shell installer: curl -fsSL https://get.jetpack.io/devbox | bash

---

## Step 1: Initialize a Project and DevBox

Create and initialize your project:

```bash
mkdir ds-collab-devbox && cd ds-collab-devbox
git init
devbox init
```

This creates devbox.json and devbox.lock (after you add packages). Commit devbox.json to your repo; devbox.lock should also be committed for consistency across the team.

Add base packages:

```bash
devbox add python@3.11 uv git git-lfs sqlite duckdb openssl
```

What these do:

- python@3.11: System-level Python runtime
- uv: Fast Python package manager and virtualenv creator (great for teams)
- git, git-lfs: Source control and large file support
- sqlite, duckdb: Lightweight local data stores
- openssl: Avoids missing crypto headers for Python packages that need SSL

Optional: If you plan to experiment with Postgres locally:

```bash
devbox add postgresql
```

---

## Step 2: Structure the Project

A simple, sensible layout:

```
ds-collab-devbox/
├─ data/                 # raw and intermediate data (gitignore large outputs)
├─ notebooks/            # notebooks paired with .py via Jupytext
├─ src/                  # Python package/code
├─ tests/                # test suite
├─ pyproject.toml        # Python dependencies/config
├─ devbox.json           # DevBox config
├─ devbox.lock           # DevBox lock file (commit this)
├─ .pre-commit-config.yaml
├─ .gitignore
└─ README.md
```

---

## Step 3: Declare Python Dependencies with uv

We’ll use uv to manage Python dependencies in a local .venv. Create a pyproject.toml:

```toml
[project]
name = "ds-collab"
version = "0.1.0"
description = "Collaborative Python data science environment with DevBox"
requires-python = ">=3.11"

# App/runtime dependencies
dependencies = [
  "numpy",
  "pandas",
  "scikit-learn",
  "matplotlib",
  "seaborn",
  "jupyterlab>=4",
  "ipykernel",
  "jupytext",
  "mlflow",
  "sqlalchemy",
  "duckdb",
  "psycopg[binary]>=3.1",  # If you plan to use Postgres
]

[project.optional-dependencies]
dev = [
  "pytest",
  "ruff>=0.5",
  "black",
  "pre-commit",
  "nbstripout",
]

[tool.ruff]
line-length = 100
target-version = "py311"

[tool.jupytext]
formats = "ipynb,py:percent"
```

Create a local virtual environment and install dependencies:

```bash
# Inside the DevBox shell, uv will use the DevBox-provided Python
devbox shell
uv venv
uv sync --all-extras
```

This creates a .venv folder and installs dependencies. Commit pyproject.toml (and the lockfile uv creates, typically uv.lock) for consistency.

Tip: If you want DevBox to ensure the venv is always ready, we can automate it next.

---

## Step 4: Add DevBox Scripts and Hooks

Open devbox.json and add environment variables, an init hook, and scripts. Example:

```json
{
  "packages": [
    "python@3.11",
    "uv",
    "git",
    "git-lfs",
    "sqlite",
    "duckdb",
    "openssl"
  ],
  "env": {
    "PYTHONUTF8": "1",
    "UV_PROJECT_ENVIRONMENT": ".venv"
  },
  "shell": {
    "init_hook": [
      "test -d .venv || uv venv",
      "uv sync --frozen --no-progress || uv sync --no-progress",
      "echo 'DevBox: virtualenv ready (.venv)'"
    ],
    "scripts": {
      "notebook": "uv run jupyter lab --NotebookApp.token='' --NotebookApp.disable_check_xsrf=True",
      "lint": "uv run ruff check . && uv run ruff format .",
      "test": "uv run pytest -q",
      "precommit": "uv run pre-commit run --all-files"
    }
  }
}
```

What this does:

- Ensures a .venv exists and dependencies are installed whenever you enter devbox shell
- Provides reusable commands:
  - devbox run notebook
  - devbox run lint
  - devbox run test
  - devbox run precommit

Optional but recommended: integrate direnv so the environment is loaded automatically when entering the project directory.

```bash
devbox generate direnv
direnv allow
```

This writes an .envrc file that tells direnv to load DevBox.

---

## Step 5: Make Notebooks Collaborative

Notebooks and Git don’t mix well by default. Use Jupytext to pair notebooks with Python files (easy diffs) and nbstripout to clear outputs before commits.

.pre-commit-config.yaml:

```yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.6.5
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format

  - repo: https://github.com/kynan/nbstripout
    rev: 0.7.1
    hooks:
      - id: nbstripout

  - repo: https://github.com/mwouts/jupytext
    rev: v1.16.1
    hooks:
      - id: jupytext
        args: [--sync]
```

Enable hooks:

```bash
devbox run -- pre-commit install
```

Now, when teammates commit notebooks, outputs are removed and .ipynb stays in sync with a .py representation (percent format).

To create a paired notebook:

```bash
devbox run -- jupytext --set-formats ipynb,py:percent notebooks/experiment.ipynb
```

Or create a new notebook in JupyterLab and pair it via the Jupytext menu.

---

## Step 6: Test the Setup

Start JupyterLab:

```bash
devbox run notebook
```

In a new notebook cell, try:

```python
import numpy as np, pandas as pd, duckdb
import sklearn, seaborn as sns, matplotlib.pyplot as plt

df = pd.DataFrame({"x": np.random.randn(1000)})
print(df.describe())

duckdb.sql("SELECT avg(x) as avg_x FROM df").show()
```

Run linters and tests:

```bash
devbox run lint
devbox run test
```

---

## Step 7: Using Databases and Data Services

Local development often requires databases or object stores. A few options:

- SQLite: Already installed; perfect for small experiments.
- DuckDB: Great for local analytics on Parquet/CSV files.
- Postgres: You can use the postgresql package provided by DevBox or run it in Docker.

Example: Starting a local Postgres with DevBox packages

```bash
# One-time init
initdb -D .devbox/pgdata -U devbox -A trust
pg_ctl -D .devbox/pgdata -l .devbox/pg.log -o "-p 5432" start
createdb -p 5432 dev

# Connect from Python
# Make sure psycopg[binary] is installed (we added it earlier)
```

Example Python snippet for Postgres:

```python
import os
import psycopg
conn = psycopg.connect(os.getenv("DATABASE_URL", "postgresql://devbox@localhost:5432/dev"))
with conn, conn.cursor() as cur:
    cur.execute("CREATE TABLE IF NOT EXISTS t (id serial primary key, x float)")
    cur.execute("INSERT INTO t (x) VALUES (3.14)")
    cur.execute("SELECT count(*) FROM t")
    print(cur.fetchone())
```

Managing secrets and env vars:

- Never commit secrets to devbox.json
- Use direnv with a local .env file

Example .envrc:

```
use devbox
dotenv .env
```

Add .env to .gitignore and set DATABASE_URL or API keys there.

---

## Team Workflow and Best Practices

- Commit and review the right files:
  - Commit: devbox.json, devbox.lock, pyproject.toml, uv.lock, .pre-commit-config.yaml, notebooks/_, notebooks/_.py (Jupytext paired), src/, tests/
  - Don’t commit: .venv/, .env, data outputs, big artifacts (use git-lfs or DVC)
- Standardize commands: devbox run notebook, devbox run lint, devbox run test
- Use branches and PRs with pre-commit hooks ensuring clean diffs and style
- Use Git LFS for large binary files:
  ```bash
  git lfs install
  git lfs track "*.parquet"
  git add .gitattributes
  ```
- Consider DVC or similar tools if you need versioned datasets and pipelines

---

## Quick Reference: Components and Why They Matter

| Component              | Purpose                               | Why it helps teams                      |
| ---------------------- | ------------------------------------- | --------------------------------------- |
| DevBox                 | Reproducible system-level environment | Eliminates OS drift; simple onboarding  |
| Python (3.11)          | Runtime                               | Predictable interpreter across machines |
| uv                     | Python deps and venv management       | Fast installs; consistent lockfile      |
| JupyterLab + ipykernel | Notebook IDE                          | Interactive workflows                   |
| Jupytext + nbstripout  | Git-friendly notebooks                | Clean diffs, fewer merge conflicts      |
| numpy/pandas/sklearn   | Core analytics stack                  | Standard data science tooling           |
| matplotlib/seaborn     | Visualization                         | Quick plots and EDA                     |
| ruff/black             | Lint and format                       | Consistent code style                   |
| pytest                 | Testing                               | Catch regressions early                 |
| git-lfs                | Large file support                    | Track big data assets in Git            |
| sqlite/duckdb          | Local data stores                     | Zero-setup analytics                    |
| postgres (optional)    | RDBMS for dev                         | Realistic app integration scenarios     |

---

## Step 8: VS Code Integration

DevBox can generate VS Code settings to use the DevBox environment:

```bash
devbox generate vscode
```

Open the folder in VS Code; the generated settings help ensure terminals run inside DevBox. You can also point the Python interpreter to .venv/bin/python for full integration (testing, linting, Jupyter kernel).

---

## Step 9: CI Integration (Example: GitHub Actions)

Add a simple workflow to run linters and tests in CI with DevBox:

.github/workflows/ci.yml:

```yaml
name: CI

on:
  push:
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install DevBox
        run: |
          curl -fsSL https://get.jetpack.io/devbox | bash
          echo "$HOME/.local/bin" >> $GITHUB_PATH

      - name: Restore Nix cache (optional)
        uses: actions/cache@v4
        with:
          path: ~/.cache/devbox
          key: devbox-${{ runner.os }}-${{ hashFiles('devbox.lock') }}

      - name: Sync Python deps
        run: devbox run -- uv sync --all-extras

      - name: Lint
        run: devbox run -- ruff check . && devbox run -- ruff format --check .

      - name: Tests
        run: devbox run -- pytest -q
```

This workflow:

- Installs DevBox
- Restores a cache (optional but speeds up builds)
- Synchronizes Python dependencies using uv
- Runs linters and tests inside the DevBox environment

---

## Step 10: Containerize and Run in the Cloud

DevBox can generate a Dockerfile that reproduces your environment in a container:

```bash
devbox generate dockerfile
docker build -t your-org/ds-collab:latest .
docker run -it --rm -p 8888:8888 your-org/ds-collab:latest devbox run notebook
```

This makes it easy to:

- Run the same environment in CI/CD
- Share a JupyterLab instance with colleagues
- Deploy to Kubernetes

If you’re using a modern cloud platform that simplifies Kubernetes, you can push this image to a registry and run it as a shared, browser-accessible workspace. For example, on Sealos (a cloud-native platform that streamlines multi-tenant app deployment), you can:

- Build and push your image to a registry
- Create an app from the image
- Attach persistent volumes for notebooks/data
- Expose JupyterLab via HTTPS and share the URL with your team

Learn more about running containers and apps on Sealos at https://sealos.io/.

---

## Practical Tips and Patterns

- Pin everything: Commit devbox.lock and uv.lock to make environments reproducible.
- Use scripts for common tasks: devbox run notebook, devbox run test, devbox run lint. Humans remember names; machines remember commands.
- Tame notebooks: Always pair with Jupytext and strip outputs on commit. Keep heavy computations in src/ and import into notebooks.
- Data ergonomics: Keep data/ under version control sparingly; put large data behind git-lfs or in an object store.
- Secrets: Use .env + direnv locally; map environment variables in CI/CD and containers.
- Troubleshooting:
  - If Python packages need native headers (e.g., SSL), add the system package via DevBox (we added openssl).
  - If you see macOS-specific errors compiling native extensions, try adding extra build tools via DevBox (e.g., pkg-config, gcc).
  - Validate the environment with devbox shell and which python, which uv to ensure you’re using DevBox’s binaries.

---

## Example End-to-End Session

1. Clone and enter the repo:

```bash
git clone https://github.com/your-org/ds-collab-devbox.git
cd ds-collab-devbox
devbox shell
```

2. First run:

- DevBox restores system packages
- init_hook creates .venv and runs uv sync

3. Start JupyterLab and create a notebook:

```bash
devbox run notebook
```

4. Write a simple experiment in notebooks/eda.py (paired via Jupytext):

```python
# %%
import pandas as pd, seaborn as sns, matplotlib.pyplot as plt
df = sns.load_dataset("tips")
df.head()

# %%
sns.boxplot(data=df, x="day", y="total_bill")
plt.show()
```

5. Commit and push:

```bash
git add .
devbox run precommit
git commit -m "Add first EDA notebook"
git push
```

6. Teammates pull and immediately run everything with the same environment.

---

## Extending the Stack

As your project grows, consider adding:

- MLflow server for experiment tracking (run locally via devbox scripts or container)
- DVC for data and pipeline versioning
- Ray or Dask for distributed compute (install via uv and run under DevBox)
- Redis, MinIO, or Kafka as services for more realistic app workflows
- Make or Taskfile for orchestrating multi-step tasks (wrap with devbox run)

---

## Frequently Asked Questions

- Can Windows users participate?
  - DevBox is best on macOS and Linux. Windows users can develop in WSL2 or use a containerized workflow (Docker Desktop) generated by DevBox.
- Why uv instead of pip or poetry?
  - uv is fast and straightforward. It plays nicely with DevBox by using the DevBox-provided Python, while giving you a project-local venv and lockfile for Python packages.
- Should I also pin Python libraries at the Nix level?
  - Typically no. Use DevBox for system packages and uv for Python packages. This hybrid model balances reproducibility with Python ecosystem flexibility.

---

## Conclusion

A collaborative data science environment should be boring—in the best possible way. Everyone gets the same tools, the same versions, and the same commands. DevBox brings Nix’s reproducibility to your daily workflow without requiring you to learn Nix. Combine it with uv for Python dependencies, Jupytext and pre-commit for notebook hygiene, and a few standard scripts, and your team will spend less time fixing environments and more time shipping insights.

From local development to CI and cloud, the setup we built:

- Onboards teammates in minutes
- Keeps notebooks clean and diffable
- Runs identically across macOS, Linux, and containers
- Scales to platforms like Sealos when you need shared, persistent, browser-based environments

Adopt this pattern once, and you’ll never want to wrangle ad-hoc setup instructions again.
