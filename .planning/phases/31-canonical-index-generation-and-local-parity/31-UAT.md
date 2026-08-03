---
status: testing
phase: 31-canonical-index-generation-and-local-parity
source: [31-VERIFICATION.md]
started: 2026-08-03T22:01:40Z
updated: 2026-08-03T22:01:40Z
---

## Current Test

number: 1
name: Current-commit hosted Node.js 20 CI evidence
expected: |
  The hosted Node.js 20 job runs the focused FAQ suite, parity check, npm run build, and npm run build:analyze successfully for commit c0f03af, with a retained job URL.
awaiting: user response

## Tests

### 1. Current-commit hosted Node.js 20 CI evidence
expected: The hosted Node.js 20 job passes the focused suite, parity check, standard build, and analyzer build for commit c0f03af.
result: [pending]

### 2. Current-commit Vercel build order
expected: A Vercel build log for the same commit shows npm run verify:ai-faq-index completing before next build, and any dashboard Build Command override routes through npm run build.
result: [pending]

## Summary

total: 2
passed: 0
issues: 0
pending: 2
skipped: 0
blocked: 0

## Gaps

Hosted CI and Vercel dashboard/log evidence are external to the current unpushed worktree. Local Node.js 20 execution and repository wiring are complete.
