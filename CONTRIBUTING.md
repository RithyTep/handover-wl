# Contributing to Jira Slack Integration

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/jira-slack-integration.git`
3. Install dependencies: `npm install`
4. Create a branch for your changes: `git checkout -b feature/your-feature-name`

## Development Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Jira account with API access
- Slack workspace with bot permissions

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

### Running Locally

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint

# Build for production
npm run build
```

## Code Style

This project uses:
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting (via ESLint plugin)

Run `npm run lint` before committing to ensure your code meets the style guidelines.

## Testing

We use **Vitest** for testing. Please ensure:
- All new features have accompanying tests
- All tests pass before submitting a PR: `npm run test:run`
- Aim for meaningful test coverage

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

## Pull Request Process

1. Ensure your code follows the existing style and passes all tests
2. Update documentation if needed
3. Write a clear PR description explaining your changes
4. Link any related issues using GitHub keywords (e.g., "Fixes #123")
5. Request review from maintainers

### PR Title Convention

Use conventional commits format:
- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `refactor: improve code structure`
- `test: add tests`
- `chore: update dependencies`

## Reporting Issues

When reporting issues, please include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## Security

If you discover a security vulnerability, please see [SECURITY.md](SECURITY.md) for responsible disclosure guidelines.

## Questions?

Feel free to open an issue for questions or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
