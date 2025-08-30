# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within @hookflow/refacto, please follow these steps:

### 1. Do NOT Create a Public Issue

Security vulnerabilities should **never** be reported through public GitHub issues.

### 2. Email Us Directly

Send an email to security@hookflow.com with:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution Target**: 
  - Critical: 7 days
  - High: 14 days
  - Medium: 30 days
  - Low: 90 days

### 4. Disclosure Policy

- We will confirm the receipt of your vulnerability report
- We will send you regular updates about our progress
- We will notify you when the vulnerability is fixed
- We will publicly disclose the vulnerability after it's fixed (coordinated disclosure)

## Security Best Practices for Users

### 1. Keep Dependencies Updated

```bash
npm update @hookflow/refacto
```

### 2. Use Lock Files

Always commit your `package-lock.json` to ensure consistent dependencies.

### 3. Audit Dependencies

```bash
npm audit
npm audit fix
```

### 4. Be Careful with User Input

When using the programmatic API, always validate input:

```javascript
import { ProjectRenamer } from '@hookflow/refacto';

// Validate input before using
function validateProjectName(name) {
  // Ensure no path traversal
  if (name.includes('../') || name.includes('..\\')) {
    throw new Error('Invalid project name');
  }
  // Add more validation as needed
  return name;
}

const renamer = new ProjectRenamer({
  from: validateProjectName(userInput.from),
  to: validateProjectName(userInput.to)
});
```

### 5. File System Permissions

- Run with minimal required permissions
- Never run as root/administrator unless absolutely necessary
- Use `--dry-run` first to preview changes

## Security Features

### Built-in Protections

1. **Path Traversal Prevention**: The tool validates all paths to prevent directory traversal attacks
2. **Binary File Detection**: Automatically skips binary files to prevent corruption
3. **Injection Prevention**: No shell command execution or dynamic code evaluation
4. **Safe File Operations**: All file operations use safe APIs with proper error handling

### What This Tool Does NOT Do

- Execute arbitrary code
- Make network requests
- Access system credentials
- Modify system files outside the project directory
- Read environment variables (except for standard Node.js ones)

## Dependency Security

We regularly update our dependencies and use tools to monitor for vulnerabilities:

- GitHub Dependabot for automated security updates
- Regular `npm audit` checks in CI/CD
- Minimal dependency footprint (only 3 runtime dependencies)

## Contact

- Security Email: security@hookflow.com
- Security GPG Key: [Download from our website]

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who follow this policy.

Thank you for helping keep @hookflow/refacto and its users safe!