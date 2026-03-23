# Domain Pitfalls

**Domain:** Deployment-documentation information architecture for container application onboarding and self-serve operations
**Project:** Sealos App Deploy docs restructure
**Researched:** 2026-03-23
**Overall confidence:** HIGH for documentation-pattern pitfalls, HIGH for current Sealos structural risks visible in the repo

## Critical Pitfalls

### Pitfall 1: Turning the landing page into a feature catalog instead of a success path
**What goes wrong:** The section homepage lists capabilities and sibling pages, but does not give a dominant "start here and finish your first deploy" flow. New users browse instead of executing.

**Why it happens:** Teams mirror product features in navigation instead of mapping the user's first successful outcome.

**Consequences:** Users click several pages before taking action, miss required steps, and conclude the product is harder than it is.

**Warning signs:**
- The top page mostly describes features and links out to many peers.
- "Create app", "update app", "add domain", "autoscaling", and "persistent volume" appear at the same hierarchy level for first-time readers.
- There is no single tutorial that starts with prerequisites and ends with a verifiable successful deployment.
- Current Sealos evidence: [`content/docs/guides/app-deploy/index.en.mdx`](../../.claude/worktrees/init/content/docs/guides/app-deploy/index.en.mdx) is primarily a link hub, not an end-to-end deploy guide.

**Prevention strategy:**
- Make one primary tutorial the dominant CTA on the landing page: "Deploy your first container app on Sealos".
- Put the expected end state in the first screenful: app created, public URL reachable, basic verification complete.
- Move advanced capabilities into clearly labeled follow-up sections such as `Customize`, `Operate`, and `Troubleshoot`.

**Which phase should address it:** Phase 2 `IA and entry-path design`, then Phase 3 `primary tutorial authoring`.

### Pitfall 2: Mixing tutorial, task, and reference content in the same path
**What goes wrong:** A single doc path tries to teach, guide execution, and document options at the same time. New users get conceptual detours when they need task completion; operators get oversimplified prose when they need precise steps.

**Why it happens:** Teams collapse all content types into one "guide" bucket.

**Consequences:** Readers cannot predict what each page is for, so they lose trust in the structure and bounce between pages.

**Warning signs:**
- Pages mix onboarding narrative, UI walkthroughs, feature descriptions, and operational caveats without clear boundaries.
- Navigation labels do not signal whether a page is for first learning, one concrete task, or day-2 reference.
- Advanced branches like certificates or autoscaling sit beside the first-deploy path with equal visual weight.

**Prevention strategy:**
- Classify each page before rewriting it:
  - Tutorial: first successful deployment end to end.
  - Task/how-to: add domain, expose multiple ports, configure env vars, attach storage, update app.
  - Reference/explanation: limits, terminology, product behavior, caveats.
- Enforce one primary user need per page and reflect it in titles, intros, and nav placement.

**Which phase should address it:** Phase 2 `content model and taxonomy`.

### Pitfall 3: Optimizing for internal content reuse instead of user completion
**What goes wrong:** Teams split the journey into many tiny pages to avoid repetition, then force users to assemble the real workflow themselves.

**Why it happens:** Writers over-apply DRY thinking to docs and treat repeated task context as waste instead of necessary onboarding support.

**Consequences:** The first successful deploy requires too much page hopping, context is lost, and "start here" docs feel incomplete.

**Warning signs:**
- The main path requires opening three or more short pages just to finish the first deployment.
- Core pages are stubs or near-stubs.
- Current Sealos evidence: `create-app.en.mdx` is effectively empty; `docker-compose-migration.en.mdx` is effectively empty; `update-apps.en.mdx` is only a minimal pointer.

**Prevention strategy:**
- Allow deliberate duplication inside the first-deploy tutorial when it reduces context switching.
- Consolidate stub pages until each remaining page can independently complete a real user intent.
- Use sections inside a strong guide before creating another top-level page.

**Which phase should address it:** Phase 1 `content inventory and gap audit`, then Phase 3 `core content consolidation`.

### Pitfall 4: Hiding prerequisites, assumptions, and expected outcomes
**What goes wrong:** Docs tell users what buttons to click but omit what they must already have ready: image source, port, environment values, storage expectation, DNS control, or private registry credentials.

**Why it happens:** Internal teams already know the setup and unconsciously skip it in docs.

**Consequences:** Users follow the guide but still fail because the hidden setup was never made explicit.

**Warning signs:**
- No `Before you begin` section.
- No sample values or example app used consistently through the walkthrough.
- The guide never states what "success" looks like after deployment.
- Optional features are presented without decision criteria.

**Prevention strategy:**
- Add explicit prerequisites for the primary tutorial and every operational task.
- Standardize a short prerequisite template: required inputs, access level, optional vs required decisions, estimated time.
- Use one canonical example deployment in the onboarding tutorial so readers can compare their result.

**Which phase should address it:** Phase 3 `primary tutorial authoring` and Phase 4 `task page normalization`.

### Pitfall 5: Omitting verification checkpoints and short troubleshooting branches
**What goes wrong:** The happy path ends with "click deploy" and assumes success. When the app fails to start, the image cannot pull, the port is wrong, or DNS has not propagated, the docs offer no recovery path.

**Why it happens:** Writers optimize for shortest-path prose and defer troubleshooting to support tickets or separate debugging docs nobody finds.

**Consequences:** Self-serve breaks at the first real-world error, especially for new users.

**Warning signs:**
- No "Verify the deployment" step after create/update/domain actions.
- No pointers to logs, events, pod status, or terminal access near failure-prone steps.
- Troubleshooting is entirely absent from the primary path.

**Prevention strategy:**
- Add one verification checkpoint after each critical milestone: app created, app reachable, config change applied, domain attached.
- Add compact "If this fails" branches for the most common issues only.
- Link to operational surfaces users can inspect in Sealos: logs, events, pod status, terminal.

**Which phase should address it:** Phase 3 `primary tutorial authoring` and Phase 4 `operational task pages`.

### Pitfall 6: Letting advanced day-2 operations crowd the first-run experience
**What goes wrong:** Storage, autoscaling, custom certificates, multiple ports, and migration are presented as if they are part of the default first deployment sequence.

**Why it happens:** Product teams want every capability visible, so the docs flatten all topics into one peer list.

**Consequences:** New users over-read, hesitate on optional decisions, and delay the first deployment unnecessarily.

**Warning signs:**
- Optional or advanced pages appear before the user has a basic app running.
- The section order implies that custom domain, autoscaling, or certificate setup are baseline steps.
- The landing page offers too many equally weighted next clicks.

**Prevention strategy:**
- Define a strict minimal first-success path using the simplest viable public image example.
- Mark advanced topics with decision framing such as "Use this when..." or "Only if you need...".
- Group advanced topics under a separate `Operate and customize` cluster, not the core onboarding ladder.

**Which phase should address it:** Phase 2 `IA sequencing` and Phase 3 `landing page rewrite`.

### Pitfall 7: Shipping IA changes without link migration, terminology cleanup, and locale QA
**What goes wrong:** The structure changes, but filenames, links, titles, terminology, and locale quality are not normalized. Users hit broken paths, inconsistent names, or partially untranslated pages.

**Why it happens:** Teams focus on page content and underinvest in migration mechanics.

**Consequences:** Search traffic degrades, bookmarked links break, and trust drops because the docs feel unfinished.

**Warning signs:**
- Page labels and file names drift from each other.
- Internal links reference slugs that no longer exist.
- English pages contain untranslated Chinese titles or descriptions.
- Current Sealos evidence: `index.en.mdx` links to filenames that do not match the actual English files; `create-app.en.mdx` and `docker-compose-migration.en.mdx` contain Chinese frontmatter inside English pages.

**Prevention strategy:**
- Normalize one canonical product vocabulary before restructuring: `App Deploy` vs `App Launchpad`, `application` vs `app`, and other user-visible terms.
- Build a URL mapping table for every moved or renamed page.
- Run a release checklist for internal links, nav labels, frontmatter locale, and page discoverability before merge.

**Which phase should address it:** Phase 1 `inventory and terminology audit`, then Phase 5 `pre-launch QA and migration`.

### Pitfall 8: Treating distinct user entry points as one audience
**What goes wrong:** First-time deployers, existing Docker Compose migrators, and day-2 operators are sent through the same entry structure.

**Why it happens:** "App Deploy" is treated as one topic area instead of multiple intent-based journeys.

**Consequences:** Each audience sees irrelevant decisions too early and misses the path tailored to its real goal.

**Warning signs:**
- Migration content is placed beside first-deploy content with no audience cue.
- Update/change-management pages are mixed into onboarding.
- The docs never ask what the user is trying to do right now.

**Prevention strategy:**
- Use intent-based entry blocks on the landing page:
  - Deploy your first app
  - Migrate an existing containerized app
  - Operate an existing deployment
- Keep each path shallow and explicit about assumptions.

**Which phase should address it:** Phase 2 `journey design`.

## Moderate Pitfalls

### Pitfall 9: Relying too heavily on screenshots without stable textual anchors
**What goes wrong:** A UI-first walkthrough depends on screenshots that become stale quickly, especially in product surfaces that iterate fast.

**Warning signs:**
- Steps only make sense when the screenshot matches the current UI exactly.
- Field names, button labels, and expected values are not stated in text.
- Large screenshot blocks interrupt the action flow.

**Prevention strategy:**
- Use screenshots only for orientation on high-friction steps.
- Always pair screenshots with the exact field labels and intended values in text.
- Prefer small, targeted screenshots over one large image dump.

**Which phase should address it:** Phase 3 `tutorial production` and Phase 4 `task page refinement`.

### Pitfall 10: Publishing incomplete English content because the IA work looks structurally finished
**What goes wrong:** Navigation and file structure are updated, but the English content under them is still stubbed, mistranslated, or empty.

**Warning signs:**
- New nav items point to placeholder pages.
- English frontmatter or screenshots contain untranslated content.
- The page count looks complete, but several pages do not support the tasks they advertise.

**Prevention strategy:**
- Use a readiness checklist per page: title, intro, prerequisites, steps, verification, locale review, links, screenshots.
- Hide or defer incomplete pages instead of surfacing placeholders.
- Track English completeness separately from IA completeness.

**Which phase should address it:** Phase 3 `core page production` and Phase 5 `launch readiness review`.

### Pitfall 11: Ignoring site-build and publish constraints during a docs-only restructure
**What goes wrong:** The content model changes cleanly on paper but breaks the actual docs build, export, or navigation behavior.

**Warning signs:**
- Metadata changes are not verified with a full site build.
- Cross-links and nav assumptions are updated without checking generated routes.
- Publishing depends on fragile scripts but the restructure plan does not include validation time.

**Prevention strategy:**
- Treat build validation as part of the restructure definition of done.
- Verify `meta.en.json`, MDX imports, slugs, and internal links with the actual site build before merge.
- Reserve explicit QA time for static-export behavior and navigation rendering.

**Which phase should address it:** Phase 5 `pre-launch QA and publish validation`.

## Minor Pitfalls

### Pitfall 12: Using vague page titles that hide user intent
**What goes wrong:** Labels like `Deployments`, `Environment`, or `Persistent Volume` do not tell new users whether the page is a start point, a task, or a reference.

**Warning signs:**
- Readers must open the page to understand whether it helps them right now.
- Multiple page titles are nouns instead of user outcomes.

**Prevention strategy:**
- Prefer user-intent titles such as `Deploy your first app`, `Set environment variables`, `Attach persistent storage`, `Add a custom domain`.
- Ensure titles and nav labels match the job the page helps complete.

**Which phase should address it:** Phase 2 `taxonomy and naming`.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Phase 1: Inventory and terminology audit | Broken links, locale drift, hidden stubs get missed because only visible nav is reviewed | Build a page inventory that includes actual file completeness, incoming links, current slug targets, and terminology mismatches |
| Phase 2: IA and journey design | Feature-based nav survives under a new visual grouping | Force every top-level node to map to a user intent and a content type |
| Phase 3: Primary tutorial authoring | First-run guide still assumes too much product knowledge | Add prerequisites, canonical example values, verification checkpoints, and compact recovery branches |
| Phase 4: Task/reference normalization | Advanced tasks leak back into onboarding or become thin stubs again | Define page-level acceptance criteria: one job per page, enough context to complete it, no placeholder leaves |
| Phase 5: QA, migration, and publish | The structure ships with broken links, untranslated metadata, or build regressions | Run full link/nav/build validation and a locale-specific review before publishing |

## Current Sealos-Specific Risk Snapshot

- The English landing page currently behaves like a link hub, not a guided deployment path.
- Several landing-page links appear to reference outdated filenames rather than the actual English files.
- At least two English pages are effectively empty and contain Chinese frontmatter, which is a direct launch-readiness failure for an English-first restructure.
- The current nav order mixes first-deploy, migration, update, and advanced operations in one flat list, which is the exact pattern that commonly hurts onboarding success.

## Sources

- Diátaxis, "The difference between a tutorial and how-to guide" — strong separation between learning-oriented tutorials and task-oriented how-to guides, and why conflating them harms newcomers. HIGH confidence. https://diataxis.fr/tutorials-how-to/
- Kubernetes docs, "Page content types" — formal expectations for tutorial/task structure, including prerequisites, objectives, steps, cleanup, and what's next. HIGH confidence. https://kubernetes.io/docs/contribute/style/page-content-types/
- GitLab Docs, "Tutorial page type" — tutorials should provide an end-to-end working example with expected outcome and can legitimately include information also available elsewhere. HIGH confidence. https://docs.gitlab.com/development/documentation/topic_types/tutorial/
- Microsoft Style Guide, "Writing step-by-step instructions" — procedural guidance on consistent headings, numbered steps, action-first instructions, and avoiding overlong fragmented procedures. HIGH confidence. https://learn.microsoft.com/en-us/style-guide/procedures-instructions/writing-step-by-step-instructions
- Repo evidence from current Sealos App Deploy docs and planning files reviewed on 2026-03-23. HIGH confidence.
