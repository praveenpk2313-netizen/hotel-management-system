import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, Bell, User, Layout, History, MapPin, Sparkles, ShieldCheck, ChevronDown, ArrowRight } from 'lucide-react';
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
    setIsMenuOpen(false);
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
    <nav className={`fixed top-0 inset-x-0 z-[1000] transition-all duration-500 px-4 md:px-10 py-4 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl shadow-premium py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 p-2 md:p-3 shadow-2xl relative overflow-hidden group">
        
        {/* Navigation Decoration */}
        {scrolled && <div className="absolute inset-0 bg-white opacity-95 transition-opacity" />}
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-4 group/logo relative z-10 pl-4 py-2">
          <div className="w-12 h-12 bg-secondary-dark rounded-2xl flex items-center justify-center p-2 group-hover/logo:rotate-12 transition-transform shadow-lg">
             <img src="/logo.png" className="w-[32px] h-[32px] object-contain" alt="PK UrbanStay" />
          </div>
          <div className="hidden sm:block">
             <h2 className={`text-2xl font-serif font-black italic tracking-tight leading-none transition-colors ${scrolled ? 'text-secondary-dark' : 'text-white'}`}>
                PK UrbanStay
             </h2>
             <p className="text-[9px] font-black text-primary uppercase tracking-[3px] mt-1">Heritage Hospitality</p>
          </div>
        </Link>

        {/* Desktop Interface: Center Links */}
        <div className="hidden lg:flex items-center gap-10 relative z-10 px-6">
          {['home', 'hotels', 'deals', 'about-us', 'contact-us'].map((link) => (
            <button 
              key={link}
              onClick={() => scrollToSection(link)}
              className={`text-[10px] font-black uppercase tracking-[3px] transition-all relative group py-2 ${
                scrolled ? 'text-gray-400 hover:text-secondary-dark' : 'text-white/70 hover:text-white'
              }`}
            >
              {link.replace('-', ' ')}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Right Interface: Identity & Auth */}
        <div className="flex items-center gap-4 relative z-10 pr-2">
          {user ? (
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-gray-50/10 rounded-2xl border border-white/5 group hover:bg-white/80 transition-all cursor-pointer">
                 <NotificationBell scrollMode={scrolled} />
                 <div className="w-px h-6 bg-white/20" />
                 <div className="text-right flex flex-col items-end">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${scrolled ? 'text-secondary-dark' : 'text-white'}`}>{user.name}</span>
                    <span className="text-[8px] font-bold text-primary uppercase tracking-[2px]">{user.role}</span>
                 </div>
                 <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    {user.role === 'manager' ? <Layout size={18} /> : <User size={18} />}
                 </div>
              </div>

              {/* Action Dropdown Alternative for Small Screens */}
              <div className="flex md:hidden items-center gap-2">
                 <NotificationBell scrollMode={scrolled} />
                 <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`w-12 h-12 rounded-2xl flex items-center justify-center ${scrolled ? 'bg-secondary-dark text-white' : 'bg-white text-secondary-dark shadow-xl'}`}>
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                 </button>
              </div>

              <button 
                onClick={handleLogout}
                className={`hidden md:flex items-center gap-3 h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-[2px] transition-all active:scale-95 ${
                  scrolled ? 'bg-secondary-dark text-white hover:bg-primary shadow-lg shadow-black/10' : 'bg-white text-secondary-dark hover:bg-primary hover:text-white shadow-2xl shadow-black/20'
                }`}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className={`text-[10px] font-black uppercase tracking-[3px] px-4 transition-all ${scrolled ? 'text-gray-400 hover:text-secondary-dark' : 'text-white/70 hover:text-white'}`}>
                 Access
              </Link>
              <Link 
                to="/register" 
                className={`flex items-center gap-3 h-12 px-8 rounded-2xl font-black text-[10px] uppercase tracking-[3px] transition-all active:scale-95 ${
                  scrolled ? 'bg-secondary-dark text-white hover:bg-primary shadow-lg shadow-black/10' : 'bg-primary text-white hover:bg-white hover:text-secondary-dark shadow-xl shadow-primary/30'
                }`}
              >
                 Covenant <ArrowRight size={14} className="animate-pulse" />
              </Link>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${scrolled ? 'bg-gray-50 text-secondary-dark border border-gray-100' : 'bg-white/10 text-white border border-white/20'}`}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[2000] lg:hidden animate-fade-in">
           <div className="absolute inset-0 bg-secondary-dark/95 backdrop-blur-2xl" onClick={() => setIsMenuOpen(false)} />
           <div className="relative w-full h-full flex flex-col p-8 space-y-12">
              <div className="flex justify-between items-center pb-10 border-b border-white/5">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-primary/30">
                       <Sparkles size={28} />
                    </div>
                    <div>
                       <h2 className="text-2xl font-serif font-black italic text-white leading-none">PK UrbanStay</h2>
                       <p className="text-[10px] font-black text-primary uppercase tracking-[3px] mt-1">Heritage Hospitality</p>
                    </div>
                 </div>
                 <button onClick={() => setIsMenuOpen(false)} className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10 active:scale-95 transition-all shadow-inner">
                    <X size={28} />
                 </button>
              </div>

              <div className="flex-1 flex flex-col gap-8 justify-center items-center">
                 {['home', 'hotels', 'deals', 'about-us', 'contact-us'].map((link) => (
                   <button 
                     key={link}
                     onClick={() => scrollToSection(link)}
                     className="text-4xl font-serif font-black text-white italic hover:text-primary transition-all transform hover:scale-105 active:scale-95 flex items-center gap-4 capitalize"
                   >
                      {link.replace('-', ' ')} <ChevronDown size={28} className="-rotate-90 opacity-20" />
                   </button>
                 ))}
              </div>

              <div className="pt-10 border-t border-white/5 space-y-6">
                 {user ? (
                   <div className="flex flex-col gap-6">
                      <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10">
                         <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg">
                               <User size={28} />
                            </div>
                            <div>
                               <p className="text-xl font-bold text-white">{user.name}</p>
                               <p className="text-[10px] font-black text-primary uppercase tracking-[2px]">{user.role} Index</p>
                            </div>
                         </div>
                         <NotificationBell scrollMode={false} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <button 
                            onClick={() => { navigate(user.role === 'manager' ? '/manager/dashboard' : '/customer/dashboard'); setIsMenuOpen(false); }}
                            className="h-16 bg-white text-secondary-dark rounded-[1.25rem] font-black text-[10px] uppercase tracking-[3px] flex items-center justify-center gap-3 shadow-lg"
                         >
                            Dashboard <Layout size={18} className="text-primary" />
                         </button>
                         <button 
                            onClick={handleLogout}
                            className="h-16 bg-rose-500/10 text-rose-500 border-2 border-rose-500/20 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[3px] flex items-center justify-center gap-3 shadow-lg"
                         >
                            Logout <LogOut size={18} />
                         </button>
                      </div>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="h-20 bg-white/5 border-2 border-white/10 text-white rounded-[1.5rem] flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-[4px] hover:border-primary transition-all uppercase">
                         Access Lounge <User size={20} className="text-primary" />
                      </Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)} className="h-20 bg-primary text-white rounded-[1.5rem] flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-[4px] shadow-2xl shadow-primary/40 hover:scale-[1.02] transition-all uppercase">
                         Secure Covenant <ShieldCheck size={20} />
                      </Link>
                   </div>
                 )}
              </div>

              <div className="text-center pt-6">
                 <p className="text-[9px] font-black text-gray-600 uppercase tracking-[3px] italic">© {new Date().getFullYear()} PK UrbanStay Hospitality. Universal Covenants Apply.</p>
              </div>
           </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </nav>
  );
};

export default Navbar;
