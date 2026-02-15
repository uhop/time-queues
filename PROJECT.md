# Project Overview

*Technical reference for contributors and AI agents. For the end-user overview see [README.md](README.md). For AI-specific guidance see [CLAUDE.md](CLAUDE.md).*

## Project Structure

```
time-queues/
├── src/                            # Source code (ES modules)
│   ├── MicroTask.js                # Base task unit
│   ├── MicroTaskQueue.js           # Abstract queue base class
│   ├── ListQueue.js                # Linked-list queue implementation
│   ├── Scheduler.js                # Time-based scheduling (extends MicroTaskQueue)
│   ├── IdleQueue.js                # Browser idle periods (extends ListQueue)
│   ├── FrameQueue.js               # Animation frames (extends ListQueue)
│   ├── LimitedQueue.js             # Concurrency control (extends ListQueue)
│   ├── PageWatcher.js              # Page lifecycle (extends ListQueue)
│   ├── Counter.js                  # Task counter with async waiting
│   ├── Throttler.js                # Key-based rate limiting
│   ├── Retainer.js                 # Resource lifecycle management
│   ├── CancelTaskError.js          # Cancellation error class
│   ├── defer.js                    # Next-tick execution
│   ├── sleep.js                    # Promise-based delay
│   ├── throttle.js / debounce.js   # Rate limiting functions
│   ├── sample.js / audit.js        # Sampling functions
│   ├── batch.js                    # Concurrency-limited batch execution
│   ├── random-dist.js              # Random number distributions
│   ├── random-sleep.js             # Randomized delays
│   ├── when-dom-loaded.js          # DOMContentLoaded handler
│   ├── when-loaded.js              # Window load handler
│   ├── *.d.ts                      # TypeScript definitions (per module)
│   └── index.d.ts                  # Barrel type exports
├── tests/
│   └── test-*.js                   # Unit tests (tape-six)
├── ts-check/
│   └── *.ts                        # TypeScript static analysis files
├── ts-tests/
│   └── test-*.ts                   # Runtime TypeScript tests
├── wiki/                           # GitHub wiki source (git submodule)
├── docs/technical/                  # Technical docs (architecture, API, contributing)
├── examples/                        # Copy-pasteable usage examples
├── prompts/                         # Documentation generation prompts
└── package.json
```

## Dependencies

| Type | Package | Purpose |
|---|---|---|
| Production | [list-toolkit](https://www.npmjs.com/package/list-toolkit) | Linked lists and min-heaps (zero-dep) |
| Dev | [tape-six](https://www.npmjs.com/package/tape-six) | Testing framework |
| Dev | [tape-six-proc](https://www.npmjs.com/package/tape-six-proc) | Process-based test runner |
| Dev | [typescript](https://www.npmjs.com/package/typescript) | Type checking |

## Testing

```bash
npm test              # JavaScript tests (Node.js)
npm run ts-check      # TypeScript static analysis (tsc --noEmit)
npm run ts-test       # Runtime TypeScript tests
npm run test:bun      # Bun runtime
npm run test:deno     # Deno runtime
npm run lint          # Check formatting (Prettier)
npm run lint:fix      # Fix formatting
npm start             # Start test web server (browser tests at /tests/web/)
```

- **Unit tests** (`tests/test-*.js`): cover all core components
- **TS static analysis** (`ts-check/`): compilation checks
- **TS runtime tests** (`ts-tests/`): executable tests for Node.js, Deno, Bun
- Tests run across Node.js, Deno, and Bun; browser tests require the dev server

## License

BSD-3-Clause
