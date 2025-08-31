# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - Coming Soon

### Added

#### Core Features
- **Smart Case Preservation**: Automatically detects and preserves case styles (camelCase, PascalCase, kebab-case, snake_case, UPPERCASE, lowercase)
- **Comprehensive Renaming**: Renames file contents, file names, directory names, and package references
- **Dry Run Mode**: Preview changes without making any modifications
- **Interactive Confirmation**: User confirmation prompts with detailed change analysis
- **Ignore Patterns**: Built-in and custom ignore patterns for safe operation

#### CLI Interface
- **Command Line Interface**: Full-featured CLI with comprehensive options
- **Interactive Mode**: Step-by-step guided interface for ease of use
- **Verbose Output**: Detailed logging and progress reporting
- **Help and Documentation**: Built-in help system with examples

#### Safety Features
- **Backup Detection**: Prevents accidental overwrites of important directories
- **Binary File Detection**: Automatically skips binary files to prevent corruption
- **Error Handling**: Graceful error handling with meaningful error messages
- **Git Integration**: Optional git configuration updates

#### TypeScript & Modern Tooling
- **Full TypeScript Support**: Written in TypeScript with complete type definitions
- **ES Modules**: Modern ES module architecture
- **Dual Package Support**: Supports both CommonJS and ES modules
- **Tree-shaking Ready**: Modular architecture for optimal bundle sizes

#### Testing & Quality
- Comprehensive test suite with 98% coverage
- ESLint and Prettier configuration
- Full TypeScript type checking
- GitHub Actions CI/CD pipeline

#### Developer Experience
- Programmatic API for library usage
- Comprehensive documentation
- npm best practices
- Semantic versioning

### Implementation Details

#### Supported Case Styles
- camelCase
- PascalCase
- kebab-case
- snake_case
- UPPERCASE
- lowercase
- Package scope (@namespace)

#### Built-in Ignore Patterns
- `node_modules/**`
- `.git/**`
- `dist/**`
- `build/**`
- `coverage/**`
- `*.log` (log files)
- `*.lock` (lock files)
- `.DS_Store` (OS files)

#### Performance
- Fast file scanning with glob patterns
- Parallel processing where possible
- Memory-efficient for large codebases
- Estimated duration calculation

### Dependencies
- commander - CLI framework
- glob - File pattern matching
- inquirer - Interactive prompts

### Development Dependencies
- typescript - TypeScript compiler
- tsup - Fast TypeScript bundler
- vitest - Unit testing framework
- eslint - Code linting
- prettier - Code formatting

## [Unreleased]

### Added
- _Nothing yet_

### Changed
- _Nothing yet_

### Fixed
- _Nothing yet_

---

## Contributing

This project follows [Semantic Versioning](https://semver.org/) and [Keep a Changelog](https://keepachangelog.com/) format.

### Commit Message Format
- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump) 
- `BREAKING CHANGE:` - Breaking changes (major version bump)
- `docs:` - Documentation updates
- `test:` - Test updates
- `chore:` - Maintenance tasks