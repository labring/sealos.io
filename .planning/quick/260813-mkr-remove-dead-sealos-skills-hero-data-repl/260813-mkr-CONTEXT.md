---
quick_id: 260813-mkr
status: locked
---

# Context: Remove dead Sealos Skills complexity

- Delete the unused `PAGE_COPY.hero.eyebrow` and `PAGE_COPY.hero.title` fields.
- Delete the replaced `amp.png` and `kimi.png` assets after confirming zero references.
- Remove the unused `AGENT_LOGOS.className` configuration field.
- Remove the redundant full-file `content.ts` SHA assertion while keeping semantic contract tests.
- Preserve all rendered copy, routes, analytics, schemas, and SVG assets.
