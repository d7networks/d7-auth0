/**
* D7 Networks SMS Message Action for Auth0
* This action handles phone message sending (SMS) for MFA and verification using D7 Networks' service.
* 
* Required Dependencies:
* - direct7: "latest"
* 
* Required Secrets:
* - direct7ApiToken: Your D7 Networks API token
* 
* @param {Event} event - Details about the message and recipient
* @param {PhoneMessageAPI} api - Interface for message handling
*/

const Client = require('direct7');

// Configuration constants 
const CONFIG = {
 SMS_SENDER_ID: 'SignOtp',
 MAX_RETRIES: 3,
 RETRY_DELAY_MS: 1000
};

exports.onExecuteSendPhoneMessage = async (event, api) => {
 if (!event.secrets.direct7ApiToken) {
   console.error('D7 Networks API token not configured');
   throw new Error('SMS service configuration error');
 }

 const client = new Client(apiToken=event.secrets.direct7ApiToken);
 
 try {
   const { code, recipient } = event.message_options;

   if (!isValidPhoneNumber(recipient)) {
     console.error('Invalid phone number format:', recipient);
     throw new Error('Invalid phone number format');
   }

   // Attempt to send SMS with retries
   const response = await sendSMSWithRetry(client, recipient, code);

   console.log('SMS sent successfully:', {
     messageId: response.messageId,
     recipient: maskPhoneNumber(recipient),
     timestamp: new Date().toISOString()
   });

   return { status: 'ok' };

 } catch (error) {
   console.error('Failed to send verification message:', {
     error: error.message,
     recipient: event.message_options?.recipient,
     timestamp: new Date().toISOString()
   });
   throw new Error('Failed to send verification message');
 }
};


/**
* Sends SMS with retry logic
* @param {Object} client - D7 client instance
* @param {string} recipient - Phone number
* @param {string} code - Verification code
* @returns {Promise} SMS response
*/
async function sendSMSWithRetry(client, recipient, code, attemptCount = 0) {
 try {
   const response = await client.sms.sendMessage(
     CONFIG.SMS_SENDER_ID,
     CONFIG.WEBHOOK_URL,
     null, // No scheduled time
     {
       recipients: [recipient],
       content: generateVerificationMessage(code),
       unicode: false
     }
   );

   if (!response) {
     throw new Error('Invalid response from SMS service');
   }

   return response;

 } catch (error) {
   if (attemptCount < CONFIG.MAX_RETRIES) {
     await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS));
     return sendSMSWithRetry(client, recipient, code, attemptCount + 1);
   }
   throw error;
 }
}


/**
* Validates phone number format
* @param {string} phoneNumber - Phone number to validate
* @returns {boolean} Whether the phone number is valid
*/
function isValidPhoneNumber(phoneNumber) {
 if (!phoneNumber) return false;
 // Basic validation for international format: +1234567890
 return /^\+\d{10,15}$/.test(phoneNumber.replace(/\s/g, ''));
}

/**
* Generates verification message
* @param {string} code - Verification code
* @returns {string} Formatted message
*/
function generateVerificationMessage(code) {
 return `Your verification code is: ${code}. Please do not share this code with anyone.`;
}

/**
* Masks phone number for logging
* @param {string} phoneNumber - Phone number to mask
* @returns {string} Masked phone number
*/
function maskPhoneNumber(phoneNumber) {
 if (!phoneNumber) return '';
 return phoneNumber.replace(/(\+\d{2})\d+(\d{4})/, '$1*****$2');
}