const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { sendEmail, getBookingTemplate, getCancellationTemplate } = require('../utils/emailService');
const { generateInvoice } = require('../utils/pdfService');
const { sendNotification } = require('../utils/socket');

// Helper to check room availability
const checkAvailability = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    roomId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      { checkInDate: { $lt: checkOut, $gte: checkIn } },
      { checkOutDate: { $gt: checkIn, $lte: checkOut } },
      { checkInDate: { $lte: checkIn }, checkOutDate: { $gte: checkOut } }
    ]
  };

  if (excludeBookingId) query._id = { $ne: excludeBookingId };

  const existingBookingsCount = await Booking.countDocuments(query);
  const room = await Room.findById(roomId);
  
  if (!room) return false;
  return existingBookingsCount < (room.totalRooms || 1);
};

// @desc    Create new booking
const createBooking = async (req, res) => {
  try {
    const { hotelId, roomId, checkInDate, checkOutDate, totalPrice, numGuests, status, paymentStatus } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    
    const isAvailable = await checkAvailability(roomId, checkIn, checkOut);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Room is not available for these dates' });
    }

    const booking = new Booking({
      userId: req.user._id,
      hotelId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      numGuests,
      status: status || 'confirmed', // Auto confirm if possible or set to pending
      paymentStatus: paymentStatus || 'unpaid'
    });

    const createdBooking = await booking.save();

    // Notify user immediately via real-time
    try {
      const fullBooking = await Booking.findById(createdBooking._id)
        .populate('hotelId', 'name')
        .populate('roomId', 'type')
        .populate('userId', 'name email');

      if (fullBooking) {
        // 1. Send Confirmation Email
        const invoiceBuffer = await generateInvoice(fullBooking);
        const html = getBookingTemplate({
          userName: fullBooking.userId.name,
          hotelName: fullBooking.hotelId.name,
          roomType: fullBooking.roomId.type,
          checkIn: fullBooking.checkInDate.toLocaleDateString(),
          checkOut: fullBooking.checkOutDate.toLocaleDateString(),
          totalPrice: fullBooking.totalPrice,
          bookingId: fullBooking._id
        });

        await sendEmail(
          fullBooking.userId.email,
          "Booking Confirmed 🎉",
          html,
          fullBooking.userId._id,
          'booking',
          [{ filename: `invoice-${fullBooking._id}.pdf`, content: invoiceBuffer }]
        );

        // 2. Local Notification
        await sendNotification({
          userId: fullBooking.userId._id,
          title: "Booking Confirmed! 🏨",
          message: `Your stay at ${fullBooking.hotelId.name} has been confirmed.`,
          type: 'booking',
          metaData: { bookingId: fullBooking._id }
        });

        // 3. Notify Manager
        const hotel = await Hotel.findById(fullBooking.hotelId._id);
        if (hotel && hotel.managerId) {
          await sendNotification({
            userId: hotel.managerId,
            title: "New Booking Received!",
            message: `New reservation for ${fullBooking.roomId.type} at ${hotel.name}.`,
            type: 'booking',
            metaData: { bookingId: fullBooking._id }
          });
        }
      }
    } catch (err) {
      console.error('Post-booking notification failed:', err);
    }

    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({ message: 'Server error during booking' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId', 'name location city images')
      .populate('roomId', 'type price')
      .sort('-createdAt');
    res.json({ bookings, count: bookings.length });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('hotelId', 'name')
      .populate('roomId', 'type');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

module.exports = { 
  createBooking, 
  getUserBookings, 
  cancelBooking, 
  getAllBookings
};
