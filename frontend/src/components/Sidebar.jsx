import React, { useState, useEffect } from 'react';
import { 
  BedDouble, 
  CalendarCheck, 
  CreditCard, 
  LogOut,
  Hotel,
  ShieldCheck,
  ChevronRight,
  X,
  LayoutDashboard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

  const menuItems = [
    { id: 'dashboard', title: 'Intelligence Hub', icon: LayoutDashboard },
    { id: 'hotels', title: 'Property Archive', icon: Hotel },
    { id: 'rooms', title: 'Suite Management', icon: BedDouble },
    { id: 'bookings', title: 'Reservations', icon: CalendarCheck },
  ];

  return (
    <>
      {/* Mobile Glass Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-secondary-dark/60 backdrop-blur-sm z-[2000] lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Primary Management Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[2001] w-72 bg-secondary-dark text-white flex flex-col transition-all duration-500 ease-in-out border-r border-white/5
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Architecture */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-white/5">
             <div className="w-11 h-11 bg-[#006ce4] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#006ce4]/20">
                <ShieldCheck size={24} />
             </div>
             <div>
                <h2 className="text-lg font-black tracking-tighter leading-none text-white">PK UrbanStay</h2>
                <p className="text-[8px] font-black text-[#006ce4] uppercase tracking-[3px] mt-1">Partner Portal</p>
             </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Dynamic Navigation Archive */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-[4px] mb-6 ml-4">
             Operational Index
          </div>
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                if (window.innerWidth < 1024) onClose();
              }}
              className={`
                w-full group flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300
                ${activeSection === item.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white hover:pl-6'}
              `}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} className={activeSection === item.id ? 'text-white' : 'text-gray-500 group-hover:text-primary transition-colors'} />
                <span className="text-[11px] font-black uppercase tracking-widest leading-none">{item.title}</span>
              </div>
              {activeSection === item.id && <ChevronRight size={16} className="animate-pulse" />}
            </button>
          ))}
        </nav>

        {/* Controller Profile & Session Termination */}
        <div className="p-4 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-black text-xl shadow-inner">
               {user?.name?.charAt(0) || 'M'}
            </div>
            <div className="flex-1 overflow-hidden">
               <h4 className="text-xs font-black text-white uppercase tracking-widest truncate">{user?.name || 'Manager'}</h4>
               <div className="flex items-center gap-2 opacity-60 text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> LIVE SESSION
               </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-rose-400 font-black text-[10px] uppercase tracking-[3px] hover:bg-rose-500/10 transition-all active:scale-95 group border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>End Portal Session</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
