# Quick Task 260813-1rl: Sealos Skills visual system - Context

**Gathered:** 2026-08-13
**Status:** Locked for implementation

<domain>
## Task Boundary

Unify the `/sealos-skills` Hub and all nine Agent installation pages with the
current Homepage visual system. Preserve every existing page string, content
record, route, section order, deep-link anchor, schema, analytics ID, and
interaction outcome.

</domain>

<decisions>
## Implementation Decisions

### Visual foundation
- Use the Homepage `bg-background` neutral black as the static page background.
- Use neutral surfaces `#101219`, `#13151C`, and `#080A11` with white 10%
  dividers and Homepage blue utilities for emphasis.
- Use Geist for every heading and preserve normal letter spacing.
- Keep cards and outer panels at an 8px maximum radius.
- Use micro-interactions for hover, press, tabs, copy feedback, and active
  anchors. Respect reduced-motion preferences.

### Hub
- Preserve the current section order and all copy.
- Make the Hero install command the primary visual element and remove the
  Codex screenshot from the rendered page while retaining the asset.
- Render proof items as four columns on desktop and a complete two-by-two grid
  on mobile.
- Render all nine Agents at equal weight inside one continuous three-by-three
  directory panel that becomes two columns on tablet and one column on mobile.
- Render the eight capabilities as one continuous Bento panel while preserving
  existing wide and full spans.

### Agent guides
- Apply the same page shell, typography, surfaces, code styling, and controls
  to all nine detail pages.
- Convert Quick Start and Prompts from separate cards into continuous divided
  panels.
- Add an IntersectionObserver-driven sticky navigation with active-section
  styling and `aria-current="location"`.
- Keep command overflow local to code panels and keep page-level horizontal
  overflow at zero.

</decisions>

<constraints>
## Locked Constraints

- `content.ts` must remain byte-for-byte unchanged.
- No new dependencies.
- Header, Footer, metadata, JSON-LD, canonical URLs, sitemap, locale routing,
  Rybbit IDs, and public anchor IDs remain unchanged.
- The page background contains no rays, gradients, noise, or ambient effects.

</constraints>
