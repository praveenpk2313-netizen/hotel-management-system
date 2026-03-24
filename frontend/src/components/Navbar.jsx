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
        <div onClick={scrollToTop} className="cursor-pointer group flex items-center gap-3">
          <div className="w-11 h-11 bg-slate-900 rounded-[1rem] flex items-center justify-center text-white shadow-xl group-hover:bg-[#c5a059] transition-all duration-500 group-hover:scale-110">
            <Hotel size={22} strokeWidth={2.5} />
          </div>
          <span className={`text-2xl font-serif font-black tracking-tighter transition-all duration-500 ${
            scrolled ? 'text-slate-900' : 'text-white'
          }`}>
            UrbanStay<span className="text-[#c5a059]">.</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          <div className="flex items-center gap-8">
            <button onClick={scrollToTop} className={`nav-link-premium ${scrolled ? 'text-slate-900' : 'text-white'}`}>Home</button>
            <Link to="/hotels" className={`nav-link-premium ${scrolled ? 'text-slate-900' : 'text-white'}`}>Hotels</Link>
            <button onClick={() => scrollToSection('about')} className={`nav-link-premium ${scrolled ? 'text-slate-900' : 'text-white'}`}>About</button>
            <button onClick={() => scrollToSection('contact')} className={`nav-link-premium ${scrolled ? 'text-slate-900' : 'text-white'}`}>Contact</button>
            
            {user && (
              <>
                {user.role === 'admin' && <Link to="/admin" className={`nav-link-premium font-black ${scrolled ? 'text-slate-900' : 'text-[#c5a059]'}`}>Admin</Link>}
                {user.role === 'manager' && <Link to="/manager" className={`nav-link-premium font-black ${scrolled ? 'text-slate-900' : 'text-[#c5a059]'}`}>Manager</Link>}
                <Link to="/booking-history" className={`nav-link-premium ${scrolled ? 'text-slate-900' : 'text-white'}`}>My Trips</Link>
              </>
            )}
          </div>

          <div className={`h-6 w-px mx-2 transition-colors duration-500 ${scrolled ? 'bg-slate-200' : 'bg-white/20'}`} />

          {/* Auth Section */}
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 cursor-pointer transition-all hover:scale-105 ${scrolled ? 'text-slate-400 hover:text-slate-900' : 'text-white/70 hover:text-white'}`}>
              <Globe size={16} />
              <span className="text-[10px] font-black uppercase tracking-[2px]">EN</span>
            </div>

            {user ? (
              <div className="flex items-center gap-6">
                <NotificationBell />
                <div className={`flex items-center gap-3 pl-4 border-l transition-colors duration-500 ${scrolled ? 'border-slate-100' : 'border-white/20'}`}>
                   <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
                      <User size={18} />
                   </div>
                   <div className="hidden xl:block">
                      <p className={`text-[9px] font-black uppercase tracking-[2px] leading-none mb-1 ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>Signature</p>
                      <p className={`text-sm font-black leading-none ${scrolled ? 'text-slate-900' : 'text-white'}`}>{user.name.split(' ')[0]}</p>
                   </div>
                   <button onClick={handleLogout} className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 active:scale-95">
                      <LogOut size={18} />
                   </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className={`text-xs font-black uppercase tracking-[2px] hover:text-[#c5a059] transition-all hover:scale-105 ${scrolled ? 'text-slate-900' : 'text-white'}`}>Login</Link>
                <Link to="/register" className={`px-8 py-3.5 rounded-full text-[11px] font-black uppercase tracking-[3px] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 ${
                  scrolled ? 'bg-slate-900 text-white shadow-slate-900/10' : 'bg-white text-slate-900 shadow-white/10'
                }`}>
                  Join Elite
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`lg:hidden w-12 h-12 flex items-center justify-center rounded-2xl transition-all active:scale-90 ${
          scrolled ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-900 shadow-lg'
        }`}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-[999] transition-all duration-700 lg:hidden ${
        isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="flex flex-col h-full p-[10%] pt-32 space-y-10">
           <button onClick={scrollToTop} className="text-5xl font-serif font-black text-slate-900 text-left tracking-tighter hover:text-[#c5a059] transition-colors">Home</button>
           <Link to="/hotels" onClick={() => setIsMenuOpen(false)} className="text-5xl font-serif font-black text-slate-900 tracking-tighter hover:text-[#c5a059] transition-colors">Portfolio</Link>
           <button onClick={() => scrollToSection('about')} className="text-5xl font-serif font-black text-slate-900 text-left tracking-tighter hover:text-[#c5a059] transition-colors">Our Heritage</button>
           <button onClick={() => scrollToSection('contact')} className="text-5xl font-serif font-black text-slate-900 text-left tracking-tighter hover:text-[#c5a059] transition-colors">Get In Touch</button>
           
           <div className="h-px bg-slate-100 w-full" />
           
           {user ? (
             <div className="space-y-8">
               <Link to="/booking-history" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-slate-900 uppercase tracking-tight">Manage Stays</Link>
               <button onClick={handleLogout} className="text-2xl font-black text-rose-500 uppercase tracking-tight">Sign Out</button>
             </div>
           ) : (
             <div className="space-y-6 pt-10">
               <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-2xl font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-100 pb-4">Login</Link>
               <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block w-full py-6 bg-slate-900 text-white text-center rounded-3xl font-black uppercase tracking-[4px] shadow-2xl">Join Collection</Link>
             </div>
           )}
        </div>
      </div>

      <style>{`
        .nav-link-premium {
          position: relative;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          transition: all 0.4s;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .nav-link-premium:hover { color: #c5a059 !important; transform: translateY(-1px); }
        .nav-link-premium::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 50%;
          width: 0;
          height: 1.5px;
          background: #c5a059;
          transition: all 0.4s;
          transform: translateX(-50%);
        }
        .nav-link-premium:hover::after { width: 100%; }
        
        .shadow-premium {
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.08);
        }
      `}</style>
    </nav>
  );
};

export default Navbar;

