# Programmatic API Example

This example shows how to use refacto as a library in your Node.js applications.

## Installation

```bash
npm install refacto
```

## Basic Usage

```javascript
import { ProjectRenamer } from 'refacto';

async function renameMyProject() {
  const renamer = new ProjectRenamer({
    from: 'OldProjectName',
    to: 'NewProjectName',
    dryRun: false,
    verbose: true
  });

  // Analyze what will be changed
  const analysis = await renamer.analyze();
  console.log(`Will modify ${analysis.contentChanges} files`);
  console.log(`Will rename ${analysis.fileRenames} files`);
  console.log(`Will rename ${analysis.dirRenames} directories`);

  // Perform the rename
  await renamer.rename();

  // Get detailed changes
  const changes = renamer.getChanges();
  console.log('All changes:', changes);
}
```

## Advanced Usage

### With Custom Options

```javascript
import { ProjectRenamer } from 'refacto';

const renamer = new ProjectRenamer({
  from: 'my-template',
  to: 'customer-project',
  dryRun: false,
  verbose: true,
  skipGit: true,
  ignore: ['vendor/**', 'legacy/**'],
  force: true  // Skip confirmation
});

await renamer.rename();
```

### Integration with Build Tools

```javascript
// webpack.config.js
const { ProjectRenamer } = require('refacto');

module.exports = {
  // ... webpack config
  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.beforeCompile.tapPromise('RenamePlugin', async () => {
          if (process.env.RENAME_PROJECT) {
            const renamer = new ProjectRenamer({
              from: process.env.OLD_NAME,
              to: process.env.NEW_NAME,
              dryRun: false
            });
            await renamer.rename();
          }
        });
      }
    }
  ]
};
```

### Error Handling

```javascript
import { ProjectRenamer } from 'refacto';

async function safeRename(from, to) {
  try {
    const renamer = new ProjectRenamer({
      from,
      to,
      dryRun: true  // Always preview first
    });

    const analysis = await renamer.analyze();
    
    // Check if changes are reasonable
    if (analysis.totalReplacements > 1000) {
      throw new Error('Too many changes - please verify the names');
    }

    // Now do the actual rename
    renamer.options.dryRun = false;
    await renamer.rename();
    
    return renamer.getChanges();
  } catch (error) {
    console.error('Rename failed:', error.message);
    throw error;
  }
}
```

### Custom Case Handling

```javascript
import { ProjectRenamer, CaseConverter } from 'refacto';

// Use the case converter directly
const converter = new CaseConverter();
const variations = converter.generateVariations('MyProject');
console.log(variations);
// Map {
//   'MyProject' => 'PascalCase',
//   'myProject' => 'camelCase',
//   'my-project' => 'kebab-case',
//   'my_project' => 'snake_case',
//   'MYPROJECT' => 'UPPERCASE',
//   'myproject' => 'lowercase'
// }

// Use in renamer
const renamer = new ProjectRenamer({
  from: 'MyProject',
  to: 'YourProject',
  dryRun: false
});
```

## API Reference

### ProjectRenamer

```typescript
class ProjectRenamer {
  constructor(options: RenameOptions);
  analyze(): Promise<RenameAnalysis>;
  rename(): Promise<void>;
  getChanges(): RenameChange[];
  smartReplace(text: string): { result: string; replacements: number };
}
```

### RenameOptions

```typescript
interface RenameOptions {
  from: string;           // Current name to replace
  to: string;             // New name
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
  estimatedDuration: number;   // Estimated time in seconds
}
```

## Full Example Script

See [rename-script.js](./rename-script.js) for a complete example.