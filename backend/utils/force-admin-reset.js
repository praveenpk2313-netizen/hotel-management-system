const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const resetAdmin = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to DB`);

    const adminEmail = 'admin@hotel.com';
    const newPassword = 'admin123';

    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      admin.password = newPassword;
      admin.role = 'admin';
      await admin.save();
      console.log(`Admin ${adminEmail} password successfully reset to: ${newPassword}`);
    } else {
      admin = await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: newPassword,
        role: 'admin'
      });
      console.log(`Admin ${adminEmail} created with password: ${newPassword}`);
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

resetAdmin();
