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
    from: `"${process.env.FROM_NAME || 'StayNow'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
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
  return sendEmail(email, 'Verify Your Email - StayNow', html);
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
  return sendEmail(email, 'Reset Your Password - StayNow', html);
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
    </div>
  </div>
`;

const getLoginTemplate = ({ name, time, device }) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 25px; border-radius: 16px; color: #1e293b;">
    <h2 style="color: #0f172a; margin-bottom: 20px;">New Login Detected 🔐</h2>
    <p>Hi ${name}, a new login was detected for your account.</p>
    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #f1f5f9;">
      <p style="margin: 5px 0;"><strong>Time:</strong> ${time}</p>
      <p style="margin: 5px 0;"><strong>Device/Browser:</strong> ${device}</p>
    </div>
    <p style="font-size: 0.9rem; color: #64748b;">If this wasn't you, please reset your password immediately to secure your account.</p>
  </div>
`;

const getPromotionTemplate = ({ title, content }) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 0; border-radius: 16px; overflow: hidden;">
    <div style="background: #0f172a; padding: 40px 20px; text-align: center; color: white;">
       <h1 style="margin: 0; font-family: serif; letter-spacing: 2px;">STAYNOW</h1>
    </div>
    <div style="padding: 40px 30px; color: #1e293b;">
       <h2 style="color: #0f172a; font-size: 1.5rem; margin-bottom: 20px;">${title}</h2>
       <div style="line-height: 1.8; color: #475569; font-size: 1.05rem;">
          ${content}
       </div>
       <div style="margin-top: 40px; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background: #c5a059; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 700; display: inline-block;">Explore Deals</a>
       </div>
    </div>
    <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 0.8rem; color: #94a3b8;">
       © ${new Date().getFullYear()} StayNow Luxury Hotels. All rights reserved.
    </div>
  </div>
`;

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  getBookingTemplate,
  getCancellationTemplate,
  getPaymentTemplate,
  getLoginTemplate,
  getPromotionTemplate
};
