import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  Sparkles,
  Zap,
  Filter
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
  
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    minPrice: 0,
    maxPrice: 50000,
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
      console.error('Failed to fetch hotels:', err);
      setError('Could not load luxury properties.');
    } finally {
      setLoading(false);
    }
  }, [filters.location, filters.minPrice, filters.maxPrice, filters.rating, filters.amenities]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHotels();
    }, 500);
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
      maxPrice: 50000,
      amenities: [],
      rating: 0,
      startDate: null,
      endDate: null
    });
  };

  return (
    <div className="bg-white min-h-screen pt-32 lg:pt-40 pb-24 px-6 lg:px-12 font-serif transition-colors duration-500">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-12 space-y-3">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">Luxury Escapes</h1>
          <p className="text-slate-500 font-sans font-medium text-lg">Indulge in unparalleled comfort across the world's most premium destinations.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-[320px] shrink-0 space-y-10">
            <div className="bg-slate-50/50 rounded-[2.5rem] p-10 border border-slate-100 shadow-sm font-sans">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Filters</h3>
                <button onClick={clearFilters} className="text-[10px] font-black uppercase tracking-widest text-luxury-gold hover:underline transition-all">Reset All</button>
              </div>

              <div className="space-y-8">
                {/* Location */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                    <input 
                      type="text" 
                      placeholder="Where are you going?"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/5 transition-all outline-none"
                    />
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Range</label>
                    <span className="text-[10px] font-black text-luxury-gold uppercase tracking-widest bg-luxury-gold/5 px-2 py-1 rounded-md">Max: {formatCurrency(filters.maxPrice)}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    step="500"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
                  />
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    <span>₹0</span>
                    <span>₹50,000+</span>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Dates</label>
                   <div className="space-y-3">
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-luxury-gold transition-colors" size={16} />
                        <DatePicker
                          selected={filters.startDate}
                          onChange={(date) => setFilters({...filters, startDate: date})}
                          placeholderText="Check-in Date"
                          className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/5 transition-all outline-none font-sans"
                          minDate={new Date()}
                        />
                      </div>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-luxury-gold transition-colors" size={16} />
                        <DatePicker
                          selected={filters.endDate}
                          onChange={(date) => setFilters({...filters, endDate: date})}
                          placeholderText="Check-out Date"
                          className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-slate-900 font-bold focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/5 transition-all outline-none font-sans"
                          minDate={filters.startDate || new Date()}
                        />
                      </div>
                   </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Amenities</label>
                  <div className="space-y-3 px-1">
                    {AMENITIES_OPTIONS.map(amenity => (
                      <label key={amenity.id} className="flex items-center gap-3 group cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={filters.amenities.includes(amenity.id)}
                          onChange={() => handleAmenityToggle(amenity.id)}
                          className="w-5 h-5 rounded border-slate-300 text-luxury-gold focus:ring-luxury-gold/20"
                        />
                        <span className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]">{amenity.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Hotel Grid */}
          <main className="flex-1">
            {/* Search Summary & Sort */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm mb-10 gap-4">
              <div className="flex items-center gap-3">
                {loading ? (
                   <Loader2 className="animate-spin text-luxury-gold" size={20} />
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-slate-900">{hotels.length}</span>
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest font-sans">hotels found</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 font-sans">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sort by:</label>
                <div className="relative group">
                   <select className="bg-transparent text-sm font-black text-luxury-gold outline-none cursor-pointer appearance-none pr-6">
                      <option>Recommended</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Review Score</option>
                   </select>
                   <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-luxury-gold pointer-events-none" size={14} />
                </div>
              </div>
            </div>

            {loading && hotels.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[450px] bg-slate-50/50 rounded-[2.5rem] animate-pulse"></div>
                ))}
              </div>
            ) : error ? (
              <div className="p-20 text-center bg-rose-50 rounded-[2.5rem] border border-rose-100 font-sans">
                <Zap size={48} className="text-rose-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">Something went wrong</h3>
                <p className="text-slate-500 font-medium mb-8">{error}</p>
                <button onClick={loadHotels} className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-luxury-gold transition-all uppercase tracking-widest text-[10px]">Try Again</button>
              </div>
            ) : hotels.length === 0 ? (
              <div className="p-20 text-center bg-slate-50/50 rounded-[2.5rem] border border-slate-100 border-dashed font-sans">
                <Search size={48} className="text-slate-300 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">No perfect matches</h3>
                <p className="text-slate-500 font-medium mb-8">Try broadening your search criteria.</p>
                <button onClick={clearFilters} className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-luxury-gold transition-all uppercase tracking-widest text-[10px]">Show All Properties</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                {hotels.map(hotel => (
                   <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #c5a059;
          cursor: pointer;
          box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1);
          transition: all 0.2s;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 0 0 6px rgba(197, 160, 89, 0.2);
        }
      `}</style>
    </div>
  );
};

export default HotelListPage;
