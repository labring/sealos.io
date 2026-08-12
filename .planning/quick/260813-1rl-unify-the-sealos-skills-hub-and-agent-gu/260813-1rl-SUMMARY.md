---
quick_id: 260813-1rl
status: complete
completed: 2026-08-13
---

# Sealos Skills visual system

## Delivered

- Added `SkillsPageShell` and applied the Homepage neutral background, Geist-compatible heading scale, zinc text hierarchy, blue emphasis, focus rings, and reduced-motion classes across the Hub and nine Agent guides.
- Rebuilt the Hub Hero around the install command, retained the Codex screenshot asset for repository continuity, and removed the screenshot from rendered Hero output.
- Converted the proof strip, Agent directory, capabilities, Quick Start, deployment evidence, and prompt examples into responsive continuous divided panels.
- Added `AgentGuideNav` with fixed deep-link anchors, `IntersectionObserver` scrollspy behavior, sticky placement, and `aria-current="location"` state.
- Preserved `content.ts`, route generation, metadata, schemas, analytics IDs, copy, install commands, invocation strings, and existing anchor IDs.
- Added source-contract assertions for the Homepage visual tokens, continuous panels, complete mobile proof, removed screenshot rendering, scrollspy, and byte-level content stability.

## Verification

- `node --test tests/sealos-skills-page.test.ts`: 13/13 passed.
- `npm exec --offline --yes tsx -- --test tests/rybbit-cta.test.ts`: 4/4 passed. The requested online `npx --yes tsx` command remained pending in this environment; the offline npm exec used the repository-resolved toolchain.
- `npm run lint`: passed.
- `npm run build`: passed; 6197 static pages generated. Build emitted existing Browserslist, native sharp/canvas duplicate-class, and transient `raw.githubusercontent.com` fetch timeout warnings.
- `npm run default-locale:check`: passed.
- `npm run static-routes:check`: passed.
- `npm run static-output:check`: passed.
- Agent route audit: 18/18 localized Hub/detail HTML outputs present and non-empty.
- `git diff --check`: passed.
- `content.ts` SHA-256: `4e7d08050b640903ba7602ffb456734f3ae623e8dda6d6efb126ea54d86dc085`.

## Browser evidence

- Hub mobile page overflow: `0`; proof grid: `179px 179px`; Agent directory: `356px`; rendered Codex screenshot references: `0`.
- Codex desktop page overflow: `0`; Quick Start: 3 columns; evidence: 3 columns; prompts: 2 columns; initial active anchor: Quick Start.
- Codex mobile page overflow: `0`; Quick Start, evidence, and prompts each collapse to one column.
- Copy interaction produced `Copied` on Hub and Codex.
- Codex scrollspy moved `aria-current="location"` from Quick Start to What gets verified after scrolling to `#evidence`.
- Screenshots are stored in `evidence/` for Hub mobile and Codex desktop/mobile viewport/full-page captures.
