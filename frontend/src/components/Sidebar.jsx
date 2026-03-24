import React from 'react';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  UserSquare2, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  Hotel,
  ShieldCheck,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, activeSection, onSectionChange, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const role = user?.role;
    logout();
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/manager/login');
    }
  };

  const managerItems = [
    { id: 'hotels', title: 'Hotels Manager', icon: Hotel },
    { id: 'rooms', title: 'Room Management', icon: BedDouble },
    { id: 'pricing', title: 'Price & Availability', icon: CreditCard },
    { id: 'bookings', title: 'Reservations', icon: CalendarCheck },
  ];

  const adminItems = [
    { id: 'overview', title: 'Admin Overview', icon: LayoutDashboard },
    { id: 'users', title: 'User Management', icon: Users },
    { id: 'hotels', title: 'Global Hotels', icon: Hotel },
    { id: 'analytics', title: 'Revenue Reports', icon: BarChart3 },
  ];

  const menuItems = user?.role === 'admin' ? adminItems : managerItems;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-secondary-dark/60 backdrop-blur-sm z-[100] lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-[280px] bg-secondary-dark text-white p-6 flex flex-col transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="flex items-center justify-between mb-10 px-2 lg:px-4">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-serif text-xl font-bold">P</span>
             </div>
             <div>
                <span className="block text-white font-serif text-lg tracking-wider uppercase leading-none">PK Urban</span>
                <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">Stay Portal</span>
             </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[2px] mb-4 ml-4">
             Management Menu
          </div>
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={`
                w-full group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-200
                ${activeSection === item.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}
              `}
            >
              <div className="flex items-center gap-3.5">
                <item.icon size={20} className={activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-primary transition-colors'} />
                <span className="font-semibold text-sm tracking-tight">{item.title}</span>
              </div>
              {activeSection === item.id && <ChevronRight size={16} className="animate-pulse" />}
            </button>
          ))}
        </nav>

        {/* Footer Profile & Logout */}
        <div className="mt-auto pt-8 border-t border-white/10 space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="relative group">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-black text-xl shadow-lg border-2 border-white/10 overflow-hidden transform group-hover:scale-105 transition-transform">
                  {user?.name?.charAt(0) || 'M'}
               </div>
               <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-secondary-dark rounded-full shadow-sm" />
            </div>
            <div className="flex-1 overflow-hidden">
               <h4 className="text-sm font-bold text-white truncate">{user?.name || 'Manager'}</h4>
               <div className="flex items-center gap-1.5 opacity-60 text-[11px] uppercase tracking-wider font-black text-primary">
                  <ShieldCheck size={12} /> {user?.role || 'Partner'}
               </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 active:scale-95 group"
          >
            <div className="w-8 h-8 rounded-xl bg-red-400/10 flex items-center justify-center group-hover:bg-red-400 group-hover:text-white transition-colors">
               <LogOut size={18} />
            </div>
            <span className="text-sm">Sign Out Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
