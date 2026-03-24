import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Users, 
  X, 
  ChevronDown, 
  Plus, 
  Minus,
  Loader2,
  Bed
} from 'lucide-react';
import { fetchSuggestions } from '../services/api';

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [showGuests, setShowGuests] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const suggestionsRef = useRef();
  const guestsRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) setShowSuggestions(false);
      if (guestsRef.current && !guestsRef.current.contains(e.target)) setShowGuests(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocationChange = async (e) => {
    const val = e.target.value;
    setLocation(val);
    if (val.length >= 2) {
      setLoading(true);
      try {
        const { data } = await fetchSuggestions(val);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    onSearch({ location, startDate, endDate, guests, rooms });
  };

  return (
    <div className="relative w-full z-50">
      
      {/* Booking.com Style Segmented Interface */}
      <div className="bg-white rounded-lg border-4 border-booking-yellow shadow-booking flex flex-col lg:flex-row items-stretch lg:h-16 overflow-hidden">
        
        {/* 1. Destination Segment */}
        <div className="relative group flex-1 border-b lg:border-b-0 lg:border-r border-booking-yellow/30" ref={suggestionsRef}>
           <div className="flex items-center h-full px-4 gap-3">
              <Bed className="text-gray-400 group-focus-within:text-blue-600 transition-colors" size={24} />
              <div className="flex-1 flex flex-col justify-center">
                 <input 
                   type="text" 
                   placeholder="Where are you going?" 
                   value={location}
                   onChange={handleLocationChange}
                   onFocus={() => location.length >= 2 && setShowSuggestions(true)}
                   className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-800 placeholder:text-gray-500 placeholder:font-medium tracking-tight"
                 />
              </div>
              {location && <X size={18} className="text-gray-300 hover:text-rose-500 cursor-pointer" onClick={() => {setLocation(''); setSuggestions([]);}} />}
           </div>

           {/* suggestions engine */}
           {showSuggestions && suggestions.length > 0 && (
             <div className="absolute top-[105%] left-0 w-full lg:w-[400px] bg-white rounded-xl shadow-2xl border border-gray-100 py-3 animate-fade-in z-[1000]">
                <div className="px-5 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-2">Nearby Destinations</div>
                {suggestions.map((text, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => { setLocation(text); setShowSuggestions(false); }}
                    className="w-full px-6 py-4 text-left flex items-center gap-4 hover:bg-booking-blue hover:text-white transition-all group/item"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">
                       <MapPin size={18} />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{text}</span>
                  </button>
                ))}
             </div>
           )}
        </div>

        {/* 2. Date Segment */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-booking-yellow/30 flex items-center px-4 gap-3 min-w-[300px]">
           <Calendar className="text-gray-400" size={24} />
           <div className="flex items-center gap-2 flex-1 relative font-bold text-sm text-gray-800">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="Check-in date"
                className="w-full bg-transparent border-none outline-none cursor-pointer placeholder:text-gray-500 placeholder:font-medium"
                dateFormat="EEE, MMM d"
              />
              <span className="text-gray-300 font-medium">—</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Check-out date"
                className="w-full bg-transparent border-none outline-none cursor-pointer placeholder:text-gray-500 placeholder:font-medium"
                dateFormat="EEE, MMM d"
              />
           </div>
        </div>

        {/* 3. Guests/Rooms Segment */}
        <div className="relative flex-1 flex items-center px-4 gap-3 cursor-pointer group lg:border-r border-booking-yellow/30 lg:min-w-[280px]" ref={guestsRef} onClick={() => setShowGuests(!showGuests)}>
           <Users className="text-gray-400 group-hover:text-blue-600 transition-colors" size={24} />
           <div className="flex-1">
              <p className="text-sm font-bold text-gray-800 truncate">
                 {guests} adults · 0 children · {rooms} room
              </p>
           </div>
           <ChevronDown size={18} className={`text-gray-400 transition-transform ${showGuests ? 'rotate-180' : ''}`} />

           {showGuests && (
             <div className="absolute top-[105%] right-0 w-full lg:w-[320px] bg-white rounded-xl shadow-2xl border border-gray-100 p-6 animate-fade-in z-[1001]" onClick={e => e.stopPropagation()}>
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-black text-secondary">Adults</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ages 18+</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary-booking hover:bg-gray-50 active:scale-90 transition-all group"><Minus size={16} /></button>
                         <span className="w-4 text-center text-sm font-black">{guests}</span>
                         <button onClick={() => setGuests(guests + 1)} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary-booking hover:bg-gray-50 active:scale-90 transition-all group"><Plus size={16} /></button>
                      </div>
                   </div>
                   <div className="flex items-center justify-between">
                      <div>
                         <p className="text-sm font-black text-secondary">Rooms</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Luxury Suites</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <button onClick={() => setRooms(Math.max(1, rooms - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary-booking hover:bg-gray-50 active:scale-90 transition-all group"><Minus size={16} /></button>
                         <span className="w-4 text-center text-sm font-black">{rooms}</span>
                         <button onClick={() => setRooms(rooms + 1)} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-primary-booking hover:bg-gray-50 active:scale-90 transition-all group"><Plus size={16} /></button>
                      </div>
                   </div>
                   <button 
                     onClick={() => setShowGuests(false)}
                     className="w-full h-12 bg-white border border-booking-blue text-booking-blue font-black text-[10px] uppercase tracking-[3px] rounded-lg hover:bg-blue-50 transition-all mt-4"
                   >
                      Done
                   </button>
                </div>
             </div>
           )}
        </div>

        {/* 4. Search CTA */}
        <button 
          onClick={handleSearch}
          className="h-16 lg:h-auto px-10 bg-booking-blue text-white font-black text-lg tracking-tight hover:bg-blue-800 transition-all flex items-center justify-center gap-3 lg:rounded-none group"
        >
           {loading ? <Loader2 size={24} className="animate-spin text-white" /> : "Search"}
        </button>
      </div>

      {/* Floating Meta Options below bar */}
      <div className="hidden lg:flex items-center gap-6 mt-4">
         <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 rounded border-white bg-booking-blue checked:bg-white transition-all cursor-pointer" />
            <span className="group-hover:text-sky-300 transition-colors">I'm looking for an entire home or apartment</span>
         </label>
      </div>
    </div>
  );
};

export default SearchBar;
