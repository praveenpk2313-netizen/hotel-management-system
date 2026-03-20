const express = require('express');
const router = express.Router();
const { 
  addReview, 
  getHotelReviews, 
  getReviewByBookingId,
  updateReview, 
  deleteReview, 
  replyToReview 
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { admin: adminOnly, manager: managerOnly } = require('../middleware/roleMiddleware');

router.post('/', protect, addReview);
router.get('/:hotelId', getHotelReviews);
router.get('/booking/:bookingId', protect, getReviewByBookingId);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, adminOnly, deleteReview);
router.post('/reply/:id', protect, managerOnly, replyToReview);

module.exports = router;
