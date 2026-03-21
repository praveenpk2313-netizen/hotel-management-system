const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  await connectDB();

  try {
    const adminEmail = 'admin@hotel.com';
    const adminPassword = 'admin123';

    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log('Admin account already exists.');
      process.exit();
    }

    const admin = await User.create({
      name: 'System Administrator',
      email: adminEmail,
      role: 'admin',
      password: adminPassword,
    });

    if (admin) {
      console.log('Permanent Admin Account Created Successfully:');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    }

    process.exit();
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
