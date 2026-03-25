import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminStats } from '../../redux/slices/adminSlice';
import { 
  Users, 
  UserCheck, 
  Hotel, 
  CalendarCheck, 
  DollarSign, 
  TrendingUp, 
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      dispatch(getAdminStats());
    }
  }, [dispatch, user]);

  const statCards = [
    { title: 'Total Revenue', value: stats ? formatCurrency(stats.totalRevenue) : '$0', icon: <DollarSign />, color: '#0ea5e9', bg: '#e0f2fe', trend: '+12%', up: true },
    { title: 'Total Users', value: stats?.userCount || 0, icon: <Users />, color: '#6366f1', bg: '#e0e7ff', trend: '+5%', up: true },
    { title: 'Total Managers', value: stats?.managerCount || 0, icon: <UserCheck />, color: '#f59e0b', bg: '#fef3c7', trend: '+2%', up: true },
    { title: 'Total Hotels', value: stats?.hotelCount || 0, icon: <Hotel />, color: '#ec4899', bg: '#fce7f3', trend: '+8%', up: true },
  ];

  if (!isInitialized || loading || (!stats && !error)) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1rem' }}>
      <Loader2 className="animate-spin" size={40} color="#0ea5e9" />
      <p style={{ fontSize: '0.8rem', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px' }}>Gathering Intelligence...</p>
    </div>
  );

  if (error && !stats) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '1.5rem', textAlign: 'center' }}>
      <div style={{ padding: '2rem', background: '#fef2f2', borderRadius: '24px', color: '#ef4444' }}>
         <TrendingUp size={48} style={{ transform: 'rotate(180deg)' }} />
      </div>
      <h2 style={{ margin: 0 }}>System Sync Interrupted</h2>
      <p style={{ color: '#64748b' }}>{error}</p>
      <button onClick={() => dispatch(getAdminStats())} className="btn-primary" style={{ background: '#0ea5e9', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
        Retry Connection
      </button>
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>System Overview</h1>
        <p style={{ color: '#64748b' }}>Global platform analytics and performance metrics.</p>
      </div>

      <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card" style={{ 
            background: 'white', 
            padding: '1.5rem', 
            borderRadius: '24px', 
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {card.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', fontWeight: '700', color: card.up ? '#10b981' : '#ef4444' }}>
                {card.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {card.trend}
              </div>
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>{card.title}</p>
            <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.75rem', fontWeight: '800' }}>{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="responsive-grid-2-1" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <h3 style={{ margin: '0 0 2rem 0' }}>Revenue & Bookings Trend</h3>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyStats}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="_id" 
                  tickFormatter={(val) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][val.month - 1]} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="bookings" stroke="#6366f1" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: '0 0 2rem 0' }}>Platform Health</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { label: 'Booking Rate', value: '84%', color: '#0ea5e9' },
              { label: 'User Retention', value: '72%', color: '#6366f1' },
              { label: 'Payment Success', value: '99.2%', color: '#10b981' },
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: '#64748b' }}>{item.label}</span>
                  <span style={{ fontWeight: '700' }}>{item.value}</span>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px' }}>
                  <div style={{ height: '100%', width: item.value, background: item.color, borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="responsive-grid-2-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Latest Bookings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.recentBookings?.map((b) => (
              <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '16px', background: '#f8fafc' }}>
                <div>
                   <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{b.userId?.name || 'Unknown User'}</p>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{b.hotelId?.name || 'Deleted Hotel'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontWeight: '700', color: '#10b981' }}>{formatCurrency(b.totalPrice)}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{formatDate(b.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>New Users</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {stats?.recentUsers?.map((u) => (
              <div key={u._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderRadius: '16px', background: '#f8fafc' }}>
                <div>
                   <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{u.name || 'Anonymous'}</p>
                   <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{u.email || 'No Email'}</p>
                </div>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#38bdf8' }}>{(u.role || 'user').toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
