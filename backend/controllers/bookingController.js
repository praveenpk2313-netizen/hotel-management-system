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

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const existingBookingsCount = await Booking.countDocuments(query);
  const room = await Room.findById(roomId);
  
  if (!room) return false;
  
  // A room is available if the number of active bookings during that period 
  // is less than the totalRooms available for that room type.
  return existingBookingsCount < (room.totalRooms || 1);
};

// @desc    Create new booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { hotelId, roomId, checkInDate, checkOutDate, totalPrice, numGuests, status, paymentStatus } = req.body;

    // 1. Basic Date Validation
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (checkIn < now) {
      return res.status(400).json({ message: 'Check-in date cannot be in the past' });
    }
    if (checkOut <= checkIn) {
      return res.status(400).json({ message: 'Check-out must be after check-in' });
    }

    // 2. Check Availability
    const isAvailable = await checkAvailability(roomId, checkIn, checkOut);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Room is not available for the selected dates' });
    }

    // 3. Create Booking
    const booking = new Booking({
      userId: req.user._id,
      hotelId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
      numGuests,
      status: status || 'pending',
      paymentStatus: paymentStatus || 'unpaid'
    });

    const createdBooking = await booking.save();

    // 4. Create Payment Record if marked as paid (for mock payments)
    if (paymentStatus === 'paid') {
      await Payment.create({
        userId: req.user._id,
        bookingId: createdBooking._id,
        amount: totalPrice,
        paymentStatus: 'paid',
        razorpayOrderId: 'MOCK_CB_' + createdBooking._id.toString().substr(-6).toUpperCase(),
        razorpayPaymentId: 'MOCK_PAY_' + createdBooking._id.toString().substr(-6).toUpperCase()
      });
    }

    // Notify admins for high-value bookings
    if (totalPrice > 500) {
      const io = req.app.get('io');
      if (io) {
        io.emit('adminNotification', {
          type: 'HIGH_VALUE_BOOKING',
          message: `Alert: High-value booking #${createdBooking._id.toString().substr(-6)} received (Value: $${totalPrice})!`,
          data: { id: createdBooking._id, amount: totalPrice }
        });
      }
    }

    // ─── Post-Booking Email Notification ────────────────────────────────────
    
    // Defer email sending to not block response
    setTimeout(async () => {
      try {
        const fullBooking = await Booking.findById(createdBooking._id)
          .populate('hotelId', 'name')
          .populate('roomId', 'type')
          .populate('userId', 'name email');

        if (fullBooking && fullBooking.userId?.email) {
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
            [{
              filename: `invoice-${fullBooking._id}.pdf`,
              content: invoiceBuffer
            }]
          );

          // Real-time Notification for Customer
          await sendNotification({
            userId: fullBooking.userId._id,
            title: "Booking Confirmed! 🏨",
            message: `Your stay at ${fullBooking.hotelId.name} has been confirmed.`,
            type: 'booking',
            metaData: { bookingId: fullBooking._id }
          });

          // Real-time Notification for Manager
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
    }, 100);

    res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Booking Error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during booking' });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId', 'name location city images')
      .populate('roomId', 'type price')
      .sort('-createdAt');
    res.json({
      bookings,
      count: bookings.length,
      userId: req.user._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// @desc    Modify booking dates
// @route   PUT /api/bookings/:id
const updateBooking = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, totalPrice } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization check
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Re-check availability excluding current booking
    const isAvailable = await checkAvailability(booking.roomId, checkIn, checkOut, booking._id);
    if (!isAvailable) {
      return res.status(400).json({ message: 'New dates are not available' });
    }

    booking.checkInDate = checkIn;
    booking.checkOutDate = checkOut;
    if (totalPrice) booking.totalPrice = totalPrice;
    booking.status = 'pending'; // Reset to pending if modified? Or keep status.

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking' });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization check
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // ─── Post-Cancellation Email Notification ────────────────────────────────
    
    setTimeout(async () => {
      try {
        const fullBooking = await Booking.findById(booking._id).populate('userId', 'name email');
        if (fullBooking && fullBooking.userId?.email) {
          const html = getCancellationTemplate({
            bookingId: fullBooking._id
          });

          await sendEmail(
            fullBooking.userId.email,
            "Booking Cancelled ❌",
            html,
            fullBooking.userId._id,
            'cancellation'
          );

          // Notify Customer
          await sendNotification({
            userId: fullBooking.userId._id,
            title: "Trip Cancelled",
            message: `Your booking #${fullBooking._id.toString().substr(-6)} has been cancelled.`,
            type: 'cancellation',
            metaData: { bookingId: fullBooking._id }
          });

          // Notify Manager
          const hotel = await Hotel.findById(fullBooking.hotelId);
          if (hotel && hotel.managerId) {
            await sendNotification({
              userId: hotel.managerId,
              title: "Booking Cancelled",
              message: `Reservation #${fullBooking._id.toString().substr(-6)} for ${hotel.name} was cancelled.`,
              type: 'cancellation',
              metaData: { bookingId: fullBooking._id }
            });
          }
        }
      } catch (err) {
        console.error('Post-cancellation notification failed:', err);
      }
    }, 100);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

// @desc    Get all bookings (Admin/Manager)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('userId', 'name email')
      .populate('hotelId', 'name')
      .populate('roomId', 'type');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings' });
  }
};

// @desc    Update booking status (Admin/Manager/Customer for self)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      // Allow only the owner or a manager/admin to update status
      // The original condition `req.user.role === 'customer' && booking.userId.toString() !== req.user._id.toString()`
      // was preventing customers from updating their own bookings.
      // The new condition allows customers to update their own bookings,
      // and managers/admins to update any booking.
      if (req.user.role === 'customer' && booking.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this booking' });
      }

      const oldStatus = booking.status;
      const oldPaymentStatus = booking.paymentStatus;
      if (status) booking.status = status;
      if (paymentStatus) booking.paymentStatus = paymentStatus;
      
      const updatedBooking = await booking.save();

      // IF PAYMENT IS MARKED AS PAID, ENSURE A PAYMENT RECORD EXISTS (for mock payments)
      if (paymentStatus === 'paid' && oldPaymentStatus !== 'paid') {
        const paymentExists = await Payment.findOne({ bookingId: booking._id });
        if (!paymentExists) {
          await Payment.create({
            userId: booking.userId,
            bookingId: booking._id,
            amount: booking.totalPrice,
            paymentStatus: 'paid',
            razorpayOrderId: 'MOCK_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            razorpayPaymentId: 'MOCK_PAY_' + Math.random().toString(36).substr(2, 9).toUpperCase()
          });
        }
      }

      // Notify user on status change (e.g. Confirmed)
      if (status && oldStatus !== status) {
        await sendNotification({
          userId: booking.userId,
          title: "Booking Status Updated",
          message: `Your booking status for ${booking._id.toString().substr(-6)} is now: ${status.toUpperCase()}`,
          type: 'booking',
          metaData: { bookingId: booking._id, status }
        });
      }

      res.json(updatedBooking);
    } else {
      res.status(404).json({ message: 'Booking not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating status' });
  }
};

module.exports = { 
  createBooking, 
  getUserBookings, 
  updateBooking, 
  cancelBooking, 
  getAllBookings, 
  updateBookingStatus 
};
