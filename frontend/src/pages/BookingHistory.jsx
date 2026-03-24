import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Calendar, 
  MapPin, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Edit2, 
  MessageSquare,
  Star as StarIcon,
  Send,
  X,
  CreditCard,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  MessageCircle,
  History,
  Info
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { fetchUserBookings, cancelBooking, modifyBooking, createRazorpayOrder, verifyRazorpayPayment, fetchReviewByBookingId } from '../services/api';
import { submitReview, editReview, removeReview, resetReviewStatus } from '../redux/slices/reviewSlice';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DatePicker from 'react-datepicker';
import StarRating from '../components/StarRating';
import "react-datepicker/dist/react-datepicker.css";

const BookingHistory = () => {
  const dispatch = useDispatch();
  const { success: reviewSuccess, error: reviewError, loading: reviewLoading } = useSelector(state => state.reviews);
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [modifyingBooking, setModifyingBooking] = useState(null);
  const [modifyingDates, setModifyingDates] = useState({ start: null, end: null, guests: 1 });
  const [submittingMod, setSubmittingMod] = useState(false);
  const [payingId, setPayingId] = useState(null);
  
  // Review Modal State
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ id: null, rating: 5, comment: '' });

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchUserBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      setError('Failed to retrieve your travel archive.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    if (reviewSuccess) {
      setSuccess(reviewingBooking?.isReviewed ? 'Review updated!' : 'Review submitted! Thank you.');
      setReviewingBooking(null);
      setReviewForm({ id: null, rating: 5, comment: '' });
      dispatch(resetReviewStatus());
      loadBookings();
    }
  }, [reviewSuccess, dispatch, loadBookings, reviewingBooking?.isReviewed]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to terminate this reservation?')) return;
    try {
      await cancelBooking(id);
      setSuccess('Reservation terminated successfully.');
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Termination failed.');
    }
  };

  const handleModifyClick = (booking) => {
    setModifyingBooking(booking);
    setModifyingDates({
      start: new Date(booking.checkInDate),
      end: new Date(booking.checkOutDate),
      guests: booking.numGuests || 1
    });
  };

  const handleModifySubmit = async (e) => {
    e.preventDefault();
    setSubmittingMod(true);
    setError('');
    try {
      const diffTime = Math.abs(modifyingDates.end - modifyingDates.start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const newTotal = (diffDays || 1) * (modifyingBooking.roomId?.price || 0);

      await modifyBooking(modifyingBooking._id, {
        checkInDate: modifyingDates.start,
        checkOutDate: modifyingDates.end,
        totalPrice: newTotal,
        numGuests: modifyingDates.guests
      });

      setSuccess('Itinerary modified successfully.');
      setModifyingBooking(null);
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Modification failed.');
    } finally {
      setSubmittingMod(false);
    }
  };

  const handlePayment = (booking) => {
    navigate('/payment', { 
      state: { 
        bookingData: booking, 
        hotel: booking.hotelId, 
        selectedRoom: booking.roomId 
      } 
    });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewingBooking.isReviewed) {
      dispatch(editReview({ 
        id: reviewForm.id, 
        data: { rating: reviewForm.rating, comment: reviewForm.comment } 
      }));
    } else {
      dispatch(submitReview({
        bookingId: reviewingBooking._id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      }));
    }
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('Delete this review forever?')) return;
    dispatch(removeReview(reviewForm.id));
  };

  const handleReviewClick = async (booking) => {
    setError('');
    setReviewingBooking(booking);
    if (booking.isReviewed) {
      try {
        const { data } = await fetchReviewByBookingId(booking._id);
        setReviewForm({ id: data._id, rating: data.rating, comment: data.comment });
      } catch (err) {
        setReviewForm({ id: null, rating: 5, comment: '' });
      }
    } else {
      setReviewForm({ id: null, rating: 5, comment: '' });
    }
  };

  if (loading && bookings.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Retrieving Archive...</p>
    </div>
  );

  return (
    <div className="bg-background-light min-h-screen pb-20 pt-10 px-4 md:px-0">
      <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 bg-white p-10 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-premium relative overflow-hidden group">
           {/* Decoration */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors duration-1000" />
           
           <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary font-black text-[10px] uppercase tracking-[3px]">
                 <History size={14} /> Global Travel Ledger
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-dark font-black tracking-tight leading-[1.1]">
                 My <span className="text-primary italic">Journeys</span>
              </h1>
              <p className="text-gray-400 font-medium text-lg max-w-lg leading-relaxed">
                 A curated retrospective of your elite experiences with the PK UrbanStay collection.
              </p>
           </div>
           
           <div className="flex items-center gap-6 relative z-10 pb-2">
              <div className="text-right">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Status</p>
                 <p className="text-xl font-bold text-secondary-dark">{bookings.filter(b => b.status === 'confirmed').length} Confirmed</p>
              </div>
              <div className="w-px h-12 bg-gray-100" />
              <div className="text-right">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Stay Value</p>
                 <p className="text-xl font-bold text-primary italic font-serif tracking-tight">VIP Ledger</p>
              </div>
           </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
           {success && (
             <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-[2rem] flex items-center gap-4 text-emerald-700 text-sm font-bold animate-slide-up">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm"><CheckCircle size={20} /></div>
                {success}
             </div>
           )}
           {error && (
             <div className="p-5 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-700 text-sm font-bold animate-shake">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm"><AlertTriangle size={20} /></div>
                {error}
             </div>
           )}
        </div>

        {/* Bookings Collection */}
        {bookings.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center bg-white rounded-[4rem] border border-gray-100 shadow-sm">
             <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mb-8 border border-gray-50">
                <Calendar size={48} />
             </div>
             <h3 className="text-2xl font-serif text-secondary-dark font-black">No Reservations Found</h3>
             <p className="text-gray-400 font-medium mt-2 mb-10 max-w-sm mx-auto leading-relaxed">Your travel archive is currently clear. Begin your next luxury chapter today.</p>
             <Link to="/hotels" className="btn-gold flex items-center gap-3">
                Discover Properties <ArrowRight size={20} className="text-white/80" />
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {bookings.map((booking, idx) => (
              <div key={booking._id} style={{ animationDelay: `${idx * 100}ms` }} className="animate-slide-up bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-premium hover:shadow-2xl transition-all duration-700 overflow-hidden relative group">
                 
                 {/* Card Decoration */}
                 <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-primary/5 via-primary to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                 
                 <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
                    
                    {/* Visual Media */}
                    <div className="w-full lg:w-72 aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-premium relative flex-shrink-0 group/img">
                       <img 
                         src={booking.hotelId?.images?.[0] || "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=400"} 
                         className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-[3s]"
                         alt={booking.hotelId?.name}
                       />
                       <div className="absolute inset-0 bg-secondary-dark/20 group-hover/img:bg-transparent transition-colors duration-700" />
                       <div className="absolute bottom-6 left-6 right-6">
                          <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[2px] backdrop-blur-md shadow-lg flex items-center justify-center gap-2 border border-white/20 ${
                            booking.status === 'confirmed' ? 'bg-emerald-500/80 text-white' : 
                            booking.status === 'cancelled' ? 'bg-rose-500/80 text-white' : 
                            'bg-amber-500/80 text-white'
                          }`}>
                             <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                             {booking.status}
                          </div>
                       </div>
                    </div>

                    {/* Intellectual Data */}
                    <div className="flex-1 space-y-8 min-w-0">
                       <div className="space-y-3">
                          <p className="text-[11px] font-black text-primary uppercase tracking-[3px] flex items-center gap-2">
                             <Tag size={12} className="opacity-50" /> ID: {booking._id.slice(-8)}
                          </p>
                          <h2 className="text-3xl md:text-4xl font-serif text-secondary-dark font-black tracking-tight truncate group-hover:text-primary transition-colors">
                             {booking.hotelId?.name}
                          </h2>
                          <p className="text-gray-400 font-bold text-sm flex items-center gap-2 uppercase tracking-widest">
                             <MapPin size={16} className="text-primary" /> {booking.hotelId?.location || 'Elite Location'}
                          </p>
                       </div>

                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-y border-gray-50">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Entry</p>
                             <p className="text-sm font-bold text-secondary-dark uppercase tracking-tight">{formatDate(booking.checkInDate)}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Temporal Exit</p>
                             <p className="text-sm font-bold text-secondary-dark uppercase tracking-tight">{formatDate(booking.checkOutDate)}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Suite Class</p>
                             <p className="text-sm font-bold text-secondary-dark truncate">{booking.roomId?.type || 'Luxury Suite'}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Investment</p>
                             <p className="text-xl font-black text-primary">{formatCurrency(booking.totalPrice)}</p>
                          </div>
                       </div>
                    </div>

                    {/* Operations Controls */}
                    <div className="w-full lg:w-60 flex flex-col gap-3">
                       {booking.status === 'confirmed' ? (
                         <button 
                           onClick={() => handleReviewClick(booking)}
                           className={`h-14 rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-sm flex items-center justify-center gap-3 transition-all active:scale-95 border ${
                             booking.isReviewed 
                             ? 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-white hover:text-primary hover:border-primary' 
                             : 'bg-secondary-dark text-white hover:bg-primary shadow-secondary/20 hover:shadow-primary/30'
                           }`}
                         >
                            {booking.isReviewed ? (
                              <><Edit2 size={16} /> Edit Intelligence</>
                            ) : (
                              <><StarIcon size={16} className="text-primary group-hover:text-white" /> Share Experience</>
                            )}
                         </button>
                       ) : booking.status !== 'cancelled' && booking.paymentStatus !== 'paid' ? (
                         <button 
                           onClick={() => handlePayment(booking)}
                           className="h-14 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[2px] shadow-lg shadow-primary/30 flex items-center justify-center gap-3 hover:bg-primary-dark hover:-translate-y-1 transition-all active:scale-95"
                         >
                            <CreditCard size={18} /> Finalize Payment
                         </button>
                       ) : null}

                       <div className="grid grid-cols-2 gap-3">
                          {booking.status !== 'cancelled' && !['confirmed', 'completed'].includes(booking.status) && (
                            <button 
                              onClick={() => handleModifyClick(booking)}
                              className="h-14 bg-white text-secondary-dark border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-secondary-dark transition-all flex items-center justify-center gap-2"
                            >
                               <Clock size={16} /> Modify
                            </button>
                          )}
                          <button 
                            onClick={() => navigate(`/hotel/${booking.hotelId?._id}`)}
                            className="h-14 bg-white text-secondary-dark border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-secondary-dark transition-all flex items-center justify-center gap-2 lg:col-span-2"
                          >
                             <Zap size={16} className="text-primary" /> View Resort
                          </button>
                          {booking.status === 'pending' && (
                            <button 
                              onClick={() => handleCancel(booking._id)}
                              className="h-14 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 col-span-2"
                            >
                               <XCircle size={16} /> Terminate Stay
                            </button>
                          )}
                       </div>
                    </div>

                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal - Redesigned */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
           <div className="absolute inset-0 bg-secondary-dark/60 backdrop-blur-xl animate-fade-in" onClick={() => setReviewingBooking(null)} />
           <div className="relative w-full max-w-xl bg-white rounded-[3.5rem] shadow-premium-dark overflow-hidden animate-slide-up">
              
              <div className="p-10 md:p-12 space-y-10">
                 <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto border-4 border-white shadow-premium">
                       <MessageCircle size={40} className="animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-serif text-secondary-dark font-black truncate px-4 capitalize">
                       {reviewingBooking.isReviewed ? 'Refine Review' : 'Stay Intelligence'}
                    </h2>
                    <p className="text-gray-400 font-medium px-8 leading-relaxed">How would you describe your experience at the <span className="text-secondary-dark font-bold underline decoration-primary/30">{reviewingBooking.hotelId?.name}</span>?</p>
                 </div>

                 <form onSubmit={handleReviewSubmit} className="space-y-10">
                    <div className="flex flex-col items-center gap-4">
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sentiment Score</p>
                       <StarRating size={44} rating={reviewForm.rating} onChange={r => setReviewForm({...reviewForm, rating: r})} />
                    </div>

                    <div className="space-y-2 group">
                       <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Experience Narration</label>
                       <textarea 
                         required
                         rows="5"
                         value={reviewForm.comment}
                         onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                         placeholder="Describe service, atmosphere, and amenities..."
                         className="input-premium py-6 min-h-[160px]"
                       />
                    </div>

                    {reviewError && (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-widest text-center">
                         {reviewError}
                      </div>
                    )}

                    <div className="flex flex-col gap-4">
                       <button 
                         type="submit" 
                         disabled={reviewLoading}
                         className="w-full h-16 bg-secondary-dark text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:bg-primary hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                       >
                          {reviewLoading ? <Loader2 className="animate-spin" /> : <><Send size={18} className="text-primary" /> {reviewingBooking.isReviewed ? 'Update Intelligence' : 'Archive Experience'}</>}
                       </button>
                       
                       <div className="flex items-center gap-4">
                          <button type="button" onClick={() => setReviewingBooking(null)} className="flex-1 h-14 bg-gray-50 text-gray-400 font-black rounded-2xl hover:bg-gray-100 transition-colors uppercase tracking-widest text-[10px]">Cancel</button>
                          {reviewingBooking.isReviewed && (
                            <button type="button" onClick={handleDeleteReview} className="flex-1 h-14 bg-rose-50 text-rose-500 font-black rounded-2xl hover:bg-rose-500 hover:text-white transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                               <Trash2 size={16} /> Delete
                            </button>
                          )}
                       </div>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* Modify Modal - Redesigned */}
      {modifyingBooking && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10">
           <div className="absolute inset-0 bg-secondary-dark/60 backdrop-blur-xl animate-fade-in" onClick={() => setModifyingBooking(null)} />
           <div className="relative w-full max-w-lg bg-white rounded-[3.5rem] shadow-premium-dark overflow-hidden animate-slide-up">
              
              <div className="p-10 md:p-12 space-y-10">
                 <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto border-4 border-white shadow-premium">
                       <Clock size={40} className="animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-serif text-secondary-dark font-black">Adjust Itinerary</h2>
                    <p className="text-gray-400 font-medium leading-relaxed">Update stay duration for your experience at <br /> <span className="text-secondary-dark font-bold">{modifyingBooking.hotelId?.name}</span></p>
                 </div>

                 <form className="space-y-8">
                    <div className="space-y-2 group">
                       <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Guest Commitment</label>
                       <div className="relative">
                          <UserCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={18} />
                          <input 
                            type="number" min="1" max="10" 
                            value={modifyingDates.guests} 
                            onChange={e => setModifyingDates({...modifyingDates, guests: e.target.value})}
                            className="input-premium pl-14"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Arrival</label>
                          <DatePicker 
                            selected={modifyingDates.start} 
                            onChange={d => setModifyingDates({...modifyingDates, start: d})} 
                            className="w-full h-14 px-6 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary/20 transition-all outline-none cursor-pointer text-center"
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Departure</label>
                          <DatePicker 
                            selected={modifyingDates.end} 
                            onChange={d => setModifyingDates({...modifyingDates, end: d})} 
                            className="w-full h-14 px-6 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary/20 transition-all outline-none cursor-pointer text-center"
                          />
                       </div>
                    </div>

                    <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Info size={20} className="text-primary" />
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing Strategy</p>
                       </div>
                       <p className="text-lg font-black text-secondary-dark">Dynamic Audit</p>
                    </div>

                    <div className="flex flex-col gap-4">
                       <button 
                         type="button"
                         onClick={handleModifySubmit} 
                         disabled={submittingMod}
                         className="w-full h-16 bg-secondary-dark text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:bg-primary transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                       >
                          {submittingMod ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={18} className="text-primary" /> Confirm Logic</>}
                       </button>
                       <button type="button" onClick={() => setModifyingBooking(null)} className="w-full h-14 text-gray-400 font-black uppercase tracking-widest text-[10px]">Abandon Changes</button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

// Simple UserCheck icon since it's not imported
const UserCheck = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>
  </svg>
);

export default BookingHistory;
