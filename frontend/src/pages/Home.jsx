import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { 
  Loader2, 
  MapPin, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter, 
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  MessageCircle
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
        setPopularHotels(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

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
      
      {/* ── 1. CINEMATIC HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-32">
         {/* Background Engine - Fixed and scaled for depth */}
         <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
               src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2600" 
               className="w-full h-full object-cover brightness-[0.45] scale-105 animate-scale-slow"
               alt="Luxury Resort"
            />
            {/* Professional Color Theory Grading */}
            <div className="absolute inset-0 bg-gradient-to-b from-secondary-dark/60 via-transparent to-secondary-dark" />
            <div className="absolute inset-0 bg-black/10" />
         </div>

         {/* Hero Narrative Content */}
         <div className="relative z-10 w-full px-6 max-w-7xl mx-auto text-center space-y-12 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full shadow-2xl mx-auto">
               <Sparkles size={14} className="text-primary animate-pulse" />
               <span className="text-[10px] font-black text-white uppercase tracking-[4px]">Verified Elite Covenants — Heritage Legacy 2026</span>
            </div>
            
            <div className="space-y-6">
               <h1 className="h1-hero text-white leading-tight lg:leading-[0.8] drop-shadow-2xl">
                  Redefining <br />
                  <span className="text-primary italic">Heritage</span>
               </h1>
               <p className="text-lg md:text-2xl text-white/60 font-medium max-w-3xl mx-auto leading-relaxed italic animate-slide-up delay-300">
                  Discover curated sanctuaries of uncompromising quality. From metropolis pulses to coastal whispers.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up delay-500 pt-10">
               <button onClick={() => navigate('/hotels')} className="btn-gold h-16 px-12 group">
                  Explore Destinations <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </button>
               <button 
                 onClick={() => document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' })}
                 className="h-16 px-10 rounded-2xl border-2 border-white/20 text-white font-black uppercase text-[10px] tracking-[4px] hover:bg-white hover:text-secondary-dark transition-all flex items-center justify-center gap-3 backdrop-blur-md"
               >
                  Property Ledger <ChevronDown size={18} />
               </button>
            </div>
         </div>

         {/* Floating Booking Interface Bridge */}
         <div className="relative z-20 w-full max-w-5xl px-4 mt-20 lg:mt-32 animate-slide-up delay-700">
            <div className="bg-white p-3 lg:p-4 rounded-[2.5rem] lg:rounded-full shadow-premium shadow-black/20 border border-white/10">
               <SearchBar onSearch={handleSearch} />
            </div>
         </div>
      </section>

      {/* ── 2. SIGNATURE COLLECTIONS ────────────────────────────────────── */}
      <section id="hotels" className="py-40 px-4 md:px-10 lg:px-20 bg-gray-50/50">
         <div className="container-luxury">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-24 animate-fade-in">
               <div className="space-y-4 max-w-3xl">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[4px] flex items-center gap-3">
                     <Globe size={16} className="text-primary" /> Global Inventory Index Archive
                  </p>
                  <h2 className="h2-luxury">
                     Signature <span className="text-primary italic">Destinations</span>
                  </h2>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-xl">
                     Our collection is audited for architectural integrity, aesthetic harmony, and service excellence globally.
                  </p>
               </div>
               <Link to="/hotels" className="inline-flex items-center gap-3 text-secondary-dark font-black uppercase text-[10px] tracking-[5px] hover:text-primary transition-colors border-b-2 border-primary/20 pb-2 mb-2">
                  View Full Portfolio <ChevronRight size={18} />
               </Link>
            </div>

            {loading ? (
               <div className="py-32 flex flex-col items-center justify-center gap-4">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Auditing Directories...</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-14">
                  {popularHotels.map((hotel) => (
                    <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                  ))}
               </div>
            )}
         </div>
      </section>

      {/* ── 3. PLATINUM PRIVILEGES ────────────────────────────────────────── */}
      <section id="deals" className="py-40 px-4 md:px-10 lg:px-20 bg-white relative overflow-hidden">
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/2 rounded-full blur-3xl" />
         
         <div className="container-luxury grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12 animate-slide-right">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-secondary-dark text-primary font-black text-[10px] uppercase tracking-[4px] rounded-full">
                     <Award size={14} /> Platinum Covenant Tier
                  </div>
                  <h2 className="h2-luxury leading-tight">
                     Unparalleled <br />
                     <span className="text-primary italic">Member Rights</span>
                  </h2>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                  <div className="space-y-4 group">
                     <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12 group-hover:scale-110">
                        <Zap size={28} />
                     </div>
                     <h4 className="text-xl font-black text-secondary-dark font-serif italic">Dynamic Savings</h4>
                     <p className="text-sm text-gray-400 font-medium leading-relaxed">Secure up to 35% reduction on off-cycle bookings for platinum members.</p>
                  </div>
                  <div className="space-y-4 group">
                     <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12 group-hover:scale-110">
                        <ShieldCheck size={28} />
                     </div>
                     <h4 className="text-xl font-black text-secondary-dark font-serif italic">Escrow Safety</h4>
                     <p className="text-sm text-gray-400 font-medium leading-relaxed">Complete financial security and instant refunds on premium tiers.</p>
                  </div>
               </div>

               <Link to="/register" className="btn-gold h-18 px-12 text-[10px] tracking-[4px] shadow-2xl">
                  Begin Membership <ChevronRight size={20} />
               </Link>
            </div>

            <div className="relative animate-slide-up lg:pl-10">
               <div className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-premium shadow-black/40 border-[12px] border-white group">
                  <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s]" alt="Platinum Resort" />
               </div>
            </div>
         </div>
      </section>

      {/* ── 4. HERITAGE & MISSION ────────────────────────────────────────── */}
      <section id="about-us" className="py-48 px-4 md:px-10 lg:px-20 bg-secondary-dark relative">
         <div className="container-luxury items-center gap-24">
            <div className="flex flex-col lg:flex-row items-center gap-24">
               <div className="lg:w-1/2 relative">
                  <div className="aspect-[16/10] rounded-[4rem] overflow-hidden shadow-2xl skew-y-1">
                     <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover grayscale-[40%] brightness-[0.7] group-hover:scale-105 transition-all" alt="Heritage Property" />
                  </div>
               </div>
               <div className="lg:w-1/2 space-y-12">
                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[6px]">The Blueprint of Stay</p>
                     <h2 className="text-5xl md:text-7xl font-serif text-white font-black leading-tight tracking-tight">
                        Timeless <br />
                        <span className="text-primary italic">Atmospheres</span>
                     </h2>
                     <p className="text-xl text-white/50 font-medium leading-relaxed italic border-l-4 border-primary/30 pl-8 mt-10">
                        "We do not facilitate occupancy; we curate gateways to existence. Each PK UrbanStay property is a chapter in a global retrospective of quality."
                     </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
                     <div className="space-y-2">
                        <p className="text-5xl font-serif text-white font-black italic">450<span className="text-primary">+</span></p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Archives</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-5xl font-serif text-white font-black italic">24h</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Elite Concierge</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
      <div id="contact-us" className="pb-20" />

      <style>{`
        @keyframes scale-slow { from { transform: scale(1); } to { transform: scale(1.15); } }
        .animate-scale-slow { animation: scale-slow 30s ease-in-out infinite alternate; }
      `}</style>
    </div>
  );
};

export default Home;
