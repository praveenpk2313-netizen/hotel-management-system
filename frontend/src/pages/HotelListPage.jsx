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
      setError('Could not load luxury properties. Please try again.');
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
    <div className="premium-list-container">
      <div className="container" style={{ maxWidth: '1440px' }}>
        
        {/* Header Section */}
        <div className="premium-list-header">
          <div className="header-meta">
            <div className="header-badge animate-slide-up">
              <Sparkles size={14} className="text-amber-500" />
              <span>Curated Selection</span>
            </div>
            <h1 className="header-title animate-slide-up" style={{ animationDelay: '0.1s' }}>Find Your Perfect Escape</h1>
            <p className="header-subtitle animate-slide-up" style={{ animationDelay: '0.2s' }}>Discover unique accommodations hand-picked for their exceptional quality and service.</p>
          </div>
          
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="mobile-filter-trigger"
          >
            <Filter size={18} /> Filters
          </button>
        </div>

        <div className="premium-layout-grid">
          
          {/* Sidebar Filters */}
          <aside className={`premium-sidebar ${showMobileFilters ? 'is-mobile-open' : ''}`}>
            <div className="sidebar-header">
              <div className="sidebar-title-group">
                <SlidersHorizontal size={20} className="text-sky-600" />
                <h3>Refine Search</h3>
              </div>
              <button onClick={clearFilters} className="reset-btn">Reset</button>
              <button onClick={() => setShowMobileFilters(false)} className="mobile-close-btn"><X /></button>
            </div>

            <div className="sidebar-content">
              {/* Location Input */}
              <div className="filter-group">
                <label className="filter-label">Destination</label>
                <div className="input-with-icon">
                  <MapPin size={18} className="input-icon" />
                  <input 
                    type="text" 
                    placeholder="Where are you going?"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="premium-input"
                  />
                </div>
              </div>

              {/* Price Slider */}
              <div className="filter-group">
                <div className="label-row">
                  <label className="filter-label">Price Range</label>
                  <span className="price-indicator">max {formatCurrency(filters.maxPrice)}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="50"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                  className="premium-range"
                />
                <div className="range-labels">
                  <span>$0</span>
                  <span>$5,000+</span>
                </div>
              </div>

              {/* Enhanced Dates */}
              <div className="filter-group">
                <label className="filter-label">Stay Period</label>
                <div className="date-selection-grid">
                   <div className="date-input-box">
                      <Calendar size={14} className="box-icon" />
                      <DatePicker
                        selected={filters.startDate}
                        onChange={(date) => setFilters({...filters, startDate: date})}
                        placeholderText="Check-in"
                        className="box-datepicker"
                        minDate={new Date()}
                      />
                   </div>
                   <div className="date-input-box">
                      <Calendar size={14} className="box-icon" />
                      <DatePicker
                        selected={filters.endDate}
                        onChange={(date) => setFilters({...filters, endDate: date})}
                        placeholderText="Check-out"
                        className="box-datepicker"
                        minDate={filters.startDate || new Date()}
                      />
                   </div>
                </div>
              </div>

              {/* Amenities - Visual Checkboxes */}
              <div className="filter-group">
                <label className="filter-label">Amenities</label>
                <div className="amenities-selection-grid">
                  {AMENITIES_OPTIONS.map(amenity => (
                    <label key={amenity.id} className={`amenity-pill ${filters.amenities.includes(amenity.id) ? 'is-selected' : ''}`}>
                      <input 
                        type="checkbox" 
                        checked={filters.amenities.includes(amenity.id)}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        style={{ display: 'none' }}
                      />
                      <amenity.icon size={16} />
                      <span>{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Group */}
              <div className="filter-group">
                <label className="filter-label">Guest Rating</label>
                <div className="rating-selection-grid">
                  {[3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setFilters({...filters, rating: filters.rating === star ? 0 : star})}
                      className={`rating-btn ${filters.rating === star ? 'is-active' : ''}`}
                    >
                      {star}+ <Star size={14} fill={filters.rating === star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Hotel Grid */}
          <main className="premium-main-content">
            
            {/* Search Summary & Sort */}
            <div className="results-toolbar">
              <div className="results-count">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-sky-600" />
                    <span>Updating properties...</span>
                  </div>
                ) : (
                  <>
                    <span className="count-number">{hotels.length}</span>
                    <span className="count-text">properties found</span>
                  </>
                )}
              </div>
              
              <div className="sort-controls">
                <label>Sort by:</label>
                <select className="premium-select">
                  <option>Top Recommendations</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Review Score</option>
                </select>
              </div>
            </div>

            {loading && hotels.length === 0 ? (
              <div className="loading-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card"></div>
                ))}
              </div>
            ) : error ? (
              <div className="empty-state-card error">
                <Zap size={48} className="text-rose-500 mb-4" />
                <h3>Oops! Something went wrong</h3>
                <p>{error}</p>
                <button onClick={loadHotels} className="premium-action-btn">Try Again</button>
              </div>
            ) : hotels.length === 0 ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">
                  <Search size={32} />
                </div>
                <h3>No exact matches found</h3>
                <p>Try broadening your filters or clearing them to see all available luxury stays.</p>
                <button onClick={clearFilters} className="premium-action-btn">Show All Properties</button>
              </div>
            ) : (
              <div className="hotels-display-grid">
                {hotels.map(hotel => (
                  <div key={hotel._id} className="animate-fade-in">
                    <HotelCard hotel={hotel} />
                  </div>
                ))}
              </div>
            )}
            
            {loading && hotels.length > 0 && (
              <div className="floating-update-toast animate-slide-up">
                <Loader2 size={18} className="animate-spin text-sky-500" />
                <span>Refreshing availability...</span>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        .premium-list-container {
          background: #fdfdfd;
          min-height: 100vh;
          padding: 120px 24px 60px;
          font-family: 'Outfit', sans-serif;
        }

        /* ── Header ───────────────────────────────────────────────────────── */
        .premium-list-header {
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
        }
        .header-meta {
          display: flex;
          flex-direction: column;
        }
        .header-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid #e2e8f0;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          margin-bottom: 16px;
          width: fit-content;
        }
        .header-title {
          font-size: 3.5rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.04em;
          line-height: 1.1;
        }
        .header-subtitle {
          font-size: 1.15rem;
          color: #64748b;
          margin-top: 12px;
          max-width: 600px;
          font-weight: 500;
        }

        /* ── Layout Grid ──────────────────────────────────────────────────── */
        .premium-layout-grid {
          display: flex;
          gap: 40px;
          align-items: flex-start;
        }

        /* ── Sidebar ──────────────────────────────────────────────────────── */
        .premium-sidebar {
          width: 340px;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(20px);
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          padding: 32px;
          position: sticky;
          top: 120px;
          box-shadow: 0 4px 25px rgba(0,0,0,0.03);
          transition: all 0.3s ease;
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }
        .sidebar-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sidebar-title-group h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .reset-btn {
          font-size: 0.85rem;
          font-weight: 700;
          color: #0284c7;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0.8;
        }
        .reset-btn:hover { opacity: 1; text-decoration: underline; }

        .filter-group {
          margin-bottom: 28px;
        }
        .filter-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #64748b;
          margin-bottom: 12px;
        }

        .input-with-icon {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #0284c7;
          opacity: 0.6;
        }
        .premium-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          outline: none;
          font-family: inherit;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .premium-input:focus {
          border-color: #0284c7;
          background: white;
          box-shadow: 0 0 0 4px rgba(2, 132, 199, 0.1);
        }

        .premium-range {
          width: 100%;
          accent-color: #0284c7;
          margin: 12px 0;
        }
        .label-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .price-indicator {
          font-size: 0.9rem;
          font-weight: 800;
          color: #0284c7;
        }
        .range-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .date-selection-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .date-input-box {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .box-icon { color: #0284c7; opacity: 0.6; }
        .box-datepicker {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0f172a;
          font-family: inherit;
        }

        .amenities-selection-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .amenity-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 100px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }
        .amenity-pill:hover { border-color: #0284c7; color: #0f172a; }
        .amenity-pill.is-selected {
          background: #f0f9ff;
          border-color: #0284c7;
          color: #0284c7;
        }

        .rating-selection-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .rating-btn {
          padding: 12px;
          background: white;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-weight: 800;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .rating-btn:hover { border-color: #0284c7; }
        .rating-btn.is-active {
          background: #0284c7;
          border-color: #0284c7;
          color: white;
        }

        /* ── Main Content ─────────────────────────────────────────────────── */
        .premium-main-content {
          flex: 1;
        }
        .results-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 16px 24px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          margin-bottom: 24px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .results-count {
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .count-number { font-weight: 900; color: #0f172a; font-size: 1.1rem; }
        .count-text { color: #64748b; font-size: 0.9rem; }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .sort-controls label { font-size: 0.85rem; font-weight: 700; color: #94a3b8; }
        .premium-select {
          border: none;
          background: none;
          color: #0284c7;
          font-weight: 800;
          font-size: 0.9rem;
          outline: none;
          cursor: pointer;
          font-family: inherit;
        }

        .hotels-display-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 32px;
        }

        /* ── State Cards ──────────────────────────────────────────────────── */
        .empty-state-card {
          text-align: center;
          padding: 80px 40px;
          background: white;
          border-radius: 32px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .empty-state-icon {
          width: 80px;
          height: 80px;
          background: #f8fafc;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #94a3b8;
        }
        .empty-state-card h3 { font-size: 1.75rem; font-weight: 900; margin-bottom: 12px; color: #0f172a; }
        .empty-state-card p { color: #64748b; max-width: 400px; margin: 0 auto 24px; line-height: 1.6; }
        
        .premium-action-btn {
          background: #0284c7;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
        }
        .premium-action-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(2, 132, 199, 0.25); }

        .floating-update-toast {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          padding: 12px 24px;
          border-radius: 100px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 100;
          font-weight: 800;
          font-size: 0.9rem;
          border: 1px solid #e2e8f0;
        }

        /* ── Animations ───────────────────────────────────────────────────── */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out backwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) backwards; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .skeleton-card {
          height: 480px;
          background: linear-gradient(90deg, #f1f5f9 25%, #f8fafc 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 24px;
        }
        @keyframes loading { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        /* ── Responsive ───────────────────────────────────────────────────── */
        @media (max-width: 1024px) {
          .premium-sidebar { display: none; }
          .premium-sidebar.is-mobile-open {
            display: block;
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            width: 100%; height: 100%;
            border-radius: 0;
            z-index: 200;
            background: white;
            overflow-y: auto;
          }
          .mobile-filter-trigger { display: flex; align-items: center; gap: 8px; background: white; border: 1.5px solid #e2e8f0; padding: 10px 20px; border-radius: 12px; font-weight: 700; color: #0f172a; cursor: pointer; }
          .mobile-close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
          .header-title { font-size: 2.5rem; }
        }
        @media (min-width: 1025px) {
          .mobile-filter-trigger, .mobile-close-btn { display: none; }
        }
      `}</style>
    </div>
  );
};

export default HotelListPage;
