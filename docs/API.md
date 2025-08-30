# API Documentation

## Overview

refacto provides both a CLI interface and a programmatic API for renaming projects.

## Table of Contents

- [Installation](#installation)
- [CLI Usage](#cli-usage)
- [Programmatic API](#programmatic-api)
- [Core Classes](#core-classes)
- [Types](#types)
- [Examples](#examples)

## Installation

```bash
# Global CLI installation
npm install -g refacto

# As a dependency
npm install refacto
```

## CLI Usage

### Basic Command

```bash
refacto --from "old-name" --to "new-name"
```

### Options

| Option | Alias | Description | Default |
|--------|-------|-------------|---------|
| `--from` | `-f` | Current project name (required) | - |
| `--to` | `-t` | New project name (required) | - |
| `--dry-run` | `-d` | Preview changes without applying | false |
| `--verbose` | `-v` | Show detailed output | false |
| `--skip-git` | | Skip git remote URL updates | false |
| `--ignore` | `-i` | Additional ignore patterns | [] |
| `--force` | | Skip confirmation prompt | false |
| `--help` | `-h` | Show help | - |
| `--version` | | Show version | - |

### Examples

```bash
# Preview changes
refacto --from "MyApp" --to "NewApp" --dry-run

# Verbose output
refacto --from "MyApp" --to "NewApp" --verbose

# Custom ignore patterns
refacto --from "MyApp" --to "NewApp" --ignore "docs/**" "legacy/**"

# Skip confirmation
refacto --from "MyApp" --to "NewApp" --force
```

## Programmatic API

### Basic Usage

```typescript
import { ProjectRenamer } from 'refacto';

const renamer = new ProjectRenamer({
  from: 'old-name',
  to: 'new-name',
  dryRun: false,
  verbose: true
});

// Analyze changes
const analysis = await renamer.analyze();

// Perform rename
await renamer.rename();

// Get changes made
const changes = renamer.getChanges();
```

## Core Classes

### ProjectRenamer

The main class for performing project renames.

#### Constructor

```typescript
constructor(options: RenameOptions)
```

Creates a new ProjectRenamer instance with the specified options.

#### Methods

##### analyze()

```typescript
async analyze(): Promise<RenameAnalysis>
```

Analyzes the project and returns information about what would be changed.

**Returns:** `RenameAnalysis` object with change statistics

**Example:**
```typescript
const analysis = await renamer.analyze();
console.log(`Will change ${analysis.contentChanges} files`);
```

##### rename()

```typescript
async rename(): Promise<void>
```

Performs the actual rename operation. Will show progress if verbose is enabled.

**Example:**
```typescript
await renamer.rename();
```

##### getChanges()

```typescript
getChanges(): RenameChange[]
```

Returns an array of all changes made during the rename operation.

**Returns:** Array of `RenameChange` objects

**Example:**
```typescript
const changes = renamer.getChanges();
changes.forEach(change => {
  console.log(`${change.type}: ${change.oldPath}`);
});
```

##### smartReplace()

```typescript
smartReplace(text: string): { result: string; replacements: number }
```

Performs smart case-preserving replacement on the given text.

**Parameters:**
- `text`: The text to process

**Returns:** Object with replaced text and replacement count

**Example:**
```typescript
const { result, replacements } = renamer.smartReplace('MyApp is great');
// result: 'NewApp is great', replacements: 1
```

### CaseConverter

Handles case style detection and conversion.

#### Methods

##### generateVariations()

```typescript
generateVariations(text: string): Map<string, CaseStyle>
```

Generates all case variations of the given text.

**Example:**
```typescript
const converter = new CaseConverter();
const variations = converter.generateVariations('MyProject');
// Returns Map with variations like 'my-project', 'MY_PROJECT', etc.
```

##### detectCaseStyle()

```typescript
detectCaseStyle(text: string): CaseStyle | null
```

Detects the case style of the given text.

**Example:**
```typescript
const style = converter.detectCaseStyle('my-project');
// Returns 'kebab-case'
```

### FileScanner

Handles file system scanning operations.

#### Methods

##### scan()

```typescript
async scan(rootDir: string, options?: ScanOptions): Promise<ScanResult>
```

Scans a directory for files and directories.

##### isBinary()

```typescript
async isBinary(filePath: string): Promise<boolean>
```

Checks if a file is binary.

##### readFile()

```typescript
async readFile(filePath: string): Promise<string | null>
```

Reads a file's content. Returns null for binary files.

### Logger

Provides colored console output.

#### Constructor

```typescript
constructor(verbose: boolean = false)
```

#### Methods

- `info(message: string)`: Information message
- `success(message: string)`: Success message (green)
- `warn(message: string)`: Warning message (yellow)
- `error(message: string, error?: any)`: Error message (red)
- `debug(message: string)`: Debug message (only if verbose)

## Types

### RenameOptions

```typescript
interface RenameOptions {
  from: string;           // Current project name
  to: string;             // New project name
  dryRun?: boolean;       // Preview only (default: false)
  verbose?: boolean;      // Detailed output (default: false)
  skipGit?: boolean;      // Skip git updates (default: false)
  ignore?: string[];      // Additional ignore patterns
  force?: boolean;        // Skip confirmation (default: false)
}
```

### RenameAnalysis

```typescript
interface RenameAnalysis {
  contentChanges: number;      // Files with content changes
  fileRenames: number;         // Files to rename
  dirRenames: number;          // Directories to rename
  totalReplacements: number;   // Total text replacements
  estimatedDuration: number;   // Estimated seconds
}
```

### RenameChange

```typescript
interface RenameChange {
  type: 'content' | 'file' | 'directory';
  oldPath: string;
  newPath?: string;      // For file/directory renames
  changes?: number;      // For content changes
}
```

### CaseStyle

```typescript
type CaseStyle = 
  | 'camelCase'
  | 'PascalCase'
  | 'kebab-case'
  | 'snake_case'
  | 'UPPERCASE'
  | 'lowercase';
```

### ScanOptions

```typescript
interface ScanOptions {
  ignore?: string[];         // Ignore patterns
  includeHidden?: boolean;   // Include hidden files
  maxDepth?: number;         // Maximum depth
}
```

### ScanResult

```typescript
interface ScanResult {
  files: FileInfo[];
  directories: FileInfo[];
  stats: {
    totalFiles: number;
    totalDirectories: number;
    totalSize: number;
  };
}
```

## Examples

### Error Handling

```typescript
import { ProjectRenamer } from 'refacto';

try {
  const renamer = new ProjectRenamer({
    from: 'old-name',
    to: 'new-name'
  });
  
  await renamer.rename();
} catch (error) {
  console.error('Rename failed:', error.message);
}
```

### Custom Ignore Patterns

```typescript
const renamer = new ProjectRenamer({
  from: 'old-name',
  to: 'new-name',
  ignore: [
    'vendor/**',
    'legacy/**',
    '*.backup'
  ]
});
```

### Integration with Build Tools

```typescript
// In webpack.config.js
const { ProjectRenamer } = require('refacto');

module.exports = {
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tapPromise('RenamePlugin', async () => {
          if (process.env.RENAME_FROM && process.env.RENAME_TO) {
            const renamer = new ProjectRenamer({
              from: process.env.RENAME_FROM,
              to: process.env.RENAME_TO
            });
            await renamer.rename();
          }
        });
      }
    }
  ]
};
```

### Batch Processing

```typescript
async function renameBatch(renames: Array<{from: string, to: string}>) {
  for (const { from, to } of renames) {
    const renamer = new ProjectRenamer({
      from,
      to,
      dryRun: false,
      force: true
    });
    
    console.log(`Renaming ${from} to ${to}...`);
    await renamer.rename();
    
    const changes = renamer.getChanges();
    console.log(`Completed: ${changes.length} changes`);
  }
}
```

## Best Practices

1. **Always use dry-run first** to preview changes
2. **Backup your project** before running rename operations
3. **Check git status** after renaming to see all changes
4. **Run tests** after renaming to ensure nothing broke
5. **Use verbose mode** for debugging issues
6. **Add custom ignore patterns** for project-specific files

## Troubleshooting

### Common Issues

1. **Permission Errors**: Run with appropriate permissions or check file ownership
2. **Binary Files**: The tool automatically skips binary files
3. **Large Projects**: Use verbose mode to see progress
4. **Git Issues**: Use `--skip-git` if you have git problems

### Debug Mode

For debugging, use verbose mode and check the output:

```typescript
const renamer = new ProjectRenamer({
  from: 'old',
  to: 'new',
  verbose: true,
  dryRun: true
});
```