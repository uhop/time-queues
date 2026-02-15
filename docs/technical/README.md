# Time Queues Technical Documentation

Welcome to the technical documentation for the time-queues library. This documentation is designed to help developers and AI agents understand the internals of the library, contribute to its development, and extend its functionality.

## Documentation Overview

### [ARCHITECTURE.md](ARCHITECTURE.md)
Comprehensive overview of the library's architecture, design patterns, and implementation details:
- Inheritance hierarchy and component relationships
- Key design patterns (lazy promises, start/stop queue, browser API abstraction)
- Implementation details and technical decisions
- Performance considerations and memory management strategies

### [API.md](API.md)
Detailed API specifications for all classes, methods, and functions:
- Import paths and precise method signatures
- Parameter descriptions and return value specifications
- Task callback signatures for each queue type
- All exported functions and singleton instances

### [CONTRIBUTING.md](CONTRIBUTING.md)
Guidelines for contributing to the project:
- Development setup and project structure
- Coding standards and key patterns
- Testing procedures across Node.js, Bun, and Deno
- Pull request submission process

## Quick Start for Developers

1. **Understanding the Architecture**: Start with [ARCHITECTURE.md](ARCHITECTURE.md) to grasp the overall design
2. **Learning the APIs**: Reference [API.md](API.md) for detailed interface specifications
3. **Contributing**: Follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md) to submit changes

## For AI Agents

This documentation is specifically structured to provide AI agents with comprehensive technical understanding:
- Clear architectural explanations enable reasoning about code structure
- Detailed API specifications allow for precise code generation
- Contribution guidelines help understand project conventions
- Implementation details facilitate debugging and extension suggestions

See also [CLAUDE.md](../../CLAUDE.md) and [AI.md](../../AI.md) for AI-specific guidance.

## Additional Resources

- [README](../../README.md) - User-facing documentation
- [PROJECT.md](../../PROJECT.md) - High-level project description
- [Wiki](https://github.com/uhop/time-queues/wiki) - Component documentation
- [Examples](../../examples/README.md) - Usage examples
- [Source Index](../../src/INDEX.md) - Quick component discovery
