---
quick_id: 260814
status: passed
---

# Verification: Rename navigation labels to Agents

- `node --test tests/sealos-skills-page.test.ts` — passed.
- `npm exec --yes tsx -- --test tests/rybbit-cta.test.ts` — passed.
- `npm run lint` — passed.
- `git diff --check` — passed.
- Header and Footer labels were checked directly; `/sealos-skills` URLs remain
  unchanged.
