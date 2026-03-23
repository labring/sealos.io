# Feature Landscape

**Domain:** Deployment documentation information architecture for first successful container app deploy
**Researched:** 2026-03-23

## Table Stakes

Features users expect. Missing = the docs feel fragmented, risky, or hard to finish.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Clear primary "Start here" path | Best-in-class deployment docs give new users one dominant route to first success instead of making them infer order from a topic list. | Medium | This should be the landing page and the navigation default, not just one link among many. |
| Prerequisites and input checklist | Users need to know what they must already have before opening the deployment form: image, port, env vars, storage needs, domain intent, and account/project prerequisites. | Low | Reduces false starts and prevents mid-flow abandonment. |
| End-to-end deploy walkthrough | Strong docs show the exact sequence from opening the deploy UI to app creation, access URL, and first verification. | Medium | This is the core "0 to 1" document. Current Sealos docs have topic coverage but not a dominant end-to-end path. |
| Explicit success criteria | Users need a concrete "you are done when..." section: app status, reachable URL, expected page, and where to inspect logs/events if not healthy. | Low | Official quickstarts commonly include a clear success checkpoint, not just steps. |
| Troubleshooting section for first-deploy failures | First deploy often fails on image pull, wrong port, missing env, startup crash, or public access assumptions. Docs must cover these near the main path. | Medium | Best kept scoped to first-deploy blockers, with links to deeper operational references. |
| Progressive disclosure from basics to advanced topics | Mature docs separate the first deploy path from follow-up operations like autoscaling, storage tuning, and custom certs. | Medium | Prevents cognitive overload while preserving discoverability. |
| Task-oriented reference pages for common follow-up jobs | After initial success, users expect focused pages for update app, add domain, persistent volume, environment variables, config files, multi-port, autoscaling. | Medium | These should read as "How to..." tasks, not detached feature blurbs. |
| Cross-links at decision points | Good deployment docs link out exactly when the user hits a branch: "Need storage?", "Need custom domain?", "Using private image?", "Migrating from Docker Compose?" | Low | Cross-links should be embedded in the primary flow, not only in side navigation. |
| Consistent terminology and UI mapping | Users must be able to map doc terms to the product UI labels without translation effort. | Low | Especially important in Sealos where "App Launchpad", "Deployments", and page names currently mix concepts. |
| Navigation grouped by user journey | Best-in-class docs group pages into Learn / Deploy / Verify / Operate patterns even if the nav labels differ. | Medium | IA should encode order and relationship, not just list all pages equally. |

## Differentiators

Features that set the docs apart. Not always expected, but strongly improve first-time success.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Decision-oriented deployment matrix | A compact chooser such as "single container vs Docker Compose migration", "stateless vs stateful", "default URL vs custom domain" helps users enter the right path fast. | Medium | This reduces wrong-path reading before deployment starts. |
| First-deploy readiness checklist embedded in the main guide | A preflight section that lets users validate image accessibility, exposed port, required env vars, and persistence needs before clicking deploy lowers avoidable failures. | Low | More useful than a generic prerequisites paragraph. |
| Verification-first IA | The main guide includes "check app status, open URL, inspect logs/events" immediately after deploy, making validation part of the workflow instead of an afterthought. | Medium | Strong differentiator for "first successful deploy" optimization. |
| Problem-to-fix troubleshooting map | Instead of a generic FAQ, organize failures by symptom: crash loop, image pull error, 502/unreachable, app boots but state is lost, domain not resolving. | Medium | This matches how users debug under stress. |
| Opinionated next steps after success | Once deployed, docs recommend the next 2-4 likely tasks: add domain, add persistence, configure env vars, update image, enable autoscaling. | Low | Helps the docs behave like a guided product journey. |
| Page role clarity | Each page declares its job: quickstart, task guide, concept, migration guide, or advanced reference. | Low | Reduces duplicate content and prevents pages from becoming partial walkthroughs. |
| Scenario-based examples | Example paths such as "Deploy a stateless web app", "Deploy an app that needs a database volume", or "Expose multiple ports" help users match their case fast. | High | Valuable when grounded in actual Sealos capabilities and UI. |
| In-flow branching for optional complexity | The main guide stays linear but offers clearly marked branch points for storage, domain, config file, multi-port, and scaling. | Medium | Better than forcing every user through every option. |
| Migration bridge for users coming from Docker Compose | A distinct migration entry point prevents Docker Compose users from misreading the single-container quickstart as the only model. | Medium | Relevant because this content already exists in Sealos and should be positioned as an alternate path. |

## Anti-Features

Features to explicitly NOT build.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| Flat list of feature pages with equal weight | Makes users infer the deployment order themselves and hides the primary path. | Create one dominant end-to-end guide plus grouped follow-up tasks. |
| Landing page that is mostly capability marketing | Feature bullets do not help users decide what to do first. | Turn the landing page into a journey hub with start path, prerequisites, and branch links. |
| Thin pages that each explain one UI field in isolation | Fragmentation increases tab-hopping and causes users to lose state mid-deploy. | Consolidate tightly related steps into fewer, higher-responsibility pages. |
| Mixing first-deploy steps with advanced operations in one linear flow | New users get overloaded and cannot tell what is optional. | Keep the first deploy path minimal; branch advanced topics only when needed. |
| Reference pages that duplicate quickstart content badly | Duplication causes drift and conflicting instructions. | Let the main guide own the sequence; reference pages own one follow-up task each. |
| Hidden troubleshooting | If failure help is buried elsewhere, users abandon before success. | Put first-deploy troubleshooting directly in or adjacent to the main guide. |
| Ambiguous success state | "Deploy completed" without showing how to verify health or reach the app leaves users unsure whether they are done. | Add explicit verification checkpoints and expected outcomes. |
| IA organized around product internals rather than user jobs | Users care about tasks like deploy, expose, persist, update, and debug, not internal capability taxonomy. | Organize by user journey and task verbs. |

## Feature Dependencies

```text
Clear primary "Start here" path -> End-to-end deploy walkthrough
Prerequisites and input checklist -> End-to-end deploy walkthrough
End-to-end deploy walkthrough -> Explicit success criteria
Explicit success criteria -> Troubleshooting section for first-deploy failures
Progressive disclosure from basics to advanced topics -> Task-oriented reference pages for common follow-up jobs
Navigation grouped by user journey -> Cross-links at decision points
Decision-oriented deployment matrix -> Scenario-based examples
Decision-oriented deployment matrix -> In-flow branching for optional complexity
First-deploy readiness checklist embedded in the main guide -> Verification-first IA
End-to-end deploy walkthrough -> Opinionated next steps after success
Docker Compose migration bridge -> Decision-oriented deployment matrix
```

## MVP Recommendation

Prioritize:
1. Clear primary "Start here" path with a rewritten landing page
2. One end-to-end "first successful deploy" guide with prerequisites, steps, verification, and first-failure troubleshooting
3. Task-oriented follow-up pages for domain, env/config, storage, updates, and autoscaling with branch links from the main guide

Defer: Scenario-based examples: high value, but they are only worth adding after the core primary path and page roles are clean.

## Recommended IA Implication for Sealos

The current Sealos App Deploy section is feature-complete but journey-weak: `meta.en.json` lists operational topics in a flat order, and `index.en.mdx` behaves more like a feature overview than a deployment hub. For a first-success-optimized docs section, Sealos should treat the deployment docs as a guided system:

- One primary entry: "Deploy your first container app"
- One alternate entry: "Migrate from Docker Compose"
- One follow-up cluster: "Operate your deployed app"
- One support layer: "Troubleshoot common deployment failures"

That is the pattern used by strong deployment docs ecosystems: first get the app running, then branch into operational depth.

## Sources

- Sealos project context: `/Users/longnv/bin/repo/sealos.io/.planning/PROJECT.md`
- Current Sealos IA: `/Users/longnv/bin/repo/sealos.io/.claude/worktrees/init/content/docs/guides/app-deploy/meta.en.json`
- Current Sealos landing page: `/Users/longnv/bin/repo/sealos.io/.claude/worktrees/init/content/docs/guides/app-deploy/index.en.mdx`
- Google Cloud Run quickstart: https://docs.cloud.google.com/run/docs/quickstarts/deploy-container (HIGH confidence: official docs)
- Fly.io getting started docs: https://fly.io/docs/getting-started/ (MEDIUM confidence: official docs, used for IA pattern comparison)
- Render deploy an image docs: https://render.com/docs/deploying-an-image (MEDIUM confidence: official docs, used for task-flow comparison)
- Railway docs: https://docs.railway.com/ (MEDIUM confidence: official docs, used for deploy-path comparison)
- DigitalOcean App Platform docs: https://docs.digitalocean.com/products/app-platform/ (MEDIUM confidence: official docs, used for IA/task organization comparison)
