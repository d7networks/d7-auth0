# Detailed Installation Guide for D7 Networks SMS Verification Action

## Prerequisites
- Auth0 account
- D7 Networks account
- Active API token from D7 Networks

## Step-by-Step Installation

### 1. Obtain D7 Networks API Token
1. Log in to D7 Networks dashboard
2. Navigate to API settings
3. Generate a new API token
4. Copy the token securely

### 2. Configure Auth0 Action
1. Open Auth0 Dashboard
2. Go to Actions > Library
3. Click "Create Action"
4. Select "Send Phone Message"
5. Paste the provided JavaScript code

### 3. Set Up Secrets
1. In the Action configuration
2. Add secret: `direct7ApiToken`
   - Paste your D7 Networks API token
3. Add secret: `WEBHOOK_URL`
   - Provide your webhook URL for delivery reports

### 4. Configure Flow
1. Go to Authentication > Login
2. Add the created Action to your Login flow
3. Configure MFA settings to use SMS verification

### 5. Testing
- Perform a test login
- Verify SMS delivery
- Check error logs if issues occur

## Troubleshooting Checklist
- Verify API token validity
- Check network connectivity
- Ensure phone number format is correct
- Review Auth0 and D7 Networks logs