
const Client = require('direct7');

// Configuration constants 
const CONFIG = {
  WHATSAPP_MESSAGE_TYPE: 'TEXT',
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  OTP_VALIDITY_MINUTES: 10
};

exports.onExecuteSendPhoneMessage = async function(event, api) {
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


async function sendWhatsAppMessageWithRetry(
  client, 
  originator, 
  recipient, 
  code, 
  attemptCount = 0
) {
  try {
    const response = await client.whatsapp.sendWhatsAppFreeformMessage({
      originator: originator,
      recipients: [{
        recipient: recipient,
        recipient_type: "individual"
      }],
      message_type: CONFIG.WHATSAPP_MESSAGE_TYPE,
      body: generateVerificationMessage(code)
    });

    if (!response) {
      throw new Error('Invalid response from WhatsApp service');
    }

    return response;

  } catch (error) {
    if (attemptCount < CONFIG.MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY_MS));
      return sendWhatsAppMessageWithRetry(
        client, 
        originator, 
        recipient, 
        code, 
        attemptCount + 1
      );
    }
    throw error;
  }
}


function isValidPhoneNumber(phoneNumber) {
  if (!phoneNumber) return false;
  // Basic validation for international format: +1234567890
  return /^\+\d{10,15}$/.test(phoneNumber.replace(/\s/g, ''));
}


function generateVerificationMessage(code) {
  return `Your verification code is: ${code}. 
This code will expire in ${CONFIG.OTP_VALIDITY_MINUTES} minutes. 
Do not share this code with anyone.`;
}


function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber) return '';
  return phoneNumber.replace(/(\+\d{2})\d+(\d{4})/, '$1*****$2');
}