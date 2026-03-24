import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { Loader2, ArrowRight, Sparkles, Building2, ShieldCheck, Mail, MapPin, Globe } from 'lucide-react';

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
      <section className="relative h-[95vh] min-h-[750px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover grayscale-[10%] brightness-[0.75]" 
            alt="Luxury Hotel"
          />
          {/* Gradients for Visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/20 to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-[6%] flex flex-col justify-center items-start pb-32">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full text-[#c5a059] text-[11px] font-black uppercase tracking-[4px] border border-white/10">
              <Sparkles size={14} /> The PK Elite Collection
            </div>
            <h1 className="text-7xl md:text-9xl font-serif text-white font-black leading-[0.85] tracking-tighter drop-shadow-2xl">
              Curated <br />
              <span className="text-[#c5a059] italic">Hospitality.</span>
            </h1>
            <p className="max-w-2xl text-xl text-slate-100 font-medium leading-relaxed opacity-95 drop-shadow-lg">
              We connect discerning travelers with architectural heritage and modern industrial chic. 
              Our global portfolio is hand-verified for perfection.
            </p>
          </div>
        </div>

        {/* Floating Search Bar */}
        <div className="absolute bottom-20 left-0 w-full px-[4%] z-20">
          <div className="max-w-[1150px] mx-auto animate-slide-up animation-delay-300">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Curated Properties Section */}
      <section className="py-40 px-[6%] max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
          <div className="space-y-6">
             <div className="text-[12px] font-black text-[#c5a059] uppercase tracking-[5px] opacity-80">Portfolio of Excellence</div>
             <h2 className="text-5xl md:text-6xl font-serif text-slate-900 font-black tracking-tighter leading-none">
                Popular <br />
                <span className="italic text-[#c5a059]/40 underline decoration-1 underline-offset-[12px]">Properties</span>
             </h2>
          </div>
          <button onClick={() => navigate('/hotels')} className="group flex items-center gap-4 text-xs font-black uppercase tracking-[3px] text-slate-400 hover:text-slate-900 transition-all">
             Explore Global Collection <ArrowRight className="group-hover:translate-x-2 transition-transform text-[#c5a059]" size={22} />
          </button>
        </div>

        {loading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="animate-spin text-[#c5a059]" size={48} />
          </div>
        ) : popularHotels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {popularHotels.map((hotel) => (
              <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-slate-400 font-bold uppercase tracking-widest text-sm opacity-50">No properties available in the current portfolio.</div>
        )}
      </section>

      {/* About Section (Our Heritage) */}
      <section id="about" className="py-40 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-100 -skew-x-12 translate-x-1/2 opacity-50" />
        
        <div className="max-w-[1400px] mx-auto px-[6%] grid lg:grid-cols-2 gap-24 items-center">
           <div className="space-y-12 relative z-10">
              <div className="space-y-6">
                 <div className="text-[12px] font-black text-[#c5a059] uppercase tracking-[5px]">Defining the Standard</div>
                 <h2 className="text-6xl md:text-7xl font-serif text-slate-900 font-black leading-[0.9] tracking-tighter">
                    Timeless Haunts <br />
                    for <span className="italic text-[#c5a059]">Explorers.</span>
                 </h2>
              </div>
              <p className="text-slate-500 text-xl leading-relaxed max-w-xl font-medium">
                 PK UrbanStay represents a convergence of industrial legacy and elite comfort. 
                 Since 2020, we have curated architectural masterpieces across 40+ countries, 
                 ensuring every guest experiences the soul of their destination with 
                 unmatched luxury.
              </p>
              <div className="flex gap-12 pt-8">
                 <div>
                    <div className="text-4xl font-serif font-black text-slate-900 mb-2">480+</div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[3px]">Verified Portls</div>
                 </div>
                 <div className="w-px h-12 bg-slate-200" />
                 <div>
                    <div className="text-4xl font-serif font-black text-slate-900 mb-2">9.8/10</div>
                    <div className="text-[11px] font-black text-slate-400 uppercase tracking-[3px]">Average Satisfaction</div>
                 </div>
              </div>
           </div>
           
           <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200" 
                className="rounded-[4rem] shadow-premium relative z-10 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                alt="Architecture"
              />
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#c5a059]/15 rounded-full blur-[80px]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-slate-200/50 rounded-full -z-10" />
           </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact" className="py-40 px-[6%] max-w-[1400px] mx-auto">
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-20">
            <div className="space-y-8">
               <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-[#c5a059] shadow-2xl">
                  <Mail size={32} />
               </div>
               <div>
                  <h3 className="text-3xl font-serif font-black text-slate-900 mb-4 tracking-tight">Direct Support</h3>
                  <p className="text-slate-500 text-base leading-relaxed mb-6">Our 24/7 concierge suite handles all reservations and complex travel logistics.</p>
                  <a href="mailto:support@pkurbanstay.com" className="text-base font-black text-[#c5a059] hover:text-slate-900 transition-colors uppercase tracking-widest border-b-2 border-[#c5a059]/30 pb-1">support@pkurbanstay.com</a>
               </div>
            </div>

            <div className="space-y-8">
               <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2rem] shadow-premium flex items-center justify-center text-slate-300">
                  <Building2 size={32} />
               </div>
               <div>
                  <h3 className="text-3xl font-serif font-black text-slate-900 mb-4 tracking-tight">Corporate Office</h3>
                  <p className="text-slate-500 text-base leading-relaxed">
                     PK UrbanStay Heritage Plaza <br />
                     Level 12, Midtown Industrial Hub <br />
                     London, UK SE1 7PB
                  </p>
                  <p className="text-slate-400 text-[11px] font-black uppercase tracking-[3px] mt-4">Visit by Appointment Only</p>
               </div>
            </div>

            <div id="help" className="space-y-8">
               <div className="w-20 h-20 bg-white border border-slate-100 rounded-[2rem] shadow-premium flex items-center justify-center text-slate-300">
                  <Globe size={32} />
               </div>
               <div>
                  <h3 className="text-3xl font-serif font-black text-slate-900 mb-4 tracking-tight">Our Collection</h3>
                  <p className="text-slate-500 text-base leading-relaxed mb-6">Access our unified portal for property owners and travel agencies worldwide.</p>
                  <div className="flex flex-col gap-3">
                     <button className="text-left text-sm font-black text-slate-900 hover:text-[#c5a059] uppercase tracking-widest transition-all">Property Onboarding &rarr;</button>
                     <button className="text-left text-sm font-black text-slate-900 hover:text-[#c5a059] uppercase tracking-widest transition-all">Elite Partner Portal &rarr;</button>
                  </div>
               </div>
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
