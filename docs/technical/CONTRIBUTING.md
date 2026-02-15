# Contributing to Time Queues

## Overview

Thank you for your interest in contributing to Time Queues! This guide explains how to contribute effectively to the project, covering development setup, coding standards, testing practices, and submission processes.

## Development Setup

### Prerequisites
- Node.js (modern version with ES module support)
- npm package manager
- Git for version control
- Optionally: Bun and/or Deno for cross-environment testing

### Initial Setup
1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/time-queues.git
   cd time-queues
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Project Structure
```
time-queues/
├── src/              # Source code (.js) and type definitions (.d.ts)
├── tests/            # Unit tests (tape-six)
│   ├── manual/       # Manual test files
│   └── web/          # Browser-specific tests
├── ts-check/         # TypeScript static analysis files
├── ts-tests/         # Runtime TypeScript tests
├── docs/             # Technical documentation
│   └── technical/    # Architecture, API, and contributing docs
├── wiki/             # Component documentation (GitHub wiki)
├── examples/         # Usage examples
├── prompts/          # AI documentation generation prompts
├── package.json      # Project configuration
├── tsconfig.json     # TypeScript configuration
├── .cursorrules      # AI agent conventions
├── CLAUDE.md         # AI agent guidance
├── AI.md             # AI agent overview
├── PROJECT.md        # Technical project overview
└── README.md         # User documentation
```

## Coding Standards

### JavaScript Style
- ES modules (`import`/`export`) — the project uses `"type": "module"`
- Prefer `const`/`let` over `var`
- Use meaningful variable and function names
- Maintain consistent indentation (2 spaces)
- Format with Prettier (config in `.prettierrc`)
- Each source file starts with `// @ts-self-types="./FileName.d.ts"` for TypeScript support

### Key Patterns
- **Lazy promise creation**: `MicroTask` creates promises only when `makePromise()` is called
- **Start/stop queue pattern**: `startQueue()` returns a stop function stored in `this.stopQueue`
- **Cancellation**: Always use `CancelTaskError` for task cancellation
- **Default exports**: Most modules export both named and default exports
- **Singleton instances**: Queue modules often export a default instance (e.g., `scheduler`, `idleQueue`, `frameQueue`, `pageWatcher`)

### Documentation
- Include examples for complex functionality
- Keep [README.md](../../README.md) updated with user-facing changes
- Update [wiki](https://github.com/uhop/time-queues/wiki) for component documentation changes
- Update [ARCHITECTURE.md](ARCHITECTURE.md) for significant architectural changes
- Each `.js` source file should have a corresponding `.d.ts` type definition

### Error Handling
- Use `CancelTaskError` for task cancellation (extends `Error` with optional `cause`)
- Provide meaningful error messages
- Handle edge cases gracefully
- Ensure proper resource cleanup (null references, clear timers, remove event listeners)

## Testing

### Test Framework
The project uses [tape-six](https://github.com/nicklatkovich/tape-six) for testing. Tests are located in the `tests/` directory.

### Writing Tests
- Each source file should have a corresponding test file (e.g., `test-scheduler.js` for `Scheduler.js`)
- Test both success and failure cases
- Use descriptive test names
- Browser-specific tests go in `tests/web/`

### Running Tests
```bash
# Run all tests (Node.js)
npm test

# Run tests with Bun
npm run test:bun

# Run tests with Deno
npm run test:deno

# Run tests in process mode
npm run test:proc
npm run test:proc:bun
npm run test:proc:deno

# Run tests sequentially
npm run test:seq
npm run test:seq:bun
npm run test:seq:deno

# Run browser tests
npm start
```

### TypeScript Validation
```bash
# Static analysis (ts-check/ directory)
npm run ts-check

# Runtime TypeScript tests (ts-tests/ directory)
npm run ts-test
npm run ts-test:bun
npm run ts-test:deno
```

### Code Formatting
```bash
# Check formatting
npm run lint

# Fix formatting
npm run lint:fix
```

## Adding New Features

### Process
1. Create a feature branch from main
2. Implement your feature with tests
3. Add corresponding `.d.ts` type definitions
4. Ensure all tests pass across environments
5. Update documentation (wiki, examples) as needed
6. Submit a pull request

### API Design Principles
- Keep APIs simple and intuitive
- Maintain backward compatibility
- Provide sensible defaults
- Follow established patterns in the codebase (lazy promises, start/stop queue, etc.)
- New queue types should extend `ListQueue` (or `MicroTaskQueue` for non-list-based queues)
- Export both named and default exports

## Performance Considerations

### Memory Management
- Null references in `cancel()`/`resolve()` to prevent leaks
- Clean up timers and event listeners on pause/stop
- Use efficient data structures (linked lists for O(1) operations, min-heaps for scheduling)

### Efficiency
- Optimize for common use cases
- Minimize computational overhead
- Use lazy initialization where possible (e.g., lazy promise creation)

## Pull Request Guidelines

### Before Submitting
- Ensure code follows style guidelines (`npm run lint`)
- Run all tests and ensure they pass (`npm test`)
- Run TypeScript checks (`npm run ts-check`)
- Write clear, descriptive commit messages
- Update relevant documentation

### PR Content
- Include a clear description of changes
- Reference related issues
- Highlight breaking changes
- Provide usage examples for new features

## Release Process

### Versioning
The project follows Semantic Versioning (SemVer):
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Publishing
Only maintainers can publish new versions:
1. Update version in `package.json`
2. Create Git tag
3. Publish to npm

## Communication

### Issues
- Use [GitHub issues](https://github.com/uhop/time-queues/issues) for bug reports and feature requests
- Provide reproduction steps for bugs
- Search existing issues before creating new ones

## See Also

- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture overview
- [API.md](API.md) - API specifications
- [README](../../README.md) - User-facing documentation
- [Wiki](https://github.com/uhop/time-queues/wiki) - Component documentation
- [Examples](../../examples/README.md) - Usage examples
