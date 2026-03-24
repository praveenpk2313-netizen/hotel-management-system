import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Mail, 
  Hotel,
  Clock,
  Users,
  CreditCard,
  Copy,
  ExternalLink
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  const emailSent = booking?.emailSent === true;

  useEffect(() => {
    if (!booking) {
      navigate('/customer/dashboard');
    }
    window.scrollTo(0, 0);
  }, [booking, navigate]);

  if (!booking) return null;

  const bookingRef = booking._id.substring(booking._id.length - 8).toUpperCase();
  const nights = Math.ceil(Math.abs(new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24));

  const copyBookingId = () => {
    navigator.clipboard.writeText(bookingRef);
  };

  return (
    <div className="bsuccess animate-fade">
      <div className="bsuccess__container">
        
        {/* ── Success Hero ────────────────────────────────────────── */}
        <div className="bsuccess__hero">
          <div className="bsuccess__check-ring">
            <div className="bsuccess__check-inner">
              <CheckCircle size={48} color="#059669" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="bsuccess__heading">Booking Confirmed!</h1>
          <p className="bsuccess__subheading">
            Your reservation at <strong>{booking.hotelName}</strong> is confirmed.
            {emailSent
              ? ' A confirmation has been sent to your email.'
              : ' You can view details in your dashboard.'}
          </p>
        </div>

        {/* ── Main Card ───────────────────────────────────────────── */}
        <div className="bsuccess__card">

          {/* Booking ID Bar */}
          <div className="bsuccess__id-bar">
            <div className="bsuccess__id-left">
              <span className="bsuccess__id-label">Booking Reference</span>
              <span className="bsuccess__id-value">#{bookingRef}</span>
            </div>
            <button className="bsuccess__copy-btn" onClick={copyBookingId} title="Copy ID">
              <Copy size={16} /> Copy
            </button>
          </div>

          {/* Card Content */}
          <div className="bsuccess__body">
            <div className="bsuccess__grid">
              
              {/* Left: Hotel Info */}
              <div className="bsuccess__info-section">
                <div className="bsuccess__section-header">
                  <Hotel size={20} color="var(--primary)" />
                  <h3>Property Details</h3>
                </div>
                <div className="bsuccess__hotel-name">{booking.hotelName}</div>
                <div className="bsuccess__hotel-location">
                  <MapPin size={15} /> {booking.location}
                </div>
                <div className="bsuccess__room-badge">{booking.roomType}</div>
              </div>

              {/* Right: Stay Summary */}
              <div className="bsuccess__summary-section">
                {/* Dates */}
                <div className="bsuccess__detail-block">
                  <div className="bsuccess__detail-row">
                    <div className="bsuccess__detail-icon"><Calendar size={16} /></div>
                    <div>
                      <div className="bsuccess__detail-label">Check-in</div>
                      <div className="bsuccess__detail-value">{formatDate(booking.checkInDate)}</div>
                    </div>
                  </div>
                  <div className="bsuccess__detail-arrow">→</div>
                  <div className="bsuccess__detail-row">
                    <div className="bsuccess__detail-icon"><Calendar size={16} /></div>
                    <div>
                      <div className="bsuccess__detail-label">Check-out</div>
                      <div className="bsuccess__detail-value">{formatDate(booking.checkOutDate)}</div>
                    </div>
                  </div>
                </div>

                <div className="bsuccess__divider"></div>

                {/* Duration & Price */}
                <div className="bsuccess__meta-row">
                  <div className="bsuccess__meta-item">
                    <Clock size={16} />
                    <span>{nights} Night{nights > 1 ? 's' : ''}</span>
                  </div>
                  <div className="bsuccess__meta-item">
                    <Users size={16} />
                    <span>{booking.numGuests || 1} Guest{(booking.numGuests || 1) > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="bsuccess__divider"></div>

                {/* Total */}
                <div className="bsuccess__total-row">
                  <span className="bsuccess__total-label">Amount Paid</span>
                  <span className="bsuccess__total-value">{formatCurrency(booking.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Email Alert */}
            <div className={`bsuccess__alert ${emailSent ? 'bsuccess__alert--success' : 'bsuccess__alert--warning'}`}>
              <Mail size={20} />
              <p>
                {emailSent
                  ? 'A confirmation email with your invoice has been sent. Check your spam folder if you don\'t see it within 5 minutes.'
                  : 'Your booking is confirmed. Email delivery is pending — your details are saved and accessible from your dashboard.'}
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────────── */}
        <div className="bsuccess__actions">
          <button 
            onClick={() => navigate('/customer/dashboard')}
            className="bsuccess__btn bsuccess__btn--primary"
          >
            View My Bookings <ArrowRight size={18} />
          </button>
          <Link to="/hotels" className="bsuccess__btn bsuccess__btn--secondary">
            <ExternalLink size={18} /> Browse More Hotels
          </Link>
        </div>

      </div>

      <style>{successStyles}</style>
    </div>
  );
};

const successStyles = `
  /* ── Page ───────────────────────────────────────────────────────────────── */
  .bsuccess {
    background: #f7f7f7;
    min-height: 100vh;
    padding: 3rem 1rem 5rem;
  }
  .bsuccess__container {
    max-width: 780px;
    margin: 0 auto;
  }

  /* ── Hero ───────────────────────────────────────────────────────────────── */
  .bsuccess__hero {
    text-align: center;
    margin-bottom: 2.5rem;
  }
  .bsuccess__check-ring {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    animation: checkPulse 2s ease-in-out infinite;
  }
  @keyframes checkPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(5, 150, 105, 0.15); }
    50% { box-shadow: 0 0 0 16px rgba(5, 150, 105, 0); }
  }
  .bsuccess__check-inner {
    animation: checkBounce 0.6s ease-out;
  }
  @keyframes checkBounce {
    0% { transform: scale(0); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  .bsuccess__heading {
    font-size: 2.5rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 0.75rem 0;
    font-family: 'Playfair Display', serif;
  }
  .bsuccess__subheading {
    color: #6b7280;
    font-size: 1.05rem;
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.6;
  }

  /* ── Card ───────────────────────────────────────────────────────────────── */
  .bsuccess__card {
    background: white;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    margin-bottom: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  }

  /* ── ID Bar ────────────────────────────────────────────────────────────── */
  .bsuccess__id-bar {
    background: #0f172a;
    color: white;
    padding: 16px 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bsuccess__id-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .bsuccess__id-label {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
  }
  .bsuccess__id-value {
    font-size: 1rem;
    font-weight: 700;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }
  .bsuccess__copy-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'Outfit', sans-serif;
  }
  .bsuccess__copy-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  /* ── Body ───────────────────────────────────────────────────────────────── */
  .bsuccess__body {
    padding: 32px 28px;
  }

  /* ── Grid ───────────────────────────────────────────────────────────────── */
  .bsuccess__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  /* ── Info Section ──────────────────────────────────────────────────────── */
  .bsuccess__section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
  }
  .bsuccess__section-header h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    font-family: 'Playfair Display', serif;
  }
  .bsuccess__hotel-name {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 6px;
  }
  .bsuccess__hotel-location {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.88rem;
    color: #6b7280;
    margin-bottom: 14px;
  }
  .bsuccess__room-badge {
    display: inline-block;
    background: rgba(197, 160, 89, 0.1);
    color: var(--primary);
    padding: 6px 16px;
    border-radius: 8px;
    font-size: 0.82rem;
    font-weight: 700;
  }

  /* ── Summary Section ───────────────────────────────────────────────────── */
  .bsuccess__summary-section {
    background: #f9fafb;
    padding: 24px;
    border-radius: 16px;
  }
  .bsuccess__detail-block {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .bsuccess__detail-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
  }
  .bsuccess__detail-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary);
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  }
  .bsuccess__detail-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #9ca3af;
    margin-bottom: 1px;
  }
  .bsuccess__detail-value {
    font-size: 0.85rem;
    font-weight: 700;
    color: #0f172a;
  }
  .bsuccess__detail-arrow {
    color: #d1d5db;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .bsuccess__divider {
    height: 1px;
    background: #e5e7eb;
    margin: 16px 0;
  }

  .bsuccess__meta-row {
    display: flex;
    gap: 24px;
  }
  .bsuccess__meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.88rem;
    font-weight: 600;
    color: #4b5563;
  }
  .bsuccess__meta-item svg {
    color: #9ca3af;
  }

  .bsuccess__total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bsuccess__total-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #6b7280;
  }
  .bsuccess__total-value {
    font-size: 1.35rem;
    font-weight: 900;
    color: #0f172a;
  }

  /* ── Alert ──────────────────────────────────────────────────────────────── */
  .bsuccess__alert {
    margin-top: 28px;
    padding: 16px 20px;
    border-radius: 14px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .bsuccess__alert svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
  .bsuccess__alert p {
    margin: 0;
    font-size: 0.88rem;
    line-height: 1.5;
  }
  .bsuccess__alert--success {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #065f46;
  }
  .bsuccess__alert--success svg {
    color: #059669;
  }
  .bsuccess__alert--warning {
    background: #fffbeb;
    border: 1px solid #fde68a;
    color: #92400e;
  }
  .bsuccess__alert--warning svg {
    color: #f59e0b;
  }

  /* ── Actions ───────────────────────────────────────────────────────────── */
  .bsuccess__actions {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .bsuccess__btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 16px 28px;
    border-radius: 14px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Outfit', sans-serif;
    text-decoration: none;
    border: none;
  }
  .bsuccess__btn--primary {
    background: linear-gradient(135deg, #c5a059 0%, #d4b06a 50%, #c5a059 100%);
    background-size: 200% auto;
    color: white;
    box-shadow: 0 4px 16px rgba(197, 160, 89, 0.35);
  }
  .bsuccess__btn--primary:hover {
    background-position: right center;
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(197, 160, 89, 0.45);
  }
  .bsuccess__btn--secondary {
    background: white;
    color: #0f172a;
    border: 1px solid #e5e7eb;
  }
  .bsuccess__btn--secondary:hover {
    background: #f9fafb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  /* ── Responsive ────────────────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .bsuccess {
      padding: 2rem 1rem 4rem;
    }
    .bsuccess__heading {
      font-size: 2rem;
    }
    .bsuccess__grid {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .bsuccess__id-bar {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding: 16px 20px;
    }
    .bsuccess__body {
      padding: 24px 20px;
    }
    .bsuccess__detail-block {
      flex-direction: column;
      align-items: stretch;
    }
    .bsuccess__detail-arrow {
      text-align: center;
      transform: rotate(90deg);
    }
    .bsuccess__actions {
      flex-direction: column;
    }
    .bsuccess__btn {
      justify-content: center;
      width: 100%;
    }
  }
`;

export default BookingSuccess;
