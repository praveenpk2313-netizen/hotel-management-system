import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  ArrowLeft,
  Share2,
  Heart,
  Clock,
  Navigation,
  Loader2,
  Globe,
  Award,
  Zap
} from 'lucide-react';
import { fetchHotelById, fetchRooms, createBooking } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(2);
  const [dateError, setDateError] = useState('');

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
      <Loader2 size={40} className="animate-spin text-cyan-600" />
      <p className="text-sm font-bold text-slate-500 font-sans tracking-wide uppercase">Sourcing availability...</p>
    </div>
  );

  if (error || !hotel) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 pt-40 font-sans">
       <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 shadow-inner">
          <Info size={40} />
       </div>
       <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Property not found</h2>
          <p className="text-slate-500 font-medium">This property listing may have expired or been removed.</p>
       </div>
       <button onClick={() => navigate('/hotels')} className="btn-primary-booking">Return to search</button>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-32 lg:pt-40 font-sans">
      
      {/* 1. INTERACTIVE HEADER & BREADCRUMBS ────────────────────────── */}
      <div className="container-booking space-y-4 mb-8">
         <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <button onClick={() => navigate('/')} className="hover:text-cyan-600 transition-colors">Home</button>
            <ChevronRight size={14} />
            <button onClick={() => navigate('/hotels')} className="hover:text-cyan-600 transition-colors">Hotels</button>
            <ChevronRight size={14} />
            <span className="text-slate-900">{hotel.name}</span>
         </div>

         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
               <h1 className="h2-section">{hotel.name}</h1>
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-amber-500 p-1.5 rounded-md shadow-sm">
                     <Star size={12} fill="white" stroke="white" />
                     <Star size={12} fill="white" stroke="white" />
                     <Star size={12} fill="white" stroke="white" />
                     <Star size={12} fill="white" stroke="white" />
                  </div>
                  <p className="text-sm font-bold text-cyan-600 flex items-center gap-1">
                     <MapPin size={16} /> {hotel.location} — <span className="hover:text-cyan-700 transition-colors cursor-pointer">Excellent location - show map</span>
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="h-12 px-6 bg-white border border-slate-200 text-slate-700 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
                  <Heart size={18} className="text-rose-500" /> Save
               </button>
               <button onClick={() => document.getElementById('availability').scrollIntoView({ behavior: 'smooth' })} className="btn-primary-booking">
                  Reserve now
               </button>
            </div>
         </div>
      </div>
      
      {/* 2. GALLERY GRID ─────────────────────────────────────────── */}
      <div className="container-booking mt-6">
         <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[350px] md:h-[450px] lg:h-[550px] rounded-[24px] overflow-hidden shadow-soft">
            <div className="col-span-2 row-span-2 relative group cursor-pointer overflow-hidden">
               <img src={hotel.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={hotel.name} />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden">
               <img src={hotel.images?.[1] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Interior" />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden">
               <img src={hotel.images?.[2] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Interior" />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer overflow-hidden">
               <img src={hotel.images?.[3] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Interior" />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer bg-slate-900 overflow-hidden">
               <img src={hotel.images?.[4] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700" alt="Interior" />
               <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <ImageIcon size={32} />
                  <span className="text-sm font-bold mt-2 uppercase tracking-widest">+{hotel.images?.length || 0} photos</span>
               </div>
            </div>
         </div>
      </div>

      <div className="container-booking mt-12">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* L: Main Information */}
            <div className="lg:col-span-8 space-y-12">
               
               {/* High-level Experience */}
               <section className="space-y-8">
                  <div className="flex flex-wrap items-center gap-6 py-8 border-y border-slate-200">
                     <div className="flex items-center gap-2 text-sm text-slate-800 font-bold bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                        <Wifi size={18} className="text-cyan-600" /> Free WiFi
                     </div>
                     <div className="flex items-center gap-2 text-sm text-slate-800 font-bold bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                        <Car size={18} className="text-cyan-600" /> Free Parking
                     </div>
                     <div className="flex items-center gap-2 text-sm text-slate-800 font-bold bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                        <Coffee size={18} className="text-cyan-600" /> Breakfast included
                     </div>
                     <div className="flex items-center gap-2 text-sm text-slate-800 font-bold bg-white px-4 py-2 rounded-lg border border-slate-100 shadow-sm">
                        <Clock size={18} className="text-cyan-600" /> 24-hour front desk
                     </div>
                  </div>

                  <div className="prose prose-p:text-slate-600 prose-p:leading-relaxed max-w-none">
                     <p className="text-[16px]">
                        {hotel.description || "Stay in the heart of the city at this exceptionally rated property. Offering elite comfort and world-class service, this hotel provides the perfect base for your visit. Guests consistently praise the attentive staff and the modern amenities. Each room is designed for maximum relaxation with high-speed internet and premium bedding."}
                     </p>
                  </div>
               </section>

               {/* Availability Table Header */}
               <section id="availability" className="space-y-8 pt-8 border-t border-slate-200">
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Availability</h2>
                  
                  {/* Select Dates Form */}
                  <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-4">
                     <h3 className="text-lg font-bold text-slate-900">Select your dates</h3>
                     {dateError && <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-sm text-rose-600 font-bold">{dateError}</div>}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Check-in Date</label>
                           <DatePicker 
                             selected={checkIn}
                             onChange={date => { setCheckIn(date); setDateError(''); }}
                             minDate={new Date()}
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:bg-white transition-all font-bold text-slate-900"
                             placeholderText="Select check-in"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Check-out Date</label>
                           <DatePicker 
                             selected={checkOut}
                             onChange={date => { setCheckOut(date); setDateError(''); }}
                             minDate={checkIn || new Date()}
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:bg-white transition-all font-bold text-slate-900"
                             placeholderText="Select check-out"
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Guests</label>
                           <select 
                             value={guests} 
                             onChange={(e) => setGuests(parseInt(e.target.value))}
                             className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-cyan-500 focus:bg-white transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                           >
                             {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Adult{n>1?'s':''}</option>)}
                           </select>
                        </div>
                     </div>
                  </div>

                  <div className="bg-cyan-50/50 p-6 rounded-[24px] border border-cyan-100 flex items-center gap-4">
                     <Info size={28} className="text-cyan-600 flex-shrink-0" />
                     <p className="text-sm font-bold text-slate-800">These prices are exclusive to our members. Sign in to save even more on your stay.</p>
                  </div>

                  <div className="space-y-6">
                     {rooms.length === 0 ? (
                       <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                          <p className="text-sm font-bold text-slate-500">No rooms currently available for the selected dates.</p>
                       </div>
                     ) : (
                       <div className="grid grid-cols-1 gap-6">
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
                           />
                         ))}
                       </div>
                     )}
                  </div>
               </section>

               {/* Reviews Section */}
               <section className="space-y-8 pt-10 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                     <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Guest reviews</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[1,2,3].map((i) => (
                       <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-sm hover:border-cyan-500 transition-all cursor-default">
                          <div className="flex items-center gap-3">
                             <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-lg">9.{i}</div>
                             <div>
                                <p className="text-sm font-bold text-slate-900">Excellent Experience</p>
                                <p className="text-xs text-slate-500 mt-0.5">Verified Guest • March 2026</p>
                             </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed italic">"The breakfast was exceptional and the staff went above and beyond to make our anniversary special. Highly recommended."</p>
                       </div>
                     ))}
                  </div>
               </section>
            </div>

            {/* R: Dynamic Sidebar Info */}
            <div className="lg:col-span-4 space-y-8">
               <div className="sticky top-32 space-y-8">
                  
                  {/* Property Highlights */}
                  <div className="glass-card bg-cyan-50/30 p-8 rounded-[24px] border border-cyan-100 space-y-8 shadow-soft">
                     <h3 className="text-xl font-bold text-slate-900">Property highlights</h3>
                     <div className="space-y-5">
                        <div className="flex items-start gap-4">
                           <div className="mt-1 bg-white p-2 rounded-lg shadow-sm"><Zap size={20} className="text-cyan-600" fill="currentColor" /></div>
                           <p className="text-sm font-bold text-slate-700 leading-relaxed pt-1.5">Perfect for a 1-night stay!</p>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="mt-1 bg-white p-2 rounded-lg shadow-sm"><MapPin size={20} className="text-cyan-600" /></div>
                           <p className="text-sm font-bold text-slate-700 leading-relaxed pt-1.5">Located in the heart of {hotel.city || 'the city'}, this property has an excellent location score of 9.3!</p>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="mt-1 bg-white p-2 rounded-lg shadow-sm"><Clock size={20} className="text-cyan-600" /></div>
                           <p className="text-sm font-bold text-slate-700 leading-relaxed pt-1.5">24-hour front desk - assistance whenever you need it.</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => document.getElementById('availability').scrollIntoView({ behavior: 'smooth' })}
                        className="w-full h-14 bg-cyan-600 text-white rounded-xl font-bold text-base hover:bg-cyan-700 transition-all shadow-md active:scale-[0.98]"
                     >
                        Reserve your stay
                     </button>
                  </div>

                  {/* Trust Factors */}
                  <div className="bg-white p-8 rounded-[24px] border border-slate-200 space-y-5 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 shadow-sm">
                     <div className="flex items-center gap-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
                        <ShieldCheck size={20} className="text-emerald-500" /> Secure Booking
                     </div>
                     <div className="flex items-center gap-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
                        <Check size={20} className="text-emerald-500" /> Instant confirmation
                     </div>
                     <div className="flex items-center gap-4 text-xs font-bold text-slate-600 uppercase tracking-widest">
                        <Award size={20} className="text-amber-500" /> Best Price Guarantee
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

    </div>
  );
};

export default HotelDetails;
