import React from 'react';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  UserSquare2, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Hotel
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const role = user?.role;
    logout();
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/manager');
    }
  };

  const managerItems = [
    { id: 'hotels', title: 'Hotels Manager', icon: Hotel },
    { id: 'rooms', title: 'Room Management', icon: BedDouble },
    { id: 'pricing', title: 'Price & Availability', icon: CreditCard },
    { id: 'bookings', title: 'Reservations', icon: CalendarCheck },
  ];

  const adminItems = [
    { id: 'overview', title: 'Admin Overview', icon: LayoutDashboard },
    { id: 'users', title: 'User Management', icon: Users },
    { id: 'hotels', title: 'Global Hotels', icon: Hotel },
    { id: 'analytics', title: 'Revenue Reports', icon: BarChart3 },
  ];

  const menuItems = user?.role === 'admin' ? adminItems : managerItems;

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem', padding: '0.5rem' }}>
        <Hotel size={32} color="var(--primary)" />
        <h2 className="luxury-font" style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>Horizon</h2>
      </div>

      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
            style={{ 
              background: 'none', 
              border: 'none', 
              width: '100%', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1.25rem',
              borderRadius: '12px',
              color: activeSection === item.id ? 'white' : '#94a3b8',
              backgroundColor: activeSection === item.id ? 'var(--primary)' : 'transparent',
              marginBottom: '0.5rem',
              transition: 'all 0.2s ease'
            }}
          >
            <item.icon size={20} />
            <span style={{ fontWeight: '600' }}>{item.title}</span>
          </button>
        ))}
      </nav>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', padding: '0.5rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            background: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '1.1rem',
            color: 'white'
          }}>
            {user?.name?.charAt(0) || 'M'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'white' }}>{user?.name || 'Manager'}</p>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="nav-link logout-btn" 
          style={{ 
            width: '100%', 
            background: 'none', 
            border: 'none', 
            color: '#fca5a5',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.875rem 1.25rem',
            borderRadius: '12px',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={20} />
          <span style={{ fontWeight: '600' }}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
