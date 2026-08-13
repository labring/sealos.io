---
quick_id: 260813-gu4
status: passed
verified: 2026-08-13
---

# Verification

| Requirement | Result | Evidence |
|---|---|---|
| Hero uses a centered Insforge-style stack | PASS | Source contract and production HTML show centered eyebrow, title, terminal, GitHub link, logo navigation, and proof strip. |
| Terminal presents the fixed Codex install path | PASS | `data-skills-hero-command`, three macOS dots, `INSTALL FOR CODEX`, both official commands, `$sealos` invocation, and stable `skills_hero_copy_codex_install`. |
| All nine Agent logos rotate and link to Hub cards | PASS | `AGENT_GUIDES` drives the rotator and nav; browser found 9 links and verified `#agent-gemini` target scrolling. |
| Accessible heading and motion behavior remain stable | PASS | Exact `sr-only` title remains; logo window is `aria-hidden`; hover/focus/visibility pauses and reduced-motion lock are covered by source contract and browser checks. |
| Mobile layout stays complete | PASS | Browser evaluation at 390x844 reported page overflow 0 and logo rows of 5 plus 4. |
| Existing route/content/analytics contracts remain intact | PASS | 14 page tests, 4 Rybbit tests, unchanged content hash, static route checks, and 18/18 Agent artifacts. |
| Production export completes | PASS | `npm run build` generated 6197 pages and completed AI FAQ route verification. |

## Residual notes

- Build output retains existing warnings for Browserslist freshness, native
  sharp/canvas duplicate symbols, export rewrites, and intermittent external
  Markdown fetches. The export and route verification completed with exit code 0.
