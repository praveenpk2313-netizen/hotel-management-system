import React, { useState } from 'react';
import { MapPin, Calendar, Users, ChevronDown, Search, Loader2, X } from 'lucide-react';
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
      background: '#ffffff',
      borderRadius: '100px',
      padding: '0.5rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
      width: '100%',
      maxWidth: '950px',
      margin: '0 auto',
      position: 'relative',
      zIndex: 100,
      border: '1px solid #e2e8f0'
    }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        flexWrap: 'nowrap'
      }}>
        
        {/* 1. Location Section */}
        <div className="search-section" style={{ 
          flex: 1.5,
          padding: '0.75rem 2rem',
          borderRadius: '100px',
          cursor: 'pointer',
          position: 'relative',
          transition: '0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.background = '#f7f7f7'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
            <input 
              type="text" 
              placeholder="Where are you going?" 
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: '#475569', width: '100%', fontWeight: '500' }}
              value={query.location}
              onChange={handleLocationChange}
              onFocus={() => { if (query.location && suggestions.length > 0) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
              autoComplete="off"
            />
            {loadingSuggestions && <Loader2 size={14} className="animate-spin" color="#c5a059" />}
          </div>
          
          {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
            <div style={{
              position: 'absolute', top: '110%', left: '0', width: '100%', minWidth: '320px',
              background: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              borderRadius: '24px', padding: '1rem 0', zIndex: 1000,
              border: '1px solid #f1f5f9'
            }}>
              {suggestions.map((text, idx) => (
                <div key={idx} onClick={() => handleSuggestionClick(text)}
                  style={{ padding: '0.8rem 1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', color: '#1e293b', fontSize: '0.95rem', fontWeight: '500' }}
                  onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <MapPin size={18} color="#94a3b8" />
                  {text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }}></div>

        {/* 2. Check In */}
        <div className="search-section" style={{ 
          flex: 1,
          padding: '0.75rem 1.5rem',
          borderRadius: '100px',
          cursor: 'pointer',
          transition: '0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.background = '#f7f7f7'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Check In</label>
          <div style={{ marginTop: '0.2rem' }}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setDateRange([date, endDate])}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Add date"
              customInput={<input style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: '#475569', width: '100%', fontWeight: '500', cursor: 'pointer' }} />}
            />
          </div>
        </div>

        <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }}></div>

        {/* 3. Check Out */}
        <div className="search-section" style={{ 
          flex: 1,
          padding: '0.75rem 1.5rem',
          borderRadius: '100px',
          cursor: 'pointer',
          transition: '0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.background = '#f7f7f7'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Check Out</label>
          <div style={{ marginTop: '0.2rem' }}>
            <DatePicker
              selected={endDate}
              onChange={(date) => setDateRange([startDate, date])}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Add date"
              customInput={<input style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: '#475569', width: '100%', fontWeight: '500', cursor: 'pointer' }} />}
            />
          </div>
        </div>

        <div style={{ width: '1px', height: '32px', background: '#e2e8f0' }}></div>

        {/* 4. Guests Section */}
        <div className="search-section" style={{ 
          flex: 1,
          padding: '0.75rem 1.5rem',
          borderRadius: '100px',
          cursor: 'pointer',
          transition: '0.2s',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}
        onMouseOver={e => e.currentTarget.style.background = '#f7f7f7'}
        onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Guests</label>
          <select 
            style={{ 
              border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', color: '#475569', 
              width: '100%', marginTop: '0.2rem', appearance: 'none', cursor: 'pointer', fontWeight: '500'
            }}
            value={query.guests}
            onChange={(e) => setQuery({...query, guests: e.target.value})}
          >
            <option value={1}>1 Guest</option>
            <option value={2}>2 Guests</option>
            <option value={3}>3 Guests</option>
            <option value={4}>4 Guests</option>
            <option value={5}>5+ Guests</option>
          </select>
        </div>

        {/* Search Button */}
        <button type="submit" style={{
          background: '#c5a059',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '56px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          marginLeft: '0.5rem',
          boxShadow: '0 8px 20px rgba(197, 160, 89, 0.3)',
          flexShrink: 0
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.background = '#1e293b';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = '#c5a059';
        }}
        >
          <Search size={24} strokeWidth={3} />
        </button>

      </form>

      <style>{`
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__input-container input::placeholder { color: #94a3b8; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 900px) {
          form { flex-direction: column !important; border-radius: 32px !important; padding: 1rem !important; }
          .search-section { width: 100% !important; border-right: none !important; border-bottom: 1px solid #f1f5f9 !important; padding: 1rem !important; border-radius: 16px !important; }
          div[style*="width: 1px"] { display: none !important; }
          button[type="submit"] { width: 100% !important; border-radius: 16px !important; height: 50px !important; margin-top: 1rem !important; }
          div[style*="borderRadius: 100px"] { border-radius: 32px !important; padding: 1rem !important; }
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
