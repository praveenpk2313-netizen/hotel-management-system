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

  // Auto-select first room if available
  useEffect(() => {
    if (rooms && rooms.length > 0 && !selectedRoomId) {
      const firstAvailable = rooms.find(r => r.isAvailable) || rooms[0];
      setSelectedRoomId(firstAvailable._id);
    }
  }, [rooms, selectedRoomId]);

  // Sync with props if they change
  useEffect(() => {
    if (initialError) setError(initialError);
  }, [initialError]);

  // Sync with props if they change
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

  // Calculate nights and total
  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const nights = calculateNights();
  const subtotal = selectedRoom ? nights * selectedRoom.price : 0;
  const taxes = subtotal * 0.12; // 12% taxes
  const totalPrice = subtotal + taxes;

  const handleGuestChange = (delta) => {
    const maxCapacity = selectedRoom?.capacity || 4;
    setNumGuests(prev => Math.max(1, Math.min(maxCapacity, prev + delta)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Check-in and check-out dates are required.');
      return;
    }
    if (!selectedRoomId) {
      setError('Please choose a preferred room type.');
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
          <span className="price-tag__label">Prices from</span>
          <div className="price-tag__value">
            {selectedRoom ? formatCurrency(selectedRoom.price) : '---'}
            <span className="price-tag__unit"> / night</span>
          </div>
        </div>
        
        {hotel.averageRating > 0 && (
          <div className="rating-pill">
            <Sparkles size={14} className="text-amber-500" />
            <span className="rating-pill__value">{hotel.averageRating?.toFixed(1)}</span>
            <span className="rating-pill__count">({hotel.totalReviews || 0} reviews)</span>
          </div>
        )}
      </div>

      {/* 2. Feedback Messages */}
      {error && (
        <div className="feedback-message feedback-message--error animate-fade-in">
          <Info size={16} /> <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-premium-form">
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
                placeholderText="Add date"
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
                placeholderText="Add date"
                className="premium-datepicker"
                dateFormat="MMM d, yyyy"
              />
            </div>
          </div>
        </div>

        {/* 4. Guest and Room Selectors */}
        <div className="selectors-grid">
          <div className="guest-selector-field">
            <span className="field-label">Guests</span>
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
            <span className="field-label">Room Type</span>
            <div className="room-select-trigger" onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}>
              <BedDouble size={18} className="field-icon" />
              <span className="selected-text">{selectedRoom ? selectedRoom.type : 'Select Room'}</span>
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
                      <span className="nav-item__meta">Up to {room.capacity} guests</span>
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
          <div className="pricing-dynamic-summary animate-fade-in">
             <div className="summary-row">
               <span>{formatCurrency(selectedRoom.price)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
               <span>{formatCurrency(subtotal)}</span>
             </div>
             <div className="summary-row">
               <span>Taxes and fees (12%)</span>
               <span>{formatCurrency(taxes)}</span>
             </div>
             <div className="summary-divider"></div>
             <div className="summary-total">
               <span>Total amount</span>
               <span className="total-value">{formatCurrency(totalPrice)}</span>
             </div>
          </div>
        )}

        {/* 6. Primary Action */}
        <button type="submit" disabled={loading} className="reserve-action-btn">
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Securing your stay...</>
          ) : !localStorage.getItem('token') ? (
            <><CreditCard size={20} /> Login & Reserve</>
          ) : (
            <><Zap size={20} className="fill-white" /> Reserve Your Suite</>
          )}
        </button>

        {/* 7. Post-Action Trust Markers */}
        <div className="trust-footer">
          <div className="trust-item"><ShieldCheck size={14} /> <span>Secure Payment</span></div>
          <div className="trust-item"><CheckCircle size={14} /> <span>Instant confirmation</span></div>
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
    --p-accent: #0284c7; /* Sky 600 */
    --p-accent-glow: rgba(2, 132, 199, 0.4);
    --p-text-main: #0f172a;
    --p-text-muted: #64748b;
    --p-border: #e2e8f0;
    --p-radius: 24px;
    --p-font: 'Outfit', 'Inter', sans-serif;
  }

  /* ── Container ─────────────────────────────────────────────────────────── */
  .booking-premium-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid var(--p-border);
    border-radius: var(--p-radius);
    padding: 32px;
    box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.08);
    position: sticky;
    top: 120px;
    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
    z-index: 10;
  }
  .booking-premium-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 25px 60px -12px rgba(0, 0, 0, 0.12);
    border-color: var(--p-accent-glow);
  }

  /* ── Header ───────────────────────────────────────────────────────────── */
  .booking-premium-card__header {
    margin-bottom: 28px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .price-tag {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .price-tag__label {
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--p-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .price-tag__value {
    font-size: 2.25rem;
    font-weight: 900;
    color: var(--p-text-main);
    letter-spacing: -0.02em;
    line-height: 1;
  }
  .price-tag__unit {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--p-text-muted);
  }

  .rating-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: #f8fafc;
    padding: 8px 14px;
    border-radius: 100px;
    border: 1px solid var(--p-border);
  }
  .rating-pill__value {
    font-weight: 800;
    font-size: 0.95rem;
    color: var(--p-text-main);
  }
  .rating-pill__count {
    font-size: 0.8rem;
    color: var(--p-text-muted);
    font-weight: 500;
  }

  /* ── Form Elements ─────────────────────────────────────────────────────── */
  .booking-premium-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .field-label {
    display: block;
    font-size: 0.65rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--p-text-muted);
    margin-bottom: 8px;
    padding-left: 4px;
  }

  /* Stay Period Integrated */
  .stay-period-selector {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    background: #f8fafc;
    border: 1px solid var(--p-border);
    border-radius: 16px;
    overflow: hidden;
    transition: all 0.2s ease;
  }
  .stay-period-selector:focus-within {
    border-color: var(--p-accent);
    background: #ffffff;
    box-shadow: 0 0 0 4px var(--p-accent-glow);
  }
  .period-field {
    padding: 14px 18px;
  }
  .period-divider {
    background: var(--p-border);
    width: 1px;
    align-self: center;
    height: 60%;
  }
  .date-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .field-icon {
    color: var(--p-accent);
    opacity: 0.8;
  }
  .premium-datepicker {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--p-text-main);
    cursor: pointer;
    font-family: var(--p-font);
  }

  /* Selectors Grid */
  .selectors-grid {
    display: grid;
    grid-template-columns: 1.2fr 2fr;
    gap: 16px;
  }

  .guest-control {
    background: #f8fafc;
    border: 1px solid var(--p-border);
    border-radius: 16px;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: space-between;
  }
  .counter-controls {
    display: flex;
    align-items: center;
    gap: 10px;
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
  .counter-btn:hover:not(:disabled) {
    border-color: var(--p-accent);
    color: var(--p-accent);
    transform: scale(1.05);
  }
  .counter-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .counter-value {
    font-weight: 800;
    font-size: 1rem;
    min-width: 15px;
    text-align: center;
  }

  .room-selector-field {
    position: relative;
  }
  .room-select-trigger {
    background: #f8fafc;
    border: 1px solid var(--p-border);
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .room-select-trigger:hover {
    border-color: var(--p-accent);
    background: white;
  }
  .selected-text {
    flex: 1;
    font-weight: 700;
    font-size: 0.95rem;
    color: var(--p-text-main);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .chevron-icon {
    transition: transform 0.3s ease;
    color: var(--p-text-muted);
  }
  .chevron-icon.open {
    transform: rotate(180deg);
  }

  /* Dropdown Nav */
  .room-nav-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: white;
    border-radius: 16px;
    border: 1px solid var(--p-border);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
    z-index: 50;
    overflow: hidden;
  }
  .nav-item {
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 1px solid var(--p-border);
  }
  .nav-item:last-child {
    border-bottom: none;
  }
  .nav-item:hover {
    background: #f0f9ff;
  }
  .nav-item.is-active {
    background: #e0f2fe;
    border-left: 4px solid var(--p-accent);
  }
  .nav-item__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .nav-item__name {
    font-weight: 800;
    font-size: 0.9rem;
    color: var(--p-text-main);
  }
  .nav-item__meta {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--p-text-muted);
  }
  .nav-item__price {
    font-weight: 800;
    color: var(--p-accent);
    font-size: 0.9rem;
  }

  /* ── Pricing Summary ───────────────────────────────────────────────────── */
  .pricing-dynamic-summary {
    background: #f8fafc;
    border-radius: 16px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .summary-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--p-text-muted);
  }
  .summary-divider {
    height: 1px;
    background: var(--p-border);
    margin: 4px 0;
  }
  .summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 800;
    color: var(--p-text-main);
    font-size: 1rem;
  }
  .total-value {
    font-size: 1.4rem;
    letter-spacing: -0.02em;
  }

  /* ── Reserve Action ────────────────────────────────────────────────────── */
  .reserve-action-btn {
    width: 100%;
    height: 64px;
    background: var(--p-accent);
    color: white;
    border: none;
    border-radius: 16px;
    font-size: 1.15rem;
    font-weight: 900;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 25px -5px var(--p-accent-glow);
    font-family: var(--p-font);
  }
  .reserve-action-btn:hover:not(:disabled) {
    background: #0ea5e9;
    transform: translateY(-2px);
    box-shadow: 0 15px 30px -5px var(--p-accent-glow);
  }
  .reserve-action-btn:active:not(:disabled) {
    transform: scale(0.98);
  }
  .reserve-action-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    filter: grayscale(0.5);
  }

  /* ── Footer Trust ──────────────────────────────────────────────────────── */
  .trust-footer {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 8px;
  }
  .trust-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--p-text-muted);
    opacity: 0.8;
  }

  /* ── Feedback ──────────────────────────────────────────────────────────── */
  .feedback-message {
    padding: 14px 18px;
    border-radius: 12px;
    font-size: 0.85rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  .feedback-message--error {
    background: #fef2f2;
    border: 1px solid #fee2e2;
    color: #ef4444;
  }

  /* ── Animations ────────────────────────────────────────────────────────── */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-up {
    animation: slideUp 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  @keyframes dropdown {
    from { opacity: 0; transform: translateY(-10px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-dropdown {
    animation: dropdown 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  /* Responsive Tweaks */
  @media (max-width: 640px) {
    .selectors-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default BookingForm;

