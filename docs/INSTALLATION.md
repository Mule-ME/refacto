# 🌍 Universal Installation Guide for refacto

This guide is for developers working with **Java, Python, Go, Ruby, PHP, C++, or any other language** who want to use our rename tool.

refacto requires Node.js 18 or newer and npm 9 or newer.

## 🤔 "I Don't Have Node.js or npm!"

No problem! Here's how to get started from scratch:

## 📦 Installation Methods

### Method 1: Quick Install (Recommended)

#### On macOS

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (includes npm)
brew install node

# Install refacto globally
npm install -g refacto

# Now use it anywhere!
refacto --from "OldName" --to "NewName"
```

#### On Windows

```powershell
# Option A: Using Chocolatey
# Install Chocolatey from https://chocolatey.org/install
choco install nodejs

# Option B: Using Scoop
# Install Scoop from https://scoop.sh
scoop install nodejs

# Option C: Direct Download
# Download from https://nodejs.org/en/download/
# Run the installer

# Then install refacto globally
npm install -g refacto
```

#### On Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Install refacto globally
sudo npm install -g refacto
```

#### On Linux (Fedora/RHEL/CentOS)

```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Install refacto globally
sudo npm install -g refacto
```

### Method 2: Using npx (No Installation Required!)

If you have Node.js but don't want to install globally:

```bash
# Just run directly with npx
npx refacto --from "OldName" --to "NewName"
```

### Method 3: Docker (No Node.js Required!)

For those who prefer Docker:

```dockerfile
# Create a Dockerfile
FROM node:latest
RUN npm install -g refacto
WORKDIR /project
ENTRYPOINT ["refacto"]
```

```bash
# Build the image
docker build -t rename-tool .

# Use it on your project
docker run -v $(pwd):/project rename-tool --from "OldName" --to "NewName"
```

## 🚀 Usage Examples by Language

### Java Project

```bash
cd /path/to/my-java-project

# Rename your Java project
refacto --from "CustomerService" --to "ClientService"

# This will rename:
# - CustomerServiceApplication.java → ClientServiceApplication.java
# - customerServiceConfig → clientServiceConfig
# - CUSTOMER_SERVICE_URL → CLIENT_SERVICE_URL
# - customer-service.properties → client-service.properties
# - And more!
```

### Python Project

```bash
cd /path/to/my-python-project

# Rename your Python project
refacto --from "data_analyzer" --to "data_processor"

# This will rename:
# - data_analyzer.py → data_processor.py
# - DataAnalyzer class → DataProcessor class
# - DATA_ANALYZER_CONFIG → DATA_PROCESSOR_CONFIG
# - test_data_analyzer.py → test_data_processor.py
```

### Go Project

```bash
cd /path/to/my-go-project

# Rename your Go project
refacto --from "userauth" --to "authentication"

# This will rename:
# - package userauth → package authentication
# - UserAuthHandler → AuthenticationHandler
# - userauth.go → authentication.go
# - go.mod module references
```

### PHP Project

```bash
cd /path/to/my-php-project

# Rename your PHP project
refacto --from "BlogEngine" --to "ContentManager"

# This will rename:
# - BlogEngine.php → ContentManager.php
# - class BlogEngine → class ContentManager
# - $blogEngineConfig → $contentManagerConfig
# - blog-engine.conf → content-manager.conf
```

### Ruby Project

```bash
cd /path/to/my-ruby-project

# Rename your Ruby project
refacto --from "payment_gateway" --to "transaction_handler"

# This will rename:
# - payment_gateway.rb → transaction_handler.rb
# - PaymentGateway module → TransactionHandler module
# - payment_gateway_spec.rb → transaction_handler_spec.rb
```

### C/C++ Project

```bash
cd /path/to/my-cpp-project

# Rename your C++ project
refacto --from "RenderEngine" --to "GraphicsEngine"

# This will rename:
# - RenderEngine.h → GraphicsEngine.h
# - RenderEngine.cpp → GraphicsEngine.cpp
# - RENDER_ENGINE_H → GRAPHICS_ENGINE_H
# - class RenderEngine → class GraphicsEngine
```

## 💡 Pro Tips

### 1. Always Use Dry Run First!

```bash
# See what will change without making changes
refacto --from "OldName" --to "NewName" --dry-run
```

### 2. Use Exact Case

```bash
# Wrong - if your project uses "DataProcessor"
refacto --from "dataprocessor" --to "Analytics"

# Correct
refacto --from "DataProcessor" --to "Analytics"
```

### 3. Handle Multi-Module Projects

```bash
# For projects with multiple modules
cd /path/to/parent-project
refacto --from "OldModule" --to "NewModule" --verbose
```

### 4. Exclude Specific Directories

```bash
# Skip vendor/third-party directories
refacto --from "MyApp" --to "YourApp" --ignore "vendor/**" "third_party/**"
```

## 🆘 Troubleshooting

### "command not found: npm"

You need to install Node.js first. See installation methods above.

### "command not found: refacto"

```bash
# Make sure global npm bin is in your PATH
export PATH="$PATH:$(npm bin -g)"

# Or reinstall globally
npm install -g refacto
```

### Permission Errors

```bash
# On macOS/Linux, you might need sudo
sudo npm install -g refacto

# Better: Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

### Using with Build Tools

#### Maven (Java)

```xml
<!-- Add to pom.xml -->
<plugin>
    <groupId>org.codehaus.mojo</groupId>
    <artifactId>exec-maven-plugin</artifactId>
    <configuration>
        <executable>refacto</executable>
        <arguments>
            <argument>--from</argument>
            <argument>OldName</argument>
            <argument>--to</argument>
            <argument>NewName</argument>
        </arguments>
    </configuration>
</plugin>
```

#### Gradle (Java/Kotlin)

```groovy
// Add to build.gradle
task renameProject(type: Exec) {
    commandLine 'refacto', '--from', 'OldName', '--to', 'NewName'
}
```

#### Make (C/C++)

```makefile
# Add to Makefile
rename:
	refacto --from "OldName" --to "NewName"
```

## 🌟 Why Use Our Tool?

1. **No Language Lock-in**: Works with ANY programming language
2. **Preserves Your Style**: Maintains your naming conventions
3. **Safe**: Dry-run mode lets you preview changes
4. **Fast**: Renames entire codebases in seconds
5. **Smart**: Handles edge cases and complex patterns

## 📚 More Resources

- [Full Documentation](README.md)
- [API Reference](API.md)
- [Examples](examples/)
- [GitHub Issues](https://github.com/Mule-ME/refacto/issues)

---

**Remember**: This tool is language-agnostic. It doesn't care if you write Java, Python, or COBOL - it just finds and replaces text patterns intelligently!
