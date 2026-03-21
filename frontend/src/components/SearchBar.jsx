import React, { useState, useCallback } from 'react';
import { MapPin, Calendar, Users, ChevronDown, Search, Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchSuggestions } from '../services/api';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState({
    location: '',
    guests: 1
  });
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleLocationChange = async (e) => {
    const val = e.target.value;
    setQuery({ ...query, location: val });
    
    if (val.length >= 2) {
      setLoadingSuggestions(true);
      try {
        const { data } = await fetchSuggestions(val);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (text) => {
    setQuery({ ...query, location: text });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch({ ...query, startDate, endDate });
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      borderRadius: '24px',
      padding: '0.8rem 1rem 0.8rem 2rem',
      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 10
    }}>
      <form className="search-wrap-container" onSubmit={handleSubmit} style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: window.innerWidth < 900 ? 'wrap' : 'nowrap',
        gap: '1rem'
      }}>
        
        {/* Location Section */}
        <div className="search-item" style={{ flex: 1, display: 'flex', alignItems: 'center', position: 'relative', borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', padding: '10px', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={20} color="white" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.1rem' }}>Location</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                type="text" 
                placeholder="Bradford, U.K." 
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'white', width: '100%', padding: 0 }}
                value={query.location}
                onChange={handleLocationChange}
                onFocus={() => { if (query.location && suggestions.length > 0) setShowSuggestions(true); }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                autoComplete="off"
              />
              {loadingSuggestions ? <Loader2 size={14} color="white" className="animate-spin" /> : <ChevronDown size={14} color="white" style={{ opacity: 0.8 }} />}
            </div>
          </div>
          
          {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
            <div style={{
              position: 'absolute', top: '120%', left: 0, width: '100%', minWidth: '250px',
              background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
              borderRadius: '16px', padding: '0.5rem 0', zIndex: 1000,
              border: '1px solid #f1f5f9'
            }}>
              {loadingSuggestions ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
                   Searching...
                </div>
              ) : suggestions.map((text, idx) => (
                <div 
                  key={idx} onClick={() => handleSuggestionClick(text)}
                  style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151', fontSize: '0.95rem' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={16} color="#9ca3af" />
                  {text}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Check In */}
        <div className="search-item" style={{ flex: 1, display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: '1rem', paddingLeft: '0.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', padding: '10px', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} color="white" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.1rem' }}>Check In</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DatePicker
                selected={startDate}
                onChange={(date) => setDateRange([date, endDate])}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="20 January"
                customInput={<input style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'white', width: '100%', padding: 0 }} />}
              />
              <ChevronDown size={14} color="white" style={{ opacity: 0.8, marginLeft: '-15px' }} />
            </div>
          </div>
        </div>

        {/* Check Out */}
        <div className="search-item" style={{ flex: 1, display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.3)', paddingRight: '1rem', paddingLeft: '0.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', padding: '10px', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={20} color="white" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.1rem' }}>Check Out</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <DatePicker
                selected={endDate}
                onChange={(date) => setDateRange([startDate, date])}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                placeholderText="29 January"
                customInput={<input style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'white', width: '100%', padding: 0 }} />}
              />
              <ChevronDown size={14} color="white" style={{ opacity: 0.8, marginLeft: '-15px' }} />
            </div>
          </div>
        </div>

        {/* Guests */}
        <div className="search-item" style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: '50%', padding: '10px', marginRight: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Users size={20} color="white" />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'white', marginBottom: '0.1rem' }}>Guests</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <select 
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: 'white', width: '100%', padding: 0, appearance: 'none', cursor: 'pointer' }}
                value={query.guests}
                onChange={(e) => setQuery({...query, guests: e.target.value})}
              >
                <option value={1} style={{ color: 'black' }}>1 Adult</option>
                <option value={2} style={{ color: 'black' }}>2 Adults</option>
                <option value={3} style={{ color: 'black' }}>2 Adults, 1 Child</option>
                <option value={4} style={{ color: 'black' }}>2 Adults, 2 Children</option>
                <option value={5} style={{ color: 'black' }}>3 Adults</option>
              </select>
              <ChevronDown size={14} color="white" style={{ opacity: 0.8, position: 'absolute', right: 0, pointerEvents: 'none' }} />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button className="search-button" type="submit" style={{
          background: '#22d3ee', // Cyan
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '1rem 1.8rem',
          fontWeight: '500',
          fontSize: '0.95rem',
          cursor: 'pointer',
          transition: 'transform 0.2s',
          marginLeft: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Find Hotel <Search size={16} />
        </button>

      </form>
      
      <style>{`
        ::-webkit-input-placeholder { color: rgba(255,255,255,0.8); }
        ::-moz-placeholder { color: rgba(255,255,255,0.8); }
        :-ms-input-placeholder { color: rgba(255,255,255,0.8); }
        :-moz-placeholder { color: rgba(255,255,255,0.8); }
      `}</style>
    </div>
  );
};

export default SearchBar;
