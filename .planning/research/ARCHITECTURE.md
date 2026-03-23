# Architecture Patterns

**Domain:** Deployment-focused documentation information architecture
**Project:** Sealos App Deploy docs restructure
**Researched:** 2026-03-23
**Overall confidence:** HIGH

## Recommended Architecture

Strong deployment-doc systems are usually organized as a two-layer IA:

1. A **single guided first-success path** that gets a new user from zero to a running public app with the fewest possible decisions.
2. A **task-oriented operations layer** for changes, fixes, and production hardening after the first deployment works.

That pattern shows up consistently in current official docs:

- Diataxis separates tutorials, how-to guides, reference, and explanation, and explicitly warns against mixing them.
- Kubernetes splits `Tutorials`, `Tasks`, `Concepts`, and `Reference`.
- Cloud Run leads with a deploy quickstart, then breaks out environment variables, domain mapping, deployment configuration, and troubleshooting into separate follow-up pages.
- Fly.io leads with `Getting started`, then sends users to networking, storage, and a production checklist.
- Vercel leads with `Getting started`, then branches into deployments, domains, and environment variables.

For Sealos App Deploy, the docs section should therefore be structured around **user intent**, not feature inventory. The root page should not be a flat list of knobs such as autoscaling, configmap, and ports. It should route readers into either:

- `Start here: deploy your first app`
- `I already deployed an app and need to change or fix something`

### Recommended content tree

```text
guides/app-deploy/
├── index.en.mdx                      # Router page: first deploy vs manage existing app
├── first-deploy.en.mdx               # Canonical end-to-end tutorial
├── manage/
│   ├── index.en.mdx                  # Operations hub
│   ├── domains-and-public-access.en.mdx
│   ├── environment-variables.en.mdx
│   ├── config-files.en.mdx
│   ├── persistent-storage.en.mdx
│   ├── ports-and-networking.en.mdx
│   ├── scaling.en.mdx
│   ├── update-and-redeploy.en.mdx
│   └── migrate-from-docker-compose.en.mdx
├── troubleshoot/
│   ├── index.en.mdx
│   ├── app-not-reachable.en.mdx
│   ├── domain-and-tls-failures.en.mdx
│   ├── container-startup-and-port-errors.en.mdx
│   └── config-and-storage-mistakes.en.mdx
├── reference/
│   ├── index.en.mdx
│   └── deploy-form-fields-and-behaviors.en.mdx
└── concepts/
    ├── env-vars-vs-config-files.en.mdx
    └── when-to-use-persistent-storage.en.mdx
```

This is an opinionated recommendation, not a claim that every subtree must exist on day one. The important architectural rule is:

- `first-deploy` teaches one happy path.
- `manage/*` solves one operational job per page.
- `troubleshoot/*` handles failure recovery and exception paths.
- `reference/*` describes product behavior and field semantics.
- `concepts/*` explains decisions only when users need help choosing between options.

## Current-State Implications

The current Sealos section is structurally weak for first-time completion:

- [`content/docs/guides/app-deploy/meta.en.json`](/Users/longnv/bin/repo/sealos.io/.claude/worktrees/init/content/docs/guides/app-deploy/meta.en.json) is a flat feature list, not a task flow.
- [`content/docs/guides/app-deploy/index.en.mdx`](/Users/longnv/bin/repo/sealos.io/.claude/worktrees/init/content/docs/guides/app-deploy/index.en.mdx) is a feature overview with stale relative links such as `use-app-launchpad.md` and `update-app.md`, which do not match the actual filenames.
- [`content/docs/guides/app-deploy/create-app.en.mdx`](/Users/longnv/bin/repo/sealos.io/.claude/worktrees/init/content/docs/guides/app-deploy/create-app.en.mdx) is effectively empty and cannot serve as the canonical first-deploy tutorial.

So the restructure should not preserve current page boundaries just because they already exist. The architecture needs a new canonical journey first, then it should re-home the existing operational pages around that journey.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| App Deploy landing/router | Route users by intent, show prerequisites, define the primary journey and secondary lookup paths | First-deploy tutorial, operations hub, troubleshoot hub |
| First-deploy tutorial | One complete beginner-safe path from image selection to successful public access and verification | Landing/router, task guides, troubleshoot pages |
| Operations hub | Index of post-success jobs grouped by what the user is trying to change | Individual `manage/*` task guides, reference pages |
| Task guide (`manage/*`) | Solve one operational task with minimum theory and explicit prerequisites, steps, verification, and next actions | Operations hub, reference, troubleshoot, concepts |
| Troubleshooting hub | Route by symptom or failure point after a deploy attempt or config change | First-deploy tutorial, task guides, reference |
| Troubleshooting page | Recover from one failure class without re-teaching the whole product | Related task guide, reference, concepts |
| Reference page | Describe exact fields, limits, behaviors, and platform semantics | Linked from task guides and troubleshooting only |
| Concept/explanation page | Help users choose between alternatives such as env vars vs config files or ephemeral vs persistent storage | Linked from task guides, not primary nav-first content |

## User and Content Flow

The user flow should be explicit and directional:

```text
Landing page
  -> choose "Deploy your first app"
  -> confirm prerequisites and expected outcome
  -> follow one end-to-end tutorial
  -> verify app is reachable
  -> branch to next jobs: domain, config, storage, update, scaling

Landing page
  -> choose "Manage an existing app"
  -> go to operations hub
  -> pick one task guide
  -> if blocked, jump to troubleshooting
  -> if uncertain about semantics, jump to reference or concepts
```

### Navigation/Data Flow

- **Top-down flow:** `index` should funnel new users into `first-deploy`, not ask them to self-assemble a deployment from 8-10 feature pages.
- **Post-success branching:** the success checkpoint at the end of `first-deploy` should link to the most common next jobs: domain, environment variables, config files, storage, update, scaling.
- **Lateral recovery:** each task guide should link to only the troubleshooting pages relevant to that task. Example: `domains-and-public-access` links to `domain-and-tls-failures`, not to generic storage or scaling pages.
- **Upward certainty:** troubleshooting pages should always link back to the specific happy-path step or task guide they are recovering from.
- **Lookup containment:** detailed semantics such as field behavior, platform defaults, limits, or edge cases belong in `reference`, not embedded in the middle of tutorials.

The directional rule is simple:

- Tutorial pages move users forward.
- Task guides help users make one change correctly.
- Troubleshooting pages recover a broken state.
- Reference pages answer “what exactly does this field or behavior mean?”

## Patterns to Follow

### Pattern 1: Canonical first-success tutorial

**What:** One page that completes the smallest meaningful deployment outcome.

**When:** Always first. This is the backbone of the whole section.

**Why:** Every strong deployment-doc system leads with a quickstart or getting-started path before branching into operational topics.

**Example structure:**

```text
Deploy your first container app
1. What you need before you begin
2. Prepare image and app basics
3. Configure runtime and public access
4. Deploy
5. Verify the app is reachable
6. What to do next
```

### Pattern 2: Separate happy-path setup from failure handling

**What:** Keep “how to add a domain” separate from “what to do when TLS or DNS fails”.

**When:** Especially for domains, certificates, ports, startup behavior, and config.

**Why:** Mixing exception handling into the happy path makes the first deployment feel riskier and more complex than it is.

**Sealos implication:** `custom-certificates` should not stay as a peer to the main deployment pages without context. It belongs under troubleshooting or advanced domain handling.

### Pattern 3: Task pages map to real jobs, not product features

**What:** Organize around user jobs such as “make the app public”, “persist data”, or “change configuration”.

**When:** For post-success navigation and sidebars.

**Why:** Diataxis and Kubernetes both reinforce that task/how-to material should be job-oriented, not machine-oriented.

**Sealos implication:** keep `environment-variables` and `config-files` separate if both deserve their own task pages, but introduce a short concept page explaining when to use each.

### Pattern 4: Use structured end-of-page routing

**What:** Every page ends with explicit next moves.

**When:** On all tutorial and task pages.

**Why:** First-time deployment docs fail when users reach the bottom of a page and still do not know what comes next.

**Page footer pattern:**

```text
Next:
- Add a custom domain
- Configure environment variables
- Persist app data
- Troubleshoot an unreachable app
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: Flat feature inventory as primary navigation

**What:** A top-level list of isolated topics such as autoscaling, configmap, ports, and certificates.

**Why bad:** It assumes the user already knows the correct reading order.

**Instead:** Make the top level intent-based: first deploy, manage existing app, troubleshoot.

### Anti-Pattern 2: Thin pages with no job boundary

**What:** Pages that only describe a control or UI element but do not state prerequisites, action sequence, verification, or when to use it.

**Why bad:** They are too small to complete a task and too long to function as reference.

**Instead:** Merge thin fragments into a real task guide or move pure semantics into reference.

### Anti-Pattern 3: One page that mixes tutorial, reference, and troubleshooting

**What:** New-user walkthroughs that also embed all edge cases, caveats, and failure modes inline.

**Why bad:** It increases cognitive load and buries the main path.

**Instead:** Keep the happy path short and link out to symptom-based recovery pages.

## Build-Order Implications

The restructuring order matters. Strong deployment-doc IA is easiest to build from the primary path outward.

1. **Define the target taxonomy and redirects first**
   - Finalize directory/group names, `meta.en.json` structure, and URL mapping before rewriting lots of content.
   - This prevents rewriting pages into a structure that later changes again.

2. **Build the canonical `first-deploy` tutorial next**
   - This becomes the source of truth for the core user flow and exposes which details must stay inline versus branch out.
   - It should establish the minimum successful outcome: deployed app, public address, verified reachability.

3. **Rewrite the landing page as a router, not a brochure**
   - After the main tutorial exists, `index.en.mdx` can reliably send readers to the right next page.
   - The current landing page should be replaced, not lightly edited.

4. **Refactor existing pages into job-based `manage/*` guides**
   - Re-home existing material:
   - `add-a-domain` -> `manage/domains-and-public-access`
   - `environments` -> `manage/environment-variables`
   - `configmap` -> `manage/config-files`
   - `persistent-volume` -> `manage/persistent-storage`
   - `expose-multiple-ports` -> `manage/ports-and-networking`
   - `autoscaling` -> `manage/scaling`
   - `update-apps` -> `manage/update-and-redeploy`
   - `docker-compose-migration` -> `manage/migrate-from-docker-compose`

5. **Extract exception handling into troubleshooting**
   - Pages like `custom-certificates` should be split into failure-oriented recovery content tied to the domain task flow.
   - This is where startup, reachability, DNS, and TLS failure classes should live.

6. **Add lean reference and decision pages only after task flows are stable**
   - Reference should document exact behaviors and constraints discovered during task-guide rewrites.
   - Concepts pages should be created only where readers must choose between alternatives.

7. **Finish with cross-linking, redirects, and verification**
   - Validate sidebar ordering, stale links, breadcrumbs, “next step” links, and redirect coverage.
   - Because the current section already has stale links, link validation is part of the architecture rollout, not just polish.

## Scalability Considerations

| Concern | At ~10 pages | At ~30 pages | At ~100 pages |
|---------|--------------|--------------|---------------|
| Navigation | Manual sidebar order is manageable | Intent-based grouping becomes mandatory | Add stronger hubs, search landing pages, and symptom indexing |
| Content consistency | Writer memory can enforce page shape | Use fixed page templates for tutorial/task/troubleshoot/reference | Add ownership rules and review checklists per content type |
| Troubleshooting discoverability | Inline links may be enough | Symptom-based hub becomes necessary | Add error-pattern taxonomy and stronger search metadata |
| Cross-link integrity | Manual checking is possible | Redirect plan and stale-link review needed | Automated link checking becomes high priority |
| Future product growth | A few new features can slot into task pages | New product options need explicit decision pages | Without firm boundaries, docs regress into feature sprawl |

## Sources

- Sealos project scope: [`PROJECT.md`](/Users/longnv/bin/repo/sealos.io/.planning/PROJECT.md) and current docs structure: [`STRUCTURE.md`](/Users/longnv/bin/repo/sealos.io/.planning/codebase/STRUCTURE.md) and [`meta.en.json`](/Users/longnv/bin/repo/sealos.io/.claude/worktrees/init/content/docs/guides/app-deploy/meta.en.json) — HIGH
- Diataxis overview: https://diataxis.fr/ — HIGH
- Diataxis on tutorials vs how-to guides: https://diataxis.fr/tutorials-how-to/ — HIGH
- Diataxis how-to guides: https://diataxis.fr/how-to-guides/ — HIGH
- Diataxis reference: https://diataxis.fr/reference/ — HIGH
- Kubernetes docs home, tutorials, tasks, reference: https://kubernetes.io/docs/ , https://kubernetes.io/docs/tutorials/ , https://kubernetes.io/docs/tasks/ , https://kubernetes.io/docs/reference/ — HIGH
- Google Cloud Run quickstart, deploy config, env vars, custom domains, troubleshooting: https://cloud.google.com/run/docs/quickstarts/deploy-container , https://cloud.google.com/run/docs/deploying , https://cloud.google.com/run/docs/configuring/services/environment-variables , https://cloud.google.com/run/docs/mapping-custom-domains , https://cloud.google.com/run/docs/troubleshooting — HIGH
- Vercel getting started, deployments, environment variables, domains: https://vercel.com/docs/getting-started-with-vercel , https://vercel.com/docs/deployments , https://vercel.com/docs/environment-variables , https://vercel.com/docs/domains/working-with-domains — HIGH
- Fly.io getting started, networking, custom domains, production checklist: https://fly.io/docs/getting-started/ , https://fly.io/docs/networking/ , https://fly.io/docs/networking/custom-domain/ , https://fly.io/docs/apps/going-to-production/ — MEDIUM

## Confidence Notes

- **HIGH confidence:** The main architectural recommendation, because it is supported by both official documentation structures and the directly inspected Sealos repo state.
- **MEDIUM confidence:** The exact final page count and whether Sealos should create both `reference/*` and `concepts/*` immediately. Those are implementation choices, but the boundary model itself is solid.
