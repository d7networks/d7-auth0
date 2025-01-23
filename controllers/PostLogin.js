exports.onExecutePostLogin = async (event, api) => {
    const Client = require('direct7');
    const apiToken = event.secrets.direct7ApiToken;
    const client = new Client(apiToken);
    
    try {
      // Get current UTC time in the specified format
      const now = new Date();
      const utcTimestamp = now.toISOString().replace('T', ' ').substr(0, 19);

      // Check if it's Auth0 authentication method
      if (event.connection.strategy !== 'auth0') {
        console.log(`Login attempt with ${event.connection.strategy} at ${utcTimestamp} - No SMS sent (non-Auth0 login)`);
        return;
      }

      // Get user's phone number (available for Auth0 database users)
      const userPhone = event.user.phone_number;
      
      if (!userPhone) {
        console.log(`No phone number found for Auth0 user: ${event.user.email} at ${utcTimestamp}`);
        return;
      }

      // Customize message with specified format
      const messageContent = 
        `Login Alert:\n` +
        `Current Date and Time (UTC): ${utcTimestamp}\n` +
        `Current User's Login: kishorD7`;
      
      // Set up the SMS parameters
      const smsParams = {
        recipients: [userPhone],
        content: messageContent,
        unicode: false
      };

      // Send the SMS
      const response = await client.sms.sendMessage(
        'SignOtp',
        'https://webhook.site/af730c0b-f0f7-43e8-9064-b6a204393b5d', 
        null, 
        smsParams
      );

      // Log success with timestamp
      console.log(`[${utcTimestamp}] SMS sent successfully:`, {
        userId: 'kishorD7',
        authMethod: 'auth0',
        phoneNumber: userPhone,
        response: response
      });
      
    } catch (error) {
      const errorTime = new Date().toISOString().replace('T', ' ').substr(0, 19);
      console.error(`[${errorTime}] Error sending SMS:`, {
        error: error.message,
        userId: 'kishorD7',
        authMethod: event.connection.strategy
      });
    }
};