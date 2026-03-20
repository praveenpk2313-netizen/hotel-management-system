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

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Direct OAuth Routes matching User's registered Google Console redirect config
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: `${CLIENT_URL}/oauth/callback?error=oauth_failed` }), (req, res) => {
  const token = generateToken(req.user._id, req.user.role);
  const userObj = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    token
  };
  res.redirect(`${CLIENT_URL}/oauth/callback?data=${encodeURIComponent(JSON.stringify(userObj))}`);
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
app.get('/auth/github/callback', passport.authenticate('github', { session: false, failureRedirect: `${CLIENT_URL}/oauth/callback?error=oauth_failed` }), (req, res) => {
  const token = generateToken(req.user._id, req.user.role);
  const userObj = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    token
  };
  res.redirect(`${CLIENT_URL}/oauth/callback?data=${encodeURIComponent(JSON.stringify(userObj))}`);
});

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
