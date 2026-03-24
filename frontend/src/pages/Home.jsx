import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { Loader2, Sparkles, Building2, Globe } from 'lucide-react';

const Home = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="relative min-h-screen bg-[#1a1a1a] overflow-x-hidden">
      
      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center bg-diagonal-pattern px-[4%]">
        <div className="max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           
           {/* Left Content */}
           <div className="relative z-10 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-px w-10 bg-[#c5a059]" />
                 <span className="text-white text-sm font-black uppercase tracking-[0.3em]">Hotel & Resort</span>
                 <div className="h-px w-10 bg-[#c5a059]" />
              </div>

              <h1 className="text-6xl md:text-8xl text-white font-serif leading-[1.1] mb-8">
                 Enjoy a <span className="text-luxury-gold italic">Luxury</span> <br /> 
                 Experience
              </h1>

              <p className="text-slate-400 text-lg max-w-lg mb-12 leading-relaxed font-medium">
                 Experience unparalleled elegance and high-end comfort in the heart of global heritage. 
                 Discover bespoke services tailored for the modern traveler.
              </p>

              <div className="flex flex-wrap gap-6">
                 <button className="px-12 py-5 bg-luxury-gold hover:bg-luxury-gold-hover text-white font-black uppercase tracking-[0.2em] rounded-md transition-all active:scale-95 shadow-xl shadow-[#c5a059]/10">
                    Book Now
                 </button>
                 <button className="px-12 py-5 border-2 border-white/20 hover:border-[#c5a059] text-white font-black uppercase tracking-[0.2em] rounded-md transition-all hover:text-[#c5a059]">
                    Know More
                 </button>
              </div>

              {/* Decorative Dots */}
              <div className="absolute -top-10 -left-10 grid grid-cols-6 gap-3 opacity-20">
                 {[...Array(12)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />)}
              </div>
           </div>

           {/* Right Image Container */}
           <div className="relative animate-slide-up flex justify-center lg:justify-end">
              <div className="relative h-[650px] w-full max-w-[450px] rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                 <img 
                    src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" 
                    alt="Luxury Hotel" 
                    className="w-full h-full object-cover"
                 />
                 
                 {/* Hexagon Badge */}
                 <div className="absolute top-1/2 -left-16 -translate-y-1/2 z-20">
                    <div className="hex-shape bg-[#1a1a1a] p-1.5 shadow-2xl">
                       <div className="hex-shape bg-luxury-gold p-10 flex flex-col items-center justify-center text-white text-center min-w-[220px]">
                          <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-80 leading-none">Rate starts from</p>
                          <p className="text-5xl font-black mb-1">$45</p>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-tight">Nett per night</p>
                       </div>
                    </div>
                 </div>

                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Decorative Dots Right */}
              <div className="absolute -bottom-10 -right-10 grid grid-cols-6 gap-3 opacity-20">
                 {[...Array(12)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-white rounded-full" />)}
              </div>
           </div>
        </div>

        {/* Floating Search Bar */}
        <SearchBar />
      </section>

      {/* Featured Section */}
      <section id="hotels" className="py-40 bg-white">
        <div className="max-w-[1440px] mx-auto px-[4%]">
          <div className="text-center mb-24">
            <p className="text-[#c5a059] text-xs font-black uppercase tracking-[0.5em] mb-4">Portfolio of Excellence</p>
            <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight">Popular Properties</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-[#c5a059]" size={40} />
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

      {/* About Section */}
      <section id="about" className="py-40 bg-slate-50">
         <div className="max-w-[1440px] mx-auto px-[4%] grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-6">
                  <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80" className="rounded-3xl h-64 w-full object-cover" />
                  <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80" className="rounded-3xl h-80 w-full object-cover" />
               </div>
               <div className="space-y-6 pt-12">
                  <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80" className="rounded-3xl h-80 w-full object-cover" />
                  <div className="bg-luxury-gold p-8 rounded-3xl h-64 flex flex-col justify-center text-white">
                     <Sparkles size={32} className="mb-4" />
                     <h3 className="text-2xl font-serif font-bold leading-tight">Heritage <br />Excellence</h3>
                  </div>
               </div>
            </div>

            <div>
               <p className="text-[#c5a059] text-xs font-black uppercase tracking-[0.5em] mb-4">Our Heritage</p>
               <h2 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">Redefining The Art Of Stay</h2>
               <p className="text-slate-500 text-lg leading-relaxed mb-10 font-medium max-w-xl">
                  Founded on preservation and modern luxury, UrbanStay connects discerning travelers with historic locations reimagined for today's excellence.
               </p>
               <div className="flex gap-12">
                  <div>
                     <p className="text-4xl font-serif font-black text-slate-900 mb-2">500+</p>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Global Partners</p>
                  </div>
                  <div>
                     <p className="text-4xl font-serif font-black text-slate-900 mb-2">24/7</p>
                     <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Concierge</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <style>{`
        .hex-shape {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
      `}</style>
    </div>
  );
};

export default Home;
