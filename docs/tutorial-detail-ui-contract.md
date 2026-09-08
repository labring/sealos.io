# Tutorial detail UI contract

The Tutorial Detail Shell is a dark, technical-editorial reading surface for
framework developers. It prioritizes completing a working deployment over
promotional messaging.

## Page anatomy

1. Show breadcrumbs, one framework label, the tutorial title, outcome summary,
   runtime, reading time, and updated date in an open editorial header.
2. Present the Dual-Entry Tutorial Flow above the article: “Start from scratch”
   and “I have a project.” Each link targets a real section in the page.
3. Keep the article column near 800 pixels on desktop with a sticky right table
   of contents. Use the built-in compact table of contents on small screens.
4. Express the workflow through semantic H2 and H3 sections. Use restrained
   blue markers and callouts only when they clarify a decision, warning, or
   expected result.
5. Place the primary deployment action in the deployment stage. It copies a
   local Codex prompt for the Sealos Skill and keeps account access adjacent.
6. Use the Sealos web interface for post-deployment operations and verification.
7. End with explicit next and related published tutorials.

## Content components

- Code blocks use File, Terminal, or Expected Result labels and retain built-in
  copy behavior.
- The Existing-Project Compatibility Checkpoint appears where the application
  is prepared for production and rejoins the shared deployment workflow.
- Images open through the existing zoom component. Alternative text describes
  the image for accessibility; visible captions appear only when they add
  information beyond the surrounding prose.
- FAQ and HowTo structured data stay sourced from public MDX frontmatter.

## Visual system

- Use the existing site typography, Fumadocs primitives, Tailwind utilities,
  and Lucide icon set.
- Use the Sealos blue-cyan accent on a near-black surface with neutral borders.
- Keep one accent family, consistent corner radii, visible keyboard focus, and
  restrained hover transitions.
- Avoid large marketing hero cards, ornamental gradients, stacked cards, and
  decorative badges that compete with the instructions.

## Screenshot standard

- Every Core Deployment Tutorial includes two Expected Result Visuals:
  the healthy Sealos Project Canvas after deployment checks, and the public
  application with its HTTPS address and completed create/read result after
  browser verification. Keep the Assistant Pane closed in the canvas capture.
- A local application screenshot is optional when it demonstrates distinct
  framework behavior that the public result does not show.
- Capture actual product states at a minimum of 2400 by 1350 physical pixels.
  Export each Sealos composition as a 3200 by 1800 WebP with crisp interface
  text. Inspect the final image at 100% and at its intended display size.
- Store the required images under `public/images/tutorials/<framework>/` as
  `<framework>-sealos-project-ops-running.webp` and
  `<framework>-sealos-live-app-https-proof.webp`, and reference both in MDX.
- Present screenshots wider than the prose column on large screens and at full
  width on mobile.
- Frame images with a subtle Sealos-brand background using blue-cyan light,
  neutral depth, and generous padding. Preserve the source screenshot without
  scaling it up beyond its native resolution.
- Exclude browser credentials, tokens, personal data, and unrelated desktop
  state from every capture.

## Acceptance

- `pnpm validate-tutorials` requires both screenshot roles, existing local
  assets, descriptive alternative text, and 3200 by 1800 dimensions for every
  `/tutorials/<framework>/deploy/` page. Test fixtures remove screenshots from
  each Core tutorial to guard this requirement as the catalog grows.
- Editorial review verifies that each image matches the actual tutorial
  deployment and browser result, decodes successfully, preserves the captured
  interface, and remains readable at its intended display size. Source and
  build checks alone cover only part of the Tutorial Publication Gate.
- The detail route passes TypeScript validation and the production static build.
- At 1440 pixels, the article, breakout screenshots, and sticky table of
  contents remain readable without horizontal overflow.
- At 390 pixels, entry links, code blocks, images, and the compact table of
  contents remain usable.
- Keyboard users can reach entry links, code copy controls, image zoom, article
  links, and adjacent navigation with visible focus.
