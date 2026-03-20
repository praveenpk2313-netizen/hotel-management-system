import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAdminHotels, 
  updateHotelStatusAdmin, 
  deleteHotelAdmin 
} from '../../redux/slices/adminSlice';
import { 
  Hotel, 
  MapPin, 
  User, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Loader2,
  AlertTriangle,
  Search
} from 'lucide-react';

const HotelApproval = () => {
  const dispatch = useDispatch();
  const { hotels, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(getAdminHotels());
  }, [dispatch]);

  const filteredHotels = hotels.filter(h => {
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'pending' && !h.isApproved) || 
                         (statusFilter === 'approved' && h.isApproved);
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading && hotels.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={40} color="#0ea5e9" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Hotel Moderation</h1>
        <p style={{ color: '#64748b' }}>Approve or reject property listings across the platform.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '0.75rem 1.25rem', borderRadius: '16px', flexGrow: 1, border: '1px solid #e2e8f0' }}>
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search hotels..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'none', border: 'none', paddingLeft: '1rem', outline: 'none', width: '100%' }} 
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {['all', 'pending', 'approved'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '14px',
                border: 'none',
                background: statusFilter === s ? '#0f172a' : 'white',
                color: statusFilter === s ? 'white' : '#64748b',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
        {filteredHotels.map((hotel) => (
          <div key={hotel._id} style={{ 
            background: 'white', 
            borderRadius: '28px', 
            overflow: 'hidden', 
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ height: '220px', position: 'relative' }}>
              <img 
                src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600"} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                alt={hotel.name} 
              />
              <div style={{ 
                position: 'absolute', 
                top: '1rem', 
                right: '1rem', 
                background: hotel.isApproved ? '#dcfce7' : '#fef9c3', 
                padding: '6px 12px', 
                borderRadius: '30px',
                fontSize: '0.7rem',
                fontWeight: '800'
              }}>
                {hotel.isApproved ? 'APPROVED' : 'PENDING'}
              </div>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <h3 className="luxury-font" style={{ fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>{hotel.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                <MapPin size={16} /> {hotel.city}, {hotel.location}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                {!hotel.isApproved ? (
                  <button 
                    onClick={() => dispatch(updateHotelStatusAdmin({ id: hotel._id, status: 'approved' }))}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                ) : (
                  <button 
                    onClick={() => dispatch(updateHotelStatusAdmin({ id: hotel._id, status: 'rejected' }))}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: '#94a3b8', color: 'white', border: 'none', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                )}
                <button 
                  onClick={() => dispatch(deleteHotelAdmin(hotel._id))}
                  style={{ padding: '0.75rem', borderRadius: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', cursor: 'pointer' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelApproval;
