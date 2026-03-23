import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, Heart } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

const HotelCard = ({ hotel }) => {
  return (
    <Link 
      to={`/hotel/${hotel._id || hotel.id}`} 
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="hotel-card-main" style={{ 
        borderRadius: '24px', 
        overflow: 'hidden', 
        display: 'flex',
        flexDirection: 'column',
        transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        background: '#ffffff',
        height: '100%',
        position: 'relative'
      }}>
        
        {/* Wishlist Button */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 5, padding: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
           <Heart size={18} color="#0f172a" />
        </div>

        <div style={{ position: 'relative', height: '300px', overflow: 'hidden', borderRadius: '24px' }}>
          <img 
            src={(hotel.images && hotel.images[0]) || hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} 
            alt={hotel.name} 
            className="card-image"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.5s' }}
          />
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '20px', 
            background: 'rgba(255,255,255,0.95)', 
            padding: '6px 14px', 
            borderRadius: '50px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            fontWeight: '800',
            fontSize: '0.85rem',
            color: '#1e293b',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <Star size={16} fill="#c5a059" color="#c5a059" />
            {hotel.averageRating ? hotel.averageRating.toFixed(1) : '4.8'}
          </div>
        </div>

        <div style={{ padding: '1.75rem 0.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 className="luxury-font" style={{ fontSize: '1.4rem', margin: 0, color: '#0f172a' }}>{hotel.name}</h3>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.25rem' }}>
                {formatCurrency(hotel.minPrice || hotel.pricePerNight || 0)}
              </span>
              <small style={{ fontWeight: '600', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>nightly</small>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.95rem', fontWeight: '500', marginBottom: '1.25rem' }}>
            <MapPin size={18} color="#c5a059" />
            {hotel.location || hotel.city}
          </div>

          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>
            {hotel.description ? (hotel.description.length > 85 ? hotel.description.substring(0, 85) + '...' : hotel.description) : 'Experience luxury and artisan comfort in our signature suites.'}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontSize: '0.9rem', fontWeight: '700' }}>
                <Users size={18} />
                {hotel.capacity || 2} Guests 
              </div>
              <div style={{ height: '4px', width: '4px', borderRadius: '50%', background: '#cbd5e1' }}></div>
              <span style={{ color: '#c5a059', fontWeight: '800', fontSize: '0.9rem' }}>Verified Property</span>
          </div>
        </div>

        <style>{`
          .hotel-card-main:hover {
            transform: translateY(-10px);
          }
          .hotel-card-main:hover .card-image {
            transform: scale(1.1);
          }
          .card-image { transform: scale(1); }
        `}</style>
      </div>
    </Link>
  );
};

export default HotelCard;
