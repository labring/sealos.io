---
quick_id: 260813-jve
status: passed
---

# Verification: Scale the Sealos Skills Hero Agent logos

## Automated checks

- `node --test tests/sealos-skills-page.test.ts` — 14/14 passed.
- `npm run lint` — passed.
- `git diff --check` — passed.

## Browser checks

- Insforge reference measured at 56px text / 56px logo on desktop and 36px text / 48px logo on mobile.
- Sealos measured at 56px text / 64px logo on desktop and 42px text / 52px logo on mobile.
- Amp retains its horizontal mark inside a 125px-wide desktop frame.
- Desktop and mobile horizontal overflow measured at zero.
- Reduced-motion mode remains fixed on Codex after 3.5 seconds.
