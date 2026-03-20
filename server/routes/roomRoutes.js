const express = require('express');
const router = express.Router();
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const { protect } = require('../middleware/authMiddleware');
const { manager } = require('../middleware/roleMiddleware');

router.route('/').post(protect, manager, createRoom);
router.route('/:id')
  .put(protect, manager, updateRoom)
  .delete(protect, manager, deleteRoom);
router.route('/hotel/:hotelId').get(getRooms);

module.exports = router;
