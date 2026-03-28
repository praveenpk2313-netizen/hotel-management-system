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
    <nav className={`fixed top-0 left-0 w-full z-[1000] py-4 transition-all duration-500 bg-white border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={scrollToTop}
          className="text-2xl font-serif font-black tracking-tighter text-slate-900"
        >
          Stay <span className="italic">Savvy</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-10 font-bold text-xs text-slate-600">
          <Link to="/" className="hover:text-luxury-gold transition-colors">Home</Link>
          <Link to="/hotels" className="hover:text-luxury-gold transition-colors">Hotels</Link>
          <button onClick={() => scrollToSection('about')} className="hover:text-luxury-gold transition-colors uppercase text-[10px] tracking-widest">About Us</button>
          
          {user?.role === 'manager' && (
            <Link to="/manager/dashboard" className="text-luxury-gold hover:text-slate-900 border-b-2 border-luxury-gold pb-1 animate-pulse">Manager Portal</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-luxury-gold hover:text-slate-900 border-b-2 border-luxury-gold pb-1 animate-pulse">Admin Panel</Link>
          )}
          {(!user || user.role === 'customer') && (
            <Link to="/customer/dashboard" className="hover:text-luxury-gold transition-colors">My Trips</Link>
          )}
        </div>

        {/* Auth & Actions */}
        <div className="flex items-center gap-6">
          {user ? (
             <div className="flex items-center gap-6">
                {/* Language Toggle */}
                <div className="hidden md:flex items-center bg-gray-50 px-2 py-1 rounded-full gap-2 border border-gray-100">
                   <span className="text-[10px] font-black px-2">EN</span>
                   <div className="w-8 h-4 bg-white rounded-full border border-gray-200 shadow-sm relative">
                      <div className="absolute left-1 top-0.5 w-2.5 h-2.5 bg-gray-400 rounded-full" />
                   </div>
                </div>

                <div className="relative">
                   <NotificationBell scrolled={true} />
                </div>

                <div className="hidden md:flex items-center gap-4">
                   <div className="flex flex-col items-end">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                         {user.name || "PRAVEEN KUMAR R"}
                      </span>
                   </div>
                   <button 
                     onClick={handleLogout}
                     className="flex items-center gap-2 text-rose-500 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                   >
                     <LogOut size={14} /> Logout
                   </button>
                </div>
             </div>
          ) : (
            <Link 
              to="/login" 
              className="flex items-center gap-3 px-8 py-3 rounded-full bg-slate-900 text-white hover:bg-luxury-gold text-[10px] font-black uppercase tracking-widest shadow-xl transition-all"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
             {isMenuOpen ? <X size={24} className="text-slate-900" /> : <Menu size={24} className="text-slate-900" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg animate-fade-in flex flex-col pt-4 pb-6 px-6 gap-4 z-[1000]">
          <Link to="/" onClick={scrollToTop} className="text-sm font-bold text-slate-800 border-b border-gray-50 pb-3">Home</Link>
          <Link to="/hotels" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-800 border-b border-gray-50 pb-3">Hotels</Link>
          <button onClick={() => scrollToSection('about')} className="text-sm font-bold text-slate-800 border-b border-gray-50 pb-3 text-left">About Us</button>
          
          {user?.role === 'manager' && (
            <Link to="/manager/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-luxury-gold border-b border-gray-50 pb-3">Manager Portal</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-luxury-gold border-b border-gray-50 pb-3">Admin Panel</Link>
          )}
          {(!user || user.role === 'customer') && (
            <Link to="/customer/dashboard" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-800 border-b border-gray-50 pb-3">My Trips</Link>
          )}

          {user && (
            <div className="pt-2 flex flex-col gap-4">
               <div className="flex items-center gap-3">
                  <span className="text-xs font-black uppercase text-slate-500">Language:</span>
                  <span className="text-xs font-bold text-slate-900">EN</span>
               </div>
               <div className="flex items-center gap-3 border-t border-gray-50 pt-4">
                  <span className="text-xs font-black uppercase text-slate-500">Account:</span>
                   <span className="text-sm font-bold text-slate-900">{user.name || "PRAVEEN KUMAR R"}</span>
               </div>
               <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 mt-2 w-fit text-rose-500 hover:text-rose-600 text-xs font-black uppercase tracking-widest transition-colors"
               >
                  <LogOut size={16} /> Logout
               </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

