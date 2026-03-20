import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, Users, Loader2, Info } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { formatCurrency } from '../utils/helpers';

const BookingForm = ({ hotel, rooms, onSubmit }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [numGuests, setNumGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-select first room if available
  useEffect(() => {
    if (rooms && rooms.length > 0 && !selectedRoomId) {
      const firstAvailable = rooms.find(r => r.isAvailable) || rooms[0];
      setSelectedRoomId(firstAvailable._id);
    }
  }, [rooms, selectedRoomId]);

  const selectedRoom = rooms?.find(r => r._id === selectedRoomId);

  // Calculate total price
  const calculateTotal = () => {
    if (!startDate || !endDate || !selectedRoom) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * selectedRoom.price;
  };

  const totalPrice = calculateTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Please select check-in and check-out dates.');
      return;
    }

    if (!selectedRoomId) {
      setError('Please select a room type.');
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
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.4)', position: 'sticky', top: '100px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="luxury-font" style={{ fontSize: '1.75rem', margin: 0 }}>Select Your Room</h3>
        <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>
          {selectedRoom ? formatCurrency(selectedRoom.price) : '---'} <small style={{ fontWeight: '400', fontSize: '0.8rem', color: 'var(--text-muted)' }}>/night</small>
        </span>
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '0.8rem 1rem', borderRadius: '12px', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Info size={16} /> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Date Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#e2e8f0', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ background: 'white', padding: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.3rem' }}>Check-In</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Add date"
              className="booking-datepicker"
            />
          </div>
          <div style={{ background: 'white', padding: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.3rem' }}>Check-Out</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Add date"
              className="booking-datepicker"
            />
          </div>
        </div>

        {/* Room & Guests */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e2e8f0', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ background: 'white', padding: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.3rem' }}>Room Type</label>
            <select 
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.95rem', background: 'transparent', cursor: 'pointer' }}
            >
              <option value="" disabled>Select room</option>
              {rooms?.map(room => (
                <option key={room._id} value={room._id}>
                  {room.type} ({room.capacity} Guests)
                </option>
              ))}
            </select>
          </div>
          <div style={{ background: 'white', padding: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: '#64748b', marginBottom: '0.3rem' }}>Guests</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Users size={18} color="#94a3b8" />
              <input 
                type="number" 
                min="1" 
                max={selectedRoom?.capacity || 4}
                value={numGuests}
                onChange={(e) => setNumGuests(parseInt(e.target.value))}
                style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.95rem' }}
              />
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        {totalPrice > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.95rem', color: '#475569' }}>
              <span style={{ textDecoration: 'underline' }}>{formatCurrency(selectedRoom.price)} x {Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24))} nights</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', fontWeight: '800', fontSize: '1.2rem', color: '#0f172a' }}>
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary" 
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', padding: '1rem', fontSize: '1.1rem', marginTop: '0.5rem' }}
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
          {loading ? 'Redirecting...' : !localStorage.getItem('token') ? 'Login to Book' : 'Book Now'}
        </button>
        
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
          {!localStorage.getItem('token') ? 'Login required to process payment securely.' : "You won't be charged until you confirm on the next page."}
        </p>
      </form>

      <style>{`
        .booking-datepicker {
          width: 100%;
          border: none;
          outline: none;
          font-size: 0.95rem;
          color: #0f172a;
          cursor: pointer;
          background: transparent;
        }
        .react-datepicker-wrapper { width: 100%; }
      `}</style>
    </div>
  );
};

export default BookingForm;
