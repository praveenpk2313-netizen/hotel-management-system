import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Mail, 
  Download,
  Hotel 
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const BookingSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};

  useEffect(() => {
    // Redirect if direct access without booking data
    if (!booking) {
      navigate('/customer/dashboard');
    }
    // Scroll to top
    window.scrollTo(0, 0);
  }, [booking, navigate]);

  if (!booking) return null;

  return (
    <div className="animate-fade" style={{ background: '#fdfcfb', minHeight: '100vh', padding: '4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            background: '#ecfdf5', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem',
            boxShadow: '0 20px 40px rgba(16, 185, 129, 0.1)'
          }}>
            <CheckCircle size={56} color="#10b981" />
          </div>
          <h1 className="luxury-font" style={{ fontSize: '3.5rem', color: '#0f172a', marginBottom: '1rem' }}>Booking Confirmed!</h1>
          <p style={{ color: '#64748b', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Your reservation at <strong>{booking.hotelName}</strong> is verified. 
            A professional confirmation invoice has been dispatched to your registered email.
          </p>
        </div>

        {/* Booking Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '32px', 
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)', 
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          marginBottom: '3rem'
        }}>
          {/* Status Banner */}
          <div style={{ background: '#0f172a', color: 'white', padding: '1.5rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8 }}>Booking ID</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>#{booking._id.substring(booking._id.length - 8).toUpperCase()}</div>
          </div>

          <div style={{ padding: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
              
              {/* Hotel Info */}
              <div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <Hotel size={24} color="var(--primary)" /> Reservation Details
                </h3>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.1rem' }}>{booking.hotelName}</div>
                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                    <MapPin size={16} /> {booking.location}
                  </div>
                </div>
                <div>
                   <span style={{ 
                     background: 'rgba(197, 160, 89, 0.1)', 
                     color: 'var(--primary)', 
                     padding: '0.4rem 1rem', 
                     borderRadius: '8px',
                     fontSize: '0.85rem',
                     fontWeight: '700'
                   }}>
                     {booking.roomType}
                   </span>
                </div>
              </div>

              {/* Summary Items */}
              <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '24px' }}>
                 <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Stay Duration</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: '700' }}>
                       <Calendar size={18} color="var(--primary)" />
                       {formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}
                    </div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
                    <div style={{ color: '#94a3b8', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>Total Paid</div>
                    <div style={{ color: '#0f172a', fontSize: '1.4rem', fontWeight: '900' }}>{formatCurrency(booking.totalPrice)}</div>
                 </div>
              </div>
            </div>

            {/* Confirmation Alert */}
            <div style={{ 
              marginTop: '3rem', 
              padding: '1.5rem', 
              background: 'rgba(16, 185, 129, 0.05)', 
              borderRadius: '20px', 
              border: '1px solid rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
               <Mail size={24} color="#10b981" />
               <p style={{ margin: 0, color: '#065f46', fontSize: '0.95rem' }}>
                 A confirmation email has been sent to your inbox. Please check your spam folder if you don't see it within 5 minutes.
               </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
          <button 
            onClick={() => navigate('/customer/dashboard')}
            style={{ 
              background: '#0f172a', 
              color: 'white', 
              padding: '1.25rem 2.5rem', 
              borderRadius: '16px', 
              fontWeight: '700', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: '0.3s'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Manage My Booking <ArrowRight size={20} />
          </button>
          
          <Link 
            to="/hotels"
            style={{ 
              background: 'white', 
              color: '#0f172a', 
              padding: '1.25rem 2.5rem', 
              borderRadius: '16px', 
              fontWeight: '700', 
              border: '1px solid #e2e8f0', 
              textDecoration: 'none',
              transition: '0.3s'
            }}
          >
            Back to Hotels
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BookingSuccess;
