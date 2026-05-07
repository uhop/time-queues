---
description: Checklist for adding a new public module to time-queues
---

# Add a New Module

Follow these steps when adding a new public module.

## Implementation

1. Create `src/<Name>.js` (class) or `src/<name>.js` (function) with the implementation.
   - ESM only. Use `.js` extensions in all imports.
   - Add `// @ts-self-types="./<Name>.d.ts"` as the first line.
2. Create a matching `src/<Name>.d.ts` (hand-written, not generated).
3. Create `tests/test-<name>.js` with automated tests (tape-six).
   // turbo
4. Run the new test: `node tests/test-<name>.js`
5. Create `ts-tests/test-<name>.ts` with TypeScript typing tests exercising generics, callback signatures, overloads, and type constraints.

## Wiring

6. Add the module to `src/index.d.ts` if it should be part of the main barrel export.
7. Create a wiki page `wiki/<Name>.md` following existing naming conventions.
8. Add a link to the new wiki page in `wiki/Home.md` (both the main section and the "Direct links" sections).

## Documentation updates

9. Update `ARCHITECTURE.md` — add the module to the project layout tree and class hierarchy.
10. Update `llms.txt` with a brief description of the new module.
11. Update `llms-full.txt` with the full API reference for the new module.
12. Update `AGENTS.md` if the module changes the architecture quick reference.

## Verification

    // turbo

13. Run the full test suite: `npm test`
    // turbo
14. Run the TS typing tests: `npm run ts-test`
    // turbo
15. Run the TypeScript type check: `npm run ts-check`
