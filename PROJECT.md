<!-- 
This document provides a technical overview of the time-queues project, 
intended for contributors and AI agents who need to understand the codebase architecture.
For user documentation, see README.md. 
For detailed technical specifications, see docs/technical/.
-->

# Time Queues Project Overview

*A technical overview for contributors and AI agents*

## Project Description

`time-queues` is an efficient, lightweight JavaScript library for organizing asynchronous multitasking and scheduled tasks. It works seamlessly in browsers and server-side environments like Node.js, Deno, and Bun.

The library provides elegant solutions for common timing and scheduling challenges, helping developers create responsive, efficient applications that follow best practices for resource management and user experience.

## Key Features

- **Efficient Task Scheduling**: Schedule tasks to run at specific times or after delays
- **Browser Performance Optimization**: Execute tasks during idle periods or animation frames
- **Page Lifecycle Management**: Respond intelligently to page visibility and focus changes
- **Resource Management**: Control execution rates with throttling and debouncing
- **Minimal Dependencies**: Relies only on [list-toolkit](https://www.npmjs.com/package/list-toolkit), a zero-dependency library

## Core Components

### Task Queue Classes

- **MicroTask**: Base class for deferred execution
- **MicroTaskQueue**: Base class for task queues
- **ListQueue**: List-based queue implementation

### Concurrency Control

- **LimitedQueue**: Queue with controlled concurrency
- **Throttler**: Control execution rate based on keys
- **Counter**: Track pending task counts

### Browser-Specific Components

- **IdleQueue**: Execute tasks during browser idle periods
- **FrameQueue**: Execute tasks during animation frames
- **PageWatcher**: Monitor and respond to page lifecycle changes

### Scheduling & Timing

- **Scheduler**: Time-based task scheduling
- **Retainer**: Resource lifecycle management

### Utility Functions

- **defer()**: Execute tasks in the next tick
- **sleep()**: Promise-based delay function
- **throttle()**: Limit function execution rate
- **debounce()**: Delay function execution until input stabilizes
- **sample()**: Execute function at regular intervals
- **audit()**: Execute function after specified delay
- **batch()**: Execute async operations with controlled concurrency

### Random Distribution Utilities

- **random-dist**: Generate random numbers from various probability distributions
- **random-sleep**: Create randomized delays with various probability distributions

## Project Structure

```
time-queues/
├── src/
│   ├── CancelTaskError.js          # Error class for canceled tasks
│   ├── Counter.js                  # Task counter with waiting capabilities
│   ├── FrameQueue.js               # Queue that executes tasks during animation frames
│   ├── IdleQueue.js                # Queue that executes tasks during browser idle periods
│   ├── LimitedQueue.js             # Queue with controlled concurrency
│   ├── ListQueue.js                # Base list-based queue implementation
│   ├── MicroTask.js                # Base microtask implementation
│   ├── MicroTaskQueue.js           # Base microtask queue implementation
│   ├── PageWatcher.js              # Page lifecycle monitoring
│   ├── Retainer.js                 # Resource lifecycle management
│   ├── Scheduler.js                # Time-based task scheduling
│   ├── Throttler.js                # Rate limiting based on keys
│   ├── audit.js                    # Audit function with delay
│   ├── batch.js                    # Execute async operations with controlled concurrency
│   ├── debounce.js                 # Debounce function
│   ├── defer.js                    # Deferred execution
│   ├── random-dist.js              # Random number distributions
│   ├── random-sleep.js             # Random sleep functions
│   ├── sample.js                   # Sample function at regular intervals
│   ├── sleep.js                    # Promise-based sleep function
│   ├── throttle.js                 # Throttle function
│   ├── when-dom-loaded.js          # DOM loading event handling
│   └── when-loaded.js              # Page load event handling
├── tests/
│   ├── test-*.js                   # Unit tests for various components
├── ts-check/
│   └── *.ts                        # TypeScript static analysis files
├── ts-tests/
│   └── test-*.ts                   # Runtime TypeScript tests
├── docs/
│   └── technical/                  # Technical documentation for contributors
│       ├── ARCHITECTURE.md         # Detailed architecture and design patterns
│       ├── API.md                  # Complete API specifications
│       ├── CONTRIBUTING.md         # Contribution guidelines
│       └── README.md               # Technical documentation overview
└── package.json
```

## Dependencies

### Production Dependencies
- **list-toolkit**: Zero-dependency library for list operations

### Development Dependencies
- **tape-six**: Testing framework
- **tape-six-proc**: Process-based test runner
- **typescript**: Type checking

## Testing Approach

The project employs comprehensive testing strategies:

### JavaScript Tests
- Unit tests for all core components in `tests/` directory
- Integration tests for queue behaviors and interactions
- Browser-specific functionality tests

### TypeScript Validation
- **Static Analysis** (`ts-check/`): Compilation checks using `tsc --noEmit`
- **Runtime Tests** (`ts-tests/`): Executable TypeScript tests for Node.js, Deno, and Bun

### Cross-Environment Compatibility
- Tests run in Node.js, Deno, and Bun environments
- Cannot run TypeScript tests directly in browsers (require JavaScript transpilation)



## Installation

```bash
npm install time-queues
```

## Usage Examples

### Basic Usage
```javascript
import {Scheduler, repeat} from 'time-queues/Scheduler.js';
import idleQueue from 'time-queues/IdleQueue.js';
import defer from 'time-queues/defer.js';

// Schedule a task to run after 1 second
const scheduler = new Scheduler();
scheduler.enqueue(() => console.log('Hello after 1s'), 1000);

// Defer execution to next tick
defer(() => console.log('Deferred execution'));
```

### Browser Integration
```javascript
import {IdleQueue, FrameQueue, PageWatcher} from 'time-queues';

// Use idle queue for background tasks
const idleQueue = new IdleQueue();
idleQueue.enqueue(() => console.log('Background task'));

// Use frame queue for animation tasks
const frameQueue = new FrameQueue();
frameQueue.enqueue(({timeStamp}) => {
  console.log('Frame task', timeStamp);
});

// Monitor page lifecycle
const pageWatcher = new PageWatcher();
pageWatcher.enqueue((state, prevState) => {
  console.log('Page state changed:', state);
});
```

## Architecture Summary

### Core Design Patterns
- **Hierarchical Task Management**: Base `MicroTask` → `MicroTaskQueue` → specialized implementations
- **Promise-Based Interfaces**: All tasks integrate seamlessly with JavaScript's Promise system
- **Event-Driven Processing**: Uses browser and Node.js event systems for optimal performance
- **Memory-Efficient Data Structures**: Linked lists and heaps for O(1) and O(log n) operations

### Key Implementation Details
- **Cancellation Support**: Clean resource cleanup with custom `CancelTaskError`
- **Graceful Degradation**: Feature detection for environment-specific APIs
- **Lazy Evaluation**: Tasks only create promises when accessed
- **Batched Processing**: Efficient handling of multiple tasks

The library leverages several environment-specific APIs:
- Browser APIs: `requestIdleCallback()`, `requestAnimationFrame()`, `queueMicrotask()`, `setTimeout()`, and page lifecycle events
- Node.js, Bun, and Deno environments are all supported with appropriate API fallbacks

## Extensibility

The library is designed for easy extension:

### Creating Custom Queues
Extend `ListQueue` or `MicroTaskQueue` to create specialized queue implementations

### Adding Utility Functions
Follow existing patterns in `src/` for consistent API design

### Contributing
See `docs/technical/CONTRIBUTING.md` for detailed contribution guidelines

## License

BSD-3-Clause License