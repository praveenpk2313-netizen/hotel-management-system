const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await User.findOne({ email: 'admin@hotel.com' });
    if (admin) {
      console.log('Admin Found:');
      console.log(`Name: ${admin.name}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
      // Don't log the hash, just confirm it exists
      console.log(`Password Hash exists: ${!!admin.password}`);
      
      // Update password to be sure
      admin.password = 'admin123';
      await admin.save();
      console.log('Password successfully reset to: admin123');
    } else {
      console.log('Admin NOT found.');
      // Create it if not found
      await User.create({
        name: 'System Administrator',
        email: 'admin@hotel.com',
        role: 'admin',
        password: 'admin123'
      });
      console.log('Admin created with password: admin123');
    }
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkAdmin();
