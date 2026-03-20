const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  updateBooking,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { manager, admin } = require('../middleware/roleMiddleware');

// ─── User Routes ─────────────────────────────────────────────────────────────

// GET /api/bookings/user — Get current user's bookings
router.get('/user', protect, getUserBookings);

// POST /api/bookings — Create a new booking
router.post('/', protect, createBooking);

// PUT /api/bookings/:id — Modify booking (dates/price)
router.put('/:id', protect, updateBooking);

// DELETE /api/bookings/:id — Cancel booking
router.delete('/:id', protect, cancelBooking);

// ─── Admin/Manager Routes ────────────────────────────────────────────────────

// GET /api/bookings — Admin/Manager view all bookings
router.get('/', protect, manager, getAllBookings);

// PUT /api/bookings/:id/status — Update status (confirmed/completed etc)
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
