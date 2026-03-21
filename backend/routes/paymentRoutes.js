const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, createStripeIntent, verifyStripePayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/create-stripe-intent', protect, createStripeIntent);
router.post('/verify-stripe', protect, verifyStripePayment);

module.exports = router;
