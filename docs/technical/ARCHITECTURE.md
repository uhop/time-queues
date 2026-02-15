# Time Queues - Technical Architecture

## Project Overview

`time-queues` is a JavaScript library for organizing asynchronous multitasking and scheduled tasks. It provides efficient solutions for timing and scheduling challenges with browser-optimized queue implementations. It works seamlessly in browsers, Node.js, Bun, and Deno environments.

## Core Architecture

### Task Management System
The library is built around a hierarchical task management system:
- `MicroTask`: Base class for deferred execution with promise resolution capabilities. Internally uses `Promise.withResolvers()` when available, falling back to manual Promise construction. Tracks settled state and provides clean cancellation with `CancelTaskError`.
- `MicroTaskQueue`: Base queue class that manages task lifecycle (enqueue, dequeue, cancel). Provides generic `schedule()` method that wraps functions in promise-returning tasks.
- `ListQueue`: Concrete implementation using linked lists (from list-toolkit) for efficient O(1) task management. Manages queue processing lifecycle with start/stop mechanisms.
- `Scheduler`: Time-based task scheduling using min-heap for efficient O(log n) time ordering. Tasks are executed within a configurable tolerance window for performance optimization.

### Queue Types
The library provides multiple queue implementations optimized for different use cases:
- **IdleQueue**: Uses `requestIdleCallback()` for background task execution during browser idle periods. Configurable timeout batching for consistent performance. Falls back to `setTimeout` in Node.js environments.
- **FrameQueue**: Uses `requestAnimationFrame()` for animation frame-based execution. Optional time-based batching to limit execution time per frame. Processes tasks in FIFO order within each frame.
- **ListQueue**: Generic list-based queue with standard task management using doubly-linked lists. Automatic queue processor start/stop based on task availability.
- **LimitedQueue**: Concurrency-controlled queue that limits simultaneous task execution. Uses internal counters and waiter patterns to manage active task limits. Asynchronous task wrapping ensures proper error handling.

## Key Design Patterns

### 1. Promise-based Task Handling
All tasks are wrapped in MicroTask objects that provide promise-based interfaces:
- Tasks can be resolved or canceled with proper cleanup of internal references
- Cancellation uses a custom `CancelTaskError` exception with optional cause chaining
- Integration with JavaScript's native Promise system through standard Promise APIs
- Automatic promise creation on demand with memoization to prevent duplicate promises

### 2. Browser API Abstraction
The library abstracts various browser APIs with graceful fallbacks:
- Uses `requestIdleCallback` when available, falls back to `setTimeout` with 0ms delay
- Handles page lifecycle events through `PageWatcher` with state transition callbacks
- Leverages `requestAnimationFrame` for smooth animations with optional batching controls
- Feature detection patterns ensure compatibility across environments (browser/Node.js/Bun/Deno)

### 3. Memory Management
- Task cancellation properly cleans up references to prevent memory leaks through nulling internal callbacks
- `Counter` class provides tracking with waiting capabilities for resource management using Set-based waiter storage
- `Retainer` class manages resource lifecycle with configurable retention periods and automatic cleanup timers
- Event listener registration/deregistration prevents accumulation of handlers

## Key Components

### Scheduler
- Implements time-based task scheduling using a min-heap data structure for O(log n) insertions/removals
- Supports both absolute time (Date objects) and relative delays (numbers) with automatic conversion
- Provides `repeat` function for creating recurring tasks with preserved delay semantics
- Handles timing precision with configurable tolerance (default 4ms) to balance accuracy and performance
- Automatic timer rescheduling when earlier tasks are added to optimize execution timing

### Throttler
- Rate limiting based on keys to prevent excessive execution with per-key tracking
- Configurable timeout periods (throttleTimeout), initial delay (neverSeenTimeout), and cleanup intervals (vacuumPeriod)
- Memory-efficient tracking using Map data structure with automatic cleanup of stale entries
- Non-blocking delay implementation using promise-wrapped setTimeout for async/await compatibility

### Utility Functions
- `defer()`: Execute tasks in next tick using optimal browser APIs (requestIdleCallback > setImmediate > setTimeout)
- `sleep()`: Promise-based delay function supporting both numeric delays and Date objects with automatic conversion
- `throttle()`: Limit function execution rate with immediate execution on first call and trailing edge suppression
- `debounce()`: Delay function execution until input stabilizes with proper timer cancellation on subsequent calls
- `sample()`: Execute function at regular intervals with time-drift correction for consistent timing
- `audit()`: Execute function after specified delay with argument caching for last invocation
- `batch()`: Execute async operations with controlled concurrency using sliding window pattern with promise chaining

### Random Distribution Utilities
- `random-dist`: Generate random numbers from various probability distributions (uniform, normal, exponential, Pareto) with statistical accuracy
- `random-sleep`: Create randomized delays with various probability distributions using underlying random-dist functions

## Implementation Details

### Error Handling
- Custom `CancelTaskError` extends JavaScript's Error class with proper stack trace capture and optional cause chaining
- Proper cleanup on task cancellation to prevent memory leaks through reference nulling and state tracking
- Integration with Promise rejection mechanisms using standard Promise.reject() patterns
- Consistent error propagation through promise chains with automatic rejection handling

### Environment Compatibility
- Graceful degradation when browser APIs are not available through feature detection patterns
- Uses feature detection for `requestIdleCallback`, `requestAnimationFrame`, etc. with environment-appropriate fallbacks
- Falls back to standard `setTimeout` for basic functionality with consistent API surface across environments
- Node.js/Bun/Deno compatibility through polyfill patterns and timer API unification

### Performance Considerations
- Minimal memory overhead through efficient data structures (linked lists, min-heaps, Maps) with O(1) and O(log n) operations
- Lazy task execution to avoid unnecessary work with automatic queue pausing when no tasks pending
- Proper cleanup of event listeners and timers with deterministic deregistration patterns
- Efficient heap operations for scheduling with bulk task processing within tolerance windows
- Batched DOM/event operations to minimize browser reflow/repaint costs

## Usage Patterns

### Task Scheduling
```javascript
const scheduler = new Scheduler();
scheduler.enqueue(() => console.log('Delayed task'), 1000);
```

### Browser Optimization
```javascript
// Background tasks during idle periods
const idleQueue = new IdleQueue();
idleQueue.enqueue(() => processBackgroundTask());

// Animation frame tasks
const frameQueue = new FrameQueue();
frameQueue.enqueue(({timeStamp}) => animateFrame(timeStamp));
```

### Concurrency Control
```javascript
// Limit concurrent operations
const limitedQueue = new LimitedQueue(3); // Max 3 concurrent tasks
limitedQueue.enqueue(async () => await performOperation());
```

### Resource Management
```javascript
// Manage resource lifecycle
const retainer = new Retainer({
  create: () => createResource(),
  destroy: (resource) => destroyResource(resource)
});
const resource = await retainer.get();
// Use resource...
await retainer.release();
```

## Integration Points

### External Dependencies
- **list-toolkit**: Core dependency for list and heap data structures
- **tape-six**: Test framework for unit testing

### Browser APIs Used
- `requestIdleCallback()` for background tasks
- `requestAnimationFrame()` for animation frames
- `queueMicrotask()` for microtask execution
- Page lifecycle events for state management
- Standard `setTimeout` for basic timing

### Environment Support
The library is designed to work in Node.js, Bun, and Deno environments and provides similar functionality to browser environments.

## Testing Approach

The project uses a comprehensive test suite:
- Unit tests for all core components
- Integration tests for queue behaviors
- Browser-specific functionality tests
- TypeScript compilation checks for static analysis
- Runtime TypeScript tests for Node.js, Deno, and Bun compatibility (TypeScript cannot be run natively in browsers)

### TypeScript Validation
- `ts-check/` directory: TypeScript compilation checks for static analysis using `tsc --noEmit`
- `ts-tests/` directory: Directly runnable TypeScript tests in Node.js, Deno, and Bun environments (browsers require JavaScript transpilation)


This architecture document provides the technical foundation for understanding and working with the time-queues library, covering architectural decisions, implementation details, and usage patterns. For contribution guidelines and API specifications, refer to CONTRIBUTING.md and the individual source files in src/.