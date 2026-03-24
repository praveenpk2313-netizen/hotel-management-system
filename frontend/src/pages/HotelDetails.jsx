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
import { fetchHotelById, fetchRoomsByHotelId, submitBooking } from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';

const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadHotelData = async () => {
      setLoading(true);
      try {
        const [hotelRes, roomsRes] = await Promise.all([
          fetchHotelById(id),
          fetchRoomsByHotelId(id)
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
      <Loader2 size={40} className="animate-spin text-[#006ce4]" />
      <p className="text-sm font-bold text-gray-500 font-sans">Sourcing availability...</p>
    </div>
  );

  if (error || !hotel) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 pt-40 font-sans">
       <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500">
          <Info size={40} />
       </div>
       <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Property not found</h2>
          <p className="text-gray-500 font-medium">This property listing may have expired or been removed.</p>
       </div>
       <button onClick={() => navigate('/hotels')} className="btn-primary-booking">Return to search</button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pb-24 pt-32 lg:pt-40 font-sans">
      
      {/* 1. INTERACTIVE HEADER & BREADCRUMBS ────────────────────────── */}
      <div className="container-booking space-y-4 mb-8">
         <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-[#006ce4] transition-colors">Home</button>
            <ChevronRight size={14} />
            <button onClick={() => navigate('/hotels')} className="hover:text-[#006ce4] transition-colors">Hotels</button>
            <ChevronRight size={14} />
            <span className="text-gray-900">{hotel.name}</span>
         </div>

         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
               <h1 className="text-3xl font-black text-gray-900 tracking-tight">{hotel.name}</h1>
               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-[#ffb700] p-1 rounded">
                     <Star size={12} fill="white" stroke="white" />
                     <Star size={12} fill="white" stroke="white" />
                     <Star size={12} fill="white" stroke="white" />
                     <Star size={12} fill="white" stroke="white" />
                  </div>
                  <p className="text-xs font-bold text-[#006ce4] flex items-center gap-1">
                     <MapPin size={14} /> {hotel.location} — <span className="underline cursor-pointer">Excellent location - show map</span>
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <button className="h-10 px-4 bg-white border border-[#006ce4] text-[#006ce4] rounded flex items-center gap-2 text-sm font-bold hover:bg-blue-50 transition-all">
                  <Heart size={18} /> Save
               </button>
               <button className="h-10 px-4 bg-[#006ce4] text-white rounded flex items-center gap-2 text-sm font-bold hover:bg-[#0052ad] transition-all">
                  Reserve now
               </button>
            </div>
         </div>
      </div>
      
      {/* 2. GALLERY GRID ─────────────────────────────────────────── */}
      <div className="container-booking mt-4">
         <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[350px] md:h-[450px] lg:h-[550px] rounded-lg overflow-hidden">
            <div className="col-span-2 row-span-2 relative group cursor-pointer">
               <img src={hotel.images?.[0] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200"} className="w-full h-full object-cover" alt={hotel.name} />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer">
               <img src={hotel.images?.[1] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover" alt="Interior" />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer">
               <img src={hotel.images?.[2] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover" alt="Interior" />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer">
               <img src={hotel.images?.[3] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover" alt="Interior" />
            </div>
            <div className="col-span-1 row-span-1 relative group cursor-pointer bg-gray-900">
               <img src={hotel.images?.[4] || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover opacity-60" alt="Interior" />
               <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <ImageIcon size={32} />
                  <span className="text-sm font-bold mt-2">+{hotel.images?.length || 0} photos</span>
               </div>
            </div>
         </div>
      </div>

      <div className="container-booking mt-10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* L: Main Information */}
            <div className="lg:col-span-8 space-y-10">
               
               {/* High-level Experience */}
               <section className="space-y-6">
                  <div className="flex flex-wrap items-center gap-6 py-6 border-y border-gray-100">
                     <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                        <Wifi size={18} className="text-[#006ce4]" /> Free WiFi
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                        <Car size={18} className="text-[#006ce4]" /> Free Parking
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                        <Coffee size={18} className="text-[#006ce4]" /> Breakfast included
                     </div>
                     <div className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                        <Clock size={18} className="text-[#006ce4]" /> 24-hour front desk
                     </div>
                  </div>

                  <div className="prose prose-blue max-w-none">
                     <p className="text-[15px] leading-relaxed text-gray-700">
                        {hotel.description || "Stay in the heart of the city at this exceptionally rated property. Offering elite comfort and world-class service, this hotel provides the perfect base for your visit. Guests consistently praise the attentive staff and the modern amenities. Each room is designed for maximum relaxation with high-speed internet and premium bedding."}
                     </p>
                  </div>
               </section>

               {/* Availability Table Header */}
               <section id="availability" className="space-y-6 pt-10">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Availability</h2>
                  <div className="bg-blue-50/50 p-6 rounded-lg border border-blue-100 flex items-center gap-4">
                     <Info size={24} className="text-[#006ce4]" />
                     <p className="text-sm font-bold text-[#003b95]">These prices are exclusive to our members. Sign in to save even more on your stay.</p>
                  </div>

                  <div className="space-y-4">
                     {rooms.length === 0 ? (
                       <div className="p-10 text-center bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-sm font-bold text-gray-500">No rooms currently available for the selected dates.</p>
                       </div>
                     ) : (
                       <div className="grid grid-cols-1 gap-4">
                         {rooms.map((room) => (
                           <RoomCard 
                             key={room._id} 
                             room={room} 
                             hotelId={id} 
                             hotelName={hotel.name}
                             hotel={hotel}
                           />
                         ))}
                       </div>
                     )}
                  </div>
               </section>

               {/* Reviews Section */}
               <section className="space-y-8 pt-10">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-black text-gray-900 tracking-tight">Guest reviews</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {[1,2,3].map((i) => (
                       <div key={i} className="p-6 bg-white border border-gray-200 rounded-lg space-y-4 shadow-sm hover:border-[#006ce4] transition-all cursor-default">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-[#003b95] text-white rounded-lg flex items-center justify-center font-bold">9.{i}</div>
                             <div>
                                <p className="text-sm font-bold text-gray-900">Excellent Experience</p>
                                <p className="text-xs text-gray-500">Verified Guest • March 2026</p>
                             </div>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed italic">"The breakfast was exceptional and the staff went above and beyond to make our anniversary special. Highly recommended."</p>
                       </div>
                     ))}
                  </div>
               </section>
            </div>

            {/* R: Dynamic Sidebar Info */}
            <div className="lg:col-span-4 space-y-6">
               <div className="sticky top-40 space-y-6">
                  
                  {/* Property Highlights */}
                  <div className="bg-blue-50/50 p-8 rounded-lg border border-blue-100 space-y-6 shadow-sm">
                     <h3 className="text-lg font-black text-[#003b95]">Property highlights</h3>
                     <div className="space-y-4">
                        <div className="flex items-start gap-3">
                           <div className="mt-1"><Zap size={18} className="text-[#006ce4]" fill="currentColor" /></div>
                           <p className="text-sm font-bold text-gray-700">Perfect for a 1-night stay!</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="mt-1"><MapPin size={18} className="text-[#006ce4]" /></div>
                           <p className="text-sm font-bold text-gray-700">Located in the heart of {hotel.city || 'the city'}, this property has an excellent location score of 9.3!</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <div className="mt-1"><Clock size={18} className="text-[#006ce4]" /></div>
                           <p className="text-sm font-bold text-gray-700">24-hour front desk - assistance whenever you need it.</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => document.getElementById('availability').scrollIntoView({ behavior: 'smooth' })}
                        className="w-full h-12 bg-[#006ce4] text-white rounded font-bold text-sm hover:bg-[#0052ad] transition-all shadow-lg shadow-blue-500/10"
                     >
                        Reserve your stay
                     </button>
                  </div>

                  {/* Trust Factors */}
                  <div className="bg-white p-6 rounded-lg border border-gray-100 space-y-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                     <div className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-widest">
                        <ShieldCheck size={18} className="text-emerald-500" /> Secure Booking
                     </div>
                     <div className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-widest">
                        <Check size={18} className="text-emerald-500" /> Instant confirmation
                     </div>
                     <div className="flex items-center gap-3 text-xs font-bold text-gray-600 uppercase tracking-widest">
                        <Award size={18} className="text-amber-500" /> Best Price Guarantee
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default HotelDetails;
