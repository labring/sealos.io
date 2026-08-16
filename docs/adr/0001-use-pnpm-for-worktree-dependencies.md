---
status: accepted
---

# Use pnpm for worktree dependencies

Codex-managed worktrees currently duplicate roughly 5.8 GB of npm dependencies,
while their `.next` directories add roughly 13.6 GB of rebuildable output and a
full static export adds another 2.3 GB per worktree. The repository will
standardize on Node 20 and pnpm 10.28.2 with the default isolated linker, a
committed `pnpm-lock.yaml`, and explicit build approval for `canvas`, `esbuild`,
and `sharp`; the shared content-addressable store gives each worktree an
independent dependency graph while reusing package data. Codex setup will reset
new worktrees to `upstream/main` before `pnpm install --frozen-lockfile`,
verification will end with `pnpm clean:worktree` removing `.next` and `out`, and
Codex will retain its default 15 managed worktrees.

## Considered options

Standard pnpm provides the required disk savings with the smallest compatibility
surface. A shared `node_modules` directory couples worktrees with different
lockfiles and native builds, the global virtual store adds ESM resolution
constraints, and PnP expands the migration across Next.js, Fumadocs, editors,
and deployment tooling.
