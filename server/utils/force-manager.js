const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel-mgmt';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to DB');
    const email = 'manager.d2313@gmail.com';
    let user = await User.findOne({ email });

    if (user) {
      user.role = 'manager';
      user.password = 'password123'; // Re-triggers pre-save hook for hashing
      await user.save();
      console.log(`User ${email} updated: Role=manager, Pwd=password123`);
    } else {
      user = await User.create({
        name: 'Manager User',
        email: email,
        password: 'password123',
        role: 'manager'
      });
      console.log(`User ${email} created: Role=manager, Pwd=password123`);
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
