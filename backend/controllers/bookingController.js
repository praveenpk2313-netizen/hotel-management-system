const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const { sendEmail, getBookingTemplate } = require('../utils/emailService');
const { generateInvoice } = require('../utils/pdfService');
const { sendNotification } = require('../utils/socket');

/**
 * Helper to check room availability.
 */
const checkAvailability = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    roomId,
    status: { $in: ['confirmed'] },
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

/**
 * @desc    Confirm booking after verified payment success
 * @route   POST /api/bookings/confirm-after-payment
 * @access  Private
 */
const confirmAfterPayment = async (req, res) => {
  try {
    const { 
      hotelId, roomId, checkInDate, checkOutDate, 
      numGuests, totalPrice, paymentMethod, transactionId 
    } = req.body;

    // 1. Idempotency check: if transaction exists, return existing booking
    const existing = await Booking.findOne({ transactionId });
    if (existing) return res.status(200).json(existing);

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // 2. Final availability check
    if (!await checkAvailability(roomId, checkIn, checkOut)) {
      return res.status(400).json({ message: 'Selected dates are no longer available.' });
    }

    // 3. Fetch Snapshot info
    const hotel = await Hotel.findById(hotelId);
    const room  = await Room.findById(roomId);
    if (!hotel || !room) {
      console.error('❌ Property details missing for booking:', { hotelId, roomId });
      return res.status(404).json({ message: 'Property details not found.' });
    }

    // Calculate nights & price per night
    const diffTime = Math.abs(checkOut - checkIn);
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights <= 0) nights = 1; // Fallback
    
    const pricePerNight = room.price || 0;

    console.log('📝 Creating booking with snapshot:', { 
      hotelName: hotel.name, 
      nights, 
      transactionId 
    });

    // 4. Create the formal booking record
    const booking = await Booking.create({
      userId: req.user._id,
      hotelId,
      roomId,
      hotelName: hotel.name,
      location: hotel.location || hotel.address || hotel.city || 'StayNow Property',
      roomType: room.type,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numGuests: numGuests || 1,
      nights,
      pricePerNight,
      totalPrice: totalPrice || 0,
      paymentMethod: paymentMethod || 'Online',
      transactionId,
      paymentStatus: 'paid',
      status: 'confirmed'
    });

    // 5. Async Post-Booking logic (Email & Notification)
    setTimeout(async () => {
      try {
        const full = await Booking.findById(booking._id).populate('userId');
        const invoice = await generateInvoice(full);
        
        // Email Template
        const html = getBookingTemplate({ 
          userName: full.userId.name, 
          hotelName: booking.hotelName, 
          roomType: booking.roomType, 
          checkIn: booking.checkInDate.toLocaleDateString(), 
          checkOut: booking.checkOutDate.toLocaleDateString(), 
          totalPrice: booking.totalPrice, 
          bookingId: booking._id 
        });

        await sendEmail(
          full.userId.email, 
          `Booking Confirmed: ${booking.hotelName} 🎉`, 
          html, 
          full.userId._id, 
          'booking', 
          [{ filename: `StayNow-Invoice-${booking._id}.pdf`, content: invoice }]
        );

        // In-App Notification
        await sendNotification({ 
          userId: full.userId._id, 
          title: "Booking Confirmed ✅", 
          message: `Your booking for ${booking.hotelName} is confirmed from ${booking.checkInDate.toLocaleDateString()} to ${booking.checkOutDate.toLocaleDateString()}. Confirmation email sent.`, 
          type: 'booking', 
          metaData: { bookingId: booking._id } 
        });
      } catch (err) { console.error('Post-booking notification failed:', err); }
    }, 100);

    res.status(201).json(booking);
  } catch (err) {
    console.error('🔥 Booking confirmation error:', err);
    res.status(500).json({ 
      message: 'Failed to finalize booking.',
      error: err.message,
      transactionId: req.body.transactionId
    });
  }
};

/**
 * @desc    Get user bookings
 */
const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).sort('-createdAt');
  res.json({ bookings, count: bookings.length });
};

/**
 * @desc    Cancel booking
 */
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Safety check: only customer or admin can cancel
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking successfully cancelled' });
  } catch (err) { res.status(500).json({ message: 'Cancellation failed' }); }
};

const getAllBookings = async (req, res) => {
  const all = await Booking.find({}).populate('userId', 'name email').sort('-createdAt');
  res.json(all);
};

module.exports = { 
  confirmAfterPayment,
  getUserBookings, 
  cancelBooking, 
  getAllBookings
};
