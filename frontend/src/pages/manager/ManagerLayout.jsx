import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search,
  Menu,
  Bell,
  ChevronDown,
  User,
  Loader2
} from 'lucide-react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';

const ManagerLayout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync active section from URL for any local logic
  const [activeSection, setActiveSection] = useState('dashboard');
  
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'manager') {
      setActiveSection(path);
    }
  }, [location]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* ─── SIDEBAR ────────────────────────────────────────────────────────── */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setSidebarOpen(false)}
      />

      {/* ─── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 lg:pl-72">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-[50] flex-shrink-0 shadow-sm">
          
          <div className="flex items-center gap-6 flex-1 max-w-xl">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex relative flex-1">
               <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={18} />
               </div>
                <input 
                  type="text" 
                  placeholder="Search things..." 
                  className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-[#c5a059] focus:ring-2 focus:ring-[#c5a059]/10 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
             <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>

             <div className="flex items-center gap-3 pl-4 border-l border-slate-200 group cursor-pointer">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'Manager'}</p>
                   <p className="text-[11px] font-medium text-slate-500 mt-1">Manager</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#c5a059] flex items-center justify-center text-white shadow-md">
                   {user?.avatar ? (
                     <img src={user.avatar} alt="Profile" className="w-full h-full object-cover rounded-xl" />
                   ) : (
                     <User size={20} />
                   )}
                </div>
             </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto pt-10 pb-20 scroll-smooth">
           <div className="px-6 lg:px-10 max-w-7xl mx-auto">
              
              {/* Header Context */}
              {location.pathname === '/manager/dashboard' && (
                <div className="mb-10 animate-slide-up">
                   <h1 className="text-4xl font-serif text-slate-900 font-bold mb-2">Welcome back, Manager</h1>
                   <p className="text-slate-500 font-medium">Here's what's happening with your properties today.</p>
                </div>
              )}
              
              <div className="animate-fade-in">
                 <Outlet />
              </div>
           </div>
        </div>

        <footer className="h-14 px-10 border-t border-slate-100 bg-white flex justify-between items-center flex-shrink-0 hidden md:flex">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              © {new Date().getFullYear()} PK UrbanStay Hospitality Group
           </p>
           <div className="flex gap-6">
              {['Help Center', 'Privacy', 'Legal'].map((link) => (
                <a key={link} href="#" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-[#c5a059] transition-colors">{link}</a>
              ))}
           </div>
        </footer>
      </main>
    </div>
  );
};

export default ManagerLayout;
