const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['booking', 'payment', 'cancellation', 'system', 'promotion'],
      default: 'system',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metaData: {
      type: Object, // To store related IDs like bookingId, hotelId etc.
    }
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
