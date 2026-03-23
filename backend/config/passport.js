const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

/**
 * Validates that required environment variables are present.
 */
const validateEnv = () => {
  const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`ERROR: Missing required OAuth environment variables: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// ─── Role resolution from email allow-lists ──────────────────────────────────
const getRoleForEmail = (email) => {
  const adminEmails = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const managerEmails = (process.env.MANAGER_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const normalized = email.toLowerCase();
  if (adminEmails.includes(normalized)) return 'admin';
  if (managerEmails.includes(normalized)) return 'manager';
  return 'customer';
};

// ─── Shared upsert helper ─────────────────────────────────────────────────────
const findOrCreateOAuthUser = async ({ email, name, avatar, provider, oauthId }) => {
  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    let needsSave = false;
    if (!user.oauthProvider) {
      user.oauthProvider = provider;
      user.oauthId = oauthId;
      needsSave = true;
    }
    if (avatar && !user.avatar) {
      user.avatar = avatar;
      needsSave = true;
    }
    
    const expectedRole = getRoleForEmail(email);
    if (expectedRole !== 'customer' && user.role === 'customer') {
      user.role = expectedRole;
      needsSave = true;
    }
    
    if (needsSave) {
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    }
    return user;
  }

  const randomPwd = Math.random().toString(36).slice(-8);
  user = await User.create({
    name: name || email.split('@')[0],
    email: email.toLowerCase(),
    password: randomPwd,
    role: getRoleForEmail(email),
    isVerified: true,
    oauthProvider: provider,
    oauthId: oauthId,
    avatar: avatar || null,
    lastLogin: new Date(),
  });

  return user;
};

// Initialize Google Strategy ONLY if credentials are available
if (validateEnv()) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        // The callbackURL will be dynamically overridden in app.js routes to ensure production safety
        callbackURL: "/auth/google/callback", 
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email received from Google'), null);
          }

          const user = await findOrCreateOAuthUser({
            email,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value || null,
            provider: 'google',
            oauthId: profile.id,
          });

          return done(null, user);
        } catch (err) {
          console.error('Google OAuth error:', err);
          return done(err, null);
        }
      }
    )
  );
} else {
  console.warn('WARNING: Passport Google OAuth strategy NOT initialized due to missing credentials.');
}

module.exports = passport;
