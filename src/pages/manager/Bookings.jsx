import React, { useState, useEffect } from 'react';
import { 
  fetchManagerBookings, 
  updateManagerBookingStatus 
} from '../../services/api';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Calendar, 
  CreditCard,
  Loader2,
  Info
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const ManagerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data } = await fetchManagerBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.userId?.name.toLowerCase().includes(term) ||
        b.userId?.email.toLowerCase().includes(term) ||
        b.hotelId?.name.toLowerCase().includes(term) ||
        b._id.includes(term)
      );
    }

    setFilteredBookings(result);
  }, [searchTerm, statusFilter, bookings]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateManagerBookingStatus(id, newStatus);
      loadBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading && bookings.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Booking Management</h1>
        <p style={{ color: '#64748b' }}>Monitor and manage reservations for all your properties.</p>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.6rem 1.25rem', borderRadius: '12px', flexGrow: 1, border: '1px solid #e2e8f0' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search by customer, hotel, or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', paddingLeft: '1rem', outline: 'none', width: '100%', fontSize: '0.9rem' }} 
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Filter size={18} color="#64748b" />
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', outline: 'none', fontSize: '0.9rem' }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Bookings List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
              <Info size={40} style={{ marginBottom: '1rem' }} />
              <p>No bookings found matching your criteria.</p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking._id} style={{ 
                padding: '1.5rem', 
                borderRadius: '18px', 
                border: '1px solid #f1f5f9',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr 1fr 0.8fr auto',
                gap: '2rem',
                alignItems: 'center',
                transition: '0.2s',
                background: '#fff'
              }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.05)'} onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                
                {/* Customer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700' }}>{booking.userId?.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Mail size={12} /> {booking.userId?.email}</p>
                  </div>
                </div>

                {/* Stay Details */}
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#1e293b' }}>{booking.hotelId?.name}</h4>
                  <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>{booking.roomId?.type}</p>
                </div>

                {/* Dates */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569', fontSize: '0.85rem' }}>
                  <Calendar size={16} color="#94a3b8" />
                  <div>
                    <span style={{ fontWeight: '600' }}>{formatDate(booking.checkInDate)}</span>
                    <span style={{ margin: '0 0.5rem', color: '#cbd5e1' }}>→</span>
                    <span style={{ fontWeight: '600' }}>{formatDate(booking.checkOutDate)}</span>
                  </div>
                </div>

                {/* Status & Payment */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 
                        booking.status === 'confirmed' ? '#10b981' : 
                        booking.status === 'cancelled' ? '#ef4444' : 
                        booking.status === 'completed' ? '#6366f1' : '#f59e0b' 
                    }}></div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase' }}>{booking.status}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: booking.paymentStatus === 'paid' ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                    <CreditCard size={12} /> {booking.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {booking.status === 'pending' && (
                    <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dcfce7', border: 'none', color: '#166534', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Confirm">
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                    <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', border: 'none', color: '#991b1b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Cancel">
                      <XCircle size={18} />
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <button onClick={() => handleStatusUpdate(booking._id, 'completed')} style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0e7ff', border: 'none', color: '#3730a3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Mark Completed">
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerBookings;
