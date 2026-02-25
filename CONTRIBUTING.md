# Contributing to time-queues

## Prerequisites

- Node.js 18 or later
- npm

## Setup

```bash
git clone --recurse-submodules git@github.com:uhop/time-queues.git
cd time-queues
npm install
```

The `--recurse-submodules` flag is needed to clone the wiki submodule under `wiki/`.

## Project structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the design deep-dive.

- `src/` — source code (ESM) and hand-written `.d.ts` type definitions
- `tests/` — automated tests (`test-*.js`)
- `ts-check/` — TypeScript static analysis files
- `ts-tests/` — runtime TypeScript tests
- `wiki/` — GitHub wiki (git submodule)

## Development workflow

### Running tests

```bash
npm test                          # Run all tests (tape-six)
node tests/test-<name>.js        # Run a single test file directly
npm run test:bun                  # Run with Bun
npm run test:deno                 # Run with Deno
```

### Type checking

```bash
npm run ts-check                  # tsc --noEmit
```

### Linting and formatting

```bash
npm run lint                      # Check formatting (Prettier)
npm run lint:fix                  # Auto-format
```

### Browser tests

```bash
npm start                         # Start dev server
# Open http://localhost:3000/tests/web/
```

## Coding conventions

### General

- **ESM-only**: use `import`/`export` syntax. The project is `"type": "module"`.
- **Formatting**: Prettier — 100 char width, single quotes, no bracket spacing, no trailing commas, arrow parens "avoid".
- **Indentation**: 2 spaces.

### Documentation

- Every public `.js` module has a hand-written `.d.ts` file alongside it.
- `.d.ts` files are NOT generated — edit them manually.
- When changing a public API, always update both the `.js` and `.d.ts` files.

### Patterns

See [ARCHITECTURE.md](./ARCHITECTURE.md) for core concepts (inheritance hierarchy, lazy promises, start/stop queue, cancellation).

- **Lazy promise creation**: promises are only created when `.makePromise()` is called or via `schedule()`.
- **Start/stop queue pattern**: `startQueue()` returns a stop function stored in `this.stopQueue`.
- **Cancellation**: always use `CancelTaskError` for task cancellation.
- **Exports**: all modules export both named and default.
- **Singleton instances**: queue modules export a default instance (e.g., `scheduler`, `idleQueue`, `frameQueue`, `pageWatcher`).

## Adding new features

### New queue type

1. Extend `ListQueue` (or `MicroTaskQueue` for non-list storage).
2. Override `startQueue()` — return a stop function.
3. Create matching `.d.ts` file.
4. Add test in `tests/test-<name>.js`.
5. Run `npm test` and `npm run ts-check`.

### New utility function

1. Create `src/<name>.js` and `src/<name>.d.ts`.
2. Export both named and default.
3. Follow existing promise-based patterns.
4. Add test and example.

### Pull request checklist

1. All tests pass (`npm test`).
2. TypeScript checks pass (`npm run ts-check`).
3. Code is formatted (`npm run lint`).
4. Documentation updated (wiki) as needed.

## AI agents

If you are an AI coding agent, see [AGENTS.md](./AGENTS.md) for detailed project conventions, commands, and architecture.
