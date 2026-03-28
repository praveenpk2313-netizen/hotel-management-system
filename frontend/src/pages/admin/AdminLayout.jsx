import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Users, 
  Hotel, 
  CalendarCheck, 
  CreditCard, 
  MessageSquare, 
  Mail, 
  LogOut, 
  LayoutDashboard,
  ShieldCheck,
  Bell,
  Search,
  User as UserIcon,
  Menu,
  X,
  MapPin,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from '../../components/NotificationBell';
import { fetchSuggestions } from '../../services/api';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    if (val.length >= 2) {
      setLoadingSuggestions(true);
      try {
        const { data } = await fetchSuggestions(val);
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (text) => {
    setSearchTerm(text);
    setShowSuggestions(false);
    navigate(`/admin/hotels?hotel=${text}`);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Hotels', path: '/admin/hotels', icon: <Hotel size={20} /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquare size={20} /> },
    { name: 'Promotions', path: '/admin/promotions', icon: <Mail size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* ─── SIDEBAR ───────────────────────────────────────────────────────── */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[1000] bg-secondary-dark text-white transition-all duration-300 ease-in-out lg:relative lg:block ${
          isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 lg:w-20 -translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full bg-secondary-dark/95 backdrop-blur-xl border-r border-white/5">
          {/* Logo Section */}
          <div className="h-24 flex items-center px-6 border-b border-white/5">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 flex-shrink-0">
                  <ShieldCheck size={24} />
               </div>
               {isSidebarOpen && (
                 <div className="animate-fade-in whitespace-nowrap">
                    <h2 className="text-lg font-serif font-black italic tracking-tighter leading-none">StayNow</h2>
                    <p className="text-[8px] font-black text-primary uppercase tracking-[3px] mt-1">Admin Terminal</p>
                 </div>
               )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200
                  ${isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }
                  ${!isSidebarOpen && 'lg:justify-center lg:px-0'}
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {isSidebarOpen && (
                  <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                )}
                {!isSidebarOpen && isSidebarOpen && (
                   <div className="absolute left-full ml-4 px-3 py-1 bg-white text-secondary-dark text-[10px] font-black rounded-lg opacity-0 group-hover:opacity-100 shadow-xl transition-opacity pointer-events-none">
                      {item.name}
                   </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-white/5">
            <button 
              onClick={handleLogout}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-all ${
                !isSidebarOpen && 'lg:justify-center'
              }`}
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ARCHITECTURE ─────────────────────────────────────── */}
       <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Intelligence Bar */}
        <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-2xl border-b border-gray-100 flex items-center justify-between px-4 lg:px-10 flex-shrink-0 z-[500]">
           <div className="flex items-center gap-4 lg:gap-8 flex-1">
              <button 
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-secondary-dark hover:bg-gray-100 transition-colors lg:hidden"
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              {/* Internal Search Engine */}
              <div className="hidden md:flex items-center gap-3 bg-gray-50/80 px-4 py-2.5 rounded-2xl border border-gray-100 max-w-md w-full focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/20 transition-all relative">
                 <Search size={18} className="text-gray-400" />
                 <input 
                   type="text" 
                   placeholder="Audit users, bookings, archives..." 
                   className="bg-transparent border-none outline-none text-xs font-bold w-full text-secondary-dark placeholder:text-gray-400"
                   value={searchTerm}
                   onChange={handleSearchChange}
                   onFocus={() => { if (searchTerm && suggestions.length > 0) setShowSuggestions(true); }}
                   onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                 />
                 {loadingSuggestions && <Loader2 size={16} className="animate-spin text-primary" />}
                 
                 {showSuggestions && suggestions.length > 0 && (
                   <div className="absolute top-[120%] left-0 w-full bg-white rounded-2xl shadow-premium border border-gray-100 py-3 animate-slide-up z-[1000]">
                      {suggestions.map((text, idx) => (
                        <div 
                          key={idx} onClick={() => handleSuggestionClick(text)}
                          className="px-6 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-4 text-xs font-bold text-secondary-dark border-b border-gray-50 last:border-none"
                        >
                          <MapPin size={14} className="text-gray-300" />
                          {text}
                        </div>
                      ))}
                   </div>
                 )}
              </div>
           </div>

           <div className="flex items-center gap-6">
              <NotificationBell />
              <div className="w-px h-8 bg-gray-100" />
              <div className="flex items-center gap-4 group cursor-pointer">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none text-secondary-dark">{user?.name}</p>
                    <p className="text-[8px] font-bold text-primary uppercase tracking-[2px] mt-1">System Controller</p>
                 </div>
                 <div className="w-11 h-11 bg-secondary-dark rounded-[0.8rem] flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                    <ShieldCheck size={20} />
                 </div>
              </div>
           </div>
        </header>

         {/* Dynamic Canvas Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-6 lg:pt-8 pb-32 custom-scrollbar">
           <div className="max-w-[1600px] mx-auto px-4 lg:px-10">
              <div className="animate-fade-in">
                 <Outlet />
              </div>
           </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[900] lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
