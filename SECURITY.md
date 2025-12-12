# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 3.x.x   | :white_check_mark: |
| < 3.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### Do NOT

- Open a public GitHub issue
- Post details on social media or public forums
- Exploit the vulnerability for any purpose

### Do

1. **Email the maintainers** with details of the vulnerability
2. Include the following information:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Resolution Target**: Within 30 days (depending on severity)

### What to Expect

1. **Acknowledgment**: We'll confirm receipt of your report
2. **Investigation**: We'll investigate and validate the issue
3. **Fix Development**: We'll develop and test a fix
4. **Disclosure**: We'll coordinate disclosure timing with you
5. **Credit**: We'll credit you in the security advisory (unless you prefer anonymity)

## Security Measures

This application implements several security measures:

### Authentication & Authorization
- PoW (Proof of Work) challenge system for mutation protection
- Session-based challenge validation
- Rate limiting on sensitive endpoints

### Data Protection
- Environment variables for secrets (never hardcoded)
- Input validation using Zod schemas
- SQL injection prevention via Prisma ORM
- XSS protection through React's default escaping

### API Security
- CORS configuration
- Request rate limiting
- Input sanitization
- Error message sanitization (no sensitive data in errors)

### Infrastructure
- HTTPS enforcement (production)
- Secure headers via Next.js configuration
- Regular dependency updates

## Best Practices for Users

1. **Keep secrets secure**: Never commit `.env` files
2. **Use strong API tokens**: Rotate Jira and Slack tokens periodically
3. **Monitor access**: Review application logs regularly
4. **Update regularly**: Keep the application and dependencies updated
5. **Limit permissions**: Use minimal required permissions for API integrations

## Dependencies

We regularly audit dependencies using:
```bash
npm audit
```

## Security Updates

Security updates are released as soon as possible after a vulnerability is confirmed and fixed. Subscribe to releases to be notified of security updates.
