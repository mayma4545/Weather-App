const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter lazily or on load
let transporter;

try {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || user === 'your-email@gmail.com' || !pass) {
    console.warn('⚠️ Email Service Warning: EMAIL_USER or EMAIL_PASS not configured in .env. Email sending will fail/be bypassed.');
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass
    }
  });
} catch (error) {
  console.error('❌ Failed to initialize email transporter:', error);
}

/**
 * Reusable function to send an email.
 * @param {Object} options - Email options
 * @param {string|Array<string>} options.to - Recipient email address(es)
 * @param {string} options.subject - Subject of the email
 * @param {string} [options.text] - Plain text version of the email body
 * @param {string} [options.html] - HTML version of the email body
 * @param {Array<Object>} [options.attachments] - Optional attachments array for nodemailer
 * @returns {Promise<Object>} The nodemailer send result details
 */

async function sendEmail({ to, subject, text, html, attachments }) {
  if (!transporter) {
    throw new Error('Email transporter is not initialized. Check your credentials in .env.');
  }

  if (!to) {
    throw new Error('Recipient email address ("to") is required.');
  }

  if (!subject) {
    throw new Error('Email "subject" is required.');
  }

  const mailOptions = {
    from: `"Project Weather Alert" <${process.env.EMAIL_USER}>`,
    to: Array.isArray(to) ? to.join(', ') : to,
    subject: subject,
    text: text,
    html: html || text, // Fallback to text if html is not provided
    attachments: attachments
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email successfully sent to ${mailOptions.to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Error sending email to ${mailOptions.to}:`, error);
    throw error;
  }
}

module.exports = {
  sendEmail,
  getTransporter: () => transporter // Exposed for advanced usage if needed
};
