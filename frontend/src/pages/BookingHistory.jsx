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
  Star,
  Send,
  X,
  CreditCard,
  Trash2
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { fetchUserBookings, cancelBooking, modifyBooking, createRazorpayOrder, verifyRazorpayPayment, fetchReviewByBookingId } from '../services/api';
import { submitReview, editReview, removeReview, resetReviewStatus } from '../redux/slices/reviewSlice';
import { useLocation, useNavigate } from 'react-router-dom';
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
    if (location.state?.highlightBooking && bookings.length > 0) {
      const target = bookings.find(b => b._id === location.state.highlightBooking);
      if (target) {
        handleReviewClick(target);
        // Clear the state
        window.history.replaceState({}, document.title);
      }
    }
  }, [location, bookings]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data } = await fetchUserBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      setError('Failed to load your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    if (reviewSuccess) {
      setSuccess(reviewingBooking?.isReviewed ? 'Review updated!' : 'Review submitted! Thank you.');
      setReviewingBooking(null);
      setReviewForm({ id: null, rating: 5, comment: '' });
      dispatch(resetReviewStatus());
      loadBookings(); // Refresh to update isReviewed flag
    }
  }, [reviewSuccess, dispatch]);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    try {
      await cancelBooking(id);
      setSuccess('Booking cancelled successfully.');
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
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
      const newTotal = diffDays * (modifyingBooking.roomId?.price || 0);

      await modifyBooking(modifyingBooking._id, {
        checkInDate: modifyingDates.start,
        checkOutDate: modifyingDates.end,
        totalPrice: newTotal,
        numGuests: modifyingDates.guests
      });

      setSuccess('Booking updated successfully.');
      setModifyingBooking(null);
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update booking.');
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
    if (!window.confirm('Are you sure you want to delete your review?')) return;
    dispatch(removeReview(reviewForm.id));
  };

  const handleReviewClick = async (booking) => {
    setError('');
    if (booking.isReviewed) {
      setReviewingBooking(booking);
      try {
        const { data } = await fetchReviewByBookingId(booking._id);
        setReviewForm({ id: data._id, rating: data.rating, comment: data.comment });
      } catch (err) {
        setReviewForm({ id: null, rating: 5, comment: '' });
      }
    } else {
      setReviewingBooking(booking);
      setReviewForm({ id: null, rating: 5, comment: '' });
    }
  };

  const isReviewable = (booking) => {
    return booking.status === 'confirmed';
  };

  if (loading && bookings.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)' }}>Fetching your reservations...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade" style={{ padding: '4rem 0', background: '#fdfcfb', minHeight: '100vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="luxury-font" style={{ fontSize: '3rem', color: '#0f172a', marginBottom: '0.5rem' }}>My Journeys</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Manage your stays and share your experiences.</p>
        </div>

        {success && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', padding: '1rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle size={20} /> {success}
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} /> {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <Calendar size={32} color="#94a3b8" />
            <h3 className="luxury-font" style={{ fontSize: '1.8rem', margin: '1rem 0' }}>No Bookings Yet</h3>
            <a href="/hotels" className="btn-primary" style={{ padding: '1rem 2rem', textDecoration: 'none' }}>Explore Hotels</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {bookings.map(booking => (
              <div key={booking._id} className="glass-panel" style={{ 
                padding: '2rem', 
                borderRadius: '24px', 
                display: 'grid',
                gridTemplateColumns: '180px 1fr auto',
                gap: '2.5rem', 
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                background: 'white',
                opacity: booking.status === 'cancelled' ? 0.7 : 1
              }}>
                <img 
                  src={booking.hotelId?.images?.[0] || "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=300"} 
                  style={{ width: '180px', height: '140px', borderRadius: '16px', objectFit: 'cover' }}
                />
                
                <div>
                  <h3 className="luxury-font" style={{ fontSize: '1.5rem', margin: '0 0 0.4rem 0' }}>{booking.hotelId?.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                     <div style={{ 
                        padding: '4px 12px', 
                        borderRadius: '30px', 
                        fontSize: '0.75rem', 
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        backgroundColor: booking.status === 'confirmed' ? '#dcfce7' : booking.status === 'cancelled' ? '#fee2e2' : '#fef9c3',
                        color: booking.status === 'confirmed' ? '#166534' : booking.status === 'cancelled' ? '#991b1b' : '#854d0e'
                      }}>
                        {booking.status}
                      </div>
                      {isReviewable(booking) && (
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} /> Completed Stay
                        </span>
                      )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}</div>
                    <div style={{ fontWeight: '700', textAlign: 'right' }}>{formatCurrency(booking.totalPrice)}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', minWidth: '150px' }}>
                  {isReviewable(booking) ? (
                    <button 
                      onClick={() => handleReviewClick(booking)}
                      style={{ 
                        padding: '0.75rem 1rem', 
                        borderRadius: '12px', 
                        background: booking.isReviewed ? '#f8fafc' : '#0f172a', 
                        color: booking.isReviewed ? '#475569' : 'white', 
                        border: booking.isReviewed ? '1px solid #e2e8f0' : 'none', 
                        fontWeight: '700', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.5rem', 
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                      }}
                    >
                      {booking.isReviewed ? <Edit2 size={16} color="#0ea5e9" /> : <Star size={16} color="#f59e0b" />}
                      {booking.isReviewed ? 'Edit Review' : 'Rate Your Stay'}
                    </button>
                  ) : booking.status !== 'cancelled' && booking.paymentStatus !== 'paid' ? (
                    <button onClick={() => handlePayment(booking)} style={{ padding: '0.75rem 1rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', fontSize: '0.85rem' }}>
                       Pay Now
                    </button>
                  ) : null}
                  
                  {booking.status !== 'cancelled' && !isReviewable(booking) && (
                    <button onClick={() => handleModifyClick(booking)} style={{ padding: '0.6rem', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', fontSize: '0.8rem', fontWeight: '700' }}>
                       Modify Trip
                    </button>
                  )}
                  
                  <button onClick={() => navigate(`/hotel/${booking.hotelId?._id}`)} style={{ padding: '0.6rem', borderRadius: '10px', background: 'white', border: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700' }}>
                    View Resort
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div className="animate-fade" style={{ background: 'white', padding: '3rem', borderRadius: '32px', width: '90%', maxWidth: '500px' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ width: '64px', height: '64px', background: '#f8fafc', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid #e2e8f0' }}>
                 <MessageSquare size={32} color="var(--primary)" />
              </div>
              <h2 className="luxury-font" style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>{reviewingBooking.isReviewed ? 'Update Your Review' : 'Share Experience'}</h2>
              <p style={{ color: '#64748b' }}>How was your stay at {reviewingBooking.hotelId?.name}?</p>
            </div>

            <form onSubmit={handleReviewSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <label style={{ fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#94a3b8' }}>Select Rating</label>
                <StarRating size={36} rating={reviewForm.rating} onChange={r => setReviewForm({...reviewForm, rating: r})} />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem', color: '#1e293b' }}>Your Thoughts</label>
                <textarea 
                  required
                  rows="5"
                  value={reviewForm.comment}
                  onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                  placeholder="Describe your stay, service, and atmosphere..."
                  style={{ width: '100%', padding: '1.25rem', borderRadius: '18px', border: '1.5px solid #e2e8f0', outline: 'none', resize: 'none', fontSize: '1rem', transition: '0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                ></textarea>
              </div>

              {reviewError && <p style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1.5rem' }}>{reviewError}</p>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setReviewingBooking(null)} style={{ flex: 1, padding: '1.25rem', borderRadius: '16px', background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Close</button>
                  <button 
                    type="submit" 
                    disabled={reviewLoading}
                    style={{ flex: 2, padding: '1.25rem', borderRadius: '16px', background: '#0ea5e9', color: 'white', border: 'none', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)' }}
                  >
                    {reviewLoading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> {reviewingBooking.isReviewed ? 'Update Review' : 'Submit Review'}</>}
                  </button>
                </div>
                
                {reviewingBooking.isReviewed && (
                  <button 
                    type="button" 
                    onClick={handleDeleteReview}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '700', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', padding: '0.5rem' }}
                  >
                    <Trash2 size={16} /> Delete My Review
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modify Modal */}
      {modifyingBooking && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
           <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '90%', maxWidth: '450px' }}>
              <h3 className="luxury-font" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Modify Your Stay</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b', marginBottom: '0.5rem' }}>GUESTS</label>
                  <input 
                    type="number" min="1" max="10" 
                    value={modifyingDates.guests} 
                    onChange={e => setModifyingDates({...modifyingDates, guests: e.target.value})}
                    style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                   <div style={{ flex: 1 }}>
                     <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>CHECK-IN</label>
                     <DatePicker selected={modifyingDates.start} onChange={d => setModifyingDates({...modifyingDates, start: d})} className="booking-datepicker" />
                   </div>
                   <div style={{ flex: 1 }}>
                     <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#64748b' }}>CHECK-OUT</label>
                     <DatePicker selected={modifyingDates.end} onChange={d => setModifyingDates({...modifyingDates, end: d})} className="booking-datepicker" />
                   </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button onClick={() => setModifyingBooking(null)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: '#f1f5f9', border: 'none', fontWeight: '700' }}>Cancel</button>
                <button onClick={handleModifySubmit} disabled={submittingMod} style={{ flex: 2, padding: '1rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700' }}>
                  {submittingMod ? <Loader2 size={20} className="animate-spin" /> : 'Confirm Changes'}
                </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .glass-panel { transition: 0.3s; }
        .glass-panel:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.06) !important; }
        .booking-datepicker { width: 100%; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 0.8rem; outline: none; font-weight: 700; color: #1e293b; cursor: pointer; margin-top: 0.5rem; }
        .booking-datepicker:focus { border-color: var(--primary); }
      `}</style>
    </div>
  );
};

export default BookingHistory;
