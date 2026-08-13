---
quick_id: 260813-gu4
status: complete
completed: 2026-08-13
---

# Sealos Skills centered Hero

## Delivered

- Recentered the Hub Hero into an Insforge-style single-column composition.
- Added a macOS terminal frame with fixed Codex install commands, copy feedback,
  invocation text, and the existing GitHub tracking link below the terminal.
- Added a nine-logo Agent rotator with a 2.4 second cadence, 320ms vertical
  slide, hover/focus/visibility pauses, reduced-motion behavior, and a stable
  Codex install path.
- Added a centered five-plus-four mobile Agent logo directory with same-page
  anchors targeting the nine Hub cards.
- Preserved the accessible Hero heading, content source, routes, schemas,
  analytics IDs, screenshot asset, and all sections below the Hero.

## Commits

- `0964256` - `feat(sealos-skills): center hero around install terminal`
- GSD delivery record follows in the documentation commit.

## Verification

- `node --test tests/sealos-skills-page.test.ts`: 14/14 passed.
- `npm exec --offline --yes tsx -- --test tests/rybbit-cta.test.ts`: 4/4 passed.
- `npm run lint`: passed.
- `npm run build`: passed; 6197 static pages generated.
- `npm run default-locale:check`: passed.
- `npm run static-routes:check`: passed.
- `npm run static-output:check`: passed.
- Local Agent route audit: 18/18 localized Hub/detail HTML artifacts present.
- `npx prettier --check` and `git diff --check`: passed.
- `content.ts` SHA-256 stayed `4e7d08050b640903ba7602ffb456734f3ae623e8dda6d6efb126ea54d86dc085`.
- Browser QA confirmed zero page overflow at 1440x1000 and 390x844, nine
  rendered logo links, 5+4 mobile wrapping, logo jump anchors, copy feedback,
  rotation, hover pause, and reduced-motion Codex lock.

## Existing build notes

- The clean build emitted existing Browserslist, sharp/canvas duplicate-class,
  export-rewrite, and intermittent GitHub raw Markdown fetch warnings while
  completing successfully.
