const express = require('express');
const router = express.Router();
const {
  getManagerStats,
  getAnalytics,
  getManagerHotels,
  createManagerHotel,
  updateManagerHotel,
  deleteManagerHotel,
  getManagerRooms,
  createManagerRoom,
  updateManagerRoom,
  deleteManagerRoom,
  getManagerBookings,
  updateManagerBookingStatus,
  getManagerReviews
} = require('../controllers/managerController');
const { protect } = require('../middleware/authMiddleware');
const { manager } = require('../middleware/roleMiddleware');

// Stats & Analytics
router.get('/stats', protect, manager, getManagerStats);
router.get('/analytics', protect, manager, getAnalytics);

// Hotels
router.route('/hotels')
  .get(protect, manager, getManagerHotels)
  .post(protect, manager, createManagerHotel);

router.route('/hotels/:id')
  .put(protect, manager, updateManagerHotel)
  .delete(protect, manager, deleteManagerHotel);

// Rooms
router.route('/rooms')
  .get(protect, manager, getManagerRooms)
  .post(protect, manager, createManagerRoom);

router.route('/rooms/:id')
  .put(protect, manager, updateManagerRoom)
  .delete(protect, manager, deleteManagerRoom);

// Bookings
router.get('/bookings', protect, manager, getManagerBookings);
router.put('/bookings/:id/status', protect, manager, updateManagerBookingStatus);

// Reviews
router.get('/reviews', protect, manager, getManagerReviews);

module.exports = router;
