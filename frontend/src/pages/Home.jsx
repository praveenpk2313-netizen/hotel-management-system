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
    <div className="bg-white min-h-screen">
      
      {/* 1. BLUE HERO ──────────────────────────────────────────────────── */}
      <section className="bg-booking-blue pt-32 pb-24 md:pt-40 md:pb-32 px-4 md:px-0">
         <div className="container-booking space-y-8 animate-fade-in relative z-10">
            <div className="space-y-4 max-w-4xl">
               <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                  Find your next stay
               </h1>
               <p className="text-xl md:text-2xl text-white opacity-90 font-medium">
                  Search low prices on hotels, homes and much more...
               </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-4">
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white font-bold text-xs border border-white/5">
                  <CheckCircle2 size={16} className="text-sky-400" /> 
                  Free Cancellation on most rooms
               </div>
               <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white font-bold text-xs border border-white/5">
                  <Sparkles size={16} className="text-orange-400" /> 
                  15% off Early 2026 Deals
               </div>
            </div>
         </div>
      </section>

      {/* 2. OVERLAPPING SEARCH ─────────────────────────────────────────── */}
      <section className="container-booking relative z-50 -mt-10 mb-20">
         <div className="bg-white rounded-lg border-4 border-[#ffb700] shadow-2xl overflow-hidden">
            <SearchBar onSearch={handleSearch} />
         </div>
      </section>

      {/* 3. WHY CHOOSE US ──────────────────────────────────────────────── */}
      <WhyChooseUs />

      {/* 4. HOTELS DISPLAY (OUR PROPERTIES) ────────────────────────────── */}
      <section className="py-24 bg-white border-t border-gray-100">
         <div className="container-booking">
            <div className="flex justify-between items-end mb-12">
               <div>
                  <h2 className="text-3xl font-black text-[#1a1a1a] mb-2 tracking-tight">Browse our properties</h2>
                  <p className="text-gray-500 font-medium text-sm tracking-tight leading-relaxed max-w-lg">
                    Discover hand-picked residences and luxury stays added recently to our portal.
                  </p>
               </div>
               <Link to="/hotels" className="hidden sm:inline-flex h-12 px-8 bg-[#006ce4] text-white font-bold rounded-lg hover:bg-black transition-colors items-center justify-center gap-2 text-sm shadow-md">
                  Browse all hotels <ArrowRight size={18} />
               </Link>
            </div>

            {loading ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl" />
                  ))}
               </div>
            ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularHotels.map((hotel) => (
                    <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                  ))}
               </div>
            )}
         </div>
      </section>

    </div>
  );
};

export default Home;
