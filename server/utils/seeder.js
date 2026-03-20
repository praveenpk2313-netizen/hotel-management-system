const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Hotel = require('../models/Hotel');
const connectDB = require('../config/db');

dotenv.config({ path: 'server/.env' });

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Hotel.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hotel.com',
      password: 'password123',
      role: 'admin',
    });

    const manager = await User.create({
      name: 'Hotel Manager',
      email: 'manager@hotel.com',
      password: 'password123',
      role: 'manager',
    });

    await User.create({
      name: 'Guest User',
      email: 'guest@hotel.com',
      password: 'password123',
      role: 'customer',
    });

    const hotels = [
      {
        name: "The Royal Oasis",
        description: "A serene paradise located in the heart of the Maldives. Experience luxury like never before with private villas over the water.",
        location: "Maldives",
        address: "North Male Atoll",
        city: "Maldives",
        amenities: ["Spa", "Private Pool", "WiFi", "Fine Dining"],
        averageRating: 4.9,
        isApproved: true,
        managerId: manager._id
      },
      {
        name: "Alpine Retreat",
        description: "Experience the majestic mountains with cozy fireplaces and world-class skiing just steps from your door.",
        location: "Zermatt",
        address: "Zermatt",
        city: "Swiss Alps",
        amenities: ["Ski-in/Ski-out", "Sauna", "Hot Tub", "Fireplace"],
        averageRating: 4.8,
        isApproved: true,
        managerId: manager._id
      },
      {
        name: "Urban Elegance",
        description: "Modern luxury with stunning city views in Shinjuku. The perfect base for exploring Tokyo.",
        location: "Tokyo",
        address: "Shinjuku-ku",
        city: "Tokyo",
        amenities: ["Gym", "Sky Bar", "Business Palace", "Subway Access"],
        averageRating: 4.7,
        isApproved: true,
        managerId: manager._id
      }
    ];

    const createdHotels = await Hotel.insertMany(hotels);

    const rooms = [];
    createdHotels.forEach(hotel => {
      rooms.push({
        hotelId: hotel._id,
        roomNumber: '101',
        type: 'Luxury Suite',
        price: 450,
        capacity: 2,
        isAvailable: true,
      });
      rooms.push({
        hotelId: hotel._id,
        roomNumber: '102',
        type: 'Deluxe Room',
        price: 280,
        capacity: 2,
        isAvailable: true,
      });
    });

    const Room = require('../models/Room');
    await Room.deleteMany();
    await Room.insertMany(rooms);

    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
