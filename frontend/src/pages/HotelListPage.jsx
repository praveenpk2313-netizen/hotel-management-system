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
  Filter,
  ArrowUpDown,
  CheckCircle2
} from 'lucide-react';
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
  
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: 0,
    maxPrice: 5000,
    amenities: [],
    rating: 0
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
      setError('Failed to fetch property archive.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHotels();
    }, 300);
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

  return (
    <div className="bg-slate-50 min-h-screen pb-24 pt-32 lg:pt-40">
      <div className="container-booking space-y-10 animate-fade-in">
        
        {/* Search Results Summary Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-200">
           <div>
               <nav className="text-[11px] font-bold text-slate-500 flex items-center gap-2 mb-2 uppercase tracking-wide">
                  <Link to="/" className="text-cyan-600 hover:text-cyan-700 transition-colors">Home</Link>
                  <ChevronRight size={10} />
                  <span>All properties</span>
                  {filters.location && (
                    <>
                       <ChevronRight size={10} />
                       <span className="text-slate-900">{filters.location}</span>
                    </>
                  )}
               </nav>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                 {filters.location ? `${filters.location}: ` : ""}
                 {hotels.length} properties found
              </h1>
           </div>
           
           <div className="flex items-center gap-4">
               <button 
                 onClick={() => setShowMobileFilters(true)}
                 className="lg:hidden h-11 px-6 bg-white border border-slate-200 text-slate-700 rounded-full flex items-center gap-2 text-xs font-bold shadow-sm"
               >
                   <Filter size={16} /> Filters
               </button>
               <div className="relative h-11 px-6 bg-white border border-slate-200 rounded-full flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer hover:border-cyan-500 transition-all shadow-sm">
                  <ArrowUpDown size={14} className="text-cyan-600" />
                  <select className="bg-transparent border-none appearance-none outline-none pr-4 cursor-pointer text-slate-700">
                    <option>Our top picks</option>
                    <option>Price (lowest first)</option>
                    <option>Star rating (highest first)</option>
                    <option>Best reviewed</option>
                 </select>
              </div>
           </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative items-start">
          
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 space-y-6 sticky top-24">
             <div className="card-premium border-slate-200 rounded-xl overflow-hidden shadow-soft">
                <div className="bg-slate-50 p-5 border-b border-slate-200">
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Filter by:</h3>
                </div>
                
                <div className="p-6 space-y-10 bg-white">
                   {/* Location Filter */}
                   <div className="space-y-3">
                      <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Your destination</label>
                       <div className="relative">
                          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-600" />
                          <input 
                            type="text" 
                            placeholder="Where next?"
                            value={filters.location}
                            onChange={(e) => setFilters({...filters, location: e.target.value})}
                            className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all shadow-inner"
                          />
                       </div>
                   </div>

                   {/* Price Filter */}
                   <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Budget per night</label>
                          <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded-md">{formatCurrency(filters.maxPrice)}</span>
                       </div>
                       <input 
                         type="range" min="0" max="5000" step="100"
                         value={filters.maxPrice}
                         onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                         className="w-full accent-cyan-600 h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer"
                       />
                   </div>

                   {/* Amenities Filter */}
                   <div className="space-y-4">
                      <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Popular filters</label>
                      <div className="space-y-3">
                         {AMENITIES_OPTIONS.map(amenity => (
                           <label key={amenity.id} className="flex items-center gap-3 cursor-pointer group">
                               <input 
                                 type="checkbox"
                                 checked={filters.amenities.includes(amenity.id)}
                                 onChange={() => handleAmenityToggle(amenity.id)}
                                 className="w-5 h-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600"
                               />
                               <span className="text-sm font-medium text-slate-700 group-hover:text-cyan-600 transition-colors">{amenity.name}</span>
                           </label>
                         ))}
                      </div>
                   </div>

                   {/* Rating Filter */}
                   <div className="space-y-4 pt-6 border-t border-slate-100">
                      <label className="text-xs font-black text-slate-900 uppercase tracking-wide">Review score</label>
                      <div className="flex flex-col gap-3">
                         {[4, 3, 2].map(score => (
                             <button
                               key={score}
                               onClick={() => setFilters({...filters, rating: score})}
                               className={`flex items-center gap-3 text-sm transition-all ${filters.rating === score ? 'text-cyan-600 font-bold' : 'text-slate-600 font-medium hover:text-cyan-600'}`}
                             >
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${filters.rating === score ? 'bg-cyan-600 text-white shadow-sm' : 'border border-slate-300 bg-slate-50'}`}>
                                   {filters.rating === score && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                               <span>{score}+ Superb</span>
                           </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </aside>

          {/* Hotel Grid */}
          <main className="flex-1 space-y-6">
            {loading && hotels.length === 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white h-[380px] rounded-2xl animate-pulse border border-slate-100 shadow-sm" />
                  ))}
               </div>
            ) : error ? (
               <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-rose-500 font-bold">{error}</p>
                  <button onClick={loadHotels} className="btn-primary-booking mx-auto">Retry</button>
               </div>
            ) : hotels.length === 0 ? (
               <div className="py-32 text-center space-y-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mx-auto text-slate-400">
                     <Search size={32} />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-xl font-bold text-slate-900">No properties match your filters</h3>
                     <p className="text-sm text-slate-500">Try removing some criteria to see more results</p>
                  </div>
                   <button 
                     onClick={() => setFilters({location: '', minPrice: 0, maxPrice: 5000, amenities: [], rating: 0})}
                     className="text-cyan-600 font-bold hover:text-cyan-700 transition-colors text-sm px-6 py-2 bg-cyan-50 rounded-lg mt-4 inline-block"
                   >
                      Clear all filters
                   </button>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 animate-slide-up relative z-10">
                {hotels.map(hotel => (
                  <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
            
            {loading && hotels.length > 0 && (
             <div className="flex items-center justify-center py-10">
                <Loader2 size={32} className="animate-spin text-cyan-600" />
             </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default HotelListPage;
