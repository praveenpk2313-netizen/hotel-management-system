import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search,
  Menu,
  User,
  Loader2,
  MapPin,
  CheckCircle2,
  ChevronDown,
  X
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
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* ─── SIDEBAR ARCHITECTURE ─────────────────────────────────────────── */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ─── MAIN CANVAS WORKSPACE ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-72">
        
        {/* Top Intelligence Hub */}
        <header className="h-24 bg-white/80 backdrop-blur-2xl border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-[500] flex-shrink-0">
          
          {/* Search Hub & Mobile Toggle */}
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-3 bg-gray-50 rounded-2xl text-secondary-dark hover:bg-gray-100 transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex relative flex-1 group">
               <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Search size={20} />
               </div>
                <input 
                  type="text" 
                  placeholder="Search guests, bookings, or hotels..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full h-12 pl-12 pr-10 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:bg-white focus:border-[#006ce4] focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-900"
                  onFocus={() => { if (searchTerm && suggestions.length > 0) setShowSuggestions(true); }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                />
               {loadingSuggestions && (
                 <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    <Loader2 size={16} className="animate-spin text-primary" />
                 </div>
               )}

               {/* Suggestions Dropdown Engine */}
               {showSuggestions && (suggestions.length > 0) && (
                 <div className="absolute top-[120%] left-0 w-full bg-white rounded-2xl shadow-premium border border-gray-100 py-3 z-[1000] animate-slide-up">
                    {suggestions.map((text, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => handleSuggestionClick(text)}
                        className="w-full px-6 py-4 text-left flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none"
                      >
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                           <MapPin size={18} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-secondary-dark">{text}</span>
                      </button>
                    ))}
                 </div>
               )}
            </div>
          </div>

          {/* User Intelligence Controls */}
          <div className="flex items-center gap-6">
             <NotificationBell />
             <div className="h-10 w-px bg-gray-100 hidden sm:block" />

             <div className="flex items-center gap-4 group cursor-pointer transition-transform active:scale-95">
                <div className="text-right hidden sm:block">
                   <p className="text-[10px] font-black uppercase tracking-[2px] leading-none text-secondary-dark">{user?.name || 'Partner'}</p>
                   <p className="text-[8px] font-bold text-primary uppercase tracking-[2px] mt-1.5 opacity-80">Managing Principal</p>
                </div>
                <div className="w-12 h-12 rounded-[0.95rem] bg-secondary-dark text-white flex items-center justify-center font-black text-xs shadow-xl border-2 border-primary/20 group-hover:rotate-6 transition-transform overflow-hidden">
                   {user?.avatar ? (
                     <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User size={22} className="opacity-80" />
                   )}
                </div>
                <ChevronDown size={14} className="text-gray-300 group-hover:text-primary transition-colors" />
             </div>
          </div>
        </header>

        {/* Workspace Canvas Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-10 pb-32 custom-scrollbar">
           <div className="max-w-[1600px] mx-auto px-6 lg:px-10">
              {/* Dynamic Header Badge/Breadcrumb */}
              <div className="mb-12 animate-slide-up">
                 <div className="flex items-center gap-2 text-[11px] font-bold text-[#003b95] uppercase tracking-wider mb-2">
                    <CheckCircle2 size={14} /> Property Management Portal
                 </div>
                 <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-none">
                    Manage your <span className="text-[#006ce4]">{activeSection}</span>
                 </h1>
              </div>
              
              <div className="animate-fade-in">
                 <Outlet />
              </div>
           </div>
        </div>

        {/* Management Protocol Footer */}
        <footer className="h-16 px-10 border-t border-gray-50 bg-white flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0 animate-fade-in">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none">
              © {new Date().getFullYear()} PK UrbanStay Hospitality Group International.
           </p>
           <div className="flex gap-8">
              {['Documentation', 'Security', 'Privacy Covenants'].map((link) => (
                <a key={link} href="#" className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">{link}</a>
              ))}
           </div>
        </footer>
      </main>
    </div>
  );
};

export default ManagerLayout;
