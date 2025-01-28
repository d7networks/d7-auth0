const Client = require('direct7');

const CONFIG = {
  SMS_SENDER_ID: 'SignOtp',
};

const isValidPhoneNumber = (phoneNumber) => 
  phoneNumber && /^\+\d{10,15}$/.test(phoneNumber.replace(/\s/g, ''));

const generateVerificationMessage = (code) => 
  `Your verification code is: ${code}. Please do not share this code with anyone.`;

const maskPhoneNumber = (phoneNumber) => 
  phoneNumber ? phoneNumber.replace(/(\+\d{2})\d+(\d{4})/, '$1*****$2') : '';

exports.onExecuteSendPhoneMessage = async (event, api) => {
  if (!event.secrets.direct7ApiToken) {
    console.error('D7 Networks API token not configured');
    throw new Error('SMS service configuration error');
  }

  const client = new Client(event.secrets.direct7ApiToken);

  try {
    const { code, recipient } = event.message_options;

    if (!isValidPhoneNumber(recipient)) {
      console.error('Invalid phone number format:', recipient);
      throw new Error('Invalid phone number format');
    }

    const response = await client.sms.sendMessage(
      CONFIG.SMS_SENDER_ID,
      null,
      null, // No scheduled time
      {
        recipients: [recipient],
        content: generateVerificationMessage(code),
        unicode: false,
      }
    );

    console.log('SMS sent successfully:', {
      messageId: response.messageId,
      recipient: maskPhoneNumber(recipient),
      timestamp: new Date().toISOString(),
    });

    return { status: 'ok' };

  } catch (error) {
    console.error('Failed to send verification message:', {
      error: error.response?.data || error.message,
      recipient: event.message_options.recipient,
      timestamp: new Date().toISOString(),
    });
    throw new Error('Failed to send verification message');
  }
};
