---
quick_id: 260813-ink
status: locked
---

# Context: Sealos Skills Hero title and Agent logos

## Decisions

- The visual Hero title is `Build with [Agent Logo] on Sealos` with no final
  punctuation.
- The accessible H1 includes the current Agent name, such as
  `Build with Codex on Sealos`, and stays outside an `aria-live` region.
- The existing nine-Agent rotation keeps its 2.4 second cadence, pause states,
  loop behavior, and reduced-motion Codex lock.
- `PAGE_COPY.hero.title` becomes the generic source string
  `Build with your agent on Sealos`.
- All nine Agent logos use transparent canvases in the Hero, Agent logo
  directory, and Agent cards.
- Existing shared brand assets remain available to other routes. Sealos Skills
  reuses the transparent Claude glyph and uses route-owned transparent variants
  for Qoder, CodeBuddy, Amp, and Kimi.

## Constraints

- Preserve install commands, supporting copy, metadata, schemas, routes,
  analytics IDs, terminal layout, and sections below the Hero.
- Keep page-level horizontal overflow at zero on desktop and mobile.
