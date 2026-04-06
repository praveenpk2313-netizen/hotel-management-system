import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Wifi, 
  Coffee, 
  Car, 
  ShieldCheck, 
  ChevronRight, 
  Star, 
  Image as ImageIcon,
  Check,
  Info,
  Heart,
  Loader2,
  Award,
  Zap,
  ArrowLeft,
  Wind,
  Monitor,
  Users
} from 'lucide-react';
import { fetchHotelById, fetchRooms, API_BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import BookingForm from '../components/BookingForm';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(2);
  const [dateError, setDateError] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');

  useEffect(() => {
    if (location.state?.error) {
      setDateError(location.state.error);
    }
    if (location.state?.initialData) {
      const data = location.state.initialData;
      if (data.checkInDate)  setCheckIn(new Date(data.checkInDate));
      if (data.checkOutDate) setCheckOut(new Date(data.checkOutDate));
      if (data.numGuests)    setGuests(data.numGuests);
      if (data.roomId)       setSelectedRoomId(data.roomId);
    }
  }, [location.state]);

  useEffect(() => {
    if (rooms.length > 0 && !selectedRoomId) {
       setSelectedRoomId(rooms[0]._id);
    }
  }, [rooms, selectedRoomId]);

  const handleBookingSubmit = (bookingDetails) => {
    if (!user) {
       navigate('/login', { state: { from: location.pathname } });
       return;
    }

    navigate('/payment', { 
      state: { 
        selectedRoom: rooms.find(r => r._id === bookingDetails.roomId),
        hotel: hotel,
        bookingData: {
          hotelId: id,
          roomId: bookingDetails.roomId,
          checkInDate: new Date(bookingDetails.checkInDate.setHours(0,0,0,0)).toISOString(),
          checkOutDate: new Date(bookingDetails.checkOutDate.setHours(0,0,0,0)).toISOString(),
          numGuests: bookingDetails.numGuests,
          totalPrice: bookingDetails.totalPrice,
          userName: user?.name || 'Guest'
        }
      } 
    });
  };

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}/${url}`;
  };

  useEffect(() => {
    if (!id || id === 'undefined') return;

    const loadHotelData = async () => {
      setLoading(true);
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          fetchHotelById(id),
          fetchRooms(id)
        ]);
        setHotel(hotelRes.data);
        setRooms(roomsRes.data);
      } catch (err) {
        setError('Failed to load property details.');
      } finally {
        setLoading(false);
      }
    };
    loadHotelData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 pt-40">
      <Loader2 size={40} className="animate-spin text-luxury-gold" />
      <p className="text-sm font-black text-slate-400 font-sans tracking-widest uppercase">Initializing Sanctuary...</p>
    </div>
  );

  if (error || !hotel) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 pt-40 font-sans">
       <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
          <Info size={40} />
       </div>
       <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-serif">Property not found</h2>
          <p className="text-slate-500 font-medium italic">This property listing may have been moved to our private collection.</p>
       </div>
       <button onClick={() => navigate('/hotels')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-luxury-gold transition-all">Return to Catalog</button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-24 pt-32 lg:pt-40 font-serif text-slate-900 overflow-x-hidden">
      
      {/* 1. Context & Navigation */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-8">
         <button 
           onClick={() => navigate('/hotels')} 
           className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-luxury-gold transition-colors font-sans uppercase tracking-[0.2em]"
         >
            <ArrowLeft size={14} className="stroke-[3px]" /> Back to Search
         </button>
      </div>
      
      {/* 2. Gallery Grid */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-16 animate-fade-in">
         {hotel.images && hotel.images.length > 0 ? (
            <div className={`grid gap-4 overflow-hidden rounded-[2rem] 
              ${hotel.images.length === 1 ? 'grid-cols-1 h-[400px] md:h-[600px]' : 
                hotel.images.length === 2 ? 'grid-cols-1 md:grid-cols-2 h-[300px] md:h-[500px]' : 
                'grid-cols-1 md:grid-cols-4 h-[300px] md:h-[550px] lg:h-[650px]'}`}
            >
               {/* Main Image */}
               <div className={`${hotel.images.length >= 3 ? 'md:col-span-2' : ''} relative group cursor-pointer overflow-hidden`}>
                  <img 
                    src={getImageUrl(hotel.images[0])} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    alt={hotel.name} 
                  />
               </div>

               {/* Subsequent Images */}
               {hotel.images.length === 2 && (
                  <div className="relative group cursor-pointer overflow-hidden">
                     <img 
                        src={getImageUrl(hotel.images[1])} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                        alt="Interior" 
                     />
                  </div>
               )}

               {hotel.images.length >= 3 && (
                  <>
                     <div className="hidden md:flex flex-col gap-4">
                        <div className="flex-1 relative group cursor-pointer overflow-hidden rounded-2xl">
                           <img 
                              src={getImageUrl(hotel.images[1])} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                              alt="Interior" 
                           />
                        </div>
                        {hotel.images[2] && (
                           <div className="flex-1 relative group cursor-pointer overflow-hidden rounded-2xl">
                              <img 
                                 src={getImageUrl(hotel.images[2])} 
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                                 alt="Interior" 
                              />
                           </div>
                        )}
                     </div>
                     {hotel.images[3] && (
                        <div className="hidden md:block relative group cursor-pointer overflow-hidden">
                           <img 
                              src={getImageUrl(hotel.images[3])} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                              alt="Interior" 
                           />
                           {hotel.images.length > 4 && (
                              <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full font-sans text-[10px] font-black uppercase tracking-widest shadow-xl">
                                 +{hotel.images.length - 4} More
                              </div>
                           )}
                        </div>
                     )}
                  </>
               )}
            </div>
         ) : (
            <div className="h-[400px] bg-slate-50 flex flex-col items-center justify-center gap-4 rounded-[2rem] border border-slate-100 italic text-slate-400 font-sans">
               <ImageIcon size={48} className="opacity-20" />
               <p className="text-sm font-bold uppercase tracking-widest">No property images available</p>
            </div>
         )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
         {/* 3. Header Info Section */}
         <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-20 border-b border-slate-100 pb-12">
            <div>
               <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4 lowercase">{hotel.name}</h1>
               <div className="flex items-center gap-2 text-slate-400 font-sans">
                  <MapPin size={22} />
                  <span className="text-lg font-bold">{hotel.location}</span>
               </div>
            </div>
            <div className="flex flex-col items-end gap-3 pt-4">
               <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={28} className="text-orange-400 fill-orange-400" />
                  ))}
                  <span className="ml-3 text-3xl font-black text-slate-900 font-sans">5.0</span>
               </div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
                  {hotel.totalReviews || 3} Verified Reviews
               </p>
            </div>
         </div>

         {/* Main Grid Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
            
            {/* L: Information (8/12) */}
            <div className="lg:col-span-8 space-y-24">
               
               <section className="space-y-10">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">About this property</h2>
                  <div className="max-w-none text-xl leading-relaxed text-slate-500 font-sans">
                     <p>
                        {hotel.description || "nice"}
                     </p>
                  </div>
               </section>

               <section className="space-y-10">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Premium Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                     {hotel.amenities && hotel.amenities.length > 0 ? (
                        hotel.amenities.map((amenity, idx) => {
                           const iconMap = {
                              wifi: Wifi,
                              pool: Wind,
                              gym: SlidersHorizontal,
                              spa: Star,
                              breakfast: Coffee,
                              ac: Snowflake,
                              parking: Car,
                              tv: Monitor
                           };
                           // Handle both IDs and potentially old labels using regex matching
                           const getIcon = (a) => {
                              const lower = a.toLowerCase();
                              if (lower.includes('wifi')) return Wifi;
                              if (lower.includes('pool')) return Wind;
                              if (lower.includes('gym') || lower.includes('fitness')) return SlidersHorizontal;
                              if (lower.includes('spa')) return Star;
                              if (lower.includes('breakfast')) return Coffee;
                              if (lower.includes('ac') || lower.includes('air')) return Snowflake;
                              if (lower.includes('parking')) return Car;
                              if (lower.includes('tv')) return Monitor;
                              return ShieldCheck;
                           };
                           const Icon = getIcon(amenity);
                           const label = amenity.replace(/[^a-zA-Z\s]/g, '').trim();

                           return (
                              <div key={idx} className="flex items-center gap-6 p-6 bg-luxury-gold/5 rounded-[2rem] border border-luxury-gold/10 transition-all hover:bg-luxury-gold/10 group">
                                 <div className="w-16 h-16 bg-white shadow-sm rounded-2xl flex items-center justify-center text-luxury-gold group-hover:scale-110 transition-transform">
                                    <Icon size={28} />
                                 </div>
                                 <span className="text-lg font-black text-slate-700 uppercase tracking-widest font-sans">{label || amenity}</span>
                              </div>
                           );
                        })
                     ) : (
                        <p className="text-slate-400 font-medium italic">Standard luxury essentials included.</p>
                     )}
                  </div>
               </section>

               {/* Availability */}
               <section id="availability" className="space-y-12">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Available Room Types</h2>
                  <div className="space-y-8">
                     {rooms.length === 0 ? (
                       <div className="p-20 text-center bg-slate-50 rounded-[2.5rem] border border-slate-100 border-dashed font-sans">
                          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Refreshing boutique inventory...</p>
                       </div>
                     ) : (
                       <div className="grid grid-cols-1 gap-10">
                         {rooms.map((room) => (
                           <RoomCard 
                             key={room._id} 
                             room={room} 
                             hotelId={id} 
                             hotelName={hotel.name}
                             hotel={hotel}
                             checkIn={checkIn}
                             checkOut={checkOut}
                             guests={guests}
                             onBookError={(msg) => setDateError(msg)}
                             isSelected={selectedRoomId === room._id}
                             onSelect={(rid) => setSelectedRoomId(rid)}
                           />
                         ))}
                       </div>
                     )}
                  </div>
               </section>

               {/* Reviews */}
               <section className="space-y-12">
                  <div className="grid grid-cols-1 gap-8 font-sans">
                     {[1,2,3].map((i) => (
                       <div key={i} className="p-10 bg-white border border-slate-100 rounded-[2.5rem] space-y-8 shadow-sm transition-all hover:shadow-md group">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
                                   <Users size={28} />
                                </div>
                                <div className="space-y-1">
                                   <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{i === 1 ? 'parthi' : 'PRAVEEN KUMAR R'}</p>
                                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verified Stay • {25-i} March 2026</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, j) => (
                                  <Star key={j} size={18} className="text-orange-400 fill-orange-400" />
                                ))}
                             </div>
                          </div>
                          <p className="text-2xl text-slate-600 italic font-serif opacity-80">"{i === 1 ? 'hi' : i === 2 ? 'perfect' : 'good'}"</p>
                       </div>
                     ))}
                  </div>
               </section>
            </div>

            {/* R: Sidebar Sticky (4/12) */}
            <div className="lg:col-span-4 font-sans">
               <div className="sticky top-32 h-fit">
                  <BookingForm 
                    hotel={hotel}
                    rooms={rooms}
                    onSubmit={handleBookingSubmit}
                    initialCheckIn={checkIn}
                    initialCheckOut={checkOut}
                    initialGuests={guests}
                    initialRoomId={selectedRoomId}
                    initialError={dateError}
                  />
               </div>
            </div>

         </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default HotelDetails;
