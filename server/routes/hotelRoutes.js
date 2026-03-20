const express = require('express');
const router = express.Router();
const { 
  getHotels, 
  getHotelById, 
  createHotel, 
  updateHotel, 
  deleteHotel, 
  getAllHotelsAdmin, 
  approveHotel,
  getHotelSuggestions
} = require('../controllers/hotelController');
const { protect } = require('../middleware/authMiddleware');
const { admin, manager } = require('../middleware/roleMiddleware');

router.route('/').get(getHotels).post(protect, manager, createHotel);
router.get('/suggestions', getHotelSuggestions);
router.route('/admin/all').get(protect, admin, getAllHotelsAdmin);
router.route('/:id/approve').put(protect, admin, approveHotel);
router.route('/:id')
  .get(getHotelById)
  .put(protect, manager, updateHotel)
  .delete(protect, manager, deleteHotel);

module.exports = router;
