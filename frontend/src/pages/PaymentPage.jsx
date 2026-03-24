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
        theme: { color: "#C5A059" },
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
    <div className="bg-background-light min-h-screen pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 md:px-10 space-y-12 animate-fade-in">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-premium group relative overflow-hidden">
           {/* Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
           
           <div className="space-y-4 relative z-10">
              <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-gray-400 font-black text-[10px] uppercase tracking-[3px] hover:text-primary transition-colors mb-2"
              >
                 <ArrowLeft size={16} /> Return to Resort
              </button>
              <h1 className="text-4xl md:text-5xl font-serif text-secondary-dark font-black tracking-tight leading-none">
                 Secure <span className="text-primary italic">Checkout</span>
              </h1>
           </div>

           <div className="flex items-center gap-4 relative z-10">
              <div className="px-6 h-14 bg-emerald-50 rounded-2xl flex items-center gap-3 text-emerald-600 font-black text-[10px] uppercase tracking-[2px] border border-emerald-100">
                 <Lock size={16} /> Encrypted Gateway
              </div>
              <div className="hidden lg:flex px-6 h-14 bg-primary/10 rounded-2xl items-center gap-3 text-primary font-black text-[10px] uppercase tracking-[2px]">
                 <ShieldCheck size={18} /> Verified Vault
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           
           {/* Left: Operations (Col 7) */}
           <div className="lg:col-span-7 space-y-10">
              
              {/* Trip Audit */}
              <section className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-gray-50 shadow-premium space-y-10 group">
                 <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                    <h2 className="text-2xl font-serif text-secondary-dark font-black flex items-center gap-3">
                       <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-sm font-black">01</div>
                       Your Itinerary
                    </h2>
                    <button onClick={() => navigate(-1)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">Adjust Scope</button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                       <div className="flex items-center gap-4 group/item">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-200 group-hover/item:bg-primary group-hover/item:text-white transition-all">
                             <Calendar size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Temporal Window</p>
                             <p className="text-sm font-bold text-secondary-dark uppercase tracking-tight">{formatDate(bookingData.checkInDate)} — {formatDate(bookingData.checkOutDate)}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 group/item">
                          <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary border border-gray-200 group-hover/item:bg-primary group-hover/item:text-white transition-all">
                             <UserCheck size={20} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Guest Commitment</p>
                             <p className="text-sm font-bold text-secondary-dark uppercase tracking-tight">{bookingData.numGuests} Verified Guest{bookingData.numGuests > 1 ? 's' : ''}</p>
                          </div>
                       </div>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col justify-center space-y-3 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5">
                          <Moon size={100} />
                       </div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration Audit</p>
                       <p className="text-3xl font-black text-secondary-dark italic font-serif leading-none">
                          {nights} <span className="text-primary italic opacity-80">Nights</span>
                       </p>
                       <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                          <CheckCircle2 size={12} /> Flexible Policy Applied
                       </div>
                    </div>
                 </div>
              </section>

              {/* Dev Notice */}
              {MOCK_PAYMENT && (
                <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex items-center gap-6 animate-slide-up group">
                   <div className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-100 group-hover:rotate-12 transition-transform">
                      <Zap size={28} className="animate-pulse" />
                   </div>
                   <div className="space-y-1">
                      <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest">Protocol Intelligence: Simulation Active</h4>
                      <p className="text-sm text-amber-600 font-medium">This transaction cycle is a simulation. No financial settlement is required for heritage verification.</p>
                   </div>
                </div>
              )}

              {/* Step 2: Protocol Selection */}
              <section className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-gray-50 shadow-premium space-y-10 overflow-hidden">
                 <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                    <h2 className="text-2xl font-serif text-secondary-dark font-black flex items-center gap-3">
                       <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary text-sm font-black">02</div>
                       Settlement Protocol
                    </h2>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                       <Shield size={12} /> PCI Level 1
                    </div>
                 </div>

                 {error && (
                   <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-700 text-sm font-bold animate-shake">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm"><Info size={20} /></div>
                      {error}
                   </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stripe Choice */}
                    <button 
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 text-left space-y-4 relative group ${
                        paymentMethod === 'stripe' 
                        ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' 
                        : 'border-gray-100 bg-white hover:border-gray-300'
                      }`}
                    >
                       <div className="flex justify-between items-start">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                            paymentMethod === 'stripe' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-gray-50 text-gray-300 border-gray-200'
                          }`}>
                             <CreditCard size={24} />
                          </div>
                          {paymentMethod === 'stripe' && <CheckCircle2 size={24} className="text-primary animate-scale-in" />}
                       </div>
                       <div>
                          <h4 className={`text-lg font-bold transition-colors ${paymentMethod === 'stripe' ? 'text-secondary-dark' : 'text-gray-400'}`}>Global Card</h4>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">VISA / MASTERCARD / AMEX</p>
                       </div>
                       <div className="flex gap-2 group-hover:opacity-100 opacity-50 transition-opacity">
                          <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6 object-contain" alt="Visa" />
                          <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6 object-contain" alt="MC" />
                       </div>
                    </button>

                    {/* Razorpay Choice */}
                    <button 
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 text-left space-y-4 relative group ${
                        paymentMethod === 'razorpay' 
                        ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10' 
                        : 'border-gray-100 bg-white hover:border-gray-300'
                      }`}
                    >
                       <div className="flex justify-between items-start">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                            paymentMethod === 'razorpay' ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30' : 'bg-gray-50 text-gray-300 border-gray-200'
                          }`}>
                             <Zap size={24} />
                          </div>
                          {paymentMethod === 'razorpay' && <CheckCircle2 size={24} className="text-primary animate-scale-in" />}
                       </div>
                       <div>
                          <h4 className={`text-lg font-bold transition-colors ${paymentMethod === 'razorpay' ? 'text-secondary-dark' : 'text-gray-400'}`}>Instant Multi-Rail</h4>
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">UPI / NETBANKING / WALLET</p>
                       </div>
                       <div className="flex gap-2 group-hover:opacity-100 opacity-50 transition-opacity items-center">
                          <img src="https://razorpay.com/favicon.png" className="h-6 object-contain" alt="Razorpay" />
                          <span className="text-[9px] font-black text-secondary-dark/40 uppercase tracking-widest">RAZORPAY SECURE</span>
                       </div>
                    </button>
                 </div>

                 <div className="pt-10 border-t border-gray-50">
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
                      <div className="space-y-8">
                         <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Razorpay initiates a multi-rail sequence for instant validation.</p>
                         </div>
                         <button 
                           onClick={handleRazorpayCheckout}
                           disabled={loading}
                           className="w-full h-18 bg-secondary-dark text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[3px] shadow-2xl shadow-secondary/20 hover:bg-primary transition-all flex items-center justify-center gap-4 group active:scale-[0.98]"
                         >
                            {loading ? <Loader2 className="animate-spin text-primary" size={24} /> : <ShieldCheck size={24} className="text-primary group-hover:text-white transition-colors" />}
                            {loading ? 'Sychronizing...' : `Finalize ${formatCurrency(bookingData.totalPrice)}`}
                         </button>
                      </div>
                    )}
                 </div>
              </section>

              {/* Trust Section */}
              <div className="flex flex-wrap items-center justify-center gap-12 py-10 opacity-30 group grayscale hover:grayscale-0 transition-all duration-700">
                 <div className="flex items-center gap-3">
                    <ShieldCheck size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[3px]">SSL Encrypted</span>
                 </div>
                 <div className="w-px h-6 bg-gray-300 hidden md:block" />
                 <div className="flex items-center gap-3">
                    <Lock size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[3px]">Financial Covenant</span>
                 </div>
                 <div className="w-px h-6 bg-gray-300 hidden md:block" />
                 <div className="flex items-center gap-3">
                    <CheckCircle2 size={24} />
                    <span className="text-[10px] font-black uppercase tracking-[3px]">Guarantee Applied</span>
                 </div>
              </div>
           </div>

           {/* Right: Summary Hub (Col 5) */}
           <div className="lg:col-span-5 relative lg:sticky lg:top-10 space-y-10">
              <div className="bg-secondary-dark rounded-[4rem] shadow-premium-dark overflow-hidden group">
                 
                 {/* Visual Media */}
                 <div className="relative h-72 overflow-hidden">
                    <img 
                      src={hotel.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[4s]" 
                      alt="Hotel" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary-dark/10 to-transparent" />
                    <div className="absolute top-8 left-8">
                       <div className="px-4 py-1.5 bg-primary/20 backdrop-blur-xl border border-white/20 rounded-full text-primary font-black text-[9px] uppercase tracking-[3px] flex items-center gap-2">
                          <Award size={12} /> Heritage Elite
                       </div>
                    </div>
                 </div>

                 {/* Intellectual Info */}
                 <div className="p-10 md:p-14 space-y-10 text-white relative z-10">
                    <div className="space-y-3">
                       <h3 className="text-3xl font-serif font-black tracking-tight leading-none truncate group-hover:text-primary transition-all">
                          {hotel.name}
                       </h3>
                       <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-widest">
                          <MapPin size={16} className="text-primary" /> {hotel.location || hotel.city}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2 border-y border-white/5 py-10">
                       <div className="flex justify-between items-center group/line">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/line:text-primary transition-colors">Suite Specification</p>
                          <p className="text-sm font-bold tracking-tight">{selectedRoom?.type || 'Luxury Suite'}</p>
                       </div>
                       <div className="flex justify-between items-center group/line">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/line:text-primary transition-colors">Global Rate / Night</p>
                          <p className="text-sm font-bold tracking-tight">{formatCurrency(selectedRoom?.price)}</p>
                       </div>
                       <div className="flex justify-between items-center group/line">
                          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover/line:text-primary transition-colors">Temporal Span</p>
                          <p className="text-sm font-bold tracking-tight italic text-primary font-serif">{nights} Nights</p>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="flex justify-between items-end">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Investment</p>
                             <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-[2px]">Taxes & Fees Applied</p>
                          </div>
                          <p className="text-5xl font-black text-primary font-serif italic tracking-tighter leading-none">
                             {formatCurrency(bookingData.totalPrice)}
                          </p>
                       </div>
                       
                       <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center gap-4 group/support">
                          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary border border-white/10 group-hover/support:rotate-12 transition-transform">
                             <Sparkles size={24} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Elite Covenant</p>
                             <p className="text-xs font-medium text-white/60">Includes priority concierge response.</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>

      <style>{`
        @keyframes scale-in { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-right { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-right { animation: slide-right 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
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
      onError(err.response?.data?.message || 'Protocol synchronization failure. Please audit and retry.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="space-y-4">
        <label className="text-[10px] font-black text-secondary-dark uppercase tracking-[3px] ml-1">Card Intelligence</label>
        <div className="bg-gray-50 p-6 rounded-[2rem] border-2 border-gray-100 focus-within:border-primary focus-within:bg-white transition-all shadow-sm">
          <CardElement options={{
            style: {
              base: {
                fontSize: '16px',
                fontFamily: "'Outfit', sans-serif",
                color: '#0F172A',
                letterSpacing: '0.025em',
                '::placeholder': { color: '#94A3B8' },
              },
              invalid: { color: '#ef4444' }
            },
          }} />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe || loading}
        className="w-full h-18 bg-secondary-dark text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[3px] shadow-2xl shadow-secondary/20 hover:bg-primary transition-all flex items-center justify-center gap-4 group active:scale-[0.98]"
      >
        {loading ? <Loader2 className="animate-spin text-primary" size={24} /> : <Lock size={24} className="text-primary group-hover:text-white transition-colors" />}
        {loading ? 'Validating...' : `Secure Finalize ${formatCurrency(bookingData.totalPrice)}`}
      </button>
    </form>
  );
};

export default PaymentPage;
