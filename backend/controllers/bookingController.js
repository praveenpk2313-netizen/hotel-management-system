const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
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
  const existingCount = await Booking.countDocuments(query);
  const room = await Room.findById(roomId);
  return room ? existingCount < (room.totalRooms || 1) : false;
};

// @desc    Create new booking
const createBooking = async (req, res) => {
  try {
    const { hotelId, roomId, checkInDate, checkOutDate, totalPrice, numGuests } = req.body;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (!await checkAvailability(roomId, checkIn, checkOut)) {
      return res.status(400).json({ message: 'Room not available for selected dates' });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      hotelId, roomId, checkInDate: checkIn, checkOutDate: checkOut,
      totalPrice, numGuests, status: 'confirmed'
    });

    // Notifications
    setTimeout(async () => {
      try {
        const full = await Booking.findById(booking._id).populate('hotelId').populate('roomId').populate('userId');
        if (full) {
          const invoice = await generateInvoice(full);
          const html = getBookingTemplate({ userName: full.userId.name, hotelName: full.hotelId.name, roomType: full.roomId.type, checkIn: full.checkInDate.toLocaleDateString(), checkOut: full.checkOutDate.toLocaleDateString(), totalPrice: full.totalPrice, bookingId: full._id });
          await sendEmail(full.userId.email, "Booking Confirmed! 🎉", html, full.userId._id, 'booking', [{ filename: `invoice-${full._id}.pdf`, content: invoice }]);
          await sendNotification({ userId: full.userId._id, title: "Booking Confirmed!", message: `Stay at ${full.hotelId.name} confirmed.`, type: 'booking', metaData: { bookingId: full._id } });
        }
      } catch (err) { console.error('Notification error:', err); }
    }, 100);

    res.status(201).json(booking);
  } catch (err) { res.status(500).json({ message: 'Booking failed' }); }
};

// @desc    Get user bookings
const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate('hotelId').populate('roomId').sort('-createdAt');
  res.json({ bookings, count: bookings.length });
};

// @desc    Update booking
const updateBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, totalPrice } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (!await checkAvailability(booking.roomId, checkIn, checkOut, booking._id)) {
      return res.status(400).json({ message: 'Dates taken' });
    }
    booking.checkInDate = checkIn;
    booking.checkOutDate = checkOut;
    if (totalPrice) booking.totalPrice = totalPrice;
    const updated = await booking.save();
    res.json(updated);
  } catch (err) { res.status(500).json({ message: 'Update failed' }); }
};

// @desc    Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Cancelled' });
  } catch (err) { res.status(500).json({ message: 'Cancel failed' }); }
};

// @desc    Update status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Not found' });
    booking.status = status;
    const updated = await booking.save();
    res.json(updated);
  } catch (err) { res.status(500).json({ message: 'Status update failed' }); }
};

const getAllBookings = async (req, res) => {
  const all = await Booking.find({}).populate('userId').populate('hotelId');
  res.json(all);
};

module.exports = { 
  createBooking, 
  getUserBookings, 
  updateBooking, 
  cancelBooking, 
  getAllBookings,
  updateBookingStatus
};
