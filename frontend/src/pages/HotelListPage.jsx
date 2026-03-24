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
  Loader2
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
      console.error('Failed to fetch hotels:', err);
      setError('Could not load hotels. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [filters.location, filters.minPrice, filters.maxPrice, filters.rating, filters.amenities]);

  // Debounce API calls for location and price
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
      maxPrice: 2000,
      amenities: [],
      rating: 0,
      startDate: null,
      endDate: null
    });
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1400px' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <ChevronRight size={16} /> Explore
            </div>
            <h1 className="luxury-font" style={{ fontSize: '2.5rem', color: '#0f172a', margin: 0 }}>Discover Luxury Stays</h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Indulge in unparalleled comfort across the world's most premium destinations.</p>
          </div>
          
          <button 
            onClick={() => setShowMobileFilters(true)}
            style={{ 
              display: 'none', 
              background: 'white', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '10px', 
              border: '1px solid #e2e8f0',
              fontWeight: '600',
              gap: '0.5rem',
              alignItems: 'center'
            }}
            className="mobile-filter-btn"
          >
            <SlidersHorizontal size={18} /> Filters
          </button>
        </div>

        <div style={{ display: 'flex', gap: '2rem', position: 'relative' }}>
          
          {/* Sidebar Filters */}
          <aside className={`filter-sidebar ${showMobileFilters ? 'mobile-open' : ''}`} style={{
            width: '320px',
            flexShrink: 0,
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            height: 'fit-content',
            position: 'sticky',
            top: '100px',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: 0 }}>Filters</h3>
              <button onClick={clearFilters} style={{ background: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem' }}>Reset All</button>
              <button onClick={() => setShowMobileFilters(false)} className="mobile-close-btn" style={{ display: 'none' }}><X /></button>
            </div>

            {/* Location Search */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="Where are you going?"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '12px',
                    border: '1.5px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '0.95rem'
                  }}
                />
              </div>
            </div>

            {/* Price Range */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Range</label>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--primary)' }}>
                  Max: {formatCurrency(filters.maxPrice)}
                </span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="5000" 
                step="50"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                style={{ width: '100%', accentColor: 'var(--primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                <span>$0</span>
                <span>$5,000+</span>
              </div>
            </div>

            {/* Date Range */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dates</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <DatePicker
                  selected={filters.startDate}
                  onChange={(date) => setFilters({...filters, startDate: date})}
                  placeholderText="Check-in Date"
                  className="datepicker-input"
                  minDate={new Date()}
                />
                <DatePicker
                  selected={filters.endDate}
                  onChange={(date) => setFilters({...filters, endDate: date})}
                  placeholderText="Check-out Date"
                  className="datepicker-input"
                  minDate={filters.startDate || new Date()}
                />
              </div>
            </div>

            {/* Amenities */}
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amenities</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {AMENITIES_OPTIONS.map(amenity => (
                  <label key={amenity.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: '0.2s' }}>
                    <div 
                      onClick={() => handleAmenityToggle(amenity.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '6px',
                        border: '2px solid',
                        borderColor: filters.amenities.includes(amenity.id) ? 'var(--primary)' : '#cbd5e1',
                        background: filters.amenities.includes(amenity.id) ? 'var(--primary)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: '0.2s'
                      }}
                    >
                      {filters.amenities.includes(amenity.id) && <X size={14} color="white" />}
                    </div>
                    <span style={{ fontSize: '0.95rem', color: filters.amenities.includes(amenity.id) ? '#0f172a' : '#64748b', fontWeight: filters.amenities.includes(amenity.id) ? '600' : '400' }}>
                      {amenity.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: '#64748b', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Minimum Rating</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setFilters({...filters, rating: filters.rating === star ? 0 : star})}
                    style={{
                      flex: 1,
                      padding: '0.6rem',
                      borderRadius: '10px',
                      border: '1.5px solid',
                      borderColor: filters.rating === star ? 'var(--primary)' : '#e2e8f0',
                      background: filters.rating === star ? 'rgba(197, 160, 89, 0.1)' : 'white',
                      color: filters.rating === star ? 'var(--primary)' : '#64748b',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    {star}+ <Star size={14} fill={filters.rating === star ? 'var(--primary)' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Hotel Grid */}
          <main style={{ flexGrow: 1 }}>
            
            {/* Search Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', background: 'white', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontWeight: '600', color: '#0f172a' }}>
                {loading ? 'Searching...' : `${hotels.length} hotels found`}
                {filters.location && <span style={{ color: '#94a3b8', fontWeight: '400' }}> in {filters.location}</span>}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Sort by:</span>
                <select style={{ border: 'none', background: 'none', fontWeight: '600', color: 'var(--primary)', outline: 'none', cursor: 'pointer' }}>
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            {loading && hotels.length === 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: '420px', borderRadius: '16px', background: 'white' }}></div>
                ))}
              </div>
            ) : error ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <X size={48} color="var(--error)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{error}</h3>
                <button onClick={loadHotels} className="btn-primary" style={{ marginTop: '1rem' }}>Try Again</button>
              </div>
            ) : hotels.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ 
                  width: '80px', height: '80px', background: '#f1f5f9', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' 
                }}>
                  <Search size={32} color="#94a3b8" />
                </div>
                <h3 className="luxury-font" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>No Hotels Found</h3>
                <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 2rem' }}>
                  We couldn't find any properties matching your current filters. Try adjusting your search or resetting filters.
                </p>
                <button onClick={clearFilters} className="btn-primary">View All Hotels</button>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '2rem' 
              }}>
                {hotels.map(hotel => (
                  <HotelCard key={hotel._id} hotel={hotel} />
                ))}
              </div>
            )}
            
            {loading && hotels.length > 0 && (
              <div style={{ 
                position: 'fixed', bottom: '3rem', left: '50%', transform: 'translateX(-50%)',
                background: 'white', padding: '0.75rem 1.5rem', borderRadius: '30px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem',
                zIndex: 100
              }}>
                <Loader2 size={18} className="animate-spin" style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Updating results...</span>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .datepicker-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          outline: none;
          font-size: 0.95rem;
          cursor: pointer;
        }
        .datepicker-input:focus {
          border-color: var(--primary);
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 1024px) {
          .filter-sidebar {
            display: none;
          }
          .filter-sidebar.mobile-open {
            display: block;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100%; height: 100%;
            border-radius: 0;
            overflow-y: auto;
            margin: 0;
          }
          .mobile-filter-btn { display: flex !important; }
          .mobile-close-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default HotelListPage;
