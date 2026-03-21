const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const { sendNotification } = require('../utils/socket');

// @desc    Add review after completed booking
// @route   POST /api/reviews
// @access  Private (User only)
const addReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to review this booking' });
    }

    // Validate booking status (Must be confirmed/paid)
    if (booking.status !== 'confirmed') {
       return res.status(400).json({ message: 'Reviews are only permitted for confirmed bookings.' });
    }

    const alreadyReviewed = await Review.findOne({ bookingId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    const review = await Review.create({
      userId: req.user._id,
      hotelId: booking.hotelId,
      bookingId,
      rating: Number(rating),
      comment
    });

    // Update booking flag
    booking.isReviewed = true;
    await booking.save();

    // Hotel rating is updated via Mongoose middleware in Review model

    // Notify Manager
    const hotel = await Hotel.findById(booking.hotelId);
    if (hotel && hotel.managerId) {
      await sendNotification({
        userId: hotel.managerId,
        title: "New Review ⭐️",
        message: `${req.user.name} left a ${rating}-star review for ${hotel.name}.`,
        type: 'system',
        metaData: { reviewId: review._id, hotelId: hotel._id }
      });
    }

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews for a hotel
// @route   GET /api/reviews/:hotelId
// @access  Public
const getHotelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hotelId: req.params.hotelId })
      .populate('userId', 'name avatar')
      .sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get review by Booking ID
// @route   GET /api/reviews/booking/:bookingId
// @access  Private
const getReviewByBookingId = async (req, res) => {
  try {
    const review = await Review.findOne({ bookingId: req.params.bookingId })
      .populate('userId', 'name avatar');
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review (user only)
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (review && review.userId.toString() === req.user._id.toString()) {
      review.rating = Number(rating) || review.rating;
      review.comment = comment || review.comment;
      
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found or unauthorized' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review (admin only)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      // Reset booking flag
      await Booking.findByIdAndUpdate(review.bookingId, { isReviewed: false });
      
      await review.deleteOne();
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Manager reply to review
// @route   POST /api/reviews/reply/:id
// @access  Private (Manager only)
const replyToReview = async (req, res) => {
  try {
    const { reply } = req.body;
    const review = await Review.findById(req.params.id).populate('hotelId');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.hotelId.managerId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to reply to this review' });
    }

    review.managerReply = reply;
    await review.save();

    // Notify User
    await sendNotification({
      userId: review.userId,
      title: "Manager Responded 📩",
      message: `The manager of ${review.hotelId.name} replied to your review.`,
      type: 'system',
      metaData: { reviewId: review._id, hotelId: review.hotelId._id }
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getHotelReviews,
  getReviewByBookingId,
  updateReview,
  deleteReview,
  replyToReview
};
