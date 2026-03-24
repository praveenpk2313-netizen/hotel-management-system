import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  HelpCircle, 
  LogOut, 
  Briefcase, 
  Globe,
  Settings,
  LayoutDashboard,
  ShieldCheck,
  Building,
  Plane,
  Car,
  Camera
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
    setIsOpen(false);
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
                <div className="w-6 h-4 bg-[url('https://flagcdn.com/in.svg')] bg-cover bg-center rounded-sm" />
                <button className="flex items-center gap-1 hover:bg-white/10 px-2 py-2 rounded-md transition-colors">
                   <HelpCircle size={18} />
                </button>
                <button className="text-sm font-bold hover:bg-white/10 px-3 py-2 rounded-md transition-colors">
                   List your property
                </button>
             </div>

             {user ? (
               <div className="flex items-center gap-4">
                  <NotificationBell />
                  <div className="flex items-center gap-3 pl-4 border-l border-white/20 font-bold">
                     <div className="text-right hidden xl:block">
                        <p className="text-xs">{user.name}</p>
                     </div>
                     <button 
                       onClick={handleLogout}
                       className="w-10 h-10 rounded bg-white/10 hover:bg-rose-500/20 text-white flex items-center justify-center transition-all group"
                     >
                        <LogOut size={18} />
                     </button>
                  </div>
               </div>
             ) : (
               <div className="flex items-center gap-3">
                  <Link 
                    to="/register" 
                    className="nav-btn-white"
                  >
                    Register
                  </Link>
                  <Link 
                    to="/login" 
                    className="nav-btn-white"
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

        {/* Categories Row (Booking.com style) */}
        <div className="hidden lg:flex items-center gap-2 font-bold text-sm h-14">
           {navLinks.map((link) => (
             <Link 
               key={link.to} 
               to={link.to}
               className={location.pathname === link.to ? 'nav-link-capsule-active' : 'nav-link-capsule'}
             >
                {link.icon}
                {link.name}
             </Link>
           ))}
           <a href="#" className="nav-link-capsule opacity-50 cursor-not-allowed"><Plane size={20} /> Flights</a>
           <a href="#" className="nav-link-capsule opacity-50 cursor-not-allowed"><Car size={20} /> Car rentals</a>
           <a href="#" className="nav-link-capsule opacity-50 cursor-not-allowed"><Camera size={20} /> Attractions</a>
           <a href="#" className="nav-link-capsule opacity-50 cursor-not-allowed hover:bg-transparent">Airport taxis</a>
        </div>
      </div>

      {/* Mobile Interaction Engine */}
      <div className={`
        lg:hidden fixed inset-0 top-[64px] bg-booking-blue/98 backdrop-blur-3xl transition-all duration-500 z-[999]
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        <div className="flex flex-col p-8 h-full">
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

           <div className="space-y-6">
              {user ? (
                <>
                   <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl mb-6">
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
                     className="w-full h-16 bg-white/10 text-white rounded-2xl font-black tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
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
