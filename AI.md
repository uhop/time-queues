# AI Agent Guide for time-queues

This document provides explicit guidance for AI agents working with the time-queues library.

## Project Overview

`time-queues` is a JavaScript library for managing asynchronous tasks and scheduling. It provides browser-optimized queue implementations and utility functions for timing and concurrency control.

## Key Concepts for AI Agents

### Core Architecture
- **MicroTask**: Base task unit with promise-based resolution
- **MicroTaskQueue**: Base queue with task lifecycle management
- **ListQueue**: Linked-list based queue implementation
- **Scheduler**: Time-based task scheduling with min-heap ordering

### Specialized Queues
- **IdleQueue**: Background tasks during browser idle periods
- **FrameQueue**: Animation frame synchronized execution
- **LimitedQueue**: Concurrency-controlled task execution

### Design Patterns
- Promise-based interfaces with proper error handling
- Memory-efficient data structures (linked lists, heaps)
- Graceful degradation across environments
- Clean resource management and cleanup

## Recommended Exploration Path

1. **Entry Point**: Start with `src/MicroTask.js` and `src/MicroTaskQueue.js`
2. **Queue Hierarchy**: Understand inheritance from MicroTaskQueue → ListQueue → specialized queues
3. **Scheduler**: Examine time-based scheduling in `src/Scheduler.js`
4. **Utilities**: Review helper functions in `src/defer.js`, `src/sleep.js`, etc.

## Common AI Use Cases

### Task Scheduling
```javascript
import scheduler from 'time-queues/Scheduler.js';
scheduler.enqueue(() => console.log('delayed'), 1000);
```

### Background Processing
```javascript
import idleQueue from 'time-queues/IdleQueue.js';
idleQueue.enqueue(() => processLowPriorityWork());
```

### Resource Management
```javascript
import Retainer from 'time-queues/Retainer.js';
const resourceManager = new Retainer({create, destroy});
```

## Documentation Navigation

- **ARCHITECTURE.md**: Deep technical design and patterns
- **API.md**: Complete method signatures and parameters
- **CONTRIBUTING.md**: Extension and modification guidelines
- **Source Code**: Inline comments provide implementation details

## Environment Support

Works in browsers, Node.js, Bun, and Deno with appropriate API fallbacks.

## Key Files for Understanding

- `src/MicroTask.js`: Task foundation
- `src/MicroTaskQueue.js`: Queue base class
- `src/ListQueue.js`: Generic queue implementation
- `src/Scheduler.js`: Time-based scheduling
- `src/IdleQueue.js`: Browser idle processing