import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { 
  Loader2, 
  Star, 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  Twitter, 
  Heart, 
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Award,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Briefcase
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
      <section id="home" className="relative h-[92vh] min-h-[700px] flex flex-col items-center justify-center overflow-hidden px-4 md:px-10">
         {/* Background Media */}
         <div className="absolute inset-0 z-0">
            <img 
               src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2600" 
               className="w-full h-full object-cover animate-scale-slow brightness-[0.7] grayscale-[10%]"
               alt="Luxury Resort"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/90 via-secondary-dark/20 to-secondary-dark/40" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-30 pointer-events-none" />
         </div>

         {/* Content Area */}
         <div className="relative z-10 text-center space-y-12 max-w-6xl mx-auto mb-32 group">
            <div className="inline-flex items-center gap-2 px-5 py-2 underline-offset-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full animate-fade-in shadow-2xl">
               <Sparkles size={16} className="text-primary animate-pulse" />
               <span className="text-[10px] font-black text-white uppercase tracking-[3px]">Elite Hospitality Covenants</span>
            </div>
            
            <div className="space-y-6">
               <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white font-black tracking-tight leading-[0.9] drop-shadow-2xl">
                  Redefining <br />
                  <span className="text-primary italic">Heritage</span>
               </h1>
               <p className="text-lg md:text-2xl text-white/80 font-medium max-w-3xl mx-auto leading-relaxed md:font-light italic">
                  Discover curated sanctuaries of uncompromising quality. From metropolis pulses to coastal whispers.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up delay-500">
               <button onClick={() => navigate('/hotels')} className="btn-gold h-16 px-10 flex items-center gap-3">
                  Explore Destinations <ArrowRight size={20} className="text-white/80" />
               </button>
               <button 
                 onClick={() => document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' })}
                 className="h-16 px-10 rounded-2xl border-2 border-white/30 text-white font-black uppercase text-[10px] tracking-[4px] hover:bg-white hover:text-secondary-dark transition-all flex items-center justify-center gap-3"
               >
                  Property Ledger <ChevronDown size={18} />
               </button>
            </div>
         </div>

         {/* Floating Search Hub */}
         <div className="absolute -bottom-1 z-20 w-full max-w-6xl px-4 animate-slide-up delay-700">
            <div className="bg-white p-4 md:p-6 rounded-[3rem] shadow-premium-dark border border-gray-100/50">
               <SearchBar onSearch={handleSearch} />
            </div>
         </div>
      </section>

      {/* 2. SIGNATURE COLLECTIONS */}
      <section id="hotels" className="py-32 px-4 md:px-10 lg:px-20 bg-gray-50/50 relative">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-20 animate-fade-in">
               <div className="space-y-4 max-w-2xl">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[4px] flex items-center gap-3">
                     <Globe size={16} className="text-primary" /> Global Inventory Archive
                  </p>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-secondary-dark font-black tracking-tight leading-[1.1]">
                     Signature <span className="text-primary italic">Destinations</span>
                  </h2>
                  <p className="text-gray-400 font-medium text-lg leading-relaxed">
                     Our collection is audited for architectural integrity, aesthetic harmony, and exceptional service standards.
                  </p>
               </div>
               <Link to="/hotels" className="group flex items-center gap-3 text-secondary-dark font-black uppercase text-[10px] tracking-[3px] hover:text-primary transition-colors border-b-2 border-primary/20 pb-2">
                  View Full Portfolio <ChevronRight size={18} className="translate-y-px group-hover:translate-x-2 transition-transform" />
               </Link>
            </div>

            {loading ? (
               <div className="py-32 flex flex-col items-center justify-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Consulting Directory...</p>
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
         {/* Decoration */}
         <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/2 rounded-full -mr-[25vw] -mt-[10vw] blur-3xl" />
         
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-12 animate-slide-right">
               <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-dark text-primary font-black text-[10px] uppercase tracking-[3px] rounded-full">
                     <Award size={14} /> Platinum Covenant
                  </div>
                  <h2 className="text-4xl md:text-6xl font-serif text-secondary-dark font-black leading-tight tracking-tight">
                     Unparalleled <br />
                     <span className="text-primary italic">Member Rights</span>
                  </h2>
                  <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-lg">
                     Unlock secret global rates, daily complimentary heritage breakfasts, and priority suite expansions across all five continents.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4 group">
                     <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                        <Zap size={24} />
                     </div>
                     <h4 className="text-lg font-bold text-secondary-dark">Dynamic Savings</h4>
                     <p className="text-sm text-gray-400 font-medium leading-relaxed">Secure up to 35% reduction on off-cycle bookings for elite members.</p>
                  </div>
                  <div className="space-y-4 group">
                     <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                        <ShieldCheck size={24} />
                     </div>
                     <h4 className="text-lg font-bold text-secondary-dark">Escrow Safety</h4>
                     <p className="text-sm text-gray-400 font-medium leading-relaxed">Complete financial insurance and instant refunds on all premium tiers.</p>
                  </div>
               </div>

               <Link to="/register" className="btn-gold h-16 w-full md:w-auto inline-flex items-center justify-center gap-4 px-12">
                  Begin Membership <ChevronRight size={20} />
               </Link>
            </div>

            <div className="relative animate-slide-up">
               <div className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-premium-dark border-8 border-white group">
                  <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" alt="Privilege" />
               </div>
               {/* Floating Stat Badge */}
               <div className="absolute bottom-12 -left-12 z-20 bg-white p-8 rounded-[2.5rem] shadow-premium-dark border border-gray-50 flex items-center gap-6 animate-bounce-slow">
                  <div className="flex flex-col">
                     <div className="flex items-center gap-2 mb-2">
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#C5A059" color="#C5A059" />)}
                     </div>
                     <p className="text-xl font-black text-secondary-dark italic font-serif">World Standard</p>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Hospitality Audit 2026</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. HERITAGE & MISSION */}
      <section id="about-us" className="py-40 px-4 md:px-10 lg:px-20 bg-secondary-dark relative">
         <div className="max-w-7xl mx-auto space-y-24">
            <div className="flex flex-col lg:flex-row items-center gap-20">
               <div className="flex-1 relative order-2 lg:order-1">
                  <div className="aspect-square rounded-[3.5rem] overflow-hidden group shadow-2xl skew-y-1">
                     <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[4s]" alt="Heritage" />
                  </div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 backdrop-blur-3xl rounded-full mix-blend-overlay" />
               </div>
               <div className="flex-[1.2] space-y-10 order-1 lg:order-2">
                  <div className="space-y-4">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[4px]">The Blueprint of Stay</p>
                     <h2 className="text-5xl md:text-6xl font-serif text-white font-black leading-tight tracking-tight">
                        Timeless <br />
                        <span className="text-primary italic">Atmospheres</span>
                     </h2>
                  </div>
                  <p className="text-xl text-white/60 font-medium leading-relaxed italic">
                     "We do not facilitate occupancy; we curate gateways to existence. Each PK UrbanStay property is a chapter in a global retrospective of quality."
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-10 border-t border-white/5">
                     <div className="space-y-2">
                        <p className="text-4xl font-serif text-white font-black italic">450<span className="text-primary">+</span></p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Archives</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-4xl font-serif text-white font-black italic">15k</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Heritage Suites</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-4xl font-serif text-white font-black italic">24h</p>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Elite Concierge</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 5. CULMINATION (FOOTER) */}
      <footer id="contact-us" className="bg-white border-t border-gray-100 pt-32 pb-16 px-4 md:px-10 lg:px-20 relative overflow-hidden">
         <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-gray-50 rounded-full -mr-[30vw] -mb-[30vw] -z-10" />
         
         <div className="max-w-7xl mx-auto space-y-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
               
               {/* Brand Pillar (Col 4) */}
               <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-6">
                     <div className="group flex items-center gap-4 cursor-pointer">
                        <div className="w-14 h-14 bg-secondary-dark rounded-2xl flex items-center justify-center p-2 group-hover:rotate-12 transition-transform shadow-xl">
                           <img src="/logo.png" className="w-[36px] h-[36px] object-contain" alt="PK UrbanStay" />
                        </div>
                        <div>
                           <h2 className="text-3xl font-serif font-black italic text-secondary-dark leading-none">PK UrbanStay</h2>
                           <p className="text-[10px] font-black text-primary uppercase tracking-[3px] mt-1">Heritage Hospitality</p>
                        </div>
                     </div>
                     <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm">
                        Establishing the gold standard of luxury stay management through verified covenants and architectural integrity since 2012.
                     </p>
                  </div>
                  
                  <div className="flex gap-4">
                     {[Facebook, Instagram, Twitter].map((Icon, i) => (
                       <button key={i} className="w-12 h-12 bg-gray-50 text-secondary-dark rounded-xl flex items-center justify-center hover:bg-secondary-dark hover:text-white transition-all border border-gray-100 shadow-sm">
                          <Icon size={20} />
                       </button>
                     ))}
                  </div>
               </div>

               {/* Links Hub (Col 5) */}
               <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-10">
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[4px]">The Archive</h4>
                     <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link to="/hotels" className="hover:text-primary transition-colors">Properties</Link></li>
                        <li><Link to="/#deals" className="hover:text-primary transition-colors">Elite Deals</Link></li>
                        <li><Link to="/manager/register" className="hover:text-primary transition-colors">Partnerships</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Journal</Link></li>
                     </ul>
                  </div>
                  <div className="space-y-8">
                     <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[4px]">Covenant</h4>
                     <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link to="/" className="hover:text-primary transition-colors">Help Terminal</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Travel Statutes</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Refund Logic</Link></li>
                        <li><Link to="/" className="hover:text-primary transition-colors">Privacy Lexicon</Link></li>
                     </ul>
                  </div>
                  <div className="hidden md:block space-y-8">
                     <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[4px]">Portal</h4>
                     <ul className="space-y-4 text-sm font-bold text-gray-400">
                        <li><Link to="/login" className="hover:text-primary transition-colors">Guest Access</Link></li>
                        <li><Link to="/manager/login" className="hover:text-primary transition-colors">Manager Suite</Link></li>
                        <li><Link to="/register" className="hover:text-primary transition-colors">Register Now</Link></li>
                     </ul>
                  </div>
               </div>

               {/* Intelligence Terminal (Col 3) */}
               <div className="lg:col-span-3 bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between group">
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[4px]">Contact Hub</h4>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 group/item">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100 group-hover/item:bg-primary group-hover/item:text-white transition-all">
                              <MapPin size={16} />
                           </div>
                           <p className="text-xs font-black text-secondary-dark">GLOBAL HUB, LONDON</p>
                        </div>
                        <div className="flex items-center gap-4 group/item">
                           <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100 group-hover/item:bg-primary group-hover/item:text-white transition-all">
                              <Mail size={16} />
                           </div>
                           <p className="text-xs font-black text-secondary-dark truncate">HELLO@PKURBANSTAY.COM</p>
                        </div>
                     </div>
                  </div>
                  
                  <button className="mt-10 h-14 bg-secondary-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[3px] shadow-lg shadow-secondary/20 flex items-center justify-center gap-3 group-hover:bg-primary transition-all">
                     Consult Concierge <MessageCircle size={16} />
                  </button>
               </div>
            </div>

            <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">© {new Date().getFullYear()} PK UrbanStay Hospitality Group. International Covenants Apply.</p>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-gray-400">
                     <ShieldCheck size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">SSL VERIFIED</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-gray-400">
                     <Globe size={14} /> <span className="text-[10px] font-black uppercase tracking-widest">GLOBAL STANDARDS</span>
                  </div>
               </div>
            </div>
         </div>
      </footer>

      <style>{`
        @keyframes scale-slow { from { transform: scale(1); } to { transform: scale(1.1); } }
        .animate-scale-slow { animation: scale-slow 20s ease-in-out infinite alternate; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-right { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-right { animation: slide-right 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Home;
