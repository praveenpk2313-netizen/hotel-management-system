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
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Award,
  Calendar,
  Waves,
  Heart,
  Share2,
  Lock
} from 'lucide-react';
import BookingForm from '../components/BookingForm';
import StarRating from '../components/StarRating';
import { useAuth } from '../context/AuthContext';
import { fetchHotelById, fetchRooms, createBooking, fetchUserBookings, addReview } from '../services/api';
import { getReviews } from '../redux/slices/reviewSlice';
import { formatDate, formatCurrency } from '../utils/helpers';

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
      setReviewSuccess('Thank you for your valuable insight.');
      setUserBooking(null);
      dispatch(getReviews(id));
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed.');
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
        setError('Property archive retrieval failed.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, dispatch, user]);

  const handleBookingSubmit = async (bookingData) => {
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
    navigate('/payment', { 
      state: { 
        bookingData, 
        hotel, 
        selectedRoom: rooms.find(r => r._id === bookingData.roomId) 
      } 
    });
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Loader2 size={40} className="animate-spin text-[#006ce4]" />
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Consulting Registry...</p>
    </div>
  );

  if (error || !hotel) return (
    <div className="max-w-xl mx-auto py-24 px-6 text-center space-y-8">
       <div className="w-20 h-20 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 mx-auto">
          <Info size={40} />
       </div>
       <h2 className="text-3xl font-black text-gray-900 tracking-tight">{error || 'Property Not Found'}</h2>
       <button onClick={() => navigate('/hotels')} className="btn-primary-booking mx-auto">Return to Collection</button>
    </div>
  );

  return (
    <div className="animate-fade-in bg-white pb-24 pt-20">
      
      {/* 1. Gallery Grid (Booking Style) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
         <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[450px] rounded-lg overflow-hidden">
            <div className="col-span-2 row-span-2 relative group cursor-pointer">
               <img src={hotel.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"} className="w-full h-full object-cover" alt={hotel.name} />
            </div>
            <div className="col-span-1 relative group cursor-pointer">
               <img src={hotel.images?.[1] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" alt="Gallery" />
            </div>
            <div className="col-span-1 relative group cursor-pointer">
               <img src={hotel.images?.[2] || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" alt="Gallery" />
            </div>
            <div className="col-span-1 relative group cursor-pointer">
               <img src={hotel.images?.[3] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" alt="Gallery" />
            </div>
            <div className="col-span-1 relative group cursor-pointer">
               <img src={hotel.images?.[4] || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" alt="Gallery" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">
                  + {Math.max(0, (hotel.images?.length || 0) - 5)} photos
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-12">
               
               {/* 2. Header Info */}
               <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                     <span className="bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded">NEW</span>
                     <div className="flex items-center text-yellow-500">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                     <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                           {hotel.name}
                        </h1>
                        <div className="flex items-center gap-2 text-[#006ce4] text-sm font-bold underline cursor-pointer">
                           <MapPin size={16} /> {hotel.location || hotel.city} — Excellent location
                        </div>
                     </div>
                     
                     <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <div className="text-right">
                           <p className="text-sm font-bold text-gray-900">Excellent</p>
                           <p className="text-xs text-gray-500">{hotel.totalReviews || 0} reviews</p>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#003580] text-white rounded-t-lg rounded-br-lg flex items-center justify-center text-lg font-bold">
                           {hotel.averageRating?.toFixed(1) || '8.8'}
                        </div>
                     </div>
                  </div>
               </div>

               {/* 3. Narrative */}
               <div className="space-y-4 pt-10 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">Experience your stay</h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium">
                     {hotel.description}
                  </p>
               </div>

               {/* 4. Amenities */}
               <div className="space-y-6 pt-10 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">Most popular facilities</h3>
                  <div className="flex flex-wrap gap-6">
                     {hotel.amenities?.map((amenity, idx) => (
                       <div key={idx} className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                          {amenity.toLowerCase().includes('wifi') ? <Wifi size={18} /> : 
                           amenity.toLowerCase().includes('breakfast') ? <Coffee size={18} /> :
                           amenity.toLowerCase().includes('pool') ? <Waves size={18} /> :
                           <Sparkles size={18} />}
                          <span>{amenity}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* 5. Inventory (Rooms) */}
               <div className="space-y-6 pt-10 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900">Available rooms</h3>
                  <div className="grid grid-cols-1 gap-4">
                     {rooms.map(room => (
                       <div key={room._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col md:flex-row shadow-sm hover:border-[#006ce4] transition-colors">
                          <div className="p-6 flex-1 space-y-4">
                             <h4 className="text-lg font-bold text-[#006ce4] underline decoration-sky-100">{room.type}</h4>
                             <ul className="text-xs space-y-2 text-gray-600 font-medium">
                                <li className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={14} /> FREE cancellation</li>
                                <li className="flex items-center gap-2 text-emerald-600"><CheckCircle2 size={14} /> No prepayment needed – pay at the property</li>
                                <li className="flex items-center gap-2"><User size={14} /> Sleeps {room.capacity}</li>
                             </ul>
                          </div>
                          <div className="p-6 bg-gray-50 md:w-56 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-between items-end">
                             <div className="text-right">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Price for 1 night</p>
                                <p className="text-2xl font-black text-gray-900 leading-none">{formatCurrency(room.price)}</p>
                             </div>
                             <button className="btn-primary-booking w-full mt-4 h-10 py-0 flex items-center justify-center text-xs">Reserve</button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* 6. Guest Reviews */}
               <div id="reviews" className="space-y-8 pt-10 border-t border-gray-100">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">Guest reviews</h3>
                  
                  {userBooking && (
                    <div className="bg-gray-50 p-8 rounded-xl border border-gray-200 space-y-6">
                       <div className="flex justify-between items-center">
                          <h4 className="text-lg font-bold">Write a review</h4>
                          <StarRating rating={rating} onChange={setRating} size={24} />
                       </div>
                       <form onSubmit={handleReviewSubmit} className="space-y-4">
                          <textarea 
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tell us about your stay..."
                            className="w-full bg-white border border-gray-300 rounded-lg p-4 text-sm font-medium outline-none focus:border-blue-500 transition-all min-h-[120px]"
                          />
                          <button 
                            type="submit" 
                            disabled={reviewSubmitting}
                            className="btn-primary-booking"
                          >
                             {reviewSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Submit Review"}
                          </button>
                       </form>
                    </div>
                  )}

                  {reviewsLoading ? (
                    <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
                  ) : reviews.length === 0 ? (
                    <div className="py-10 text-center text-gray-400 font-bold italic">No reviews yet.</div>
                  ) : (
                    <div className="space-y-6">
                       {reviews.map((review) => (
                         <div key={review._id} className="bg-white p-6 rounded-lg border border-gray-100 space-y-4 shadow-sm">
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                                     {review.userId?.name?.charAt(0)}
                                  </div>
                                  <div>
                                     <p className="text-sm font-bold text-gray-900 uppercase">{review.userId?.name}</p>
                                     <p className="text-[10px] text-gray-400 font-medium">Reviewed on {formatDate(review.createdAt)}</p>
                                  </div>
                                </div>
                                <div className="w-8 h-8 bg-[#003580] text-white rounded-lg flex items-center justify-center text-xs font-bold">
                                   {review.rating.toFixed(1)}
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium italic">"{review.comment}"</p>
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>

            {/* Sidebar Booking Widget */}
            <div className="lg:col-span-4">
               <div className="sticky top-24 space-y-6">
                  <div className="bg-white border-2 border-booking-yellow rounded-lg p-6 shadow-lg space-y-6">
                     <h3 className="text-lg font-bold text-gray-900">Reserve your stay</h3>
                     <BookingForm 
                        hotel={hotel} 
                        rooms={rooms} 
                        onSubmit={handleBookingSubmit} 
                     />
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 space-y-4">
                     <h4 className="text-sm font-bold text-[#003b95] flex items-center gap-2">
                        <ShieldCheck size={18} /> Why book with us?
                     </h4>
                     <ul className="text-xs space-y-2 text-gray-600 font-bold">
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Best Price Guarantee</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> No hidden booking fees</li>
                        <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> Secure payment system</li>
                     </ul>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default HotelDetails;
