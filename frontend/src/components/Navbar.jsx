import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, ChevronDown, User, Globe, Hotel } from 'lucide-react';
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

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 py-3 shadow-premium' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-[1400px] mx-auto px-[4%] flex justify-between items-center">
        
        {/* Logo */}
        <div onClick={scrollToTop} className="cursor-pointer group flex items-center gap-2">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:bg-[#c5a059] transition-colors duration-500">
            <Hotel size={20} strokeWidth={2.5} />
          </div>
          <span className={`text-2xl font-serif font-black tracking-tight transition-colors duration-500 ${
            scrolled ? 'text-slate-900' : 'text-slate-900'
          }`}>
            UrbanStay<span className="text-[#c5a059]">.</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            <button onClick={scrollToTop} className="nav-link-premium">Home</button>
            <Link to="/hotels" className="nav-link-premium">Hotels</Link>
            <button onClick={() => scrollToSection('about')} className="nav-link-premium">About</button>
            <button onClick={() => scrollToSection('contact')} className="nav-link-premium">Contact</button>
            
            {user && (
              <>
                {user.role === 'admin' && <Link to="/admin" className="nav-link-premium font-bold">Admin</Link>}
                {user.role === 'manager' && <Link to="/manager" className="nav-link-premium font-bold">Manager</Link>}
                <Link to="/booking-history" className="nav-link-premium">My Trips</Link>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2" />

          {/* Auth Section */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-slate-400 hover:text-slate-900 cursor-pointer transition-colors">
              <Globe size={16} />
              <span className="text-xs font-black uppercase tracking-widest">EN</span>
            </div>

            {user ? (
              <div className="flex items-center gap-6">
                <NotificationBell />
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                   <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                      <User size={18} />
                   </div>
                   <div className="hidden xl:block">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Welcome</p>
                      <p className="text-sm font-bold text-slate-900 leading-none">{user.name.split(' ')[0]}</p>
                   </div>
                   <button onClick={handleLogout} className="w-9 h-9 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                      <LogOut size={18} />
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-black text-slate-900 uppercase tracking-widest hover:text-[#c5a059] transition-colors">Login</Link>
                <Link to="/register" className="bg-slate-900 text-white px-7 py-3 rounded-full text-xs font-black uppercase tracking-[2px] shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 transition-all">
                  Join Elite
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden w-12 h-12 flex items-center justify-center bg-slate-100 rounded-2xl text-slate-900 shadow-sm active:scale-90 transition-all">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-[999] transition-all duration-500 lg:hidden ${
        isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'
      }`}>
        <div className="flex flex-col h-full p-10 pt-32 space-y-8">
           <button onClick={scrollToTop} className="text-4xl font-serif font-black text-slate-900 text-left">Home</button>
           <Link to="/hotels" onClick={() => setIsMenuOpen(false)} className="text-4xl font-serif font-black text-slate-900">Portfolio</Link>
           <button onClick={() => scrollToSection('about')} className="text-4xl font-serif font-black text-slate-900 text-left">Our Heritage</button>
           <button onClick={() => scrollToSection('contact')} className="text-4xl font-serif font-black text-slate-900 text-left">Get In Touch</button>
           
           <div className="h-px bg-slate-100 w-full my-4" />
           
           {user ? (
             <div className="space-y-6">
               <Link to="/booking-history" onClick={() => setIsMenuOpen(false)} className="block text-xl font-bold text-slate-900">Manage Stays</Link>
               <button onClick={handleLogout} className="text-xl font-bold text-rose-500">Sign Out</button>
             </div>
           ) : (
             <div className="space-y-6">
               <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-xl font-bold text-slate-900">Login</Link>
               <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full py-5 bg-slate-900 text-white text-center rounded-2xl font-bold uppercase tracking-widest shadow-xl">Join Elite Collection</Link>
             </div>
           )}
        </div>
      </div>

      <style>{`
        @font-face {
          font-family: 'Playfair Display';
          src: url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');
        }
        .nav-link-premium {
          position: relative;
          color: #1e293b;
          font-size: 0.75rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.3s;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .nav-link-premium:hover { color: #c5a059; }
        .nav-link-premium::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          width: 0;
          height: 2px;
          background: #c5a059;
          transition: all 0.3s;
          transform: translateX(-50%);
        }
        .nav-link-premium:hover::after { width: 100%; }
        
        .shadow-premium {
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

