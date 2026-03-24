import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { 
  Loader2, 
  Star, 
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
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
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
    <div className="bg-white min-h-screen font-sans">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4 md:px-10 pt-20">
         {/* Background Media */}
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2600" 
               className="w-full h-full object-cover brightness-[0.55]"
               alt="Luxury Resort"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-secondary-dark/60 via-transparent to-secondary-dark/90" />
         </div>

         {/* Content Area */}
         <div className="relative z-10 text-center space-y-12 max-w-6xl mx-auto group pb-24">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full animate-fade-in shadow-2xl">
               <Sparkles size={14} className="text-primary animate-pulse" />
               <span className="text-[10px] font-black text-white uppercase tracking-[4px]">Elite Hospitality Covenants — 2026</span>
            </div>
            
            <div className="space-y-6">
               <h1 className="text-6xl md:text-8xl lg:text-[9rem] font-serif text-white font-black tracking-tight leading-[0.85] drop-shadow-2xl">
                  Redefining <br />
                  <span className="text-primary italic">Heritage</span>
               </h1>
               <p className="text-lg md:text-xl text-white/70 font-medium max-w-3xl mx-auto leading-relaxed italic animate-slide-up">
                  Discover curated sanctuaries of uncompromising quality. From metropolis pulses to coastal whispers.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
               <button onClick={() => navigate('/hotels')} className="btn-gold h-16 px-12 flex items-center gap-3">
                  Explore Destinations <ArrowRight size={20} className="text-white/80" />
               </button>
               <button 
                 onClick={() => document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' })}
                 className="h-16 px-10 rounded-2xl border-2 border-white/30 text-white font-black uppercase text-[10px] tracking-[4px] hover:bg-white hover:text-secondary-dark transition-all flex items-center justify-center gap-3 backdrop-blur-md"
               >
                  Property Ledger <ChevronDown size={18} />
               </button>
            </div>
         </div>

         {/* Floating Search Hub */}
         <div className="absolute bottom-10 z-20 w-full max-w-5xl px-4 animate-slide-up">
            <div className="bg-white p-4 md:p-6 rounded-[3rem] shadow-premium shadow-black/20 border border-gray-100 flex items-center">
               <div className="w-full">
                  <SearchBar onSearch={handleSearch} />
               </div>
            </div>
         </div>
      </section>

      {/* 2. SIGNATURE COLLECTIONS */}
      <section id="hotels" className="py-32 px-4 md:px-10 lg:px-20 bg-gray-50/50 relative">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20">
               <div className="space-y-4 max-w-2xl">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[4px] flex items-center gap-3">
                     <Globe size={16} className="text-primary" /> Global Inventory Archive
                  </p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-dark font-black tracking-tight leading-[1.1]">
                     Signature <span className="text-primary italic">Destinations</span>
                  </h2>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed">
                     Our collection is audited for architectural integrity and aesthetic harmony.
                  </p>
               </div>
               <Link to="/hotels" className="group flex items-center gap-3 text-secondary-dark font-black uppercase text-[10px] tracking-[3px] hover:text-primary transition-colors border-b-2 border-primary/20 pb-2">
                  View Full Portfolio <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>

            {loading ? (
               <div className="py-32 flex flex-col items-center justify-center gap-4">
                  <Loader2 size={32} className="animate-spin text-primary" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consulting Directory...</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 pb-16">
                  {popularHotels.map((hotel) => (
                    <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                  ))}
               </div>
            )}
         </div>
      </section>

      {/* 3. EXCLUSIVE PRIVILEGES */}
      <section id="deals" className="py-32 px-4 md:px-10 lg:px-20 bg-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-dark text-primary font-black text-[10px] uppercase tracking-[3px] rounded-full">
                     <Award size={14} /> Platinum Covenant
                  </div>
                  <h2 className="text-4xl md:text-6xl font-serif text-secondary-dark font-black leading-tight tracking-tight">
                     Unparalleled <br />
                     <span className="text-primary italic">Member Rights</span>
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <Zap size={24} />
                     </div>
                     <h4 className="text-lg font-bold text-secondary-dark">Dynamic Savings</h4>
                     <p className="text-sm text-gray-400 font-medium leading-relaxed">Secure up to 35% reduction on elite stays.</p>
                  </div>
                  <div className="space-y-4">
                     <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <ShieldCheck size={24} />
                     </div>
                     <h4 className="text-lg font-bold text-secondary-dark">Escrow Safety</h4>
                     <p className="text-sm text-gray-400 font-medium leading-relaxed">Complete financial security on every booking.</p>
                  </div>
               </div>

               <Link to="/register" className="btn-gold h-16 w-full md:w-auto inline-flex items-center justify-center gap-4 px-12">
                  Begin Membership <ChevronRight size={20} />
               </Link>
            </div>

            <div className="relative">
               <div className="relative z-10 aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-premium-dark border-8 border-white">
                  <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Privilege" />
               </div>
            </div>
         </div>
      </section>

      {/* 4. HERITAGE & MISSION */}
      <section id="about-us" className="py-40 px-4 md:px-10 lg:px-20 bg-secondary-dark relative">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <div className="flex-1">
                  <div className="aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Heritage" />
                  </div>
               </div>
               <div className="flex-[1.2] space-y-10">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[4px]">The Blueprint of Stay</p>
                     <h2 className="text-5xl md:text-6xl font-serif text-white font-black leading-tight tracking-tight">
                        Timeless <br />
                        <span className="text-primary italic">Atmospheres</span>
                     </h2>
                  </div>
                  <p className="text-xl text-white/60 font-medium leading-relaxed italic">
                     "Each PK UrbanStay property is a chapter in a global retrospective of quality."
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* 5. CULMINATION (FOOTER) */}
      <footer id="contact-us" className="bg-white border-t border-gray-100 pt-32 pb-16 px-4 md:px-10 lg:px-20">
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
               
               <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-6">
                     <Link to="/" className="flex items-center gap-4">
                        <div style={{ width: '48px', height: '48px' }} className="bg-secondary-dark rounded-2xl flex items-center justify-center p-2">
                           <img src="/logo.png" style={{ width: '32px', height: '32px' }} className="object-contain" alt="Logo" />
                        </div>
                        <div>
                           <h2 className="text-3xl font-serif font-black italic text-secondary-dark leading-none">PK UrbanStay</h2>
                           <p className="text-[10px] font-black text-primary uppercase tracking-[3px] mt-1">Heritage Hospitality</p>
                        </div>
                     </Link>
                     <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm">
                        Establishing the gold standard of luxury stay management since 2012.
                     </p>
                  </div>
               </div>

               <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-10">
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[4px]">The Archive</h4>
                     <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link to="/hotels" className="hover:text-primary">Properties</Link></li>
                        <li><Link to="/#deals" className="hover:text-primary">Elite Deals</Link></li>
                     </ul>
                  </div>
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[4px]">Covenant</h4>
                     <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link to="/" className="hover:text-primary">Terms</Link></li>
                        <li><Link to="/" className="hover:text-primary">Privacy</Link></li>
                     </ul>
                  </div>
               </div>

               <div className="lg:col-span-3">
                  <button className="w-full h-14 bg-secondary-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[3px] flex items-center justify-center gap-3 hover:bg-primary transition-all">
                     Consult Concierge <MessageCircle size={16} />
                  </button>
               </div>
            </div>

            <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">© {new Date().getFullYear()} PK UrbanStay Hospitality Group.</p>
               <div className="flex gap-4">
                  <Facebook size={18} className="text-gray-300" />
                  <Instagram size={18} className="text-gray-300" />
                  <Twitter size={18} className="text-gray-300" />
               </div>
            </div>
         </div>
      </footer>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default Home;
