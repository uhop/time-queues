# time-queues — AI Agent Rules

## Project identity

time-queues is a lightweight ESM JavaScript library for async task scheduling and concurrency control: time-based schedulers, idle/frame/limited queues, throttle, debounce, batch, page lifecycle watchers, and random delays. Works in browsers, Node.js, Bun, and Deno. One runtime dependency: [list-toolkit](https://github.com/uhop/list-toolkit).

For project structure and testing see [PROJECT.md](./PROJECT.md).
For detailed usage docs and API references see the [wiki](https://github.com/uhop/time-queues/wiki).

## Setup

```bash
git clone --recurse-submodules git@github.com:uhop/time-queues.git
cd time-queues
npm install
```

## Verification commands

- `npm test` — run the full test suite (tape-six)
- `node tests/test-<name>.js` — run a single test file directly
- `npm run test:bun` — run with Bun
- `npm run test:deno` — run with Deno
- `npm run ts-check` — TypeScript type checking (tsc --noEmit)
- `npm run lint` — Prettier format check

## Critical rules

- **ESM-only.** The project is `"type": "module"`.
- **Hand-written `.d.ts` files.** They are NOT generated. When modifying a public API, update both the `.js` and `.d.ts` files.
- **Do not modify or delete test expectations** without understanding why they changed.
- **Do not add comments or remove comments** unless explicitly asked.

## Code style

- Prettier: 100 char width, single quotes, no bracket spacing, no trailing commas, arrow parens "avoid" (see `.prettierrc`).
- 2-space indentation.
- PascalCase classes (`MicroTask`, `ListQueue`), camelCase functions (`defer`, `sleep`).
- Files match export names: `MicroTask.js`, `defer.js`.
- All modules export both named and default.
- Private fields use `#prefix` with getters for read-only access.
- `Promise.withResolvers()` preferred; manual `Promise` fallback where needed.
- Run `npm run lint:fix` before completing work.

## Architecture quick reference

```
MicroTask (single task with promise support)
  └─ Task (Scheduler-specific, adds delay/time)

MicroTaskQueue (abstract queue base)
  ├─ Scheduler (time-based, uses min-heap)
  └─ ListQueue (linked-list storage)
       ├─ IdleQueue (requestIdleCallback)
       ├─ FrameQueue (requestAnimationFrame)
       ├─ LimitedQueue (concurrency control)
       └─ PageWatcher (page lifecycle events)

Standalone: Counter, Throttler, Retainer, CancelTaskError
```

- **Lazy Promise Creation** — promises are only created when `.makePromise()` is called or via `schedule()`.
- **Clean Cancellation** — all tasks support cancellation via `CancelTaskError`.
- **Graceful Degradation** — feature detection, not environment sniffing.
- **Memory Efficiency** — linked lists and heaps, not arrays.

## File layout

- Source: `src/<Name>.js` + `src/<Name>.d.ts` (classes) or `src/<name>.js` + `src/<name>.d.ts` (functions)
- Tests: `tests/test-*.js`
- TS static analysis: `ts-check/*.ts`
- TS runtime tests: `ts-tests/test-*.ts`
- Wiki docs: `wiki/` (git submodule)
- Technical docs: `ARCHITECTURE.md`, `CONTRIBUTING.md`

## When reading the codebase

- Start with `src/MicroTask.js` → `src/MicroTaskQueue.js` → `src/ListQueue.js` to understand the class hierarchy.
- `.d.ts` files are the best API reference for each module.
- Wiki markdown files in `wiki/` contain detailed usage docs.
- `ARCHITECTURE.md` has the full design deep-dive.
