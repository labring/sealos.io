# Feature Research: Sealos Skills Tutorial Alignment

**Researched:** 2026-06-16
**Source commit:** `labring/sealos-skills@c171d444cc16a7d58b5d23f1a171989a0221c211`

## Required Content Features

| Feature | Source | Tutorial Impact |
|---------|--------|-----------------|
| Native Codex plugin install | Upstream README Quick Start | Codex install sections should lead with `codex plugin marketplace add` and `codex plugin add`. |
| Native Claude Code plugin install | Upstream README Quick Start | Claude install sections should lead with `claude plugin marketplace add` and `claude plugin install`. |
| Compatibility `npx plugins add` path | Upstream README compatibility sections | Existing `npx` snippets stay as secondary fallback copy. |
| Host-specific invocation | Upstream README and marketplace notes | `$sealos` for Codex, `/sealos` for Claude Code, Codex App plugin picker for UI use. |
| Direct `skills.sh` entries | Upstream README `skills.sh` section | `/sealos-deploy` examples belong to direct skill pack usage only. |
| Stateful deploy artifacts | `skills/sealos-deploy/modules/pipeline.md` | Tutorials should explain `.sealos/analysis.json`, `.sealos/template/index.yaml`, `.sealos/state.json`, optional config, and build output. |
| DEPLOY/UPDATE mode | `skills/sealos-deploy/modules/pipeline.md` | Production checklist should explain state-based updates and live deployment verification. |
| Runtime Truth Pass | `skills/sealos-deploy/SKILL.md` and pipeline overview | Tutorials should include App URL, logs, login/setup, authenticated paths, and footprint verification. |
| Database and S3 adjacent skills | Upstream README included skills | PostgreSQL tutorial should reference full-stack database resource generation and env-var wiring through Sealos Skills. |

## Deferred Content Features

| Feature | Reason |
|---------|--------|
| New screenshots for plugin install | Useful, but the current request targets text and metadata accuracy. |
| New tutorial categories | Current milestone updates all existing tutorial articles. |
| Live deployment evidence blocks | Requires separate runtime sessions and account state. |
| Chinese tutorial localization | Existing tutorial source files are English-only. |
