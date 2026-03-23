import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Hotel, 
  TrendingUp, 
  DollarSign, 
  MoreHorizontal, 
  Search,
  Bell,
  Menu,
  ChevronRight,
  Check,
  X as XIcon,
  Trash2
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
  Line,
  AreaChart,
  Area
} from 'recharts';
import Sidebar from '../components/Sidebar';
import * as api from '../services/api';

const revenueData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [statsData, setStatsData] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);

  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    fetchStats();
    if (activeSection === 'hotels') {
      loadHotels();
    }
  }, [activeSection]);

  const fetchStats = async () => {
    try {
      const { data } = await api.fetchAdminStats();
      setStatsData(data);
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadHotels = async () => {
    try {
      setLoading(true);
      const { data } = await api.fetchAllHotelsAdmin();
      setHotels(data);
    } catch (err) {
      console.error('Error loading hotels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id, status) => {
    try {
      await api.approveHotel(id, status);
      loadHotels();
    } catch (err) {
      alert('Action failed');
    }
  };

  const handleDeleteHotel = async (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      try {
        await api.deleteHotel(id);
        loadHotels();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const stats = [
    { title: 'Total Revenue', value: statsData ? `$${statsData.revenue || '0'}` : '$0', change: '+12.5%', icon: DollarSign, color: '#10b981' },
    { title: 'Total Bookings', value: statsData ? statsData.bookingCount : '0', change: '+5.2%', icon: TrendingUp, color: '#3b82f6' },
    { title: 'Registered Users', value: statsData ? statsData.userCount : '0', change: '+8.1%', icon: Users, color: '#8b5cf6' },
    { title: 'Total Hotels', value: statsData ? statsData.hotelCount : '0', change: '+2.4%', icon: Hotel, color: '#f59e0b' },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      <main className="dashboard-content">
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ display: 'none', background: 'none' }}
              className="mobile-menu-btn"
            >
              <Menu size={24} />
            </button>
            <h1 className="luxury-font" style={{ fontSize: '2rem' }}>Admin Dashboard</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }} className="desktop-search">
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search..." className="input-field" style={{ width: '250px', paddingLeft: '40px', background: 'white' }} />
            </div>
            <button className="glass-panel" style={{ padding: '10px', borderRadius: '12px', color: 'var(--text-muted)' }}>
              <Bell size={20} />
            </button>
          </div>
        </header>

        {activeSection === 'overview' && (
          <>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
              {stats.map((stat, i) => (
                <div key={i} className="stat-card animate-fade" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ padding: '10px', background: `${stat.color}15`, borderRadius: '12px', color: stat.color }}>
                      <stat.icon size={24} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#10b981' }}>{stat.change}</span>
                  </div>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>{stat.value}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div className="stat-card" style={{ height: '400px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <h3 className="luxury-font" style={{ fontSize: '1.25rem' }}>Revenue Analytics</h3>
                  <select style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: '600' }}>
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="stat-card" style={{ height: '400px' }}>
                <h3 className="luxury-font" style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Booking Sources</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    { name: 'Direct Booking', value: 65, color: '#3b82f6' },
                    { name: 'Online Agencies', value: 25, color: '#10b981' },
                    { name: 'Walk-in', value: 10, color: '#f59e0b' }
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: '500' }}>{item.name}</span>
                        <span style={{ color: 'var(--text-muted)' }}>{item.value}%</span>
                      </div>
                      <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.value}%`, height: '100%', background: item.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Target Achievement</p>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--secondary)' }}>92.4%</h4>
                </div>
              </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="table-container">
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="luxury-font" style={{ fontSize: '1.25rem' }}>Recent Activity</h3>
                <button style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Room Type</th>
                    <th>Check In</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'John Doe', room: 'Luxury Suite', date: '2024-03-12', amount: '$450.00', status: 'Completed', color: '#10b981' },
                    { name: 'Sarah Wilson', room: 'Deluxe Room', date: '2024-03-12', amount: '$280.00', status: 'Pending', color: '#f59e0b' },
                    { name: 'Michael Chen', room: 'Presidential', date: '2024-03-11', amount: '$1,200.00', status: 'Completed', color: '#10b981' },
                    { name: 'Emily Brown', room: 'Executive Room', date: '2024-03-11', amount: '$320.00', status: 'Canceled', color: '#ef4444' }
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: '600' }}>{row.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{row.room}</td>
                      <td>{row.date}</td>
                      <td style={{ fontWeight: '700' }}>{row.amount}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: '6px', 
                          fontSize: '0.75rem', 
                          fontWeight: '700',
                          backgroundColor: `${row.color}15`,
                          color: row.color
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button style={{ background: 'none', color: '#94a3b8' }}><MoreHorizontal size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeSection === 'hotels' && (
          <div className="table-container animate-fade">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
              <h3 className="luxury-font" style={{ fontSize: '1.25rem' }}>Global Hotels Management</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Approve new submissions and manage listings</p>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hotel Name</th>
                  <th>City</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((h) => (
                  <tr key={h._id}>
                    <td style={{ fontWeight: '600' }}>{h.name}</td>
                    <td>{h.city}</td>
                    <td>
                      {h.images && h.images[0] ? (
                        <img src={`${api.API_BASE_URL}${h.images[0]}`} alt={h.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                      ) : <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px' }}></div>}
                    </td>
                    <td>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        fontWeight: '700',
                        backgroundColor: h.isApproved ? '#10b98115' : '#f59e0b15',
                        color: h.isApproved ? '#10b981' : '#f59e0b'
                      }}>
                        {h.isApproved ? 'Approved' : 'Pending Approval'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!h.isApproved ? (
                          <button 
                            onClick={() => handleApprove(h._id, true)}
                            style={{ padding: '6px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleApprove(h._id, false)}
                            style={{ padding: '6px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                            title="Reject/Unapprove"
                          >
                            <XIcon size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteHotel(h._id)}
                          style={{ padding: '6px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-menu-btn { display: block !important; }
          .desktop-search { display: none !important; }
          div[style*="gridTemplateColumns: 2fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;

