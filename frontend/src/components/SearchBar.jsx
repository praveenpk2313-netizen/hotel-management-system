import React, { useState } from 'react';
import { ChevronDown, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react';

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [showGuests, setShowGuests] = useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGuests(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <div className="flex-[1.5] px-6 py-4 flex flex-col justify-center hover:bg-slate-50 transition-all group rounded-t-xl lg:rounded-none">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-focus-within:text-luxury-gold transition-colors block text-left">Location</label>
          <div className="flex items-center gap-2">
             <MapPin size={16} className="text-slate-300 group-focus-within:text-luxury-gold" />
             <input 
               type="text"
               placeholder="Destination"
               value={location}
               onChange={(e) => setLocation(e.target.value)}
               className="bg-transparent border-none outline-none text-slate-900 text-sm font-black w-full placeholder:text-slate-300 font-sans"
             />
          </div>
        </div>

        {/* Check-in Selector */}
        <div className="flex-1 px-6 py-4 flex flex-col justify-center hover:bg-slate-50 transition-all group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-luxury-gold transition-colors block text-left">Check-in</label>
          <div className="flex items-center gap-2">
             <Calendar size={16} className="text-slate-300 group-hover:text-luxury-gold" />
             <input 
               type="date"
               value={checkIn}
               onChange={(e) => setCheckIn(e.target.value)}
               className="bg-transparent border-none outline-none text-slate-900 text-sm font-black w-full cursor-pointer font-sans"
             />
          </div>
        </div>

        {/* Check-out Selector */}
        <div className="flex-1 px-6 py-4 flex flex-col justify-center hover:bg-slate-50 transition-all group">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-luxury-gold transition-colors block text-left">Check-out</label>
          <div className="flex items-center gap-2">
             <Calendar size={16} className="text-slate-300 group-hover:text-luxury-gold" />
             <input 
               type="date"
               value={checkOut}
               onChange={(e) => setCheckOut(e.target.value)}
               className="bg-transparent border-none outline-none text-slate-900 text-sm font-black w-full cursor-pointer font-sans"
             />
          </div>
        </div>

        {/* Guest Selector */}
        <div className="flex-1 px-6 py-4 flex flex-col justify-center hover:bg-slate-50 transition-all group relative" ref={dropdownRef}>
          <div className="cursor-pointer" onClick={() => setShowGuests(!showGuests)}>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-luxury-gold transition-colors block text-left">Guests</label>
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Users size={16} className="text-slate-300 group-hover:text-luxury-gold" />
                   <span className="text-slate-900 text-sm font-black truncate font-sans">
                     {guests.adults} Ad, {guests.children} Ch
                   </span>
                </div>
                <ChevronDown size={14} className={`text-slate-300 transition-transform ${showGuests ? 'rotate-180' : ''}`} />
             </div>
          </div>

          {showGuests && (
            <div className="absolute top-[calc(100%+12px)] left-0 right-[-80px] lg:right-[-40px] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] border border-slate-100 p-8 z-[2000] animate-fade-in animate-slide-up">
               <div className="space-y-8">
                  <div className="flex items-center justify-between gap-12">
                     <div className="flex-grow">
                        <p className="text-sm font-black text-slate-900 font-sans tracking-tight">Adults</p>
                        <p className="text-[10px] text-slate-400 font-bold font-sans">Ages 13+</p>
                     </div>
                     <div className="flex items-center gap-5">
                        <button type="button" onClick={() => updateGuests('adults', 'sub')} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all active:scale-90"><Minus size={14} /></button>
                        <span className="w-4 text-center text-base font-black text-slate-900 font-sans">{guests.adults}</span>
                        <button type="button" onClick={() => updateGuests('adults', 'add')} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all active:scale-90"><Plus size={14} /></button>
                     </div>
                  </div>
                  <div className="flex items-center justify-between gap-12">
                     <div className="flex-grow">
                        <p className="text-sm font-black text-slate-900 font-sans tracking-tight">Children</p>
                        <p className="text-[10px] text-slate-400 font-bold font-sans">Ages 2-12</p>
                     </div>
                     <div className="flex items-center gap-5">
                        <button type="button" onClick={() => updateGuests('children', 'sub')} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all active:scale-90"><Minus size={14} /></button>
                        <span className="w-4 text-center text-base font-black text-slate-900 font-sans">{guests.children}</span>
                        <button type="button" onClick={() => updateGuests('children', 'add')} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all active:scale-90"><Plus size={14} /></button>
                     </div>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setShowGuests(false)}
                    className="w-full py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-luxury-gold transition-all shadow-xl active:scale-[0.98]"
                  >
                    Confirm Choice
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button type="button" className="lg:w-1/4 bg-slate-900 hover:bg-luxury-gold text-white flex items-center justify-center transition-all active:scale-[0.98] group rounded-b-xl lg:rounded-none py-6 lg:py-0 lg:rounded-r-xl border-none cursor-pointer">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:tracking-[0.4em] transition-all">Search Room</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
