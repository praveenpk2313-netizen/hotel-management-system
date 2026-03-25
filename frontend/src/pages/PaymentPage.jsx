import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
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
  Sparkles,
  Shield,
  Zap,
  Tag,
  Award,
  ArrowRight,
  UserCheck
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
    window.scrollTo(0, 0);
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
      const handlePaymentSuccess = (finalBooking) => {
        setLoading(false);
        navigate('/booking-success', { state: { booking: finalBooking } });
      };

      const handlePaymentError = (err, customHeader = 'Payment failed') => {
        setLoading(false);
        const data = err.response?.data;
        if (data?.code === 'DATES_UNAVAILABLE' || err.response?.status === 400) {
          const errMsg = data?.message || 'Selected dates are no longer available.';
          setError(errMsg);
          // Auto-redirect after some delay so they can read the error
          setTimeout(() => {
            navigate(`/hotel/${hotel._id}`, { state: { error: errMsg, initialData: bookingData } });
          }, 3000);
          return;
        }
        setError(data?.message || customHeader);
      };

      if (MOCK_PAYMENT) {
        // Log status to helper console if needed
        console.log("💳 MOCK MODE: Initiating demo payment sequence...");
        
        // Brief delay to simulate gateway initialization
        await new Promise(r => setTimeout(r, 1500));
        
        const bookingPayload = {
          ...bookingData,
          paymentMethod: paymentMethod === 'stripe' ? 'Mock/Stripe' : 'Mock/Pay',
          transactionId: paymentMethod === 'stripe' ? stripeTxnRef.current : razorpayTxnRef.current
        };

        try {
          const { data: finalBooking } = await confirmBookingAfterPayment(bookingPayload);
          console.log("✅ MOCK SUCCESS: Booking finalized in database.");
          handlePaymentSuccess(finalBooking);
        } catch (err) {
          console.error("❌ MOCK FAILED: Backend rejected mock transaction.", err);
          handlePaymentError(err);
        }
        return;
      }

      const { data: orderData } = await createRazorpayOrder({ amount: bookingData.totalPrice });
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PK UrbanStay Luxury",
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
            handlePaymentSuccess(finalBooking);
          } catch (err) {
            handlePaymentError(err, 'Verification failed. Contact support with PID: ' + response.razorpay_payment_id);
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#0891b2" },
        modal: { ondismiss: () => setLoading(false) }
      };

      if (!window.Razorpay) {
        setError('Payment gateway failed to load. Please check AdBlockers.');
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
    <div className="bg-slate-50 min-h-screen pb-24 pt-32 lg:pt-40 font-sans">
      <div className="container-booking space-y-10 animate-fade-in">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-slate-200">
           <div className="space-y-3">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors uppercase tracking-widest mb-2"
              >
                 <ArrowLeft size={16} /> Back to property
              </button>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Review and Pay</h1>
              <p className="text-slate-500 font-medium text-lg">Fast, secure and encrypted checkout</p>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="bg-emerald-50 px-5 py-3 rounded-xl border border-emerald-100 flex items-center gap-2 text-emerald-700 text-sm font-bold shadow-sm">
                 <Lock size={18} /> Secure checkout
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
           
           {/* Left Column: Guest info & Payment */}
           <div className="lg:col-span-8 space-y-8">
              
              {/* Trip Summary Card */}
              <section className="bg-white rounded-[24px] border border-slate-200 p-8 space-y-8 shadow-sm">
                 <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <CheckCircle2 size={28} className="text-emerald-500" /> Confirm your details
                 </h2>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                    <div className="space-y-8">
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 border border-cyan-100 shadow-sm">
                             <Calendar size={24} />
                          </div>
                          <div>
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Dates</p>
                             <p className="text-base font-bold text-slate-900">{formatDate(bookingData.checkInDate)} — {formatDate(bookingData.checkOutDate)}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-cyan-50 rounded-2xl flex items-center justify-center text-cyan-600 border border-cyan-100 shadow-sm">
                             <Users size={24} />
                          </div>
                          <div>
                             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Guests</p>
                             <p className="text-base font-bold text-slate-900">{bookingData.numGuests} adult{bookingData.numGuests > 1 ? 's' : ''}</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                       <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Stay Duration</p>
                       <p className="text-3xl font-black text-slate-900">{nights} night{nights > 1 ? 's' : ''}</p>
                       <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg mt-2 inline-flex border border-emerald-100">
                          <CheckCircle2 size={14} /> Flexible Policy Applied
                       </div>
                    </div>
                 </div>
              </section>

              {/* Step 2: Protocol Selection */}
              <section className="bg-white rounded-[24px] border border-slate-200 p-8 space-y-8 shadow-sm">
                 <h2 className="text-2xl font-bold text-slate-900">How would you like to pay?</h2>

                 {error && (
                   <div className="p-5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 text-sm font-bold flex items-center gap-3">
                      <Info size={20} className="shrink-0" /> {error}
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <button 
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-6 rounded-2xl border-2 text-left space-y-5 transition-all outline-none ${
                        paymentMethod === 'stripe' ? 'border-cyan-500 bg-cyan-50/30' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                       <div className="flex justify-between items-center">
                          <div className={`p-3.5 rounded-xl flex items-center justify-center border shadow-sm transition-all ${paymentMethod === 'stripe' ? 'bg-cyan-600 text-white border-cyan-700' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                             <CreditCard size={24} />
                          </div>
                          {paymentMethod === 'stripe' && <CheckCircle2 size={24} className="text-cyan-600 drop-shadow-sm" />}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 text-lg">Debit or Credit Card</p>
                          <div className="flex gap-2 mt-2">
                             <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-5 opacity-90" alt="Visa" />
                             <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-5 opacity-90" alt="MC" />
                          </div>
                       </div>
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`p-6 rounded-2xl border-2 text-left space-y-5 transition-all outline-none ${
                        paymentMethod === 'razorpay' ? 'border-cyan-500 bg-cyan-50/30' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                       <div className="flex justify-between items-center">
                          <div className={`p-3.5 rounded-xl flex items-center justify-center border shadow-sm transition-all ${paymentMethod === 'razorpay' ? 'bg-cyan-600 text-white border-cyan-700' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                             <Zap size={24} />
                          </div>
                          {paymentMethod === 'razorpay' && <CheckCircle2 size={24} className="text-cyan-600 drop-shadow-sm" />}
                       </div>
                       <div>
                          <p className="font-bold text-slate-900 text-lg">Instant UPI / NetBanking</p>
                          <div className="flex items-center gap-2 mt-2 opacity-80">
                             <img src="https://razorpay.com/favicon.png" className="h-5" alt="Razorpay" />
                             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Razorpay Secure</span>
                          </div>
                       </div>
                    </button>
                 </div>

                 <div className="pt-8 border-t border-slate-100">
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
                      <div className="space-y-6">
                         <div className="bg-cyan-50/50 p-6 rounded-xl text-center border border-cyan-100">
                            <p className="text-sm font-bold text-slate-800 leading-relaxed">Pay instantly using UPI, Wallet or Bank Transfer with Razorpay's secure checkout.</p>
                         </div>
                         <button 
                           onClick={handleRazorpayCheckout}
                           disabled={loading}
                           className="w-full h-14 bg-cyan-600 text-white rounded-xl font-bold shadow-md hover:bg-cyan-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 text-lg"
                         >
                            {loading ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} />}
                            {loading ? 'Processing...' : `Pay ${formatCurrency(bookingData.totalPrice)}`}
                         </button>
                      </div>
                    )}
                 </div>
              </section>
           </div>

           {/* Right Column: Price Summary Sidebar */}
           <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
              <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm">
                 <div className="relative h-48">
                    <img 
                      src={hotel.images?.[0] || ""} 
                      className="w-full h-full object-cover" 
                      alt="Hotel" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 text-white">
                       <h3 className="font-bold text-xl truncate drop-shadow-md">{hotel.name}</h3>
                       <p className="text-sm flex items-center gap-1.5 opacity-90 mt-1"><MapPin size={14} /> {hotel.location}</p>
                    </div>
                 </div>

                 <div className="p-8 space-y-8">
                    <div className="space-y-4">
                       <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Price Details</h4>
                       <div className="space-y-4 text-base">
                          <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                             <span className="text-slate-600 font-medium">{selectedRoom?.type}</span>
                             <span className="font-bold text-slate-900">{formatCurrency(selectedRoom?.price)}</span>
                          </div>
                          <div className="flex justify-between items-center px-3">
                             <span className="text-slate-500 font-medium">Nights count</span>
                             <span className="font-bold text-slate-900">x {nights}</span>
                          </div>
                          <div className="flex justify-between items-center pt-4 border-t border-slate-200 mt-2 px-2">
                             <span className="text-slate-900 font-black text-xl">Total Amount</span>
                             <span className="text-3xl font-black text-slate-900">{formatCurrency(bookingData.totalPrice)}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-4 py-4 opacity-70">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <CheckCircle2 size={16} className="text-emerald-500" /> Secure Payment System
                 </div>
                 <div className="flex items-center gap-6 grayscale opacity-80">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-7" alt="Visa" />
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-7" alt="MC" />
                    <img src="https://razorpay.com/favicon.png" className="h-6" alt="Razorpay" />
                 </div>
              </div>
           </div>

        </div>
      </div>

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

    const handleStripeError = (err) => {
      setLoading(false);
      const data = err.response?.data;
      if (data?.code === 'DATES_UNAVAILABLE' || err.response?.status === 400) {
        const errMsg = data?.message || 'Selected dates are no longer available.';
        onError(errMsg);
        setTimeout(() => {
          navigate(`/hotel/${bookingData.hotelId}`, { state: { error: errMsg, initialData: bookingData } });
        }, 3000);
        return;
      }
      onError(data?.message || 'Payment processing failed.');
    };

    try {
      if (MOCK_PAYMENT) {
        setLoading(true);
        console.log("💳 STRIPE MOCK: Processing synthetic card info...");
        await new Promise(r => setTimeout(r, 2000));

        const payload = {
          ...bookingData,
          paymentMethod: 'Mock/Stripe',
          transactionId: stripeTxnId
        };
        try {
           const { data: finalBooking } = await confirmBookingAfterPayment(payload);
           console.log("✅ STRIPE MOCK SUCCESS: Confirmation stored.");
           setLoading(false);
           navigate('/booking-success', { state: { booking: finalBooking } });
        } catch (err) {
           console.error("❌ STRIPE MOCK FAILURE:", err);
           handleStripeError(err);
        }
        return;
      }

      if (!stripe || !elements) return;

      const { data: intentData } = await createStripeIntent({ amount: bookingData.totalPrice });
      const result = await stripe.confirmCardPayment(intentData.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: bookingData?.userName || 'Elite Guest' },
        }
      });

      if (result.error) {
         onError(result.error.message);
         setLoading(false);
      } else if (result.paymentIntent.status === 'succeeded') {
         try {
           const { data: finalBooking } = await confirmBookingAfterPayment({
             ...bookingData,
             paymentMethod: 'Stripe',
             transactionId: result.paymentIntent.id
           });
           navigate('/booking-success', { state: { booking: finalBooking } });
         } catch (err) {
           handleStripeError(err);
         }
      }
    } catch (err) {
      handleStripeError(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Card Details</label>
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 focus-within:border-cyan-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all shadow-inner">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                fontFamily: "'Inter', sans-serif",
                color: '#0f172a', /* slate-900 */
                '::placeholder': { color: '#94a3b8' }, /* slate-400 */
              },
              invalid: { color: '#ef4444' }
            },
          }} />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full h-14 bg-cyan-600 text-white rounded-xl font-bold shadow-md hover:bg-cyan-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 text-lg"
      >
        {loading ? <Loader2 className="animate-spin" size={24} /> : <Lock size={20} />}
        {loading ? 'Validating...' : `Pay ${formatCurrency(bookingData.totalPrice)}`}
      </button>
      <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
         <ShieldCheck size={16} className="text-emerald-500" /> Encrypted by Stripe.com
      </div>
    </form>
  );
};

export default PaymentPage;
