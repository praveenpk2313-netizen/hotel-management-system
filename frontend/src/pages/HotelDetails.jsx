import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MapPin, 
  Wifi, 
  Coffee, 
  Wind, 
  Shield, 
  ArrowLeft, 
  Loader2, 
  Info, 
  User,
  MessageSquare,
  ChevronRight,
  Star,
  CheckCircle2
} from 'lucide-react';
import BookingForm from '../components/BookingForm';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { fetchHotelById, fetchRooms, createBooking, fetchUserBookings, addReview } from '../services/api';
import { getReviews } from '../redux/slices/reviewSlice';
import { formatDate } from '../utils/helpers';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { reviews, loading: reviewsLoading } = useSelector((state) => state.reviews);
  const [userBooking, setUserBooking] = useState(null);

  const fetchUserBookingForHotel = async () => {
    if (!user) return;
    try {
      const { data } = await fetchUserBookings();
      const booking = data.bookings.find(b => 
        b.hotelId?._id === id && 
        b.status === 'confirmed' && 
        !b.isReviewed
      );
      setUserBooking(booking);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    }
  };

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userBooking) return;
    
    setReviewSubmitting(true);
    try {
      await addReview({
        bookingId: userBooking._id,
        rating,
        comment
      });
      setReviewSuccess('Thank you for your review!');
      setUserBooking(null); // Remove form
      dispatch(getReviews(id)); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hRes = await fetchHotelById(id);
        setHotel(hRes.data);
        const rRes = await fetchRooms(id);
        setRooms(rRes.data);
        dispatch(getReviews(id));
        if (user) fetchUserBookingForHotel();
      } catch (err) {
        console.error('Error fetching hotel details:', err);
        setError('Failed to load hotel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, dispatch, user]);

  const handleBookingSubmit = async (bookingData) => {
    // If not logged in, send to login but prepare to land on the payment page directly
    if (!user) {
      navigate('/login', { 
        state: { 
          from: '/payment', 
          bookingData, 
          hotel, 
          selectedRoom: rooms.find(r => r._id === bookingData.roomId) 
        } 
      });
      return;
    }

    // Go to payment page for logged-in users
    navigate('/payment', { 
      state: { 
        bookingData, 
        hotel, 
        selectedRoom: rooms.find(r => r._id === bookingData.roomId) 
      } 
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <Loader2 size={40} className="animate-spin" color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Loading hotel details...</p>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <Info size={48} color="var(--error)" style={{ marginBottom: '1rem' }} />
        <h3>{error || 'Hotel not found'}</h3>
        <button onClick={() => navigate('/hotels')} className="btn-primary" style={{ marginTop: '1.5rem' }}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className="animate-fade" style={{ padding: '2rem 0 6rem 0', background: '#fdfcfb' }}>
      <div className="container">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontWeight: '500', cursor: 'pointer' }}>
          <ArrowLeft size={18} /> Back to Search
        </button>

        {/* Image Gallery */}
        <div className="responsive-gallery" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'repeat(2, 220px)', gap: '1rem', marginBottom: '3rem', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ gridRow: 'span 2' }}>
            <img 
              src={hotel.images?.[0] || "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1200"} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              alt={hotel.name} 
            />
          </div>
          {hotel.images?.slice(1, 5).map((img, idx) => (
            <div key={idx}><img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={hotel.name} /></div>
          ))}
          {/* Fallback if no images */}
          {(!hotel.images || hotel.images.length < 5) && [...Array(4 - (hotel.images?.length || 0 - 1))].map((_, i) => (
             <div key={i}><img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Hotel" /></div>
          ))}
        </div>

        <div className="responsive-grid-2-1" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
          {/* Info Section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h1 className="luxury-font luxury-font-lg" style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#0f172a' }}>{hotel.name}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                  <MapPin size={20} /> {hotel.location || hotel.city}
                </div>
              </div>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', textAlign: 'center', minWidth: '120px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: '800', fontSize: '1.5rem', color: '#0f172a' }}>
                  <StarRating rating={hotel.averageRating || 0} readOnly size={20} />
                  <span style={{ marginLeft: '4px' }}>{hotel.averageRating ? hotel.averageRating.toFixed(1) : '0.0'}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>{hotel.totalReviews || 0} Verified Reviews</div>
              </div>
            </div>

            <div style={{ height: '1px', background: '#e2e8f0', margin: '2.5rem 0' }}></div>

            <h3 className="luxury-font" style={{ fontSize: '1.75rem', marginBottom: '1.2rem', color: '#0f172a' }}>About this property</h3>
            <p style={{ color: '#475569', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '3rem' }}>
              {hotel.description}
            </p>

            <h3 className="luxury-font" style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#0f172a' }}>Premium Amenities</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {hotel.amenities?.map((amenity, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#1e293b' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(197, 160, 89, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {amenity.toLowerCase().includes('wifi') ? <Wifi size={22} color="var(--primary)" /> : 
                     amenity.toLowerCase().includes('breakfast') ? <Coffee size={22} color="var(--primary)" /> :
                     amenity.toLowerCase().includes('ac') || amenity.toLowerCase().includes('wind') ? <Wind size={22} color="var(--primary)" /> :
                     <Shield size={22} color="var(--primary)" />}
                  </div>
                  <span style={{ fontWeight: '500' }}>{amenity}</span>
                </div>
              ))}
            </div>
            
            {/* Rooms Section */}
            <div style={{ marginTop: '4rem' }}>
              <h3 className="luxury-font" style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#0f172a' }}>Available Room Types</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {rooms.map(room => (
                  <div key={room._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{room.type}</h4>
                      <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>Up to {room.capacity} Guests • {room.totalRooms} rooms available</p>
                    </div>
                    <div style={{ fontWeight: '700', color: 'var(--primary)' }}>${room.price}/night</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div id="reviews" style={{ marginTop: '5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h3 className="luxury-font" style={{ fontSize: '2rem', color: '#0f172a', margin: 0 }}>Guest Experiences</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                   <span style={{ fontWeight: '800', fontSize: '1.1rem' }}>{hotel.averageRating || '0.0'}</span>
                   <StarRating rating={hotel.averageRating || 0} readOnly size={16} />
                   <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>({hotel.totalReviews || 0} reviews)</span>
                </div>
              </div>

              {/* WRITE A REVIEW BOX (The "Typeo Box") */}
              {userBooking && (
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '2px solid var(--primary)', marginBottom: '3rem', boxShadow: '0 10px 30px -10px rgba(197,160,89,0.2)' }}>
                  <h4 className="luxury-font" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Star size={24} fill="var(--primary)" color="var(--primary)" /> Share Your Stay Experience
                  </h4>
                  <form onSubmit={handleReviewSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#64748b', marginBottom: '0.75rem' }}>YOUR RATING</label>
                      <StarRating rating={rating} onChange={setRating} size={32} />
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '700', color: '#64748b', marginBottom: '0.75rem' }}>YOUR THOUGHTS</label>
                      <textarea 
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what you loved about your stay..."
                        required
                        style={{ 
                          width: '100%', 
                          minHeight: '120px', 
                          padding: '1.25rem', 
                          borderRadius: '16px', 
                          border: '1px solid #e2e8f0', 
                          background: '#f8fafc',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: '0.2s',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={reviewSubmitting}
                      style={{ 
                        background: '#0f172a', 
                        color: 'white', 
                        padding: '1.1rem 2.5rem', 
                        borderRadius: '14px', 
                        border: 'none', 
                        fontWeight: '700', 
                        cursor: reviewSubmitting ? 'not-allowed' : 'pointer',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        transition: '0.3s'
                      }}
                      onMouseEnter={(e) => !reviewSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
                      onMouseLeave={(e) => !reviewSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}
                    >
                      {reviewSubmitting ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                      {reviewSubmitting ? 'Submitting...' : 'Post Verified Review'}
                    </button>
                  </form>
                </div>
              )}

              {reviewSuccess && (
                <div style={{ background: '#ecfdf5', color: '#065f46', padding: '1.5rem', borderRadius: '16px', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
                   <CheckCircle2 size={24} /> {reviewSuccess}
                </div>
              )}

              {reviewsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="animate-spin" size={32} color="var(--primary)" /></div>
              ) : reviews.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: 'white', borderRadius: '24px', border: '1.5px dashed #e2e8f0' }}>
                  <MessageSquare size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                  <p style={{ color: '#64748b', margin: 0 }}>No reviews yet for this hotel. Be the first to share your experience!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {reviews.map((review) => (
                    <div key={review._id} style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid white', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                             {review.userId?.avatar ? <img src={review.userId.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={24} color="#94a3b8" />}
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>{review.userId?.name}</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>Verified Stay • {formatDate(review.createdAt)}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} readOnly size={16} />
                      </div>

                      <div style={{ position: 'relative' }}>
                        <p style={{ margin: 0, fontSize: '1.05rem', color: '#4a5568', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                          "{review.comment}"
                        </p>
                      </div>

                      {review.managerReply && (
                        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', borderLeft: '4px solid var(--primary)' }}>
                          <p style={{ margin: '0 0 0.5rem 0', fontWeight: '800', fontSize: '0.85rem', color: 'var(--primary)', letterSpacing: '0.05em' }}>MANAGER RESPONSE</p>
                          <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', fontStyle: 'italic' }}>
                            {review.managerReply}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div>
            <div style={{ position: 'sticky', top: '2rem' }}>
              <BookingForm 
                hotel={hotel} 
                rooms={rooms} 
                onSubmit={handleBookingSubmit} 
              />
              
              {/* Review Shortcut */}
              <div style={{ marginTop: '2rem', background: '#0f172a', padding: '2rem', borderRadius: '24px', color: 'white', textAlign: 'center' }}>
                 {userBooking ? (
                   <>
                    <p style={{ margin: '0 0 1rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>You've stayed here recently!</p>
                    <button 
                      onClick={() => document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' })}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', background: 'var(--primary)', border: 'none', color: 'white', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      <Star size={18} fill="white" /> Share Your Experience
                    </button>
                   </>
                 ) : (
                   <>
                    <p style={{ margin: '0 0 1rem 0', color: '#94a3b8', fontSize: '0.9rem' }}>Have you stayed here before?</p>
                    <button 
                      onClick={() => document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' })}
                      style={{ width: '100%', padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                    >
                      Read Verified Reviews <ChevronRight size={18} />
                    </button>
                   </>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: 2fr 1fr"] { grid-template-columns: 1fr !important; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HotelDetails;
