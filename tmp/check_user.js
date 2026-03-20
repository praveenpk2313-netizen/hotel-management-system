const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const User = require('../server/models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel-mgmt';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    const user = await User.findOne({ email: 'manager.d2313@gmail.com' });
    if (user) {
      console.log('USER_FOUND:', JSON.stringify({
        email: user.email,
        role: user.role,
        hasPassword: !!user.password,
        isActive: user.isActive,
        isBlocked: user.isBlocked
      }));
    } else {
      console.log('USER_NOT_FOUND');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
  });
