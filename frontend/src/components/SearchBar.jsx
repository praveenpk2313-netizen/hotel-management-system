import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SearchBar = () => {
  const [location, setLocation] = useState('Select');
  const [category, setCategory] = useState('Select');
  const [person, setPerson] = useState('Select');

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
        
        {/* Location Selector */}
        <div className="flex-1 px-4 md:px-8 py-4 flex flex-col justify-center md:border-r border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group rounded-xl md:rounded-none">
          <div className="flex items-center justify-between pointer-events-none">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-luxury-gold transition-colors">Location</p>
                <p className="text-slate-900 text-sm font-bold">{location}</p>
             </div>
             <ChevronDown size={16} className="text-slate-300 group-hover:text-luxury-gold transition-all duration-300" />
          </div>
        </div>

        {/* Room Category */}
        <div className="flex-1 px-4 md:px-8 py-4 flex flex-col justify-center md:border-r border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group rounded-xl md:rounded-none">
          <div className="flex items-center justify-between pointer-events-none">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-luxury-gold transition-colors">Category</p>
                <p className="text-slate-900 text-sm font-bold">{category}</p>
             </div>
             <ChevronDown size={16} className="text-slate-300 group-hover:text-luxury-gold transition-all duration-300" />
          </div>
        </div>

        {/* Total Person */}
        <div className="flex-1 px-4 md:px-8 py-4 flex flex-col justify-center hover:bg-slate-50 transition-all cursor-pointer group rounded-xl md:rounded-none">
          <div className="flex items-center justify-between pointer-events-none">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-luxury-gold transition-colors">Guests</p>
                <p className="text-slate-900 text-sm font-bold">{person}</p>
             </div>
             <ChevronDown size={16} className="text-slate-300 group-hover:text-luxury-gold transition-all duration-300" />
          </div>
        </div>

        {/* Action Button */}
        <button className="md:w-1/4 bg-slate-900 hover:bg-luxury-gold text-white flex items-center justify-center transition-all active:scale-[0.98] group rounded-xl py-6 md:py-0 md:rounded-r-xl border-none cursor-pointer">
          <span className="text-xs font-black uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Search Room</span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
