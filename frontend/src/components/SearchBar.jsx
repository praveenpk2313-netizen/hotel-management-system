import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const SearchBar = () => {
  const [location, setLocation] = useState('Select');
  const [category, setCategory] = useState('Select');
  const [person, setPerson] = useState('Select');

  return (
    <div className="search-panel-container absolute bottom-[-60px] left-0 w-full z-[50] px-[4%]">
      <div className="flex bg-white rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] max-w-[1440px] mx-auto h-[120px] border border-slate-100">
        
        {/* Location Selector */}
        <div className="flex-1 px-14 flex flex-col justify-center border-r border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group">
          <div className="flex items-center justify-between pointer-events-none">
             <div>
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-1">Location</p>
                <p className="text-slate-400 text-sm font-bold">{location}</p>
             </div>
             <ChevronDown size={20} className="text-slate-900 group-hover:text-[#c5a059] transition-all duration-300" />
          </div>
        </div>

        {/* Room Category */}
        <div className="flex-1 px-14 flex flex-col justify-center border-r border-slate-100 hover:bg-slate-50 transition-all cursor-pointer group">
          <div className="flex items-center justify-between pointer-events-none">
             <div>
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-1">Room Category</p>
                <p className="text-slate-400 text-sm font-bold">{category}</p>
             </div>
             <ChevronDown size={20} className="text-slate-900 group-hover:text-[#c5a059] transition-all duration-300" />
          </div>
        </div>

        {/* Total Person */}
        <div className="flex-1 px-14 flex flex-col justify-center hover:bg-slate-50 transition-all cursor-pointer group">
          <div className="flex items-center justify-between pointer-events-none">
             <div>
                <p className="text-[13px] font-black text-slate-900 uppercase tracking-widest mb-1">Total Person</p>
                <p className="text-slate-400 text-sm font-bold">{person}</p>
             </div>
             <ChevronDown size={20} className="text-slate-900 group-hover:text-[#c5a059] transition-all duration-300" />
          </div>
        </div>

        {/* Action Button */}
        <button className="w-1/4 bg-luxury-gold hover:bg-luxury-gold-hover text-white flex items-center justify-center transition-all active:scale-[0.97] group border-none outline-none cursor-pointer">
          <span className="text-lg font-black uppercase tracking-[3px] group-hover:tracking-[4px] transition-all">Book Now</span>
        </button>
      </div>

      <style>{`
        .search-panel-container {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
