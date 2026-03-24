import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { 
  Search, 
  MapPin, 
  Wind, 
  Wifi, 
  Coffee, 
  SlidersHorizontal, 
  X, 
  Star,
  ChevronRight,
  Loader2,
  Calendar,
  Zap,
  Tag,
  ArrowRight,
  Sparkles,
  Award,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatCurrency } from '../utils/helpers';

const AMENITIES_OPTIONS = [
  { id: 'wifi', name: 'Free WiFi', icon: Wifi },
  { id: 'pool', name: 'Swimming Pool', icon: Wind },
  { id: 'gym', name: 'Fitness Center', icon: SlidersHorizontal },
  { id: 'spa', name: 'Luxury Spa', icon: Star },
  { id: 'breakfast', name: 'Breakfast Included', icon: Coffee },
];

const HotelListPage = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters State
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: 0,
    maxPrice: 2000,
    amenities: [],
    rating: 0,
    startDate: searchParams.get('checkin') ? new Date(searchParams.get('checkin')) : null,
    endDate: searchParams.get('checkout') ? new Date(searchParams.get('checkout')) : null
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const loadHotels = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        location: filters.location,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rating: filters.rating > 0 ? filters.rating : undefined,
        amenities: filters.amenities.length > 0 ? filters.amenities.join(',') : undefined
      };

      const { data } = await fetchHotels(params);
      setHotels(data);
      setError('');
    } catch (err) {
      setError('Directory retrieval failed.');
    } finally {
      setLoading(false);
    }
  }, [filters.location, filters.minPrice, filters.maxPrice, filters.rating, filters.amenities]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHotels();
    }, 400);
    return () => clearTimeout(timer);
  }, [loadHotels]);

  const handleAmenityToggle = (id) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id) 
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      minPrice: 0,
      maxPrice: 2000,
      amenities: [],
      rating: 0,
      startDate: null,
      endDate: null
    });
  };

  return (
    <div className="bg-background-light min-h-screen pb-24 pt-6 px-4 md:px-0">
      <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
        
        {/* Header Terminal */}
        <div className="bg-white p-10 md:p-14 rounded-[3.5rem] border border-gray-100 shadow-premium relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full -mr-40 -mt-40 blur-3xl" />
           
           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 relative z-10">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary font-black text-[10px] uppercase tracking-[3px]">
                    <Sparkles size={14} className="animate-pulse" /> Global Collection Index
                 </div>
                 <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-secondary-dark font-black tracking-tight leading-none">
                    Discover <span className="text-primary italic">Luxury</span>
                 </h1>
                 <p className="text-gray-400 font-medium text-lg max-w-xl">
                    Audited properties across the most prestigious global coordinates. Refined for your perspective.
                 </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                 <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden h-14 px-8 bg-white border-2 border-gray-100 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-[3px] text-secondary-dark hover:border-primary transition-all shadow-sm"
                 >
                    <SlidersHorizontal size={18} /> Modify Scope
                 </button>
                 <div className="hidden lg:flex items-center gap-6 px-8 py-4 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Results</span>
                       <span className="text-xl font-black text-secondary-dark">{hotels.length} <span className="text-primary font-serif italic text-lg opacity-80">PROPERTIES</span></span>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="flex items-center gap-2">
                       <Shield size={18} className="text-emerald-500" />
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">VERIFIED ARCHIVES</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 relative items-start">
          
          {/* Sidebar Filters - Desktop (Col 4) */}
          <aside className="hidden lg:block w-96 space-y-10 sticky top-10">
             
             {/* Filter Section: Global Logic */}
             <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-premium space-y-12">
                <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                   <h3 className="text-xl font-serif font-black text-secondary-dark">Scope Logic</h3>
                   <button onClick={clearFilters} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Reset All</button>
                </div>

                {/* Criteria: Location */}
                <div className="space-y-4 group">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] ml-1 flex items-center gap-2 group-focus-within:text-primary transition-colors">
                      <MapPin size={12} /> Target Coordinate
                   </label>
                   <input 
                     type="text" 
                     placeholder="Enter city or district..."
                     value={filters.location}
                     onChange={(e) => setFilters({...filters, location: e.target.value})}
                     className="input-premium h-14 px-6 text-sm"
                   />
                </div>

                {/* Criteria: Investment Cap */}
                <div className="space-y-6">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px]">Investment Cap</label>
                      <span className="text-sm font-black text-primary italic font-serif tracking-tight">{formatCurrency(filters.maxPrice)}</span>
                   </div>
                   <div className="px-2">
                      <input 
                        type="range" min="0" max="5000" step="50"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                        className="w-full accent-primary h-2 bg-gray-100 rounded-full appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between mt-4 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                         <span>$0 BASE</span>
                         <span>$5K ELITE</span>
                      </div>
                   </div>
                </div>

                {/* Criteria: Provisions */}
                <div className="space-y-6">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] ml-1">Elite Provisions</label>
                   <div className="grid grid-cols-1 gap-2">
                      {AMENITIES_OPTIONS.map(amenity => (
                        <button 
                          key={amenity.id}
                          onClick={() => handleAmenityToggle(amenity.id)}
                          className={`h-12 px-6 rounded-2xl flex items-center justify-between group transition-all duration-300 border ${
                            filters.amenities.includes(amenity.id) 
                            ? 'bg-secondary-dark border-secondary-dark text-white shadow-lg shadow-secondary/20' 
                            : 'bg-white border-gray-100 text-gray-400 hover:border-primary hover:text-primary'
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              <amenity.icon size={16} className={filters.amenities.includes(amenity.id) ? 'text-primary' : 'text-gray-300 group-hover:text-primary'} />
                              <span className="text-[10px] font-black uppercase tracking-widest">{amenity.name}</span>
                           </div>
                           {filters.amenities.includes(amenity.id) && <CheckCircle2 size={16} className="text-primary" />}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Criteria: Sentiment Index */}
                <div className="space-y-6">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] ml-1">Sentiment Index</label>
                   <div className="flex gap-2">
                      {[3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setFilters({...filters, rating: filters.rating === star ? 0 : star})}
                          className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-1 transition-all border ${
                            filters.rating === star 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-white border-gray-100 text-gray-400 hover:border-primary hover:text-primary'
                          }`}
                        >
                           <span className="text-xs font-black">{star}+</span>
                           <Star size={12} fill={filters.rating === star ? 'white' : 'transparent'} />
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             {/* Support Card */}
             <div className="bg-secondary-dark p-10 rounded-[3rem] text-white space-y-8 shadow-premium-dark relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                <div className="relative z-10 space-y-4 text-center">
                   <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-primary mx-auto border border-white/5">
                      <Clock size={24} />
                   </div>
                   <h4 className="text-lg font-serif font-black tracking-tight">Need Assistance?</h4>
                   <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-relaxed">Our global concierges are on standby for your custom itinerary.</p>
                   <button className="w-full h-12 bg-white/5 border border-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-secondary-dark transition-all">Support Terminal</button>
                </div>
             </div>
          </aside>

          {/* Hotel Grid - (Col 8) */}
          <main className="flex-1 space-y-10">
            
            {/* Sorting & Stats Summary */}
            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-50 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                     {loading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
                  </div>
                  <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Search Manifest</p>
                     <h3 className="text-lg font-bold text-secondary-dark flex items-center gap-2">
                        {hotels.length} <span className="text-primary italic font-serif">Properties Matching</span>
                        {filters.location && <span className="text-gray-300 font-normal">in {filters.location}</span>}
                     </h3>
                  </div>
               </div>
               
               <div className="flex items-center gap-6">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest lg:mb-0 mb-2">Sequence Logic</span>
                  <div className="relative h-12 px-6 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-3 group cursor-pointer hover:border-primary transition-all">
                     <ArrowUpDown size={14} className="text-primary" />
                     <select className="bg-transparent border-none appearance-none font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer text-secondary-dark pr-6">
                        <option>Curated Recommend</option>
                        <option>Inversion: High to Low</option>
                        <option>Ascension: Low to High</option>
                        <option>Sentiment Tier</option>
                     </select>
                     <ChevronRight size={14} className="absolute right-4 rotate-90 text-gray-300" />
                  </div>
               </div>
            </div>

            {/* Main Result Area */}
            {loading && hotels.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white h-[500px] rounded-[3.5rem] animate-pulse border border-gray-100 flex flex-col p-6 space-y-6">
                     <div className="flex-1 bg-gray-50 rounded-[2.5rem]" />
                     <div className="h-6 w-3/4 bg-gray-50 rounded-full mx-6" />
                     <div className="h-4 w-1/2 bg-gray-50 rounded-full mx-6 pb-6" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-24 text-center bg-white rounded-[4rem] border-2 border-dashed border-rose-100 space-y-8">
                 <div className="w-20 h-20 bg-rose-50 rounded-[2.5rem] flex items-center justify-center text-rose-500 mx-auto shadow-sm">
                    <X size={40} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-serif text-secondary-dark font-black tracking-tight">{error}</h3>
                    <p className="text-gray-400 font-medium">Unable to synchronize with the global property database. Please retry the audit.</p>
                 </div>
                 <button onClick={loadHotels} className="btn-gold px-10">Retry Sync</button>
              </div>
            ) : hotels.length === 0 ? (
              <div className="py-24 text-center bg-white rounded-[4rem] border border-gray-100 space-y-10 shadow-sm">
                 <div className="relative w-32 h-32 mx-auto">
                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                    <div className="relative flex items-center justify-center w-full h-full bg-gray-50 rounded-full border border-gray-100">
                       <Search size={48} className="text-gray-200" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-4xl font-serif text-secondary-dark font-black tracking-tight">Scope Not Found</h3>
                    <p className="text-gray-400 font-medium max-w-sm mx-auto leading-relaxed italic">
                       The specified coordinates do not echo with any current heritage properties. Adjust your logic or view the full ledger.
                    </p>
                 </div>
                 <button onClick={clearFilters} className="btn-gold px-12 h-16 inline-flex items-center gap-3 shadow-xl">
                    Full Portfolio Access <ArrowRight size={20} />
                 </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 animate-slide-up">
                {hotels.map(hotel => (
                  <HotelCard key={hotel._id} hotel={hotel} />
                ))}
              </div>
            )}
            
            {loading && hotels.length > 0 && (
              <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-secondary-dark px-8 h-14 rounded-2xl flex items-center gap-4 text-white font-black text-[10px] uppercase tracking-[3px] shadow-2xl shadow-secondary/40 animate-slide-up z-[100] border border-white/10 backdrop-blur-md">
                 <Loader2 size={16} className="animate-spin text-primary" />
                 Synchronizing Ledger...
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-white animate-fade-in lg:hidden">
           {/* Modal Header */}
           <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-secondary-dark text-white">
              <div className="space-y-1">
                 <h2 className="text-2xl font-serif font-black tracking-tight flex items-center gap-3">
                    <Filter size={24} className="text-primary" /> Audit Scope
                 </h2>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Criteria Terminal</p>
              </div>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/10 active:scale-95 transition-all"
              >
                 <X size={24} />
              </button>
           </div>

           {/* Modal Content - Scrollable */}
           <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32">
              <div className="space-y-6">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[4px] ml-1 flex items-center gap-2">
                    <MapPin size={12} className="text-primary" /> Coordinate Point
                 </label>
                 <input 
                   type="text" 
                   placeholder="TARGET CITY..."
                   value={filters.location}
                   onChange={(e) => setFilters({...filters, location: e.target.value})}
                   className="input-premium h-16 px-8 text-md font-bold text-secondary-dark uppercase tracking-widest"
                 />
              </div>

              <div className="space-y-8">
                 <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Rate Covenants</label>
                    <span className="text-lg font-black text-primary italic font-serif tracking-tight">{formatCurrency(filters.maxPrice)}</span>
                 </div>
                 <div className="px-2">
                    <input 
                      type="range" min="0" max="5000" step="50"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full accent-primary h-2 bg-gray-100 rounded-full appearance-none cursor-pointer"
                    />
                 </div>
              </div>

              <div className="space-y-6">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[4px] ml-1">Elite Requirements</label>
                 <div className="grid grid-cols-1 gap-3">
                    {AMENITIES_OPTIONS.map(amenity => (
                      <button 
                        key={amenity.id}
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`h-16 px-8 rounded-2xl flex items-center justify-between transition-all border-2 ${
                          filters.amenities.includes(amenity.id) 
                          ? 'bg-secondary-dark border-secondary-dark text-white' 
                          : 'bg-white border-gray-100 text-gray-400'
                        }`}
                      >
                         <div className="flex items-center gap-4">
                            <amenity.icon size={20} className={filters.amenities.includes(amenity.id) ? 'text-primary' : 'text-gray-300'} />
                            <span className="text-xs font-black uppercase tracking-widest">{amenity.name}</span>
                         </div>
                         {filters.amenities.includes(amenity.id) && <CheckCircle2 size={20} className="text-primary flex-shrink-0" />}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-6 pb-10">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[4px] ml-1">Audit Score Level</label>
                 <div className="flex gap-4">
                    {[3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setFilters({...filters, rating: filters.rating === star ? 0 : star})}
                        className={`flex-1 h-16 rounded-2xl flex items-center justify-center gap-2 transition-all border-2 ${
                          filters.rating === star 
                          ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                          : 'bg-white border-gray-100 text-gray-400'
                        }`}
                      >
                         <span className="text-sm font-black italic font-serif">{star}+</span>
                         <Star size={16} fill={filters.rating === star ? 'white' : 'transparent'} />
                      </button>
                    ))}
                 </div>
              </div>
           </div>

           {/* Modal Footer */}
           <div className="p-8 border-t border-gray-50 flex gap-4 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)] sticky bottom-0">
              <button 
                onClick={clearFilters}
                className="flex-1 h-16 bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-2xl"
              >
                 Reset
              </button>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="flex-[2] h-16 bg-secondary-dark text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-xl shadow-secondary/20 flex items-center justify-center gap-3"
              >
                 Apply Criteria <ArrowRight size={18} className="text-primary" />
              </button>
           </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .input-premium {
          background: #ffffff;
          border: 2px solid #f1f5f9;
          border-radius: 1.25rem;
          outline: none;
          transition: all 0.3s ease;
          font-weight: 700;
          color: #0f172a;
        }
        .input-premium:focus {
          border-color: #C5A059;
          box-shadow: 0 10px 25px -10px rgba(197, 160, 89, 0.2);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default HotelListPage;
