# Claude / AI Agent Guide for time-queues

*Targeted guidance for AI agents modifying or extending this codebase*

## Quick Start for AI Agents

**Read these files in order when exploring:**
1. `src/MicroTask.js` - Base task unit
2. `src/MicroTaskQueue.js` - Queue base class  
3. `src/ListQueue.js` - Generic queue implementation
4. This file (`CLAUDE.md`)

**Key architecture insight:** The library uses a 3-level inheritance hierarchy:
```
MicroTask (single task)
  ↓
MicroTaskQueue (task management)
  ↓
ListQueue (linked-list storage)
  ↓
[Specialized queues: IdleQueue, FrameQueue, LimitedQueue, Scheduler]
```

## Common Tasks for AI Agents

### Adding a New Queue Type

**Pattern to follow:**
```javascript
// 1. Extend MicroTaskQueue or ListQueue
export class MyQueue extends ListQueue {
  constructor(options = {}) {
    super(options);
    // Initialize queue-specific state
  }

  // 2. Implement processTasks() - REQUIRED
  processTasks() {
    // Process tasks from this.list
    // Return true if more tasks may need processing
    // Return false if done
  }

  // 3. Add queue-specific lifecycle methods
  start() { /* begin processing */ }
  stop() { /* halt processing */ }
}

// 4. Always export default
export default MyQueue;
```

**Files to create:**
- `src/MyQueue.js` - Implementation
- `src/MyQueue.d.ts` - TypeScript definitions (copy from similar queue)
- `tests/test-my-queue.js` - Tests (see existing test patterns)

### Adding a Utility Function

**Pattern to follow:**
```javascript
/**
 * Brief description of what this does.
 * @param {Type} param - Description
 * @returns {ReturnType} Description
 */
export const myUtility = (param) => {
  // Implementation returning a Promise
  return new Promise((resolve) => {
    // ...
  });
};

export default myUtility;
```

**Files to create:**
- `src/myUtility.js` - Implementation with JSDoc
- `src/myUtility.d.ts` - TypeScript definitions
- Add example to `examples/` directory

### Modifying Existing Components

**Critical constraints:**
- Maintain backward compatibility for public APIs
- Keep promise-based interfaces
- Preserve cancellation support via `CancelTaskError`
- Update `.d.ts` files when changing signatures

## Design Principles (NEVER violate these)

1. **Lazy Promise Creation**: Promises are only created when `.promise` is accessed
2. **Clean Cancellation**: All tasks must support cancellation without side effects
3. **Graceful Degradation**: Use feature detection, not environment sniffing
4. **Memory Efficiency**: Prefer linked lists over arrays for queues
5. **Universal Patterns**: Code must work in browsers, Node.js, Deno, and Bun

## Testing Requirements

Before submitting changes:
```bash
# Run all tests
npm test

# TypeScript checks
npm run ts-check

# Test specific runtime (if modifying platform-specific code)
npm run test:bun
npm run test:deno
```

## Code Style (enforced by Prettier)

- 2-space indentation
- Single quotes
- No trailing semicolons
- 120 character line width

Run `npm run lint:fix` before completing work.

## Quick Reference: Component Purposes

| Component | Purpose | Extends |
|-----------|---------|---------|
| `MicroTask` | Single deferred task | - |
| `MicroTaskQueue` | Task lifecycle management | - |
| `ListQueue` | Linked-list task storage | MicroTaskQueue |
| `Scheduler` | Time-based execution | ListQueue |
| `IdleQueue` | Browser idle callback | ListQueue |
| `FrameQueue` | Animation frame sync | ListQueue |
| `LimitedQueue` | Concurrency control | ListQueue |
| `Throttler` | Rate limiting by key | MicroTaskQueue |
| `Counter` | Task counting/waiting | - |
| `Retainer` | Resource lifecycle | - |
| `PageWatcher` | Page lifecycle events | MicroTaskQueue |

## Common Pitfalls to Avoid

1. **Don't use `setTimeout`/`setInterval` directly** - Use `Scheduler` or utility functions
2. **Don't store references to private fields** - Always use public APIs
3. **Don't forget to handle cancellation** - Check `task.isCanceled` before execution
4. **Don't break the promise chain** - Always return promises from async methods

## Links to Key Documentation

- Architecture deep-dive: `docs/technical/ARCHITECTURE.md`
- API reference: `docs/technical/API.md`
- Contributing guide: `docs/technical/CONTRIBUTING.md`
- Examples: `examples/` (if you've created any)

---

*When in doubt, follow existing patterns in the codebase. The library prioritizes consistency and reliability over cleverness.*
