const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false, // true for port 465, false for 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Reusable email sender
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 * @param {string} userId - User ID for logging
 * @param {string} type - Notification type
 * @param {Array} attachments - Optional attachments
 */
const sendEmail = async (to, subject, html, userId, type, attachments = []) => {
  try {
    const mailOptions = {
      from: `"${process.env.FROM_NAME || 'Hotel'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments
    };

    await transporter.sendMail(mailOptions);

    // Log success
    if (userId) {
      await Notification.create({
        userId,
        type,
        message: subject,
        status: 'sent',
      });
    }
    return true;
  } catch (error) {
    console.error('Email Error:', error);
    // Log failure
    if (userId) {
      try {
        await Notification.create({
          userId,
          title: 'Email Delivery Failed',
          type,
          message: `Failed to send email: ${subject}`,
        });
      } catch (dbErr) {
        console.error('Failed to log email error to DB:', dbErr);
      }
    }
    return false;
  }
};

// ─── Templates ─────────────────────────────────────────────────────────────

const getBookingTemplate = (data) => `
  <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
    <div style="background: #c5a059; padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Booking Confirmed 🎉</h1>
    </div>
    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
      <h2 style="margin-top: 0;">Hello ${data.userName},</h2>
      <p>Thank you for choosing Grand Horizon. Your reservation is successfully placed.</p>
      
      <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin: 25px 0;">
        <table style="width: 100%;">
          <tr><td style="color: #64748b; font-size: 14px;">Hotel</td><td style="font-weight: 700;">${data.hotelName}</td></tr>
          <tr><td style="color: #64748b; font-size: 14px;">Room</td><td>${data.roomType}</td></tr>
          <tr><td style="color: #64748b; font-size: 14px;">Check-in</td><td>${data.checkIn}</td></tr>
          <tr><td style="color: #64748b; font-size: 14px;">Check-out</td><td>${data.checkOut}</td></tr>
          <tr><td style="color: #64748b; font-size: 14px; padding-top: 10px;">Total Price</td><td style="font-weight: 800; color: #c5a059; font-size: 18px; padding-top: 10px;">$${data.totalPrice}</td></tr>
        </table>
      </div>
      
      <p style="font-size: 14px; color: #64748b;">Booking ID: ${data.bookingId}</p>
      <p>We look forward to welcoming you soon!</p>
    </div>
    <div style="background: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
      &copy; 2026 Grand Horizon Hotels. All rights reserved.
    </div>
  </div>
`;

const getPaymentTemplate = (data) => `
  <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
    <div style="background: #10b981; padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Payment Successful 💳</h1>
    </div>
    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
      <h2>Payment Received</h2>
      <p>Great news! We have successfully received your payment for your stay at <strong>${data.hotelName}</strong>.</p>
      
      <div style="border-left: 4px solid #10b981; padding-left: 20px; margin: 25px 0;">
        <p style="margin: 5px 0;"><strong>Amount Paid:</strong> $${data.amount}</p>
        <p style="margin: 5px 0;"><strong>Payment ID:</strong> ${data.paymentId}</p>
        <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${data.bookingId}</p>
      </div>
      
      <p>Your booking status is now <strong>Confirmed</strong>.</p>
    </div>
  </div>
`;

const getCancellationTemplate = (data) => `
  <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
    <div style="background: #ef4444; padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Booking Cancelled ❌</h1>
    </div>
    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
      <h2>Reservation Cancelled</h2>
      <p>Your booking with ID <strong>${data.bookingId}</strong> has been cancelled as requested.</p>
      <p>The refund (if applicable) will be processed to your original payment method within 5-7 business days.</p>
      <p>We hope to see you again soon.</p>
    </div>
  </div>
`;

const getPromotionTemplate = (data) => `
  <div style="font-family: 'Helvetica', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
    <div style="background: #1e293b; padding: 40px; text-align: center;">
      <h1 style="color: #c5a059; margin: 0; font-size: 28px;">${data.title} 🎁</h1>
    </div>
    <div style="padding: 40px; color: #1e293b; line-height: 1.6; text-align: center;">
      <h2 style="font-size: 22px;">Exclusive Offer</h2>
      <p style="font-size: 16px;">${data.content}</p>
      
      <div style="margin: 35px 0;">
        <a href="${process.env.CLIENT_URL}" style="background: #c5a059; color: white; padding: 15px 35px; border-radius: 30px; text-decoration: none; font-weight: 700; display: inline-block;">Book Now</a>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px;">Hurry! This offer is valid for a limited time only.</p>
    </div>
  </div>
`;

module.exports = {
  sendEmail,
  getBookingTemplate,
  getPaymentTemplate,
  getCancellationTemplate,
  getPromotionTemplate
};
