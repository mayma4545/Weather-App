/**
 * @fileoverview SMS Service for AGRIDEB.
 * Sends SMS via a configured endpoint, or stubs it to console if no endpoint is configured.
 */

const SMS_API_ENDPOINT = process.env.SMS_API_ENDPOINT || '';
const SMS_API_KEY = process.env.SMS_API_KEY || '';

/**
 * Sends an SMS message.
 * @param {Object} options
 * @param {string} options.to - The destination phone number.
 * @param {string} options.message - The SMS message content.
 * @returns {Promise<Object>} Result of the SMS send operation.
 */
async function sendSms({ to, message }) {
  if (!SMS_API_ENDPOINT) {
    console.log(`📱 [SMS-STUB] Would send to ${to}: ${message}`);
    return { success: true, stub: true, to, message };
  }

  try {
    const url = new URL(SMS_API_ENDPOINT);
    url.searchParams.append('number', to);
    url.searchParams.append('message', message);

    const headers = {};
    if (SMS_API_KEY) {
      headers['x-api-key'] = SMS_API_KEY;
      headers['Authorization'] = `Bearer ${SMS_API_KEY}`;
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json().catch(() => null);
    return { success: true, data };
  } catch (error) {
    console.error(`🚨 [SMS-ERROR] Failed to send SMS to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendSms
};
