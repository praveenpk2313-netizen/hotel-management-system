import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, ChevronDown, User, Globe, Search, Building2 } from 'lucide-react';
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
    <nav className={`fixed top-0 left-0 w-full z-[1000] py-6 transition-all duration-700 ${scrolled ? 'bg-slate-950/80 backdrop-blur-2xl border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={scrollToTop}
          className="flex items-center gap-3 text-xl md:text-2xl font-serif font-black tracking-tighter text-white group"
        >
          <div className="w-11 h-11 bg-indigo-600 flex items-center justify-center rounded-[1rem] shadow-2xl shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-700 relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <Building2 size={24} className="text-white relative z-10" />
          </div>
          <span className="flex items-baseline leading-none">
             PK <span className="italic ml-2 text-indigo-400 hidden sm:inline text-lg md:text-2xl group-hover:text-white transition-colors">UrbanStay</span>
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-12 font-black text-[10px] uppercase tracking-[0.25em] text-slate-400">
          <Link to="/" className="hover:text-white transition-all relative group">
             Home
             <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full" />
          </Link>
          <Link to="/hotels" className="hover:text-white transition-all relative group">
             Hotels
             <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full" />
          </Link>
          <button onClick={() => scrollToSection('about')} className="hover:text-white transition-all relative group uppercase">
             About
             <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full" />
          </button>
          
          {user?.role === 'manager' && (
            <Link to="/manager/dashboard" className="text-indigo-400 hover:text-white flex items-center gap-2 group">
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
               Manager Portal
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" className="text-rose-400 hover:text-white flex items-center gap-2 group">
               <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
               Admin Panel
            </Link>
          )}
        </div>

        {/* Auth & Actions */}
        <div className="flex items-center gap-8">
          {user ? (
             <div className="flex items-center gap-8">
                {/* Language Toggle */}
                <div className="hidden md:flex items-center bg-white/5 px-2 py-1 rounded-full gap-2 border border-white/10 hover:bg-white/10 transition-colors">
                   <Globe size={12} className="text-indigo-400 ml-2" />
                   <span className="text-[9px] font-black px-2 text-white">EN</span>
                </div>

                <div className="relative">
                   <NotificationBell scrolled={true} />
                </div>

                <div className="hidden md:flex items-center gap-6">
                   <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">
                         {user.name || "Guest User"}
                      </span>
                   </div>
                   <button 
                     onClick={handleLogout}
                     className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-all"
                   >
                      <LogOut size={16} />
                   </button>
                </div>
             </div>
          ) : (
            <Link 
              to="/login" 
              className="px-10 py-3.5 rounded-full bg-white text-slate-900 hover:bg-indigo-600 hover:text-white text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all glow-indigo"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
             {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-white/10 shadow-2xl animate-fade-in flex flex-col pt-6 pb-10 px-8 gap-6 z-[1000] backdrop-blur-3xl bg-slate-950/95">
          <Link to="/" onClick={scrollToTop} className="text-xl font-serif italic text-white border-b border-white/5 pb-4">Home</Link>
          <Link to="/hotels" onClick={() => setIsMenuOpen(false)} className="text-xl font-serif italic text-white border-b border-white/5 pb-4">Hotels Collection</Link>
          <button onClick={() => scrollToSection('about')} className="text-xl font-serif italic text-white border-b border-white/5 pb-4 text-left">The Philosophy</button>
          
          {user?.role === 'manager' && (
            <Link to="/manager/dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-indigo-400 border-b border-white/5 pb-4">Manager Terminal</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-bold text-rose-400 border-b border-white/5 pb-4">Security Terminal</Link>
          )}

          {!user && (
             <Link 
               to="/login" 
               onClick={() => setIsMenuOpen(false)}
               className="mt-4 w-full h-16 bg-indigo-600 text-white flex items-center justify-center rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl glow-indigo"
             >
                Enter Portfolio
             </Link>
          )}

          {user && (
            <div className="pt-4 flex flex-col gap-6">
               <div className="flex items-center justify-between pb-4 border-b border-white/5">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Account Identity</span>
                   <span className="text-sm font-bold text-white">{user.name || "Guest User"}</span>
               </div>
               <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-3 w-full h-16 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-3xl"
               >
                  <LogOut size={16} /> Decommission Session
               </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

