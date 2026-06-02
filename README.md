# refacto

[![npm version](https://badge.fury.io/js/refacto.svg)](https://www.npmjs.com/package/refacto)
[![CI](https://github.com/Mule-ME/refacto/actions/workflows/ci.yml/badge.svg)](https://github.com/Mule-ME/refacto/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/badge/coverage-98%25-brightgreen.svg)](https://github.com/Mule-ME/refacto)
[![Tests](https://img.shields.io/badge/tests-111%20passing-brightgreen.svg)](https://github.com/Mule-ME/refacto)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Enterprise-grade project renaming tool with 98%+ source test coverage, framework agnostic design, and smart case preservation**

```bash
# One command to rename your entire project across ALL languages & frameworks
refacto --from "OldProject" --to "AwesomeProject"

✓ Renames in JavaScript, Python, Java, Go, Ruby, PHP, Rust, and more...
✓ Updates configs, Docker files, CI/CD, documentation...
✓ Preserves your code style (camelCase, snake_case, kebab-case, etc.)
✓ Safe with dry-run mode and 98%+ source test coverage
```

A powerful, safe, and intelligent tool for renaming projects across your entire codebase. Works with **ANY programming language** and **ANY framework**. Battle-tested with 111 comprehensive tests achieving 98%+ source code coverage.

## 🏆 Why Choose refacto?

### 🌍 **Language & Framework Agnostic**

- **Works with ANY language**: JavaScript, TypeScript, Python, Java, Go, Rust, C++, Ruby, PHP, and more
- **Works with ANY framework**: React, Vue, Angular, Django, Rails, Spring, Express, and more
- **Works with ANY file type**: Source code, configs, docs, CI/CD, Docker, K8s manifests
- **Cross-platform**: Windows, macOS, Linux

### 🛡️ **Enterprise-Grade Quality**

- **98%+ Source Code Coverage**: 111 comprehensive tests covering all edge cases
- **100% TypeScript**: Full type safety and IntelliSense support
- **Production Ready**: Battle-tested on real projects
- **Minimal Dependencies**: Only 3 runtime dependencies for maximum security

### ⚡ **Smart & Safe**

- **Smart Case Detection**: Preserves your code style across 8 different case formats
- **Dry-Run Mode**: Preview all changes before committing
- **Binary Safe**: Automatically skips binary files, images, and compiled code
- **Git Aware**: Updates git remote URLs automatically

## Features

- **Smart Case Preservation**: Automatically detects and preserves case styles
  - `myProject` → `newProject` (camelCase preserved)
  - `MyProject` → `NewProject` (PascalCase preserved)
  - `my-project` → `new-project` (kebab-case preserved)
  - `my_project` → `new_project` (snake_case preserved)
  - `MY_PROJECT` → `NEW_PROJECT` (UPPERCASE preserved)
  - `@myorg/project` → `@myorg/newname` (package scope preserved)

- **Comprehensive Renaming**:
  - File contents (code, markdown, json, etc.)
  - File names
  - Directory names
  - Package names
  - Git repository references

- **Safety Features**:
  - Dry-run mode to preview changes
  - Confirmation prompt before actual changes
  - Detailed change analysis
  - Skips binary files and common build directories

## 🌐 Works With Every Language

The tool intelligently renames across **all programming languages** in your project:

### JavaScript/TypeScript

```javascript
// Before
export class DataProcessor { ... }
const dataProcessorConfig = { ... };

// After
export class DataAnalyzer { ... }
const dataAnalyzerConfig = { ... };
```

### Python

```python
# Before
from analytics_sdk import AnalyticsAPI
ANALYTICS_KEY = os.getenv('ANALYTICS_KEY')

# After
from metrics_sdk import MetricsAPI
METRICS_KEY = os.getenv('METRICS_KEY')
```

### Java/Kotlin

```java
// Before
public class PaymentService extends PaymentBase {
    private static final String PAYMENT_API_URL = "...";
}

// After
public class BillingService extends BillingBase {
    private static final String BILLING_API_URL = "...";
}
```

### Go

```go
// Before
package userauth
type UserAuthConfig struct { ... }

// After
package authentication
type AuthenticationConfig struct { ... }
```

### React Native

```javascript
// Before
export default class TodoApp extends Component { ... }
// ios/TodoApp.xcodeproj
// android/app/src/main/java/com/todoapp/

// After
export default class TaskManager extends Component { ... }
// ios/TaskManager.xcodeproj
// android/app/src/main/java/com/taskmanager/
```

### And More!

Works with Ruby, PHP, Rust, C/C++, Swift, Dart, Shell scripts, Docker files, YAML configs, and **any text-based file**!

## 🚀 Quick Start

> **Not a JavaScript developer?** See our [Installation Guide](docs/INSTALLATION.md) for Java, Python, Go, Ruby, PHP, C++ developers!

### Installation

Requires Node.js 18 or newer and npm 9 or newer.

```bash
# Global installation (recommended)
npm install -g refacto

# Or use npx (no installation required)
npx refacto --help

# Or install locally
npm install refacto --save-dev
```

### Basic Usage

```bash
# Preview changes (dry-run)
refacto --from "OldName" --to "NewName" --dry-run

# Apply changes
refacto --from "OldName" --to "NewName"

# Interactive mode
refacto --interactive
```

## Usage

### Advanced Usage

```bash
# Verbose output with detailed logging
refacto --from "OldApp" --to "NewApp" --verbose

# Custom ignore patterns
refacto --from "Company" --to "NewCorp" --ignore "docs/**" "legacy/**"

# Skip git configuration updates
refacto --from "OldName" --to "NewName" --skip-git

# Force mode (skip confirmation - use with caution)
refacto --from "Test" --to "Demo" --force
```

### Options

- `--from <name>` - Current project name (required)
- `--to <name>` - New project name (required)
- `--dry-run` - Show what would be changed without making changes
- `--verbose, -v` - Show detailed output
- `--skip-git` - Skip git repository updates
- `--help, -h` - Show help message

### 📋 Examples

```bash
# Real-world example: Rebranding a React app
refacto --from "MyReactApp" --to "AwesomeReactApp" --dry-run --verbose

# Enterprise example: Company name change
refacto --from "OldCorp" --to "NewCorp" --ignore "node_modules/**" ".git/**"

# Framework migration prep
refacto --from "legacy-app" --to "modern-app" --verbose
```

## 🔧 Programmatic API

Use as a library in your Node.js projects:

```typescript
import { ProjectRenamer } from 'refacto';

const renamer = new ProjectRenamer({
  from: 'oldName',
  to: 'newName',
  dryRun: true,
  verbose: false,
});

// Analyze impact
const analysis = await renamer.analyze();
console.log(`Will modify ${analysis.contentChanges} files`);

// Perform rename
await renamer.rename();

// Get list of changes made
const changes = renamer.getChanges();
```

### API Reference

#### ProjectRenamer

```typescript
interface RenameOptions {
  from: string; // Source name to replace
  to: string; // Target name to replace with
  dryRun?: boolean; // Preview mode (default: false)
  verbose?: boolean; // Detailed logging (default: false)
  skipGit?: boolean; // Skip git config updates (default: false)
  ignore?: string[]; // Custom ignore patterns
  force?: boolean; // Skip confirmations (default: false)
}
```

#### Methods

- `analyze()`: Returns impact analysis without making changes
- `rename()`: Performs the actual renaming operation
- `getChanges()`: Returns array of changes made
- `smartReplace(text)`: Apply smart case-preserving replacement to text

## How It Works

1. **Analysis Phase**:
   - Scans the entire project to find all occurrences
   - Counts files, directories, and text replacements
   - Shows preview of changes to be made

2. **Confirmation Phase** (non-dry-run only):
   - Shows summary of changes
   - Displays example transformations
   - Asks for user confirmation

3. **Execution Phase**:
   - Renames file contents first
   - Then renames files (deepest first)
   - Finally renames directories (deepest first)
   - Shows progress and summary

## Safety

The tool is designed to be safe:

- **Ignored Paths**: Automatically skips:
  - `node_modules/`
  - `.git/`
  - `dist/`
  - `build/`
  - `coverage/`
  - Log files (`*.log`)
  - Lock files (`*.lock`)
  - The rename tool itself

- **Binary Files**: Automatically detects and skips binary files

- **Order of Operations**: Renames in the correct order to avoid conflicts

## 📊 Quality & Testing

### Test Coverage

- 98%+ source coverage
- 111 comprehensive tests
- Full core logic coverage
- Cross-platform CI/CD

### Code Quality

- 100% TypeScript with strict mode
- ESLint + Prettier enforced
- Automated dependency updates
- Semantic versioning

## Troubleshooting

### Case Sensitivity

The tool is case-sensitive. Make sure to provide the exact current name:

```bash
# Wrong
--from "myproject"  # If actual name is "MyProject"

# Correct
--from "MyProject"
```

### Permission Errors

If you encounter permission errors:

```bash
# Use with sudo if needed (not recommended)
sudo refacto --from "OldName" --to "NewName"

# Or fix npm permissions (recommended)
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Large Projects

For very large projects (10,000+ files):

```bash
# Use verbose mode to see progress
refacto --from "OldName" --to "NewName" --verbose
```

## Contributing

We welcome contributions! This project follows enterprise-grade standards:

### Development Requirements

- Node.js 20+ for local test tooling; the publish workflow uses Node.js 22+
- 100% test coverage for new features
- TypeScript with strict mode
- ESLint compliance (no warnings)
- Comprehensive documentation
- Cross-platform compatibility

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests FIRST (TDD approach)
4. Implement your feature
5. Ensure 100% test coverage (`npm run test:coverage`)
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Code Standards

```bash
# Before submitting PR
npm run lint        # Must pass with no errors
npm run test        # Must pass all tests
npm run build       # Must build successfully
npm run test:coverage # Must maintain >95% coverage
```

## License

MIT - See [LICENSE](LICENSE)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

---

**Built by [Mule-ME](https://github.com/Mule-ME)**
