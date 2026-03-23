import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    if (isHome) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav style={{ 
      background: '#ffffff', 
      padding: '1.2rem 4%', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Logo */}
      <Link to="/" style={{ 
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', textDecoration: 'none',
        fontFamily: '"Playfair Display", serif', fontStyle: 'italic',
      }}>
        <img src="/logo.png" alt="StayNow Logo" style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '10px' }} />
        StayNow
      </Link>

      {/* Center Links (Desktop) */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <button onClick={() => scrollToSection('home')} className="nav-btn-link">Home</button>
        <button onClick={() => scrollToSection('hotels')} className="nav-btn-link">Hotels</button>
        <button onClick={() => scrollToSection('deals')} className="nav-btn-link">Deals</button>
        <button onClick={() => scrollToSection('about-us')} className="nav-btn-link">About Us</button>
        <button onClick={() => scrollToSection('contact-us')} className="nav-btn-link">Contact Us</button>
      </div>

      {/* Right Section (Desktop) */}
      <div className="desktop-menu" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <NotificationBell />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
               <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{user.name}</span>
               <span style={{ fontSize: '0.7rem', color: '#c5a059', fontWeight: '800', textTransform: 'uppercase' }}>{user.role}</span>
            </div>
            <button onClick={handleLogout} style={{ 
              background: '#0f172a', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '50px', border: 'none', cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: '700', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }} onMouseOver={e => e.currentTarget.style.background = '#1e293b'} onMouseOut={e => e.currentTarget.style.background = '#0f172a'}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#0f172a', fontWeight: '700', fontSize: '0.9rem' }}>Login</Link>
            <Link to="/register" style={{ 
              background: '#c5a059', color: 'white', padding: '0.7rem 1.75rem', borderRadius: '50px', textDecoration: 'none', fontWeight: '700', fontSize: '0.9rem',
              boxShadow: '0 4px 12px rgba(197, 160, 89, 0.2)', transition: '0.3s'
            }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>Sign Up</Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-toggle" style={{ display: 'none', background: 'none', border: 'none' }}>
        {isMenuOpen ? <X size={28} color="#111" /> : <Menu size={28} color="#111" />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{ position: 'absolute', top: '100%', left: 0, width: '100%', background: 'white', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 15px 30px rgba(0,0,0,0.1)', animation: 'slideDown 0.3s ease-out' }}>
          <button onClick={() => scrollToSection('home')} className="mobile-nav-btn">Home</button>
          <button onClick={() => scrollToSection('hotels')} className="mobile-nav-btn">Hotels</button>
          <button onClick={() => scrollToSection('deals')} className="mobile-nav-btn">Deals</button>
          <button onClick={() => scrollToSection('about-us')} className="mobile-nav-btn">About Us</button>
          <button onClick={() => scrollToSection('contact-us')} className="mobile-nav-btn">Contact Us</button>
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}>
            {user ? (
              <button onClick={handleLogout} className="mobile-nav-btn" style={{ color: '#ef4444' }}>Logout</button>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <Link to="/login" onClick={() => setIsMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '1rem', border: '1px solid #0f172a', borderRadius: '12px', textDecoration: 'none', color: '#0f172a', fontWeight: '700' }}>Login</Link>
                 <Link to="/register" onClick={() => setIsMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '1rem', background: '#0f172a', borderRadius: '12px', textDecoration: 'none', color: 'white', fontWeight: '700' }}>Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .nav-btn-link { background: none; border: none; padding: 0; color: #64748b; font-weight: 700; font-size: 0.95rem; cursor: pointer; transition: 0.2s; font-family: inherit; }
        .nav-btn-link:hover { color: #c5a059; }
        
        .mobile-nav-btn { background: none; border: none; padding: 0.5rem 0; text-align: left; color: #1e293b; font-weight: 700; font-size: 1.1rem; cursor: pointer; font-family: inherit; }
        
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 900px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; cursor: pointer; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
