# time-queues Component Index

*Quick reference for finding the right component*

## By Use Case

| Use Case | Component | File | Description |
|----------|-----------|------|-------------|
| **Task Scheduling** ||||
| Run after delay | `sleep()` | `sleep.js` | Promise-based delay |
| Schedule at specific time | `Scheduler` | `Scheduler.js` | Time-based task scheduling with min-heap |
| Run every N milliseconds | `Scheduler` + `repeat` | `Scheduler.js` | Recurring task scheduling |
| Run on next tick | `defer()` | `defer.js` | Microtask execution |
| **Browser Optimization** ||||
| Background tasks | `IdleQueue` | `IdleQueue.js` | Execute during browser idle periods |
| Animation sync | `FrameQueue` | `FrameQueue.js` | Execute during animation frames |
| Page lifecycle | `PageWatcher` | `PageWatcher.js` | Monitor visibility/focus changes |
| **Rate Limiting** ||||
| Limit execution rate | `throttle()` | `throttle.js` | Function-level throttling |
| Key-based throttling | `Throttler` | `Throttler.js` | Rate limit by key/resource |
| Delay until stable | `debounce()` | `debounce.js` | Execute after input stabilizes |
| Regular intervals | `sample()` | `sample.js` | Execute at fixed intervals |
| Delay then execute | `audit()` | `audit.js` | Execute after specified delay |
| **Concurrency Control** ||||
| Control parallel execution | `LimitedQueue` | `LimitedQueue.js` | Queue with max concurrency |
| Batch async operations | `batch()` | `batch.js` | Process array with controlled concurrency |
| **Resource Management** ||||
| Lifecycle management | `Retainer` | `Retainer.js` | Create/destroy resource on demand |
| Track pending tasks | `Counter` | `Counter.js` | Count and wait for tasks |

## By Component Type

### Core Classes (Inheritance Hierarchy)
```
MicroTask → MicroTaskQueue → ListQueue → [Specialized Queues]
```

| Component | Extends | Purpose |
|-----------|---------|---------|
| `MicroTask` | - | Single task with promise lifecycle |
| `MicroTaskQueue` | - | Abstract queue base class |
| `ListQueue` | `MicroTaskQueue` | Linked-list task storage |
| `IdleQueue` | `ListQueue` | Browser idle callback |
| `FrameQueue` | `ListQueue` | Animation frame sync |
| `LimitedQueue` | `ListQueue` | Concurrency control |
| `Scheduler` | `MicroTaskQueue` | Time-based execution |
| `PageWatcher` | `ListQueue` | Page lifecycle events |

### Utility Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `defer(fn)` | Execute on next tick | `MicroTask` |
| `sleep(ms)` | Promise-based delay | `Promise` |
| `throttle(fn, wait)` | Rate limit function | `Function` |
| `debounce(fn, wait)` | Delay until stable | `Function` |
| `sample(fn, interval)` | Execute at intervals | `Function` |
| `audit(fn, wait)` | Delay then execute | `Function` |
| `batch(items, fn, opts)` | Controlled concurrency | `Promise<Array>` |

### Supporting Classes

| Component | Purpose |
|-----------|---------|
| `CancelTaskError` | Error type for cancelled tasks |
| `Counter` | Task counting with wait capabilities |
| `Retainer` | Resource lifecycle management |

## Quick Links

- **Architecture**: `../ARCHITECTURE.md`
- **Examples**: `../examples/README.md`
- **AI Guide**: `../AGENTS.md`
