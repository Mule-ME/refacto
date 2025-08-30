# Monorepo Example

This example demonstrates using refacto in a monorepo structure with multiple packages.

## Monorepo Structure

```
my-monorepo/
├── packages/
│   ├── @mycompany/core/
│   │   ├── src/
│   │   └── package.json
│   ├── @mycompany/ui/
│   │   ├── src/
│   │   └── package.json
│   └── @mycompany/cli/
│       ├── src/
│       └── package.json
├── apps/
│   ├── web/
│   │   └── package.json
│   └── mobile/
│       └── package.json
├── package.json
├── lerna.json
└── README.md
```

## Renaming Strategies

### 1. Rename Organization/Scope

```bash
# Rename all @mycompany packages to @newcompany
refacto --from "@mycompany" --to "@newcompany"
```

This will update:
- Package names in all package.json files
- Import statements across all packages
- Dependencies and devDependencies
- README references

### 2. Rename Specific Package

```bash
# Rename a specific package
cd packages/@mycompany/core
refacto --from "core" --to "foundation"
```

### 3. Rename Entire Monorepo

```bash
# At monorepo root
refacto --from "my-monorepo" --to "awesome-monorepo"
```

## Example Changes

### Package.json Updates

**Before** (packages/@mycompany/core/package.json):
```json
{
  "name": "@mycompany/core",
  "version": "1.0.0",
  "dependencies": {
    "@mycompany/ui": "workspace:*"
  }
}
```

**After** (packages/@newcompany/core/package.json):
```json
{
  "name": "@newcompany/core",
  "version": "1.0.0",
  "dependencies": {
    "@newcompany/ui": "workspace:*"
  }
}
```

### Import Statement Updates

**Before** (apps/web/src/App.tsx):
```typescript
import { Button } from '@mycompany/ui';
import { useAuth } from '@mycompany/core/auth';
import { Logger } from '@mycompany/core';
```

**After**:
```typescript
import { Button } from '@newcompany/ui';
import { useAuth } from '@newcompany/core/auth';
import { Logger } from '@newcompany/core';
```

### Configuration Files

**Before** (tsconfig.json):
```json
{
  "compilerOptions": {
    "paths": {
      "@mycompany/*": ["packages/@mycompany/*/src"]
    }
  }
}
```

**After**:
```json
{
  "compilerOptions": {
    "paths": {
      "@newcompany/*": ["packages/@newcompany/*/src"]
    }
  }
}
```

## Best Practices

1. **Always use dry-run first** in monorepos:
   ```bash
   refacto --from "@mycompany" --to "@newcompany" --dry-run
   ```

2. **Update from root directory** to catch all references

3. **Check these files** after renaming:
   - tsconfig.json paths
   - jest.config.js module mappings
   - .eslintrc module resolver paths
   - CI/CD configuration files

4. **Run these commands** after renaming:
   ```bash
   # Re-install dependencies
   npm install
   
   # Run tests
   npm test
   
   # Build all packages
   npm run build
   ```

## Handling Edge Cases

### Workspace Protocol
The tool correctly handles npm/yarn/pnpm workspace protocols:
- `"workspace:*"`
- `"workspace:^"`
- `"workspace:~"`

### Build Scripts
Updates package names in build scripts:
```json
{
  "scripts": {
    "build": "lerna run build --scope @mycompany/*"
  }
}
```

Becomes:
```json
{
  "scripts": {
    "build": "lerna run build --scope @newcompany/*"
  }
}
```

## Try It Yourself

1. Create a sample monorepo structure
2. Add some cross-package dependencies
3. Run the rename command
4. Verify all references are updated correctly