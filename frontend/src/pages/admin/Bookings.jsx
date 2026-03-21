import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminBookings, cancelBookingAdmin } from '../../redux/slices/adminSlice';
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  User, 
  Hotel, 
  CreditCard, 
  XSquare, 
  Loader2,
  Info
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const BookingMonitoring = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(getAdminBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch = b.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          b.hotelId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b._id.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  if (loading && bookings.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={40} color="#0ea5e9" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Global Bookings</h1>
        <p style={{ color: '#64748b' }}>Monitor and manage every reservation on the platform.</p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '14px', flexGrow: 1, border: '1px solid #e2e8f0' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', paddingLeft: '1rem', outline: 'none', width: '100%' }} 
            />
          </div>
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}
          >
            <option value="all">All Status</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredBookings.map((b) => (
             <div key={b._id} style={{ 
               padding: '1.25rem 2rem', 
               borderRadius: '18px', 
               border: '1px solid #f1f5f9',
               display: 'grid',
               gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr auto',
               gap: '2.5rem',
               alignItems: 'center',
               background: '#fff'
             }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <CalendarCheck size={22} color="#0ea5e9" />
                 </div>
                 <div>
                   <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', fontWeight: '800' }}>RESERVATION</p>
                   <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>#{b._id.substr(-8).toUpperCase()}</p>
                 </div>
               </div>

               <div>
                 <p style={{ margin: 0, fontWeight: '700' }}>{b.userId?.name}</p>
                 <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{b.hotelId?.name}</p>
               </div>

               <div style={{ textAlign: 'center' }}>
                 <p style={{ margin: 0, fontWeight: '800', color: '#1e293b' }}>{formatCurrency(b.totalPrice)}</p>
                 <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{formatDate(b.checkInDate)}</p>
               </div>

               <div>
                <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '30px', 
                    fontSize: '0.65rem', 
                    fontWeight: '800', 
                    background: b.status === 'confirmed' ? '#dcfce7' : '#fee2e2',
                    color: b.status === 'confirmed' ? '#166534' : '#991b1b',
                  }}>
                    {b.status.toUpperCase()}
                  </span>
               </div>

               <div>
                 {b.status !== 'cancelled' && (
                    <button 
                      onClick={() => dispatch(cancelBookingAdmin(b._id))}
                      style={{ border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <XSquare size={20} color="#ef4444" />
                    </button>
                 )}
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingMonitoring;
