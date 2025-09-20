# Email Configuration Security

This document outlines the security improvements made to email handling in PhraseWorks and provides guidelines for secure email configuration.

## Security Issue Resolved

### Problem
The codebase contained hardcoded production email addresses, specifically:
- `noReply@agencyexpress.net` - A real company email address used in 7 locations
- Hardcoded R2 storage URLs in email templates

### Security Risks
1. **Email Address Exposure**: Real company email addresses were embedded in source code
2. **Configuration Rigidity**: Email addresses couldn't be changed without code modification
3. **Environment Leakage**: Production configuration was mixed with code
4. **Resource URL Exposure**: Hardcoded storage URLs revealed infrastructure details

## Solution Implemented

### Environment Variables
All email configuration now uses environment variables:

```bash
# Default Email Settings
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
DEFAULT_FROM_NAME=Your Site Name
```

### Files Updated
1. **Backend Email Senders** (7 locations):
   - `/backend/src/plugins/pwSMTP/resolvers.js`
   - `/backend/src/models/user.js` (2 locations)
   - `/backend/src/graphql/resolvers/system.js`
   - `/backend/src/graphql/resolvers/users.js` (3 locations)

2. **Configuration Files**:
   - `/.env.example` - Added email configuration template
   - `/backend/.env` - Already had secure configuration

3. **Email Templates** (4 locations):
   - Replaced hardcoded R2 URLs with `${env.R2_PUBLIC_URL}`
   - Replaced hardcoded alt text with `${env.SITE_NAME}`

## Configuration Guide

### 1. Environment Setup
Copy `.env.example` to `.env` and configure:

```bash
# Required Email Configuration
DEFAULT_FROM_EMAIL=noreply@yourcompany.com
DEFAULT_FROM_NAME=Your Company Name

# SMTP Configuration (if using SMTP)
SMTP_USERNAME=your-smtp-username
SMTP_PASSWORD=your-smtp-password
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_SECURE=false

# Site Configuration
SITE_NAME=Your Site Name
R2_PUBLIC_URL=https://your-bucket.r2.dev/
```

### 2. Email Provider Setup

#### Option 1: Resend (Recommended)
```bash
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USERNAME=resend
SMTP_PASSWORD=your-resend-api-key
```

#### Option 2: Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=postmaster@yourdomain.mailgun.org
SMTP_PASSWORD=your-mailgun-smtp-password
```

#### Option 3: Gmail/Google Workspace
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 3. Testing Email Configuration
Use the admin panel's email test functionality:
1. Go to Admin → Settings → Email
2. Configure your SMTP settings
3. Use "Send Test Email" to verify configuration

## Security Best Practices

### 1. Never Hardcode Email Addresses
❌ **Bad:**
```javascript
const fromEmail = 'admin@company.com';
```

✅ **Good:**
```javascript
const fromEmail = env.DEFAULT_FROM_EMAIL || 'noreply@localhost';
```

### 2. Use Environment-Specific Configuration
- **Development**: Use `noreply@localhost` or test domains
- **Staging**: Use staging-specific email addresses
- **Production**: Use your actual domain emails

### 3. Validate Email Configuration
Always provide fallbacks:
```javascript
const fromEmail = env.DEFAULT_FROM_EMAIL || 'noreply@localhost';
const fromName = env.DEFAULT_FROM_NAME || 'PhraseWorks';
```

### 4. Secure SMTP Credentials
- Store SMTP passwords in environment variables only
- Use app-specific passwords for Gmail
- Rotate credentials regularly
- Never commit `.env` files with real credentials

## Email Template Security

### Before (Insecure)
```html
<img src="https://pub-1e2f36fe29994319a65d0ca6beca0f46.r2.dev/pw.svg" alt="hello" />
<p>Email from: noReply@agencyexpress.net</p>
```

### After (Secure)
```html
<img src="${env.R2_PUBLIC_URL}pw.svg" alt="${env.SITE_NAME}" />
<p>Email from: ${env.DEFAULT_FROM_EMAIL}</p>
```

## Monitoring and Maintenance

### 1. Regular Security Audits
- Review email configurations quarterly
- Check for any new hardcoded email addresses
- Validate environment variable usage

### 2. Log Analysis
- Monitor email sending success rates
- Check for authentication failures
- Review bounce and spam reports

### 3. Configuration Updates
- Update email templates to use environment variables
- Test email functionality after configuration changes
- Document any custom email handling

## Common Issues and Solutions

### Issue: Emails Not Sending
1. Check SMTP configuration in `.env`
2. Verify credentials with email provider
3. Check firewall/network restrictions
4. Test with email test functionality

### Issue: Emails Going to Spam
1. Configure SPF records for your domain
2. Set up DKIM authentication
3. Use a reputable email service provider
4. Monitor sender reputation

### Issue: Wrong Sender Address
1. Check `DEFAULT_FROM_EMAIL` in `.env`
2. Verify email provider allows your sender address
3. Update DNS records if using custom domain

## Related Documentation
- [Environment Configuration](../getting-started/environment-setup.md)
- [Email Setup Guide](../getting-started/email-setup.md)
- [Security Best Practices](./security-guidelines.md)