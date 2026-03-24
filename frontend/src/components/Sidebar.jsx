import React from 'react';
import { 
  LayoutDashboard, 
  Hotel, 
  Plus, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/manager/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/manager/dashboard' },
    { id: 'hotels', label: 'My Hotels', icon: Hotel, path: '/manager/hotels' },
    { id: 'add-hotel', label: 'Add New Hotel', icon: Plus, path: '/manager/add-hotel' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/manager/bookings' },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, path: '/manager/analytics' },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, path: '/manager/reviews' },
  ];

  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1000] lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-[1001] w-72 bg-[#1e293b] text-white flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Logo */}
        <div className="h-24 flex items-center justify-between px-8 border-b border-slate-700/50">
           <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight text-[#c5a059]">
                 PK UrbanStay
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">Manager Portal</p>
           </div>
           <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white transition-colors">
              <X size={20} />
           </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto overflow-hidden">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                navigate(item.path);
                if (window.innerWidth < 1024) onClose();
              }}
              className={`
                w-full group flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200
                ${currentPath === item.path 
                  ? 'bg-slate-700/50 text-[#c5a059] shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}
              `}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={currentPath === item.path ? 'text-[#c5a059]' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
              {currentPath === item.path && (
                 <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-700/50">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-rose-400 font-bold text-sm hover:bg-rose-500/10 transition-all active:scale-95 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
