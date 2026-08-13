# Quick Task 260812-nea: Build Agent-specific Sealos Skills pages - Context

**Gathered:** 2026-08-12
**Status:** Implemented

<domain>
## Task Boundary

Turn the Sealos Skills landing page into an Agent directory and create one
installation and activation page for each supported coding Agent. Keep the
existing localized route shell, verified deployment narrative, Skills source,
analytics conventions, and static-export architecture.

</domain>

<decisions>
## Implementation Decisions

### Route and page scope
- Create nine detail routes from the existing stable IDs: `codex`, `claude`,
  `qoder`, `gemini`, `qwen`, `openclaw`, `codebuddy`, `amp`, and `kimi`.
- Keep `skills.sh` on the hub as a distribution channel rather than presenting
  it as an Agent.
- Generate the default and `/zh-cn` routes from the same verified English
  content in the first release.
- Use `Sealos Skills for {Agent}: Deploy to Sealos Cloud` for the SEO title,
  `Deploy to Sealos Cloud with {Agent}` for the H1, and
  `{AGENT} + SEALOS SKILLS` for the eyebrow.

### Landing-page directory
- Place the Agent Directory immediately after the hero.
- Order the directory for global developer awareness: Codex, Claude Code,
  Gemini CLI, OpenClaw, Qwen Code, Kimi Code, Amp, Qoder, CodeBuddy.
- Replace the consolidated install tabs and accordion with nine detail-page
  cards and a separate `skills.sh` distribution row.
- Keep the hero Codex copy action and the evidence-led Workflow, Capabilities,
  Setup/FAQ, and final CTA sections.

### Detail-page composition
- Follow the Insforge Agent-page information architecture with a Sealos
  deployment-evidence section in the configuration slot.
- Use a shared visual skeleton with conditional host-specific content:
  back link, official Agent introduction, copy-install CTA, integration labels,
  sticky anchor navigation, three-step Quick Start, verification evidence,
  four prompts, three Agent-specific FAQs, resources, three related Agents,
  and a final copy-install CTA.
- Use `Quick Start`, `What gets verified`, `Example prompts`, and `Resources`
  as sticky navigation labels.
- Use one CTA label, `Copy install path`, across all Agent types. The copied
  value and Quick Start steps express command, package, extension, or repository
  differences.
- End each detail page with `Copy install path` and `View source on GitHub`.

### Agent facts and content depth
- Give every Agent a substantive product introduction sourced from its official
  product site, documentation, or repository. Keep the Agent description and
  Sealos integration claims in separate paragraphs.
- Give every page two shared deployment prompts and two host-specific prompts.
- Give every page three host-specific FAQ items covering installation location,
  invocation, and updates.
- Recommend three related Agents with similar integration models.
- Show a visible Gemini CLI authentication note covering current Google
  sign-in, Gemini API key, Vertex AI, and organization-policy differences.
- Display `Kimi Code` while retaining `/sealos-skills/kimi` as the route.
- Keep Qoder package output at `dist/sealos-1.2.5.zip`.
- Use the Sealos README ClawHub command as OpenClaw's primary documented path.
- Use host-native Skills installation steps for Amp and Kimi Code.

### Visuals, SEO, and measurement
- Use one locally stored, official-source icon for every Agent and record the
  source URL in typed content.
- Preserve the dark Sealos Skills design language, 8px maximum card radius,
  accessible copy feedback, reduced-motion support, and responsive behavior.
- Derive hub `ItemList` entries and detail `HowTo`, `FAQPage`, and
  `BreadcrumbList` schemas from the same typed content used by the UI.
- Track directory opens, install copies, prompt copies, and repository visits
  with unique IDs derived from the Agent ID.

</decisions>

<specifics>
## Specific Ideas

- Reference page: https://insforge.dev/agents
- Sealos differentiation: a deploy workflow returns a live URL, rollout status,
  logs, relevant page checks, resource footprint, and saved `.sealos/state.json`.
- Detail pages have two jobs: acquire Agent-specific search traffic and drive a
  successful installation from the primary CTA.

</specifics>

<canonical_refs>
## Canonical References

- Sealos Skills source and install facts: https://github.com/labring/sealos-skills
- Insforge Agent directory and detail-page pattern: https://insforge.dev/agents
- OpenClaw Skills: https://docs.openclaw.ai/skills
- Amp Owner's Manual: https://ampcode.com/manual
- Kimi Code documentation: https://moonshotai.github.io/kimi-code/

</canonical_refs>
