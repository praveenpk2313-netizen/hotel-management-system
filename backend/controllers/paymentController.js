const Razorpay = require('razorpay');
const Stripe = require('stripe');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { sendEmail, getPaymentTemplate } = require('../utils/emailService');
const { sendNotification } = require('../utils/socket');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { bookingId, amount: directAmount } = req.body;
    let amount;

    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });
      amount = Math.round(booking.totalPrice * 100);
    } else if (directAmount) {
      amount = Math.round(directAmount * 100);
    } else {
      return res.status(400).json({ message: 'Amount or Booking ID required' });
    }

    const options = {
      amount, 
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    if (process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id') {
       return res.status(400).json({ message: 'Razorpay keys are not configured. Please set them in server/.env' });
    }

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(error.statusCode || 500).json({ 
      message: error.description || error.message || 'Error creating Razorpay order' 
    });
  }
};

// @desc    Verify Payment Signature
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment Verified
      const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
      if (payment) {
        payment.paymentStatus = 'paid';
        payment.razorpayPaymentId = razorpay_payment_id;
        payment.razorpaySignature = razorpay_signature;
        await payment.save();
      }

      const booking = await Booking.findById(bookingId).populate('userId', 'name email').populate('hotelId', 'name');
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        await booking.save();

        // ─── Post-Payment Email Notification ────────────────────────────────
        
        setTimeout(async () => {
          try {
            if (booking.userId?.email) {
              const html = getPaymentTemplate({
                hotelName: booking.hotelId?.name,
                amount: booking.totalPrice,
                paymentId: razorpay_payment_id,
                bookingId: booking._id
              });

              await sendEmail(
                booking.userId.email,
                "Payment Successful 💳",
                html,
                booking.userId._id,
                'payment'
              );

              // Notify Customer
              await sendNotification({
                userId: booking.userId._id,
                title: "Payment Successful 💳",
                message: `Payment of ${booking.totalPrice} for ${booking.hotelId?.name} has been processed.`,
                type: 'payment',
                metaData: { paymentId: razorpay_payment_id, bookingId: booking._id }
              });
            }
          } catch (err) {
            console.error('Post-payment notification failed:', err);
          }
        }, 100);
      }

      res.status(200).json({ message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid signature sent!' });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
};

// @desc    Create Stripe PaymentIntent
// @route   POST /api/payments/create-stripe-intent
// @access  Private
const createStripeIntent = async (req, res) => {
  try {
    const { bookingId, amount: directAmount } = req.body;
    let amount;

    if (bookingId) {
       const booking = await Booking.findById(bookingId);
       if (!booking) return res.status(404).json({ message: 'Booking not found' });
       amount = Math.round(booking.totalPrice * 100);
    } else if (directAmount) {
       amount = Math.round(directAmount * 100);
    } else {
       return res.status(400).json({ message: 'Amount or Booking ID required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, 
      currency: 'inr',
      metadata: { userId: req.user._id.toString(), bookingId: bookingId || 'new' },
    });

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      amount: booking.totalPrice,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe Intent Error:', error);
    res.status(error.statusCode || 500).json({ 
      message: error.message || 'Error creating Stripe payment intent' 
    });
  }
};

// @desc    Verify Stripe Payment
// @route   POST /api/payments/verify-stripe
// @access  Private
const verifyStripePayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;
    
    // In a real app, confirm with Stripe API here
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (intent.status === 'succeeded') {
      const booking = await Booking.findById(bookingId).populate('userId', 'name email').populate('hotelId', 'name');
      
      if (booking) {
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        await booking.save();

        // Create Payment record
        await Payment.create({
          userId: req.user._id,
          bookingId: booking._id,
          amount: booking.totalPrice,
          paymentStatus: 'paid',
          razorpayOrderId: 'stripe',
          razorpayPaymentId: paymentIntentId
        });

        // Notifications
        setTimeout(async () => {
           try {
             if (booking.userId?.email) {
               const html = getPaymentTemplate({
                 hotelName: booking.hotelId?.name,
                 amount: booking.totalPrice,
                 paymentId: paymentIntentId,
                 bookingId: booking._id
               });
               await sendEmail(booking.userId.email, "Payment Successful 💳", html, booking.userId._id, 'payment');
               await sendNotification({
                 userId: booking.userId._id,
                 title: "Stripe Payment Successful 💳",
                 message: `Your payment of $${booking.totalPrice} has been processed via Stripe.`,
                 type: 'payment',
                 metaData: { paymentId: paymentIntentId, bookingId: booking._id }
               });
             }
           } catch (e) { console.error('Notify fail:', e); }
        }, 100);

        res.status(200).json({ message: 'Stripe payment verified successfully' });
      } else {
        res.status(404).json({ message: 'Booking not found' });
      }
    } else {
      res.status(400).json({ message: 'Stripe payment not successful' });
    }
  } catch (error) {
    console.error('Stripe Verify Error:', error);
    res.status(500).json({ message: 'Error verifying Stripe payment' });
  }
};

module.exports = { createOrder, verifyPayment, createStripeIntent, verifyStripePayment };
