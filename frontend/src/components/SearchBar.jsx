import React, { useState } from 'react';
import { MapPin, Calendar, Users, Search, Loader2 } from 'lucide-react';
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
    <div className="relative z-[100] w-full max-w-5xl mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white rounded-[2rem] lg:rounded-full p-2 shadow-2xl shadow-black/10 border border-gray-100 flex flex-col lg:flex-row items-center gap-2 lg:gap-0"
      >
        
        {/* 1. Location Selection */}
        <div className="flex-[1.5] w-full relative px-6 py-4 lg:py-3 hover:bg-gray-50 rounded-[1.5rem] lg:rounded-full transition-colors cursor-pointer group">
          <label className="block text-[10px] font-black text-secondary-dark uppercase tracking-[2px] mb-1">Location</label>
          <div className="flex items-center gap-3">
             <MapPin size={16} className="text-primary" />
             <input 
               type="text" 
               placeholder="Where are you going?" 
               className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 placeholder:text-gray-400 w-full"
               value={query.location}
               onChange={handleLocationChange}
               onFocus={() => { if (query.location && suggestions.length > 0) setShowSuggestions(true); }}
               onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
               autoComplete="off"
             />
             {loadingSuggestions && <Loader2 size={14} className="animate-spin text-primary" />}
          </div>
          
          {/* Autocomplete Dropdown */}
          {showSuggestions && (suggestions.length > 0) && (
            <div className="absolute top-[110%] left-0 w-full bg-white rounded-3xl shadow-premium border border-gray-100 py-3 overflow-hidden animate-slide-up z-[50]">
              {suggestions.map((text, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSuggestionClick(text)}
                  className="px-6 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 text-sm font-bold text-secondary-dark"
                >
                  <MapPin size={16} className="text-gray-300" />
                  {text}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-100 mx-2" />

        {/* 2. Check In Selection */}
        <div className="flex-1 w-full px-6 py-4 lg:py-3 hover:bg-gray-50 rounded-[1.5rem] lg:rounded-full transition-colors cursor-pointer group">
          <label className="block text-[10px] font-black text-secondary-dark uppercase tracking-[2px] mb-1">Check In</label>
          <div className="flex items-center gap-3">
             <Calendar size={16} className="text-primary" />
             <DatePicker
               selected={startDate}
               onChange={(date) => setDateRange([date, endDate])}
               selectsStart
               startDate={startDate}
               endDate={endDate}
               minDate={new Date()}
               placeholderText="Add date"
               className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full cursor-pointer placeholder:text-gray-400"
             />
          </div>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-100 mx-2" />

        {/* 3. Check Out Selection */}
        <div className="flex-1 w-full px-6 py-4 lg:py-3 hover:bg-gray-50 rounded-[1.5rem] lg:rounded-full transition-colors cursor-pointer group">
          <label className="block text-[10px] font-black text-secondary-dark uppercase tracking-[2px] mb-1">Check Out</label>
          <div className="flex items-center gap-3">
             <Calendar size={16} className="text-primary" />
             <DatePicker
               selected={endDate}
               onChange={(date) => setDateRange([startDate, date])}
               selectsEnd
               startDate={startDate}
               endDate={endDate}
               minDate={startDate || new Date()}
               placeholderText="Add date"
               className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full cursor-pointer placeholder:text-gray-400"
             />
          </div>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-100 mx-2" />

        {/* 4. Guests Selection */}
        <div className="flex-1 w-full px-6 py-4 lg:py-3 hover:bg-gray-50 rounded-[1.5rem] lg:rounded-full transition-colors cursor-pointer">
          <label className="block text-[10px] font-black text-secondary-dark uppercase tracking-[2px] mb-1">Guests</label>
          <div className="flex items-center gap-3">
             <Users size={16} className="text-primary" />
             <select 
               className="bg-transparent border-none outline-none text-sm font-bold text-gray-700 w-full cursor-pointer appearance-none"
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
        </div>

        {/* Action Button */}
        <button 
          type="submit" 
          className="w-full lg:w-16 h-14 lg:h-16 bg-primary text-white rounded-2xl lg:rounded-full flex items-center justify-center shadow-xl shadow-primary/30 hover:bg-secondary-dark transition-all active:scale-95 flex-shrink-0"
        >
          <Search size={24} strokeWidth={3} className="hidden lg:block" />
          <span className="lg:hidden font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
             Check Availability <Search size={16} />
          </span>
        </button>

      </form>

      <style>{`
        .react-datepicker-wrapper { width: 100%; position: relative; }
        .react-datepicker-popper { z-index: 500 !important; }
        /* Premium Datepicker styling */
        .react-datepicker {
          font-family: 'Outfit', sans-serif !important;
          border-radius: 20px !important;
          border: 1px solid #f1f5f9 !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
          overflow: hidden !important;
        }
        .react-datepicker__header {
          background-color: #f8fafc !important;
          border-bottom: 1px solid #f1f5f9 !important;
          padding-top: 1rem !important;
        }
        .react-datepicker__day--selected {
          background-color: #c5a059 !important;
          border-radius: 10px !important;
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
