import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react';
import { fetchSuggestions } from '../services/api';

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [showGuests, setShowGuests] = useState(false);
  const dropdownRef = React.useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = React.useRef(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('checkin', checkIn);
    if (checkOut) params.append('checkout', checkOut);
    
    navigate(`/hotels?${params.toString()}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGuests(false);
      }
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.trim().length > 2) {
      const timer = setTimeout(async () => {
        try {
          const res = await fetchSuggestions(location);
          setSuggestions(res.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error(error);
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [location]);

  const updateGuests = (type, operation) => {
    setGuests(prev => ({
      ...prev,
      [type]: operation === 'add' ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }));
  };

  return (
    <div className="w-full relative">
      <div className="flex flex-col lg:flex-row items-stretch lg:divide-x divide-slate-100">
        
        {/* Location Selector */}
        <div className="flex-[1.5] px-8 py-5 flex flex-col justify-center hover:bg-slate-50 transition-all group rounded-t-xl lg:rounded-none relative" ref={suggestionRef}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-focus-within:text-indigo-600 transition-colors block text-left">Location</label>
          <div className="flex items-center gap-3">
             <MapPin size={18} className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
             <input 
               type="text"
               placeholder="Where are you going?"
               value={location}
               onChange={(e) => {
                 setLocation(e.target.value);
                 if (e.target.value.length <= 2) setShowSuggestions(false);
               }}
               onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
               className="bg-transparent border-none outline-none text-slate-900 text-sm font-black w-full placeholder:text-slate-300 font-sans"
             />
          </div>
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-slate-100 py-5 z-[2000] animate-fade-in animate-slide-up max-h-72 overflow-y-auto">
               {suggestions.map((suggestion, idx) => (
                 <div 
                   key={idx}
                   className="px-8 py-4 hover:bg-slate-50 cursor-pointer flex items-center gap-4 transition-colors"
                   onClick={() => {
                     setLocation(suggestion.city || suggestion.name);
                     setShowSuggestions(false);
                   }}
                 >
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                       <MapPin size={16} className="text-indigo-600" />
                    </div>
                    <div className="truncate text-left">
                      <p className="text-sm font-black text-slate-900 font-sans truncate">{suggestion.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 font-sans uppercase tracking-widest truncate">{suggestion.city || 'Location'}</p>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Check-in Selector */}
        <div className="flex-1 px-8 py-5 flex flex-col justify-center hover:bg-slate-50 transition-all group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors block text-left">Check-in</label>
          <div className="flex items-center gap-3">
             <Calendar size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
             <input 
               type="date"
               value={checkIn}
               onChange={(e) => setCheckIn(e.target.value)}
               className="bg-transparent border-none outline-none text-slate-900 text-sm font-black w-full cursor-pointer font-sans"
             />
          </div>
        </div>

        {/* Check-out Selector */}
        <div className="flex-1 px-8 py-5 flex flex-col justify-center hover:bg-slate-50 transition-all group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors block text-left">Check-out</label>
          <div className="flex items-center gap-3">
             <Calendar size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
             <input 
               type="date"
               value={checkOut}
               onChange={(e) => setCheckOut(e.target.value)}
               className="bg-transparent border-none outline-none text-slate-900 text-sm font-black w-full cursor-pointer font-sans"
             />
          </div>
        </div>

        {/* Guest Selector */}
        <div className="flex-1 px-8 py-5 flex flex-col justify-center hover:bg-slate-50 transition-all group relative" ref={dropdownRef}>
          <div className="cursor-pointer" onClick={() => setShowGuests(!showGuests)}>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-600 transition-colors block text-left">Guests</label>
             <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                   <Users size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                   <span className="text-slate-900 text-sm font-black truncate font-sans">
                     {guests.adults} Ad, {guests.children} Ch
                   </span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showGuests ? 'rotate-180' : ''}`} />
             </div>
          </div>

          {showGuests && (
            <div className="absolute top-[calc(100%+16px)] left-0 right-0 lg:left-auto lg:right-[0] lg:w-96 bg-white rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-slate-100 p-8 lg:p-10 z-[2000] animate-fade-in animate-slide-up">
               <div className="space-y-10">
                  <div className="flex items-center justify-between gap-12">
                     <div className="flex-grow">
                        <p className="text-sm font-black text-slate-900 font-sans tracking-tight">Adults</p>
                        <p className="text-[10px] text-slate-400 font-bold font-sans">Ages 13+</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <button type="button" onClick={() => updateGuests('adults', 'sub')} className="w-11 h-11 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-90 shadow-sm"><Minus size={14} /></button>
                        <span className="w-4 text-center text-base font-black text-slate-900 font-sans">{guests.adults}</span>
                        <button type="button" onClick={() => updateGuests('adults', 'add')} className="w-11 h-11 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-90 shadow-sm"><Plus size={14} /></button>
                     </div>
                  </div>
                  <div className="flex items-center justify-between gap-12">
                     <div className="flex-grow">
                        <p className="text-sm font-black text-slate-900 font-sans tracking-tight">Children</p>
                        <p className="text-[10px] text-slate-400 font-bold font-sans">Ages 2-12</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <button type="button" onClick={() => updateGuests('children', 'sub')} className="w-11 h-11 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-90 shadow-sm"><Minus size={14} /></button>
                        <span className="w-4 text-center text-base font-black text-slate-900 font-sans">{guests.children}</span>
                        <button type="button" onClick={() => updateGuests('children', 'add')} className="w-11 h-11 rounded-full border border-slate-100 flex items-center justify-center hover:bg-slate-50 hover:text-indigo-600 transition-all active:scale-90 shadow-sm"><Plus size={14} /></button>
                     </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setShowGuests(false)}
                    className="w-full h-16 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-600/10 active:scale-[0.98]"
                  >
                    Set Occupancy
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button 
          type="button" 
          onClick={handleSearch}
          className="lg:w-1/4 bg-slate-950 hover:bg-indigo-600 text-white flex items-center justify-center transition-all active:scale-[0.98] group rounded-b-xl lg:rounded-none py-8 lg:py-0 lg:rounded-r-xl border-none cursor-pointer relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] group-hover:tracking-[0.5em] transition-all relative z-10">Search Availability</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
