const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Hotel',
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Booking',
      unique: true, // One review per booking
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    managerReply: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Static method to get avg rating and save to Hotel
reviewSchema.statics.getAverageRating = async function(hotelId) {
  const stats = await this.aggregate([
    {
      $match: { hotelId }
    },
    {
      $group: {
        _id: '$hotelId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    if (stats.length > 0) {
      await mongoose.model('Hotel').findByIdAndUpdate(hotelId, {
        averageRating: stats[0].averageRating.toFixed(1),
        totalReviews: stats[0].totalReviews
      });
    } else {
      await mongoose.model('Hotel').findByIdAndUpdate(hotelId, {
        averageRating: 0,
        totalReviews: 0
      });
    }
  } catch (error) {
    console.error(error);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.hotelId);
});

// Call getAverageRating after remove/delete
reviewSchema.post(/deleteOne|deleteMany|remove/, async function(doc) {
  await doc.constructor.getAverageRating(doc.hotelId);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
