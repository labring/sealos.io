# React tutorial verification

Verified on 2026-09-06 against the application built from the tutorial source.
Both required screenshots show the deployed application and are included in
the website tutorial at `/tutorials/react/deploy/`.

## Application evidence

| Check                      | Result                                                                                                                                 |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Initial source             | `5bc47767d3d5d9966f091a5a3d47aea6e842a109`                                                                                             |
| Updated source             | `b0eec1eb00c6ccb1c0eb084cdda222b77ec6bb10`                                                                                             |
| Public route               | https://react-tasks-vrvevswc.usw-1.sealos.app/dashboard                                                                                |
| Initial image digest       | `sha256:0eee2d0c8ab6c7a509ab47c41a337251698deb23e53d274f08e2eb102bcfc93b`                                                              |
| Updated image digest       | `sha256:a12cb656ab8f943395e6f2b8da69bb042cbe9eba5d26134ab7215801a2705e30`                                                              |
| Build and container checks | Locked install, lint, production build, Nginx configuration, and container route smoke passed                                          |
| Public HTTP checks         | `/` and `/dashboard` returned HTML; hashed JavaScript and CSS returned their expected content types; `/assets/missing.js` returned 404 |
| Browser proof              | `Runtime proof from Sealos` remained after refreshing `/dashboard`                                                                     |
| Update proof               | The original URL showed `Task list on Sealos`; the original task and `Verify the update` remained after refresh                        |
| Runtime stability          | Initial 237-second and updated 97-second comparisons passed with zero active findings                                                  |

Build evidence is available in the private reference repository:
[initial run](https://github.com/yangchuansheng/sealos-react-tutorial-build-20260906/actions/runs/34018691868)
and [update run](https://github.com/yangchuansheng/sealos-react-tutorial-build-20260906/actions/runs/34020256024).

The active example uses one application replica in `ns-let51wad`, with a
200m CPU and 256 MiB memory limit, Service port 8080, and public HTTPS.
Its application name is `react-tasks-rijaquoy`; the Sealos project is
`React + Vite Tutorial` (`17dcacfa-8b0c-4a9f-ad04-44a3c0358d3e`).
Tasks use browser storage. The example has no database or persistent volume.

## Screenshot evidence

`public/images/tutorials/react/react-sealos-live-app-https-proof.webp` comes
from the deployed application after task creation and refresh. The source
capture is 3000 by 2025 pixels at a device pixel ratio of 3. The native HTML
frame embeds that capture and follows the Django screenshot styling.
The final WebP is 3200 by 1800 pixels, quality 95, and 79,358 bytes. Decoding
and visual inspection at 100% and 50% passed. The adjacent article caption
links to the actual HTTPS address.

`public/images/tutorials/react/react-sealos-project-ops-running.webp` comes
from the real Sealos Project Canvas, with the application running, public
access healthy, and the Assistant Pane closed. The source capture is 4800 by
2700 pixels at a device pixel ratio of 3. The frame crops the capture around
the application and public access nodes while preserving their native pixels.
The final WebP is 3200 by 1800 pixels, quality 95, and 112,926 bytes. Decoding
and visual inspection at 100% and 50% passed.

## Website checks

- MDX generation and the production build passed, including TypeScript
  validation and export of 6,171 static pages.
- At 1440 and 390 pixels, both images loaded with 3200 by 1800 source
  dimensions and the page had no horizontal overflow. Clicking or tapping
  each image opened its zoom view on desktop and mobile.
- `pnpm validate-tutorials` passed for both published Core tutorials.
- `node --test scripts/validate-tutorials.test.mjs` passed all eight checks,
  including missing-screenshot regressions for Django and React.
- The changed files pass whitespace checks. A repository-wide whitespace
  check also reports a pre-existing trailing blank line in `AGENTS.md`.

Local runtime reports and deployment state are in
`/tmp/sealos-react-tutorial-20260906/.sealos/`; raw captures and HTTP evidence
are in `/tmp/sealos-react-evidence-20260906/`. The deployment log is
`/Users/longnv/.sealos/logs/deploy-20260906-150652.log`.
