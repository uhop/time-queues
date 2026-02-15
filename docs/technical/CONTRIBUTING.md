# Contributing to Time Queues

## Overview

Thank you for your interest in contributing to Time Queues! This guide explains how to contribute effectively to the project, covering development setup, coding standards, testing practices, and submission processes.

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Git for version control

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
├── src/              # Source code
├── tests/            # Test files
├── docs/             # Documentation
├── package.json      # Project configuration
└── README.md         # User documentation
```

## Coding Standards

### JavaScript Style
- Follow ES2020+ standards
- Use modules (import/export) for code organization
- Prefer const/let over var
- Use meaningful variable and function names
- Maintain consistent indentation (2 spaces)

### Documentation
- All public APIs must have JSDoc comments
- Include examples for complex functionality
- Keep README.md updated with user-facing changes
- Update ARCHITECTURE.md for significant architectural changes

### Error Handling
- Use custom error types when appropriate
- Provide meaningful error messages
- Handle edge cases gracefully
- Ensure proper resource cleanup

## Testing

### Test Framework
We use tape-six for testing. Tests are located in the `tests/` directory.

### Writing Tests
- Each source file should have corresponding test file
- Test both success and failure cases
- Use descriptive test names
- Mock external dependencies when possible

### Running Tests
```bash
# Run all tests
npm test

# Run tests for specific environment
npm run test:bun
npm run test:deno
```

## Adding New Features

### Process
1. Create a feature branch from main
2. Implement your feature with tests
3. Ensure all tests pass
4. Update documentation as needed
5. Submit a pull request

### API Design Principles
- Keep APIs simple and intuitive
- Maintain backward compatibility
- Provide sensible defaults
- Follow established patterns in the codebase

## Performance Considerations

### Memory Management
- Avoid memory leaks by cleaning up references
- Use weak references when appropriate
- Implement proper disposal patterns

### Efficiency
- Optimize for common use cases
- Minimize computational overhead
- Profile performance-critical code paths

## Pull Request Guidelines

### Before Submitting
- Ensure code follows style guidelines
- Run all tests and ensure they pass
- Write clear, descriptive commit messages
- Update relevant documentation

### PR Content
- Include a clear description of changes
- Reference related issues
- Highlight breaking changes
- Provide usage examples for new features

## Release Process

### Versioning
We follow Semantic Versioning (SemVer):
- Major: Breaking changes
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)

### Publishing
Only maintainers can publish new versions:
1. Update version in package.json
2. Update CHANGELOG.md
3. Create Git tag
4. Publish to npm

## Communication

### Issues
- Use GitHub issues for bug reports and feature requests
- Provide reproduction steps for bugs
- Search existing issues before creating new ones

### Discussions
- Use GitHub discussions for general questions
- Share ideas and implementation approaches
- Help other contributors

## TypeScript Testing

The project includes two distinct sets of TypeScript files for validation:

### Static Analysis (`ts-check/` directory)
- Compilation checks using `tsc --noEmit` for static type analysis
- Validates API usage and type correctness without runtime execution
- Ensures TypeScript definitions match implementation

### Runtime Tests (`ts-tests/` directory)
- Directly runnable TypeScript tests in Node.js, Deno, and Bun environments
- Cannot be run directly in browsers (require JavaScript transpilation)
- Validate cross-environment compatibility and behavior consistency

Run TypeScript validation with:
```bash
# Static analysis only
npm run ts-check

# Runtime tests (Node.js, Deno, Bun only)
npm run ts-test
npm run ts-test:bun
npm run ts-test:deno
```

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.