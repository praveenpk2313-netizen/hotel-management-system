import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Hotel, 
  BedDouble, 
  CalendarCheck, 
  BarChart3, 
  MessageSquare, 
  LogOut, 
  User, 
  Bell, 
  Search,
  X,
  Menu,
  Plus,
  Loader2,
  MapPin
} from 'lucide-react';
import NotificationBell from '../../components/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { fetchSuggestions } from '../../services/api';

const ManagerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    if (val.length >= 2) {
      setLoadingSuggestions(true);
      try {
        const { data } = await fetchSuggestions(val);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (text) => {
    setSearchTerm(text);
    setShowSuggestions(false);
    // Optionally navigate to hotels list with this filter
    navigate(`/manager/hotels?city=${text}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Hotels', path: '/manager/hotels', icon: <Hotel size={20} /> },
    { name: 'Add New Hotel', path: '/manager/add-hotel', icon: <Plus size={20} /> },
    { name: 'Bookings', path: '/manager/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Analytics', path: '/manager/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Reviews', path: '/manager/reviews', icon: <MessageSquare size={20} /> },
  ];

  return (
    <div className="manager-dashboard" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <aside className={`responsive-sidebar ${!isSidebarOpen ? 'closed-mobile' : ''}`} style={{ 
        width: isSidebarOpen ? '280px' : '80px', 
        background: '#1e293b', 
        color: 'white', 
        transition: '0.3s', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100
      }}>
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center' }}>
          {isSidebarOpen && <h2 className="luxury-font" style={{ fontSize: '1.25rem', margin: 0, color: '#c5a059' }}>StayNow Manager</h2>}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav style={{ flexGrow: 1, padding: '1rem 0' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.5rem',
                color: '#94a3b8',
                textDecoration: 'none',
                transition: '0.2s',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <span style={{ color: 'inherit' }}>{item.icon}</span>
              {isSidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '2rem 1.5rem', borderTop: '1px solid #334155' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              color: '#ef4444', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              width: '100%',
              padding: '0.5rem 0',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center'
            }}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span style={{ fontWeight: '600' }}>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <header className="responsive-header" style={{ 
          height: '80px', 
          background: 'white', 
          borderBottom: '1px solid #e2e8f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}>
          
          {/* Mobile Toggle inside Header */}
          <button 
            className="mobile-header-toggle"
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#1e293b', cursor: 'pointer', marginRight: '1rem' }}
          >
            <Menu size={24} />
          </button>

          <div className="responsive-header-search" style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', padding: '0.5rem 1rem', borderRadius: '10px', width: '300px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search things..." 
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => { if (searchTerm && suggestions.length > 0) setShowSuggestions(true); }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
              style={{ background: 'none', border: 'none', paddingLeft: '0.75rem', outline: 'none', width: '100%' }} 
            />
            {loadingSuggestions && <Loader2 size={16} className="animate-spin" color="var(--primary)" />}

            {showSuggestions && (suggestions.length > 0 || loadingSuggestions) && (
              <div style={{
                position: 'absolute', top: '110%', left: 0, width: '100%',
                minWidth: '350px',
                background: 'white', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                borderRadius: '12px', padding: '0.5rem 0', zIndex: 2000,
                border: '1px solid #e2e8f0'
              }}>
                {loadingSuggestions ? (
                   <div style={{ padding: '0.75rem 1.25rem', color: '#64748b', fontSize: '0.85rem' }}>Searching...</div>
                ) : suggestions.map((text, idx) => (
                  <div 
                    key={idx} onClick={() => handleSuggestionClick(text)}
                    style={{ padding: '0.75rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1e293b', fontSize: '0.9rem' }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <MapPin size={14} color="#94a3b8" />
                    {text}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <NotificationBell />
            <div style={{ height: '24px', width: '1px', background: '#e2e8f0' }}></div>
            <div className="responsive-header-profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>{user?.name}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', textTransform: 'capitalize' }}>{user?.role}</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#c5a059', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div style={{ padding: '2rem', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>

      <style>{`
        .nav-link:hover { color: white !important; background: #334155; }
        .nav-link.active { color: #c5a059 !important; background: #334155; border-right: 4px solid #c5a059; }
      `}</style>
    </div>
  );
};

export default ManagerLayout;
