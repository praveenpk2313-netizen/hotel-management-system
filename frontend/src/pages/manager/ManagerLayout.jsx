import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search,
  Menu,
  Bell,
  User,
  Loader2,
  MapPin,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import NotificationBell from '../../components/NotificationBell';
import { useAuth } from '../../context/AuthContext';
import { fetchSuggestions } from '../../services/api';

const ManagerLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Sync active section from URL
  const [activeSection, setActiveSection] = useState('hotels');
  
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'manager') {
      setActiveSection(path);
    }
  }, [location]);

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
    navigate(`/manager/hotels?city=${text}`);
  };

  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    navigate(`/manager/${sectionId}`);
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Sidebar Component */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:ml-0">
        
        {/* Top Header */}
        <header className="h-20 lg:h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-[90]">
          
          {/* Left: Search & Mobile Toggle */}
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 bg-gray-50 rounded-xl text-secondary hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex relative flex-1 group">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Search size={20} />
               </div>
               <input 
                 type="text" 
                 placeholder="Search guest, booking, or city..." 
                 value={searchTerm}
                 onChange={handleSearchChange}
                 className="w-full h-12 pl-12 pr-12 bg-gray-50 border-2 border-transparent rounded-[14px] text-sm font-medium focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
               />
               {loadingSuggestions && (
                 <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin text-primary" />
                 </div>
               )}

               {/* Suggestions Dropdown */}
               {showSuggestions && (suggestions.length > 0) && (
                 <div className="absolute top-[120%] left-0 w-full bg-white rounded-2xl shadow-premium border border-gray-100 py-2 z-[100] animate-fade-in">
                    {suggestions.map((text, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleSuggestionClick(text)}
                        className="w-full px-5 py-3.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm font-600 text-secondary"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                           <MapPin size={16} />
                        </div>
                        {text}
                      </button>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-4 md:gap-7">
             <div className="flex items-center gap-2">
                <NotificationBell />
             </div>
             
             <div className="h-10 w-[1px] bg-gray-100 hidden sm:block" />

             <div className="flex items-center gap-3 pl-2 group cursor-pointer">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-black text-secondary-dark leading-none mb-1">{user?.name || 'Manager'}</p>
                   <div className="flex items-center justify-end gap-1.5 opacity-60">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      <p className="text-[10px] font-black uppercase tracking-wider text-primary">Live Session</p>
                   </div>
                </div>
                <div className="relative group">
                   <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center text-secondary border-2 border-transparent group-hover:border-primary/30 transition-all overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={22} className="opacity-50" />
                      )}
                   </div>
                </div>
                <ChevronDown size={16} className="text-gray-400 group-hover:text-secondary transition-colors" />
             </div>
          </div>
        </header>

        {/* Dynamic Page Content Area */}
        <div className="p-6 md:p-10 lg:p-12 max-w-[1600px] mx-auto w-full flex-1">
          {/* Section Breadcrumb/Title */}
          <div className="mb-10 animate-slide-up">
             <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-[2px] mb-2">
                <CheckCircle2 size={12} /> Partner Central
             </div>
             <h1 className="text-4xl lg:text-5xl font-serif text-secondary-dark capitalize font-bold leading-tight">
                Manage your <span className="text-primary italic">{activeSection}</span>
             </h1>
          </div>
          
          <Outlet />
        </div>

        {/* Footer info */}
        <footer className="px-10 py-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
              &copy; 2026 PK UrbanStay Luxury Collection
           </p>
           <div className="flex gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
           </div>
        </footer>
      </main>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slideUp 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ManagerLayout;
