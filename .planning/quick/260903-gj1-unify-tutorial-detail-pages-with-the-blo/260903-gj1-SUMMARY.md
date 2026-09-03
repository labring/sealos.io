---
phase: 260903-gj1-unify-tutorial-detail-pages-with-the-blo
plan: "01"
subsystem: article-presentation
tags: [nextjs, fumadocs, mdx, responsive-design]
provides:
  - "Shared Blog and Tutorial article shell with branded table of contents"
  - "Shared MDX rendering for images, captions, Mermaid, paragraphs, and FAQ"
  - "Theme-token Tutorial presentation with retained learning navigation"
affects: [blog, tutorials]
actuals:
  tasks: 2
  commits: 1
metrics:
  completed: "2026-09-03"
tech-stack:
  added: []
  patterns:
    - "Article detail routes compose one shared Fumadocs presentation boundary"
    - "Tutorial-only actions use the same theme tokens and cards as Blog"
key-files:
  created:
    - components/article/article-detail-shell.tsx
    - components/article/article-pager.tsx
    - components/mdx/article-mdx-components.tsx
  modified:
    - app/[lang]/(home)/blog/[slug]/layout.tsx
    - app/[lang]/(home)/blog/[slug]/page.tsx
    - app/[lang]/(home)/tutorials/[...slug]/layout.tsx
    - app/[lang]/(home)/tutorials/[...slug]/page.tsx
key-decisions:
  - "Blog detail presentation is the shared visual authority for article routes."
  - "Tutorial retains its task-oriented first screen and learning navigation."
  - "The catch-all Tutorial route applies the presentation to current and future tutorials."
coverage:
  - id: ARTICLE-SHELL
    description: "Shared article container, TOC header, pager, and theme tokens"
    verification:
      - kind: integration
        ref: "browser review at 1440x1000 and 390x844"
        status: pass
    human_judgment: true
  - id: ARTICLE-BODY
    description: "Shared MDX image, caption, Mermaid, paragraph, and FAQ rendering"
    verification:
      - kind: other
        ref: "pnpm lint"
        status: pass
      - kind: integration
        ref: "Django image and caption DOM review"
        status: pass
    human_judgment: false
  - id: TUTORIAL-CONTRACT
    description: "Tutorial metadata, entry points, navigation, and all public routes remain available"
    verification:
      - kind: unit
        ref: "scripts/validate-tutorials.test.mjs"
        status: pass
      - kind: integration
        ref: "13-route local HTTP sweep"
        status: pass
    human_judgment: false
status: complete
---

# Quick Task 260903-gj1: Tutorial and Blog visual system summary

The Blog and Tutorial detail routes now share their article shell, TOC header,
pager, MDX rendering, images, captions, and FAQ presentation.

## Accomplishments

- Extracted the existing Blog presentation into shared article components and
  preserved the Blog desktop rendering to within two antialiasing pixels of
  the pre-change 1440x1000 capture.
- Applied Blog theme tokens, width, typography, branded TOC, cards, image
  treatment, and responsive behavior to every Tutorial detail page.
- Retained Tutorial breadcrumbs, runtime metadata, reading time, stage,
  updated date, entry points, adjacent navigation, and related tutorials.
- Removed the forced Tutorial dark wrapper, hard-coded palette, custom prose
  overrides, and custom screenshot frame.
- Added a shared inline-code wrap rule that removed the Django page's 6px
  mobile horizontal overflow.

## Task Commit

1. **Task 1: Extract the existing Blog article presentation** — `18403b1`

The Tutorial catch-all files were already user-owned untracked migration files.
Their visual updates remain in the working tree so this task does not absorb
the surrounding route migration into its commit.

## Verification

- `node --test scripts/validate-tutorials.test.mjs` — PASS, 5 tests.
- `pnpm validate-tutorials` — PASS, 13 tutorial pages.
- `pnpm lint` — PASS.
- `git diff --check` — PASS.
- Local HTTP sweep — PASS, all 13 Tutorial URLs returned 200.
- Browser review — PASS at 1440x1000 and 390x844 for Blog, Django, and FastAPI.
- Theme inheritance — PASS; Tutorial and Blog resolve the same light and dark
  background/foreground tokens.
- Browser console errors — zero on the reviewed Tutorial page.

## Existing Work Preserved

All content migration edits, tutorial utilities, source schema changes, ADRs,
and tutorial images that preceded this task remain outside the code commit.

## Self-Check: PASSED

- Shared source commit exists.
- Tutorial changes are present in the working tree.
- Planning, summary, verification, and state artifacts are recorded separately.
