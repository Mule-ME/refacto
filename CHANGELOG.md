# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

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
- **Comprehensive Test Suite**: 80%+ test coverage with unit and integration tests
- **Linting & Formatting**: ESLint and Prettier configuration
- **Type Checking**: Full TypeScript type checking
- **CI/CD Ready**: GitHub Actions configuration for automated testing

#### Developer Experience
- **Programmatic API**: Use as a library in other projects
- **Detailed Documentation**: Comprehensive README and API documentation
- **Professional Package Structure**: Follows npm best practices
- **Semantic Versioning**: Automated semantic versioning with semantic-release

### Technical Details

#### Supported Case Styles
- `camelCase` → `newCamelCase`
- `PascalCase` → `NewPascalCase`
- `kebab-case` → `new-kebab-case`
- `snake_case` → `new_snake_case`
- `UPPERCASE` → `NEWUPPERCASE`
- `lowercase` → `newlowercase`
- `@package-scope` → `@new-package-scope`

#### Built-in Ignore Patterns
- `node_modules/**`
- `.git/**`
- `dist/**`
- `build/**`
- `coverage/**`
- Log files (`*.log`)
- Lock files (`*.lock`)
- OS files (`.DS_Store`)

#### Performance
- Fast file scanning with glob patterns
- Parallel processing where possible
- Memory-efficient for large codebases
- Estimated duration calculation

### Dependencies
- `commander`: CLI framework
- `glob`: Fast file pattern matching
- `inquirer`: Interactive command line prompts

### Development Dependencies
- `typescript`: TypeScript compiler
- `tsup`: Fast TypeScript bundler
- `vitest`: Fast unit testing framework
- `eslint`: Code linting
- `prettier`: Code formatting

## [Unreleased]

*No active development at this time. See our roadmap below for planned features.*

### Roadmap

We're considering these features for future releases:
- Mobile app support (bundle IDs)
- Framework-specific presets
- Backup and restore capabilities
- Performance optimizations
- Configuration file support

Want to influence our priorities? [Open a discussion](https://github.com/Mule-ME/refacto/discussions) or [submit a feature request](https://github.com/Mule-ME/refacto/issues).

---

## Development

This project follows semantic versioning. Version bumps are automated using semantic-release based on conventional commits.

### Commit Message Format
- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)
- `BREAKING CHANGE:` - Breaking changes (major version bump)
- `docs:` - Documentation updates
- `test:` - Test updates
- `chore:` - Maintenance tasks