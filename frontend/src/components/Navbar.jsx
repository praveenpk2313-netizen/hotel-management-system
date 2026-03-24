import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      background: '#ffffff', 
      padding: '1.2rem 4%', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'relative',
      zIndex: 1000
    }}>
      {/* Logo */}
      <Link to="/" style={{ 
        fontSize: '1.8rem', 
        fontWeight: '800', 
        color: '#111', 
        textDecoration: 'none',
        fontFamily: '"Playfair Display", serif',
        fontStyle: 'italic',
        letterSpacing: '-0.5px'
      }}>
        Stay Savvy
      </Link>

      {/* Center Links (Desktop) */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/hotels" className="nav-link">Hotels</Link>
        <a href="/#deals" className="nav-link">Deals</a>
        {user ? (
          <>
            {user.role === 'admin' && <Link to="/admin" className="nav-link">Admin</Link>}
            {user.role === 'manager' && <Link to="/manager" className="nav-link">Manager</Link>}
            <Link to="/booking-history" className="nav-link">Trips</Link>
          </>
        ) : (
          <>
            <a href="/#about" className="nav-link">About Us</a>
            <a href="/#contact" className="nav-link">Contact Us</a>
            <a href="/#help" className="nav-link">Help</a>
          </>
        )}
      </div>

      {/* Right Section (Desktop) */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {/* Language Toggle Placeholder */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#f3f4f6', 
          borderRadius: '20px', 
          padding: '4px 8px',
          width: '60px',
          cursor: 'pointer'
        }}>
          <div style={{ background: 'white', borderRadius: '50%', padding: '4px 6px', fontSize: '0.75rem', fontWeight: 'bold' }}>EN</div>
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <NotificationBell />
            <span style={{ fontWeight: '500', fontSize: '0.95rem' }}>{user.name}</span>
            <button onClick={handleLogout} style={{ 
              display: 'flex', alignItems: 'center', gap: '0.4rem', 
              color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.95rem', fontWeight: '500'
            }}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" style={{ 
              textDecoration: 'none', 
              color: '#333', 
              fontWeight: '500', 
              fontSize: '0.95rem' 
            }}>
              Login
            </Link>
            <Link to="/register" style={{ 
              background: '#22d3ee', // Cyan color
              color: 'white', 
              padding: '0.6rem 1.5rem', 
              borderRadius: '8px', 
              textDecoration: 'none', 
              fontWeight: '500',
              fontSize: '0.95rem',
              boxShadow: '0 4px 10px rgba(34, 211, 238, 0.3)'
            }}>
              Sign Up
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-toggle" style={{ display: 'none', background: 'none', border: 'none' }}>
        {isMenuOpen ? <X size={28} color="#111" /> : <Menu size={28} color="#111" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{ 
          position: 'absolute', top: '100%', left: 0, width: '100%', 
          background: 'white', padding: '1.5rem', 
          display: 'flex', flexDirection: 'column', gap: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
        }}>
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">Home</Link>
          {user ? (
             <>
               {user.role === 'admin' && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">Admin</Link>}
               {user.role === 'manager' && <Link to="/manager" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">Manager</Link>}
               <Link to="/booking-history" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">Trips</Link>
               <button onClick={handleLogout} className="mobile-nav-link" style={{ textAlign: 'left', color: '#ef4444', background: 'none', border: 'none', padding: 0 }}>Logout</button>
             </>
          ) : (
             <>
               <Link to="/login" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">Login</Link>
               <Link to="/register" onClick={() => setIsMenuOpen(false)} className="mobile-nav-link">Sign Up</Link>
             </>
          )}
        </div>
      )}

      <style>{`
        .nav-link {
          color: #111;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          transition: 0.2s;
        }
        .nav-link:hover { color: #22d3ee; }
        
        .mobile-nav-link {
          color: #111;
          text-decoration: none;
          font-weight: 500;
          font-size: 1.1rem;
        }

        @media (max-width: 900px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; cursor: pointer; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

