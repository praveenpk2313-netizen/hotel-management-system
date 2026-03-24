import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Plus, 
  Minus, 
  ChevronDown,
  Search,
  Navigation,
  Check
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

  const handleSearch = (e) => {
    e?.stopPropagation();
    onSearch({ location, startDate, endDate, guests, rooms });
  };

  return (
    <div className="search-outer animate-slide-up">
      <div className="search-grid">
        
        {/* Destination */}
        <div className="search-box destination" ref={suggestionsRef}>
          <div className="search-label">
            <MapPin size={14} className="text-[#c5a059]" />
            <span>Destination</span>
          </div>
          <input 
            type="text" 
            placeholder="Where are you going?" 
            value={location}
            onChange={handleLocationChange}
            onFocus={() => location.length >= 2 && setShowSuggestions(true)}
            className="search-input"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="dropdown-panel location-dropdown animate-fade-in shadow-2xl">
              <div className="dropdown-title">Recommended Locations</div>
              {suggestions.map((text, idx) => (
                <button 
                  key={idx} 
                  onClick={() => { setLocation(text); setShowSuggestions(false); }}
                  className="dropdown-choice"
                >
                  <Navigation size={16} className="text-[#c5a059]" />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900">{text}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Global City</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="v-divider" />

        {/* Date Picker */}
        <div className="search-box date-box">
          <div className="search-label">
            <Calendar size={14} className="text-[#c5a059]" />
            <span>Stay Period</span>
          </div>
          <div className="date-input-pair">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check-in"
              className="mini-dp"
              dateFormat="MMM d"
              minDate={new Date()}
            />
            <span className="dp-dash">—</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Check-out"
              className="mini-dp text-right"
              dateFormat="MMM d"
            />
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="v-divider" />

        {/* Guests Selector */}
        <div className="search-box guests-trigger" ref={guestsRef} onClick={() => setShowGuests(!showGuests)}>
          <div className="search-label">
            <Users size={14} className="text-[#c5a059]" />
            <span>Guests & Rooms</span>
          </div>
          <div className="trigger-val">
            <span className="val-text whitespace-nowrap">{guests} Adults, {rooms} Room</span>
            <ChevronDown size={14} className={`chevron-ani ml-auto ${showGuests ? 'rotated' : ''}`} />
          </div>
          
          {showGuests && (
            <div className="dropdown-panel guest-panel animate-dropdown shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="dropdown-indicator" />
              <div className="selector-item">
                <div className="item-info">
                  <span className="item-name">Adults Selection</span>
                  <span className="item-sub italic">Aged 18 and above</span>
                </div>
                <div className="ctrls">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="ctrl-btn"><Minus size={14} /></button>
                  <span className="ctrl-val">{guests}</span>
                  <button onClick={() => setGuests(guests + 1)} className="ctrl-btn-plus"><Plus size={14} /></button>
                </div>
              </div>
              <div className="selector-item">
                <div className="item-info">
                  <span className="item-name">Rooms Selection</span>
                  <span className="item-sub italic">Total reservation units</span>
                </div>
                <div className="ctrls">
                  <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="ctrl-btn"><Minus size={14} /></button>
                  <span className="ctrl-val">{rooms}</span>
                  <button onClick={() => setRooms(rooms + 1)} className="ctrl-btn-plus"><Plus size={14} /></button>
                </div>
              </div>
              <div className="dropdown-footer">
                <button onClick={() => setShowGuests(false)} className="apply-btn">
                   Confirm Selection <Check size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="search-btn-wrap">
          <button onClick={handleSearch} className="search-action-btn group">
            <Search size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Search Portfolio</span>
          </button>
        </div>
      </div>

      <style>{`
        .search-outer { width: 100%; position: relative; max-width: 1250px; margin: 0 auto; }
        .search-grid {
          background: white;
          border-radius: 100px;
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 40px 100px -20px rgba(15, 23, 42, 0.2);
          position: relative;
        }

        .search-box {
          flex: 1;
          padding: 16px 32px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          min-width: 180px;
          transition: all 0.3s;
        }
        .search-box.destination { flex: 1.5; min-width: 280px; }
        .search-box.date-box { flex: 1.2; min-width: 240px; }
        .search-box.guests-trigger { cursor: pointer; min-width: 220px; }
        .search-box:hover { background: #f8fafc; border-radius: 40px; }

        .search-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #64748b;
        }

        .search-input {
          width: 100%;
          border: none !important;
          outline: none !important;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          background: transparent;
          padding: 0;
          letter-spacing: -0.03em;
        }
        .search-input::placeholder { color: #cbd5e1; font-weight: 600; opacity: 0.5; }

        .date-input-pair { display: flex; align-items: center; gap: 12px; }
        .mini-dp {
          width: 105px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          cursor: pointer;
          letter-spacing: -0.03em;
        }
        .mini-dp::placeholder { color: #cbd5e1; }
        .dp-dash { color: #e2e8f0; font-weight: 300; font-size: 1.5rem; }

        .trigger-val { display: flex; align-items: center; gap: 12px; }
        .val-text { font-size: 1.25rem; font-weight: 800; color: #0f172a; letter-spacing: -0.03em; }
        .chevron-ani { color: #cbd5e1; transition: 0.4s; }
        .chevron-ani.rotated { transform: rotate(180deg); color: #c5a059; }

        .v-divider { width: 1.5px; height: 50px; background: #f1f5f9; mx-4; }

        .search-action-btn {
          height: 72px;
          background: #0f172a;
          color: white;
          padding: 0 45px;
          border-radius: 100px;
          font-size: 1.15rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: none;
          cursor: pointer;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.3);
        }
        .search-action-btn:hover { 
          background: #c5a059; 
          transform: translateY(-4px) scale(1.02); 
          box-shadow: 0 25px 50px rgba(197, 160, 89, 0.5); 
        }

        /* Dropdowns */
        @keyframes dropdownScale { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .animate-dropdown { animation: dropdownScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

        .dropdown-panel {
          position: absolute;
          top: calc(100% + 20px);
          background: white;
          border-radius: 32px;
          padding: 32px;
          z-index: 1000;
          min-width: 400px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 50px 100px -20px rgba(0,0,0,0.25);
          border-top: 8px solid #c5a059;
          right: 0;
        }
        .location-dropdown { left: 0; min-width: 380px; }
        .guest-panel { right: 0; }

        .dropdown-indicator {
          position: absolute;
          top: -12px;
          right: 40px;
          width: 0; height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-bottom: 12px solid #c5a059;
        }

        .dropdown-title { font-size: 0.8rem; font-weight: 950; color: #94a3b8; text-transform: uppercase; margin-bottom: 24px; padding-left: 16px; letter-spacing: 0.15em; }
        .dropdown-choice {
          width: 100%;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 20px;
          border-radius: 24px;
          transition: 0.3s;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        .dropdown-choice:hover { background: #f0f9ff; }

        .selector-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 16px;
          border-bottom: 1px solid #f8fafc;
        }
        .selector-item:last-of-type { border-bottom: none; }
        .item-name { display: block; font-weight: 900; color: #0f172a; font-size: 1.1rem; letter-spacing: -0.02em; }
        .item-sub { display: block; font-size: 0.8rem; color: #94a3b8; font-weight: 600; margin-top: 6px; }

        .ctrls { display: flex; align-items: center; gap: 24px; }
        .ctrl-btn, .ctrl-btn-plus {
          width: 44px;
          height: 44px;
          border: 2px solid #f1f5f9;
          background: white;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: 0.3s;
          cursor: pointer;
        }
        .ctrl-btn:hover { border-color: #ef4444; color: #ef4444; }
        .ctrl-btn-plus:hover { border-color: #c5a059; color: #c5a059; transform: rotate(90deg); }
        .ctrl-val { font-weight: 950; color: #0f172a; min-width: 30px; text-align: center; font-size: 1.25rem; }

        .dropdown-footer { margin-top: 24px; padding-top: 24px; border-top: 2px solid #f8fafc; }
        .apply-btn {
          width: 100%;
          height: 64px;
          background: #0f172a;
          border-radius: 20px;
          color: white;
          font-weight: 900;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: none;
          cursor: pointer;
          transition: 0.4s;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
        }
        .apply-btn:hover { background: #c5a059; transform: translateY(-3px); box-shadow: 0 15px 30px rgba(197, 160, 89, 0.3); }

        @media (max-width: 1024px) {
          .search-grid { flex-direction: column; border-radius: 48px; padding: 20px; }
          .v-divider { display: none; }
          .search-box { width: 100%; border-bottom: 1px solid #f1f5f9; min-width: 0 !important; padding: 24px !important; }
          .search-box:last-of-type { border-bottom: none; }
          .search-btn-wrap { width: 100%; padding-top: 20px; }
          .search-action-btn { width: 100%; justify-content: center; height: 80px; }
          .dropdown-panel { position: static; min-width: 100%; box-shadow: none; border: none; padding: 24px 0; border-top: 4px solid #c5a059; }
          .dropdown-indicator { display: none; }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
