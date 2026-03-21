import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const HotelCard = ({ hotel }) => {
  return (
    <div className="glass-panel animate-fade" style={{ 
      borderRadius: '16px', 
      overflow: 'hidden', 
      boxShadow: 'var(--shadow-md)',
      transition: 'var(--transition)',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ position: 'relative', height: '220px' }}>
        <img 
          src={(hotel.images && hotel.images[0]) || hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
          alt={hotel.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ 
          position: 'absolute', 
          top: '12px', 
          right: '12px', 
          background: 'rgba(255,255,255,0.9)', 
          padding: '4px 8px', 
          borderRadius: '6px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          fontWeight: '600',
          fontSize: '0.8rem'
        }}>
          <Star size={14} fill="var(--accent)" color="var(--accent)" />
          {hotel.averageRating ? hotel.averageRating.toFixed(1) : '0.0'}
        </div>
      </div>

      <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
          <h3 className="luxury-font" style={{ fontSize: '1.25rem' }}>{hotel.name}</h3>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.1rem', display: 'block' }}>
              {formatCurrency(hotel.minPrice || hotel.pricePerNight || 0)}
            </span>
            <small style={{ fontWeight: '400', fontSize: '0.75rem', color: 'var(--text-muted)' }}>from /night</small>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <MapPin size={16} />
          {hotel.location || hotel.city}
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1 }}>
          {hotel.description ? (hotel.description.length > 100 ? hotel.description.substring(0, 100) + '...' : hotel.description) : 'Experience luxury and comfort in our premium suites.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <Users size={16} />
              {hotel.capacity || 2}+ 
            </div>
          </div>
          <Link to={`/hotel/${hotel._id || hotel.id}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            View Details
          </Link>
        </div>
      </div>

      <style>{`
        .glass-panel:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
};

export default HotelCard;
