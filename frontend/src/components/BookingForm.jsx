import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, Users, Loader2, Info, ChevronDown, Minus, Plus, BedDouble, Zap, ShieldCheck } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatCurrency } from '../utils/helpers';

const BookingForm = ({ hotel, rooms, onSubmit, initialCheckIn, initialCheckOut, initialGuests, initialRoomId, initialError }) => {
  const [startDate, setStartDate] = useState(initialCheckIn || null);
  const [endDate, setEndDate] = useState(initialCheckOut || null);
  const [selectedRoomId, setSelectedRoomId] = useState(initialRoomId || '');
  const [numGuests, setNumGuests] = useState(initialGuests || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialError || '');
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

  useEffect(() => {
    if (rooms && rooms.length > 0 && !selectedRoomId) {
      const firstAvailable = rooms.find(r => r.isAvailable) || rooms[0];
      setSelectedRoomId(firstAvailable._id);
    }
  }, [rooms, selectedRoomId]);

  useEffect(() => {
    if (initialError) setError(initialError);
  }, [initialError]);

  useEffect(() => {
    if (initialCheckIn) setStartDate(initialCheckIn);
    if (initialCheckOut) setEndDate(initialCheckOut);
    if (initialGuests) setNumGuests(initialGuests);
    if (initialRoomId) setSelectedRoomId(initialRoomId);
  }, [initialCheckIn, initialCheckOut, initialGuests, initialRoomId]);

  useEffect(() => {
    if (error) setError('');
  }, [startDate, endDate]);

  const selectedRoom = rooms?.find(r => r._id === selectedRoomId);

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const subtotal = selectedRoom ? nights * selectedRoom.price : 0;
  const taxes = subtotal * 0.12; 
  const totalPrice = subtotal + taxes;

  const handleGuestChange = (delta) => {
    const maxCapacity = selectedRoom?.capacity || 4;
    setNumGuests(prev => Math.max(1, Math.min(maxCapacity, prev + delta)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Preferred stay period required.');
      return;
    }
    if (!selectedRoomId) {
      setError('Please choose a room.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        hotelId: hotel._id,
        roomId: selectedRoomId,
        checkInDate: startDate,
        checkOutDate: endDate,
        totalPrice,
        numGuests
      });
    } catch (err) {
      setError(err.message || 'We could not process your booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50" id="booking-widget">
      
      {/* 1. Header with Title & Price */}
      <div className="flex justify-between items-start mb-10">
        <h3 className="text-4xl font-black text-slate-900 tracking-tight font-serif leading-[1.1]">
          Select Your <br /> Room
        </h3>
        <div className="text-right">
          <p className="text-2xl font-black text-luxury-gold font-sans tracking-tighter">
            {formatCurrency(selectedRoom?.price || 0)}
          </p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">/night</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-500 p-4 rounded-xl text-xs font-bold mb-6 flex items-center gap-3">
          <Info size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 2. Date Pickers (Two-column layout) */}
        <div className="grid grid-cols-2 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-r border-slate-100 group transition-all hover:bg-white">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Check-in</p>
            <div className="flex items-center gap-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                placeholderText="Add date"
                className="bg-transparent w-full text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="p-4 group transition-all hover:bg-white">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Check-out</p>
            <div className="flex items-center gap-2">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                placeholderText="Add date"
                className="bg-transparent w-full text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Room Type Selector */}
        <div className="relative">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Room Type</p>
          <div 
            onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-white hover:border-luxury-gold/30"
          >
            <span className="text-sm font-bold text-slate-900">
              {selectedRoom ? `${selectedRoom.type} (${selectedRoom.capacity} Guests)` : 'Choose a room'}
            </span>
            <ChevronDown size={18} className={`text-slate-400 transition-transform ${isRoomDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isRoomDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-dropdown">
              {rooms?.map(room => (
                <div
                  key={room._id}
                  onClick={() => {
                    setSelectedRoomId(room._id);
                    setIsRoomDropdownOpen(false);
                    if (numGuests > room.capacity) setNumGuests(room.capacity);
                  }}
                  className={`p-4 text-sm font-bold cursor-pointer transition-all hover:bg-luxury-gold/5 ${selectedRoomId === room._id ? 'text-luxury-gold bg-luxury-gold/5' : 'text-slate-700'}`}
                >
                  <div className="flex justify-between items-center">
                    <span>{room.type} ({room.capacity} Guests)</span>
                    <span className="text-xs">{formatCurrency(room.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Guest Count Selector */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 transition-all hover:bg-white">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Guests</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-slate-400" />
              <span className="text-sm font-extrabold text-slate-900">{numGuests}</span>
            </div>
            <div className="flex items-center gap-1">
              <button 
                type="button" 
                onClick={() => handleGuestChange(-1)} 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                disabled={numGuests <= 1}
              >
                <Minus size={14} />
              </button>
              <button 
                type="button" 
                onClick={() => handleGuestChange(1)} 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                disabled={numGuests >= (selectedRoom?.capacity || 4)}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* 5. Book Now Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full h-16 bg-luxury-gold text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 transition-all hover:bg-[#b08d4a] hover:-translate-y-1 shadow-xl shadow-luxury-gold/20 active:translate-y-0"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <CreditCard size={20} />
              Book Now
            </>
          )}
        </button>

        {/* 6. Footer Text */}
        <p className="text-[10px] font-bold text-slate-400 text-center px-4 leading-relaxed">
          You won't be charged until you confirm on the next page.
        </p>
      </form>

      <style>{`
        @keyframes dropdown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-dropdown { animation: dropdown 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default BookingForm;
