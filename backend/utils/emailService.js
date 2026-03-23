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
 * Send Email Verification
 */
const sendVerificationEmail = async (email, name, token) => {
  const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Verify Your Email - Stay Savvy',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
        <div style="background: #1e1e1e; padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-family: 'Playfair Display', serif; font-style: italic;">Stay Savvy</h1>
        </div>
        <div style="padding: 2.5rem; background: white;">
          <h2 style="font-size: 1.5rem; margin-top: 0;">Welcome, ${name}!</h2>
          <p style="line-height: 1.6; font-size: 1rem; color: #64748b;">
            Thank you for joining Stay Savvy. To complete your registration and secure your account, please verify your email address by clicking the button below.
          </p>
          <div style="text-align: center; margin: 2.5rem 0;">
            <a href="${verificationUrl}" style="background: #22d3ee; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 1rem; box-shadow: 0 4px 12px rgba(34, 211, 238, 0.3);">Verify Email Address</a>
          </div>
          <p style="line-height: 1.6; font-size: 0.9rem; color: #94a3b8;">
            If the button doesn't work, copy and paste this link into your browser: <br/>
            <a href="${verificationUrl}" style="color: #22d3ee; word-break: break-all;">${verificationUrl}</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 2rem 0;" />
          <p style="font-size: 0.8rem; color: #94a3b8; text-align: center;">
            If you didn't sign up for an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send Password Reset Email
 */
const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"${process.env.FROM_NAME}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: 'Reset Your Password - Stay Savvy',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1e293b;">
        <div style="background: #1e1e1e; padding: 2rem; text-align: center;">
          <h1 style="color: white; margin: 0; font-family: 'Playfair Display', serif; font-style: italic;">Stay Savvy</h1>
        </div>
        <div style="padding: 2.5rem; background: white;">
          <h2 style="font-size: 1.5rem; margin-top: 0;">Password Reset Request</h2>
          <p style="line-height: 1.6; font-size: 1rem; color: #64748b;">
            Hello ${name}, you requested to reset your password. Click the button below to set a new password. This link is valid for 1 hour.
          </p>
          <div style="text-align: center; margin: 2.5rem 0;">
            <a href="${resetUrl}" style="background: #1e293b; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 1rem;">Reset Password</a>
          </div>
          <p style="line-height: 1.6; font-size: 0.9rem; color: #94a3b8;">
            If you didn't request this, please ignore this email and your password will remain unchanged.
          </p>
          <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 2rem 0;" />
          <p style="font-size: 0.8rem; color: #94a3b8; text-align: center;">
            &copy; 2026 Stay Savvy Hotel Management.
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
