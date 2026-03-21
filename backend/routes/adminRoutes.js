const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  deleteUser,
  toggleBlockUser,
  updateUserRole,
  getAllHotels,
  updateHotelStatus,
  deleteHotel,
  getAllBookings,
  cancelBooking,
  getAllPayments,
  getAllReviews,
  deleteReview,
  sendPromotion
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const adminOnly = authorize('admin');

// Dashboard
router.get('/stats', protect, adminOnly, getStats);

// User Management
router.get('/users', protect, adminOnly, getUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.put('/users/block/:id', protect, adminOnly, toggleBlockUser);
router.put('/users/role/:id', protect, adminOnly, updateUserRole);

// Hotel Management
router.get('/hotels', protect, adminOnly, getAllHotels);
router.put('/hotels/status/:id', protect, adminOnly, updateHotelStatus);
router.delete('/hotels/:id', protect, adminOnly, deleteHotel);

// Booking Management
router.get('/bookings', protect, adminOnly, getAllBookings);
router.put('/bookings/cancel/:id', protect, adminOnly, cancelBooking);

// Payment Management
router.get('/payments', protect, adminOnly, getAllPayments);

// Review Moderation
router.get('/reviews', protect, adminOnly, getAllReviews);
router.delete('/reviews/:id', protect, adminOnly, deleteReview);

// Promotions
router.post('/send-promotion', protect, adminOnly, sendPromotion);

module.exports = router;
