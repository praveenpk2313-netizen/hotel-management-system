import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CreditCard, 
  Loader2, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldCheck, 
  ChevronRight,
  Info,
  Lock,
  CheckCircle2,
  Moon,
  BedDouble,
  Clock,
  Sparkles
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  confirmBookingAfterPayment,
  createRazorpayOrder, 
  verifyRazorpayPayment,
  createStripeIntent,
  verifyStripePayment,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';

// PUBLIC TEST KEY for development purposes
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

// Flag to temporarily bypass real payment gateways for testing
const MOCK_PAYMENT = true; 

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const razorpayTxnRef = useRef('MOCK_TRX_'  + Math.random().toString(36).substr(2, 9).toUpperCase());
  const stripeTxnRef   = useRef('MOCK_STRIPE_' + Math.random().toString(36).substr(2, 9).toUpperCase());

  const { bookingData, hotel, selectedRoom } = location.state || {};

  // Calculate nights
  const nights = bookingData ? Math.ceil(Math.abs(new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24)) : 0;

  useEffect(() => {
    if (!bookingData || !hotel) {
      if (!success) navigate('/hotels');
    }
  }, [bookingData, hotel, navigate, success]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleRazorpayCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      if (MOCK_PAYMENT) {
        const bookingPayload = {
          ...bookingData,
          paymentMethod:  'Mock/Razorpay',
          transactionId:  razorpayTxnRef.current
        };
        const { data: finalBooking } = await confirmBookingAfterPayment(bookingPayload);
        setLoading(false);
        navigate('/booking-success', { state: { booking: finalBooking } });
        return;
      }

      const { data: orderData } = await createRazorpayOrder({ amount: bookingData.totalPrice });
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StayNow Luxury",
        description: `Stay at ${hotel.name}`,
        image: hotel.images?.[0],
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const { data: finalBooking } = await confirmBookingAfterPayment({
              ...bookingData,
              paymentMethod: 'Razorpay',
              transactionId: response.razorpay_payment_id,
              razorpayData: response
            });
            navigate('/booking-success', { state: { booking: finalBooking } });
          } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Contact support with Payment ID: ' + response.razorpay_payment_id);
            setLoading(false);
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#0f172a" },
        modal: { ondismiss: () => setLoading(false) }
      };

      if (!window.Razorpay) {
        setError('Payment gateway (Razorpay) failed to load. Please disable AdBlockers.');
        setLoading(false);
        return;
      }
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment initiation failed.');
      setLoading(false);
    }
  };

  if (!bookingData || !hotel) return null;

  return (
    <div className="checkout animate-fade">
      <div className="checkout__container">

        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="checkout__back-btn">
          <ArrowLeft size={18} /> Back to hotel
        </button>

        {/* Page Title */}
        <div className="checkout__header">
          <h1 className="checkout__title">Confirm & Pay</h1>
          <div className="checkout__secure-badge">
            <Lock size={14} /> Secure Checkout
          </div>
        </div>

        <div className="checkout__grid">
          
          {/* ─── LEFT: Payment Section ──────────────────────────────── */}
          <div className="checkout__left">

            {/* Step 1: Your Trip */}
            <section className="checkout__section">
              <h2 className="checkout__section-title">
                <span className="checkout__step-number">1</span>
                Your Trip
              </h2>
              <div className="checkout__trip-details">
                <div className="checkout__trip-row">
                  <div>
                    <div className="checkout__trip-label">Dates</div>
                    <div className="checkout__trip-value">
                      {formatDate(bookingData.checkInDate)} — {formatDate(bookingData.checkOutDate)}
                    </div>
                  </div>
                  <button className="checkout__edit-btn" onClick={() => navigate(-1)}>Edit</button>
                </div>
                <div className="checkout__trip-row">
                  <div>
                    <div className="checkout__trip-label">Guests</div>
                    <div className="checkout__trip-value">{bookingData.numGuests} guest{bookingData.numGuests > 1 ? 's' : ''}</div>
                  </div>
                  <button className="checkout__edit-btn" onClick={() => navigate(-1)}>Edit</button>
                </div>
              </div>
            </section>

            {/* Development Notice */}
            {MOCK_PAYMENT && (
              <div className="checkout__dev-notice">
                <Info size={16} />
                <div>
                  <strong>Test Mode Active</strong>
                  <p>Payments are simulated. No real charges will be made.</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="checkout__error">
                <Info size={18} /> {error}
              </div>
            )}

            {/* Step 2: Payment Method */}
            <section className="checkout__section">
              <h2 className="checkout__section-title">
                <span className="checkout__step-number">2</span>
                Payment Method
              </h2>

              <div className="checkout__methods">
                {/* Stripe */}
                <div 
                  className={`checkout__method ${paymentMethod === 'stripe' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('stripe')}
                >
                  <div className="checkout__method-left">
                    <div className={`checkout__radio ${paymentMethod === 'stripe' ? 'checked' : ''}`}>
                      {paymentMethod === 'stripe' && <div className="checkout__radio-dot"></div>}
                    </div>
                    <div>
                      <div className="checkout__method-name">Credit or Debit Card</div>
                      <div className="checkout__method-desc">Visa, Mastercard, Amex</div>
                    </div>
                  </div>
                  <div className="checkout__card-icons">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="MC" />
                    <img src="https://img.icons8.com/color/48/000000/amex.png" alt="Amex" />
                  </div>
                </div>

                {/* Razorpay */}
                <div 
                  className={`checkout__method ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <div className="checkout__method-left">
                    <div className={`checkout__radio ${paymentMethod === 'razorpay' ? 'checked' : ''}`}>
                      {paymentMethod === 'razorpay' && <div className="checkout__radio-dot"></div>}
                    </div>
                    <div>
                      <div className="checkout__method-name">Razorpay</div>
                      <div className="checkout__method-desc">UPI, NetBanking, Wallets</div>
                    </div>
                  </div>
                  <img src="https://razorpay.com/favicon.png" style={{ height: '24px' }} alt="Razorpay" />
                </div>
              </div>

              {/* Payment Form */}
              <div className="checkout__pay-form">
                {paymentMethod === 'stripe' ? (
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm 
                      bookingData={bookingData} 
                      stripeTxnId={stripeTxnRef.current}
                      navigate={navigate}
                      onSuccess={() => setSuccess(true)} 
                      onError={setError}
                      setLoading={setLoading}
                      loading={loading}
                    />
                  </Elements>
                ) : (
                  <button 
                    onClick={handleRazorpayCheckout}
                    disabled={loading}
                    className="checkout__confirm-btn"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                    {loading ? 'Processing...' : `Confirm & Pay ${formatCurrency(bookingData.totalPrice)}`}
                  </button>
                )}
              </div>
            </section>

            {/* Trust Badges */}
            <div className="checkout__trust">
              <div className="checkout__trust-item">
                <ShieldCheck size={18} />
                <span>SSL Encrypted</span>
              </div>
              <div className="checkout__trust-divider"></div>
              <div className="checkout__trust-item">
                <Lock size={18} />
                <span>PCI Compliant</span>
              </div>
              <div className="checkout__trust-divider"></div>
              <div className="checkout__trust-item">
                <CheckCircle2 size={18} />
                <span>Money-back Guarantee</span>
              </div>
            </div>
          </div>

          {/* ─── RIGHT: Order Summary ──────────────────────────────── */}
          <div className="checkout__right">
            <div className="checkout__summary-card">
              
              {/* Hotel Preview */}
              <div className="checkout__hotel-preview">
                <img 
                  src={hotel.images?.[0] || "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=300"} 
                  alt={hotel.name}
                  className="checkout__hotel-img"
                />
                <div className="checkout__hotel-info">
                  <div className="checkout__hotel-type">{selectedRoom?.type || 'Room'}</div>
                  <h3 className="checkout__hotel-name">{hotel.name}</h3>
                  <div className="checkout__hotel-location">
                    <MapPin size={14} /> {hotel.city || hotel.location}
                  </div>
                  {hotel.averageRating > 0 && (
                    <div className="checkout__hotel-rating">
                      <span className="checkout__star">★</span> {hotel.averageRating?.toFixed(1)}
                      <span className="checkout__rating-count">({hotel.totalReviews} reviews)</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="checkout__summary-divider"></div>

              {/* Stay Details */}
              <div className="checkout__stay-details">
                <div className="checkout__stay-row">
                  <div className="checkout__stay-icon"><Calendar size={16} /></div>
                  <div>
                    <div className="checkout__stay-label">Check-in</div>
                    <div className="checkout__stay-value">{formatDate(bookingData.checkInDate)}</div>
                  </div>
                </div>
                <div className="checkout__stay-arrow">
                  <ChevronRight size={16} />
                  <span className="checkout__stay-nights">{nights} night{nights > 1 ? 's' : ''}</span>
                </div>
                <div className="checkout__stay-row">
                  <div className="checkout__stay-icon"><Calendar size={16} /></div>
                  <div>
                    <div className="checkout__stay-label">Check-out</div>
                    <div className="checkout__stay-value">{formatDate(bookingData.checkOutDate)}</div>
                  </div>
                </div>
              </div>

              <div className="checkout__summary-divider"></div>

              {/* Guests */}
              <div className="checkout__guest-info">
                <Users size={16} className="checkout__guest-icon" />
                <span>{bookingData.numGuests} Guest{bookingData.numGuests > 1 ? 's' : ''}</span>
              </div>

              <div className="checkout__summary-divider"></div>

              {/* Price Details */}
              <h4 className="checkout__price-title">Price Details</h4>
              <div className="checkout__price-rows">
                <div className="checkout__price-row">
                  <span>{formatCurrency(selectedRoom?.price)} × {nights} night{nights > 1 ? 's' : ''}</span>
                  <span>{formatCurrency((selectedRoom?.price || 0) * nights)}</span>
                </div>
                <div className="checkout__price-row checkout__price-row--green">
                  <span>Taxes & Fees</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="checkout__summary-divider checkout__summary-divider--thick"></div>

              {/* Total */}
              <div className="checkout__total">
                <span>Total (USD)</span>
                <span className="checkout__total-amount">{formatCurrency(bookingData.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{checkoutStyles}</style>
    </div>
  );
};

// ─── Stripe Checkout Form Component ──────────────────────────────────────────

const StripeCheckoutForm = ({ bookingData, stripeTxnId, navigate, onSuccess, onError, setLoading, loading }) => {
  const stripe   = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onError('');

    try {
      if (MOCK_PAYMENT) {
        const { data: finalBooking } = await confirmBookingAfterPayment({
          ...bookingData,
          paymentMethod: 'Mock/Stripe',
          transactionId: stripeTxnId
        });
        setLoading(false);
        navigate('/booking-success', { state: { booking: finalBooking } });
        return;
      }

      if (!stripe || !elements) return;

      const { data: intentData } = await createStripeIntent({ amount: bookingData.totalPrice });
      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: bookingData?.userName || 'Valued Guest' },
        }
      });

      if (result.error) {
        onError(result.error.message);
        setLoading(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        const { data: finalBooking } = await confirmBookingAfterPayment({
          ...bookingData,
          paymentMethod: 'Stripe',
          transactionId: result.paymentIntent.id
        });
        navigate('/booking-success', { state: { booking: finalBooking } });
      }
    } catch (err) {
      onError(err.response?.data?.message || 'Transaction failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="checkout__stripe-card">
        <label className="checkout__stripe-label">Card Information</label>
        <div className="checkout__stripe-element">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                fontFamily: "'Outfit', sans-serif",
                color: '#0f172a',
                '::placeholder': { color: '#9ca3af' },
              },
            },
          }} />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="checkout__confirm-btn"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
        {loading ? 'Processing...' : `Confirm & Pay ${formatCurrency(bookingData.totalPrice)}`}
      </button>
    </form>
  );
};

const checkoutStyles = `
  /* ── Page Layout ───────────────────────────────────────────────────────── */
  .checkout {
    background: #f7f7f7;
    min-height: 100vh;
    padding: 0 0 5rem;
  }
  .checkout__container {
    max-width: 1120px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  /* ── Back Button ───────────────────────────────────────────────────────── */
  .checkout__back-btn {
    background: none;
    border: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #0f172a;
    font-weight: 600;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 8px 0;
    margin-bottom: 1.5rem;
    font-family: 'Outfit', sans-serif;
    transition: color 0.2s;
  }
  .checkout__back-btn:hover {
    color: var(--primary);
  }

  /* ── Header ────────────────────────────────────────────────────────────── */
  .checkout__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #e5e7eb;
  }
  .checkout__title {
    font-size: 2rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    font-family: 'Playfair Display', serif;
  }
  .checkout__secure-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #059669;
    background: #ecfdf5;
    padding: 6px 14px;
    border-radius: 20px;
    border: 1px solid #a7f3d0;
  }

  /* ── Grid ───────────────────────────────────────────────────────────────── */
  .checkout__grid {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 3rem;
    align-items: start;
  }

  /* ── Left Column ───────────────────────────────────────────────────────── */
  .checkout__section {
    background: white;
    border-radius: 16px;
    border: 1px solid #e5e7eb;
    padding: 28px;
    margin-bottom: 20px;
  }
  .checkout__section-title {
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 24px 0;
    font-family: 'Playfair Display', serif;
  }
  .checkout__step-number {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #0f172a;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: 'Outfit', sans-serif;
    flex-shrink: 0;
  }

  /* ── Trip Details ──────────────────────────────────────────────────────── */
  .checkout__trip-details {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .checkout__trip-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #f3f4f6;
  }
  .checkout__trip-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .checkout__trip-label {
    font-size: 0.9rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 2px;
  }
  .checkout__trip-value {
    font-size: 0.88rem;
    color: #6b7280;
  }
  .checkout__edit-btn {
    background: none;
    border: none;
    color: #0f172a;
    font-weight: 700;
    font-size: 0.88rem;
    text-decoration: underline;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    font-family: 'Outfit', sans-serif;
    transition: all 0.15s;
  }
  .checkout__edit-btn:hover {
    background: #f3f4f6;
  }

  /* ── Dev Notice ────────────────────────────────────────────────────────── */
  .checkout__dev-notice {
    background: #fffbeb;
    border: 1px solid #fde68a;
    border-radius: 12px;
    padding: 14px 18px;
    margin-bottom: 20px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 0.85rem;
    color: #92400e;
  }
  .checkout__dev-notice strong {
    display: block;
    margin-bottom: 2px;
    font-size: 0.88rem;
  }
  .checkout__dev-notice p {
    margin: 0;
    line-height: 1.4;
  }
  .checkout__dev-notice svg {
    margin-top: 2px;
    flex-shrink: 0;
  }

  /* ── Error ──────────────────────────────────────────────────────────────── */
  .checkout__error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 14px 18px;
    border-radius: 12px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.88rem;
    font-weight: 500;
  }

  /* ── Payment Methods ───────────────────────────────────────────────────── */
  .checkout__methods {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }
  .checkout__method {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    border: 1.5px solid #e5e7eb;
    border-radius: 14px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }
  .checkout__method:hover {
    border-color: #d1d5db;
  }
  .checkout__method.active {
    border-color: #0f172a;
    background: #fafafa;
    box-shadow: 0 0 0 1px #0f172a;
  }
  .checkout__method-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .checkout__radio {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid #d1d5db;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.15s;
    flex-shrink: 0;
  }
  .checkout__radio.checked {
    border-color: #0f172a;
  }
  .checkout__radio-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #0f172a;
  }
  .checkout__method-name {
    font-weight: 700;
    font-size: 0.95rem;
    color: #0f172a;
    margin-bottom: 1px;
  }
  .checkout__method-desc {
    font-size: 0.82rem;
    color: #9ca3af;
  }
  .checkout__card-icons {
    display: flex;
    gap: 6px;
  }
  .checkout__card-icons img {
    height: 22px;
  }

  /* ── Stripe Card ───────────────────────────────────────────────────────── */
  .checkout__stripe-card {
    margin-bottom: 20px;
  }
  .checkout__stripe-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    color: #374151;
    margin-bottom: 10px;
  }
  .checkout__stripe-element {
    padding: 16px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    background: #fafafa;
    transition: border-color 0.2s;
  }
  .checkout__stripe-element:focus-within {
    border-color: #0f172a;
    background: white;
  }

  /* ── Confirm Button ────────────────────────────────────────────────────── */
  .checkout__confirm-btn {
    width: 100%;
    padding: 18px 24px;
    background: linear-gradient(135deg, #c5a059 0%, #d4b06a 50%, #c5a059 100%);
    background-size: 200% auto;
    color: white;
    border: none;
    border-radius: 14px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(197, 160, 89, 0.35);
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.01em;
  }
  .checkout__confirm-btn:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(197, 160, 89, 0.45);
  }
  .checkout__confirm-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .checkout__confirm-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  /* ── Trust Badges ──────────────────────────────────────────────────────── */
  .checkout__trust {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 20px 0;
    margin-top: 8px;
  }
  .checkout__trust-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    color: #9ca3af;
  }
  .checkout__trust-item svg {
    color: #d1d5db;
  }
  .checkout__trust-divider {
    width: 1px;
    height: 16px;
    background: #e5e7eb;
  }

  /* ── Right Column: Summary Card ────────────────────────────────────────── */
  .checkout__summary-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    position: sticky;
    top: 2rem;
  }

  /* ── Hotel Preview ─────────────────────────────────────────────────────── */
  .checkout__hotel-preview {
    display: flex;
    gap: 16px;
    margin-bottom: 4px;
  }
  .checkout__hotel-img {
    width: 130px;
    height: 110px;
    object-fit: cover;
    border-radius: 12px;
    flex-shrink: 0;
  }
  .checkout__hotel-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0;
  }
  .checkout__hotel-type {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
  }
  .checkout__hotel-name {
    font-size: 1.05rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 6px 0;
    line-height: 1.3;
    font-family: 'Playfair Display', serif;
  }
  .checkout__hotel-location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.82rem;
    color: #6b7280;
    margin-bottom: 6px;
  }
  .checkout__hotel-rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.82rem;
    font-weight: 600;
    color: #0f172a;
  }
  .checkout__star {
    color: var(--primary);
  }
  .checkout__rating-count {
    color: #9ca3af;
    font-weight: 400;
  }

  /* ── Dividers ──────────────────────────────────────────────────────────── */
  .checkout__summary-divider {
    height: 1px;
    background: #f3f4f6;
    margin: 20px 0;
  }
  .checkout__summary-divider--thick {
    background: #e5e7eb;
  }

  /* ── Stay Details ──────────────────────────────────────────────────────── */
  .checkout__stay-details {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .checkout__stay-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }
  .checkout__stay-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: #6b7280;
  }
  .checkout__stay-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin-bottom: 1px;
  }
  .checkout__stay-value {
    font-size: 0.85rem;
    font-weight: 600;
    color: #0f172a;
  }
  .checkout__stay-arrow {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    color: #d1d5db;
    flex-shrink: 0;
  }
  .checkout__stay-nights {
    font-size: 0.65rem;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    white-space: nowrap;
  }

  /* ── Guest Info ────────────────────────────────────────────────────────── */
  .checkout__guest-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #374151;
  }
  .checkout__guest-icon {
    color: #6b7280;
  }

  /* ── Price Details ─────────────────────────────────────────────────────── */
  .checkout__price-title {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 16px 0;
    font-family: 'Playfair Display', serif;
  }
  .checkout__price-rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .checkout__price-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #4b5563;
  }
  .checkout__price-row span:first-child {
    text-decoration: underline;
    cursor: help;
  }
  .checkout__price-row--green {
    color: #059669;
  }
  .checkout__price-row--green span:first-child {
    text-decoration: none;
  }

  /* ── Total ──────────────────────────────────────────────────────────────── */
  .checkout__total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.05rem;
    font-weight: 700;
    color: #0f172a;
  }
  .checkout__total-amount {
    font-size: 1.3rem;
    font-weight: 800;
  }

  /* ── Responsive ────────────────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .checkout__grid {
      grid-template-columns: 1fr !important;
    }
    .checkout__right {
      order: -1;
    }
    .checkout__summary-card {
      position: static;
    }
  }
  @media (max-width: 640px) {
    .checkout__container {
      padding: 1rem;
    }
    .checkout__title {
      font-size: 1.5rem;
    }
    .checkout__section {
      padding: 20px 18px;
      border-radius: 14px;
    }
    .checkout__hotel-preview {
      flex-direction: column;
    }
    .checkout__hotel-img {
      width: 100%;
      height: 160px;
    }
    .checkout__stay-details {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    .checkout__stay-arrow {
      flex-direction: row;
      gap: 8px;
    }
    .checkout__trust {
      flex-direction: column;
      gap: 12px;
    }
    .checkout__trust-divider {
      display: none;
    }
    .checkout__header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
    }
    .checkout__secure-badge {
      align-self: flex-start;
    }
  }
`;

export default PaymentPage;
