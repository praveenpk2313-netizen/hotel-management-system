const nodemailer = require('nodemailer');

// ─── Transporter ──────────────────────────────────────────────────────────────
// Gmail SMTP with App Password:
//   host: smtp.gmail.com
//   port: 587
//   secure: false  (STARTTLS auto-upgrades)
//   auth: { user, pass }   ← pass = 16-char Google App Password

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,               // false for port 587 (STARTTLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false, // avoids cert issues on Render/Heroku
  },
  // Add connection timeout for Render's network
  connectionTimeout: 10000,    // 10s to establish connection
  greetingTimeout: 10000,      // 10s for SMTP greeting
  socketTimeout: 15000,        // 15s for socket inactivity
});

// Log SMTP config at startup (mask password)
console.log('[EMAIL] SMTP Config:', {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  user: process.env.SMTP_USER || '(not set)',
  pass: process.env.SMTP_PASS ? '****' + process.env.SMTP_PASS.slice(-4) : '(not set)',
  from_name: process.env.FROM_NAME || '(not set)',
  from_email: process.env.FROM_EMAIL || '(not set)',
});

// Verify transporter at startup
transporter.verify((error, success) => {
  if (error) {
    console.error('[EMAIL] SMTP transporter verification FAILED:', error.message);
    console.error('[EMAIL] Error code:', error.code);
    console.error('[EMAIL] Check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS on Render');
  } else {
    console.log('[EMAIL] SMTP transporter ready — emails can be sent');
  }
});

// ─── From Address ─────────────────────────────────────────────────────────────
const getFromAddress = () => {
  const name = process.env.FROM_NAME || 'PK UrbanStay';
  const email = process.env.FROM_EMAIL || process.env.SMTP_USER;
  return `"${name}" <${email}>`;
};

// ─── Core sendEmail ───────────────────────────────────────────────────────────
/**
 * Send an email and return { success, messageId, error }
 * Never throws — always returns a result object.
 */
const sendEmail = async (to, subject, html, userId = null, type = 'system', attachments = []) => {
  const from = getFromAddress();

  console.log(`[EMAIL] Sending "${subject}" to ${to} (type: ${type}, from: ${from})`);

  const mailOptions = { from, to, subject, html, attachments };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL] Sent successfully → messageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[EMAIL] sendMail FAILED for "${subject}" → ${to}`);
    console.error('[EMAIL] Error code   :', err.code);
    console.error('[EMAIL] Error message:', err.message);
    if (err.response) console.error('[EMAIL] SMTP response:', err.response);
    if (err.responseCode) console.error('[EMAIL] Response code:', err.responseCode);
    return { success: false, error: err.message };
  }
};

// ─── Booking Confirmation Email ───────────────────────────────────────────────
const sendBookingConfirmationEmail = async (booking, user, pdfBuf = null) => {
  console.log(`[EMAIL] Preparing booking confirmation for booking ${booking._id}`);

  const {
    _id,
    hotelName,
    roomType,
    checkInDate,
    checkOutDate,
    numGuests,
    totalPrice,
    paymentStatus,
    status,
    transactionId,
    nights,
    pricePerNight,
  } = booking;

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });

  const formatCurrency = (n) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Booking Confirmed — PK UrbanStay</title>
  </head>
  <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
    <div style="max-width:620px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 30px rgba(0,0,0,0.07);">
      
      <!-- Header -->
      <div style="background:#0f172a;padding:40px 40px 30px;text-align:center;">
        <h1 style="margin:0;color:#c5a059;font-size:28px;letter-spacing:2px;font-weight:800;">PK URBANSTAY</h1>
        <p style="margin:8px 0 0;color:#94a3b8;font-size:13px;letter-spacing:1px;">LUXURY HOTEL MANAGEMENT</p>
      </div>

      <!-- Success Banner -->
      <div style="background:#ecfdf5;padding:30px 40px;text-align:center;border-bottom:1px solid #d1fae5;">
        <div style="width:64px;height:64px;background:#d1fae5;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
          <span style="font-size:32px;">✅</span>
        </div>
        <h2 style="margin:0 0 8px;color:#065f46;font-size:24px;">Booking Confirmed!</h2>
        <p style="margin:0;color:#047857;font-size:15px;">Hi <strong>${user.name}</strong>, your reservation is secured.</p>
      </div>

      <!-- Booking Details -->
      <div style="padding:36px 40px;">
        
        <!-- Booking ID + Status -->
        <div style="background:#f8fafc;border-radius:12px;padding:20px 24px;margin-bottom:28px;border:1px solid #e2e8f0;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <p style="margin:0;font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Booking ID</p>
                <p style="margin:4px 0 0;font-size:16px;color:#0f172a;font-weight:800;">#${String(_id).slice(-8).toUpperCase()}</p>
              </td>
              <td style="text-align:right;">
                <span style="background:#dcfce7;color:#15803d;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:700;text-transform:uppercase;">${status || 'Confirmed'}</span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Hotel & Room -->
        <h3 style="margin:0 0 16px;color:#0f172a;font-size:18px;border-bottom:2px solid #f1f5f9;padding-bottom:12px;">🏨 Reservation Details</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;width:45%;">
              <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Hotel</p>
              <p style="margin:4px 0 0;font-size:15px;color:#0f172a;font-weight:700;">${hotelName}</p>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Room Type</p>
              <p style="margin:4px 0 0;font-size:15px;color:#c5a059;font-weight:700;">${roomType}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Check-In</p>
              <p style="margin:4px 0 0;font-size:15px;color:#0f172a;font-weight:600;">${formatDate(checkInDate)}</p>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Check-Out</p>
              <p style="margin:4px 0 0;font-size:15px;color:#0f172a;font-weight:600;">${formatDate(checkOutDate)}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Guests</p>
              <p style="margin:4px 0 0;font-size:15px;color:#0f172a;font-weight:600;">${numGuests || 1} guest(s)</p>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;">
              <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:700;text-transform:uppercase;">Duration</p>
              <p style="margin:4px 0 0;font-size:15px;color:#0f172a;font-weight:600;">${nights || 1} night(s)</p>
            </td>
          </tr>
        </table>

        <!-- Payment Summary -->
        <h3 style="margin:0 0 16px;color:#0f172a;font-size:18px;border-bottom:2px solid #f1f5f9;padding-bottom:12px;">💳 Payment Summary</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Price per night</td>
            <td style="text-align:right;color:#0f172a;font-weight:600;font-size:14px;">${formatCurrency(pricePerNight)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b;font-size:14px;">Nights</td>
            <td style="text-align:right;color:#0f172a;font-weight:600;font-size:14px;">${nights || 1}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:4px 0;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0;"/></td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:800;font-size:16px;color:#0f172a;">Total Paid</td>
            <td style="text-align:right;font-weight:900;font-size:20px;color:#10b981;">${formatCurrency(totalPrice)}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:12px;color:#94a3b8;">Payment Status</td>
            <td style="text-align:right;font-size:12px;color:#15803d;font-weight:700;text-transform:uppercase;">${paymentStatus || 'Paid'}</td>
          </tr>
          ${transactionId ? `<tr>
            <td style="padding:4px 0;font-size:12px;color:#94a3b8;">Transaction ID</td>
            <td style="text-align:right;font-size:11px;color:#64748b;">${transactionId}</td>
          </tr>` : ''}
        </table>

        <!-- Info Note -->
        <div style="background:#fffbeb;border:1px solid #fef3c7;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
          <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
            📌 Please carry a valid photo ID at check-in. For any changes or cancellations, contact us at least 24 hours in advance.
          </p>
        </div>

        <!-- CTA Button -->
        <div style="text-align:center;margin-top:32px;">
          <a href="${clientUrl}/customer/dashboard"
             style="background:#0f172a;color:white;padding:16px 40px;border-radius:12px;text-decoration:none;font-size:15px;font-weight:700;display:inline-block;">
            Manage My Booking →
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div style="background:#f8fafc;padding:24px 40px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.6;">
          © ${new Date().getFullYear()} PK UrbanStay · All rights reserved<br/>
          Questions? Reply to this email or visit our <a href="${clientUrl}" style="color:#c5a059;">website</a>
        </p>
      </div>
    </div>
  </body>
  </html>
  `;

  const attachments = pdfBuf
    ? [{ filename: `PKUrbanStay-Invoice-${String(_id).slice(-8).toUpperCase()}.pdf`, content: pdfBuf }]
    : [];

  console.log(`[EMAIL] Sending booking confirmation email to ${user.email}`);

  const result = await sendEmail(
    user.email,
    `Booking Confirmed: ${hotelName} 🎉`,
    html,
    user._id,
    'booking',
    attachments
  );

  if (result.success) {
    console.log(`[EMAIL] Booking confirmation email sent successfully for booking ${_id}`);
  } else {
    console.error(`[EMAIL] Booking confirmation email FAILED for booking ${_id}:`, result.error);
  }

  return result;
};

// ─── Verification Email ────────────────────────────────────────────────────────
const sendVerificationEmail = async (email, name, token) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
  const verificationUrl = `${clientUrl}/verify-email?token=${token}`;
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;padding:20px;border-radius:12px;color:#1e293b;">
      <h2>Welcome, ${name}!</h2>
      <p>Please verify your email address to secure your account.</p>
      <a href="${verificationUrl}" style="background:#22d3ee;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;">Verify Email</a>
    </div>
  `;
  return sendEmail(email, 'Verify Your Email - PK UrbanStay', html);
};

// ─── Password Reset Email ──────────────────────────────────────────────────────
const sendPasswordResetEmail = async (email, name, token) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
  const resetUrl = `${clientUrl}/reset-password?token=${token}`;
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;padding:20px;border-radius:12px;">
      <h2>Password Reset</h2>
      <p>Click below to reset your password. This link is valid for 1 hour.</p>
      <a href="${resetUrl}" style="background:#1e293b;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;">Reset Password</a>
    </div>
  `;
  return sendEmail(email, 'Reset Your Password - PK UrbanStay', html);
};

// ─── Send Test Email (diagnostic) ─────────────────────────────────────────────
const sendTestEmail = async (recipientEmail) => {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;padding:30px;border-radius:16px;color:#1e293b;">
      <h2 style="color:#0f172a;">✅ SMTP Test Successful</h2>
      <p>This is a test email from your PK UrbanStay backend.</p>
      <div style="background:#f8fafc;padding:16px;border-radius:8px;margin:20px 0;font-size:0.9rem;">
        <p style="margin:4px 0;"><strong>SMTP Host:</strong> ${process.env.SMTP_HOST}</p>
        <p style="margin:4px 0;"><strong>SMTP Port:</strong> ${process.env.SMTP_PORT}</p>
        <p style="margin:4px 0;"><strong>From:</strong> ${getFromAddress()}</p>
        <p style="margin:4px 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p style="margin:4px 0;"><strong>Node Env:</strong> ${process.env.NODE_ENV || 'development'}</p>
      </div>
      <p style="color:#64748b;font-size:0.85rem;">If you received this email, your SMTP configuration is correct.</p>
    </div>
  `;

  return sendEmail(
    recipientEmail,
    'PK UrbanStay — SMTP Test ✅',
    html,
    null,
    'test'
  );
};

// ─── Template Helpers ─────────────────────────────────────────────────────────
const getBookingTemplate = ({ userName, hotelName, roomType, checkIn, checkOut, totalPrice, bookingId }) => `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;padding:20px;border-radius:10px;">
    <h2>Booking Confirmed! 🎉</h2>
    <p>Hi ${userName}, your stay at <strong>${hotelName}</strong> is confirmed.</p>
    <div style="background:#f9f9f9;padding:15px;border-radius:5px;margin:20px 0;">
      <p><strong>Booking ID:</strong> #${bookingId}</p>
      <p><strong>Room:</strong> ${roomType}</p>
      <p><strong>Dates:</strong> ${checkIn} to ${checkOut}</p>
      <p><strong>Amount:</strong> $${totalPrice}</p>
    </div>
  </div>
`;

const getCancellationTemplate = ({ bookingId }) => `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;padding:20px;border-radius:10px;">
    <h3>Booking Cancelled ❌</h3>
    <p>Your booking <strong>#${bookingId}</strong> has been cancelled.</p>
  </div>
`;

const getPaymentTemplate = ({ hotelName, amount }) => `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;padding:20px;border-radius:10px;">
    <h3>Payment Received ✅</h3>
    <p>Payment of $${amount} for <strong>${hotelName}</strong> received successfully.</p>
  </div>
`;

const getLoginTemplate = ({ name, time, device }) => `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;padding:25px;border-radius:16px;color:#1e293b;">
    <h2 style="color:#0f172a;margin-bottom:20px;">New Login Detected 🔐</h2>
    <p>Hi ${name}, a new login was detected for your account.</p>
    <div style="background:#f8fafc;padding:20px;border-radius:12px;margin:25px 0;border:1px solid #f1f5f9;">
      <p style="margin:5px 0;"><strong>Time:</strong> ${time}</p>
      <p style="margin:5px 0;"><strong>Device/Browser:</strong> ${device}</p>
    </div>
    <p style="font-size:0.9rem;color:#64748b;">If this wasn't you, please reset your password immediately to secure your account.</p>
  </div>
`;

const getPromotionTemplate = ({ title, content }) => {
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').split(',')[0].trim();
  return `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;padding:0;border-radius:16px;overflow:hidden;">
    <div style="background:#0f172a;padding:40px 20px;text-align:center;color:white;">
       <h1 style="margin:0;font-family:serif;letter-spacing:2px;">PK URBANSTAY</h1>
    </div>
    <div style="padding:40px 30px;color:#1e293b;">
       <h2 style="color:#0f172a;font-size:1.5rem;margin-bottom:20px;">${title}</h2>
       <div style="line-height:1.8;color:#475569;font-size:1.05rem;">${content}</div>
       <div style="margin-top:40px;text-align:center;">
          <a href="${clientUrl}" style="background:#c5a059;color:white;padding:14px 30px;text-decoration:none;border-radius:8px;font-weight:700;display:inline-block;">Explore Deals</a>
       </div>
    </div>
    <div style="background:#f8fafc;padding:20px;text-align:center;font-size:0.8rem;color:#94a3b8;">
       © ${new Date().getFullYear()} PK UrbanStay. All rights reserved.
    </div>
  </div>
  `;
};

module.exports = {
  sendEmail,
  sendBookingConfirmationEmail,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendTestEmail,
  getBookingTemplate,
  getCancellationTemplate,
  getPaymentTemplate,
  getLoginTemplate,
  getPromotionTemplate,
};
