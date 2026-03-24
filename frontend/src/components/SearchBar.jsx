import React, { useState } from 'react';
import { ChevronDown, MapPin, Calendar, Users, Minus, Plus } from 'lucide-react';

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const [showGuests, setShowGuests] = useState(false);

  const totalGuests = guests.adults + guests.children;

  const updateGuests = (type, operation) => {
    setGuests(prev => ({
      ...prev,
      [type]: operation === 'add' ? prev[type] + 1 : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }));
  };

  return (
    <div className="w-full relative">
      <div className="flex flex-col lg:flex-row items-stretch lg:divide-x divide-slate-100">
        
        {/* Location Selector - Now Typing */}
        <div className="flex-[1.5] px-6 py-4 flex flex-col justify-center hover:bg-slate-50 transition-all group rounded-t-xl lg:rounded-none">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-focus-within:text-luxury-gold transition-colors block text-left">Location</label>
          <div className="flex items-center gap-2">
             <MapPin size={16} className="text-slate-300 group-focus-within:text-luxury-gold" />
             <input 
               type="text"
               placeholder="Where are you going?"
               value={location}
               onChange={(e) => setLocation(e.target.value)}
               className="bg-transparent border-none outline-none text-slate-900 text-sm font-bold w-full placeholder:text-slate-300"
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
               className="bg-transparent border-none outline-none text-slate-900 text-sm font-bold w-full cursor-pointer"
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
               className="bg-transparent border-none outline-none text-slate-900 text-sm font-bold w-full cursor-pointer"
             />
          </div>
        </div>

        {/* Guest Selector - Adults & Children */}
        <div className="flex-1 px-6 py-4 flex flex-col justify-center hover:bg-slate-50 transition-all cursor-pointer group relative" onClick={() => setShowGuests(!showGuests)}>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-luxury-gold transition-colors block text-left">Guests</label>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-300 group-hover:text-luxury-gold" />
                <span className="text-slate-900 text-sm font-bold truncate">
                  {guests.adults} Adult{guests.adults > 1 ? 's' : ''}, {guests.children} Child{guests.children !== 1 ? 'ren' : ''}
                </span>
             </div>
             <ChevronDown size={14} className={`text-slate-300 transition-transform ${showGuests ? 'rotate-180' : ''}`} />
          </div>

          {showGuests && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 p-6 z-[100] animate-fade-in" onClick={(e) => e.stopPropagation()}>
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-bold text-slate-900">Adults</p>
                        <p className="text-[10px] text-slate-400">Ages 13 or above</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <button onClick={() => updateGuests('adults', 'sub')} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all"><Minus size={14} /></button>
                        <span className="w-4 text-center text-sm font-bold">{guests.adults}</span>
                        <button onClick={() => updateGuests('adults', 'add')} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all"><Plus size={14} /></button>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-bold text-slate-900">Children</p>
                        <p className="text-[10px] text-slate-400">Ages 2-12</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <button onClick={() => updateGuests('children', 'sub')} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all"><Minus size={14} /></button>
                        <span className="w-4 text-center text-sm font-bold">{guests.children}</span>
                        <button onClick={() => updateGuests('children', 'add')} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:border-luxury-gold hover:text-luxury-gold transition-all"><Plus size={14} /></button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button className="lg:w-1/4 bg-slate-900 hover:bg-luxury-gold text-white flex items-center justify-center transition-all active:scale-[0.98] group rounded-b-xl lg:rounded-none py-6 lg:py-0 lg:rounded-r-xl border-none cursor-pointer">
          <span className="text-xs font-black uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Search Room</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
