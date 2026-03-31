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
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      
      {/* Hero Section - Centered Clean Layout */}
      <section id="hero" className="relative min-h-[95vh] py-32 lg:py-0 flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=100&w=2000" 
            alt="Luxury Resort" 
            className="w-full h-full object-cover scale-105 animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="h-[1px] w-8 bg-luxury-gold" />
            <span className="text-white text-xs font-black uppercase tracking-[0.4em]">Welcome to PK UrbanStay</span>
            <span className="h-[1px] w-8 bg-luxury-gold" />
          </div>

          <h1 className="text-6xl md:text-8xl text-white font-serif leading-tight mb-8">
            The Pinnacle of <br />
            <span className="text-luxury-gold italic font-black">Luxury Living</span>
          </h1>

          <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            Experience the extraordinary in the world's most iconic destinations. 
            Tailored comfort, historic elegance, and unparalleled service.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-16 animate-slide-up">
             <button 
               onClick={() => navigate('/hotels')}
               className="px-10 py-4 bg-luxury-gold text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-2xl flex items-center gap-2 group"
             >
                Start Exploring
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <button 
               onClick={() => scrollToSection('about')}
               className="px-10 py-4 border border-white/30 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-white/10 transition-all"
             >
                Our Story
             </button>
          </div>

          {/* Integrated Search Bar Placeholder / Transition */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl relative z-50">
            <div className="bg-white rounded-xl">
               <SearchBar />
            </div>
          </div>
        </div>

        {/* Ambient Decorative Elements */}
        <div className="absolute bottom-10 left-10 flex flex-col gap-2 opacity-30">
           <div className="w-1.5 h-1.5 bg-white rounded-full" />
           <div className="w-1.5 h-1.5 bg-white rounded-full" />
           <div className="w-1.5 h-1.5 bg-white rounded-full" />
        </div>
      </section>

      {/* Trust & Features Section */}
      <section className="py-24 border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
               {[
                 { icon: <Globe className="text-luxury-gold" />, title: "Prime Locations", desc: "Handpicked global spots" },
                 { icon: <Sparkles className="text-luxury-gold" />, title: "Premium Service", desc: "24/7 Personal concierge" },
                 { icon: <Building2 className="text-luxury-gold" />, title: "Historic Design", desc: "Preserved heritage sites" },
                 { icon: <Globe className="text-luxury-gold" />, title: "Secure Booking", desc: "Direct & Safe payments" },
               ].map((item, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="mb-6 p-5 rounded-3xl bg-slate-50 group-hover:bg-luxury-gold/10 transition-colors duration-500">{item.icon}</div>
                    <h3 className="font-black text-slate-900 mb-2 uppercase tracking-widest text-xs">{item.title}</h3>
                    <p className="text-xs text-slate-400 font-bold">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* ── PROMOTIONS SECTION ────────────────────────────────────────────────── */}
      {promotions.length > 0 && (
        <section className="py-20 bg-slate-950 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute -top-24 -left-24 w-96 h-96 bg-luxury-gold rounded-full blur-[120px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                 <div className="p-3 bg-luxury-gold/10 rounded-2xl text-luxury-gold">
                    <Tag size={24} />
                 </div>
                 <h2 className="text-3xl font-serif text-white font-bold">Exclusive Offers</h2>
              </div>
              <div className="hidden md:flex gap-2">
                 <div className="w-10 h-1 bg-luxury-gold rounded-full" />
                 <div className="w-4 h-1 bg-white/20 rounded-full" />
                 <div className="w-4 h-1 bg-white/20 rounded-full" />
              </div>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide snap-x">
              {promotions.map((promo) => (
                <div 
                  key={promo._id} 
                  className="min-w-[320px] md:min-w-[450px] bg-white/5 border border-white/10 rounded-[2.5rem] p-10 snap-center hover:bg-white/10 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 rounded-full blur-3xl group-hover:bg-luxury-gold/10 transition-all" />
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-start">
                       <span className="px-4 py-1 bg-luxury-gold/20 border border-luxury-gold/30 rounded-full text-[10px] font-black text-luxury-gold uppercase tracking-[0.2em]">
                          {promo.hotelId ? promo.hotelId.name : 'Global Collection'}
                       </span>
                       <TrendingUp className="text-luxury-gold opacity-30" size={20} />
                    </div>

                    <h3 className="text-2xl font-serif text-white font-bold leading-tight">
                       {promo.title}
                    </h3>
                    
                    <p className="text-slate-400 text-sm leading-relaxed font-medium line-clamp-3">
                       {promo.content}
                    </p>

                    <button 
                      onClick={() => navigate(promo.hotelId ? `/hotel/${promo.hotelId._id}` : '/hotels')}
                      className="flex items-center gap-3 text-luxury-gold text-xs font-black uppercase tracking-widest hover:gap-5 transition-all"
                    >
                       Discover More <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Properties Section */}
      <section id="hotels" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 animate-fade-in">
            <div>
              <p className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4 text-center md:text-left">Portfolio of Excellence</p>
              <h2 className="text-5xl md:text-6xl font-serif text-slate-900 text-center md:text-left">Popular Properties</h2>
            </div>
            <button 
              onClick={() => navigate('/hotels')}
              className="mt-10 md:mt-0 px-10 py-4 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all shadow-sm hover:shadow-xl"
            >
              View More Escapes
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-[2rem] bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularHotels.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About & Experience section */}
      <section id="about" className="py-40 bg-white">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative group">
               <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
               </div>
               <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-slate-900 rounded-[3rem] p-12 flex flex-col justify-center text-white hidden md:flex shadow-2xl border-8 border-white group-hover:-translate-x-4 group-hover:-translate-y-4 transition-transform duration-700">
                  <Sparkles size={48} className="text-luxury-gold mb-8" />
                  <h3 className="text-4xl font-serif font-bold leading-tight">Masterfully <br />Crafted</h3>
                  <p className="text-sm mt-6 opacity-60 font-medium">PK UrbanStay connects discerning travelers with historic locations reimagined for modern excellence.</p>
               </div>
            </div>

            <div className="lg:pl-16">
               <p className="text-luxury-gold text-[10px] font-black uppercase tracking-[0.5em] mb-4">Our Heritage</p>
               <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-[1.1] mb-10">Unforgettable Moments, Reimagined</h2>
               <p className="text-slate-500 text-lg leading-relaxed mb-12 font-medium">
                  We believe that luxury is not just a destination, but a journey of small details. 
                  Our team meticulously preserves the historic soul of our properties while integrating 
                  state-of-the-art comforts for the modern globalist.
               </p>
               
               <div className="grid grid-cols-2 gap-8 mb-12">
                  <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-luxury-gold/30 transition-colors">
                     <p className="text-5xl font-serif font-black text-slate-900 mb-2">12k+</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Happy Guests</p>
                  </div>
                  <div className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-luxury-gold/30 transition-colors">
                     <p className="text-5xl font-serif font-black text-slate-900 mb-2">24/7</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Concierge desk</p>
                  </div>
               </div>

               <button 
                 onClick={() => navigate('/hotels')}
                 className="px-12 py-5 bg-slate-900 text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-luxury-gold transition-all shadow-xl"
               >
                  Browse Collection
               </button>
            </div>
         </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-40 bg-slate-900 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/3 h-full bg-luxury-gold opacity-5 skew-x-12 translate-x-20" />
         <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-white/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
               <div className="text-left">
                  <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-8">
                     <Globe className="text-luxury-gold" size={32} />
                  </div>
                  <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">Let's Design Your <br />Perfect Escape</h2>
                  <p className="text-slate-400 text-lg max-w-xl mb-12 font-medium leading-relaxed">
                     Our personal concierges are available 24/7 to curate your unique stay. 
                     From historic suites to modern penthouses, your sanctuary awaits.
                  </p>
                  
                  <div className="space-y-10">
                     <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all duration-500 text-white">
                           <Globe size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Headquarters</p>
                           <p className="text-white font-serif text-xl tracking-wide">12th Ave, Mayfair, London, UK</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-6 group cursor-pointer">
                        <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all duration-500 text-white">
                           <Sparkles size={20} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Direct Assistance</p>
                           <p className="text-white font-serif text-xl tracking-wide">+44 20 7946 0123 / stay@pkurbanstay.com</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-white/5 backdrop-blur-3xl p-10 md:p-14 rounded-[3rem] border border-white/10 shadow-2xl">
                  <form className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                           <input type="text" placeholder="John Doe" className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white placeholder:text-white/20 outline-none focus:border-luxury-gold transition-colors font-sans font-bold" />
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Email</label>
                           <input type="email" placeholder="john@sanctuary.com" className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white placeholder:text-white/20 outline-none focus:border-luxury-gold transition-colors font-sans font-bold" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Inquiry Type</label>
                        <select className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-5 text-white outline-none focus:border-luxury-gold transition-colors font-sans font-black uppercase text-xs appearance-none cursor-pointer">
                           <option>General Concierge</option>
                           <option>Booking Request</option>
                           <option>VIP Experiences</option>
                           <option>Event Planning</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Message</label>
                        <textarea placeholder="Describe your dream stay..." rows="4" className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white placeholder:text-white/20 outline-none focus:border-luxury-gold transition-colors font-sans font-bold"></textarea>
                     </div>
                     <button type="submit" className="w-full h-16 bg-luxury-gold text-white font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-luxury-gold/20">
                        Inquire Now
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </section>

      <style>{`
        .animate-slow-zoom {
          animation: slowZoom 20s infinite alternate linear;
        }
        @keyframes slowZoom {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }
        .animate-slide-up {
          animation: slideUp 1s ease-out forwards;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
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
