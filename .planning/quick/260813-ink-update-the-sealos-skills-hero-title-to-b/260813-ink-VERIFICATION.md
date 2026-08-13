---
quick_id: 260813-ink
status: passed
---

# Verification: Update the Sealos Skills Hero title and Agent logos

## Automated checks

- `node --test tests/sealos-skills-page.test.ts` — 14/14 passed.
- `npm exec --offline --yes tsx -- --test tests/rybbit-cta.test.ts` — 4/4 passed.
- `npm run lint` — passed.
- `npm run build` — passed; static export generated successfully.
- `npm run default-locale:check` — passed.
- `npm run static-routes:check` — passed.
- `npm run static-output:check` — passed.
- `git diff --check` — passed.
- Localized Agent route audit — 18/18 output pages present.
- Agent asset audit — 9/9 assets present and transparent-canvas checks passed.

## Browser checks

- Desktop Hero renders the centered terminal and rotating Agent logo title.
- Mobile Hero wraps naturally, keeps all nine Agent navigation items, and reports zero horizontal overflow.
- Accessible heading exposes the current Agent name, including rotation updates.
- Reduced-motion mode holds the first Agent and keeps page overflow at zero.

## Residual notes

- The build retains existing Browserslist and native `sharp`/`canvas` warnings from repository tooling; they do not fail validation.
