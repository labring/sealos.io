# Pitfalls Research: Sealos Skills Tutorial Alignment

**Researched:** 2026-06-16

## Pitfalls

| Pitfall | Prevention |
|---------|------------|
| Leaving `npx plugins add` as the recommended Codex path | Lead Codex install sections with native `codex plugin marketplace add` and `codex plugin add`; keep `npx` as compatibility. |
| Overclaiming slash-command support for context-only hosts | Follow upstream marketplace guidance and keep Gemini/Qwen language to context-only support. |
| Mixing plugin entry points with direct `skills.sh` entries | Use `$sealos` and `/sealos` for plugin hosts; reserve `/sealos-deploy` for direct `skills.sh`. |
| Updating body copy while leaving stale FAQ/HowTo metadata | Treat frontmatter FAQ and HowTo as required edit surfaces. |
| Describing deploy success before runtime checks | Include Runtime Truth Pass checks for App URL, logs, login/setup, authenticated paths, and footprint. |
| Treating `.sealos/state.json` as enough for update mode | Explain that the skill verifies the recorded deployment still exists before update mode. |
| Expanding scope into new tutorials | Keep this milestone to existing tutorial files. |

## Validation Pitfalls

Targeted search should happen after edits because stale command snippets can
hide in frontmatter, FAQ answers, HowTo text, troubleshooting sections, and code
blocks.
