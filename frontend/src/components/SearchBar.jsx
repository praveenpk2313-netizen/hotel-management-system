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
  ChevronDown
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
      const allSuggestions = ['New Delhi', 'Mumbai', 'Bangalore', 'Tokyo', 'London', 'Dubai'];
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
    <div className="w-full">
      <div className="bg-white rounded-[20px] shadow-sm flex flex-col lg:flex-row items-stretch lg:h-20 overflow-visible border border-slate-200">
        
        {/* 1. Destination Segment */}
        <div className="flex-1 flex items-center border-b lg:border-b-0 lg:border-r border-slate-200 px-6 gap-4 relative" ref={suggestionsRef}>
           <MapPin className="text-slate-400" size={24} />
           <input 
             type="text" 
             placeholder="Where are you going?" 
             value={location}
             onChange={handleLocationChange}
             onFocus={() => location.length >= 2 && setShowSuggestions(true)}
             className="w-full bg-transparent border-none outline-none text-sm font-bold text-secondary placeholder:text-gray-500 tracking-tight"
           />
           {showSuggestions && suggestions.length > 0 && (
             <div className="absolute top-[110%] left-0 w-full lg:w-[400px] bg-white rounded-xl shadow-hover border border-slate-100 py-3 z-[1000] animate-fade-in">
                {suggestions.map((text, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => { setLocation(text); setShowSuggestions(false); }}
                    className="w-full px-6 py-4 text-left flex items-center gap-4 hover:bg-slate-50 font-bold text-slate-700 transition-colors"
                  >
                    <MapPin size={18} className="text-cyan-600" /> {text}
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* 2. Dates Segment */}
        <div className="flex-[1.5] border-b lg:border-b-0 lg:border-r border-slate-200 flex items-center px-6 gap-4 py-3 lg:py-0">
           <Calendar className="text-slate-400" size={24} />
           <div className="flex items-center gap-2 flex-1 font-bold text-sm text-slate-800">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Check-in date"
                className="w-full bg-transparent border-none outline-none cursor-pointer placeholder:text-gray-500 font-bold"
                dateFormat="MMM d, yyyy"
              />
              <span className="text-gray-300">—</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Check-out date"
                className="w-full bg-transparent border-none outline-none cursor-pointer placeholder:text-gray-500 font-bold"
                dateFormat="MMM d, yyyy"
              />
           </div>
        </div>

        {/* 3. Guests Segment */}
        <div className="relative flex-1 flex items-center px-6 gap-4 cursor-pointer py-4 lg:py-0 hover:bg-slate-50 transition-colors rounded-tr-[20px] rounded-br-[20px]" ref={guestsRef} onClick={() => setShowGuests(!showGuests)}>
           <Users className="text-slate-400" size={24} />
           <p className="text-sm font-bold text-slate-800 flex-1">
              <span className="hidden xl:inline">{guests} adults · {rooms} room</span>
              <span className="xl:hidden">{guests} A · {rooms} R</span>
           </p>
           <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 ${showGuests ? 'rotate-180' : ''}`} />
           {showGuests && (
             <div className="absolute top-[110%] right-0 w-full lg:w-[320px] bg-white rounded-2xl shadow-hover border border-slate-100 p-6 z-[1001] animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="font-bold text-secondary">Adults</p>
                         <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Aged 18+</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                         <span className="w-4 text-center font-black text-secondary">{guests}</span>
                         <button onClick={() => setGuests(guests + 1)} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"><Plus size={14} /></button>
                      </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="font-bold text-secondary">Rooms</p>
                         <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total suites</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"><Minus size={14} /></button>
                         <span className="w-4 text-center font-black text-secondary">{rooms}</span>
                         <button onClick={() => setRooms(rooms + 1)} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"><Plus size={14} /></button>
                      </div>
                   </div>
                   <button onClick={() => setShowGuests(false)} className="w-full h-12 bg-cyan-50 text-cyan-600 font-bold rounded-xl text-sm hover:bg-cyan-100 transition-colors">Apply Selection</button>
                </div>
             </div>
           )}
        </div>

        {/* 4. Search Trigger */}
        <div className="p-2 flex">
           <button 
             onClick={handleSearch}
             className="w-full lg:w-auto px-10 bg-cyan-600 text-white font-bold text-base rounded-[14px] hover:bg-cyan-700 transition-all active:scale-[0.98] shadow-md hover:shadow-cyan-600/20"
           >
              Search
           </button>
        </div>
      </div>

      {/* 5. Mobile Meta Helper */}
      <div className="flex lg:hidden items-center gap-4 mt-6 px-2">
         <label className="flex items-center gap-3 cursor-pointer group">
            <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-[#006ce4] focus:ring-[#006ce4]" />
            <span className="text-xs font-bold text-gray-500 group-hover:text-primary transition-colors">I'm looking for an entire home</span>
         </label>
      </div>
    </div>
  );
};

export default SearchBar;
