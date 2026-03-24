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
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Consulting Archive...</p>
    </div>
  );

  if (error || !hotel) return (
    <div className="max-w-xl mx-auto py-24 px-6 text-center space-y-8">
       <div className="w-20 h-20 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-500 mx-auto shadow-sm">
          <Info size={40} />
       </div>
       <h2 className="text-3xl font-serif text-secondary-dark font-black tracking-tight">{error || 'Property Not Found'}</h2>
       <button onClick={() => navigate('/hotels')} className="btn-gold">Return to Collection</button>
    </div>
  );

  return (
    <div className="animate-fade-in bg-background-light pb-24">
      
      {/* Immersive Gallery Header */}
      <div className="relative h-[65vh] md:h-[75vh] min-h-[500px] group overflow-hidden">
         <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-2 p-2">
            <div className="md:col-span-2 lg:col-span-2 relative overflow-hidden rounded-[2rem] md:rounded-l-[3.5rem] md:rounded-r-none">
               <img src={hotel.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[5s]" alt={hotel.name} />
               <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2 md:col-span-2 lg:col-span-2">
               <div className="grid grid-cols-2 gap-2">
                  <div className="relative overflow-hidden rounded-2xl">
                     <img src={hotel.images?.[1] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" alt="Gallery" />
                  </div>
                  <div className="relative overflow-hidden rounded-tr-[3.5rem]">
                     <img src={hotel.images?.[2] || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" alt="Gallery" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-2">
                  <div className="relative overflow-hidden rounded-bl-none">
                     <img src={hotel.images?.[3] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover" alt="Gallery" />
                  </div>
                  <div className="relative overflow-hidden rounded-br-[3.5rem] group/more">
                     <img src={hotel.images?.[4] || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover brightness-50" alt="Gallery" />
                     <div className="absolute inset-0 flex items-center justify-center text-white font-black text-xs uppercase tracking-[3px]">
                        + {Math.max(0, (hotel.images?.length || 0) - 5)} Legacy Views
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Overlay Controls */}
         <div className="absolute top-10 inset-x-10 flex justify-between items-center pointer-events-none">
            <button onClick={() => navigate(-1)} className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-secondary-dark transition-all pointer-events-auto shadow-2xl">
               <ArrowLeft size={24} />
            </button>
            <div className="flex gap-4 pointer-events-auto">
               <button className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-rose-500 hover:border-rose-500 transition-all shadow-2xl">
                  <Heart size={24} />
               </button>
               <button className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-primary transition-all shadow-2xl">
                  <Share2 size={24} />
               </button>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-16">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Intelligence (Col 8) */}
            <div className="lg:col-span-8 space-y-16">
               <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-4">
                     <div className="px-3 py-1 bg-primary/10 rounded-full text-primary font-black text-[10px] uppercase tracking-[3px] flex items-center gap-2">
                        <Award size={14} className="animate-pulse" /> Heritage Collection
                     </div>
                     <div className="px-3 py-1 bg-emerald-50 rounded-full text-emerald-600 font-black text-[10px] uppercase tracking-[3px] flex items-center gap-2">
                        <ShieldCheck size={14} /> Official Partnership
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                     <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-secondary-dark font-black tracking-tight leading-[1.1]">
                           {hotel.name}
                        </h1>
                        <p className="text-xl text-gray-400 font-bold flex items-center gap-3 uppercase tracking-widest">
                           <MapPin size={24} className="text-primary" /> {hotel.location || hotel.city}
                        </p>
                     </div>
                     
                     <div className="bg-white p-6 rounded-[2.5rem] shadow-premium border border-gray-50 flex items-center gap-6 group hover:-translate-y-1 transition-transform">
                        <div className="text-center">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Index Score</p>
                           <div className="flex items-center justify-center gap-2">
                              <Star size={20} fill="#C5A059" color="#C5A059" />
                              <span className="text-2xl font-black text-secondary-dark">{hotel.averageRating?.toFixed(1) || '0.0'}</span>
                           </div>
                        </div>
                        <div className="w-px h-10 bg-gray-100" />
                        <div className="text-center">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Covenants</p>
                           <p className="text-lg font-bold text-secondary-dark">{hotel.totalReviews || 0}</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Section: Narrative */}
               <div className="space-y-6">
                  <h3 className="text-2xl font-serif text-secondary-dark font-black flex items-center gap-3">
                     <div className="w-1.5 h-8 bg-primary rounded-full" /> Narrative & Ambiance
                  </h3>
                  <div className="relative group">
                     <p className="text-lg text-gray-500 font-medium leading-[2] bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm group-hover:shadow-premium transition-all">
                        {hotel.description}
                     </p>
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Sparkles size={100} className="text-primary" />
                     </div>
                  </div>
               </div>

               {/* Section: Amenities */}
               <div className="space-y-8">
                  <h3 className="text-2xl font-serif text-secondary-dark font-black flex items-center gap-3">
                     <div className="w-1.5 h-8 bg-primary rounded-full" /> Elite Provisions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {hotel.amenities?.map((amenity, idx) => (
                       <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-50 shadow-sm hover:shadow-premium group transition-all duration-500 text-center space-y-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                             {amenity.toLowerCase().includes('wifi') ? <Wifi size={24} /> : 
                              amenity.toLowerCase().includes('breakfast') || amenity.toLowerCase().includes('restaurant') ? <Coffee size={24} /> :
                              amenity.toLowerCase().includes('pool') ? <Waves size={24} /> :
                              amenity.toLowerCase().includes('security') ? <Lock size={24} /> :
                              <Sparkles size={24} />}
                          </div>
                          <span className="block text-[10px] font-black text-secondary-dark uppercase tracking-widest leading-tight">{amenity}</span>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Section: Suite Inventory */}
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                     <h3 className="text-2xl font-serif text-secondary-dark font-black flex items-center gap-3">
                        <div className="w-1.5 h-8 bg-primary rounded-full" /> Executive Suites
                     </h3>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={14} className="text-primary" /> Instant Reservation
                     </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {rooms.map(room => (
                      <div key={room._id} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-500 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-6 text-center md:text-left">
                           <div className="w-16 h-16 bg-secondary-dark text-primary rounded-[1.5rem] flex items-center justify-center shadow-lg transform -rotate-3 group-hover:rotate-0 transition-transform">
                              <Calendar size={28} />
                           </div>
                           <div>
                              <h4 className="text-xl font-bold text-secondary-dark">{room.type}</h4>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mt-1 flex items-center justify-center md:justify-start gap-2">
                                 <User size={12} /> {room.capacity} GUESTS • {room.totalRooms} SUITES REMAINING
                              </p>
                           </div>
                        </div>
                        <div className="flex flex-col items-center md:items-end gap-1">
                           <p className="text-3xl font-black text-primary italic font-serif leading-none tracking-tighter">
                              {formatCurrency(room.price)}
                           </p>
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Rate / Night</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Section: Experiences (Reviews) */}
               <div id="reviews" className="space-y-12 pt-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                     <div className="space-y-3">
                        <h3 className="text-3xl md:text-4xl font-serif text-secondary-dark font-black tracking-tight">
                           Guest <span className="text-primary italic">Perspectives</span>
                        </h3>
                        <p className="text-gray-400 font-medium uppercase tracking-[2px] text-xs">Authentic insights from verified stays.</p>
                     </div>
                     <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
                        <div className="flex items-center gap-2">
                           <Star size={20} fill="#C5A059" color="#C5A059" />
                           <span className="text-xl font-black text-secondary-dark">{hotel.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="w-px h-6 bg-gray-100" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Based on {hotel.totalReviews || 0} audits</span>
                     </div>
                  </div>

                  {/* Redesigned Review Input Box */}
                  {userBooking && (
                    <div className="bg-secondary-dark p-10 md:p-12 rounded-[3.5rem] shadow-premium-dark relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                       <div className="relative z-10 space-y-10">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                             <div className="space-y-2">
                                <h4 className="text-2xl font-serif text-white font-bold tracking-tight">Post-Stay Audit</h4>
                                <p className="text-gray-400 font-medium text-sm">Provide your technical insight on the stay quality.</p>
                             </div>
                             <div className="flex flex-col items-center gap-2">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Commit Rating</p>
                                <StarRating rating={rating} onChange={setRating} size={36} />
                             </div>
                          </div>

                          <form onSubmit={handleReviewSubmit} className="space-y-8">
                             <textarea 
                               required
                               value={comment}
                               onChange={(e) => setComment(e.target.value)}
                               placeholder="Draft your detailed property analysis..."
                               className="w-full bg-white/5 border-2 border-white/10 rounded-[2rem] p-8 text-white text-lg font-medium outline-none focus:border-primary transition-all resize-none min-h-[160px]"
                             />
                             <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-4">
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic flex items-center gap-2">
                                   <ShieldCheck size={14} className="text-primary" /> LOGGED AS AUTHENTICATED USER
                                </p>
                                <button 
                                  type="submit" 
                                  disabled={reviewSubmitting}
                                  className="w-full md:w-auto px-12 h-16 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark hover:-translate-y-1 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                >
                                   {reviewSubmitting ? <Loader2 size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                                   Submit Verified Audit
                                </button>
                             </div>
                          </form>
                       </div>
                    </div>
                  )}

                  {reviewSuccess && (
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[2.5rem] flex items-center gap-4 text-emerald-700 text-sm font-bold animate-slide-up">
                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm"><CheckCircle2 size={24} /></div>
                        {reviewSuccess}
                    </div>
                  )}

                  {/* Reviews List */}
                  {reviewsLoading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" size={40} /></div>
                  ) : reviews.length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 space-y-4">
                       <MessageSquare size={48} className="text-gray-200 mx-auto" />
                       <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No archives found yet.</p>
                       <h4 className="text-xl font-serif text-secondary-dark font-bold">Be the first to narrate.</h4>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-10">
                       {reviews.map((review) => (
                         <div key={review._id} className="bg-white p-10 md:p-12 rounded-[3.5rem] border border-gray-50 shadow-sm hover:shadow-premium transition-all duration-700">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10">
                               <div className="flex items-center gap-6">
                                  <div className="w-16 h-16 rounded-[1.5rem] border-4 border-white shadow-premium overflow-hidden bg-gray-50 flex items-center justify-center text-primary font-black text-xl">
                                     {review.userId?.avatar ? <img src={review.userId.avatar} className="w-full h-full object-cover" alt="User" /> : (review.userId?.name?.charAt(0) || 'G')}
                                  </div>
                                  <div>
                                     <h4 className="text-xl font-bold text-secondary-dark tracking-tight">{review.userId?.name}</h4>
                                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Verified Stay • {formatDate(review.createdAt)}</p>
                                  </div>
                               </div>
                               <div className="bg-gray-50/50 px-4 py-2 rounded-2xl border border-gray-100">
                                  <StarRating rating={review.rating} readOnly size={18} />
                                </div>
                            </div>
                            
                            <div className="relative">
                               <div className="absolute -top-6 -left-4 text-primary opacity-10 text-8xl font-serif">“</div>
                               <p className="text-lg text-gray-500 font-medium leading-[1.8] pl-6 pt-4 italic">
                                  {review.comment}
                               </p>
                            </div>

                            {review.managerReply && (
                              <div className="mt-10 p-8 bg-gray-50/80 rounded-[2.5rem] border-l-4 border-primary space-y-3">
                                 <p className="text-[10px] font-black text-primary uppercase tracking-[3px] flex items-center gap-2">
                                    <ShieldCheck size={14} /> Property Management Feedback
                                 </p>
                                 <p className="text-md text-secondary-dark font-medium leading-relaxed italic">
                                    "{review.managerReply}"
                                 </p>
                              </div>
                            )}
                         </div>
                       ))}
                    </div>
                  )}
               </div>
            </div>

            {/* Right Column: Dynamic Booking Suite (Col 4) */}
            <div className="lg:col-span-4">
               <div className="sticky top-10 space-y-8 animate-slide-right delay-300">
                  
                  {/* The actual BookingForm Component */}
                  <div className="shadow-2xl rounded-[3rem] overflow-hidden">
                     <BookingForm 
                        hotel={hotel} 
                        rooms={rooms} 
                        onSubmit={handleBookingSubmit} 
                     />
                  </div>

                  {/* Additional Value Proposition */}
                  <div className="bg-secondary-dark p-10 rounded-[3rem] text-white space-y-8 shadow-premium-dark relative overflow-hidden group">
                     {/* Decoration */}
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/40 transition-colors" />
                     
                     <div className="space-y-4 relative z-10 text-center">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-primary mx-auto border border-white/10 group-hover:rotate-12 transition-transform">
                           <Shield size={28} />
                        </div>
                        <h4 className="text-xl font-serif font-black tracking-tight">Trust Archive</h4>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed">Verified properties on PK UrbanStay adhere to international safety and hospitality covenants.</p>
                     </div>
                     
                     <div className="space-y-4 relative z-10 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center px-2">
                           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Protocol</span>
                           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[2px] flex items-center gap-1">
                              <CheckCircle2 size={12} /> SECURE
                           </span>
                        </div>
                        <button 
                           onClick={() => document.getElementById('reviews').scrollIntoView({ behavior: 'smooth' })}
                           className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-secondary-dark transition-all"
                        >
                           Examine Archives <ArrowRight size={16} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-right { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-right { animation: slide-right 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default HotelDetails;
