import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { Loader2, ArrowRight, Sparkles, Building2, ShieldCheck, Mail, MapPin } from 'lucide-react';

const Home = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clear state to prevent scrolling again on navigation/refresh
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state]);

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

  const handleSearch = (query) => {
    const checkin = query.startDate ? query.startDate.toISOString().split('T')[0] : '';
    const checkout = query.endDate ? query.endDate.toISOString().split('T')[0] : '';
    const params = new URLSearchParams();
    if (query.location) params.append('location', query.location);
    if (checkin) params.append('checkin', checkin);
    if (checkout) params.append('checkout', checkout);
    if (query.guests) params.append('guests', query.guests);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="animate-fade-in bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[92vh] min-h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover grayscale-[20%] brightness-[0.7]" 
            alt="Luxury Hotel"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-[6%] flex flex-col justify-center items-start pb-20">
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-[#c5a059] text-[10px] font-black uppercase tracking-[3px]">
              <Sparkles size={14} /> The Elite Collection
            </div>
            <h1 className="text-6xl md:text-8xl font-serif text-white font-black leading-[0.9] tracking-tighter">
              Discover <br />
              <span className="text-[#c5a059] italic">Refinement.</span>
            </h1>
            <p className="max-w-xl text-lg text-slate-200 font-medium leading-relaxed opacity-90">
              Curating architectural marvels and heritage stays for the modern traveler. 
              Experience the convergence of industrial chic and timeless luxury.
            </p>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="absolute bottom-16 left-0 w-full px-[4%] z-20">
          <div className="max-w-[1100px] mx-auto animate-slide-up animation-delay-300">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Curated Properties Section */}
      <section className="py-32 px-[6%] max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
             <div className="text-[11px] font-black text-[#c5a059] uppercase tracking-[4px]">Featured Portfolio</div>
             <h2 className="text-4xl md:text-5xl font-serif text-slate-900 font-black tracking-tight leading-none">
                Popular <br />
                <span className="italic opacity-50 underline decoration-1 underline-offset-8">Properties</span>
             </h2>
          </div>
          <button onClick={() => navigate('/hotels')} className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
             View Entire Collection <ArrowRight className="group-hover:translate-x-2 transition-transform text-[#c5a059]" size={20} />
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin text-[#c5a059]" size={42} />
          </div>
        ) : popularHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {popularHotels.map((hotel) => (
              <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400 font-medium">No properties currently available in the collection.</div>
        )}
      </section>

      {/* About Section (Our Heritage) */}
      <section id="about" className="py-32 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100 -skew-x-12 translate-x-1/2 opacity-50" />
        
        <div className="max-w-[1400px] mx-auto px-[6%] grid lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-10 relative z-10">
              <div className="space-y-4">
                 <div className="text-[11px] font-black text-[#c5a059] uppercase tracking-[4px]">Our Heritage</div>
                 <h2 className="text-5xl md:text-6xl font-serif text-slate-900 font-black leading-tight tracking-tight">
                    Sophisticated Stays <br />
                    for the <span className="italic text-[#c5a059]">Discerning.</span>
                 </h2>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                 Founded in 2020, PK UrbanStay began with a single vision: to transform industrial spaces into 
                 chic, high-luxury havens. Today, we are a premier gateway to the world's most unique properties, 
                 blending raw architectural beauty with elite hospitality standards. Every property in our portfolio 
                 is hand-verified for quality, aesthetics, and safety.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                 <div>
                    <div className="text-3xl font-serif font-black text-slate-900 mb-1">500+</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Properties</div>
                 </div>
                 <div>
                    <div className="text-3xl font-serif font-black text-slate-900 mb-1">24/7</div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Concierge Support</div>
                 </div>
              </div>
           </div>
           
           <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200" 
                className="rounded-[3rem] shadow-2xl relative z-10 grayscale-[30%]" 
                alt="Architecture"
              />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#c5a059]/10 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-200 rounded-full -z-10" />
           </div>
        </div>
      </section>

      {/* Trust & Support Section */}
      <section className="py-32 px-[6%] max-w-[1400px] mx-auto">
         <div className="grid md:grid-cols-3 gap-16">
            <div id="contact" className="space-y-6">
               <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-[#c5a059] shadow-xl">
                  <Mail size={28} />
               </div>
               <h3 className="text-2xl font-serif font-black text-slate-900">Get in Touch</h3>
               <p className="text-slate-500 text-sm leading-relaxed">Dedicated support for reservations and property inquiries available 24/7.</p>
               <a href="mailto:support@pkurbanstay.com" className="block text-sm font-black uppercase tracking-widest text-[#c5a059] hover:underline">support@pkurbanstay.com</a>
            </div>

            <div className="space-y-6">
               <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl shadow-premium flex items-center justify-center text-slate-400">
                  <ShieldCheck size={28} />
               </div>
               <h3 className="text-2xl font-serif font-black text-slate-900">Verified Stays</h3>
               <p className="text-slate-500 text-sm leading-relaxed">Every property undergoes a rigorous 50-point audit to ensure global luxury standards.</p>
               <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Secure Payments <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               </div>
            </div>

            <div id="help" className="space-y-6">
               <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl shadow-premium flex items-center justify-center text-slate-400">
                  <MapPin size={28} />
               </div>
               <h3 className="text-2xl font-serif font-black text-slate-900">Global Coverage</h3>
               <p className="text-slate-500 text-sm leading-relaxed">Strategic locations in 40+ countries, focusing on metropolitan and heritage hubs.</p>
               <button className="text-sm font-black uppercase tracking-widest text-slate-900 hover:text-[#c5a059] transition-all">Explore Locations</button>
            </div>
         </div>
      </section>

      {/* Footer Branding */}
      <footer className="py-20 border-t border-slate-100 px-[6%] text-center">
         <div className="flex items-center justify-center gap-2 mb-6">
            <Building2 className="text-[#c5a059]" size={24} />
            <span className="text-xl font-serif font-black text-slate-900 tracking-tight">UrbanStay<span className="text-[#c5a059]">.</span></span>
         </div>
         <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto leading-relaxed">
            &copy; 2026 PK UrbanStay global hospitality collection. <br />
            Architectural heritage meets modern luxury.
         </p>
      </footer>

      <style>{`
        @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes slide-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards; }
        .animation-delay-300 { animation-delay: 300ms; }
        .shadow-premium { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
};

export default Home;
