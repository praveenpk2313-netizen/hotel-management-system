import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Mail, 
  Hotel,
  Clock,
  Users,
  CreditCard,
  Copy,
  ExternalLink,
  Sparkles,
  Award,
  Zap,
  ShieldCheck,
  Globe,
  Star,
  ArrowUpRight,
  History
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
    <div className="bg-background-light min-h-screen pb-24 pt-12 px-4 md:px-0 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-primary/5 rounded-full blur-[120px] -mt-40 -z-10" />
      
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        
        {/* Celebratory Hero */}
        <div className="text-center space-y-8 py-10">
           <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
              <div className="relative w-32 h-32 bg-white rounded-[3rem] shadow-premium flex items-center justify-center text-primary border-4 border-white transform rotate-3 animate-slide-up">
                 <CheckCircle size={56} strokeWidth={1.5} className="animate-bounce-slow" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary-dark rounded-2xl flex items-center justify-center text-primary shadow-xl animate-bounce-slow delay-300">
                 <Sparkles size={24} />
              </div>
           </div>

           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 font-black text-[10px] uppercase tracking-[3px]">
                 <ShieldCheck size={14} /> Journey Confirmed
              </div>
              <h1 className="text-5xl md:text-7xl font-serif text-secondary-dark font-black tracking-tight leading-none">
                 Heritage <span className="text-primary italic">Secured</span>
              </h1>
              <p className="text-gray-400 font-medium text-lg max-w-lg mx-auto leading-relaxed">
                 Your official covenant with <span className="text-secondary-dark font-bold underline decoration-primary/30">{booking.hotelName}</span> is now active in the global ledger.
              </p>
           </div>
        </div>

        {/* Global Confirmation Terminal */}
        <div className="bg-white rounded-[4rem] border border-gray-100 shadow-premium overflow-hidden group">
           
           {/* Terminal Header: ID Bar */}
           <div className="bg-secondary-dark p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
              
              <div className="flex items-center gap-6 relative z-10">
                 <div className="w-14 h-14 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center text-primary">
                    <Zap size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[4px]">Booking Reference</p>
                    <p className="text-2xl font-black text-white italic font-serif tracking-widest uppercase">#{bookingRef}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4 relative z-10">
                 <button onClick={copyBookingId} className="h-12 px-6 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-secondary-dark transition-all flex items-center gap-2">
                    <Copy size={14} /> Copy Reference
                 </button>
                 <div className="w-px h-8 bg-white/10 hidden md:block" />
                 <div className="flex items-center gap-2">
                    <Globe size={18} className="text-primary" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Register</span>
                 </div>
              </div>
           </div>

           {/* Terminal Body */}
           <div className="p-10 md:p-16 space-y-16">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                 
                 {/* Property Manifest */}
                 <div className="space-y-8">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[4px] flex items-center gap-3">
                       <Hotel size={16} className="text-primary" /> Property Manifest
                    </h3>
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <h4 className="text-3xl font-serif text-secondary-dark font-black tracking-tight group-hover:text-primary transition-colors">
                             {booking.hotelName}
                          </h4>
                          <p className="text-gray-400 font-bold text-sm flex items-center gap-2 uppercase tracking-widest">
                             <MapPin size={16} className="text-primary" /> {booking.location}
                          </p>
                       </div>
                       <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/5 rounded-2xl border border-primary/10 text-primary font-black text-[10px] uppercase tracking-[2px]">
                          <Award size={14} /> {booking.roomType}
                       </div>
                    </div>
                 </div>

                 {/* Stay Intelligence */}
                 <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-center space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <Star size={120} className="text-secondary-dark" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Arrival</p>
                          <p className="text-sm font-bold text-secondary-dark uppercase tracking-tight">{formatDate(booking.checkInDate)}</p>
                       </div>
                       <ArrowRight size={24} className="text-primary opacity-30" />
                       <div className="space-y-1 text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Departure</p>
                          <p className="text-sm font-bold text-secondary-dark uppercase tracking-tight">{formatDate(booking.checkOutDate)}</p>
                       </div>
                    </div>

                    <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
                       <div className="flex items-center gap-6">
                          <div className="flex flex-col">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Span</p>
                             <p className="text-lg font-black text-secondary-dark italic font-serif leading-none tracking-tighter">{nights} Nights</p>
                          </div>
                          <div className="w-px h-6 bg-gray-200" />
                          <div className="flex flex-col">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Party</p>
                             <p className="text-lg font-black text-secondary-dark italic font-serif leading-none tracking-tighter">{booking.numGuests || 1} Guests</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Settlement</p>
                          <p className="text-2xl font-black text-primary italic font-serif tracking-tighter leading-none">{formatCurrency(booking.totalPrice)}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Courier Status */}
              <div className={`p-8 rounded-[2.5rem] border flex flex-col md:flex-row items-center gap-8 ${
                 emailSent 
                 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                 : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}>
                 <div className={`w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm border ${
                    emailSent ? 'text-emerald-500 border-emerald-100' : 'text-amber-500 border-amber-100'
                 }`}>
                    <Mail size={32} />
                 </div>
                 <div className="space-y-1 flex-1 text-center md:text-left">
                    <h4 className="text-[10px] font-black uppercase tracking-[3px]">Official Digital Courier</h4>
                    <p className="text-sm font-medium leading-relaxed">
                       {emailSent
                         ? 'A high-fidelity confirmation and fiscal invoice have been synchronized with your primary inbox. Check your priority folders.'
                         : 'Covenant confirmed. Digital courier is presently synchronizing with the mail server. You can view all heritage records in your archive.'}
                    </p>
                 </div>
                 {emailSent && <CheckCircle className="text-emerald-500 ml-auto hidden md:block" size={24} />}
              </div>
           </div>
        </div>

        {/* Operational Actions */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 animate-slide-up delay-700">
           <button 
             onClick={() => navigate('/customer/dashboard')}
             className="w-full md:w-auto px-12 h-18 bg-secondary-dark text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:bg-primary transition-all flex items-center justify-center gap-4 uppercase tracking-[3px] text-xs group"
           >
              Manage Journey <History size={20} className="text-primary group-hover:text-white transition-colors" />
           </button>
           <Link 
             to="/hotels" 
             className="w-full md:w-auto px-12 h-18 bg-white border-2 border-dashed border-gray-200 text-secondary-dark font-black rounded-2xl hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-4 uppercase tracking-[3px] text-xs group"
           >
              Continue Exploring <ExternalLink size={20} className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </Link>
        </div>

      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        @keyframes check-bounce { 0% { transform: scale(0); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .animate-check-bounce { animation: check-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </div>
  );
};

export default BookingSuccess;
