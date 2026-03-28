import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Mail, 
  Hotel as HotelIcon,
  Clock,
  Users,
  CreditCard,
  Copy,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  History,
  Plane,
  Hotel,
  Star as StarIcon
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  const emailSent = booking?.emailSent === true;

  useEffect(() => {
    if (!booking) {
      navigate('/customer/dashboard');
    }
    window.scrollTo(0, 0);
  }, [booking, navigate]);

  if (!booking) return null;

  const bookingRef = booking._id.substring(booking._id.length - 8).toUpperCase();
  const nights = Math.ceil(Math.abs(new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24));

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingRef);
  };

  return (
    <div className="bg-white min-h-screen pb-24 pt-32 px-4 md:px-0 relative">
      
      <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
        
        {/* Confirmation Hero */}
        <div className="flex flex-col items-center text-center space-y-6">
           <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-sm border border-emerald-100">
              <CheckCircle size={40} strokeWidth={2.5} />
           </div>

           <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">Payment Successful!</h1>
              <p className="text-gray-500 font-medium">
                 Your booking is confirmed. We've sent a confirmation email to your primary address.
              </p>
           </div>
           
           <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#003b95] rounded-full text-sm font-bold border border-blue-100">
              <ShieldCheck size={18} /> Booking Reference: <span className="text-[#006ce4] ml-1">#{bookingRef}</span>
           </div>
        </div>

        {/* Booking Card Detail */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden h-full flex flex-col md:flex-row">
           <div className="md:w-1/3 h-64 md:h-auto relative">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"
                className="w-full h-full object-cover"
                alt="Property"
              />
           </div>
           <div className="md:w-2/3 p-8 md:p-10 space-y-8">
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-gray-900 leading-tight">{booking.hotelName}</h2>
                 <p className="text-sm font-medium text-[#006ce4] flex items-center gap-2">
                    <MapPin size={16} /> {booking.location}
                 </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                 <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Check-in</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(booking.checkInDate)}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Check-out</p>
                    <p className="text-sm font-bold text-gray-900">{formatDate(booking.checkOutDate)}</p>
                 </div>
                 <div className="space-y-1 hidden md:block">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                    <p className="text-sm font-bold text-gray-900">{nights} night{nights > 1 ? 's' : ''}</p>
                 </div>
              </div>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pt-8 border-t border-gray-100">
                 <div className="space-y-1">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Room Reserved</p>
                    <p className="text-sm font-bold text-gray-900">{booking.roomType} Suite</p>
                    <p className="text-[11px] text-gray-500 font-medium">Property manages keys and check-in</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="text-3xl font-black text-gray-900 leading-none">{formatCurrency(booking.totalPrice)}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Email/Next Steps Status */}
        <div className={`p-6 rounded-lg border flex items-center gap-6 ${emailSent ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-blue-50 border-blue-100 text-[#003b95]'}`}>
           <div className={`w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm border ${emailSent ? 'text-emerald-500 border-emerald-100' : 'text-[#006ce4] border-blue-100'}`}>
              <Mail size={24} />
           </div>
           <div>
              <p className="text-sm font-bold leading-tight">
                 {emailSent 
                   ? "We've sent your confirmation and receipt to your email." 
                   : "Your booking details are saved! We're processing your confirmation email now."}
              </p>
              <p className="text-xs mt-1 font-medium opacity-80">You can also find all details under 'My Bookings' in your dashboard.</p>
           </div>
           {emailSent && <CheckCircle2 className="text-emerald-500 ml-auto hidden md:block" size={24} />}
        </div>

        {/* Review Encouragement */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 group">
           <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shrink-0 shadow-sm text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
              <StarIcon size={32} className="fill-current" />
           </div>
           <div className="space-y-2 text-center md:text-left flex-1 font-sans">
              <h3 className="text-xl font-black text-slate-900">Your opinion matters.</h3>
              <p className="text-sm text-slate-500 font-medium">Was the booking process seamless? Help us improve by providing a quick review of your experience.</p>
           </div>
           <button 
             onClick={() => navigate('/customer/dashboard', { state: { openReviewId: booking._id } })}
             className="px-8 h-12 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl active:scale-95"
           >
              Share Review
           </button>
        </div>

        {/* Action Center */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4">
           <button 
             onClick={() => navigate('/customer/dashboard')}
             className="w-full md:w-auto px-10 h-14 bg-[#006ce4] text-white font-bold rounded hover:bg-[#0052ad] transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/10 active:scale-95"
           >
              Manage My Bookings <History size={20} />
           </button>
           <Link 
             to="/" 
             className="w-full md:w-auto px-10 h-14 bg-white border-2 border-gray-200 text-[#006ce4] font-bold rounded hover:border-[#006ce4] transition-all flex items-center justify-center gap-3"
           >
              Back to Homepage <Plane size={20} className="rotate-45" />
           </Link>
        </div>

      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default BookingSuccess;
