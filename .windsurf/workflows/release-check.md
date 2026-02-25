---
description: Pre-release verification checklist for time-queues
---

# Release Check

Run through this checklist before publishing a new version.

## Steps

1. Check that `ARCHITECTURE.md` reflects any structural changes.
2. Check that `AGENTS.md` is up to date with any rule or workflow changes.
3. Check that `wiki/Home.md` links to all module wiki pages (both main sections and "Direct links").
4. Check that `llms.txt` and `llms-full.txt` are up to date with any new or changed modules.
5. Verify `package.json`:
   - `files` array includes all necessary entries (`/src`, `llms.txt`, `llms-full.txt`).
   - `exports` map covers any new modules added since the last release.
6. Bump `version` in `package.json`.
7. Update release history in `README.md`.
8. Run `npm install` to regenerate `package-lock.json`.
   // turbo
9. Run the full test suite: `npm test`
   // turbo
10. Run the TS typing tests: `npm run ts-test`
    // turbo
11. Run the TypeScript type check: `npm run ts-check`
    // turbo
12. Run the linter: `npm run lint`
    // turbo
13. Dry-run publish to verify package contents: `npm pack --dry-run`
