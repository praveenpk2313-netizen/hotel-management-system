const mongoose = require('mongoose');

const roomSchema = mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Hotel',
    },
    roomNumber: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    bedType: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    totalRooms: {
      type: Number,
      default: 1,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    amenities: [String],
    images: [String],
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;
