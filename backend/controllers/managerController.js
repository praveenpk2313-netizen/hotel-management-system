const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

// @desc    Get Manager Dashboard Stats
// @route   GET /api/manager/stats
const getManagerStats = async (req, res) => {
  try {
    const hotels = await Hotel.find({ managerId: req.user._id });
    const hotelIds = hotels.map(h => h._id);

    const roomsCount = await Room.countDocuments({ hotelId: { $in: hotelIds } });
    const bookings = await Booking.find({ hotelId: { $in: hotelIds } });
    
    const totalRevenue = bookings
      .filter(b => b.status !== 'cancelled' && b.paymentStatus === 'paid')
      .reduce((acc, curr) => acc + curr.totalPrice, 0);

    const recentBookings = await Booking.find({ hotelId: { $in: hotelIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email')
      .populate('hotelId', 'name');

    res.json({
      totalHotels: hotels.length,
      totalRooms: roomsCount,
      totalBookings: bookings.length,
      totalRevenue,
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Manager Analytics
// @route   GET /api/manager/analytics
const getAnalytics = async (req, res) => {
  try {
    const hotels = await Hotel.find({ managerId: req.user._id });
    const hotelIds = hotels.map(h => h._id);

    // Monthly Bookings & Revenue (last 6 months)
    const stats = await Booking.aggregate([
      {
        $match: {
          hotelId: { $in: hotelIds },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Hotel Management ────────────────────────────────────────────────────────

const getManagerHotels = async (req, res) => {
  const hotels = await Hotel.find({ managerId: req.user._id });
  res.json(hotels);
};

const createManagerHotel = async (req, res) => {
  const { name, location, description, address, city, amenities, images } = req.body;
  const hotel = new Hotel({
    name,
    location,
    description,
    address,
    city,
    amenities,
    images,
    managerId: req.user._id,
    isApproved: false
  });
  const savedHotel = await hotel.save();

  // Notify admins
  const io = req.app.get('io');
  if (io) {
    io.emit('adminNotification', {
      type: 'HOTEL_SUBMISSION',
      message: `New Property Submission: ${savedHotel.name} awaits approval.`,
      data: { id: savedHotel._id, name: savedHotel.name }
    });
  }

  res.status(201).json(savedHotel);
};

const updateManagerHotel = async (req, res) => {
  const hotel = await Hotel.findOne({ _id: req.params.id, managerId: req.user._id });
  if (hotel) {
    hotel.name = req.body.name || hotel.name;
    hotel.location = req.body.location || hotel.location;
    hotel.description = req.body.description || hotel.description;
    hotel.amenities = req.body.amenities || hotel.amenities;
    hotel.images = req.body.images || hotel.images;
    const updatedHotel = await hotel.save();
    res.json(updatedHotel);
  } else {
    res.status(404).json({ message: 'Hotel not found or unauthorized' });
  }
};

const deleteManagerHotel = async (req, res) => {
  const hotel = await Hotel.findOne({ _id: req.params.id, managerId: req.user._id });
  if (hotel) {
    await hotel.deleteOne();
    res.json({ message: 'Hotel removed' });
  } else {
    res.status(404).json({ message: 'Hotel not found or unauthorized' });
  }
};

// ─── Room Management ─────────────────────────────────────────────────────────

const getManagerRooms = async (req, res) => {
  const hotels = await Hotel.find({ managerId: req.user._id });
  const hotelIds = hotels.map(h => h._id);
  const rooms = await Room.find({ hotelId: { $in: hotelIds } }).populate('hotelId', 'name');
  res.json(rooms);
};

const createManagerRoom = async (req, res) => {
  const { hotelId, type, price, capacity, totalRooms, amenities, images } = req.body;
  
  // Verify ownership of hotel
  const hotel = await Hotel.findOne({ _id: hotelId, managerId: req.user._id });
  if (!hotel) return res.status(401).json({ message: 'Unauthorized hotel selection' });

  const room = new Room({
    hotelId,
    type,
    price,
    capacity,
    totalRooms,
    amenities,
    images
  });
  const savedRoom = await room.save();
  res.status(201).json(savedRoom);
};

const updateManagerRoom = async (req, res) => {
  const room = await Room.findById(req.params.id).populate('hotelId');
  if (room && room.hotelId.managerId.toString() === req.user._id.toString()) {
    room.type = req.body.type || room.type;
    room.price = req.body.price || room.price;
    room.capacity = req.body.capacity || room.capacity;
    room.totalRooms = req.body.totalRooms || room.totalRooms;
    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } else {
    res.status(404).json({ message: 'Room not found or unauthorized' });
  }
};

const deleteManagerRoom = async (req, res) => {
  const room = await Room.findById(req.params.id).populate('hotelId');
  if (room && room.hotelId.managerId.toString() === req.user._id.toString()) {
    await room.deleteOne();
    res.json({ message: 'Room removed' });
  } else {
    res.status(404).json({ message: 'Room not found or unauthorized' });
  }
};

// ─── Booking Management ──────────────────────────────────────────────────────

const getManagerBookings = async (req, res) => {
  const hotels = await Hotel.find({ managerId: req.user._id });
  const hotelIds = hotels.map(h => h._id);

  const bookings = await Booking.find({ hotelId: { $in: hotelIds } })
    .populate('userId', 'name email')
    .populate('hotelId', 'name')
    .populate('roomId', 'type')
    .sort('-createdAt');
  
  res.json(bookings);
};

const updateManagerBookingStatus = async (req, res) => {
  const { status, paymentStatus } = req.body;
  const booking = await Booking.findById(req.params.id).populate('hotelId');

  if (booking && booking.hotelId.managerId.toString() === req.user._id.toString()) {
    const oldPaymentStatus = booking.paymentStatus;
    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;
    
    await booking.save();

    // Ensure Payment record exists if marked as paid (manual/mock)
    if (paymentStatus === 'paid' && oldPaymentStatus !== 'paid') {
      const paymentExists = await Payment.findOne({ bookingId: booking._id });
      if (!paymentExists) {
        await Payment.create({
          userId: booking.userId,
          bookingId: booking._id,
          amount: booking.totalPrice,
          paymentStatus: 'paid',
          razorpayOrderId: 'MOCK_MGR_' + booking._id.toString().substr(-6).toUpperCase(),
          razorpayPaymentId: 'MOCK_PAY_' + booking._id.toString().substr(-6).toUpperCase()
        });
      }
    }

    res.json(booking);
  } else {
    res.status(404).json({ message: 'Booking not found or unauthorized' });
  }
};

// ─── Review Management ────────────────────────────────────────────────────────

const getManagerReviews = async (req, res) => {
  const hotels = await Hotel.find({ managerId: req.user._id });
  const hotelIds = hotels.map(h => h._id);

  const reviews = await Review.find({ hotelId: { $in: hotelIds } })
    .populate('userId', 'name')
    .populate('hotelId', 'name')
    .sort('-createdAt');
  
  res.json(reviews);
};

module.exports = {
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
};
