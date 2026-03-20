import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  Loader2, 
  Calendar, 
  MapPin, 
  Users, 
  ShieldCheck, 
  ChevronRight,
  Info 
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  createBooking, 
  createRazorpayOrder, 
  verifyRazorpayPayment,
  createStripeIntent,
  verifyStripePayment,
  updateBookingStatus
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';

// PUBLIC TEST KEY for development purposes
// Replace with your own key from stripe.com/dashboard
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
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // Default to stripe

  const { bookingData, hotel, selectedRoom } = location.state || {};

  useEffect(() => {
    if (!bookingData || !hotel) {
      if (!success) navigate('/hotels');
    }
  }, [bookingData, hotel, navigate, success]);

  // Load Razorpay Script Dynamically to fix console warnings
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleRazorpayCheckout = async () => {
    setLoading(true);
    setError('');

    try {
      if (MOCK_PAYMENT) {
        // --- 1. HANDLE MOCK PAYMENT ---
        
        let targetBooking;
        if (bookingData?._id) {
          // If paying for an EXISTING booking (e.g. from History)
          const { data } = await updateBookingStatus(bookingData._id, { paymentStatus: 'paid', status: 'confirmed' });
          targetBooking = data;
        } else {
          // If it's a NEW booking from the Hotel Details page
          const { data } = await createBooking({ ...bookingData, paymentStatus: 'paid', status: 'confirmed' });
          targetBooking = data;
        }
        
        // --- 2. SIMULATE SUCCESS ---
        setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          // Auto-confirm the booking in logic already done by controller above
        }, 1500);
        return;
      }

      // --- 3. HANDLE REAL PAYMENT (SECURE BACKEND FLOW) ---
      
      // 1. Get or Create Booking
      let booking;
      if (bookingData?._id) {
        booking = bookingData;
      } else {
        const { data } = await createBooking({ ...bookingData, paymentStatus: 'unpaid' });
        booking = data;
      }

      // 2. Create Razorpay Order on Backend
      const { data: orderData } = await createRazorpayOrder(booking._id);
      
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PK UrbanStay",
        description: `Booking at ${hotel.name}`,
        image: hotel.images?.[0],
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            // 3. Verify Payment and Send Email (Backend does this)
            await verifyRazorpayPayment({ ...response, bookingId: booking._id });
            setSuccess(true);
            setLoading(false);
          } catch (err) {
            setError(err.response?.data?.message || 'Verification failed.');
            setLoading(false);
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#0f172a" },
        modal: { ondismiss: () => setLoading(false) }
      };

      if (!window.Razorpay) {
        setError('Payment gateway (Razorpay) failed to load. This might be due to Tracking Prevention or an AdBlocker. Please try disabling them for this site.');
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

  if (success) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="animate-fade" style={{ background: 'white', padding: '4rem', borderRadius: '32px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', maxWidth: '550px', width: '100%' }}>
           <div style={{ width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
             <CheckCircle size={48} color="#10b981" />
           </div>
           <h2 className="luxury-font" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#0f172a' }}>Payment Successful!</h2>
           <p style={{ color: '#64748b', fontSize: '1.2rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
             Thank you for choosing <strong>{hotel?.name}</strong>. Your luxury stay is now confirmed and your receipt has been emailed to you.
           </p>
           
           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             <button 
               onClick={() => navigate('/customer/dashboard')}
               className="payment-submit-btn"
               style={{ background: '#10b981', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}
             >
               Go to My Bookings
             </button>
             <button 
               onClick={() => navigate('/hotels')}
               style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer' }}
             >
               Back to Search
             </button>
           </div>
        </div>
      </div>
    );
  }

  if (!bookingData || !hotel) return null;

  return (
    <div className="animate-fade" style={{ background: '#fdfcfb', minHeight: '100vh', padding: '3rem 1rem 6rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', marginBottom: '2.5rem', fontWeight: '600', cursor: 'pointer' }}>
          <ArrowLeft size={20} /> Modify Selection
        </button>

        <h1 className="luxury-font" style={{ fontSize: '3rem', color: '#0f172a', marginBottom: '3rem' }}>Checkout & Payment</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '3.5rem' }}>
          {/* Left Column - Payment Selection */}
          <div>
            <div style={{ background: 'white', padding: '3rem', borderRadius: '28px', border: '1px solid #f1f5f9', boxShadow: '0 4px 30px rgba(0,0,0,0.03)', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CreditCard size={24} color="var(--primary)" /> Payment Method
              </h2>

              {/* Development Mode Config Warning */}
              {(import.meta.env.DEV || true) && (
                <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', color: '#92400e', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  <div style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Info size={16} /> Configuration Reminder
                  </div>
                  To enable live transactions, update the <strong>RAZORPAY</strong> and <strong>STRIPE</strong> keys in your <code>server/.env</code> file. The current keys are placeholders.
                </div>
              )}
              
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Info size={20} /> {error}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {/* Stripe Card Option */}
                <div 
                  onClick={() => setPaymentMethod('stripe')}
                  style={{ 
                    padding: '1.5rem', 
                    borderRadius: '16px', 
                    border: `2px solid ${paymentMethod === 'stripe' ? 'var(--primary)' : '#f1f5f9'}`,
                    background: paymentMethod === 'stripe' ? 'rgba(197, 160, 89, 0.05)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: '0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'stripe' ? 'var(--primary)' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === 'stripe' && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Credit / Debit Card</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Secure payment via Stripe</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                     <img src="https://img.icons8.com/color/48/000000/visa.png" style={{ height: '20px' }} alt="Visa" />
                     <img src="https://img.icons8.com/color/48/000000/mastercard.png" style={{ height: '20px' }} alt="MC" />
                  </div>
                </div>

                {/* Razorpay Option */}
                <div 
                  onClick={() => setPaymentMethod('razorpay')}
                  style={{ 
                    padding: '1.5rem', 
                    borderRadius: '16px', 
                    border: `2px solid ${paymentMethod === 'razorpay' ? 'var(--primary)' : '#f1f5f9'}`,
                    background: paymentMethod === 'razorpay' ? 'rgba(197, 160, 89, 0.05)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: '0.2s'
                  }}
                >
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${paymentMethod === 'razorpay' ? 'var(--primary)' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {paymentMethod === 'razorpay' && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Razorpay Secure</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>UPI, Wallets & NetBanking</p>
                    </div>
                  </div>
                  <img src="https://razorpay.com/favicon.png" style={{ height: '24px' }} alt="Razorpay" />
                </div>
              </div>

              {paymentMethod === 'stripe' ? (
                <div style={{ marginTop: '2.5rem' }}>
                  <Elements stripe={stripePromise}>
                    <StripeCheckoutForm 
                      bookingData={bookingData} 
                      onSuccess={() => setSuccess(true)} 
                      onError={setError}
                      setLoading={setLoading}
                      loading={loading}
                    />
                  </Elements>
                </div>
              ) : (
                <div style={{ marginTop: '3rem' }}>
                  <button 
                    onClick={handleRazorpayCheckout}
                    disabled={loading}
                    className="payment-submit-btn"
                  >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} />}
                    {loading ? 'Processing...' : `Confirm & Pay ${formatCurrency(bookingData.totalPrice)}`}
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '2rem', justifyContent: 'center', color: '#94a3b8' }}>
                 <div style={{ width: '40px', height: '1px', background: '#e2e8f0' }}></div>
                 <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '0.05em' }}>FULLY ENCRYPTED</span>
                 <div style={{ width: '40px', height: '1px', background: '#e2e8f0' }}></div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '0 1rem' }}>
               <img src="https://cdn.razorpay.com/static/assets/badge/badge-dark.png" style={{ height: '40px' }} alt="Razorpay Trusted" />
               <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                 Your data is protected by industry-standard encryption protocols. <br />
                 Payments processed by <strong>Razorpay</strong>.
               </p>
            </div>
          </div>

          {/* Right Column - Luxury Order Summary */}
          <div>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 4px 30px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', position: 'sticky', top: '100px' }}>
              <h3 className="luxury-font" style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Order Summary</h3>

              <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '2rem' }}>
                <img 
                  src={hotel.images?.[0] || "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=300"} 
                  alt={hotel.name} 
                  style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '20px' }} 
                />
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', color: '#0f172a' }}>{hotel.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    <MapPin size={16} /> {hotel.city}
                  </div>
                  <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '1rem' }}>
                     {selectedRoom?.type}
                  </div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '20px', margin: '2rem 0' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                   <div>
                     <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Check-in</div>
                     <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '1rem' }}>{formatDate(bookingData.checkInDate)}</div>
                   </div>
                   <ChevronRight size={20} color="#e2e8f0" style={{ alignSelf: 'center' }} />
                   <div style={{ textAlign: 'right' }}>
                     <div style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Check-out</div>
                     <div style={{ color: '#0f172a', fontWeight: '700', fontSize: '1rem' }}>{formatDate(bookingData.checkOutDate)}</div>
                   </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed #e2e8f0' }}>
                    <Users size={20} color="var(--primary)" />
                    <span style={{ fontWeight: '600', color: '#475569' }}>{bookingData.numGuests} Distinguished Guest(s)</span>
                 </div>
              </div>

              <div style={{ marginTop: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: '#475569', fontSize: '1rem' }}>
                  <span>Price per night</span>
                  <span>{formatCurrency(selectedRoom?.price)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', color: '#475569', fontSize: '1rem' }}>
                  <span>Nights</span>
                  <span>{Math.ceil(Math.abs(new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))} nights</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', color: '#10b981', fontSize: '1rem', fontWeight: '600' }}>
                  <span>Taxes & Premium Fees</span>
                  <span>Complimentary</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #f1f5f9', paddingTop: '2rem', marginTop: '2rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#64748b' }}>Amount Payable</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a' }}>{formatCurrency(bookingData.totalPrice)}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Price inclusive of all taxes</div>
                  </div>
                </div>
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

const StripeCheckoutForm = ({ bookingData, onSuccess, onError, setLoading, loading }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    onError('');

    try {
      if (MOCK_PAYMENT) {
          // 1. Create OR Update booking
          if (bookingData?._id) {
              await updateBookingStatus(bookingData._id, { paymentStatus: 'paid', status: 'confirmed' });
          } else {
              await createBooking({ ...bookingData, paymentStatus: 'paid', status: 'confirmed' });
          }
          
          setTimeout(() => {
              onSuccess();
              setLoading(false);
          }, 1500);
          return;
      }

      if (!stripe || !elements) {
          setError('Stripe not initialized');
          setLoading(false);
          return;
      }

      const { data: booking } = await createBooking({ ...bookingData, paymentStatus: 'unpaid' });
      const { data: intentData } = await createStripeIntent(booking._id);

      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: bookingData.hotelName || 'Valued Guest' },
        }
      });

      if (result.error) {
        onError(result.error.message);
        setLoading(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        await verifyStripePayment({ 
          paymentIntentId: result.paymentIntent.id, 
          bookingId: booking._id 
        });
        onSuccess();
        setLoading(false);
      }
    } catch (err) {
      onError(err.response?.data?.message || 'Stripe payment failed. Ensure STRIPE_SECRET_KEY is set in .env');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ 
        padding: '1.25rem', 
        border: '1.5px solid #e2e8f0', 
        borderRadius: '16px', 
        background: '#f8fafc',
        marginBottom: '2rem'
      }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1rem', color: '#475569' }}>
          CARD DETAILS
        </label>
        <div style={{ padding: '0.5rem 0' }}>
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#0f172a',
                '::placeholder': { color: '#94a3b8' },
              },
            },
          }} />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="payment-submit-btn"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} />}
        {loading ? 'Processing...' : `Confirm & Pay ${formatCurrency(bookingData.totalPrice)}`}
      </button>
    </form>
  );
};

const checkoutStyles = `
.payment-submit-btn {
  width: 100%; 
  background: #0f172a; 
  color: white; 
  padding: 1.5rem; 
  border-radius: 18px; 
  font-size: 1.25rem; 
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.4);
  transition: 0.3s;
}
.payment-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #1e293b;
}
.payment-submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }
@media (max-width: 1024px) {
  div[style*="gridTemplateColumns: 1fr 400px"] { grid-template-columns: 1fr !important; }
}
`;

export default PaymentPage;
