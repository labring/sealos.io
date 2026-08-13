---
quick_id: 260813-hsp
status: passed
---

# Verification: Improve Sealos Skills Hero top spacing

- `node --test tests/sealos-skills-page.test.ts` — 13/13 passed.
- `npm exec --yes tsx -- --test tests/rybbit-cta.test.ts` — 4/4 passed.
- `npm run lint` — passed.
- `git diff --check` — passed.
- The Hero spacing assertion confirms `pt-32 sm:pt-44` in the rendered source.
