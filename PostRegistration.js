exports.onExecutePostUserRegistration = async (event, api) => {
    const Client = require('direct7');
    const apiToken = event.secrets.direct7ApiToken;
    const client = new Client(apiToken);
    
    try {
        // Get current UTC time in the specified format
        const now = new Date();
        const utcTimestamp = now.toISOString().replace('T', ' ').substr(0, 19);

        // Get user's phone number from registration
        const userPhone = event.user.phone_number;
        
        if (!userPhone) {
            console.log(`No phone number found for new user: ${event.user.email} at ${utcTimestamp}`);
            return;
        }

        // Welcome message with the specified format
        const messageContent = 
            `Hi ${event.user.name} you have sucessfully created your account using email ${event.user.email} `
        
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

        // Log success
        console.log(`[${utcTimestamp}] Registration SMS sent successfully:`, {
            userId: event.user.username,
            email: event.user.email,
            response: response
        });
        
    } catch (error) {
        const errorTime = new Date().toISOString().replace('T', ' ').substr(0, 19);
        console.error(`[${errorTime}] Error sending registration SMS:`, {
            error: error.message,
            userId: 'kishorD7',
            email: event.user.email
        });
    }
};