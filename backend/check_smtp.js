/**
 * Quick SMTP test — run with: node check_smtp.js
 * Tests SMTP connectivity and sends a test email.
 */
require('dotenv').config();

const nodemailer = require('nodemailer');

const config = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false },
  connectionTimeout: 15000,
  greetingTimeout: 15000,
};

console.log('\n=== SMTP Configuration ===');
console.log('Host:', config.host);
console.log('Port:', config.port);
console.log('User:', config.auth.user || '(NOT SET)');
console.log('Pass:', config.auth.pass ? `****${config.auth.pass.slice(-4)} (${config.auth.pass.length} chars)` : '(NOT SET)');
console.log('FROM_NAME:', process.env.FROM_NAME || '(NOT SET)');
console.log('FROM_EMAIL:', process.env.FROM_EMAIL || '(NOT SET)');
console.log('========================\n');

const transporter = nodemailer.createTransport(config);

async function test() {
  // Step 1: Verify
  console.log('[1] Verifying SMTP connection...');
  try {
    await transporter.verify();
    console.log('[1] ✅ SMTP connection verified!\n');
  } catch (err) {
    console.error('[1] ❌ SMTP verification FAILED:', err.message);
    console.error('    Code:', err.code);
    process.exit(1);
  }

  // Step 2: Send test email
  const recipient = process.argv[2] || process.env.SMTP_USER;
  console.log(`[2] Sending test email to: ${recipient}`);
  try {
    const from = `"${process.env.FROM_NAME || 'PK UrbanStay'}" <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`;
    const info = await transporter.sendMail({
      from,
      to: recipient,
      subject: 'PK UrbanStay — SMTP Test ✅',
      html: `<div style="font-family:sans-serif;padding:20px;"><h2>✅ SMTP Test Successful</h2><p>Sent at ${new Date().toISOString()}</p></div>`,
    });
    console.log(`[2] ✅ Email sent! MessageId: ${info.messageId}\n`);
  } catch (err) {
    console.error('[2] ❌ Send FAILED:', err.message);
    console.error('    Code:', err.code);
    if (err.response) console.error('    SMTP response:', err.response);
  }

  process.exit(0);
}

test();
