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
    <div className="bg-white min-h-screen pb-24 pt-32 lg:pt-40">
      <div className="container-booking space-y-10 animate-fade-in">
        
        {/* Search Results Summary Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-gray-100">
           <div>
              <nav className="text-[11px] font-medium text-gray-500 flex items-center gap-2 mb-2">
                 <Link to="/" className="text-[#006ce4] hover:underline">Home</Link>
                 <ChevronRight size={10} />
                 <span>All properties</span>
                 {filters.location && (
                   <>
                      <ChevronRight size={10} />
                      <span className="text-gray-900 font-bold">{filters.location}</span>
                   </>
                 )}
              </nav>
              <h1 className="text-2xl font-black text-gray-900">
                 {filters.location ? `${filters.location}: ` : ""}
                 {hotels.length} properties found
              </h1>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden h-11 px-4 bg-white border border-[#006ce4] text-[#006ce4] rounded-full flex items-center gap-2 text-xs font-bold"
              >
                  <Filter size={16} /> Filters
              </button>
              <div className="relative h-11 px-4 bg-white border border-gray-300 rounded-full flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer hover:border-[#006ce4] transition-all">
                 <ArrowUpDown size={14} className="text-[#006ce4]" />
                 <select className="bg-transparent border-none appearance-none outline-none pr-4 cursor-pointer">
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
             <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b border-gray-200">
                   <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Filter by:</h3>
                </div>
                
                <div className="p-5 space-y-10 bg-white">
                   {/* Location Filter */}
                   <div className="space-y-3">
                      <label className="text-xs font-black text-gray-900 uppercase">Your destination</label>
                      <div className="relative">
                         <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                         <input 
                           type="text" 
                           placeholder="Where next?"
                           value={filters.location}
                           onChange={(e) => setFilters({...filters, location: e.target.value})}
                           className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:border-[#006ce4] outline-none transition-all"
                         />
                      </div>
                   </div>

                   {/* Price Filter */}
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                         <label className="text-xs font-black text-gray-900 uppercase">Budget per night</label>
                         <span className="text-xs font-bold text-[#006ce4]">{formatCurrency(filters.maxPrice)}</span>
                      </div>
                      <input 
                        type="range" min="0" max="5000" step="100"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                        className="w-full accent-[#006ce4] h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer"
                      />
                   </div>

                   {/* Amenities Filter */}
                   <div className="space-y-4">
                      <label className="text-xs font-black text-gray-900 uppercase">Popular filters</label>
                      <div className="space-y-3">
                         {AMENITIES_OPTIONS.map(amenity => (
                           <label key={amenity.id} className="flex items-center gap-3 cursor-pointer group">
                              <input 
                                type="checkbox"
                                checked={filters.amenities.includes(amenity.id)}
                                onChange={() => handleAmenityToggle(amenity.id)}
                                className="w-5 h-5 rounded border-gray-300 text-[#006ce4] focus:ring-[#006ce4]"
                              />
                              <span className="text-sm text-gray-700 group-hover:text-[#006ce4] transition-colors">{amenity.name}</span>
                           </label>
                         ))}
                      </div>
                   </div>

                   {/* Rating Filter */}
                   <div className="space-y-4 pt-4 border-t border-gray-100">
                      <label className="text-xs font-black text-gray-900 uppercase">Review score</label>
                      <div className="flex flex-col gap-2">
                         {[4, 3, 2].map(score => (
                           <button
                             key={score}
                             onClick={() => setFilters({...filters, rating: score})}
                             className={`flex items-center gap-3 text-sm transition-all ${filters.rating === score ? 'text-[#006ce4] font-bold' : 'text-gray-600'}`}
                           >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center ${filters.rating === score ? 'bg-[#006ce4] border-[#006ce4] text-white' : 'border-gray-300'}`}>
                                 {filters.rating === score && <CheckCircle2 size={12} />}
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
                    <div key={i} className="bg-gray-50 h-80 rounded-lg animate-pulse border border-gray-100" />
                  ))}
               </div>
            ) : error ? (
               <div className="py-20 text-center space-y-4">
                  <p className="text-rose-500 font-bold">{error}</p>
                  <button onClick={loadHotels} className="btn-primary-booking mx-auto">Retry</button>
               </div>
            ) : hotels.length === 0 ? (
               <div className="py-32 text-center space-y-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mx-auto text-gray-300">
                     <Search size={32} />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-xl font-bold text-gray-900">No properties match your filters</h3>
                     <p className="text-sm text-gray-500">Try removing some criteria to see more results</p>
                  </div>
                  <button 
                    onClick={() => setFilters({location: '', minPrice: 0, maxPrice: 5000, amenities: [], rating: 0})}
                    className="text-[#006ce4] font-bold underline text-sm"
                  >
                     Clear all filters
                  </button>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
                {hotels.map(hotel => (
                  <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
            
            {loading && hotels.length > 0 && (
               <div className="flex items-center justify-center py-10">
                  <Loader2 size={24} className="animate-spin text-[#006ce4]" />
               </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal placeholder/implementation can be added here if needed, keeping it simple for now */}
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default HotelListPage;
