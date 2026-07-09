# Stack Research: Sealos Skills Tutorial Alignment

**Researched:** 2026-06-16

## Local Site Stack

The tutorial content lives in a Next.js App Router and Fumadocs content system:

- Tutorial content: `content/tutorials/**/*.mdx`
- Tutorial routes: `app/[lang]/(home)/tutorials/**`
- Tutorial metadata utilities: `lib/utils/tutorial-metadata.ts` and
  `lib/utils/tutorial-utils.ts`
- Content source registration: `source.config.ts` and `lib/source.ts`
- Tutorial validation: `scripts/validate-tutorials.mjs`

## Upstream Source Stack

The upstream source is a plugin-first skill repository:

- README owns user-facing install and host usage guidance.
- `skills/sealos-deploy/SKILL.md` owns deploy entry behavior and runtime
  acceptance expectations.
- `skills/sealos-deploy/modules/preflight.md` owns preflight/auth behavior.
- `skills/sealos-deploy/modules/pipeline.md` owns `.sealos/` artifacts,
  DEPLOY/UPDATE mode, and phase sequence.
- `marketplaces/README.md` owns host command support claim rules.

## Validation Commands

```bash
rg -n "npx plugins add|codex plugin|claude plugin|\\$sealos|/sealos|/sealos-deploy|Runtime Truth|\\.sealos" content/tutorials
node scripts/validate-tutorials.mjs
```

Use the narrowest available repository check after content edits. If lint is
available and practical, run it for the final touched-file validation.
