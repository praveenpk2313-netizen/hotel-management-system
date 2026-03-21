const User = require('../models/User');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const { sendEmail, getPromotionTemplate } = require('../utils/emailService');
const { sendNotification } = require('../utils/socket');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const managerCount = await User.countDocuments({ role: 'manager' });
    const hotelCount = await Hotel.countDocuments();
    const bookingCount = await Booking.countDocuments();
    
    // Revenue logic (Calculate from paid bookings for consistency)
    const paidBookings = await Booking.find({ paymentStatus: 'paid', status: { $ne: 'cancelled' } });
    const totalRevenue = paidBookings.reduce((acc, b) => acc + b.totalPrice, 0);

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name')
      .populate('hotelId', 'name');

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5);

    // Chart Data (Aggregation)
    const monthlyStats = await Booking.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          bookings: { $sum: 1 },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 }
    ]);

    res.json({
      userCount,
      managerCount,
      hotelCount,
      bookingCount,
      totalRevenue,
      recentBookings,
      recentUsers,
      monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── User Management ─────────────────────────────────────────────────────────

const getUsers = async (req, res) => {
  const users = await User.find({}).sort('-createdAt');
  res.json(users);
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const toggleBlockUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const updateUserRole = async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);
  if (user) {
    user.role = role;
    await user.save();
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// ─── Hotel Approval ──────────────────────────────────────────────────────────

const getAllHotels = async (req, res) => {
  const hotels = await Hotel.find({}).populate('managerId', 'name email').sort('-createdAt');
  res.json(hotels);
};

const updateHotelStatus = async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  const hotel = await Hotel.findById(req.params.id);
  if (hotel) {
    hotel.isApproved = status === 'approved';
    await hotel.save();

    // Notify Manager
    if (hotel.managerId) {
      await sendNotification({
        userId: hotel.managerId,
        title: `Property ${status === 'approved' ? 'Approved ✅' : 'Status Updated'}`,
        message: `Your property "${hotel.name}" has been ${status === 'approved' ? 'approved and is now live' : 'updated'}.`,
        type: 'system',
        metaData: { hotelId: hotel._id, status }
      });
    }

    res.json(hotel);
  } else {
    res.status(404).json({ message: 'Hotel not found' });
  }
};

const deleteHotel = async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (hotel) {
    await hotel.deleteOne();
    res.json({ message: 'Hotel removed' });
  } else {
    res.status(404).json({ message: 'Hotel not found' });
  }
};

// ─── Booking Management ──────────────────────────────────────────────────────

const getAllBookings = async (req, res) => {
  const bookings = await Booking.find({})
    .populate('userId', 'name email')
    .populate('hotelId', 'name')
    .sort('-createdAt');
  res.json(bookings);
};

const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (booking) {
    booking.status = 'cancelled';
    await booking.save();
    res.json(booking);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
};

// ─── Payment Management ──────────────────────────────────────────────────────

const getAllPayments = async (req, res) => {
  try {
    // 1. Get all formal payment records
    const payments = await Payment.find({})
      .populate('userId', 'name email')
      .populate('bookingId', '_id')
      .sort('-createdAt');

    // 2. Get all bookings marked as paid
    const paidBookings = await Booking.find({ paymentStatus: 'paid' })
      .populate('userId', 'name email')
      .sort('-createdAt');

    // 3. Create a unified list (Avoid duplicates by checking matching IDs)
    const paymentBookingIds = new Set(payments.map(p => p.bookingId?._id?.toString()));
    
    // Convert paid bookings that don't have a Payment record into the format expected by the frontend
    const virtualPayments = paidBookings
      .filter(b => !paymentBookingIds.has(b._id.toString()))
      .map(b => ({
        _id: `VIRTUAL_${b._id}`,
        userId: b.userId,
        bookingId: b._id,
        amount: b.totalPrice,
        paymentStatus: 'paid',
        razorpayOrderId: 'MOCK_BK_' + b._id.toString().substr(-6).toUpperCase(),
        createdAt: b.createdAt
      }));

    // Combine and sort
    const unifiedPayments = [...payments, ...virtualPayments].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(unifiedPayments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── Review Moderation ───────────────────────────────────────────────────────

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate('userId', 'name')
    .populate('hotelId', 'name')
    .sort('-createdAt');
  res.json(reviews);
};

const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (review) {
    await Booking.findByIdAndUpdate(review.bookingId, { isReviewed: false });
    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } else {
    res.status(404).json({ message: 'Review not found' });
  }
};

// ─── Promotions ──────────────────────────────────────────────────────────────

const sendPromotion = async (req, res) => {
  const { title, content } = req.body;
  try {
    const users = await User.find({ role: 'customer', isBlocked: false });
    const html = getPromotionTemplate({ title, content });

    const emailPromises = users.map(user => 
      sendEmail(user.email, title, html, user._id, 'promotion')
    );

    await Promise.all(emailPromises);
    res.json({ message: `Promotion sent to ${users.length} users.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};
