/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
    // Initialize Direct7 client with API token from secrets
    const Client = require('direct7');
    
    // Get API token from Auth0 secrets
    const apiToken = event.secrets.direct7ApiToken;
    
    // Create client instance with the secret token
    const client = new Client(apiToken);
    
    try {
      // Get user's phone number from the user's profile
      const userPhone = event.user.phone_number;
      
      if (!userPhone) {
        console.log('No phone number found for user');
        return;
      }
  
      // Get current UTC time
      const now = new Date();
      const utcTimestamp = now.toISOString().replace('T', ' ').substr(0, 19);
  
      // Customize your SMS message with timestamp
      const messageContent = `Hello ${event.user.name}, you have successfully logged in at ${utcTimestamp} UTC.`;
      
      // Set up the SMS parameters
      const smsParams = {
        recipients: [userPhone],
        content: messageContent,
        unicode: false
      };
  
      // Send the SMS
      const response = await client.sms.sendMessage(
        'SignOtp',
        'https://webhook.site/af730c0b-f0f7-43e8-9064-b6a204393b5d', // replace with your actual webhook URL
        null, // schedule_time (null for immediate sending)
        smsParams
      );
  
      // Log success with timestamp
      console.log(`[${utcTimestamp}] SMS sent successfully:`, response);
      
    } catch (error) {
      // Log error with timestamp
      const errorTime = new Date().toISOString().replace('T', ' ').substr(0, 19);
      console.error(`[${errorTime}] Error sending SMS:`, error);
    }
  };
  
  /**
   * Handler that will be invoked when this action is resuming after an external redirect.
   *
   * @param {Event} event - Details about the user and the context in which they are logging in.
   * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
   */
  exports.onContinuePostLogin = async (event, api) => {
    // Handle any post-redirect logic here if needed
  };