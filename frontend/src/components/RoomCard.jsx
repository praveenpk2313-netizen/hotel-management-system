import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Bed, 
  Wind, 
  Wifi, 
  Coffee, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  CheckCircle,
  Info
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const RoomCard = ({ room, hotelId, hotelName, hotel, checkIn, checkOut, guests, onBookError, isSelected, onSelect }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
       if (onBookError) onBookError('Please select your preferred check-in and check-out dates to continue.');
       document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' });
       return;
    }

    const checkInDate = checkIn.toISOString();
    const checkOutDate = checkOut.toISOString();
    const nights = Math.ceil(Math.abs(checkOut - checkIn) / (1000 * 60 * 60 * 24)) || 1;

    navigate('/payment', { 
      state: { 
        selectedRoom: room,
        hotel: hotel || { _id: hotelId, name: hotelName },
        bookingData: {
          hotel: hotelId,
          room: room._id,
          checkInDate,
          checkOutDate,
          numGuests: guests || 2,
          totalPrice: room.price * nights,
          userName: 'Guest'
        }
      } 
    });
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(room._id);
      document.getElementById('booking-widget')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleBookNow();
    }
  };

  return (
    <div 
      className={`bg-slate-50 border rounded-[2rem] overflow-hidden transition-all group flex flex-col md:flex-row shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 cursor-pointer ${isSelected ? 'border-luxury-gold ring-4 ring-luxury-gold/5 bg-white' : 'border-slate-100 hover:border-luxury-gold/30'}`}
      onClick={() => onSelect && onSelect(room._id)}
    >
      
      {/* 1. Room Image */}
      <div className="md:w-80 h-56 md:h-auto relative overflow-hidden shrink-0 m-4 rounded-2xl">
        <img 
          src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"} 
          alt={room.type} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        {(room.totalRooms - (room.bookings?.length || 0)) <= 2 && (
          <div className="absolute top-4 left-4 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
            Limited Availability
          </div>
        )}
      </div>

      {/* 2. Room Intel */}
      <div className="flex-1 p-8 flex flex-col justify-between border-r border-slate-100 font-sans">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 font-serif italic">{room.type} Sanctuary</h3>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <div className="flex items-center gap-1.5"><Users size={14} className="text-luxury-gold" /> {room.capacity} Residents</div>
                   <div className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                   <div className="flex items-center gap-1.5"><Bed size={14} className="text-luxury-gold" /> King Suite</div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4">
             <div className="flex items-center gap-3 text-[11px] font-bold text-emerald-600 uppercase tracking-wide">
                <CheckCircle size={16} /> Fully Refundable
             </div>
             <div className="flex items-center gap-3 text-[11px] font-bold text-luxury-gold uppercase tracking-wide">
                <Zap size={16} className="fill-luxury-gold" /> Instant Reserve
             </div>
             <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <Wifi size={14} /> WiFi 6E
             </div>
             <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <Coffee size={14} /> Nespresso
             </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-2"><Wind size={14} /> Climate Control</div>
           <div className="flex items-center gap-2"><Info size={14} /> Concierge Access</div>
        </div>
      </div>

      {/* 3. Pricing & CTA */}
      <div className="md:w-64 p-8 bg-white flex flex-col justify-center items-end text-right space-y-6">
         <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">per night</p>
            <h4 className="text-3xl font-black text-slate-900 tracking-tighter leading-none font-serif">
               {formatCurrency(room.price)}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 opacity-60">incl. all luxury taxes</p>
         </div>

         <button 
           onClick={(e) => { e.stopPropagation(); handleSelect(); }}
           className={`w-full h-14 font-black rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-xl uppercase tracking-widest text-[10px] ${isSelected ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-900 text-white hover:bg-luxury-gold shadow-slate-900/10'}`}
         >
            {isSelected ? 'Sanctuary Selected' : 'Choose Sanctuary'}
            {!isSelected && <ChevronRight size={16} />}
            {isSelected && <CheckCircle size={16} />}
         </button>
         
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">
            Elite Member Rate Applied
         </p>
      </div>
    </div>
  );
};

export default RoomCard;
