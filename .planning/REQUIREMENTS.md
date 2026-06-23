# Requirements: Sealos Skills Tutorial Alignment

**Defined:** 2026-06-16
**Core Value:** Readers can install and use Sealos Skills from the tutorials
with commands and workflow expectations that match the current upstream plugin
source.

## v1.1 Requirements

### Upstream Source

- [x] **SOURCE-01**: Record the upstream `labring/sealos-skills` commit used
  for this tutorial update.

- [x] **SOURCE-02**: Extract current Codex, Claude Code, compatibility,
  context-only host, and direct `skills.sh` install guidance from upstream.

- [x] **SOURCE-03**: Extract current `sealos-deploy` pipeline guidance,
  including DEPLOY/UPDATE mode and Phase 6.5 Runtime Truth Pass.

- [x] **SOURCE-04**: Keep tutorial claims limited to host capabilities that the
  upstream README and marketplace notes claim.

### Installation Copy

- [x] **INSTALL-01**: Every tutorial Codex install section prefers
  `codex plugin marketplace add labring/sealos-skills` followed by
  `codex plugin add sealos@sealos`.

- [x] **INSTALL-02**: Every tutorial Claude Code install section prefers
  `claude plugin marketplace add labring/sealos-skills` followed by
  `claude plugin install sealos@sealos`.

- [x] **INSTALL-03**: Compatibility install snippets keep
  `npx plugins add https://github.com/labring/sealos-skills --target codex`
  and `--target claude-code` in secondary placement.

- [x] **INSTALL-04**: Tutorial host-usage copy consistently maps Codex CLI to
  `$sealos`, Codex App to `+ -> Plugins -> Sealos`, and Claude Code to
  `/sealos`.

- [x] **INSTALL-05**: Direct `/sealos-deploy`, `/sealos-database`, and
  `/sealos-s3` examples appear only in direct `skills.sh` context.

### Deploy Workflow

- [x] **DEPLOY-01**: Beginner deployment tutorial describes the current
  preflight, assessment, image detection, Dockerfile, build/push, template,
  configure, deploy, and Runtime Truth Pass sequence.

- [x] **DEPLOY-02**: Beginner deployment tutorial describes `.sealos/`
  artifacts with current responsibilities for `analysis.json`,
  `template/index.yaml`, `state.json`, optional `config.json`, and build output.

- [x] **DEPLOY-03**: PostgreSQL tutorial describes full-stack app and database
  deployment with database resource generation, app env-var wiring, migration
  planning, and runtime verification.

- [x] **DEPLOY-04**: Production checklist describes DEPLOY/UPDATE mode based on
  `.sealos/state.json` and live cluster verification.

- [x] **DEPLOY-05**: Production checklist includes Runtime Truth Pass checks for
  real App URL, logs, login/setup path, authenticated paths when relevant, and
  resource footprint.

- [x] **DEPLOY-06**: Troubleshooting guidance reflects upstream behavior around
  Sealos auth, Docker/GHCR, private image pull secrets, rollout verification,
  and state repair.

### Cross-Article Consistency

- [x] **CONSIST-01**: Frontmatter FAQ answers match updated installation and
  deploy-flow guidance.

- [x] **CONSIST-02**: Frontmatter HowTo steps match updated visible article
  steps and host-specific command syntax.

- [x] **CONSIST-03**: All three tutorial bodies use one terminology set for
  "Sealos plugin", "Sealos Skills", "Codex plugin", Runtime Truth Pass, and
  `.sealos/` state.

- [x] **CONSIST-04**: Internal links and CTA references continue to point to
  `/sealos-skills` or existing Sealos docs URLs as appropriate.

### Verification

- [x] **VERIFY-01**: Targeted searches show every tutorial reference to
  `npx plugins add`, `codex plugin`, `claude plugin`, `$sealos`, `/sealos`,
  `/sealos-deploy`, `.sealos/`, and Runtime Truth Pass is intentional.

- [x] **VERIFY-02**: `scripts/validate-tutorials.mjs` passes after content
  edits.

- [x] **VERIFY-03**: Repository lint or the narrowest available content check
  passes for touched tutorial and metadata files.

- [x] **VERIFY-04**: The final diff is scoped to tutorial content, tutorial
  metadata, and GSD planning artifacts.

## Future Requirements

### Tutorial Expansion

- **FUTURE-01**: Add tutorial screenshots that show native Codex and Claude
  plugin installation flows.

- **FUTURE-02**: Add additional framework tutorials after the Next.js tutorial
  set is verified.

- **FUTURE-03**: Add localized tutorial versions after the English source set is
  stable.

- **FUTURE-04**: Add live deployment proof notes when fresh evidence is
  captured for each tutorial path.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Sealos Skills repository changes | This milestone consumes upstream as source evidence. |
| New tutorial topic expansion | The requested outcome targets all existing tutorials. |
| Visual redesign | Current scope is content accuracy and metadata consistency. |
| Live deployment proof for every article | This milestone aligns tutorial guidance to upstream source evidence. |
| Non-English tutorial localization | Existing tutorial source files are English-only. |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SOURCE-01 | Phase 13 | Complete |
| SOURCE-02 | Phase 13 | Complete |
| SOURCE-03 | Phase 13 | Complete |
| SOURCE-04 | Phase 13 | Complete |
| INSTALL-01 | Phase 13 | Complete |
| INSTALL-02 | Phase 13 | Complete |
| INSTALL-03 | Phase 13 | Complete |
| INSTALL-04 | Phase 13 | Complete |
| INSTALL-05 | Phase 13 | Complete |
| DEPLOY-01 | Phase 14 | Complete |
| DEPLOY-02 | Phase 14 | Complete |
| DEPLOY-03 | Phase 14 | Complete |
| DEPLOY-04 | Phase 14 | Complete |
| DEPLOY-05 | Phase 14 | Complete |
| DEPLOY-06 | Phase 14 | Complete |
| CONSIST-01 | Phase 15 | Complete |
| CONSIST-02 | Phase 15 | Complete |
| CONSIST-03 | Phase 15 | Complete |
| CONSIST-04 | Phase 15 | Complete |
| VERIFY-01 | Phase 15 | Complete |
| VERIFY-02 | Phase 15 | Complete |
| VERIFY-03 | Phase 15 | Complete |
| VERIFY-04 | Phase 15 | Complete |

**Coverage:**

- v1.1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0

---
*Requirements defined: 2026-06-16*
*Last updated: 2026-06-16 after v1.1 milestone initialization*
