# AI Agent Guide for time-queues

*The single reference for AI agents working with this codebase. See [README.md](README.md) for the end-user overview.*

## Orientation

Read these files in order:

1. `src/MicroTask.js` &rarr; base task unit with promise lifecycle
2. `src/MicroTaskQueue.js` &rarr; queue base class
3. `src/ListQueue.js` &rarr; linked-list queue implementation
4. `src/Scheduler.js` &rarr; time-based scheduling with min-heap

## Inheritance Hierarchy

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

## Design Principles

1. **Lazy Promise Creation** &mdash; promises are only created when `.makePromise()` is called or via `schedule()`
2. **Clean Cancellation** &mdash; all tasks support cancellation via `CancelTaskError`
3. **Graceful Degradation** &mdash; feature detection, not environment sniffing
4. **Memory Efficiency** &mdash; linked lists and heaps, not arrays
5. **Universal** &mdash; must work in browsers, Node.js, Deno, and Bun

## Common Use Cases

```js
// Delayed / recurring tasks
import {Scheduler, repeat} from 'time-queues/Scheduler.js';
const scheduler = new Scheduler();
scheduler.enqueue(({task, scheduler}) => { /* ... */ }, 1000);

// Background processing
import {idleQueue} from 'time-queues/IdleQueue.js';
idleQueue.enqueue(({deadline, task, queue}) => { /* ... */ });

// Concurrency-limited batch
import {batch} from 'time-queues/batch.js';
await batch(fns, 3);

// Resource lifecycle
import Retainer from 'time-queues/Retainer.js';
const pool = new Retainer({create, destroy, retentionPeriod: 5000});
const resource = await pool.get();
await pool.release();
```

## Modifying the Codebase

### Adding a new queue

1. Extend `ListQueue` (or `MicroTaskQueue` for non-list storage)
2. Override `startQueue()` &mdash; return a stop function
3. Create matching `.d.ts` file
4. Add test in `tests/test-<name>.js`

### Adding a utility function

1. Create `src/<name>.js` with JSDoc + `src/<name>.d.ts`
2. Export both named and default
3. Follow existing promise-based patterns
4. Add test + example

### Constraints

- Maintain backward compatibility for public APIs
- Preserve cancellation support via `CancelTaskError`
- Update `.d.ts` files when changing signatures

## Code Style (Prettier)

- 2-space indent, single quotes, no trailing semicolons, 120-char lines
- Run `npm run lint:fix` before completing work

## Testing

```bash
npm test            # all tests
npm run ts-check    # TypeScript static analysis
npm run test:bun    # Bun runtime
npm run test:deno   # Deno runtime
```

## Pitfalls

- Don't use `setTimeout`/`setInterval` directly &mdash; use `Scheduler` or utilities
- Don't access private fields (`#prefix`) &mdash; use public APIs
- Always check `task.isCanceled` before execution in queue implementations
- Always return/await promises from async methods

## Documentation

- `docs/technical/ARCHITECTURE.md` &mdash; design deep-dive
- `docs/technical/API.md` &mdash; complete API reference
- `docs/technical/CONTRIBUTING.md` &mdash; contribution guidelines
- `examples/README.md` &mdash; copy-pasteable examples
- [Wiki](https://github.com/uhop/time-queues/wiki) &mdash; per-component docs

---

*When in doubt, follow existing patterns. The library prioritizes consistency and reliability over cleverness.*
