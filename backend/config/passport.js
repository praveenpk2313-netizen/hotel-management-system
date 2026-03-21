const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

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
  // 1. Try to find by email (existing account)
  let user = await User.findOne({ email: email.toLowerCase() });

  if (user) {
    // Update OAuth info if not already linked
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
    // Promote role if email is in allow-list
    const expectedRole = getRoleForEmail(email);
    if (expectedRole !== 'customer' && user.role === 'customer') {
      user.role = expectedRole;
      needsSave = true;
    }
    if (needsSave) {
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    } else {
      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });
    }
    return user;
  }

  // 2. Create new OAuth user
  const randomPwd = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  user = await User.create({
    name: name || email.split('@')[0],
    email: email.toLowerCase(),
    password: randomPwd,
    role: getRoleForEmail(email),
    isVerified: true, // OAuth users are already verified by provider
    oauthProvider: provider,
    oauthId: oauthId,
    avatar: avatar || null,
    lastLogin: new Date(),
  });

  return user;
};

// ─── Google Strategy ──────────────────────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'dummy-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-google-client-secret',
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
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

// ─── GitHub Strategy ──────────────────────────────────────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || 'dummy-github-client-id',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'dummy-github-client-secret',
      callbackURL: '/auth/github/callback',
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // GitHub may return null for private emails; fallback to synthetic email
        let email =
          profile.emails?.find((e) => e.primary)?.value ||
          profile.emails?.[0]?.value ||
          null;

        if (!email && profile.username) {
          email = `${profile.username}@github.com`;
        }

        if (!email) {
          return done(new Error('No email received from GitHub'), null);
        }

        const user = await findOrCreateOAuthUser({
          email,
          name: profile.displayName || profile.username,
          avatar: profile.photos?.[0]?.value || null,
          provider: 'github',
          oauthId: profile.id,
        });

        return done(null, user);
      } catch (err) {
        console.error('GitHub OAuth error:', err);
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
