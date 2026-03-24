import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Bed, 
  Wind, 
  Wifi, 
  Monitor, 
  Coffee, 
  ShieldCheck, 
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const RoomCard = ({ room, hotelId, hotelName, hotel }) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    const checkInDate = new Date().toISOString();
    const checkOutDate = new Date(Date.now() + 86400000).toISOString(); // +1 day

    navigate('/payment', { 
      state: { 
        selectedRoom: room,
        hotel: hotel || { _id: hotelId, name: hotelName },
        bookingData: {
          hotel: hotelId,
          room: room._id,
          checkInDate,
          checkOutDate,
          numGuests: 2, // Default
          totalPrice: room.price,
          userName: 'Guest'
        }
      } 
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#006ce4] transition-all group flex flex-col md:flex-row shadow-sm hover:shadow-md">
      
      {/* 1. Room Image Section */}
      <div className="md:w-72 h-48 md:h-auto relative overflow-hidden shrink-0">
        <img 
          src={room.images?.[0] || "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"} 
          alt={room.type} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        {(room.totalRooms - (room.bookings?.length || 0)) <= 2 && (
          <div className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-lg">
            Only {room.totalRooms - (room.bookings?.length || 0)} left!
          </div>
        )}
      </div>

      {/* 2. Room Intel Section */}
      <div className="flex-1 p-6 flex flex-col justify-between border-r border-gray-100 bg-gray-50/10">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
             <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-2">{room.type} Suite</h3>
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                   <div className="flex items-center gap-1.5"><Users size={14} /> Max {room.capacity} guests</div>
                   <div className="w-1 h-1 bg-gray-300 rounded-full" />
                   <div className="flex items-center gap-1.5"><Bed size={14} /> 1 Extra-large double bed</div>
                </div>
             </div>
             <div className="bg-[#003b95]/5 p-2 rounded-lg text-[#003b95] cursor-help">
                <Info size={16} />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-y-3">
             <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700">
                <ShieldCheck size={14} /> Free Cancellation
             </div>
             <div className="flex items-center gap-2 text-[11px] font-bold text-blue-700">
                <Zap size={14} className="fill-blue-700" /> No prepayment needed
             </div>
             <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600">
                <Wifi size={14} /> High-speed WiFi
             </div>
             <div className="flex items-center gap-2 text-[11px] font-medium text-gray-600">
                <Coffee size={14} /> Breakfast included
             </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
           <Wind size={14} /> Air Conditioning
           <Monitor size={14} /> Flat-screen TV
        </div>
      </div>

      {/* 3. Pricing & Call to Action */}
      <div className="md:w-64 p-6 bg-white flex flex-col justify-center items-end text-right space-y-4">
         <div className="space-y-1">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Price for 1 night</p>
            <h4 className="text-2xl font-black text-gray-900 leading-none">
               {formatCurrency(room.price)}
            </h4>
            <p className="text-[10px] font-bold text-gray-500">+ {formatCurrency(Math.round(room.price * 0.12))} taxes and charges</p>
         </div>

         <button 
           onClick={handleBookNow}
           className="w-full h-12 bg-[#006ce4] text-white font-black rounded-lg hover:bg-[#0052ad] transition-all flex items-center justify-center gap-2 group/btn active:scale-95 shadow-lg shadow-blue-500/10"
         >
            Select & Stay
            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
         </button>
         
         <p className="text-[9px] font-black text-[#003b95] uppercase tracking-widest opacity-60">
            Instant confirmation
         </p>
      </div>
    </div>
  );
};

export default RoomCard;
