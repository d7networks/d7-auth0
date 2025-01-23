# D7 Networks SMS Verification Action for Auth0

## Overview
This Auth0 Action provides SMS-based verification using D7 Networks' messaging service.

## Features
- Send SMS verification codes
- Robust error handling
- Phone number validation
- Retry mechanism for message delivery

## Prerequisites
- D7 Networks API Token
- Active D7 Networks account

## Installation Steps
1. Go to Auth0 Marketplace
2. Select "Custom Actions"
3. Click "Create New Action"
4. Choose "Send Phone Message" action type
5. Paste the provided code
6. Configure the following secrets:
   - `direct7ApiToken`: Your D7 Networks API token
   - `WEBHOOK_URL`: Delivery report webhook URL

## Configuration Parameters
- `SMS_SENDER_ID`: Sender ID for SMS (default: 'SignOtp')
- `MAX_RETRIES`: Maximum retry attempts for SMS sending (default: 3)
- `RETRY_DELAY_MS`: Delay between retry attempts (default: 1000ms)

## Security Considerations
- Always protect your API token
- Use valid international phone number format
- Implement additional validation as needed

## Troubleshooting
- Verify API token is correct
- Check phone number format
- Ensure network connectivity

## Support
Contact D7 Networks support for API-related issues