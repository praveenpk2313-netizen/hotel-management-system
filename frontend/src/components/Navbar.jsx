import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  Menu, 
  X, 
  User, 
  Layout, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';
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
    navigate('/');
  };

  const menuLinks = [
    { name: 'Properties', to: '/hotels' },
    { name: 'Exclusive Deals', to: '/#deals' },
    { name: 'Heritage Portal', to: '/#about-us' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[2000] px-4 md:px-6 lg:px-10 py-4 transition-all duration-500 ease-in-out ${
      scrolled ? 'translate-y-0' : 'translate-y-2'
    }`}>
      <div className={`max-w-7xl mx-auto flex items-center justify-between rounded-[2.5rem] px-6 py-3 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-2xl shadow-xl shadow-black/5 h-20 border border-white/20' 
          : 'bg-white/10 backdrop-blur-md h-24 border border-white/10'
      }`}>
        
        {/* Brand Identity */}
        <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
          <div className="w-12 h-12 bg-secondary-dark rounded-2xl flex items-center justify-center p-2 shadow-lg group-hover:rotate-12 transition-transform">
             <img 
               src="/logo.png" 
               style={{ width: '32px', height: '32px' }} 
               className="object-contain" 
               alt="PK UrbanStay" 
             />
          </div>
          <div className="hidden sm:block">
             <h2 className={`text-xl font-serif font-black italic tracking-tighter transition-colors leading-none ${
               scrolled ? 'text-secondary-dark' : 'text-white'
             }`}>
                PK UrbanStay
             </h2>
             <p className="text-[8px] font-black text-primary uppercase tracking-[3px] mt-1">Hospitality Group</p>
          </div>
        </Link>

        {/* Desktop Navigation Hub */}
        <div className="hidden lg:flex items-center gap-10">
           {menuLinks.map((link) => (
             <Link 
               key={link.name}
               to={link.to}
               className={`text-[10px] font-black uppercase tracking-[3px] transition-all hover:text-primary relative group ${
                 scrolled ? 'text-secondary-dark/60' : 'text-white/70'
               }`}
             >
                {link.name}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
             </Link>
           ))}
        </div>

        {/* Action Hub */}
        <div className="flex items-center gap-4">
           {user ? (
             <>
               <div className={`hidden md:flex items-center gap-4 px-4 py-2 rounded-2xl border transition-all ${
                 scrolled ? 'bg-gray-50 border-gray-100' : 'bg-white/10 border-white/10'
                }`}>
                  <NotificationBell scrollMode={scrolled} />
                  <div className={`w-px h-6 ${scrolled ? 'bg-gray-200' : 'bg-white/20'}`} />
                  <Link to={user.role === 'manager' ? '/manager/dashboard' : '/customer/dashboard'} className="flex items-center gap-3 group">
                    <div className="text-right">
                       <p className={`text-[10px] font-black uppercase tracking-widest leading-none ${scrolled ? 'text-secondary-dark' : 'text-white'}`}>{user.name}</p>
                       <p className="text-[8px] font-bold text-primary uppercase tracking-[2px] mt-1">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                       {user.role === 'manager' ? <Layout size={18} /> : <User size={18} />}
                    </div>
                  </Link>
               </div>

               <button 
                 onClick={handleLogout}
                 className={`hidden md:flex items-center gap-2 h-12 px-6 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[2px] transition-all active:scale-95 ${
                   scrolled 
                     ? 'bg-secondary-dark text-white hover:bg-rose-500 shadow-lg shadow-black/10' 
                     : 'bg-white text-secondary-dark hover:bg-rose-500 hover:text-white shadow-xl shadow-black/20'
                 }`}
               >
                 <LogOut size={16} /> Logout
               </button>
             </>
           ) : (
             <div className="flex items-center gap-3">
               <Link 
                 to="/login" 
                 className={`hidden sm:block text-[10px] font-black uppercase tracking-[3px] px-4 transition-all hover:text-primary ${
                   scrolled ? 'text-secondary-dark' : 'text-white'
                 }`}
               >
                  Sign In
               </Link>
               <Link 
                 to="/register" 
                 className="flex items-center gap-3 h-12 px-8 rounded-[1.25rem] bg-primary text-white font-black text-[10px] uppercase tracking-[3px] shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
               >
                  Join Us <ArrowRight size={14} />
               </Link>
             </div>
           )}

           {/* Mobile Menu Icon */}
           <button 
             onClick={() => setIsMenuOpen(!isMenuOpen)} 
             className={`lg:hidden w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
               scrolled ? 'bg-gray-100 text-secondary-dark' : 'bg-white/10 text-white border border-white/20'
             }`}
           >
             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </div>

      {/* Modern Full-Screen Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[5000] lg:hidden animate-fade-in">
           <div className="absolute inset-0 bg-secondary-dark/95 backdrop-blur-2xl" onClick={() => setIsMenuOpen(false)} />
           <div className="relative w-full h-full flex flex-col p-8 pt-24 space-y-12">
              <div className="flex flex-col gap-6 items-center text-center">
                 {menuLinks.map((link) => (
                   <Link 
                     key={link.name}
                     to={link.to}
                     onClick={() => setIsMenuOpen(false)}
                     className="text-4xl font-serif font-black italic text-white hover:text-primary transition-all capitalize"
                   >
                      {link.name}
                   </Link>
                 ))}
              </div>
              
              <div className="mt-auto pb-10 flex flex-col gap-6">
                 {!user && (
                   <>
                     <Link to="/login" onClick={() => setIsMenuOpen(false)} className="h-20 bg-white/5 border border-white/10 text-white rounded-[1.5rem] flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-[4px]">
                        Access Lounge <User size={20} className="text-primary" />
                     </Link>
                     <Link to="/register" onClick={() => setIsMenuOpen(false)} className="h-20 bg-primary text-white rounded-[1.5rem] flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-[4px]">
                        Secure Covenant <ShieldCheck size={20} />
                     </Link>
                   </>
                 )}
                 {user && (
                   <button onClick={handleLogout} className="h-20 bg-rose-500 text-white rounded-[1.5rem] flex items-center justify-center gap-4 font-black uppercase text-[10px] tracking-[4px]">
                      Terminate Session <LogOut size={20} />
                   </button>
                 )}
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
