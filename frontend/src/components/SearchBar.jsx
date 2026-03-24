import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Minus, 
  Bed,
  ChevronDown,
  Sparkles,
  Search,
  Navigation,
  Globe
} from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showGuests, setShowGuests] = useState(false);

  const suggestionsRef = useRef(null);
  const guestsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target)) {
        setShowGuests(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = (e) => {
    const value = e.target.value;
    setLocation(value);
    if (value.length >= 2) {
      const allSuggestions = ['New Delhi', 'Mumbai', 'Bangalore', 'Tokyo', 'London', 'Dubai', 'Paris', 'New York', 'Singapore'];
      setSuggestions(allSuggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    onSearch({ location, startDate, endDate, guests, rooms });
  };

  return (
    <div className="premium-search-wrapper">
      <div className="premium-search-container animate-slide-up">
        
        {/* 1. Destination Segment */}
        <div className="search-segment destination" ref={suggestionsRef}>
           <div className="segment-label">
             <MapPin size={14} className="label-icon" />
             <span>Location</span>
           </div>
           <input 
             type="text" 
             placeholder="Where are you going?" 
             value={location}
             onChange={handleLocationChange}
             onFocus={() => location.length >= 2 && setShowSuggestions(true)}
             className="segment-input"
           />
           {showSuggestions && suggestions.length > 0 && (
             <div className="search-dropdown location-dropdown animate-dropdown">
                <div className="dropdown-header">Top Destinations</div>
                {suggestions.map((text, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => { setLocation(text); setShowSuggestions(false); }}
                    className="dropdown-item"
                  >
                    <Navigation size={16} className="item-icon" />
                    <div className="item-text">
                       <span className="item-title">{text}</span>
                       <span className="item-subtitle">Luxury Stay</span>
                    </div>
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* 2. Stay Period Segment */}
        <div className="segment-divider"></div>
        <div className="search-segment stay-period">
           <div className="segment-label">
             <Calendar size={14} className="label-icon" />
             <span>Stay Period</span>
           </div>
           <div className="dual-date-wrapper">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Check-in"
                className="date-mini-input"
                dateFormat="MMM d"
              />
              <span className="date-dash">—</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                placeholderText="Check-out"
                className="date-mini-input"
                dateFormat="MMM d"
              />
           </div>
        </div>

        {/* 3. Guests Segment */}
        <div className="segment-divider"></div>
        <div className="search-segment guests-trigger" ref={guestsRef} onClick={() => setShowGuests(!showGuests)}>
           <div className="segment-label">
             <Users size={14} className="label-icon" />
             <span>Guests</span>
           </div>
           <div className="trigger-display">
              <span className="display-text">{guests} Adults, {rooms} Room</span>
              <ChevronDown size={14} className={`chevron-spin ${showGuests ? 'is-open' : ''}`} />
           </div>
           
           {showGuests && (
             <div className="search-dropdown guest-dropdown animate-dropdown" onClick={e => e.stopPropagation()}>
                <div className="guest-selector-row">
                   <div className="guest-info">
                      <span className="guest-title">Adults</span>
                      <span className="guest-meta">Aged 18+</span>
                   </div>
                   <div className="counter-controls">
                      <button onClick={() => setGuests(Math.max(1, guests - 1))} className="mini-counter-btn"><Minus size={12} /></button>
                      <span className="mini-counter-val">{guests}</span>
                      <button onClick={() => setGuests(guests + 1)} className="mini-counter-btn"><Plus size={12} /></button>
                   </div>
                </div>
                <div className="guest-selector-row">
                   <div className="guest-info">
                      <span className="guest-title">Rooms</span>
                      <span className="guest-meta">Premium Suites</span>
                   </div>
                   <div className="counter-controls">
                      <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="mini-counter-btn"><Minus size={12} /></button>
                      <span className="mini-counter-val">{rooms}</span>
                      <button onClick={() => setRooms(rooms + 1)} className="mini-counter-btn"><Plus size={12} /></button>
                   </div>
                </div>
                <button onClick={() => setShowGuests(false)} className="dropdown-action-btn">Confirm Selection</button>
             </div>
           )}
        </div>

        {/* 4. Action Segment */}
        <div className="search-action">
           <button 
             onClick={handleSearch}
             className="premium-search-btn"
           >
              <Search size={20} />
              <span>Explore Stays</span>
           </button>
        </div>
      </div>

      <style>{searchBarStyles}</style>
    </div>
  );
};

const searchBarStyles = `
  .premium-search-wrapper {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    font-family: 'Outfit', 'Inter', sans-serif;
  }

  /* ── Search Container ─────────────────────────────────────────────────── */
  .premium-search-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 100px;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    box-shadow: 0 15px 40px -10px rgba(0, 0, 0, 0.1);
    position: relative;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .premium-search-container:hover {
    box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    border-color: #0284c7;
  }

  /* ── Segments ─────────────────────────────────────────────────────────── */
  .search-segment {
    flex: 1;
    padding: 12px 24px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    position: relative;
    cursor: text;
  }
  .search-segment.guests-trigger { cursor: pointer; }
  .search-segment.destination { flex: 1.5; }

  .segment-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
  }
  .label-icon { color: #0284c7; opacity: 0.8; }

  .segment-input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    padding: 0;
    line-height: normal;
  }
  .segment-input::placeholder { color: #94a3b8; font-weight: 500; }

  .dual-date-wrapper {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .date-mini-input {
    width: 70px;
    background: transparent;
    border: none;
    outline: none;
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    cursor: pointer;
  }
  .date-dash { color: #e2e8f0; font-weight: 400; }

  .trigger-display {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .display-text {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chevron-spin {
    transition: transform 0.3s ease;
    color: #94a3b8;
  }
  .chevron-spin.is-open { transform: rotate(180deg); color: #0284c7; }

  .segment-divider {
    width: 1px;
    height: 32px;
    background: #e2e8f0;
    opacity: 0.6;
  }

  /* ── Action Button ────────────────────────────────────────────────────── */
  .premium-search-btn {
    background: #0284c7;
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    color: white;
    border: none;
    height: 60px;
    padding: 0 32px;
    border-radius: 100px;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s;
    box-shadow: 0 8px 20px -5px rgba(2, 132, 199, 0.4);
  }
  .premium-search-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 12px 25px -5px rgba(2, 132, 199, 0.5);
  }
  .premium-search-btn:active { transform: scale(0.98); }

  /* ── Dropdowns ────────────────────────────────────────────────────────── */
  .search-dropdown {
    position: absolute;
    top: calc(100% + 12px);
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    z-index: 1000;
    padding: 16px;
  }
  .location-dropdown { left: 0; width: 340px; }
  .guest-dropdown { right: 0; width: 300px; }

  .dropdown-header {
    font-size: 0.65rem;
    font-weight: 900;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 12px;
    padding-left: 12px;
  }

  .dropdown-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px;
    border-radius: 16px;
    cursor: pointer;
    background: none;
    border: none;
    text-align: left;
    transition: all 0.2s;
  }
  .dropdown-item:hover { background: #f0f9ff; }
  .item-icon { color: #0284c7; }
  .item-title { display: block; font-weight: 800; color: #0f172a; font-size: 0.95rem; }
  .item-subtitle { display: block; font-size: 0.75rem; color: #94a3b8; font-weight: 500; }

  .guest-selector-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #f1f5f9;
  }
  .guest-selector-row:last-of-type { border-bottom: none; }
  .guest-title { display: block; font-weight: 800; color: #0f172a; font-size: 0.95rem; }
  .guest-meta { display: block; font-size: 0.72rem; color: #94a3b8; font-weight: 500; }

  .counter-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .mini-counter-btn {
    width: 32px;
    height: 32px;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: white;
    transition: all 0.2s;
  }
  .mini-counter-btn:hover { border-color: #0284c7; color: #0284c7; }
  .mini-counter-val { font-weight: 900; font-size: 1rem; color: #0f172a; min-width: 15px; text-align: center; }

  .dropdown-action-btn {
    width: 100%;
    margin-top: 16px;
    background: #f0f9ff;
    color: #0284c7;
    border: none;
    padding: 14px;
    border-radius: 16px;
    font-weight: 800;
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .dropdown-action-btn:hover { background: #e0f2fe; }

  /* ── Animations ───────────────────────────────────────────────────── */
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-slide-up { animation: slideUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1) backwards; }
  
  @keyframes dropdown { from { opacity: 0; transform: translateY(-10px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .animate-dropdown { animation: dropdown 0.3s cubic-bezier(0.165, 0.84, 0.44, 1); }

  /* ── Responsive ───────────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .premium-search-container {
      flex-direction: column;
      border-radius: 32px;
      padding: 12px;
    }
    .segment-divider { display: none; }
    .search-segment { width: 100%; padding: 16px; border-bottom: 1px solid #f1f5f9; }
    .search-segment:last-of-type { border-bottom: none; }
    .search-action { width: 100%; padding-top: 12px; }
    .premium-search-btn { width: 100%; justify-content: center; }
    .location-dropdown, .guest-dropdown { width: 100%; position: static; box-shadow: none; border: 1px solid #f1f5f9; margin-top: 8px; }
  }
`;

export default SearchBar;
