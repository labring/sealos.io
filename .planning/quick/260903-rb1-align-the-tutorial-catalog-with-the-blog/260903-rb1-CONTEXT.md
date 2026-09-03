# Quick Task 260903-rb1: Align the Tutorial Catalog with the Blog - Context

**Gathered:** 2026-09-03
**Status:** Ready for planning

<domain>
## Task Boundary

Align the Tutorial Catalog with the Blog visual system while preserving its
learning-path matrix, published tutorial behavior, request capture, and detail
page scope.

</domain>

<decisions>
## Implementation Decisions

### Information architecture
- Keep the Tutorial Catalog as a learning-path and framework matrix surface.
- Keep the three stages, framework opportunities, status states, and request
  entry behavior.

### Blog visual system
- Reuse `PageTopRays`, `GradientText`, semantic theme tokens, container rhythm,
  existing buttons, and a shared content-index title component.
- Preserve the current Blog rendered result.

### Hero and supporting sections
- Use a compact centered Blog-style header with one primary Django Core action.
- Remove the screenshot and three hero statistic cards.
- Keep three stage cards with stage intent, outcome, and a primary entry.
- Move status counts into the matrix heading area.
- Replace the large request panel with a lightweight matrix-adjacent Contact
  link while keeping per-cell request analytics and mailto behavior.

### Matrix and responsive behavior
- Use a flat editorial matrix with a light container border, row separators,
  and status accents.
- Stack each framework's three stages vertically on mobile through CSS layout.

</decisions>

<specifics>
## Specific Ideas

Use the existing dark-mode route behavior and Blog's restrained blue-cyan
accent. Keep visible keyboard focus and the current semantic labels.

</specifics>

<canonical_refs>
## Canonical References

- `CONTEXT.md` — Tutorial Catalog and tutorial publishing vocabulary.
- `docs/tutorial-detail-ui-contract.md` — shared typography, colors, focus,
  and accessibility expectations for tutorial surfaces.

</canonical_refs>
