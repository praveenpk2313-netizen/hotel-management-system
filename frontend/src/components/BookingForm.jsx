import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, Users, Loader2, Info, Moon, ChevronDown, Minus, Plus, BedDouble, Sparkles, CheckCircle, ShieldCheck, Zap } from 'lucide-react';
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
      setError('Please choose a sanctuary.');
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
    <div className="booking-premium-card" id="booking-widget">
      {/* 1. Header & Dynamic Pricing */}
      <div className="booking-premium-card__header">
        <div className="price-tag animate-slide-up">
          <span className="price-tag__label">Sanctuary Rates After</span>
          <div className="price-tag__value">
            {selectedRoom ? formatCurrency(selectedRoom.price) : '---'}
            <span className="price-tag__unit"> / night</span>
          </div>
        </div>
        
        {hotel.averageRating > 0 && (
          <div className="rating-pill">
            <Sparkles size={14} className="text-luxury-gold" />
            <span className="rating-pill__value">{hotel.averageRating?.toFixed(1)}</span>
            <span className="rating-pill__count">({hotel.totalReviews || 0})</span>
          </div>
        )}
      </div>

      {/* 2. Feedback Messages */}
      {error && (
        <div className="feedback-message feedback-message--error animate-fade-in">
          <Info size={16} /> <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-premium-form font-sans">
        {/* 3. Integrated Stay Period Selector */}
        <div className="stay-period-selector">
          <div className="period-field">
            <span className="field-label">Check-in</span>
            <div className="date-input-wrapper">
              <Calendar size={16} className="field-icon" />
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                placeholderText="Arrival"
                className="premium-datepicker"
                dateFormat="MMM d, yyyy"
              />
            </div>
          </div>
          <div className="period-divider"></div>
          <div className="period-field">
            <span className="field-label">Check-out</span>
            <div className="date-input-wrapper">
              <Calendar size={16} className="field-icon" />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                placeholderText="Departure"
                className="premium-datepicker"
                dateFormat="MMM d, yyyy"
              />
            </div>
          </div>
        </div>

        {/* 4. Guest and Room Selectors */}
        <div className="selectors-grid">
          <div className="guest-selector-field">
            <span className="field-label">Residents</span>
            <div className="guest-control">
              <Users size={18} className="field-icon" />
              <div className="counter-controls">
                <button type="button" className="counter-btn" onClick={() => handleGuestChange(-1)} disabled={numGuests <= 1}>
                  <Minus size={14} />
                </button>
                <span className="counter-value">{numGuests}</span>
                <button type="button" className="counter-btn" onClick={() => handleGuestChange(1)} disabled={numGuests >= (selectedRoom?.capacity || 4)}>
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="room-selector-field">
            <span className="field-label">Sanctuary Type</span>
            <div className="room-select-trigger" onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}>
              <BedDouble size={18} className="field-icon" />
              <span className="selected-text">{selectedRoom ? selectedRoom.type : 'Choose Sanctuary'}</span>
              <ChevronDown size={16} className={`chevron-icon ${isRoomDropdownOpen ? 'open' : ''}`} />
            </div>

            {isRoomDropdownOpen && (
              <div className="room-nav-dropdown animate-dropdown">
                {rooms?.map(room => (
                  <div
                    key={room._id}
                    className={`nav-item ${selectedRoomId === room._id ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedRoomId(room._id);
                      setIsRoomDropdownOpen(false);
                      if (numGuests > room.capacity) setNumGuests(room.capacity);
                    }}
                  >
                    <div className="nav-item__info">
                      <span className="nav-item__name">{room.type}</span>
                      <span className="nav-item__meta">Upto {room.capacity} Residents</span>
                    </div>
                    <span className="nav-item__price">{formatCurrency(room.price)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 5. Pricing Summary */}
        {startDate && endDate && selectedRoom && (
          <div className="pricing-dynamic-summary animate-fade-in font-sans">
             <div className="summary-row">
                <span className="italic font-serif">Luxury Accommodation</span>
                <span>{formatCurrency(subtotal)}</span>
             </div>
             <div className="summary-row">
                <span className="italic font-serif">Service & Value Taxes (12%)</span>
                <span>{formatCurrency(taxes)}</span>
             </div>
             <div className="summary-divider"></div>
             <div className="summary-total">
                <span className="font-serif">Estimated Total</span>
                <span className="total-value">{formatCurrency(totalPrice)}</span>
             </div>
          </div>
        )}

        {/* 6. Primary Action */}
        <button type="submit" disabled={loading} className="reserve-action-btn font-sans">
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Finalizing Collection...</>
          ) : !localStorage.getItem('token') ? (
            <><CreditCard size={20} /> Unlock & Reserve</>
          ) : (
            <><Zap size={20} className="fill-white" /> Complete Reservation</>
          )}
        </button>

        {/* 7. Post-Action Trust Markers */}
        <div className="trust-footer">
          <div className="trust-item"><ShieldCheck size={14} className="text-emerald-500" /> <span>Encrypted Payment</span></div>
          <div className="trust-item"><CheckCircle size={14} className="text-emerald-500" /> <span>Instant Access</span></div>
        </div>
      </form>

      <style>{bookingFormStyles}</style>
    </div>
  );
};

const bookingFormStyles = `
  /* ── Modern Premium Variables ─────────────────────────────────────────── */
  :root {
    --p-bg: #ffffff;
    --p-accent: #c5a059; /* Luxury Gold */
    --p-accent-glow: rgba(197, 160, 89, 0.4);
    --p-text-main: #0f172a;
    --p-text-muted: #94a3b8;
    --p-border: #f1f5f9;
    --p-radius: 32px;
  }

  /* ── Container ─────────────────────────────────────────────────────────── */
  .booking-premium-card {
    background: #ffffff;
    border: 1px solid var(--p-border);
    border-radius: var(--p-radius);
    padding: 40px;
    box-shadow: 0 30px 60px -20px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 140px;
    transition: all 0.5s ease;
    z-index: 10;
  }
  .booking-premium-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.15);
  }

  /* ── Header ───────────────────────────────────────────────────────────── */
  .booking-premium-card__header {
    margin-bottom: 32px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .price-tag {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .price-tag__label {
    font-size: 0.6rem;
    font-weight: 900;
    color: var(--p-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
  .price-tag__value {
    font-size: 2.25rem;
    font-weight: 900;
    color: var(--p-text-main);
    letter-spacing: -0.04em;
    line-height: 1;
    font-family: 'Playfair Display', serif;
  }
  .price-tag__unit {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--p-text-muted);
  }

  .rating-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fdfaf3;
    padding: 10px 16px;
    border-radius: 100px;
    border: 1px solid rgba(197, 160, 89, 0.2);
  }
  .rating-pill__value {
    font-weight: 900;
    font-size: 0.95rem;
    color: var(--p-text-main);
  }
  .rating-pill__count {
    font-size: 0.8rem;
    color: var(--p-text-muted);
    font-weight: 600;
  }

  /* ── Form Elements ─────────────────────────────────────────────────────── */
  .booking-premium-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .field-label {
    display: block;
    font-size: 0.6rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--p-text-muted);
    margin-bottom: 10px;
    padding-left: 2px;
  }

  .stay-period-selector {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    background: #f8fafc;
    border: 1px solid var(--p-border);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .stay-period-selector:focus-within {
    border-color: var(--p-accent);
    background: #ffffff;
    box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1);
  }
  .period-field {
    padding: 16px 20px;
  }
  .period-divider {
    background: var(--p-border);
    width: 1px;
    align-self: center;
    height: 50%;
  }
  .date-input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .field-icon {
    color: var(--p-accent);
    opacity: 0.9;
  }
  .premium-datepicker {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-weight: 900;
    font-size: 0.9rem;
    color: var(--p-text-main);
    cursor: pointer;
  }

  .selectors-grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 16px;
  }

  .guest-control {
    background: #f8fafc;
    border: 1px solid var(--p-border);
    border-radius: 18px;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
  }
  .counter-controls {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .counter-btn {
    width: 32px;
    height: 32px;
    border-radius: 10px;
    border: 1px solid var(--p-border);
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--p-text-main);
  }
  .counter-btn:hover { border-color: var(--p-accent); color: var(--p-accent); }
  .counter-btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .counter-value { font-weight: 900; font-size: 1rem; min-width: 15px; text-align: center; }

  .room-select-trigger {
    background: #f8fafc;
    border: 1px solid var(--p-border);
    border-radius: 18px;
    padding: 14px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .room-select-trigger:hover { border-color: var(--p-accent); background: #ffffff; }
  .selected-text { flex: 1; font-weight: 800; font-size: 0.9rem; color: var(--p-text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  
  .room-nav-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    left: 0; right: 0;
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid var(--p-border);
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15);
    z-index: 50;
    overflow: hidden;
  }
  .nav-item { padding: 18px 24px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-bottom: 1px solid var(--p-border); }
  .nav-item:last-child { border-bottom: none; }
  .nav-item:hover { background: #fdfaf3; }
  .nav-item.is-active { background: #fdfaf3; border-left: 4px solid var(--p-accent); }
  .nav-item__name { font-weight: 900; font-size: 0.9rem; color: var(--p-text-main); }
  .nav-item__meta { font-size: 0.75rem; font-weight: 600; color: var(--p-text-muted); }
  .nav-item__price { font-weight: 900; color: var(--p-accent); font-size: 0.95rem; }

  /* ── Pricing Summary ───────────────────────────────────────────────────── */
  .pricing-dynamic-summary {
    background: #fdfaf3;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    border: 1px solid rgba(197, 160, 89, 0.1);
  }
  .summary-row { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: #64748b; }
  .summary-divider { height: 1px; background: rgba(197, 160, 89, 0.1); margin: 6px 0; }
  .summary-total { display: flex; justify-content: space-between; align-items: center; font-weight: 900; color: var(--p-text-main); }
  .total-value { font-size: 1.6rem; color: var(--p-text-main); letter-spacing: -0.04em; font-family: 'Playfair Display', serif; }

  /* ── Reserve Action ────────────────────────────────────────────────────── */
  .reserve-action-btn {
    width: 100%;
    height: 68px;
    background: var(--p-text-main);
    color: white;
    border: none;
    border-radius: 20px;
    font-size: 1rem;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    box-shadow: 0 15px 35px -10px rgba(0,0,0,0.3);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .reserve-action-btn:hover:not(:disabled) {
    background: var(--p-accent);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -10px rgba(197, 160, 89, 0.3);
  }

  .trust-footer { display: flex; justify-content: center; gap: 24px; margin-top: 10px; }
  .trust-item { display: flex; align-items: center; gap: 8px; font-size: 0.7rem; font-weight: 800; color: var(--p-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

  .feedback-message { padding: 16px 20px; border-radius: 14px; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .feedback-message--error { background: #fff1f2; border: 1px solid #fee2e2; color: #e11d48; }

  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.165, 0.84, 0.44, 1); }
  .animate-fade-in { animation: slideUp 0.5s ease-out; }
  .animate-dropdown { animation: slideUp 0.3s ease-out; }
`;

export default BookingForm;
