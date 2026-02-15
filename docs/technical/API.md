# Time Queues - API Specification

## Table of Contents
- [Core Classes](#core-classes)
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
  - [random utilities](#random-utilities)

## Core Classes

### MicroTask

Base class for deferred execution with promise resolution capabilities.

#### Constructor
```javascript
new MicroTask(fn)
```
- `fn`: Function to execute when task runs

#### Properties
- `fn`: The function associated with this task
- `promise`: Promise that resolves when task completes
- `settled`: Boolean indicating if task has settled (resolved/rejected)
- `isCanceled`: Boolean indicating if task was canceled

#### Methods
- `makePromise()`: Creates promise for this task, returns this
- `resolve(value)`: Resolves task with given value, returns this
- `cancel([error])`: Cancels task with optional error cause, returns this

#### Events
- Task completion: Promise resolution
- Task cancellation: Promise rejection with `CancelTaskError`

### MicroTaskQueue

Base queue class that manages task lifecycle.

#### Constructor
```javascript
new MicroTaskQueue([paused])
```
- `paused`: Boolean indicating initial paused state (default: false)

#### Properties
- `paused`: Boolean indicating queue pause state

#### Methods
- `get isEmpty()`: Returns boolean indicating if queue has no tasks
- `pause()`: Pauses queue execution, returns this
- `resume()`: Resumes queue execution, returns this
- `enqueue(fn)`: Adds function to queue, returns MicroTask
- `dequeue(task)`: Removes specific task from queue, returns this
- `clear()`: Removes all tasks from queue, returns this
- `schedule([fn, ...args])`: Schedules function with arguments, returns MicroTask

#### Static Methods
- `MicroTaskQueue.returnArgs(...args)`: Returns arguments as array

### ListQueue

Generic list-based queue implementation using linked lists.

#### Constructor
```javascript
new ListQueue([paused])
```
- `paused`: Boolean indicating initial paused state (default: false)

#### Properties
- Inherits all MicroTaskQueue properties
- `list`: Internal linked list storing tasks

#### Methods
- Inherits all MicroTaskQueue methods
- `startQueue()`: Abstract method to start queue processing (must be overridden)

### Scheduler

Time-based task scheduling using min-heap.

#### Constructor
```javascript
new Scheduler([paused, tolerance])
```
- `paused`: Boolean indicating initial paused state (default: false)
- `tolerance`: Timing tolerance in ms (default: 4)

#### Properties
- Inherits all MicroTaskQueue properties
- `queue`: Internal min-heap storing scheduled tasks
- `tolerance`: Timing tolerance in ms
- `nextTime`: Timestamp of next scheduled task

#### Methods
- Inherits all MicroTaskQueue methods
- `get nextTime()`: Returns timestamp of next scheduled task (Infinity if empty)

## Specialized Queues

### IdleQueue

Executes tasks during browser idle periods.

#### Constructor
```javascript
new IdleQueue([paused, timeoutBatchInMs, options])
```
- `paused`: Boolean indicating initial paused state (default: false)
- `timeoutBatchInMs`: Batch duration for timeout callbacks (default: undefined)
- `options`: Options passed to requestIdleCallback

#### Properties
- Inherits all ListQueue properties
- `timeoutBatch`: Timeout batch duration setting

#### Methods
- Inherits all ListQueue methods
- `startQueue()`: Starts idle callback processing
- `processTasks(deadline)`: Processes tasks according to idle deadline

#### Exported Instances
- `idleQueue`: Default IdleQueue instance
- `defer`: Bound enqueue method of idleQueue

### FrameQueue

Executes tasks during animation frames.

#### Constructor
```javascript
new FrameQueue([paused, batchInMs])
```
- `paused`: Boolean indicating initial paused state (default: false)
- `batchInMs`: Maximum time to spend processing per frame (default: undefined)

#### Properties
- Inherits all ListQueue properties
- `batch`: Batch duration setting

#### Methods
- Inherits all ListQueue methods
- `startQueue()`: Starts animation frame processing
- `processTasks(timeStamp)`: Processes tasks according to frame timing

#### Exported Instances
- `frameQueue`: Default FrameQueue instance

### LimitedQueue

Concurrency-controlled queue with active task limits.

#### Constructor
```javascript
new LimitedQueue(limit, [paused])
```
- `limit`: Maximum concurrent tasks allowed
- `paused`: Boolean indicating initial paused state (default: false)

#### Properties
- Inherits all ListQueue properties
- `taskLimit`: Maximum concurrent tasks allowed
- `activeTasks`: Current count of active tasks
- `isIdle`: Boolean indicating if no active tasks and empty queue

#### Methods
- Inherits all ListQueue methods
- `waitForIdle()`: Returns Promise that resolves when queue becomes idle
- `#processTasks()`: Internal method for processing tasks within limit

#### Static Methods
- `LimitedQueue.wrap(fn)`: Wraps function in Promise for error handling

## Utility Classes

### Counter

Tracks pending task counts with waiting capabilities.

#### Constructor
```javascript
new Counter([initial])
```
- `initial`: Initial count value (default: 0)

#### Properties
- `count`: Current counter value
- `zeroWaiters`: Array of resolve functions waiting for zero count
- `functionWaiters`: Set of waiter objects waiting for conditions

#### Methods
- `get value()`: Returns current count
- `set value(value)`: Sets count and notifies waiters
- `increment()`: Increments count and notifies waiters
- `decrement()`: Decrements count and notifies waiters
- `advance(amount)`: Changes count by amount and notifies waiters
- `waitForZero()`: Returns Promise resolving when count reaches zero
- `waitFor(fn)`: Returns Promise resolving when fn(count) returns truthy
- `clearWaiters()`: Clears all waiters with NaN resolution
- `notify()`: Notifies applicable waiters of count changes

### Throttler

Rate limiting based on keys.

#### Constructor
```javascript
new Throttler([{throttleTimeout, neverSeenTimeout, vacuumPeriod}])
```
- `throttleTimeout`: Minimum time between executions per key (default: 1000)
- `neverSeenTimeout`: Delay for previously unseen keys (default: 0)
- `vacuumPeriod`: Cleanup interval for stale entries (default: throttleTimeout * 3)

#### Properties
- `throttleTimeout`: Minimum time between executions per key
- `neverSeenTimeout`: Delay for previously unseen keys
- `vacuumPeriod`: Cleanup interval for stale entries
- `lastSeen`: Map tracking last seen times per key
- `handle`: Interval handle for vacuuming

#### Methods
- `getLastSeen(key)`: Returns last seen time for key
- `getDelay(key)`: Calculates delay needed before execution for key
- `wait(key)`: Returns Promise that resolves after delay for key
- `vacuum()`: Removes stale entries from lastSeen map
- `startVacuum()`: Starts periodic vacuuming
- `stopVacuum()`: Stops periodic vacuuming

### Retainer

Resource lifecycle management with retention periods.

#### Constructor
```javascript
new Retainer({create, destroy, retentionPeriod})
```
- `create`: Async function to create resource
- `destroy`: Async function to destroy resource
- `retentionPeriod`: Time to retain resource after last release (default: 1000)

#### Properties
- `create`: Resource creation function
- `destroy`: Resource destruction function
- `retentionPeriod`: Retention period in ms
- `counter`: Reference counter
- `handle`: Retention timeout handle
- `value`: Cached resource value

#### Methods
- `get()`: Returns Promise resolving to retained resource
- `release([immediately])`: Decrements counter and optionally destroys resource

### PageWatcher

Monitors and responds to page lifecycle changes.

#### Constructor
```javascript
new PageWatcher([started])
```
- `started`: Boolean indicating initial started state (default: false)

#### Properties
- Inherits all ListQueue properties
- `currentState`: Current page state ('active', 'passive', 'hidden', 'frozen', 'terminated')

#### Methods
- Inherits all ListQueue methods except schedule()
- `enqueue(fn, initialize)`: Enqueues task with optional initialization
- `clear()`: Clears all tasks without cancellation
- `handleEvent(event)`: Handles page lifecycle events
- `getState()`: Returns current page state

#### Exported Functions
- `watchStates(queue, resumeStatesList)`: Returns function to control queue based on page states

## Utility Functions

### defer

Execute tasks in next tick using optimal environment APIs.

#### Signature
```javascript
defer(fn)
```

#### Parameters
- `fn`: Function to execute

#### Returns
- undefined

#### Description
Uses requestIdleCallback when available, falls back to setImmediate or setTimeout.

### sleep

Promise-based delay function.

#### Signature
```javascript
sleep(ms)
```

#### Parameters
- `ms`: Delay in milliseconds or Date object

#### Returns
- Promise that resolves after delay

#### Description
Supports both numeric delays and Date objects with automatic conversion.

### throttle

Limit function execution rate.

#### Signature
```javascript
throttle(fn, ms)
```

#### Parameters
- `fn`: Function to throttle
- `ms`: Minimum time between executions

#### Returns
- Throttled function

#### Description
Immediate execution on first call with trailing edge suppression.

### debounce

Delay function execution until input stabilizes.

#### Signature
```javascript
debounce(fn, ms)
```

#### Parameters
- `fn`: Function to debounce
- `ms`: Delay time in milliseconds

#### Returns
- Debounced function

#### Description
Delays execution until no calls occur for specified time.

### sample

Execute function at regular intervals.

#### Signature
```javascript
sample(fn, ms)
```

#### Parameters
- `fn`: Function to execute
- `ms`: Interval time in milliseconds

#### Returns
- Sampling function

#### Description
Maintains consistent timing with time-drift correction.

### audit

Execute function after specified delay.

#### Signature
```javascript
audit(fn, ms)
```

#### Parameters
- `fn`: Function to execute
- `ms`: Delay time in milliseconds

#### Returns
- Auditing function

#### Description
Caches arguments from last invocation and executes after delay.

### batch

Execute async operations with controlled concurrency.

#### Signature
```javascript
batch(fns, limit)
```

#### Parameters
- `fns`: Array of functions or promises to execute
- `limit`: Maximum concurrent operations (default: 4)

#### Returns
- Promise resolving to array of results

#### Description
Uses sliding window pattern with promise chaining for concurrency control.

### random utilities

Random distribution and sleep functions.

#### randomUniformSleep
```javascript
randomUniformSleep(min, max)
```
Returns function that sleeps for uniform random time between min and max.

#### randomNormalSleep
```javascript
randomNormalSleep(mean, stdDev, [skewness])
```
Returns function that sleeps for normally distributed random time.

#### randomExpoSleep
```javascript
randomExpoSleep(rate, range, [base])
```
Returns function that sleeps for exponentially distributed random time.

#### randomParetoSleep
```javascript
randomParetoSleep(min, [ratio])
```
Returns function that sleeps for Pareto distributed random time.

#### randomSleep
```javascript
randomSleep(max, [min])
```
Returns Promise that resolves after uniform random sleep time.

## TypeScript Validation

The project includes two distinct sets of TypeScript files for validation:

### Static Analysis (`ts-check/` directory)
- Compilation checks using `tsc --noEmit` for static type analysis
- Validates API usage and type correctness without runtime execution
- Ensures TypeScript definitions match implementation

### Runtime Tests (`ts-tests/` directory)
- Directly runnable TypeScript tests in Node.js, Deno, and Bun environments
- Validate cross-environment compatibility and behavior consistency
- Cannot be run directly in browsers (require JavaScript transpilation)