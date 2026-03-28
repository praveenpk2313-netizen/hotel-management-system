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
    <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-luxury-gold transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 flex flex-col group h-full">
      {/* Property Visual */}
      <div className="relative h-60 overflow-hidden m-6 mb-0 rounded-3xl shrink-0">
        <img 
          src={getImageUrl((hotel.images && hotel.images[0]) || hotel.image)} 
          alt={hotel.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Score Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm text-slate-900 font-sans font-black">
           <Star size={14} className="text-amber-500 fill-amber-500" />
           <span className="text-sm leading-none">
              {hotel.averageRating ? hotel.averageRating.toFixed(1) : '0.0'}
           </span>
        </div>
      </div>

      {/* Property Data */}
      <div className="p-8 flex flex-col flex-1 font-serif">
          <div className="flex justify-between items-start gap-4 mb-4">
             <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-luxury-gold transition-colors truncate">
                   {hotel.name}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] mt-3 uppercase tracking-widest font-sans">
                   <MapPin size={14} className="text-luxury-gold" /> 
                   <span className="truncate">{hotel.location || hotel.city || 'Location'}</span>
                </div>
             </div>
             
             <div className="text-right shrink-0">
                <p className="text-xl font-black text-slate-900 leading-none">
                   {formatCurrency(hotel.minPrice || hotel.pricePerNight || 0)}
                </p>
                <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-widest font-sans">from /night</p>
             </div>
          </div>

          <p className="text-[13px] text-slate-500 line-clamp-1 mb-8 font-sans font-medium opacity-70 italic">
             "{hotel.description || 'Experience architectural heritage and understated luxury in this sanctuary.'}"
          </p>

          <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-2 text-slate-400 font-bold text-[11px] uppercase tracking-widest font-sans">
                <User size={14} /> 2+
             </div>
             <Link 
               to={`/hotel/${hotel._id || hotel.id}`}
               className="px-6 py-2.5 bg-luxury-gold text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-sm font-sans"
             >
                View Details
             </Link>
          </div>
      </div>
    </div>
  );
};

export default HotelCard;
