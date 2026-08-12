# Sealos Skills Landing Page

This context defines the product language used by the `/sealos-skills` landing
page, its metadata, and its structured data.

## Language

**Sealos Skills**:
The open-source, plugin-first skill pack that helps coding agents prepare,
deploy, connect, update, and inspect applications on Sealos Cloud.
_Avoid_: Sealos agent, deployment bot

**Agent**:
The coding tool that loads Sealos Skills, such as Codex, Claude Code, Qoder,
Gemini CLI, or Qwen Code. Use this term in customer-facing copy.
_Avoid_: Host, runtime

**Plugin**:
A managed or packaged integration that loads the root Sealos skill source and
exposes a product entry point. Codex and Claude Code use managed plugins;
Qoder imports a packaged plugin.
_Avoid_: Extension when describing plugin integrations

**Install Path**:
The documented command or import flow used to load Sealos Skills. Most paths
target an Agent; skills.sh is a direct skill-pack distribution path.
_Avoid_: Cloud path, setup route

**Evidence**:
The inspectable artifacts and live checks produced by a workflow, including
generated `.sealos/` files, resource identities, application checks, and test
results.
_Avoid_: Agent completion message, success claim

**Verified Deployment**:
A deployment with a confirmed application URL, rollout status, logs, relevant
web setup or login checks, resource footprint, and saved run state in
`.sealos/state.json`.
_Avoid_: Deployment created, runtime shipped
