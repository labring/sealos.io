# Quick Task 260813-gu4: Recenter the Sealos Skills Hero - Context

**Gathered:** 2026-08-13
**Status:** Locked for implementation

## Task Boundary

Recenter the Sealos Skills Hub Hero around a centered macOS-style Codex install
terminal and a visual rotation through all nine Agent Guide logos. Preserve
existing copy, content data, routes, schemas, analytics, commands, and every
section below the Hero.

## Decisions

- Use a single-column centered Hero on the Homepage's plain `bg-background`.
- Keep the accessible heading text as `Deploy from your coding agent. See the proof.`; replace only the visual phrase with an `aria-hidden` logo window.
- Derive logo order from `AGENT_GUIDES`; start on Codex and rotate every 2.4 seconds with a 320ms vertical slide.
- Pause rotation on hover, keyboard focus, document hidden state, and reduced motion; reduced motion fixes Codex.
- Keep the terminal fixed on `CODEX_INSTALL_COMMAND` and `$sealos` invocation.
- Put three macOS window dots, `INSTALL FOR CODEX`, and the existing Codex copy action in the terminal header.
- Put the existing GitHub CTA below the terminal as a secondary exit.
- Render nine clickable logos below the terminal; click scrolls to the matching Hub card, whose guide link remains the detail-page route.
- Use a centered 5+4 logo layout on mobile and preserve page-level overflow at zero.
- Add one internal `agent-logo-rotator.tsx`; reuse existing `AgentMark` and `AGENT_GUIDES` data without dependencies.

## Constraints

- `content.ts` remains byte-for-byte unchanged.
- Existing Hero copy, Rybbit IDs, schemas, deep-link anchors, metadata, and
  all non-Hero sections remain stable.
