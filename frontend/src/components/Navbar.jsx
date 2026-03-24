import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, ChevronDown, User, Globe, Search } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (location.pathname !== '/') navigate('/');
    setIsMenuOpen(false);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password';

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] py-6 transition-all duration-500 ${
      (scrolled || isAuthPage) ? 'bg-white shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-4' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={scrollToTop}
          className={`text-2xl font-serif font-black tracking-tighter transition-colors ${
            (scrolled || isAuthPage) ? 'text-slate-900' : 'text-white'
          }`}
        >
          URBAN<span className="text-luxury-gold italic">STAY</span>
        </Link>
        
        {/* Navigation Links */}
        <div className={`hidden lg:flex items-center gap-12 font-bold text-[10px] uppercase tracking-[0.2em] ${
          (scrolled || isAuthPage) ? 'text-slate-600' : 'text-white/80'
        }`}>
          <button onClick={scrollToTop} className="hover:text-luxury-gold transition-colors">Home</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-luxury-gold transition-colors">About</button>
          <button onClick={() => scrollToSection('hotels')} className="hover:text-luxury-gold transition-colors">Properties</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-luxury-gold transition-colors">Contact</button>
        </div>

        {/* Auth & Actions */}
        <div className="flex items-center gap-6">
          {user ? (
             <div className="flex items-center gap-6">
                <NotificationBell scrolled={scrolled || isAuthPage} />
                <button 
                  onClick={() => navigate(user.role === 'admin' ? '/admin/dashboard' : user.role === 'manager' ? '/manager/dashboard' : '/customer/dashboard')}
                  className={`flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest ${
                    (scrolled || isAuthPage) 
                    ? 'border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white' 
                    : 'border-white/20 text-white hover:bg-white hover:text-slate-900'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={handleLogout}
                  className="p-2.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  <LogOut size={18} />
                </button>
             </div>
          ) : (
            <Link 
              to="/login" 
              className={`flex items-center gap-3 px-8 py-3 rounded-full transition-all text-[10px] font-black uppercase tracking-widest shadow-xl ${
                (scrolled || isAuthPage) 
                ? 'bg-slate-900 text-white hover:bg-luxury-gold' 
                : 'bg-white text-slate-900 hover:bg-luxury-gold hover:text-white'
              }`}
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden">
             <Menu size={24} className={(scrolled || isAuthPage) ? 'text-slate-900' : 'text-white'} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

