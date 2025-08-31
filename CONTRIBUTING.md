# Contributing to refacto

First off, thank you for considering contributing to refacto! It's people like you that make this tool better for everyone.

## Code of Conduct

By participating in this project, you are expected to uphold our code of conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** (code samples, files, commands)
- **Describe the behavior you observed and expected**
- **Include system information** (OS, Node.js version, npm version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description** of the suggested enhancement
- **Explain why this enhancement would be useful**
- **List any alternative solutions** you've considered

### Your First Code Contribution

Unsure where to begin? Look for issues labeled:
- `good first issue` - Should only require a few lines of code
- `help wanted` - More involved issues ideal for contributors

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Add tests** for any new functionality
5. **Ensure all tests pass**: `npm test`
6. **Update documentation** as needed
7. **Submit your pull request**

## Development Process

### Setup

```bash
# Clone your fork
git clone https://github.com/your-username/refacto.git
cd refacto

# Install dependencies
npm install

# Run tests
npm test

# Run in development
npm run dev
```

### Coding Standards

#### TypeScript
- Use TypeScript for all new code
- Enable strict mode
- Provide comprehensive type definitions
- Avoid `any` types

#### Code Style
- We use ESLint and Prettier (configurations are provided)
- Run `npm run lint` to check your code
- Run `npm run format` to auto-fix formatting
- Maximum line length: 100 characters

#### Testing
- Write tests for all new features
- Maintain our 98% test coverage standard
- Use descriptive test names
- Test edge cases

#### Commit Messages
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add bundle ID support for mobile apps
fix: correct case detection for snake_case
docs: update API documentation
test: add tests for file scanner
chore: update dependencies
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Check coverage
npm run test:coverage

# Run specific test file
npm test -- case-converter.test.ts
```

### Building

```bash
# Build the project
npm run build

# Build in watch mode
npm run build:watch
```

## Project Structure

```
src/
├── cli.ts           # CLI entry point
├── index.ts         # Programmatic API entry point
└── lib/             # Core functionality
    ├── case-converter.ts    # Case style detection and conversion
    ├── file-scanner.ts      # File system operations
    ├── logger.ts           # Logging utilities
    └── renamer.ts          # Main renaming logic

tests/
├── unit/            # Unit tests for individual modules
└── integration/     # Integration tests for CLI
```

## Release Process

We use [semantic-release](https://semantic-release.gitbook.io/) for automated releases:

1. Merge PR to `main` branch
2. CI/CD runs tests
3. semantic-release analyzes commits
4. Version is bumped based on commit types
5. CHANGELOG.md is updated
6. Package is published to npm
7. GitHub release is created

## Review Process

All submissions require review. We use GitHub pull requests for this purpose. The review process:

1. Automated tests must pass
2. Code coverage must not decrease
3. At least one maintainer approval required
4. All feedback must be addressed

## Community

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Twitter/X**: Follow [@Mule_ME](https://github.com/Mule-ME) for announcements

## Recognition

Contributors are recognized in our:
- GitHub contributors page
- Release notes (for significant contributions)
- Special thanks in README (for major features)

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing to refacto! 🎉