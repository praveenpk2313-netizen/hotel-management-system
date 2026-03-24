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
            navigate('/booking-success', { state: { booking: finalBooking } });
          } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Contact support with Payment ID: ' + response.razorpay_payment_id);
            setLoading(false);
          }
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#003b95" },
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
    <div className="bg-white min-h-screen pb-24 pt-32 lg:pt-40">
      <div className="container-booking space-y-10 animate-fade-in">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-gray-100">
           <div className="space-y-2">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-xs font-bold text-[#006ce4] hover:underline mb-2"
              >
                 <ArrowLeft size={16} /> Back to property
              </button>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">Review and Pay</h1>
              <p className="text-gray-500 font-medium">Fast, secure and encrypted checkout</p>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100 flex items-center gap-2 text-emerald-700 text-xs font-bold">
                 <Lock size={16} /> Secure checkout
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
           
           {/* Left Column: Guest info & Payment */}
           <div className="lg:col-span-8 space-y-10">
              
              {/* Trip Summary Card */}
              <section className="bg-white rounded-lg border border-gray-200 p-8 space-y-8 shadow-sm">
                 <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                    <CheckCircle2 size={24} className="text-emerald-500" /> Confirm your details
                 </h2>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-[#006ce4] border border-gray-200">
                             <Calendar size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dates</p>
                             <p className="text-sm font-bold text-gray-900">{formatDate(bookingData.checkInDate)} — {formatDate(bookingData.checkOutDate)}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-[#006ce4] border border-gray-200">
                             <Users size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Guests</p>
                             <p className="text-sm font-bold text-gray-900">{bookingData.numGuests} adult{bookingData.numGuests > 1 ? 's' : ''}</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 space-y-2">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stay Duration</p>
                       <p className="text-2xl font-black text-gray-900">{nights} night{nights > 1 ? 's' : ''}</p>
                       <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                          <CheckCircle2 size={12} /> Flexible Policy Applied
                       </div>
                    </div>
                 </div>
              </section>

              {/* Step 2: Protocol Selection */}
              <section className="bg-white rounded-lg border border-gray-200 p-8 space-y-8 shadow-sm">
                 <h2 className="text-xl font-black text-gray-900">How would you like to pay?</h2>

                 {error && (
                   <div className="p-4 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-sm font-bold flex items-center gap-2">
                      <Info size={18} /> {error}
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-6 rounded-lg border-2 text-left space-y-4 transition-all ${
                        paymentMethod === 'stripe' ? 'border-[#006ce4] bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                       <div className="flex justify-between items-center">
                          <div className={`p-3 rounded-lg flex items-center justify-center border ${paymentMethod === 'stripe' ? 'bg-[#006ce4] text-white' : 'bg-gray-50 text-gray-400'}`}>
                             <CreditCard size={20} />
                          </div>
                          {paymentMethod === 'stripe' && <CheckCircle2 size={24} className="text-[#006ce4]" />}
                       </div>
                       <div>
                          <p className="font-bold text-gray-900">Debit or Credit Card</p>
                          <div className="flex gap-1 mt-1 opacity-70">
                             <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-4" alt="Visa" />
                             <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-4" alt="MC" />
                          </div>
                       </div>
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`p-6 rounded-lg border-2 text-left space-y-4 transition-all ${
                        paymentMethod === 'razorpay' ? 'border-[#006ce4] bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                       <div className="flex justify-between items-center">
                          <div className={`p-3 rounded-lg flex items-center justify-center border ${paymentMethod === 'razorpay' ? 'bg-[#006ce4] text-white' : 'bg-gray-50 text-gray-400'}`}>
                             <Zap size={20} />
                          </div>
                          {paymentMethod === 'razorpay' && <CheckCircle2 size={24} className="text-[#006ce4]" />}
                       </div>
                       <div>
                          <p className="font-bold text-gray-900">Instant UPI / NetBanking</p>
                          <div className="flex items-center gap-1 mt-1 opacity-70">
                             <img src="https://razorpay.com/favicon.png" className="h-4" alt="Razorpay" />
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Razorpay Secure</span>
                          </div>
                       </div>
                    </button>
                 </div>

                 <div className="pt-8 border-t border-gray-100">
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
                         <div className="bg-blue-50/50 p-6 rounded-lg text-center border border-blue-100">
                            <p className="text-xs font-bold text-[#003b95] leading-relaxed">Pay instantly using UPI, Wallet or Bank Transfer with Razorpay's secure checkout.</p>
                         </div>
                         <button 
                           onClick={handleRazorpayCheckout}
                           disabled={loading}
                           className="w-full h-14 bg-[#006ce4] text-white rounded-lg font-bold shadow-lg shadow-blue-500/10 hover:bg-[#0052ad] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
                         >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                            {loading ? 'Processing...' : `Pay ${formatCurrency(bookingData.totalPrice)}`}
                         </button>
                      </div>
                    )}
                 </div>
              </section>
           </div>

           {/* Right Column: Price Summary Sidebar */}
           <div className="lg:col-span-4 lg:sticky lg:top-40 space-y-6">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
                 <div className="relative h-40">
                    <img 
                      src={hotel.images?.[0] || ""} 
                      className="w-full h-full object-cover" 
                      alt="Hotel" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                       <h3 className="font-bold text-lg truncate">{hotel.name}</h3>
                       <p className="text-xs flex items-center gap-1 opacity-80"><MapPin size={12} /> {hotel.location}</p>
                    </div>
                 </div>

                 <div className="p-6 space-y-6">
                    <div className="space-y-3">
                       <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Price Details</h4>
                       <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                             <span className="text-gray-500 font-medium">{selectedRoom?.type}</span>
                             <span className="font-bold text-gray-900">{formatCurrency(selectedRoom?.price)}</span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                             <span className="text-gray-500 font-medium">Nights count</span>
                             <span className="font-bold text-gray-900">x {nights}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2">
                             <span className="text-gray-900 font-black text-lg">Total Amount</span>
                             <span className="text-2xl font-black text-gray-900">{formatCurrency(bookingData.totalPrice)}</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-3 text-emerald-800 border border-emerald-100">
                       <Shield size={20} className="text-emerald-500" />
                       <p className="text-xs font-bold leading-tight">No hidden fees. Best price guaranteed.</p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col items-center gap-4 py-4 opacity-50">
                 <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Secure Payment System
                 </div>
                 <div className="flex gap-4 grayscale opacity-60">
                    <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" alt="Visa" />
                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6" alt="MC" />
                    <img src="https://razorpay.com/favicon.png" className="h-6" alt="Razorpay" />
                 </div>
              </div>
           </div>

        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
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
          billing_details: { name: bookingData?.userName || 'Elite Guest' },
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
      onError(err.response?.data?.message || 'Payment system error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-black text-gray-900 uppercase">Card Details</label>
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 focus-within:border-[#006ce4] focus-within:bg-white transition-all">
          <CardElement options={{
            style: {
              base: {
                fontSize: '15px',
                fontFamily: "'Outfit', sans-serif",
                color: '#111827',
                '::placeholder': { color: '#9CA3AF' },
              },
              invalid: { color: '#ef4444' }
            },
          }} />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full h-14 bg-[#006ce4] text-white rounded-lg font-bold shadow-lg shadow-blue-500/10 hover:bg-[#0052ad] transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={18} />}
        {loading ? 'Validating...' : `Pay ${formatCurrency(bookingData.totalPrice)}`}
      </button>
      <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
         <ShieldCheck size={14} className="text-emerald-500" /> Encrypted by Stripe.com
      </div>
    </form>
  );
};

export default PaymentPage;
