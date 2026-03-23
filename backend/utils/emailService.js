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

const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; color: #1e293b;">
      <h2>Welcome, ${name}!</h2>
      <p>Please verify your email address to secure your account.</p>
      <a href="${verificationUrl}" style="background: #22d3ee; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Verify Email</a>
    </div>
  `;
  return sendEmail(email, 'Verify Your Email - Stay Savvy', html);
};

const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
      <h2>Password Reset</h2>
      <p>Click below to reset your password. This link is valid for 1 hour.</p>
      <a href="${resetUrl}" style="background: #1e293b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Reset Password</a>
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
  </div>
`;

const getCancellationTemplate = ({ bookingId }) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
    <h3>Booking Cancelled ❌</h3>
    <p>Your booking <strong>#${bookingId}</strong> has been cancelled.</p>
  </div>
`;

const getPaymentTemplate = ({ hotelName, amount, paymentId, bookingId }) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
    <h2 style="color: #10b981;">Payment Successful 💳</h2>
    <p>Your payment for <strong>${hotelName}</strong> has been processed successfully.</p>
    <div style="background: #f0fdf4; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>Booking ID:</strong> #${bookingId}</p>
      <p><strong>Payment ID:</strong> ${paymentId}</p>
      <p><strong>Amount Paid:</strong> $${amount}</p>
    </div>
  </div>
`;

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  getBookingTemplate,
  getCancellationTemplate,
  getPaymentTemplate
};
