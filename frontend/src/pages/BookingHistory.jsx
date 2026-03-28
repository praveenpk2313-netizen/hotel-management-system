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
  Info,
  CheckCircle2,
  Hotel
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { fetchUserBookings, cancelBooking, modifyBooking, createRazorpayOrder, verifyRazorpayPayment, fetchReviewByBookingId, API_BASE_URL } from '../services/api';
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
  
  const [viewingBooking, setViewingBooking] = useState(null);
  
  const [reviewingBooking, setReviewingBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({ id: null, rating: 5, comment: '' });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccess(location.state.successMessage);
      window.history.replaceState({}, document.title);
    }
    window.scrollTo(0, 0);
  }, [location]);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchUserBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      setError('Failed to retrieve your bookings.');
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
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      setSuccess('Booking cancelled successfully.');
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Cancellation failed.');
    }
  };

  const handleViewDetails = (booking) => {
    setViewingBooking(booking);
  };

  const getImageUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=400";
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}/${url}`;
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
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-40">
      <Loader2 size={40} className="animate-spin text-[#006ce4]" />
      <p className="text-sm font-bold text-gray-500">Loading your bookings...</p>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-24 pt-32 lg:pt-40 font-serif">
      <div className="max-w-5xl mx-auto px-6 space-y-12 animate-fade-in">
        
        {/* Page Header */}
        <div className="space-y-4">
           <h1 className="text-6xl font-black text-slate-900 tracking-tight">My Journeys</h1>
           <p className="text-xl text-slate-500 font-sans font-medium">Manage your stays and share your experiences.</p>
        </div>

        {/* Notifications Hub */}
        {(success || error) && (
          <div className="space-y-4 font-sans">
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 text-sm font-bold animate-slide-up">
                 <CheckCircle2 size={18} /> {success}
                 <button onClick={() => setSuccess('')} className="ml-auto opacity-50 hover:opacity-100"><X size={16} /></button>
              </div>
            )}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-700 text-sm font-bold">
                 <AlertTriangle size={18} /> {error}
                 <button onClick={() => setError('')} className="ml-auto opacity-50 hover:opacity-100"><X size={16} /></button>
              </div>
            )}
          </div>
        )}

        {/* Bookings Feed */}
        {bookings.length === 0 ? (
          <div className="py-24 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 space-y-6 font-sans">
             <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <Hotel size={40} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">No bookings yet</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">Your upcoming trips will appear here once you make a reservation.</p>
             </div>
             <Link to="/hotels" className="btn-primary-booking inline-flex">
                Discover properties <ArrowRight size={18} />
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-slate-50/50 rounded-[2.5rem] p-8 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 group border border-transparent hover:border-slate-100">
                 <div className="flex flex-col md:flex-row items-center gap-10">
                    
                    {/* Property Image Area */}
                    <div className="w-full md:w-64 h-48 md:h-44 shrink-0 relative overflow-hidden rounded-3xl">
                       <img 
                         src={getImageUrl(booking.hotelId?.images?.[0])} 
                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         alt={booking.hotelId?.name}
                       />
                    </div>

                    {/* Booking Informatics */}
                    <div className="flex-1 flex flex-col md:flex-row justify-between items-center gap-8 w-full">
                       <div className="space-y-4 text-center md:text-left">
                          <div className="space-y-1">
                             <div className="flex flex-col md:flex-row items-center gap-4">
                                <h2 className="text-3xl font-black text-slate-900">
                                   {booking.hotelId?.name || "Premium Resort"}
                                </h2>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                                  booking.status === 'cancelled' ? 'bg-gray-100 text-gray-500' : 
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                   {booking.status === 'confirmed' ? 'COMPLETED' : booking.status}
                                </span>
                             </div>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-6 font-sans">
                             <p className="text-sm font-bold text-slate-400">
                                {formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}
                             </p>
                             <p className="text-2xl font-black text-slate-900 border-l-0 md:border-l border-slate-200 pl-0 md:pl-6">
                                {formatCurrency(booking.totalPrice)}
                             </p>
                          </div>
                       </div>

                       {/* Action Strip */}
                       <div className="flex flex-col gap-3 shrink-0 font-sans">
                          <button 
                            onClick={() => handleViewDetails(booking)}
                            className="w-44 py-3 bg-white border border-slate-100 text-slate-900 rounded-2xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                          >
                             View Trip Details
                          </button>
                          <Link 
                            to={`/hotel/${booking.hotelId?._id}`}
                            className="w-44 py-3 bg-white border border-slate-100 text-slate-900 rounded-2xl font-black text-xs hover:bg-slate-900 hover:text-white transition-all shadow-sm text-center"
                          >
                             View Resort
                          </Link>
                          {booking.status !== 'cancelled' && booking.paymentStatus !== 'paid' && (
                            <button 
                              onClick={() => handlePayment(booking)}
                              className="w-44 py-3 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                            >
                               Pay Now
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

      {/* View Details Modal */}
      {viewingBooking && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingBooking(null)} />
           <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-100">
              <div className="p-10 space-y-10">
                 {/* Modal Header */}
                 <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Reservation Reference</p>
                       <h2 className="text-3xl font-black text-slate-900">#{(viewingBooking._id || '').slice(-8).toUpperCase()}</h2>
                    </div>
                    <button onClick={() => setViewingBooking(null)} className="p-3 hover:bg-slate-50 rounded-2xl transition-all border border-transparent hover:border-slate-100"><X size={24} className="text-slate-400" /></button>
                 </div>

                 {/* Detail Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                       <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Hotel size={12} className="text-luxury-gold" /> Property
                          </p>
                          <p className="text-xl font-bold text-slate-900 italic font-serif leading-tight">{viewingBooking.hotelId?.name}</p>
                       </div>
                       
                       <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Calendar size={12} className="text-luxury-gold" /> Stay Period
                          </p>
                          <p className="text-sm font-bold text-slate-600">
                             {formatDate(viewingBooking.checkInDate)} — {formatDate(viewingBooking.checkOutDate)}
                          </p>
                       </div>

                       <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <CreditCard size={12} className="text-luxury-gold" /> Total Payment
                          </p>
                          <p className="text-3xl font-black text-slate-900">{formatCurrency(viewingBooking.totalPrice)}</p>
                       </div>
                    </div>

                    <div className="space-y-8">
                       <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck size={12} className="text-luxury-gold" /> Reservation Status
                          </p>
                          <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            viewingBooking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                            viewingBooking.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {viewingBooking.status}
                          </span>
                       </div>

                       <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Zap size={12} className="text-luxury-gold" /> Room Information
                          </p>
                          <p className="text-sm font-bold text-slate-600">{viewingBooking.roomId?.name || 'Standard Room'}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase">{viewingBooking.numGuests} Guests Included</p>
                       </div>

                       <div className="space-y-1.5">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <ShieldCheck size={12} className="text-luxury-gold" /> Payment Status
                          </p>
                          <span className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            viewingBooking.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {viewingBooking.paymentStatus || 'Pending'}
                          </span>
                       </div>
                    </div>
                 </div>

                 {/* Action Bar */}
                 <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                    {viewingBooking.status !== 'cancelled' ? (
                       <button 
                         onClick={() => {
                           handleCancel(viewingBooking._id);
                           setViewingBooking(null);
                         }}
                         className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:text-rose-700 transition-colors"
                       >
                          <Trash2 size={14} /> Request Cancellation
                       </button>
                    ) : <div></div>}
                    <button 
                      onClick={() => setViewingBooking(null)}
                      className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-luxury-gold transition-all shadow-xl"
                    >
                       Close Details
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingBooking && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setReviewingBooking(null)} />
           <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-slide-up">
              <div className="p-8 space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <h2 className="text-xl font-black text-gray-900">
                          {reviewingBooking.isReviewed ? 'Update your review' : 'How was your stay?'}
                       </h2>
                       <p className="text-sm font-medium text-gray-500">{reviewingBooking.hotelId?.name}</p>
                    </div>
                    <button onClick={() => setReviewingBooking(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                 </div>

                 <form onSubmit={handleReviewSubmit} className="space-y-8">
                    <div className="flex flex-col items-center gap-3">
                       <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Your Rating</p>
                       <StarRating size={40} rating={reviewForm.rating} onChange={r => setReviewForm({...reviewForm, rating: r})} />
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-900 uppercase">Write a review</label>
                       <textarea 
                         required
                         rows="4"
                         value={reviewForm.comment}
                         onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                         placeholder="What was good? What could be better?"
                         className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-[#006ce4] outline-none transition-all text-sm font-medium"
                       />
                    </div>

                    <div className="flex gap-4">
                       <button 
                         type="submit" 
                         disabled={reviewLoading}
                         className="flex-1 btn-primary-booking"
                       >
                          {reviewLoading ? <Loader2 className="animate-spin" /> : 'Submit Review'}
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default BookingHistory;
