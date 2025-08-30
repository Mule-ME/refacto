# Quick Start for Non-JavaScript Developers

## 🚀 Install Node.js First (One Time Only)

### macOS
```bash
brew install node
```

### Windows
Download from: https://nodejs.org/en/download/

### Linux
```bash
# Ubuntu/Debian
sudo apt install nodejs npm

# Fedora/RHEL
sudo dnf install nodejs npm
```

## 📦 Install Rename Tool
```bash
npm install -g refacto
```

## ✨ Use It!

### Java Example
```bash
cd my-java-project
refacto --from "CustomerAPI" --to "ClientAPI" --dry-run
refacto --from "CustomerAPI" --to "ClientAPI"  # Apply changes
```

### Python Example
```bash
cd my-python-project
refacto --from "data_processor" --to "data_analyzer" --dry-run
refacto --from "data_processor" --to "data_analyzer"  # Apply changes
```

### Any Language!
```bash
cd my-project
refacto --from "OldProjectName" --to "NewProjectName" --dry-run
refacto --from "OldProjectName" --to "NewProjectName"  # Apply changes
```

## 🎯 That's It!

The tool will:
- ✅ Rename all files and directories
- ✅ Update all code references
- ✅ Preserve your naming style (camelCase, snake_case, etc.)
- ✅ Work with ANY programming language

**No Node.js knowledge required!** Just install once and use the command.