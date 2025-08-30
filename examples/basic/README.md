# Basic Example

This example demonstrates the most common use case for refacto.

## Project Structure

```
my-awesome-app/
├── src/
│   └── MyAwesomeApp.js
├── package.json
├── README.md
└── docker-compose.yml
```

## Usage

```bash
# Preview changes (dry run)
refacto --from "MyAwesomeApp" --to "SuperCoolApp" --dry-run

# Apply the rename
refacto --from "MyAwesomeApp" --to "SuperCoolApp"
```

## What Gets Renamed

### 1. File Contents

**Before** (src/MyAwesomeApp.js):
```javascript
export class MyAwesomeApp {
  constructor() {
    this.name = 'my-awesome-app';
    this.id = 'MY_AWESOME_APP';
  }
}
```

**After** (src/MyAwesomeApp.js):
```javascript
export class SuperCoolApp {
  constructor() {
    this.name = 'super-cool-app';
    this.id = 'SUPER_COOL_APP';
  }
}
```

### 2. Package.json

**Before**:
```json
{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "description": "MyAwesomeApp - A great application"
}
```

**After**:
```json
{
  "name": "super-cool-app",
  "version": "1.0.0",
  "description": "SuperCoolApp - A great application"
}
```

### 3. Docker Compose

**Before**:
```yaml
services:
  my-awesome-app:
    image: mycompany/my-awesome-app:latest
    environment:
      - APP_NAME=MyAwesomeApp
```

**After**:
```yaml
services:
  super-cool-app:
    image: mycompany/super-cool-app:latest
    environment:
      - APP_NAME=SuperCoolApp
```

## Case Preservation

Notice how the tool preserves different case styles:
- `MyAwesomeApp` → `SuperCoolApp` (PascalCase)
- `my-awesome-app` → `super-cool-app` (kebab-case)
- `MY_AWESOME_APP` → `SUPER_COOL_APP` (UPPERCASE)

## Try It Yourself

1. Clone this example
2. Run the rename command
3. Check the results!