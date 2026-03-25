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
  Zap
} from 'lucide-react';
import { fetchHotelById, fetchRooms } from '../services/api';
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

  useEffect(() => {
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
    <div className="bg-white min-h-screen pb-24 pt-32 lg:pt-40 font-serif text-slate-900">
      
      {/* 1. Header & Context */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-12">
         <div className="flex flex-wrap items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest font-sans mb-8">
            <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/hotels" className="hover:text-luxury-gold transition-colors">Hotels</Link>
            <ChevronRight size={12} />
            <span className="text-slate-900">{hotel.name}</span>
         </div>

         <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
               <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">{hotel.name}</h1>
               <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 bg-luxury-gold/10 px-3 py-1.5 rounded-full border border-luxury-gold/20 shadow-sm font-sans">
                     <Star size={12} className="text-luxury-gold fill-luxury-gold" />
                     <span className="text-luxury-gold text-xs font-black leading-none">{hotel.averageRating ? hotel.averageRating.toFixed(1) : '5.0'}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-500 font-sans flex items-center gap-2 italic">
                     <MapPin size={18} className="text-luxury-gold" /> {hotel.location}
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <button className="h-14 px-8 bg-white border border-slate-200 text-slate-900 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all font-sans">
                  <Heart size={18} className="text-rose-500" /> Save Property
               </button>
               <button onClick={() => document.getElementById('availability').scrollIntoView({ behavior: 'smooth' })} className="h-14 px-10 bg-slate-900 text-white rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest hover:bg-luxury-gold transition-all font-sans shadow-xl shadow-slate-900/10">
                  Select A Suite
               </button>
            </div>
         </div>
      </div>
      
      {/* 2. Gallery */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-20 animate-fade-in">
         <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[450px] md:h-[550px] lg:h-[650px] rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50">
            <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden border-r border-white">
               <img src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={hotel.name} />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden border-b border-white">
               <img src={hotel.images?.[1] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Interior" />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden border-b border-l border-white">
               <img src={hotel.images?.[2] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Interior" />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden">
               <img src={hotel.images?.[3] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Interior" />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer bg-slate-900 overflow-hidden border-l border-white">
               <img src={hotel.images?.[4] || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-1000" alt="Interior" />
               <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-sans">
                  <ImageIcon size={32} />
                  <span className="text-[10px] font-black mt-3 uppercase tracking-[0.2em]">+{hotel.images?.length || 0} photos</span>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
         <div className="flex flex-col lg:flex-row gap-20">
            
            {/* L: Information */}
            <div className="lg:col-span-8 flex-1 space-y-20">
               
               <section className="space-y-12">
                  <div className="flex flex-wrap items-center gap-10 py-10 border-y border-slate-100 font-sans">
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                        <Wifi size={20} className="text-luxury-gold" /> Free High-Speed WiFi
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                        <Car size={20} className="text-luxury-gold" /> Valet Parking
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                        <Coffee size={20} className="text-luxury-gold" /> Gourmet Breakfast
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-widest">
                        <ShieldCheck size={20} className="text-luxury-gold" /> Elite Concierge
                     </div>
                  </div>

                  <div className="max-w-none text-xl lg:text-3xl leading-relaxed text-slate-800 italic opacity-90 font-serif">
                     <p>
                        "{hotel.description || "Stay in the heart of the city at this exceptionally rated property. Offering elite comfort and world-class service, this sanctuary provides the perfect base for your visit."}"
                     </p>
                  </div>
               </section>

               {/* Availability */}
               <section id="availability" className="space-y-12 pt-20 border-t border-slate-100">
                  <div className="space-y-4">
                    <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic">Available Sanctuaries</h2>
                    <p className="text-slate-500 font-sans font-medium text-lg">Choose the perfect living space for your upcoming stay.</p>
                  </div>
                  
                  <div className="bg-luxury-gold/5 p-8 rounded-[2rem] border border-luxury-gold/10 flex items-center gap-6 font-sans">
                     <div className="w-14 h-14 bg-luxury-gold shadow-lg rounded-2xl flex items-center justify-center text-white shrink-0">
                        <Zap size={28} className="fill-white" />
                     </div>
                     <p className="text-sm font-bold text-slate-800">Exclusive Luxury Collection Pricing applied. Book directly for the best available rates and complimentary upgrades.</p>
                  </div>

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
               <section className="space-y-12 pt-20 border-t border-slate-100">
                  <h2 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic">Guest Sentiment</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 font-sans">
                     {[1,2].map((i) => (
                       <div key={i} className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] space-y-6 transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 group">
                          <div className="flex items-center gap-4">
                             <div className="w-16 h-16 bg-slate-900 text-white rounded-[1.25rem] flex items-center justify-center font-black text-xl tracking-tight">9.{i+5}</div>
                             <div>
                                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Exceptional Experience</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">Verified Resident • March 2026</p>
                             </div>
                          </div>
                          <p className="text-lg text-slate-600 leading-relaxed italic opacity-80 font-serif">"The hospitality was beyond measure. From the check-in experience to the private terrace views, everything was curated to perfection."</p>
                       </div>
                     ))}
                  </div>
               </section>
            </div>

            {/* R: Sidebar Sticky */}
            <div className="lg:w-[420px] shrink-0 font-sans">
               <div className="sticky top-32 space-y-10">
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

                  <div className="bg-slate-50/50 p-10 rounded-[2.5rem] border border-slate-100 space-y-6">
                     <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <ShieldCheck size={20} className="text-emerald-500" /> Secure Protocol
                     </div>
                     <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Check size={20} className="text-emerald-500" /> Instant Confirmation
                     </div>
                     <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Award size={20} className="text-luxury-gold" /> Best Rate Guarantee
                     </div>
                  </div>
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
