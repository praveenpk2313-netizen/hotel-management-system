import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Heart, ShieldCheck, Zap, User } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const HotelCard = ({ hotel }) => {
  return (
    <Link 
      to={`/hotel/${hotel._id || hotel.id}`} 
      className="group block relative card-premium h-full flex flex-col"
    >
      {/* Property Visual */}
      <div className="relative h-56 overflow-hidden">
        <img 
          src={(hotel.images && hotel.images[0]) || hotel.image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'} 
          alt={hotel.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Wishlist Toggle */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-secondary hover:bg-white hover:text-rose-500 transition-all shadow-sm">
           <Heart size={16} />
        </button>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
           <div className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
              <ShieldCheck size={12} className="text-cyan-600" /> TOP RATED
           </div>
        </div>
      </div>

      {/* Property Data */}
      <div className="p-4 flex-1 flex flex-col">
          <div className="flex justify-between items-start gap-2 mb-2">
             <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-cyan-600 transition-colors truncate">
                   {hotel.name}
                </h3>
                <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[12px] mt-1.5">
                   <MapPin size={14} className="text-cyan-600" /> 
                   <span className="truncate hover:text-cyan-700 transition-colors cursor-pointer">{hotel.location || hotel.city}</span>
                </div>
             </div>
             
             {/* Score Badge */}
             <div className="flex flex-col items-end">
                <div className="flex items-center gap-2">
                   <div className="text-right">
                      <p className="text-[12px] font-bold text-slate-900 leading-none">Excellent</p>
                      <p className="text-[10px] text-slate-500 mt-1">2,500 reviews</p>
                   </div>
                   <div className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-sm">
                      {hotel.averageRating ? hotel.averageRating.toFixed(1) : '8.8'}
                   </div>
                </div>
             </div>
          </div>

          <p className="text-[13px] text-slate-600 leading-relaxed line-clamp-2 mt-auto pb-5">
             {hotel.description || 'Verified property with elite amenities and exceptional service in high-demand coordinates.'}
          </p>

          <div className="pt-4 border-t border-slate-100 flex items-end justify-between">
             <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] bg-emerald-50 px-2 py-1 rounded-md">
                   <Zap size={10} /> Limited-time Deal
                </div>
                <p className="text-[11px] text-slate-400 font-medium">1 night, 2 adults</p>
             </div>
             <div className="text-right">
                <p className="text-[11px] text-slate-400 line-through opacity-60">
                   {formatCurrency((hotel.minPrice || hotel.pricePerNight || 0) * 1.25)}
                </p>
                <p className="text-2xl font-bold text-slate-900 leading-none mt-1">
                   {formatCurrency(hotel.minPrice || hotel.pricePerNight || 0)}
                </p>
                <p className="text-[10px] text-slate-400 mt-1.5 uppercase tracking-wide">Includes Taxes</p>
             </div>
          </div>
      </div>
    </Link>
  );
};

export default HotelCard;
