const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const managerRoutes = require('./routes/managerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const passport = require('./config/passport');
const path = require('path');
const generateToken = require('./utils/generateToken');
const { sendNotification } = require('./utils/socket');
const { sendEmail, getLoginTemplate, sendTestEmail } = require('./utils/emailService');

const app = express();
app.set('trust proxy', 1);

// Frontend origin(s) handling - handle multiple comma-separated URLs
const getClientOrigins = () => {
  const envUrl = process.env.CLIENT_URL;
  let origins = [];
  
  if (envUrl) {
    origins = envUrl.split(',').map(url => url.trim().replace(/\/$/, ""));
  } else {
    origins = ['http://localhost:5173', 'https://hotel-management-system-zeta-neon.vercel.app'];
  }
  
  // Always include the Vercel URL to avoid any environment misconfiguration
  const vercelApp = 'https://hotel-management-system-zeta-neon.vercel.app';
  if (!origins.includes(vercelApp)) {
    origins.push(vercelApp);
  }
  return origins;
};

const CLIENT_URLS = getClientOrigins();

/**
 * Helper to determine which frontend URL to redirect back to.
 * It prioritizes the origin of the request if it matches our allowed list.
 */
const getTargetClientUrl = (req) => {
  const referer = req.get('referer');
  const origin = req.get('origin');
  
  const source = origin || referer || '';
  const matched = CLIENT_URLS.find(url => source.includes(url));
  
  return matched || CLIENT_URLS[0]; // Fallback to primary
};

// Update CORS to use the same allowed origins list for predictability
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (CLIENT_URLS.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json());
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Health check — used by the frontend to detect if the server has woken up
// (Render free tier spins down after inactivity; this endpoint resolves the cold start)
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test email — verify SMTP config independently from booking flow
// GET /api/test-email         → sends to SMTP_USER (default)
// GET /api/test-email?to=X    → sends to X
app.get('/api/test-email', async (req, res) => {
  try {
    const recipient = req.query.to || process.env.SMTP_USER;
    console.log(`[TEST-EMAIL] Sending test email to ${recipient}`);
    const result = await sendTestEmail(recipient);
    if (result.success) {
      res.json({
        status: 'ok',
        message: `Test email sent successfully to ${recipient}`,
        messageId: result.messageId,
        smtpConfig: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          from_name: process.env.FROM_NAME,
          from_email: process.env.FROM_EMAIL,
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Test email failed',
        error: result.error,
        smtpConfig: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          pass_set: !!(process.env.SMTP_PASS || process.env.SMTP_PASSWORD),
          from_name: process.env.FROM_NAME,
          from_email: process.env.FROM_EMAIL,
        }
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Test email route error',
      error: err.message
    });
  }
});

app.get('/auth/google', (req, res, next) => {
  const from = req.query.from || '';
  const state = from ? Buffer.from(JSON.stringify({ from })).toString('base64') : undefined;
  
  const dynamicCallback = `${req.protocol}://${req.get('host')}/auth/google/callback`;
  passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    prompt: 'select_account',
    callbackURL: dynamicCallback,
    state: state
  })(req, res, next);
});

app.get('/auth/google/callback', (req, res, next) => {
  const stateVal = req.query.state ? JSON.parse(Buffer.from(req.query.state, 'base64').toString()) : {};
  const targetUrl = stateVal.from || getTargetClientUrl(req);
  
  const dynamicCallback = `${req.protocol}://${req.get('host')}/auth/google/callback`;
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${targetUrl}/oauth/callback?error=oauth_failed`,
    callbackURL: dynamicCallback 
  })(req, res, next);
}, (req, res) => {
  const stateVal = req.query.state ? JSON.parse(Buffer.from(req.query.state, 'base64').toString()) : {};
  const targetUrl = stateVal.from || getTargetClientUrl(req);
  
  const token = generateToken(req.user._id, req.user.role);
  const userObj = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    token
  };

  // ─── Post-Login Notifications (OAuth) ──────────────────────────────────
  setTimeout(async () => {
    try {
      const time = new Date().toLocaleString();
      const device = req.headers['user-agent'] || 'Unknown Device (OAuth)';
      const html = getLoginTemplate({ name: req.user.name, time, device });
      await sendEmail(req.user.email, 'New Login Detected 🔐', html, req.user._id, 'system');
      await sendNotification({
        userId: req.user._id,
        title: "Social Login Successful 🔐",
        message: `Your account was logged in via Google at ${time}.`,
        type: 'system'
      });
    } catch (err) { console.error('OAuth login notify fail:', err); }
  }, 100);

  res.redirect(`${targetUrl}/oauth/callback?data=${encodeURIComponent(JSON.stringify(userObj))}`);
});

// ... Google routes above ...

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
