import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { Loader2, Sparkles, Building2, Globe } from 'lucide-react';

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

          {/* Integrated Search Bar Placeholder / Transition */}
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl">
            <div className="bg-white rounded-xl p-6 md:p-8">
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
      <section className="py-20 border-b border-slate-100">
         <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
               {[
                 { icon: <Globe className="text-luxury-gold" />, title: "Prime Locations", desc: "Handpicked global spots" },
                 { icon: <Sparkles className="text-luxury-gold" />, title: "Premium Service", desc: "24/7 Personal concierge" },
                 { icon: <Building2 className="text-luxury-gold" />, title: "Historic Design", desc: "Preserved heritage sites" },
                 { icon: <Globe className="text-luxury-gold" />, title: "Secure Booking", desc: "Direct & Safe payments" },
               ].map((item, idx) => (
                 <div key={idx} className="flex flex-col items-center text-center">
                    <div className="mb-4 p-4 rounded-full bg-slate-50">{item.icon}</div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Popular Properties Section */}
      <section id="hotels" className="py-32 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <p className="text-luxury-gold text-xs font-black uppercase tracking-[0.4em] mb-4 text-center md:text-left">Portfolio of Excellence</p>
              <h2 className="text-5xl font-serif text-slate-900 text-center md:text-left">Popular Properties</h2>
            </div>
            <button 
              onClick={() => navigate('/hotels')}
              className="mt-6 md:mt-0 px-8 py-3 border border-slate-200 rounded-full text-sm font-bold hover:bg-slate-900 hover:text-white transition-all uppercase tracking-widest"
            >
              View All Properties
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[#c5a059]" size={40} />
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
      <section id="about" className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
               <div className="aspect-[4/5] rounded-[2rem] overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
               </div>
               <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-luxury-gold rounded-[2rem] p-10 flex flex-col justify-center text-white hidden md:flex shadow-2xl">
                  <Sparkles size={40} className="mb-6" />
                  <h3 className="text-3xl font-serif font-bold leading-tight">Redefining Stay</h3>
                  <p className="text-sm mt-4 opacity-80">Award winning hospitality in every corner.</p>
               </div>
            </div>

            <div className="lg:pl-10">
               <p className="text-luxury-gold text-xs font-black uppercase tracking-[0.4em] mb-4">Our Heritage</p>
               <h2 className="text-5xl md:text-6xl font-serif text-slate-900 leading-tight mb-8">Unforgettable Moments, Masterfully Crafted</h2>
               <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium">
                  We believe that luxury is not just a destination, but a journey of small details. 
                  UrbanStay connects discerning travelers with historic locations reimagined for today's excellence.
               </p>
               
               <div className="grid grid-cols-2 gap-10">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                     <p className="text-4xl font-serif font-black text-slate-900 mb-2">12k+</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Happy Guests</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                     <p className="text-4xl font-serif font-black text-slate-900 mb-2">150+</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Destinations</p>
                  </div>
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
      `}</style>
    </div>
  );
};

export default Home;
