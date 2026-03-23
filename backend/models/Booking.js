const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Hotel',
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Room',
    },
    // Snapshot fields for permanent records
    hotelName: { type: String, required: true },
    location:  { type: String, required: true },
    roomType:  { type: String, required: true },
    
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numGuests: {
      type: Number,
      default: 1,
    },
    nights: {
      type: Number,
      required: true
    },
    pricePerNight: {
      type: Number,
      required: true
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'paid',
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['Razorpay', 'Stripe', 'Mock']
    },
    transactionId: {
      type: String,
      required: true,
      unique: true // Prevent duplicate bookings for same transaction
    },
    isReviewed: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
