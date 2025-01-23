# Auth0 Action Setup Guide

## Secrets Configuration
### Required Secret
- **Key**: `direct7ApiToken`
- **Value**: Your D7 Networks API token
- **How to Obtain**: 
  1. Log in to D7 Networks dashboard
  2. Navigate to API settings
  3. Generate/copy API token


## Dependencies
### NPM Package Installation
- **Package Name**: `direct7`
- **Version**: Latest
- **Installation Method**: Automatically handled by Auth0 runtime

## Configuration Steps
1. Open Action in Auth0
2. Go to Secrets section
3. Add new secret
   - Key: `direct7ApiToken`
   - Value: [Your API Token]
4. Verify package dependency in code

## Best Practices
- Keep API token confidential
- Rotate tokens periodically
- Use environment-specific tokens