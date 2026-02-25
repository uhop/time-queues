# Time Queues - Technical Architecture

## Project Overview

`time-queues` is a JavaScript library for organizing asynchronous multitasking and scheduled tasks. It provides efficient solutions for timing and scheduling challenges with browser-optimized queue implementations. It works seamlessly in browsers, Node.js, Bun, and Deno environments.

## Core Architecture

### Inheritance Hierarchy

```
MicroTask (base task unit)

MicroTaskQueue (abstract base queue)
├── ListQueue (linked-list storage)
│   ├── IdleQueue (requestIdleCallback)
│   ├── FrameQueue (requestAnimationFrame)
│   ├── LimitedQueue (concurrency control)
│   └── PageWatcher (page lifecycle)
└── Scheduler (min-heap, time-based)
```

### Task Management System
The library is built around a hierarchical task management system:
- `MicroTask`: Base class for deferred execution with promise resolution capabilities. Internally uses `Promise.withResolvers()` when available, falling back to manual Promise construction. Tracks settled state and provides clean cancellation with `CancelTaskError`.
- `MicroTaskQueue`: Abstract base queue class that manages task lifecycle (enqueue, dequeue, cancel). Provides generic `schedule()` method that wraps functions in promise-returning tasks.
- `ListQueue`: Concrete base class using linked lists (from `list-toolkit`) for efficient O(1) task management. Manages queue processing lifecycle with start/stop mechanisms. Most specialized queues extend this class.
- `Scheduler`: Extends `MicroTaskQueue` directly (not `ListQueue`). Uses a min-heap for efficient O(log n) time-based scheduling. Tasks are executed within a configurable tolerance window for performance optimization.

### Queue Types
The library provides multiple queue implementations optimized for different use cases:
- **IdleQueue**: Uses `requestIdleCallback()` for background task execution during browser idle periods. Configurable timeout batching for consistent performance. Requires `requestIdleCallback` to be available in the environment.
- **FrameQueue**: Uses `requestAnimationFrame()` for animation frame-based execution. Optional time-based batching to limit execution time per frame. Processes tasks in FIFO order within each frame.
- **LimitedQueue**: Concurrency-controlled queue that limits simultaneous task execution. Uses internal active task counter and idle waiter patterns. Asynchronous task wrapping via `LimitedQueue.wrap()` ensures proper error handling. _(Since version 1.3.0.)_
- **PageWatcher**: Monitors page lifecycle state changes (`active`, `passive`, `hidden`, `frozen`, `terminated`). Registers/deregisters event listeners on resume/pause. Does not support `schedule()`.

### Utility Classes
- **Counter**: Tracks numeric values with async waiting capabilities. Supports `waitForZero()` and `waitFor(fn)` for condition-based waiting. Uses arrays for zero waiters and Sets for function waiters.
- **Throttler**: Rate limiting based on keys using a Map to track last-seen times. Configurable throttle timeout, never-seen timeout, and vacuum period. Automatic periodic cleanup of stale entries. _(Since version 1.1.0.)_
- **Retainer**: Resource lifecycle management with retention periods. Creates resources on demand, retains them after release for a configurable period, then destroys them. Uses a simple numeric counter (not the Counter class). _(Since version 1.1.0.)_

## Key Design Patterns

### 1. Promise-based Task Handling
All tasks are wrapped in MicroTask objects that provide promise-based interfaces:
- Promises are created lazily via `makePromise()` — not in the constructor
- Tasks can be resolved or canceled with proper cleanup of internal references
- Cancellation uses a custom `CancelTaskError` exception with optional cause chaining
- `enqueue()` does not create a promise; `schedule()` does (calls both `enqueue()` and `makePromise()`)

### 2. Start/Stop Queue Pattern
`ListQueue` and its subclasses use a consistent pattern for queue lifecycle:
- `startQueue()` begins processing and returns a stop function (or null)
- The stop function is stored in `this.stopQueue`
- Queue auto-starts when a task is enqueued (if not paused and not already running)
- Queue auto-stops when empty

### 3. Browser API Abstraction
The library abstracts various browser APIs with graceful fallbacks:
- `defer()` (standalone function): Uses `requestIdleCallback` when available, falls back to `setImmediate`, then `setTimeout`
- `IdleQueue`: Uses `requestIdleCallback` directly (no built-in fallback)
- `FrameQueue`: Uses `requestAnimationFrame` directly (no built-in fallback)
- `PageWatcher`: Handles page lifecycle events with state transition callbacks
- Feature detection patterns ensure compatibility across environments

### 4. Memory Management
- Task cancellation properly cleans up references (nulls `#resolve`, `#reject`) to prevent memory leaks
- `Counter` class provides tracking with waiting capabilities using array-based zero waiters and Set-based function waiters
- `Retainer` class manages resource lifecycle with configurable retention periods and automatic cleanup timers
- Event listener registration/deregistration in `PageWatcher` prevents accumulation of handlers

## Key Components

### Scheduler
- Extends `MicroTaskQueue` directly (uses min-heap instead of linked list)
- Exports `Task` class (extends `MicroTask` with `time` and `delay` properties)
- `enqueue(fn, delay)` accepts a function and a delay (ms or Date object)
- Provides `repeat(fn, delay)` for creating recurring tasks
- Exports a default `scheduler` singleton instance
- Handles timing precision with configurable tolerance (default 4ms)
- Automatic timer rescheduling when earlier tasks are added

### Throttler
- Rate limiting based on keys to prevent excessive execution with per-key tracking
- Configurable timeout periods (`throttleTimeout`), initial delay (`neverSeenTimeout`), and cleanup intervals (`vacuumPeriod`)
- `isVacuuming` getter to check if vacuum interval is active
- Memory-efficient tracking using Map data structure with automatic cleanup of stale entries
- Non-blocking delay implementation using `sleep()` for async/await compatibility

### Utility Functions
- `defer(fn)`: Execute tasks in next tick using optimal APIs (`requestIdleCallback` > `setImmediate` > `setTimeout`). Also exports `scheduleDefer(fn)` which returns a Promise.
- `sleep(ms)`: Promise-based delay function supporting both numeric delays and Date objects with automatic conversion.
- `throttle(fn, ms)`: Limit function execution rate with immediate execution on first call and trailing edge suppression.
- `debounce(fn, ms)`: Delay function execution until input stabilizes with proper timer cancellation on subsequent calls.
- `sample(fn, ms)`: Execute function at regular intervals with time-drift correction for consistent timing.
- `audit(fn, ms)`: Execute function after specified delay with argument caching for last invocation.
- `batch(fns, limit)`: Execute async operations with controlled concurrency (default limit: 4) using sliding window pattern. Accepts arrays of functions, promises, or values. _(Since version 1.3.0.)_

### DOM Utilities
- `whenDomLoaded(fn)`: Execute callback when DOM content is loaded (or immediately if already loaded). Also exports `domLoaded` Promise.
- `whenLoaded(fn)`: Execute callback when page is fully loaded (or immediately if already loaded). Also exports `loaded` Promise.

### Random Distribution Utilities
- `random-dist`: Generate random numbers from various probability distributions: `uniform(min, max)`, `normal(mean, stdDev, skewness)`, `expo(lambda)`, `pareto(min, alpha)`. _(Since version 1.3.0.)_
- `random-sleep`: Create randomized delays: `randomUniformSleep`, `randomNormalSleep`, `randomExpoSleep`, `randomParetoSleep` (factory functions returning sleep functions), and `randomSleep(max, min)` (direct Promise). _(Since version 1.3.0.)_

## Implementation Details

### Error Handling
- Custom `CancelTaskError` extends JavaScript's `Error` class with optional cause chaining via `{cause}` option
- Proper cleanup on task cancellation: nulls `#resolve` and `#reject`, sets `#settled` to true
- Integration with Promise rejection mechanisms
- Consistent error propagation through promise chains

### Environment Compatibility
- Graceful degradation when browser APIs are not available through feature detection
- `defer()` uses feature detection for `requestIdleCallback`, `setImmediate`, falls back to `setTimeout`
- `IdleQueue` and `FrameQueue` require their respective browser APIs (`requestIdleCallback`, `requestAnimationFrame`)
- `PageWatcher` requires DOM event APIs (`addEventListener`, `document.visibilityState`, `document.hasFocus`)
- Node.js/Bun/Deno compatibility for core scheduling, timing, and utility functions

### Performance Considerations
- Minimal memory overhead through efficient data structures (linked lists, min-heaps, Maps) with O(1) and O(log n) operations
- Lazy promise creation to avoid unnecessary work
- Automatic queue start/stop based on task availability
- Proper cleanup of event listeners and timers with deterministic deregistration patterns
- Efficient heap operations for scheduling with bulk task processing within tolerance windows

## Usage Patterns

### Task Scheduling
```javascript
import {Scheduler} from 'time-queues/Scheduler.js';

const scheduler = new Scheduler();
scheduler.enqueue(() => console.log('Delayed task'), 1000);
```

### Browser Optimization
```javascript
import {IdleQueue} from 'time-queues/IdleQueue.js';
import {FrameQueue} from 'time-queues/FrameQueue.js';

// Background tasks during idle periods
const idleQueue = new IdleQueue();
idleQueue.enqueue(({deadline, task, queue}) => processBackgroundTask());

// Animation frame tasks
const frameQueue = new FrameQueue();
frameQueue.enqueue(({timeStamp, task, queue}) => animateFrame(timeStamp));
```

### Concurrency Control
```javascript
import {LimitedQueue} from 'time-queues/LimitedQueue.js';

const limitedQueue = new LimitedQueue(3); // Max 3 concurrent tasks
limitedQueue.enqueue(async ({task, queue}) => await performOperation());
await limitedQueue.waitForIdle();
```

### Resource Management
```javascript
import {Retainer} from 'time-queues/Retainer.js';

const retainer = new Retainer({
  create: () => createResource(),
  destroy: (resource) => destroyResource(resource),
  retentionPeriod: 5000
});
const resource = await retainer.get();
// Use resource...
await retainer.release();
```

## Integration Points

### External Dependencies
- **[list-toolkit](https://github.com/nicklatkovich/list-toolkit)**: Core dependency for `List` (doubly-linked list) and `MinHeap` data structures
- **[tape-six](https://github.com/nicklatkovich/tape-six)**: Test framework (dev dependency)

### Browser APIs Used
- `requestIdleCallback()` / `cancelIdleCallback()` for `IdleQueue`
- `requestAnimationFrame()` / `cancelAnimationFrame()` for `FrameQueue`
- `queueMicrotask()` for `PageWatcher` initialization
- Page lifecycle events (`pageshow`, `pagehide`, `focus`, `blur`, `visibilitychange`, `resume`, `freeze`) for `PageWatcher`
- `setTimeout` / `clearTimeout` / `setInterval` / `clearInterval` for `Scheduler`, `Throttler`, `Retainer`, and utility functions

### Environment Support
The library is designed to work in browsers, Node.js, Bun, and Deno environments. Core scheduling, timing, and utility functions work across all environments. Browser-specific queues (`IdleQueue`, `FrameQueue`, `PageWatcher`) require their respective browser APIs.

## Testing Approach

The project uses [tape-six](https://github.com/nicklatkovich/tape-six) for testing:
- Unit tests for all core components in `tests/` directory
- Browser-specific tests in `tests/web/`
- Manual tests in `tests/manual/`

### TypeScript Validation
- `ts-check/` directory: TypeScript compilation checks for static analysis using `tsc --noEmit`
- `ts-tests/` directory: Directly runnable TypeScript tests in Node.js, Deno, and Bun environments (browsers require JavaScript transpilation)

## See Also

- [README](./README.md) — user-facing documentation
- [AGENTS.md](./AGENTS.md) — AI agent guide
- [CONTRIBUTING.md](./CONTRIBUTING.md) — contributor guide
- [Wiki](https://github.com/uhop/time-queues/wiki) — component documentation
