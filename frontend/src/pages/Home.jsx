import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { Loader2, Sparkles, Building2, Globe, ArrowRight } from 'lucide-react';

const Home = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await fetchHotels();
        setPopularHotels(response.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching hotels:', error);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      
      {/* Hero Section - Centered Clean Layout */}
      <section id="hero" className="relative h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
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
            <span className="text-white text-xs font-black uppercase tracking-[0.4em]">Welcome to UrbanStay</span>
            <span className="h-[1px] w-8 bg-luxury-gold" />
          </div>

          <h1 className="text-6xl md:text-8xl text-white font-serif leading-tight mb-8">
            The Pinnacle of <br />
            <span className="text-luxury-gold italic">Luxury Living</span>
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
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl">
            <div className="bg-white rounded-xl overflow-hidden">
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
                  <p className="text-sm mt-6 opacity-60 font-medium">UrbanStay connects discerning travelers with historic locations reimagined for modern excellence.</p>
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
         <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <div className="inline-flex p-4 rounded-full bg-white/5 border border-white/10 mb-8">
               <Globe className="text-luxury-gold" size={24} />
            </div>
            <h2 className="text-5xl md:text-7xl font-serif text-white leading-tight mb-8">Let's Plan Your Next <br />Great Escape</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-16 font-medium">
               Whether you have questions about a specific property or need assistance with a complex booking, our elite concierge team is ready to assist you.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
                <button className="px-12 py-5 bg-luxury-gold text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-white hover:text-slate-900 transition-all shadow-2xl">
                   Speak with Concierge
                </button>
                <button className="px-12 py-5 border border-white/20 text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-white/10 transition-all">
                   Contact Support
                </button>
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
      `}</style>
    </div>
  );
};

export default Home;
