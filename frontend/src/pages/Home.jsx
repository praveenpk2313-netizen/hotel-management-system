import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import WhyChooseUs from '../components/WhyChooseUs';
import { fetchHotels } from '../services/api';
import { 
  Loader2, 
  MapPin, 
  ChevronRight,
  ArrowRight,
  Building,
  Plane,
  Car,
  Camera,
  Navigation,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const { data } = await fetchHotels();
        setPopularHotels(data.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  const handleSearch = (query) => {
    const checkin = query.startDate ? new Date(query.startDate.getTime() - (query.startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
    const checkout = query.endDate ? new Date(query.endDate.getTime() - (query.endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
    const params = new URLSearchParams();
    if (query.location) params.append('location', query.location);
    if (checkin) params.append('checkin', checkin);
    if (checkout) params.append('checkout', checkout);
    if (query.guests) params.append('guests', query.guests);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="bg-white min-h-screen font-sans overflow-x-hidden">
      
      {/* 1. BOOKING HERO SECTION (BLUE) ─────────────────────────────────── */}
      <section className="bg-booking-blue pt-32 pb-24 md:pt-40 md:pb-32 lg:pb-36 px-4 md:px-0 relative">
         <div className="container-booking space-y-8 animate-fade-in relative z-10">
            <div className="space-y-4 max-w-4xl">
               <h1 className="text-4xl md:text-5xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                  Find your next stay
               </h1>
               <p className="text-xl md:text-2xl text-white opacity-90 font-medium">
                  Search low prices on hotels, homes and much more...
               </p>
            </div>
            
            {/* Meta badges/Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold text-xs transition-colors border border-white/5 cursor-pointer group">
                  <CheckCircle2 size={16} className="text-sky-400 group-hover:scale-110 transition-transform" /> 
                  Free Cancellation on most rooms
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white font-bold text-xs transition-colors border border-white/5 cursor-pointer group">
                  <Sparkles size={16} className="text-orange-400 group-hover:scale-110 transition-transform" /> 
                  15% off Early 2026 Deals
               </div>
            </div>
         </div>

         {/* Hero Background Shape Layer */}
         <div className="absolute top-0 right-0 w-[50%] h-full opacity-10 pointer-events-none hidden lg:block overflow-hidden">
             <div className="absolute top-[-20%] right-[-10%] w-[100%] aspect-square rounded-full border-[80px] border-white/20 transform rotate-12" />
         </div>
      </section>

      {/* 2. OVERLAPPING SEARCH HUB ────────────────────────────────────────── */}
      <section className="relative z-50 -mt-8 md:-mt-10 mb-20 px-4 md:px-0">
         <div className="container-booking">
            <SearchBar onSearch={handleSearch} />
         </div>
      </section>

      {/* 3. TRENDING DESTINATIONS (Visual Row) ─────────────────────────── */}
      <section className="py-12 bg-white">
         <div className="container-booking">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-10">
               <div>
                  <h2 className="h2-booking mb-2">Trending destinations</h2>
                  <p className="text-gray-500 font-medium text-sm">Most popular choices for travellers from globally</p>
               </div>
               <Link to="/hotels" className="text-[#006ce4] font-bold text-sm hover:underline decoration-2 flex items-center gap-2 pb-1">
                  Browse all properties <ArrowRight size={16} />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-[420px]">
               <div className="relative rounded-xl overflow-hidden shadow-sm group cursor-pointer h-full">
                  <img src="https://images.unsplash.com/photo-1549144863-31f487a52aa0?auto=format&fit=crop&q=80&w=1200" alt="New Delhi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-white/90 rounded text-[10px] font-black uppercase tracking-widest text-[#003b95]">
                     <Navigation size={12} fill="#003b95" /> Urban Pulse
                  </div>
                  <div className="absolute bottom-6 left-8 text-white">
                     <h3 className="text-3xl font-black tracking-tight drop-shadow-md flex items-center gap-3">
                        New Delhi <img src="https://flagcdn.com/in.svg" alt="India" className="w-8 h-6 rounded shadow-sm border border-white/20" />
                     </h3>
                     <p className="text-sm font-bold opacity-90 mt-1 uppercase tracking-widest">Heritage & Commerce Hub</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6 h-full">
                  <div className="relative rounded-xl overflow-hidden group cursor-pointer h-full shadow-sm">
                     <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800" alt="Tokyo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl font-black">Tokyo</h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Technopolis Gateway</p>
                     </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden group cursor-pointer h-full shadow-sm">
                     <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800" alt="Dubai" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl font-black">Dubai</h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">Luxury Oasis Shell</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. WHY CHOOSE US (CORE FEATURES) ────────────────────────────────── */}
      <WhyChooseUs />

      {/* 5. PROPERTY LISTING SECTION ───────────────────────────────────── */}
      <section className="pb-32 bg-white">
         <div className="container-booking">
            <div className="flex justify-between items-end mb-10">
               <div>
                  <h2 className="h2-booking mb-2">Homes guests love</h2>
                  <p className="text-gray-500 font-medium text-sm">Discover top-rated properties across globally curated archives</p>
               </div>
               <Link to="/hotels" className="hidden sm:inline-flex h-12 px-6 border border-[#006ce4] text-[#006ce4] font-bold rounded-lg hover:bg-blue-50 transition-colors items-center justify-center gap-2 text-sm shadow-sm">
                  View full portfolio <ChevronRight size={18} />
               </Link>
            </div>

            {loading ? (
               <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 size={32} className="animate-spin text-[#006ce4]" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Synchronizing Directories...</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularHotels.map((hotel) => (
                    <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                  ))}
               </div>
            )}
            
            <div className="mt-12 sm:hidden">
               <button onClick={() => navigate('/hotels')} className="w-full h-14 bg-[#006ce4] text-white font-black rounded-xl text-sm tracking-widest flex items-center justify-center gap-3">
                  EXPLORE ARCHIVE <ArrowRight size={20} />
               </button>
            </div>
         </div>
      </section>

      {/* 6. NEWSLETTER INCENTIVE ────────────────────────────────────────── */}
      <section className="bg-booking-blue py-20 px-4 md:px-0">
         <div className="container-booking text-center space-y-8 animate-fade-in">
            <div className="space-y-4 max-w-2xl mx-auto">
               <h2 className="text-4xl font-black text-white leading-tight">Save time, save money!</h2>
               <p className="text-gray-300 font-medium">Sign up and we'll send the best deals to you</p>
            </div>
            
            <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
               <input 
                 type="email" 
                 placeholder="Your email address" 
                 className="flex-1 h-12 px-6 rounded border-none outline-none font-medium text-gray-800 focus:ring-4 focus:ring-sky-400/30 transition-shadow"
               />
               <button className="h-12 px-10 bg-[#006ce4] text-white font-bold rounded hover:bg-[#0052ad] transition-all">
                  Subscribe
               </button>
            </form>
            
            <div className="flex items-center justify-center gap-5 pt-8 scale-90 md:scale-100">
               <label className="flex items-center gap-3 text-white/70 text-sm font-medium cursor-pointer hover:text-white transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-transparent bg-white/20 checked:bg-[#006ce4]" />
                  <span>Send me a link to get the FREE Booking app!</span>
               </label>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Home;
