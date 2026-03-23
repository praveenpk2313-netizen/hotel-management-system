const express = require('express');
const router = express.Router();
const {
  confirmAfterPayment,
  getUserBookings,
  cancelBooking,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { manager } = require('../middleware/roleMiddleware');

// ─── User Routes ─────────────────────────────────────────────────────────────

// GET /api/bookings/user — Get current user's bookings
router.get('/user', protect, getUserBookings);

// POST /api/bookings/confirm-after-payment — Create booking after success payment
router.post('/confirm-after-payment', protect, confirmAfterPayment);

// DELETE /api/bookings/:id — Cancel booking
router.delete('/:id', protect, cancelBooking);

// ─── Admin/Manager Routes ────────────────────────────────────────────────────

// GET /api/bookings — Admin/Manager view all bookings
router.get('/', protect, manager, getAllBookings);

module.exports = router;
