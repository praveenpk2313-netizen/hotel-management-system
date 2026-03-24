import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchHotels } from '../services/api';
import HotelCard from '../components/HotelCard';
import SearchBar from '../components/SearchBar';
import WhyChooseUs from '../components/WhyChooseUs';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Navigation,
  ChevronRight,
  Loader2
} from 'lucide-react';

const Home = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const { data } = await fetchHotels();
        setPopularHotels(data.slice(0, 8)); // Feature top 8 properties
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
    <div className="bg-white min-h-screen">
      
      {/* 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 px-4 md:px-0 flex items-center min-h-[80vh]">
         {/* Background Image with Overlay */}
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1542314831-c6a4d14d8379?auto=format&fit=crop&q=80&w=2000" 
               alt="Luxury Resort" 
               className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900/90" />
         </div>

         <div className="container-booking space-y-8 animate-slide-up relative z-10 text-center flex flex-col items-center justify-center">
            <div className="space-y-6 max-w-4xl mx-auto">
               <h1 className="h1-hero text-white">
                  Book Your Dream Stay at the Best Prices
               </h1>
               <p className="text-lg md:text-xl text-slate-200 font-medium max-w-2xl mx-auto">
                  Experience modern luxury and comfort in handpicked destinations around the globe.
               </p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
               <div className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-white font-semibold text-sm">
                  <CheckCircle2 size={18} className="text-emerald-400" /> 
                  Best Price Guarantee
               </div>
               <div className="flex items-center gap-2 px-5 py-2.5 glass-card rounded-full text-white font-semibold text-sm">
                  <Sparkles size={18} className="text-cyan-400" /> 
                  Premium Properties
               </div>
            </div>
         </div>
      </section>

      {/* 2. OVERLAPPING SEARCH HUB ───────────────────────────────────── */}
      <section className="container-booking relative z-50 -mt-20 mb-24">
         <div className="glass-card rounded-[24px] p-2 border border-white/40 shadow-glass backdrop-blur-xl bg-white/60">
            <SearchBar onSearch={handleSearch} />
         </div>
      </section>

      {/* 3. TRENDING DESTINATIONS ─────────────────────────────────────── */}
      <section className="py-16 bg-white">
         <div className="container-booking">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-6 mb-12">
               <div>
                  <h2 className="text-3xl font-black text-[#1a1a1a] mb-2 tracking-tight">Trending destinations</h2>
                  <p className="text-gray-500 font-medium text-sm">Most popular choices for travellers globally</p>
               </div>
               <Link to="/hotels" className="text-[#006ce4] font-bold text-sm hover:underline decoration-2 flex items-center gap-2 pb-1 transition-all">
                  Browse all properties <ArrowRight size={16} />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-[420px]">
               <div className="relative rounded-xl overflow-hidden shadow-md group cursor-pointer h-full">
                  <img src="https://images.unsplash.com/photo-1549144863-31f487a52aa0?auto=format&fit=crop&q=80&w=1200" alt="New Delhi" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1 bg-white/95 rounded text-[10px] font-black uppercase tracking-widest text-[#003b95] shadow-sm">
                     <Navigation size={12} fill="#003b95" /> Urban Pulse
                  </div>
                  <div className="absolute bottom-6 left-8 text-white">
                     <h3 className="text-3xl font-black tracking-tight drop-shadow-md">New Delhi, India</h3>
                     <p className="text-sm font-bold opacity-90 mt-1 uppercase tracking-widest">Heritage & Commerce Hub</p>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6 h-full">
                  <div className="relative rounded-xl overflow-hidden group cursor-pointer h-full shadow-md">
                     <img src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800" alt="Tokyo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                     <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl font-black">Tokyo</h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Technopolis Gateway</p>
                     </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden group cursor-pointer h-full shadow-md">
                     <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800" alt="Dubai" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                     <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl font-black">Dubai</h3>
                        <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Luxury Oasis</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. WHY CHOOSE US (CORE PILLARS) ────────────────────────────────── */}
      <WhyChooseUs />

      {/* 5. HOMES GUESTS LOVE (PROPERTY GRID) ─────────────────────────── */}
      <section className="py-24 bg-white border-t border-gray-100">
         <div className="container-booking">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <h2 className="text-3xl font-black text-[#1a1a1a] mb-2 tracking-tight">Homes guests love</h2>
                  <p className="text-gray-500 font-medium text-sm">Discover top-rated properties across curated global archives</p>
               </div>
               <Link to="/hotels" className="hidden sm:inline-flex h-12 px-8 border border-[#006ce4] text-[#006ce4] font-bold rounded-lg hover:bg-blue-50 transition-colors items-center justify-center gap-2 text-sm shadow-sm">
                  View full portfolio <ChevronRight size={18} />
               </Link>
            </div>

            {loading ? (
               <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 size={32} className="animate-spin text-[#006ce4]" />
                  <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Synchronizing...</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
                  {popularHotels.map((hotel) => (
                    <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                  ))}
               </div>
            )}
            
            <div className="mt-16 sm:hidden">
               <button onClick={() => navigate('/hotels')} className="w-full h-14 bg-[#006ce4] text-white font-black rounded-lg text-sm tracking-widest flex items-center justify-center gap-3 shadow-md">
                  EXPLORE ALL STAYS <ArrowRight size={20} />
               </button>
            </div>
         </div>
      </section>

      {/* 6. NEWSLETTER SAVINGS ────────────────────────────────────────── */}
      <section className="bg-booking-blue py-20">
         <div className="container-booking text-center space-y-8 animate-fade-in">
            <div className="space-y-4 max-w-2xl mx-auto">
               <h2 className="text-4xl font-black text-white leading-tight">Save time, save money!</h2>
               <p className="text-gray-300 font-medium">Sign up and we'll send the best deals to you</p>
            </div>
            
            <form className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
               <input 
                 type="email" 
                 placeholder="Your email address" 
                 className="flex-1 h-12 px-6 rounded-lg border-none outline-none font-medium text-gray-800 focus:ring-4 focus:ring-sky-400/30 transition-shadow"
               />
               <button className="h-12 px-10 bg-[#006ce4] text-white font-bold rounded-lg hover:bg-[#0052ad] transition-all shadow-lg active:scale-95">
                  Subscribe
               </button>
            </form>
         </div>
      </section>

    </div>
  );
};

export default Home;
