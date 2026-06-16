# Research Summary: Sealos Skills Tutorial Alignment

**Researched:** 2026-06-16
**Source repository:** `https://github.com/labring/sealos-skills`
**Source commit:** `c171d444cc16a7d58b5d23f1a171989a0221c211`

## Key Findings

The current upstream Sealos Skills repository is plugin-first. Tutorials should
lead with native plugin marketplace installation for Codex and Claude Code, then
present `npx plugins add` as a compatibility path.

Codex install source of truth:

```bash
codex plugin marketplace add labring/sealos-skills
codex plugin add sealos@sealos
```

Claude Code install source of truth:

```bash
claude plugin marketplace add labring/sealos-skills
claude plugin install sealos@sealos
```

Compatibility install paths remain valid:

```bash
npx plugins add https://github.com/labring/sealos-skills --target codex
npx plugins add https://github.com/labring/sealos-skills --target claude-code
```

Invocation source of truth:

- Codex CLI uses `$sealos`.
- Codex App uses `+ -> Plugins -> Sealos`.
- Claude Code uses `/sealos`.
- Direct `/sealos-deploy`, `/sealos-database`, and `/sealos-s3` entries belong
  to direct `skills.sh` usage sections.

## Deploy Workflow Findings

The current `sealos-deploy` skill describes a stateful deployment pipeline:

1. Phase 0: Preflight, local tool checks, path checks, and Sealos auth.
2. Phase 1: Assess project readiness and write `.sealos/analysis.json`.
3. Phase 2: Detect existing reusable images.
4. Phase 3: Generate or reuse a Dockerfile.
5. Phase 4: Build and push an amd64 image when needed.
6. Phase 5: Generate `.sealos/template/index.yaml`.
7. Phase 5.5: Configure required env vars and inputs.
8. Phase 6: Deploy to Sealos Cloud.
9. Phase 6.5: Runtime Truth Pass.

Runtime Truth Pass is now part of the acceptance contract. Tutorial copy should
describe verification of the actual Sealos App URL, logs, login/setup path for
web apps, authenticated paths when relevant, and a resource footprint before
the app is described as usable.

The deploy skill also supports UPDATE mode. It reads `.sealos/state.json`,
checks whether the recorded deployment still exists through `kubectl`, and can
update the existing deployment by rebuilding and setting a new image.

## Tutorial Hit List

Existing tutorials with Sealos Skills install or usage copy:

- `content/tutorials/deploy-nextjs-sealos/index.en.mdx`
- `content/tutorials/nextjs-postgresql-sealos/index.en.mdx`
- `content/tutorials/nextjs-production-deployment-sealos/index.en.mdx`

Important stale or incomplete patterns found:

- Codex and Claude install sections currently lead with `npx plugins add`.
- Multiple examples describe `$sealos` and `/sealos` correctly, but the install
  hierarchy needs native plugin-first wording.
- `.sealos/` descriptions exist and should be updated with current artifact
  responsibilities.
- Production update guidance mentions `.sealos/state.json` and should be
  aligned with current live cluster verification and UPDATE mode behavior.
- Runtime verification guidance should explicitly mention Runtime Truth Pass,
  App URL, logs, login/setup paths, authenticated checks, and footprint.

## Recommended Execution Order

1. Update install and invocation sections across all tutorials.
2. Update beginner deploy pipeline and `.sealos/` artifact explanation.
3. Update PostgreSQL full-stack deploy and verification sections.
4. Update production checklist state/update/runtime truth sections.
5. Align frontmatter FAQ and HowTo metadata.
6. Run targeted searches and `node scripts/validate-tutorials.mjs`.

## Watch Outs

- Keep host-specific command claims narrow: context-only hosts such as Gemini
  CLI and Qwen Code provide repository context and should not be described as
  slash-command hosts.
- Keep direct `/sealos-deploy` examples in `skills.sh` context.
- Keep compatibility install commands available for cross-host installers and
  local testing.
- Avoid replacing article-specific Next.js, PostgreSQL, and production content
  with generic plugin documentation.
