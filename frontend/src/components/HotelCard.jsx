import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, Heart, ArrowUpRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const HotelCard = ({ hotel }) => {
  return (
    <Link 
      to={`/hotel/${hotel._id || hotel.id}`} 
      className="group block relative"
    >
      <div className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-700 flex flex-col h-full transform hover:-translate-y-4">
        
        {/* Visual Terminal */}
        <div className="relative h-[340px] overflow-hidden m-4 rounded-[2.5rem]">
          {/* Main Content Image */}
          <img 
            src={(hotel.images && hotel.images[0]) || hotel.image || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200'} 
            alt={hotel.name} 
            className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
          />
          
          {/* Elite Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Status Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-2">
             <div className="px-4 py-1.5 bg-white/90 backdrop-blur-xl rounded-full flex items-center gap-2 text-[9px] font-black text-secondary-dark uppercase tracking-[2px] shadow-sm">
                <ShieldCheck size={12} className="text-primary" /> Verified Heritage
             </div>
             {hotel.isFeatured && (
               <div className="px-4 py-1.5 bg-primary rounded-full flex items-center gap-2 text-[9px] font-black text-white uppercase tracking-[2px] shadow-lg animate-pulse">
                  <Sparkles size={12} /> Curated
               </div>
             )}
          </div>

          <div className="absolute top-6 right-6">
             <button className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-secondary-dark transition-all transform hover:rotate-12">
                <Heart size={20} />
             </button>
          </div>

          {/* Rating Badge */}
          <div className="absolute bottom-6 left-6 px-4 h-10 bg-white/95 backdrop-blur-xl rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
             <Star size={16} fill="#C5A059" className="text-primary" />
             <span className="text-sm font-black text-secondary-dark">{hotel.averageRating ? hotel.averageRating.toFixed(1) : '4.9'}</span>
             <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest hidden sm:block">Audit Score</span>
          </div>
          
          {/* Interaction Pointer */}
          <div className="absolute bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-10 transition-all duration-500 shadow-2xl">
             <ArrowUpRight size={24} />
          </div>
        </div>

        {/* Intelligence Data */}
        <div className="px-8 pb-10 flex-1 flex flex-col space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1 flex-1">
               <h3 className="text-2xl font-serif font-black text-secondary-dark tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-1">
                  {hotel.name}
               </h3>
               <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <MapPin size={14} className="text-primary" /> {hotel.location || hotel.city}
               </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">Investment</p>
               <p className="text-2xl font-black text-secondary-dark italic font-serif leading-none tracking-tighter">
                  {formatCurrency(hotel.minPrice || hotel.pricePerNight || 0)}
               </p>
            </div>
          </div>

          <p className="text-xs font-medium text-gray-400 leading-relaxed italic line-clamp-2 pb-6 border-b border-gray-50 flex-1">
            {hotel.description ? (hotel.description.length > 110 ? hotel.description.substring(0, 110) + '...' : hotel.description) : 'An audited collection of heritage suites offering unparalleled perspective and architectural excellence.'}
          </p>

          <div className="flex items-center justify-between pt-2">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-secondary-dark border border-gray-100 group-hover:bg-primary group-hover:text-white transition-all">
                   <Users size={18} />
                </div>
                <div>
                   <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Capacity</p>
                   <p className="text-[10px] font-bold text-secondary-dark uppercase tracking-widest">{hotel.capacity || 2} Qualified Guests</p>
                </div>
             </div>
             <div className="flex items-center gap-2 px-4 h-10 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-primary/30 transition-all">
                <Zap size={14} className="text-primary" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Instant Scope</span>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
