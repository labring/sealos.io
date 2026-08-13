---
quick_id: 260813-ink
status: complete
---

# Plan: Update the Sealos Skills Hero title and Agent logos

## Task 1: Add transparent route-owned logo assets

- Reuse existing transparent OpenAI, Claude, Gemini, Qwen, and OpenClaw assets.
- Add transparent Qoder, CodeBuddy, official Amp, and official Kimi SVG variants.
- Map the shared `AgentLogo` renderer to the transparent variants.

## Task 2: Update the Hero title contract

- Change the generic content title to `Build with your agent on Sealos`.
- Pass Agent name and icon pairs to the rotator.
- Render `Build with [Logo] on Sealos` visually and expose the current Agent
  name in the accessible H1 without live announcements.

## Task 3: Verify and record

- Update source-contract tests for the new title and transparent assets.
- Run focused tests, TypeScript, formatting, static checks, production build,
  and responsive browser QA.
- Record Summary and Verification artifacts and commit code/docs atomically.
