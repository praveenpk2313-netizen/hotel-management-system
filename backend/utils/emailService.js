const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: !process.env.SMTP_PORT || parseInt(process.env.SMTP_PORT) === 465, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Should be an App Password
  },
  tls: {
    rejectUnauthorized: false, // Prevents self-signed cert issues on some hosts
  }
});

/**
 * Generic Send Email function
 */
const sendEmail = async (to, subject, html, userId = null, type = 'system', attachments = []) => {
  const mailOptions = {
    from: `"${process.env.FROM_NAME || 'Stay Savvy'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    attachments
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send Email Verification
 */
const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
      <div style="background: #1e1e1e; padding: 2rem; text-align: center;">
        <h1 style="color: white; margin: 0; font-family: serif;">Stay Savvy</h1>
      </div>
      <div style="padding: 2.5rem; background: white;">
        <h2 style="font-size: 1.5rem; margin-top: 0;">Welcome, ${name}!</h2>
        <p style="line-height: 1.6; color: #64748b;">
          Complete your registration by verifying your email address.
        </p>
        <div style="text-align: center; margin: 2rem 0;">
          <a href="${verificationUrl}" style="background: #22d3ee; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Verify Email Address</a>
        </div>
        <p style="font-size: 0.8rem; color: #94a3b8; text-align: center;">
          If you didn't requested this, please ignore.
        </p>
      </div>
    </div>
  `;

  return sendEmail(email, 'Verify Your Email - Stay Savvy', html);
};

/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
      <div style="background: #1e1e1e; padding: 2rem; text-align: center;">
        <h1 style="color: white; margin: 0; font-family: serif;">Stay Savvy</h1>
      </div>
      <div style="padding: 2.5rem; background: white;">
        <h2 style="font-size: 1.5rem; margin-top: 0;">Password Reset Request</h2>
        <p>Hello ${name}, click below to reset your password. Valid for 1 hour.</p>
        <div style="text-align: center; margin: 2rem 0;">
          <a href="${resetUrl}" style="background: #1e293b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail(email, 'Reset Your Password - Stay Savvy', html);
};

const getBookingTemplate = ({ userName, hotelName, roomType, checkIn, checkOut, totalPrice, bookingId }) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
    <h2>Booking Confirmed! 🎉</h2>
    <p>Hi ${userName}, your stay at <strong>${hotelName}</strong> is confirmed.</p>
    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Booking ID:</strong> #${bookingId}</p>
      <p><strong>Room:</strong> ${roomType}</p>
      <p><strong>Dates:</strong> ${checkIn} to ${checkOut}</p>
      <p><strong>Amount:</strong> $${totalPrice}</p>
    </div>
    <p>We look forward to seeing you!</p>
  </div>
`;

const getCancellationTemplate = ({ bookingId }) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
    <h2 style="color: #ef4444;">Booking Cancelled ❌</h2>
    <p>Your booking <strong>#${bookingId}</strong> has been successfully cancelled.</p>
    <p>We hope to see you again soon!</p>
  </div>
`;

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  getBookingTemplate,
  getCancellationTemplate
};
