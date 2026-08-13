---
quick_id: 260813-ink
status: complete
---

# Summary: Update the Sealos Skills Hero title and Agent logos

Implemented the approved Hero treatment:

- The visual title now reads `Build with [Agent logo] on Sealos`.
- `PAGE_COPY.hero.title` is synchronized to `Build with your agent on Sealos`.
- The current Agent name remains available in the accessible H1 without live announcements.
- All nine Agent logo mappings use transparent SVG assets; four route-owned assets were added for Amp, CodeBuddy, Kimi, and Qoder.
- Existing rotation cadence, pause behavior, reduced-motion behavior, Hub anchors, analytics, and the Codex screenshot asset contract remain intact.

## Commits

- Code: `feat(sealos-skills): update hero title and transparent agent logos`
- Documentation: `docs(quick-260813-ink): record hero title and logo delivery`
