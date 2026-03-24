import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  HelpCircle, 
  User, 
  LogOut, 
  Bell, 
  Briefcase, 
  Globe,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
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

  const navLinks = [
    { name: 'Stays', to: '/', icon: <Building size={20} /> },
    { name: 'Bookings', to: '/booking-history', icon: <Briefcase size={20} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] bg-booking-blue text-white shadow-lg">
      <div className="container-booking">
        
        {/* Upper Nav - Brand & Profile */}
        <div className="h-16 md:h-20 flex items-center justify-between">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center gap-2 group">
             <div className="text-2xl md:text-2xl font-black tracking-tighter text-white">
                PK <span className="text-sky-400">UrbanStay</span>
             </div>
          </Link>

          {/* Action Hub - Desktop */}
          <div className="hidden lg:flex items-center gap-6">
             <div className="flex items-center gap-5 text-sm font-bold">
                <button className="flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
                   <span>INR</span>
                </button>
                <button className="flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
                   <Globe size={18} />
                </button>
                <button className="flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
                   <HelpCircle size={18} />
                </button>
                <button className="flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded-md transition-colors text-white font-black">
                   List your property
                </button>
             </div>

             <div className="h-6 w-px bg-white/20 mx-2" />

             {user ? (
               <div className="flex items-center gap-4">
                  <NotificationBell />
                  
                  {/* Role Specific Shortcuts */}
                  {user.role === 'admin' && (
                    <Link to="/admin/dashboard" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
                       <ShieldCheck size={14} className="text-primary-booking" /> Admin Shell
                    </Link>
                  )}
                  {user.role === 'manager' && (
                    <Link to="/manager/dashboard" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
                       <Settings size={14} /> Partner Central
                    </Link>
                  )}

                  {/* Profile Cluster */}
                  <div className="flex items-center gap-3 pl-4 border-l border-white/20">
                     <div className="text-right hidden xl:block">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Welcome back</p>
                        <p className="text-xs font-black truncate max-w-[120px]">{user.name}</p>
                     </div>
                     <button 
                       onClick={handleLogout}
                       className="w-10 h-10 rounded-lg bg-white/10 hover:bg-rose-500/20 text-white flex items-center justify-center transition-all group"
                       title="Sign Out"
                     >
                        <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                     </button>
                  </div>
               </div>
             ) : (
               <div className="flex items-center gap-3">
                  <Link 
                    to="/register" 
                    className="h-10 px-6 bg-white text-[#006ce4] font-bold rounded-md hover:bg-gray-50 flex items-center justify-center shadow-sm text-sm"
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="h-10 px-6 bg-white text-[#006ce4] font-bold rounded-md hover:bg-gray-50 flex items-center justify-center shadow-sm text-sm"
                  >
                    Sign in
                  </Link>
               </div>
             )}
          </div>

          {/* Mobile Access Point */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Categories Row (Simplified) */}
        <div className="hidden lg:flex items-center gap-1 font-bold text-sm h-12 border-t border-white/5">
           {navLinks.map((link) => (
             <Link 
               key={link.to} 
               to={link.to}
               className={`h-full px-5 flex items-center gap-3 border-b-2 transition-all group ${
                 location.pathname === link.to || (link.to === '/' && location.pathname === '/')
                   ? 'border-white bg-white/10' 
                   : 'border-transparent hover:bg-white/5'
               }`}
             >
                <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 uppercase tracking-widest text-[10px]">
                   {link.icon}
                   {link.name}
                </div>
             </Link>
           ))}
        </div>
      </div>

      {/* Mobile Interaction Engine */}
      <div className={`
        lg:hidden fixed inset-0 top-[64px] bg-booking-blue/95 backdrop-blur-3xl transition-all duration-500 z-[999]
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        <div className="flex flex-col p-8 space-y-6">
           <div className="space-y-2 mb-10 border-b border-white/10 pb-6">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Directory</p>
              {navLinks.map((link) => (
                <Link 
                  key={link.to} 
                  to={link.to} 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-5 text-2xl font-black py-4 hover:pl-4 transition-all"
                >
                   {link.icon} {link.name}
                </Link>
              ))}
           </div>

           <div className="space-y-4">
              {user ? (
                <>
                   <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl mb-6">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-xl font-black">
                         {user.name.charAt(0)}
                      </div>
                      <div>
                         <p className="text-lg font-black">{user.name}</p>
                         <p className="text-[10px] font-black uppercase tracking-widest text-sky-400">{user.role}</p>
                      </div>
                   </div>
                   <button 
                     onClick={handleLogout}
                     className="w-full h-16 bg-white/10 text-white rounded-2xl font-black tracking-widest flex items-center justify-center gap-3"
                   >
                      <LogOut size={20} /> SIGN OUT
                   </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                   <Link to="/login" onClick={() => setIsOpen(false)} className="h-14 bg-white text-booking-blue rounded-xl flex items-center justify-center font-black">Sign In</Link>
                   <Link to="/register" onClick={() => setIsOpen(false)} className="h-14 border border-white rounded-xl flex items-center justify-center font-black">Register</Link>
                </div>
              )}
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
