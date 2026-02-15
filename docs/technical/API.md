# Time Queues - API Specification

## Table of Contents
- [Core Classes](#core-classes)
  - [CancelTaskError](#canceltaskerror)
  - [MicroTask](#microtask)
  - [MicroTaskQueue](#microtaskqueue)
  - [ListQueue](#listqueue)
  - [Scheduler](#scheduler)
- [Specialized Queues](#specialized-queues)
  - [IdleQueue](#idlequeue)
  - [FrameQueue](#framequeue)
  - [LimitedQueue](#limitedqueue)
- [Utility Classes](#utility-classes)
  - [Counter](#counter)
  - [Throttler](#throttler)
  - [Retainer](#retainer)
  - [PageWatcher](#pagewatcher)
- [Utility Functions](#utility-functions)
  - [defer](#defer)
  - [sleep](#sleep)
  - [throttle](#throttle)
  - [debounce](#debounce)
  - [sample](#sample)
  - [audit](#audit)
  - [batch](#batch)
- [DOM Utilities](#dom-utilities)
  - [whenDomLoaded](#whendomloaded)
  - [whenLoaded](#whenloaded)
- [Random Utilities](#random-utilities)
  - [random-dist](#random-dist)
  - [random-sleep](#random-sleep)

## Core Classes

### CancelTaskError

Custom error class for task cancellation signaling.

#### Import
```javascript
import CancelTaskError from 'time-queues/CancelTaskError.js';
```

#### Constructor
```javascript
new CancelTaskError(message, options)
```
- `message`: Error message (default: `'Task was canceled'`)
- `options`: Standard Error options, supports `{cause}` for error chaining

#### Properties
- `name`: Always `'CancelTaskError'`
- Inherits all `Error` properties (`message`, `stack`, `cause`)

### MicroTask

Base class for deferred execution with lazy promise creation.

#### Import
```javascript
import MicroTask from 'time-queues/MicroTask.js';
```

#### Constructor
```javascript
new MicroTask(fn)
```
- `fn`: Function to execute when task runs

#### Properties
- `fn`: The function associated with this task
- `promise`: Promise (getter) — returns `null` until `makePromise()` is called
- `settled`: Boolean (getter) indicating if task has settled (resolved/rejected)
- `isCanceled`: Boolean indicating if task was canceled

#### Methods
- `makePromise()`: Creates the promise and resolution functions (idempotent), returns `this`
- `resolve(value)`: Resolves task with given value, cleans up internals, returns `this`
- `cancel(error)`: Cancels task — sets `isCanceled` to `true`, rejects promise with `new CancelTaskError(undefined, error ? {cause: error} : undefined)`, returns `this`

### MicroTaskQueue

Abstract base queue class that manages task lifecycle.

#### Import
```javascript
import MicroTaskQueue from 'time-queues/MicroTaskQueue.js';
```

#### Constructor
```javascript
new MicroTaskQueue(paused)
```
- `paused`: Truthy value indicating initial paused state (default: `false`)

#### Properties
- `paused`: Boolean indicating queue pause state

#### Methods
- `get isEmpty()`: Returns `true` (base implementation — subclasses override)
- `pause()`: Sets `paused` to `true`, returns `this`
- `resume()`: Sets `paused` to `false`, returns `this`
- `enqueue(fn)`: Creates a new `MicroTask(fn)` and returns it (does **not** create a promise)
- `dequeue(task)`: Cancels the task, returns `this`
- `clear()`: No-op in base class, returns `this`
- `schedule(fn, ...args)`: Creates task with `enqueue()`, calls `makePromise()`, wraps `fn` execution with try/catch, returns `MicroTask` with active promise

#### Static Methods
- `MicroTaskQueue.returnArgs(...args)`: Returns arguments as array (default function for `schedule()`)

### ListQueue

Concrete base queue using linked lists from `list-toolkit`.

#### Import
```javascript
import ListQueue from 'time-queues/ListQueue.js';
```

#### Constructor
```javascript
new ListQueue(paused)
```
- `paused`: Truthy value indicating initial paused state (default: `false`)

#### Properties
- Inherits all `MicroTaskQueue` properties
- `list`: `List` instance (from `list-toolkit`) storing tasks
- `stopQueue`: Stop function for current queue processing, or `null`

#### Methods
- `get isEmpty()`: Returns `this.list.isEmpty`
- `pause()`: Pauses queue, calls stop function if running, returns `this`
- `resume()`: Resumes queue, calls `startQueue()` if tasks exist, returns `this`
- `enqueue(fn)`: Creates task, pushes to list, auto-starts queue if not paused, returns `MicroTask`
- `dequeue(task)`: Cancels task, removes from list, auto-stops queue if empty, returns `this`
- `clear()`: Pauses, cancels all tasks by popping from list, resumes if was not paused, returns `this`
- `startQueue()`: **Abstract** — must be overridden by subclasses. Returns a stop function or `null`.

### Scheduler

Time-based task scheduling using min-heap. Extends `MicroTaskQueue` directly.

#### Import
```javascript
import scheduler, {Scheduler, Task, repeat} from 'time-queues/Scheduler.js';
```

#### Task Class
```javascript
new Task(delay, fn)
```
- Extends `MicroTask`
- `delay`: Number (ms) or `Date` object
- Additional properties: `time` (absolute timestamp), `delay` (relative ms)

#### Constructor
```javascript
new Scheduler(paused, tolerance)
```
- `paused`: Truthy value indicating initial paused state (default: `false`)
- `tolerance`: Timing tolerance in ms (default: `4`)

#### Properties
- `paused`: Boolean indicating queue pause state
- `queue`: `MinHeap` instance (from `list-toolkit`) storing `Task` objects
- `tolerance`: Timing tolerance in ms
- `stopQueue`: Stop function or `null`

#### Methods
- `get isEmpty()`: Returns `this.queue.isEmpty`
- `get nextTime()`: Returns timestamp of next scheduled task (`Infinity` if empty)
- `pause()`: Pauses scheduler, clears timer, returns `this`
- `resume()`: Resumes scheduler, calls `processTasks()`, returns `this`
- `enqueue(fn, delay)`: Creates `Task(delay, fn)`, pushes to heap, reschedules timer if new task is earliest, returns `Task`
- `dequeue(task)`: Cancels task, removes from heap (handles top-of-heap case specially), returns `this`
- `clear()`: Pauses, cancels all tasks, clears heap, resumes if was not paused
- `startQueue()`: Starts `setTimeout` for next task, returns stop function
- `processTasks()`: Processes all tasks within tolerance window

#### Additional Exports
- `repeat(fn, delay)`: Returns a function that re-enqueues itself after each execution
- `scheduler`: Default `Scheduler` singleton instance (also the default export)

## Specialized Queues

### IdleQueue

Executes tasks during browser idle periods using `requestIdleCallback`.

#### Import
```javascript
import idleQueue, {IdleQueue, defer} from 'time-queues/IdleQueue.js';
```

#### Constructor
```javascript
new IdleQueue(paused, timeoutBatchInMs, options)
```
- `paused`: Truthy value indicating initial paused state (default: `false`)
- `timeoutBatchInMs`: Max ms to spend processing when `deadline.didTimeout` is true (default: `undefined` — process all)
- `options`: Options passed to `requestIdleCallback` (e.g., `{timeout}`)

#### Properties
- Inherits all `ListQueue` properties
- `timeoutBatch`: Timeout batch duration setting
- `options`: Options for `requestIdleCallback`

#### Methods
- Inherits all `ListQueue` methods
- `startQueue()`: Calls `requestIdleCallback`, returns stop function that calls `cancelIdleCallback`
- `processTasks(deadline)`: Processes tasks according to idle deadline. When `didTimeout`: processes in batches (if `timeoutBatch` set) or all at once. Otherwise: processes while `timeRemaining() > 0`.

#### Task Callback Signature
```javascript
({deadline, task, queue}) => { ... }
```

#### Additional Exports
- `idleQueue`: Default `IdleQueue` instance (also the default export)
- `defer`: Bound `enqueue` method of `idleQueue`

### FrameQueue

Executes tasks during animation frames using `requestAnimationFrame`.

#### Import
```javascript
import frameQueue, {FrameQueue} from 'time-queues/FrameQueue.js';
```

#### Constructor
```javascript
new FrameQueue(paused, batchInMs)
```
- `paused`: Truthy value indicating initial paused state (default: `false`)
- `batchInMs`: Max ms to spend processing per frame (default: `undefined` — process all)

#### Properties
- Inherits all `ListQueue` properties
- `batch`: Batch duration setting

#### Methods
- Inherits all `ListQueue` methods
- `startQueue()`: Calls `requestAnimationFrame`, returns stop function that calls `cancelAnimationFrame`
- `processTasks(timeStamp)`: Processes tasks according to frame timing. With `batch` set: processes for up to `batch` ms. Without: processes all tasks.

#### Task Callback Signature
```javascript
({timeStamp, task, queue}) => { ... }
```

#### Additional Exports
- `frameQueue`: Default `FrameQueue` instance (also the default export)

### LimitedQueue

_Since version 1.3.0._

Concurrency-controlled queue with active task limits.

#### Import
```javascript
import LimitedQueue from 'time-queues/LimitedQueue.js';
```

#### Constructor
```javascript
new LimitedQueue(limit, paused)
```
- `limit`: Maximum concurrent tasks allowed (positive integer)
- `paused`: Truthy value indicating initial paused state (default: `false`)

#### Properties
- Inherits all `ListQueue` properties
- `taskLimit`: Maximum concurrent tasks (getter/setter — setter clamps to minimum 1 and triggers processing)
- `activeTasks`: Current count of active tasks (getter)
- `isIdle`: Boolean (getter) — `true` when no active tasks and queue is empty

#### Methods
- Inherits all `ListQueue` methods
- `waitForIdle()`: Returns `Promise` that resolves when queue becomes idle (resolves immediately if already idle)

#### Task Callback Signature
```javascript
async ({task, queue}) => { ... }
```

#### Static Methods
- `LimitedQueue.wrap(fn)`: Wraps function call in `new Promise()` with try/catch for proper error handling

## Utility Classes

### Counter

Tracks numeric values with async waiting capabilities.

#### Import
```javascript
import Counter from 'time-queues/Counter.js';
```

#### Constructor
```javascript
new Counter(initial)
```
- `initial`: Initial count value (default: `0`)

#### Properties
- `count`: Internal counter value (direct access)
- `zeroWaiters`: Array of resolve functions waiting for zero count
- `functionWaiters`: `Set` of `{fn, resolve}` waiter objects

#### Methods
- `get value()`: Returns current count
- `set value(value)`: Sets count and calls `notify()`
- `increment()`: Increments count by 1 and calls `notify()`
- `decrement()`: Decrements count by 1 and calls `notify()`
- `advance(amount)`: Changes count by `amount` (default: `1`) and calls `notify()`
- `waitForZero()`: Returns `Promise` resolving with `0` when count reaches zero (resolves immediately if already zero)
- `waitFor(fn)`: Returns `Promise` resolving with current count when `fn(count)` returns truthy
- `clearWaiters()`: Resolves all waiters with `NaN`
- `notify()`: Checks and resolves applicable waiters

### Throttler

_Since version 1.1.0._

Rate limiting based on keys.

#### Import
```javascript
import Throttler from 'time-queues/Throttler.js';
```

#### Constructor
```javascript
new Throttler({throttleTimeout, neverSeenTimeout, vacuumPeriod})
```
- `throttleTimeout`: Minimum time between executions per key (default: `1000`)
- `neverSeenTimeout`: Delay for previously unseen keys (default: `0`)
- `vacuumPeriod`: Cleanup interval for stale entries (default: `throttleTimeout * 3`). Vacuum starts automatically if non-zero.

#### Properties
- `throttleTimeout`: Minimum time between executions per key
- `neverSeenTimeout`: Delay for previously unseen keys
- `vacuumPeriod`: Cleanup interval for stale entries
- `lastSeen`: `Map` tracking last seen times per key
- `handle`: Interval handle for vacuuming

#### Methods
- `getLastSeen(key)`: Returns last seen time for key (or `0` if never seen)
- `getDelay(key)`: Calculates delay needed before execution for key, updates `lastSeen`
- `wait(key)`: Returns `Promise` that resolves after appropriate delay for key (uses `sleep()`)
- `get isVacuuming()`: Returns `true` if vacuum interval is active
- `vacuum()`: Removes stale entries from `lastSeen` map
- `startVacuum()`: Starts periodic vacuuming (idempotent), returns `this`
- `stopVacuum()`: Stops periodic vacuuming, returns `this`

### Retainer

_Since version 1.1.0._

Resource lifecycle management with retention periods.

#### Import
```javascript
import Retainer from 'time-queues/Retainer.js';
```

#### Constructor
```javascript
new Retainer({create, destroy, retentionPeriod})
```
- `create`: Async function to create resource (**required**)
- `destroy`: Async function to destroy resource (**required**)
- `retentionPeriod`: Time to retain resource after last release in ms (default: `1000`)

Throws `Error` if `create` or `destroy` are not provided.

#### Properties
- `create`: Resource creation function
- `destroy`: Resource destruction function
- `retentionPeriod`: Retention period in ms
- `counter`: Numeric reference counter (simple number, not `Counter` class)
- `handle`: Retention timeout handle (or `null`)
- `value`: Cached resource value (or `null`)

#### Methods
- `async get()`: Increments counter, creates resource if needed (or cancels pending destruction), returns resource value
- `async release(immediately)`: Decrements counter. If counter reaches zero: destroys immediately if `immediately` is truthy, otherwise schedules destruction after `retentionPeriod`. Returns `this`.

### PageWatcher

Monitors and responds to page lifecycle changes.

#### Import
```javascript
import pageWatcher, {PageWatcher, watchStates} from 'time-queues/PageWatcher.js';
```

#### Constructor
```javascript
new PageWatcher(started)
```
- `started`: Boolean indicating initial started state (default: `false`). Note: internally passed as `!started` to `ListQueue`'s `paused` parameter.

#### Properties
- Inherits all `ListQueue` properties
- `currentState`: Current page state — one of `'active'`, `'passive'`, `'hidden'`, `'frozen'`, `'terminated'`

#### Methods
- `pause()`: Removes all event listeners, calls `super.pause()`, returns `this`
- `resume()`: Adds event listeners for lifecycle events, calls `super.resume()`, returns `this`
- `enqueue(fn, initialize)`: Enqueues task. If `initialize` is truthy, calls `fn(currentState, currentState, task, this)` via `queueMicrotask`. Returns `MicroTask`.
- `schedule()`: Throws `Error('Not implemented')` — not supported
- `clear()`: Clears the list directly without canceling tasks, returns `this`
- `startQueue()`: Returns `null` (no automatic processing)
- `handleEvent(event)`: Handles page lifecycle events, determines new state, calls all task functions with `(newState, oldState, task, this)`

#### Watched Events
`pageshow`, `pagehide`, `focus`, `blur`, `visibilitychange`, `resume`, `freeze`

#### Task Callback Signature
```javascript
(newState, oldState, task, watcher) => { ... }
```

#### Additional Exports
- `watchStates(queue, resumeStatesList)`: Returns a function `(state) => { ... }` that pauses/resumes the given queue based on page state. `resumeStatesList` defaults to `['active']`.
- `pageWatcher`: Default `PageWatcher` instance (also the default export)

## Utility Functions

### defer

Execute tasks in next tick using optimal environment APIs.

#### Import
```javascript
import defer, {scheduleDefer} from 'time-queues/defer.js';
```

#### Signatures
```javascript
defer(fn)          // returns undefined
scheduleDefer(fn)  // returns Promise
```

#### Parameters
- `fn`: Function to execute. For `scheduleDefer`, `fn` is optional (defaults to `returnArgs`).

#### Description
`defer(fn)` uses `requestIdleCallback` when available, falls back to `setImmediate`, then `setTimeout`. Returns `undefined`.

`scheduleDefer(fn)` wraps `defer` in a Promise — resolves with `fn()` result or rejects on error.

### sleep

Promise-based delay function.

#### Import
```javascript
import sleep from 'time-queues/sleep.js';
```

#### Signature
```javascript
sleep(ms)
```

#### Parameters
- `ms`: Delay in milliseconds or `Date` object (auto-converted to relative delay, clamped to minimum 0)

#### Returns
- `Promise` that resolves after delay

### throttle

Limit function execution rate.

#### Import
```javascript
import throttle from 'time-queues/throttle.js';
```

#### Signature
```javascript
throttle(fn, ms)
```

#### Parameters
- `fn`: Function to throttle
- `ms`: Minimum time between executions in ms

#### Returns
- Throttled function `(...args) => { ... }`

#### Description
Executes immediately on first call, then suppresses subsequent calls for `ms` milliseconds. Uses leading edge execution.

### debounce

Delay function execution until input stabilizes.

#### Import
```javascript
import debounce from 'time-queues/debounce.js';
```

#### Signature
```javascript
debounce(fn, ms)
```

#### Parameters
- `fn`: Function to debounce
- `ms`: Delay time in milliseconds

#### Returns
- Debounced function `(...args) => { ... }`

#### Description
Resets timer on each call. Executes `fn` with latest arguments after `ms` of inactivity. Uses trailing edge execution.

### sample

Execute function at regular intervals.

#### Import
```javascript
import sample from 'time-queues/sample.js';
```

#### Signature
```javascript
sample(fn, ms)
```

#### Parameters
- `fn`: Function to execute
- `ms`: Interval time in milliseconds

#### Returns
- Sampling function `(...args) => { ... }`

#### Description
Aligns execution to consistent intervals from creation time. Caches latest arguments and executes with them at the next interval boundary. Includes time-drift correction.

### audit

Execute function after specified delay.

#### Import
```javascript
import audit from 'time-queues/audit.js';
```

#### Signature
```javascript
audit(fn, ms)
```

#### Parameters
- `fn`: Function to execute
- `ms`: Delay time in milliseconds

#### Returns
- Auditing function `(...args) => { ... }`

#### Description
On first call, starts a timer for `ms`. Caches arguments from each subsequent call. When timer fires, executes `fn` with the most recently cached arguments. Ignores calls while timer is active (does not reset timer).

### batch

_Since version 1.3.0._

Execute async operations with controlled concurrency.

#### Import
```javascript
import batch from 'time-queues/batch.js';
```

#### Signature
```javascript
batch(fns, limit)
```

#### Parameters
- `fns`: Array of items — each can be a function (called and awaited), a thenable (awaited directly), or a plain value (resolved immediately)
- `limit`: Maximum concurrent operations (default: `4`, minimum: `1`)

#### Returns
- `Promise` resolving to array of results in the same order as input

#### Description
Uses sliding window pattern. Starts up to `limit` operations, then starts a new one each time one completes. Rejects immediately if any operation fails.

## DOM Utilities

### whenDomLoaded

Execute callback when DOM content is loaded.

#### Import
```javascript
import whenDomLoaded, {scheduleWhenDomLoaded, remove} from 'time-queues/when-dom-loaded.js';
```

#### Signatures
```javascript
whenDomLoaded(fn)           // returns undefined
scheduleWhenDomLoaded(fn)   // returns Promise
remove(fn)                  // returns boolean
```

#### Description
- `whenDomLoaded(fn)`: Queues `fn` for execution when DOM is ready. If `document.readyState` is already `'complete'` or `'interactive'`, executes via `queueMicrotask`. Otherwise registers `DOMContentLoaded` listener.
- `scheduleWhenDomLoaded(fn)`: Promise wrapper — resolves with `fn?.()` result.
- `remove(fn)`: Removes a previously queued function. Returns `true` if found and removed.

### whenLoaded

Execute callback when page is fully loaded.

#### Import
```javascript
import whenLoaded, {scheduleWhenLoaded, remove} from 'time-queues/when-loaded.js';
```

#### Signatures
```javascript
whenLoaded(fn)           // returns undefined
scheduleWhenLoaded(fn)   // returns Promise
remove(fn)               // returns boolean
```

#### Description
- `whenLoaded(fn)`: Queues `fn` for execution when page is fully loaded. If `document.readyState` is already `'complete'`, executes via `queueMicrotask`. Otherwise registers `load` listener on `window`.
- `scheduleWhenLoaded(fn)`: Promise wrapper — resolves with `fn?.()` result.
- `remove(fn)`: Removes a previously queued function. Returns `true` if found and removed.

## Random Utilities

### random-dist

_Since version 1.3.0._

Random number generation from various probability distributions.

#### Import
```javascript
import {uniform, normal, expo, pareto} from 'time-queues/random-dist.js';
```

#### Functions

- `uniform(min, max)`: Returns random number uniformly distributed between `min` and `max`
- `normal(mean, stdDev, skewness)`: Returns random number from normal distribution. `skewness` defaults to `0` (symmetric).
- `expo(lambda)`: Returns random number from exponential distribution with rate `lambda`
- `pareto(min, alpha)`: Returns random number from Pareto distribution with minimum `min` and shape `alpha`

### random-sleep

_Since version 1.3.0._

Randomized delay functions using probability distributions.

#### Import
```javascript
import randomSleep, {randomUniformSleep, randomNormalSleep, randomExpoSleep, randomParetoSleep} from 'time-queues/random-sleep.js';
```

#### Factory Functions (return `() => Promise`)

- `randomUniformSleep(min, max)`: Returns function that sleeps for uniform random time between `min` and `max` ms
- `randomNormalSleep(mean, stdDev, skewness)`: Returns function that sleeps for normally distributed random time. `skewness` defaults to `0`.
- `randomExpoSleep(rate, range, base)`: Returns function that sleeps for `range * expo(rate) + base` ms. `base` defaults to `0`.
- `randomParetoSleep(min, ratio)`: Returns function that sleeps for Pareto distributed random time. `ratio` defaults to `0.8` (must be between 0.5 and 1, exclusive). Throws `Error` if `ratio` is invalid.

#### Direct Function (returns `Promise`)

- `randomSleep(max, min)`: Returns `Promise` that resolves after uniform random sleep between `min` (default: `0`) and `max` ms. This is also the default export.

## TypeScript Support

All source files have corresponding `.d.ts` type definition files in the `src/` directory. TypeScript validation is available via:

- `npm run ts-check`: Static analysis using `tsc --noEmit` (checks `ts-check/` directory)
- `npm run ts-test`: Runtime TypeScript tests (checks `ts-tests/` directory)

## See Also

- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [README](../../README.md) - User-facing documentation
- [Wiki](https://github.com/uhop/time-queues/wiki) - Component documentation
- [Examples](../../examples/README.md) - Usage examples
