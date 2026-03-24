import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { getManagerStats, getManagerAnalytics } from '../../redux/slices/managerSlice';
import { 
  TrendingUp, 
  Hotel, 
  Calendar, 
  DollarSign, 
  ArrowUpRight, 
  Loader2 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/helpers';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { stats, analytics, loading, error } = useSelector((state) => state.manager);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(getManagerStats());
    dispatch(getManagerAnalytics());
  }, [dispatch]);

  const statCards = [
    { title: 'Total Revenue', value: stats ? formatCurrency(stats.totalRevenue) : '$0', icon: <DollarSign />, color: '#10b981', bg: '#d1fae5' },
    { title: 'Total Hotels', value: stats?.totalHotels || 0, icon: <Hotel />, color: '#6366f1', bg: '#e0e7ff' },
    { title: 'Total Rooms', value: stats?.totalRooms || 0, icon: <TrendingUp />, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Total Bookings', value: stats?.totalBookings || 0, icon: <Calendar />, color: '#ec4899', bg: '#fce7f3' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  if (error && !stats) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8rem 2rem', gap: '1.5rem' }}>
      <div style={{ fontSize: '3rem' }}>⚠️</div>
      <h2 style={{ margin: 0, color: '#1e293b' }}>Could not load dashboard</h2>
      <p style={{ color: '#64748b', margin: 0 }}>{error}</p>
      <button
        onClick={() => { dispatch(getManagerStats()); dispatch(getManagerAnalytics()); }}
        style={{ background: '#c5a059', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '0.95rem' }}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Welcome back, {user?.name || 'Manager'}</h1>
        <p style={{ color: '#64748b' }}>Here's what's happening with your properties today.</p>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid #f1f5f9' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {card.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', fontWeight: '500' }}>{card.title}</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="responsive-grid-2-1" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Analytics Chart */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ margin: 0 }}>Revenue Analytics</h3>
            <select style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" tickFormatter={(m) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m-1]} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#c5a059" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Booking Trends */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: '0 0 2rem 0' }}>Booking Trends</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" hide />
                <Tooltip />
                <Line type="monotone" dataKey="bookings" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3 style={{ margin: 0 }}>Recent Reservations</h3>
          <button style={{ color: 'var(--primary)', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            View All <ArrowUpRight size={18} />
          </button>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          {(!stats?.recentBookings || stats.recentBookings.length === 0) ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>No recent reservations yet.</p>
            </div>
          ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>CUSTOMER</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>HOTEL</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>DATES</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>AMOUNT</th>
                <th style={{ padding: '1rem', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map((booking) => (
                <tr key={booking._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{booking.userId?.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{booking.userId?.email}</p>
                  </td>
                  <td style={{ padding: '1.25rem 1rem', fontSize: '0.9rem', color: '#475569' }}>{booking.hotelId?.name}</td>
                  <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: '#475569' }}>
                    {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                  </td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: '700', color: '#10b981' }}>{formatCurrency(booking.totalPrice)}</td>
                  <td style={{ padding: '1.25rem 1rem' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.7rem', 
                      fontWeight: '800', 
                      textTransform: 'uppercase',
                      background: booking.status === 'confirmed' ? '#dcfce7' : '#fef9c3',
                      color: booking.status === 'confirmed' ? '#15803d' : '#854d0e'
                    }}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
