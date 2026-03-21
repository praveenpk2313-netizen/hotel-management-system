const mongoose = require('mongoose');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/hotel-mgmt');
  const hotels = await Hotel.find({});
  console.log('Total hotels found:', hotels.length);
  for (const h of hotels) {
    const rooms = await Room.find({ hotelId: h._id });
    console.log(`Hotel: ${h.name}, isApproved: ${h.isApproved}, Rooms: ${rooms.length}`);
    rooms.forEach(r => console.log(`  Room: ${r.type}, Price: ${r.pricePerNight}`));
  }
  await mongoose.disconnect();
}

check().catch(console.error);
