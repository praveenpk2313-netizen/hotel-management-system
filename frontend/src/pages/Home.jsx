import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels, fetchPublicPromotions } from '../services/api';
import { 
  Loader2, 
  Sparkles, 
  Building2, 
  Globe, 
  ArrowRight, 
  Tag, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const Home = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        scrollToSection(location.state.scrollTo);
      }, 100);
    }
  }, [location.state]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hotelsRes, promoRes] = await Promise.all([
          fetchHotels(),
          fetchPublicPromotions()
        ]);
        setPopularHotels(hotelsRes.data.slice(0, 4));
        setPromotions(promoRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-50 overflow-x-hidden">
      
      {/* Hero Section - Centered Clean Layout */}
      <section id="hero" className="relative min-h-screen py-32 lg:py-0 flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=100&w=2000" 
            alt="Luxury Night View" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/80 via-transparent to-[#020617]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 animate-fade-in mt-20">
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-[1px] w-12 bg-indigo-500/50" />
            <span className="text-indigo-400 text-xs font-black uppercase tracking-[0.6em]">Urban Sanctuary & Escapes</span>
            <span className="h-[1px] w-12 bg-indigo-500/50" />
          </div>

          <h1 className="text-6xl md:text-9xl text-white font-serif leading-[0.9] mb-10 tracking-tighter">
            Elegance <br />
            <span className="text-luxury-gradient italic font-black">Redefined</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto mb-16 font-medium leading-relaxed">
            Discover a curated collection of the world's most sophisticated stays. 
            Where architectural brilliance meets unparalleled personalized service.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 mb-24 animate-slide-up">
             <button 
               onClick={() => navigate('/hotels')}
               className="btn-premium px-12 py-5 glow-indigo group"
             >
                Explore Collection
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
             </button>
             <button 
               onClick={() => scrollToSection('about')}
               className="px-12 py-5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-white/5 transition-all backdrop-blur-md"
             >
                Our Philosophy
             </button>
          </div>

          {/* Integrated Search Bar Placeholder / Transition */}
          <div className="max-w-5xl mx-auto bg-slate-900/40 backdrop-blur-3xl p-3 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-50 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="bg-white rounded-[2rem] overflow-hidden">
               <SearchBar />
            </div>
          </div>
        </div>

        {/* Ambient Decorative Elements */}
        <div className="absolute bottom-20 left-20 hidden lg:flex flex-col gap-4 opacity-20">
           <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
           <div className="w-1.5 h-1.5 bg-white rounded-full" />
           <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-32 border-b border-white/5 bg-slate-950/50">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-12">
               {[
                 { icon: <Globe className="text-indigo-400" />, title: "Iconic Locations", desc: "Premier global destinations" },
                 { icon: <Sparkles className="text-indigo-400" />, title: "Bespoke Service", desc: "24/7 Elite concierge" },
                 { icon: <Building2 className="text-indigo-400" />, title: "Timeless Design", desc: "Architectural masterpieces" },
                 { icon: <Globe className="text-indigo-400" />, title: "Secure Retreat", desc: "Absolute privacy & security" },
               ].map((item, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="mb-8 p-6 rounded-[2rem] bg-slate-900/50 border border-white/5 group-hover:border-indigo-500/50 transition-all duration-700 group-hover:-translate-y-2">
                      {item.icon}
                    </div>
                    <h3 className="font-black text-white mb-3 uppercase tracking-widest text-xs">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ── PROMOTIONS SECTION ────────────────────────────────────────────────── */}
      {promotions.length > 0 && (
        <section className="py-32 bg-[#020617] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-3 px-4 py-2 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                    <Tag size={16} className="text-indigo-400" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Seasonal Privileges</span>
                 </div>
                 <h2 className="text-5xl font-serif text-white font-bold leading-tight">Exclusive <br />Curated Offers</h2>
              </div>
              <div className="hidden md:flex gap-3 pb-2">
                 <div className="w-12 h-1.5 bg-indigo-500 rounded-full" />
                 <div className="w-4 h-1.5 bg-white/10 rounded-full" />
                 <div className="w-4 h-1.5 bg-white/10 rounded-full" />
              </div>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide snap-x">
              {promotions.map((promo) => (
                <div 
                  key={promo._id} 
                  className="min-w-[320px] md:min-w-[480px] bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-12 snap-center hover:bg-slate-900/60 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all" />
                  
                  <div className="space-y-8 relative z-10">
                    <div className="flex justify-between items-start">
                       <span className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                          {promo.hotelId ? promo.hotelId.name : 'Global Collection'}
                       </span>
                       <TrendingUp className="text-indigo-400 opacity-40 shrink-0" size={24} />
                    </div>

                    <h3 className="text-3xl font-serif text-white font-bold leading-tight group-hover:text-indigo-400 transition-colors">
                       {promo.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed font-medium line-clamp-3">
                       {promo.content}
                    </p>

                    <button 
                      onClick={() => navigate(promo.hotelId ? `/hotel/${promo.hotelId._id}` : '/hotels')}
                      className="flex items-center gap-4 text-indigo-400 text-[10px] font-black uppercase tracking-widest hover:gap-6 transition-all pt-4"
                    >
                       Discover More <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Properties Section */}
      <section id="hotels" className="py-40 bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10 animate-fade-in">
            <div className="space-y-4">
              <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.5em] mb-2 text-center md:text-left">The Collection</p>
              <h2 className="text-5xl md:text-7xl font-serif text-white text-center md:text-left leading-tight">Elite <br />Properties</h2>
            </div>
            <button 
              onClick={() => navigate('/hotels')}
              className="px-12 py-5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-slate-950 transition-all backdrop-blur-xl shadow-2xl"
            >
              Browse All Escapes
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-[3rem] bg-slate-900/50 animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {popularHotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About & Experience section */}
      <section id="about" className="py-48 bg-[#020617] relative">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div className="relative group">
               <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
                  <img 
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80" 
                  />
               </div>
               <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-slate-900/60 backdrop-blur-3xl rounded-[4rem] p-12 flex flex-col justify-center text-white hidden md:flex shadow-2xl border border-white/10 group-hover:-translate-x-6 group-hover:-translate-y-6 transition-transform duration-1000">
                  <Sparkles size={48} className="text-indigo-400 mb-8" />
                  <h3 className="text-4xl font-serif font-bold leading-tight">Masterfully <br />Created</h3>
                  <p className="text-sm mt-8 text-slate-400 font-medium leading-relaxed">Connecting discerning travelers with architectural heritage reimagined for the modern era.</p>
               </div>
            </div>

            <div className="lg:pl-20">
               <p className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.5em] mb-6">Our Legacy</p>
               <h2 className="text-5xl md:text-8xl font-serif text-white leading-[0.9] mb-12 tracking-tighter">Beyond <br />Expectation</h2>
               <p className="text-slate-400 text-xl leading-relaxed mb-16 font-medium">
                  We believe that true luxury is found in the quiet moments of perfection. 
                  Every property is a testament to historic soulful design and forward-thinking comfort.
               </p>
               
               <div className="grid grid-cols-2 gap-10 mb-16">
                  <div className="p-10 rounded-[3rem] bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 transition-all group">
                     <p className="text-6xl font-serif font-black text-white mb-2 group-hover:text-indigo-400 transition-colors">15k+</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Members</p>
                  </div>
                  <div className="p-10 rounded-[3rem] bg-slate-900/40 border border-white/5 hover:border-indigo-500/30 transition-all group">
                     <p className="text-6xl font-serif font-black text-white mb-2 group-hover:text-indigo-400 transition-colors">24/7</p>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Elite Support</p>
                  </div>
               </div>

               <button 
                 onClick={() => navigate('/hotels')}
                 className="btn-premium px-12 py-5 glow-indigo"
               >
                  Join the Collection
               </button>
            </div>
         </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-48 bg-slate-950 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/5 -skew-x-12 translate-x-1/3" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
               <div className="text-left">
                  <div className="inline-flex p-5 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 mb-10">
                     <Globe className="text-indigo-400" size={32} />
                  </div>
                  <h2 className="text-5xl md:text-8xl font-serif text-white leading-[0.9] mb-10 tracking-tighter">Your Sanctuary <br />Awaits</h2>
                  <p className="text-slate-400 text-xl max-w-xl mb-16 font-medium leading-relaxed">
                     Our personal concierges are available 24/7 to curate your unique experience. 
                     Let us design your next unforgettable escape.
                  </p>
                  
                  <div className="space-y-12">
                     <div className="flex items-center gap-8 group cursor-pointer">
                        <div className="w-16 h-16 rounded-3xl bg-slate-900/50 border border-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-700 text-white shadow-2xl">
                           <Globe size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-sans">Global HQ</p>
                           <p className="text-white font-serif text-2xl tracking-tight">Knightsbridge, London, UK</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-8 group cursor-pointer">
                        <div className="w-16 h-16 rounded-3xl bg-slate-900/50 border border-white/5 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all duration-700 text-white shadow-2xl">
                           <Sparkles size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 font-sans">Contact Details</p>
                           <p className="text-white font-serif text-2xl tracking-tight">concierge@pkurbanstay.com / +44 20 7000 0000</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-900/40 backdrop-blur-3xl p-12 md:p-16 rounded-[4rem] border border-white/5 shadow-2xl">
                  <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 font-sans">Full Name</label>
                           <input type="text" placeholder="Alex Sterling" className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 outline-none focus:border-indigo-500 transition-all font-sans font-bold" />
                        </div>
                        <div className="space-y-4">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 font-sans">Private Email</label>
                           <input type="email" placeholder="alex@sterling.com" className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 outline-none focus:border-indigo-500 transition-all font-sans font-bold" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 font-sans">Inquiry Focus</label>
                        <select className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-indigo-500 transition-all font-sans font-black uppercase text-xs appearance-none cursor-pointer">
                           <option>Bespoke Concierge</option>
                           <option>Corporate Retreats</option>
                           <option>VIP Villa Bookings</option>
                           <option>Event Curation</option>
                        </select>
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1 font-sans">Your Message</label>
                        <textarea placeholder="How can we elevate your journey?" rows="4" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-white/20 outline-none focus:border-indigo-500 transition-all font-sans font-bold resize-none"></textarea>
                     </div>
                     <button type="submit" className="w-full h-20 bg-indigo-600 text-white font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white hover:text-slate-950 transition-all shadow-2xl glow-indigo">
                        Send Inquiry
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </section>

      <style>{`
        .animate-slow-zoom {
          animation: slowZoom 30s infinite alternate cubic-bezier(0.445, 0.05, 0.55, 0.95);
        }
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
        .animate-slide-up {
          animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
