import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, Users, Loader2, Info, Moon, ChevronDown, Minus, Plus, BedDouble, Sparkles } from 'lucide-react';
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
  const [isRoomDropdownOpen, setIsRoomDropdownOpen] = useState(false);

  // Auto-select first room if available
  useEffect(() => {
    if (rooms && rooms.length > 0 && !selectedRoomId) {
      const firstAvailable = rooms.find(r => r.isAvailable) || rooms[0];
      setSelectedRoomId(firstAvailable._id);
    }
  }, [rooms, selectedRoomId]);

  const selectedRoom = rooms?.find(r => r._id === selectedRoomId);

  // Calculate nights and total
  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    return Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();
  const subtotal = selectedRoom ? nights * selectedRoom.price : 0;
  const serviceFee = 0; // Complimentary
  const totalPrice = subtotal + serviceFee;

  const handleGuestChange = (delta) => {
    const maxCapacity = selectedRoom?.capacity || 4;
    setNumGuests(prev => Math.max(1, Math.min(maxCapacity, prev + delta)));
  };

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
    <div className="booking-card">
      {/* Header with price */}
      <div className="booking-card__header">
        <div className="booking-card__price-row">
          <div>
            <span className="booking-card__price">
              {selectedRoom ? formatCurrency(selectedRoom.price) : '---'}
            </span>
            <span className="booking-card__price-unit"> / night</span>
          </div>
          {hotel.averageRating > 0 && (
            <div className="booking-card__rating">
              <span className="booking-card__star">★</span>
              <span>{hotel.averageRating?.toFixed(1)}</span>
              <span className="booking-card__reviews">({hotel.totalReviews || 0})</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="booking-card__error">
          <Info size={16} /> <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Date Picker Section - Airbnb Style */}
        <div className="booking-card__dates">
          <div className="booking-card__date-field">
            <label className="booking-card__label">CHECK-IN</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Add date"
              className="booking-datepicker"
              dateFormat="MMM d, yyyy"
            />
          </div>
          <div className="booking-card__date-divider"></div>
          <div className="booking-card__date-field">
            <label className="booking-card__label">CHECK-OUT</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Add date"
              className="booking-datepicker"
              dateFormat="MMM d, yyyy"
            />
          </div>
        </div>

        {/* Room Type */}
        <div className="booking-card__field-group">
          <div className="booking-card__select-field" onClick={() => setIsRoomDropdownOpen(!isRoomDropdownOpen)}>
            <label className="booking-card__label">ROOM TYPE</label>
            <div className="booking-card__select-display">
              <BedDouble size={16} className="booking-card__field-icon" />
              <span>{selectedRoom ? `${selectedRoom.type} (${selectedRoom.capacity} guests)` : 'Select room'}</span>
              <ChevronDown size={16} className={`booking-card__chevron ${isRoomDropdownOpen ? 'open' : ''}`} />
            </div>
          </div>
          {isRoomDropdownOpen && (
            <div className="booking-card__dropdown">
              {rooms?.map(room => (
                <div
                  key={room._id}
                  className={`booking-card__dropdown-item ${selectedRoomId === room._id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedRoomId(room._id);
                    setIsRoomDropdownOpen(false);
                    if (numGuests > room.capacity) setNumGuests(room.capacity);
                  }}
                >
                  <div className="booking-card__dropdown-info">
                    <span className="booking-card__dropdown-title">{room.type}</span>
                    <span className="booking-card__dropdown-meta">Up to {room.capacity} guests • {room.totalRooms} available</span>
                  </div>
                  <span className="booking-card__dropdown-price">{formatCurrency(room.price)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guests */}
        <div className="booking-card__guests-field">
          <label className="booking-card__label">GUESTS</label>
          <div className="booking-card__guests-control">
            <Users size={16} className="booking-card__field-icon" />
            <span className="booking-card__guests-text">
              {numGuests} Guest{numGuests > 1 ? 's' : ''}
            </span>
            <div className="booking-card__guests-buttons">
              <button type="button" className="booking-card__guest-btn" onClick={() => handleGuestChange(-1)} disabled={numGuests <= 1}>
                <Minus size={14} />
              </button>
              <span className="booking-card__guest-count">{numGuests}</span>
              <button type="button" className="booking-card__guest-btn" onClick={() => handleGuestChange(1)} disabled={numGuests >= (selectedRoom?.capacity || 4)}>
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="booking-card__submit">
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Redirecting...</>
          ) : !localStorage.getItem('token') ? (
            <><CreditCard size={20} /> Login to Reserve</>
          ) : (
            <><Sparkles size={20} /> Reserve Now</>
          )}
        </button>

        {/* Price Breakdown */}
        {totalPrice > 0 && (
          <div className="booking-card__breakdown">
            <div className="booking-card__breakdown-row">
              <span className="booking-card__breakdown-label">
                {formatCurrency(selectedRoom?.price)} × {nights} night{nights > 1 ? 's' : ''}
              </span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="booking-card__breakdown-row booking-card__breakdown-row--green">
              <span className="booking-card__breakdown-label">Service fee</span>
              <span>Free</span>
            </div>
            <div className="booking-card__breakdown-total">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}

        {/* Bottom Note */}
        <p className="booking-card__note">
          {!localStorage.getItem('token')
            ? 'Login required to complete your reservation.'
            : "You won't be charged until you confirm on the next page."}
        </p>
      </form>

      <style>{bookingFormStyles}</style>
    </div>
  );
};

const bookingFormStyles = `
  /* ── Booking Card Container ───────────────────────────────────────────── */
  .booking-card {
    background: #ffffff;
    border-radius: 16px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    padding: 28px;
    position: sticky;
    top: 100px;
    transition: box-shadow 0.3s ease;
  }
  .booking-card:hover {
    box-shadow: 0 6px 28px rgba(0, 0, 0, 0.12);
  }

  /* ── Header ───────────────────────────────────────────────────────────── */
  .booking-card__header {
    margin-bottom: 24px;
  }
  .booking-card__price-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .booking-card__price {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    font-family: 'Outfit', sans-serif;
  }
  .booking-card__price-unit {
    font-size: 0.95rem;
    font-weight: 400;
    color: #6b7280;
  }
  .booking-card__rating {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.9rem;
    font-weight: 600;
    color: #0f172a;
  }
  .booking-card__star {
    color: var(--primary);
    font-size: 1rem;
  }
  .booking-card__reviews {
    color: #6b7280;
    font-weight: 400;
    text-decoration: underline;
    cursor: pointer;
  }

  /* ── Error ─────────────────────────────────────────────────────────────── */
  .booking-card__error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 0.85rem;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  /* ── Date Picker Section ───────────────────────────────────────────────── */
  .booking-card__dates {
    display: grid;
    grid-template-columns: 1fr 1px 1fr;
    border: 1px solid #b0b0b0;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 0;
    transition: border-color 0.2s;
  }
  .booking-card__dates:focus-within {
    border-color: #0f172a;
    box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.06);
  }
  .booking-card__date-field {
    padding: 12px 14px;
    cursor: pointer;
  }
  .booking-card__date-divider {
    background: #b0b0b0;
    width: 1px;
  }
  .booking-card__label {
    display: block;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: #0f172a;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .booking-datepicker {
    width: 100%;
    border: none;
    outline: none;
    font-size: 0.88rem;
    color: #0f172a;
    cursor: pointer;
    background: transparent;
    font-family: 'Outfit', sans-serif;
    font-weight: 500;
  }
  .booking-datepicker::placeholder {
    color: #9ca3af;
    font-weight: 400;
  }
  .react-datepicker-wrapper { width: 100%; }

  /* ── Room Type Select ──────────────────────────────────────────────────── */
  .booking-card__field-group {
    position: relative;
  }
  .booking-card__select-field {
    border: 1px solid #b0b0b0;
    border-top: none;
    border-radius: 0 0 12px 12px;
    padding: 12px 14px;
    cursor: pointer;
    transition: border-color 0.2s;
    margin-bottom: 12px;
  }
  .booking-card__select-field:hover {
    border-color: #0f172a;
  }
  .booking-card__select-display {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.88rem;
    font-weight: 500;
    color: #0f172a;
  }
  .booking-card__field-icon {
    color: #9ca3af;
    flex-shrink: 0;
  }
  .booking-card__chevron {
    margin-left: auto;
    color: #6b7280;
    transition: transform 0.25s ease;
  }
  .booking-card__chevron.open {
    transform: rotate(180deg);
  }

  /* ── Dropdown ──────────────────────────────────────────────────────────── */
  .booking-card__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    z-index: 50;
    overflow: hidden;
    animation: dropdownFadeIn 0.2s ease;
  }
  @keyframes dropdownFadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .booking-card__dropdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 16px;
    cursor: pointer;
    transition: background 0.15s;
    border-bottom: 1px solid #f3f4f6;
  }
  .booking-card__dropdown-item:last-child {
    border-bottom: none;
  }
  .booking-card__dropdown-item:hover {
    background: #f9fafb;
  }
  .booking-card__dropdown-item.active {
    background: rgba(197, 160, 89, 0.06);
    border-left: 3px solid var(--primary);
  }
  .booking-card__dropdown-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .booking-card__dropdown-title {
    font-weight: 600;
    font-size: 0.9rem;
    color: #0f172a;
  }
  .booking-card__dropdown-meta {
    font-size: 0.78rem;
    color: #9ca3af;
  }
  .booking-card__dropdown-price {
    font-weight: 700;
    color: var(--primary);
    font-size: 0.9rem;
  }

  /* ── Guests ────────────────────────────────────────────────────────────── */
  .booking-card__guests-field {
    border: 1px solid #b0b0b0;
    border-radius: 12px;
    padding: 12px 14px;
    margin-bottom: 16px;
    transition: border-color 0.2s;
  }
  .booking-card__guests-field:hover {
    border-color: #0f172a;
  }
  .booking-card__guests-control {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .booking-card__guests-text {
    font-size: 0.88rem;
    font-weight: 500;
    color: #0f172a;
    flex: 1;
  }
  .booking-card__guests-buttons {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .booking-card__guest-btn {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1.5px solid #b0b0b0;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #374151;
    transition: all 0.15s;
  }
  .booking-card__guest-btn:hover:not(:disabled) {
    border-color: #0f172a;
    color: #0f172a;
  }
  .booking-card__guest-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  .booking-card__guest-count {
    font-weight: 600;
    font-size: 0.95rem;
    min-width: 20px;
    text-align: center;
    color: #0f172a;
  }

  /* ── Submit Button ─────────────────────────────────────────────────────── */
  .booking-card__submit {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #c5a059 0%, #d4b06a 50%, #c5a059 100%);
    background-size: 200% auto;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.05rem;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px rgba(197, 160, 89, 0.35);
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.01em;
  }
  .booking-card__submit:hover:not(:disabled) {
    background-position: right center;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(197, 160, 89, 0.45);
  }
  .booking-card__submit:active:not(:disabled) {
    transform: translateY(0);
  }
  .booking-card__submit:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* ── Price Breakdown ───────────────────────────────────────────────────── */
  .booking-card__breakdown {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #f3f4f6;
  }
  .booking-card__breakdown-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 0.9rem;
    color: #4b5563;
  }
  .booking-card__breakdown-label {
    text-decoration: underline;
    cursor: help;
  }
  .booking-card__breakdown-row--green {
    color: #059669;
  }
  .booking-card__breakdown-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #e5e7eb;
    margin-top: 4px;
    font-size: 1.05rem;
    font-weight: 700;
    color: #0f172a;
  }

  /* ── Bottom Note ───────────────────────────────────────────────────────── */
  .booking-card__note {
    text-align: center;
    font-size: 0.82rem;
    color: #9ca3af;
    margin: 16px 0 0 0;
    line-height: 1.4;
  }
`;

export default BookingForm;
