import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, User } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';
import { API_BASE_URL } from '../services/api';

const HotelCard = ({ hotel }) => {
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}/${url}`;
  };

  return (
    <div className="card-premium flex flex-col group h-full">
      {/* Property Visual */}
      <div className="relative h-64 overflow-hidden m-4 mb-0 rounded-[2rem] shrink-0 border border-white/5">
        <img 
          src={getImageUrl((hotel.images && hotel.images[0]) || hotel.image)} 
          alt={hotel.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
        />
        
        {/* Score Badge */}
        <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10 shadow-2xl text-white font-sans font-black">
           <Star size={14} className="text-indigo-400 fill-indigo-400" />
           <span className="text-xs leading-none">
              {hotel.averageRating ? hotel.averageRating.toFixed(1) : '5.0'}
           </span>
        </div>
      </div>

      {/* Property Data */}
      <div className="p-8 flex flex-col flex-1 font-serif">
          <div className="flex justify-between items-start gap-4 mb-6">
             <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors truncate">
                   {hotel.name}
                </h3>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] mt-4 uppercase tracking-[0.2em] font-sans">
                   <MapPin size={12} className="text-indigo-500" /> 
                   <span className="truncate">{hotel.location || hotel.city || 'Exclusive Area'}</span>
                </div>
             </div>
             
             <div className="text-right shrink-0">
                <p className="text-xl font-bold text-white leading-none">
                   {formatCurrency(hotel.minPrice || hotel.pricePerNight || 0)}
                </p>
                <p className="text-[9px] text-slate-500 font-black mt-2 uppercase tracking-widest font-sans">per night</p>
             </div>
          </div>

          <p className="text-[13px] text-slate-400 line-clamp-2 mb-10 font-sans font-medium leading-relaxed opacity-60">
             {hotel.description || 'Experience architectural excellence and understated luxury in our curated collection.'}
          </p>

          <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between font-sans">
             <div className="flex items-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                <User size={14} className="text-indigo-500" /> 2 Guest Capacity
             </div>
             
             {hotel._id || hotel.id ? (
                <Link 
                  to={`/hotel/${hotel._id || hotel.id}`}
                  className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-600 transition-all active:scale-95 shadow-xl"
                >
                   Details
                </Link>
             ) : (
                <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest italic font-sans">Reserved</span>
             )}
          </div>
      </div>
    </div>
  );
};

export default HotelCard;
