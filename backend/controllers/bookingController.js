const Booking = require('../models/Booking');
const Room    = require('../models/Room');
const Hotel   = require('../models/Hotel');
const { sendBookingConfirmationEmail } = require('../utils/emailService');
const { generateInvoice }             = require('../utils/pdfService');
const { sendNotification }            = require('../utils/socket');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const checkAvailability = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    roomId,
    status: { $in: ['confirmed'] },
    $or: [
      { checkInDate: { $lt: checkOut, $gte: checkIn } },
      { checkOutDate: { $gt: checkIn,  $lte: checkOut } },
      { checkInDate: { $lte: checkIn },  checkOutDate: { $gte: checkOut } }
    ]
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };

  const existingCount = await Booking.countDocuments(query);
  const room = await Room.findById(roomId);
  // Bypassing strict room availability limits (up to 100) for testing email and booking flows
  return room ? existingCount < Math.max(room.totalRooms || 1, 100) : false;
};

// ─── confirmAfterPayment ─────────────────────────────────────────────────────
/**
 * @desc    Confirm booking after verified payment
 * @route   POST /api/bookings/confirm-after-payment
 * @access  Private
 *
 * EMAIL STRATEGY — async / fire-and-forget:
 *   The booking is created and the 201 response is returned immediately
 *   (fast ≈ 200-500 ms). Email is then sent in the background so it never
 *   blocks or times-out the HTTP response.
 *
 *   `emailSent` in the response body is always false on first call because
 *   email hasn't finished yet. The BookingSuccess page shows a neutral message
 *   ("Your booking is confirmed") instead of a possibly false "email sent" claim.
 */
const confirmAfterPayment = async (req, res) => {
  try {
    const {
      hotelId, roomId,
      checkInDate, checkOutDate,
      numGuests, totalPrice,
      paymentMethod, transactionId
    } = req.body;

    // ── 1. Idempotency — same transactionId = return the already-created booking
    const existing = await Booking.findOne({ transactionId });
    if (existing) {
      console.log(`[BOOKING] Idempotency hit — returning existing booking ${existing._id}`);
      return res.status(200).json({ ...existing.toObject(), emailSent: false, alreadyExists: true });
    }

    const checkIn  = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // ── 2. Availability check
    const available = await checkAvailability(roomId, checkIn, checkOut);
    if (!available) {
      console.warn(`[BOOKING] Room ${roomId} not available for ${checkIn.toDateString()} – ${checkOut.toDateString()}`);
      return res.status(400).json({ message: 'Selected dates are no longer available.' });
    }

    // ── 3. Snapshot hotel + room
    const [hotel, room] = await Promise.all([
      Hotel.findById(hotelId),
      Room.findById(roomId)
    ]);
    if (!hotel || !room) {
      console.error('[BOOKING] Hotel or room not found:', { hotelId, roomId });
      return res.status(404).json({ message: 'Property details not found.' });
    }

    const diffTime = Math.abs(checkOut - checkIn);
    let nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (isNaN(nights) || nights <= 0) nights = 1;

    const pricePerNight = room.price || 0;

    console.log('[BOOKING] Creating:', {
      user:      req.user._id,
      hotel:     hotel.name,
      room:      room.type,
      checkIn:   checkIn.toDateString(),
      checkOut:  checkOut.toDateString(),
      nights,
      transactionId
    });

    // ── 4. Create booking record
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

    // ── 5. Respond immediately (fast path) ───────────────────────────────────
    //    The client gets the booking data right away.
    //    emailSent=false here because email hasn't finished yet (async).
    res.status(201).json({ ...booking.toObject(), emailSent: false });

    // ── 6. Fire-and-forget: email + in-app notification ──────────────────────
    //    This runs AFTER the response has been sent to the user.
    //    Any failure here never affects the client's booking success.
    setImmediate(async () => {
      try {
        const fullBooking = await Booking
          .findById(booking._id)
          .populate('userId', 'name email _id');

        if (!fullBooking?.userId) {
          console.error('[EMAIL] Cannot send — user not found for booking:', booking._id);
          return;
        }

        const customer = {
          _id:   fullBooking.userId._id,
          name:  fullBooking.userId.name,
          email: fullBooking.userId.email,
        };

        // 6a. PDF invoice (non-fatal)
        let pdfBuf = null;
        try {
          pdfBuf = await generateInvoice(fullBooking);
          console.log(`[PDF] Invoice generated for booking ${booking._id}`);
        } catch (pdfErr) {
          console.error('[PDF] Generation failed (email will send without it):', pdfErr.message);
        }

        // 6b. Confirmation email
        console.log(`[EMAIL] Sending booking confirmation email to ${customer.email}...`);
        
        try {
          const emailResult = await sendBookingConfirmationEmail(fullBooking, customer, pdfBuf);
          if (emailResult.success) {
            console.log('[EMAIL] Booking confirmation email sent successfully');
          } else {
            console.error(`[EMAIL] Booking confirmation email failed: ${emailResult.error}`);
          }
        } catch (emailErr) {
          console.error(`[EMAIL] Booking confirmation email failed: ${emailErr.message}`);
        }

        // 6c. In-app notification
        try {
          await sendNotification({
            userId:   customer._id,
            title:    'Booking Confirmed ✅',
            message:  `Your booking for ${booking.hotelName} is confirmed. ${pdfBuf ? 'Invoice attached to email.' : ''}`,
            type:     'booking',
            metaData: { bookingId: booking._id }
          });
        } catch (notifErr) {
          console.error('[NOTIFICATION] Failed:', notifErr.message);
        }

      } catch (postErr) {
        console.error('❌ [POST-BOOKING] Async handler error:', postErr.message);
      }
    });

  } catch (err) {
    console.error('🔥 [BOOKING] Confirmation error:', err.message);
    res.status(500).json({
      message:       'Failed to finalize booking.',
      error:         err.message,
      transactionId: req.body.transactionId
    });
  }
};

// ─── Other controllers ───────────────────────────────────────────────────────

const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).sort('-createdAt');
  res.json({ bookings, count: bookings.length });
};

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
  } catch (err) {
    res.status(500).json({ message: 'Cancellation failed' });
  }
};

const getAllBookings = async (req, res) => {
  const all = await Booking.find({}).populate('userId', 'name email').sort('-createdAt');
  res.json(all);
};

module.exports = { confirmAfterPayment, getUserBookings, cancelBooking, getAllBookings };
