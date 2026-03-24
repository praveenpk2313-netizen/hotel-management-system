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
            <span className="dp-dash">-</span>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Check-out"
              className="mini-dp"
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
            <span className="val-text truncate">{guests} Adults, {rooms} Room</span>
            <ChevronDown size={14} className={`chevron-ani ${showGuests ? 'rotated' : ''}`} />
          </div>
          
          {showGuests && (
            <div className="dropdown-panel guest-panel animate-fade-in shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="selector-item">
                <div className="item-info">
                  <span className="item-name">Adults</span>
                  <span className="item-sub">Aged 18 and above</span>
                </div>
                <div className="ctrls">
                  <button onClick={() => setGuests(Math.max(1, guests - 1))} className="ctrl-btn"><Minus size={12} /></button>
                  <span className="ctrl-val">{guests}</span>
                  <button onClick={() => setGuests(guests + 1)} className="ctrl-btn"><Plus size={12} /></button>
                </div>
              </div>
              <div className="selector-item">
                <div className="item-info">
                  <span className="item-name">Rooms</span>
                  <span className="item-sub">Select total units</span>
                </div>
                <div className="ctrls">
                  <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="ctrl-btn"><Minus size={12} /></button>
                  <span className="ctrl-val">{rooms}</span>
                  <button onClick={() => setRooms(rooms + 1)} className="ctrl-btn"><Plus size={12} /></button>
                </div>
              </div>
              <button onClick={() => setShowGuests(false)} className="confirm-btn">
                 Confirm Selection <Check size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="search-btn-wrap">
          <button onClick={handleSearch} className="search-action-btn group">
            <Search size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
            <span>Search</span>
          </button>
        </div>
      </div>

      <style>{`
        .search-outer { width: 100%; position: relative; }
        .search-grid {
          background: white;
          border-radius: 100px;
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border: 1px solid #f1f5f9;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          position: relative;
        }

        .search-box {
          flex: 1;
          padding: 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
          min-width: 0;
        }
        .search-box.destination { flex: 1.5; }
        .search-box.guests-trigger { cursor: pointer; }
        .search-box.guests-trigger:hover { background: #f8fafc; border-radius: 20px; }

        .search-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
        }

        .search-input {
          width: 100%;
          border: none !important;
          outline: none !important;
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          background: transparent;
          padding: 0;
        }
        .search-input::placeholder { color: #cbd5e1; font-weight: 600; }

        .date-input-pair { display: flex; align-items: center; gap: 4px; }
        .mini-dp {
          width: 75px;
          background: transparent;
          border: none;
          outline: none;
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          cursor: pointer;
        }
        .dp-dash { color: #cbd5e1; font-weight: 300; }

        .trigger-val { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .val-text { font-size: 1rem; font-weight: 800; color: #0f172a; }
        .chevron-ani { color: #cbd5e1; transition: 0.3s; }
        .chevron-ani.rotated { transform: rotate(180deg); color: #c5a059; }

        .v-divider { width: 1px; height: 35px; background: #f1f5f9; mx-4; }

        .search-action-btn {
          height: 60px;
          background: #0f172a;
          color: white;
          padding: 0 35px;
          border-radius: 100px;
          font-size: 1rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
        }
        .search-action-btn:hover { background: #c5a059; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(197, 160, 89, 0.3); }

        /* Dropdowns */
        .dropdown-panel {
          position: absolute;
          top: calc(100% + 15px);
          background: white;
          border-radius: 24px;
          padding: 16px;
          z-index: 1000;
          min-width: 320px;
          border: 1px solid #f1f5f9;
        }
        .location-dropdown { left: 0; }
        .guest-panel { right: 0; min-width: 300px; border-top: 3px solid #c5a059; }

        .dropdown-title { font-size: 0.65rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; margin-bottom: 12px; padding-left: 12px; }
        .dropdown-choice {
          width: 100%;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 16px;
          transition: 0.2s;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        .dropdown-choice:hover { background: #f8fafc; }

        .selector-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 12px;
          border-bottom: 1px solid #f8fafc;
        }
        .selector-item:last-of-type { border-bottom: none; }
        .item-name { display: block; font-weight: 800; color: #0f172a; }
        .item-sub { display: block; font-size: 0.7rem; color: #94a3b8; font-weight: 700; margin-top: 2px; }

        .ctrls { display: flex; align-items: center; gap: 15px; }
        .ctrl-btn {
          width: 32px;
          height: 32px;
          border: 2px solid #f1f5f9;
          background: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: 0.2s;
          cursor: pointer;
        }
        .ctrl-btn:hover { border-color: #c5a059; color: #c5a059; }
        .ctrl-val { font-weight: 900; color: #0f172a; min-width: 20px; text-align: center; }

        .confirm-btn {
          width: 100%;
          margin-top: 15px;
          height: 50px;
          background: #f8fafc;
          border-radius: 12px;
          color: #c5a059;
          font-weight: 900;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          cursor: pointer;
          transition: 0.2s;
        }
        .confirm-btn:hover { background: #0f172a; color: white; }

        @media (max-width: 1024px) {
          .search-grid { flex-direction: column; border-radius: 32px; padding: 12px; }
          .v-divider { display: none; }
          .search-box { width: 100%; border-bottom: 1px solid #f1f5f9; }
          .search-box:last-of-type { border-bottom: none; }
          .search-btn-wrap { width: 100%; padding-top: 12px; }
          .search-action-btn { width: 100%; justify-content: center; }
          .dropdown-panel { position: static; min-width: 100%; box-shadow: none; border: none; padding: 12px 0; }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
