import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart, ShieldCheck, Zap, User, Hotel } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const HotelCard = ({ hotel }) => {
  return (
    <Link 
      to={`/hotel/${hotel._id || hotel.id}`} 
      className="group block relative bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:border-[#c5a059]/30 transition-all duration-500 hover:shadow-premium group"
    >
      {/* Property Visual */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={(hotel.images && hotel.images[0]) || hotel.image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'} 
          alt={hotel.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Wishlist Toggle */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#c5a059] transition-all shadow-lg border border-white/20">
           <Heart size={18} />
        </button>

        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <div className="px-4 py-1.5 bg-slate-900 shadow-xl rounded-full text-[9px] font-black text-white uppercase tracking-[2px] flex items-center gap-2">
              <ShieldCheck size={12} className="text-[#c5a059]" /> PK Verified
           </div>
        </div>

        {/* Price Overlay */}
        <div className="absolute bottom-4 left-4 right-4 px-4 py-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
           <span className="text-white text-xs font-black uppercase tracking-widest">Enquire Now</span>
           <div className="w-8 h-8 bg-[#c5a059] rounded-lg flex items-center justify-center text-white shadow-lg">
              <Hotel size={16} />
           </div>
        </div>
      </div>

      {/* Property Data */}
      <div className="p-8 flex flex-col">
          <div className="flex justify-between items-start gap-4 mb-4">
             <div className="flex-1 min-w-0">
                <h3 className="text-xl font-serif font-black text-slate-900 leading-tight group-hover:text-[#c5a059] transition-colors truncate">
                   {hotel.name}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] mt-2 uppercase tracking-widest">
                   <MapPin size={12} className="text-[#c5a059]" /> 
                   <span className="truncate group-hover:text-slate-600 transition-colors">{hotel.location || hotel.city}</span>
                </div>
             </div>
             
             {/* Score Badge */}
             <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                   <p className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-widest">Elite</p>
                </div>
                <div className="w-10 h-10 bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl flex items-center justify-center text-sm font-serif font-black shadow-sm group-hover:bg-[#c5a059] group-hover:text-white group-hover:border-[#c5a059] transition-all duration-500">
                   {hotel.averageRating ? hotel.averageRating.toFixed(1) : '9.2'}
                </div>
             </div>
          </div>

          <p className="text-[14px] text-slate-500 leading-relaxed line-clamp-2 mb-8 font-medium italic">
             "{hotel.description || 'Experience architectural heritage and understated luxury in this hand-verified urban haven.'}"
          </p>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
             <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#c5a059] font-black text-[10px] uppercase tracking-widest bg-[#c5a059]/5 px-3 py-1.5 rounded-full border border-[#c5a059]/10">
                   <Zap size={10} strokeWidth={3} /> Exclusive Stay
                </div>
             </div>
             <div className="text-right">
                <div className="flex items-baseline gap-2 justify-end">
                   <span className="text-[10px] text-slate-400 font-bold line-through opacity-60">
                      {formatCurrency((hotel.minPrice || hotel.pricePerNight || 0) * 1.3)}
                   </span>
                   <span className="text-xl font-serif font-black text-slate-900">
                      {formatCurrency(hotel.minPrice || hotel.pricePerNight || 0)}
                   </span>
                </div>
                <p className="text-[9px] text-slate-400 font-black mt-1 uppercase tracking-[2px]">Premium Collection</p>
             </div>
          </div>
      </div>
    </Link>
  );
};

export default HotelCard;
