---
quick_id: 260812-nea
status: complete
completed: 2026-08-13
---

# Quick Task 260812-nea Summary

## Outcome

Rebuilt `/sealos-skills` as a nine-Agent directory and shipped a shared,
statically generated detail-page system for Codex, Claude Code, Gemini CLI,
OpenClaw, Qwen Code, Kimi Code, Amp, Qoder, and CodeBuddy. `skills.sh` remains a
separate distribution channel on the Hub.

## Implemented

- Added typed Agent guides with official product context, install paths,
  invocation, three-step Quick Starts, four prompts, three FAQs, resources,
  related Agents, icon sources, and deployment evidence.
- Replaced the consolidated install tabs with nine Agent cards directly after
  the Hero and one direct `skills.sh` install row.
- Added `/sealos-skills/[agent]` with localized static generation, per-Agent
  metadata, canonical URLs, HowTo, FAQPage, ItemList, and BreadcrumbList JSON-LD.
- Added local Amp and Kimi Code icons and reused the official OpenClaw favicon.
- Added Agent routes to the sitemap and the default-locale development rewrite
  manifest.
- Added unique Hub and detail-page Rybbit identifiers while preserving the
  existing install analytics identifiers.
- Tightened the mobile Hero so the Agent Directory begins within the 390x844
  first viewport and kept page-level horizontal overflow at zero.

## Verification

- `npm run lint`
- `node --test tests/sealos-skills-page.test.ts` (11 passed)
- `npx --yes tsx --test tests/rybbit-cta.test.ts` (4 passed)
- `npm run build` (6197 static pages generated)
- `npm run default-locale:check`
- `npm run static-routes:check`
- `npm run static-output:check`
- Exact static-output audit for nine default-locale and nine `/zh-cn` Agent
  pages
- `git diff --check`
- Browser QA at 1440x1000 and 390x844 for the Hub, Codex, and Gemini CLI

## Evidence

- `evidence/hub-desktop-1440x1000.png`
- `evidence/codex-desktop-1440x1000.png`
- `evidence/hub-mobile-390x844.png`
- `evidence/gemini-mobile-390x844.png`
