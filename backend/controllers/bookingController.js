const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hotel = require('../models/Hotel');
const { sendBookingConfirmationEmail } = require('../utils/emailService');
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
    if (existing) {
      console.log(`[BOOKING] Idempotency hit — returning existing booking ${existing._id} for txn ${transactionId}`);
      return res.status(200).json({ ...existing.toObject(), emailSent: false });
    }

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

    console.log('📝 [BOOKING] Creating booking:', { 
      user: req.user._id,
      hotelName: hotel.name, 
      roomType: room.type,
      checkIn: checkIn.toDateString(),
      checkOut: checkOut.toDateString(),
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

    console.log(`✅ [BOOKING] Created successfully → ID: ${booking._id}`);

    // 5. Async Post-Booking: Email + In-App Notification (non-blocking)
    //    We pass emailSent back so the frontend can show the right message.
    let emailSent = false;

    // Fire-and-forget but capture result for response
    (async () => {
      try {
        // 5a. Populate user details for email
        const fullBooking = await Booking.findById(booking._id).populate('userId', 'name email _id');
        if (!fullBooking?.userId) {
          console.error('❌ [EMAIL] Cannot send — user not found for booking:', booking._id);
          return;
        }

        const customerUser = {
          _id:   fullBooking.userId._id,
          name:  fullBooking.userId.name,
          email: fullBooking.userId.email,
        };

        console.log(`📧 [EMAIL] Starting booking confirmation email for booking ${booking._id} → ${customerUser.email}`);

        // 5b. Try to generate PDF invoice (non-fatal if it fails)
        let pdfBuf = null;
        try {
          pdfBuf = await generateInvoice(fullBooking);
          console.log(`📄 [PDF] Invoice generated for booking ${booking._id}`);
        } catch (pdfErr) {
          console.error(`⚠️  [PDF] Invoice generation failed (email will send without PDF):`, pdfErr.message);
        }

        // 5c. Send confirmation email — always attempt, even if PDF failed
        const emailResult = await sendBookingConfirmationEmail(fullBooking, customerUser, pdfBuf);
        emailSent = emailResult.success;

        if (!emailResult.success) {
          console.error(`❌ [EMAIL] Confirmation email failed for booking ${booking._id}:`, emailResult.error);
        }

        // 5d. In-app notification
        try {
          await sendNotification({ 
            userId: customerUser._id, 
            title: 'Booking Confirmed ✅', 
            message: `Your booking for ${booking.hotelName} is confirmed from ${booking.checkInDate.toLocaleDateString()} to ${booking.checkOutDate.toLocaleDateString()}.${emailSent ? ' Confirmation email sent.' : ''}`, 
            type: 'booking', 
            metaData: { bookingId: booking._id } 
          });
        } catch (notifErr) {
          console.error('⚠️  [NOTIFY] In-app notification failed:', notifErr.message);
        }

      } catch (postErr) {
        console.error('❌ [POST-BOOKING] Unexpected error in post-booking logic:', postErr.message);
      }
    })();

    // Respond immediately with booking data + a best-effort emailSent flag
    // (emailSent will be false here since the email is sent async, 
    //  but we use a polling approach: see note below)
    // For a synchronous approach where we wait for email, use the sync path below:
    return res.status(201).json({ ...booking.toObject(), emailSent });

  } catch (err) {
    console.error('🔥 [BOOKING] Confirmation error:', err);
    res.status(500).json({ 
      message: 'Failed to finalize booking.',
      error: err.message,
      transactionId: req.body.transactionId
    });
  }
};

/**
 * @desc    Confirm booking AND wait for email result before responding
 * @route   POST /api/bookings/confirm-after-payment (sync email version)
 *
 * This alternative approach waits for the email before responding so the
 * frontend gets an accurate emailSent flag. Trade-off: slightly slower response.
 */
const confirmAfterPaymentSync = async (req, res) => {
  try {
    const { 
      hotelId, roomId, checkInDate, checkOutDate, 
      numGuests, totalPrice, paymentMethod, transactionId 
    } = req.body;

    // Idempotency
    const existing = await Booking.findOne({ transactionId });
    if (existing) {
      return res.status(200).json({ ...existing.toObject(), emailSent: false });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (!await checkAvailability(roomId, checkIn, checkOut)) {
      return res.status(400).json({ message: 'Selected dates are no longer available.' });
    }

    const hotel = await Hotel.findById(hotelId);
    const room  = await Room.findById(roomId);
    if (!hotel || !room) {
      return res.status(404).json({ message: 'Property details not found.' });
    }

    const diffTime = Math.abs(checkOut - checkIn);
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights <= 0) nights = 1;
    const pricePerNight = room.price || 0;

    console.log('📝 [BOOKING] Creating booking (sync):', { hotelName: hotel.name, nights, transactionId });

    const booking = await Booking.create({
      userId:        req.user._id,
      hotelId,
      roomId,
      hotelName:     hotel.name,
      location:      hotel.location || hotel.address || hotel.city || 'StayNow Property',
      roomType:      room.type,
      checkInDate:   checkIn,
      checkOutDate:  checkOut,
      numGuests:     numGuests || 1,
      nights,
      pricePerNight,
      totalPrice:    totalPrice || 0,
      paymentMethod: paymentMethod || 'Online',
      transactionId,
      paymentStatus: 'paid',
      status:        'confirmed'
    });

    console.log(`✅ [BOOKING] Created → ID: ${booking._id}`);

    // ── Synchronous email attempt (accurate emailSent flag) ──
    let emailSent = false;
    try {
      const fullBooking = await Booking.findById(booking._id).populate('userId', 'name email _id');
      const customerUser = {
        _id:   fullBooking.userId._id,
        name:  fullBooking.userId.name,
        email: fullBooking.userId.email,
      };

      console.log(`📧 [EMAIL] Sending confirmation to ${customerUser.email}`);

      let pdfBuf = null;
      try {
        pdfBuf = await generateInvoice(fullBooking);
        console.log(`📄 [PDF] Invoice generated`);
      } catch (pdfErr) {
        console.error(`⚠️  [PDF] Failed, sending email without PDF:`, pdfErr.message);
      }

      const emailResult = await sendBookingConfirmationEmail(fullBooking, customerUser, pdfBuf);
      emailSent = emailResult.success;

      // In-app notification (non-fatal)
      sendNotification({ 
        userId: customerUser._id, 
        title: 'Booking Confirmed ✅', 
        message: `Your booking for ${booking.hotelName} is confirmed.${emailSent ? ' Confirmation email sent.' : ''}`, 
        type: 'booking', 
        metaData: { bookingId: booking._id } 
      }).catch(e => console.error('⚠️  Notification failed:', e.message));

    } catch (emailErr) {
      console.error('❌ [EMAIL] Post-booking email error:', emailErr.message);
    }

    return res.status(201).json({ ...booking.toObject(), emailSent });

  } catch (err) {
    console.error('🔥 [BOOKING] Confirmation error:', err);
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
  confirmAfterPayment: confirmAfterPaymentSync,  // Use sync version for accurate emailSent flag
  getUserBookings, 
  cancelBooking, 
  getAllBookings
};
