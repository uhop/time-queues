# Time Queues - Technical Knowledge Base

## Project Overview

`time-queues` is a JavaScript library for organizing asynchronous multitasking and scheduled tasks. It provides efficient solutions for timing and scheduling challenges with browser-optimized queue implementations. It works seamlessly in browsers, Node.js, Bun, and Deno environments.

## Core Architecture

### Task Management System
The library is built around a hierarchical task management system:
- `MicroTask`: Base class for deferred execution with promise resolution capabilities
- `MicroTaskQueue`: Base queue class that manages task lifecycle (enqueue, dequeue, cancel)
- `ListQueue`: Concrete implementation using linked lists for efficient task management
- `Scheduler`: Time-based task scheduling using min-heap for efficient time ordering

### Queue Types
The library provides multiple queue implementations optimized for different use cases:
- **IdleQueue**: Uses `requestIdleCallback()` for background task execution during browser idle periods
- **FrameQueue**: Uses `requestAnimationFrame()` for animation frame-based execution
- **ListQueue**: Generic list-based queue with standard task management
- **LimitedQueue**: Concurrency-controlled queue that limits simultaneous task execution

## Key Design Patterns

### 1. Promise-based Task Handling
All tasks are wrapped in MicroTask objects that provide promise-based interfaces:
- Tasks can be resolved or canceled
- Cancellation uses a custom `CancelTaskError` exception
- Integration with JavaScript's native Promise system

### 2. Browser API Abstraction
The library abstracts various browser APIs:
- Uses `requestIdleCallback` when available, falls back to `setImmediate` or `setTimeout`
- Handles page lifecycle events through `PageWatcher`
- Leverages `requestAnimationFrame` for smooth animations

### 3. Memory Management
- Task cancellation properly cleans up references to prevent memory leaks
- `Counter` class provides tracking with waiting capabilities for resource management
- `Retainer` class manages resource lifecycle with configurable retention periods

## Key Components

### Scheduler
- Implements time-based task scheduling using a min-heap data structure
- Supports both absolute time (Date objects) and relative delays (numbers)
- Provides `repeat` function for creating recurring tasks
- Handles timing precision with configurable tolerance

### Throttler
- Rate limiting based on keys to prevent excessive execution
- Configurable timeout periods and vacuuming for cleanup
- Memory-efficient tracking using Map data structure

### Utility Functions
- `defer()`: Execute tasks in next tick using browser APIs
- `sleep()`: Promise-based delay function
- `throttle()`: Limit function execution rate
- `debounce()`: Delay function execution until input stabilizes
- `sample()`: Execute function at regular intervals
- `audit()`: Execute function after specified delay
- `batch()`: Execute async operations with controlled concurrency

### Random Distribution Utilities
- `random-dist`: Generate random numbers from various probability distributions
- `random-sleep`: Create randomized delays with various probability distributions

## Implementation Details

### Error Handling
- Custom `CancelTaskError` extends JavaScript's Error class
- Proper cleanup on task cancellation to prevent memory leaks
- Integration with Promise rejection mechanisms

### Environment Compatibility
- Graceful degradation when browser APIs are not available
- Uses feature detection for `requestIdleCallback`, `requestAnimationFrame`, etc.
- Falls back to standard `setTimeout` for basic functionality

### Performance Considerations
- Minimal memory overhead through efficient data structures
- Lazy task execution to avoid unnecessary work
- Proper cleanup of event listeners and timers
- Efficient heap operations for scheduling

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
- TypeScript type checking for static analysis

This knowledge base provides the technical foundation for understanding and working with the time-queues library, covering architectural decisions, implementation details, and usage patterns.
