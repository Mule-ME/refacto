# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within refacto, please follow these steps:

### 1. **Do NOT Create a Public Issue**

Security vulnerabilities should **never** be reported through public GitHub issues.

### 2. Report Privately

Please report vulnerabilities through one of these channels:
- **Preferred**: Create a [private security advisory](https://github.com/Mule-ME/refacto/security/advisories/new)
- **Alternative**: Contact the maintainer directly via GitHub

### 3. What to Include in Your Report

Please provide:
- **Type of issue** (e.g., buffer overflow, command injection, cross-site scripting, etc.)
- **Full paths** of source file(s) related to the manifestation of the issue
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Special configuration** required to reproduce the issue
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the issue, including how an attacker might exploit it

### 4. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution Target**: 
  - Critical: 1-3 days
  - High: 7 days
  - Medium: 14 days
  - Low: 30 days

### 5. Disclosure Policy

- We will confirm the receipt of your vulnerability report within 48 hours
- We will send you regular updates about our progress
- We will notify you when the vulnerability is fixed
- We will credit you in our release notes (unless you prefer to remain anonymous)

## Security Best Practices

When using refacto:

1. **Always use dry-run first**: Test changes before applying them
2. **Backup your project**: Create backups before major renames
3. **Review changes carefully**: Check all proposed modifications
4. **Use version control**: Ensure your project is committed to git
5. **Keep refacto updated**: Always use the latest version
6. **Validate input**: Be cautious with user-provided rename patterns

## Security Measures We Take

### Code Security
- Regular dependency updates via Dependabot
- Automated security scanning in CI/CD
- Code review for all changes
- Type safety with TypeScript

### Runtime Security
- Input validation and sanitization
- Safe file system operations
- No execution of external commands without validation
- Comprehensive error handling

## Dependencies

We actively monitor and update dependencies:
- **Automated updates**: Dependabot PRs weekly
- **Manual audits**: Quarterly security reviews
- **CI checks**: `npm audit` on every build
- **Zero tolerance**: Critical vulnerabilities fixed immediately

## Acknowledgments

We appreciate security researchers who help keep refacto safe. Security contributors will be recognized in:
- Release notes
- GitHub Security Advisories
- This document (Hall of Fame - coming soon)

## Learn More

- [GitHub Security Advisories](https://github.com/Mule-ME/refacto/security/advisories)
- [npm Security Best Practices](https://docs.npmjs.com/packages-and-modules/securing-your-code)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)