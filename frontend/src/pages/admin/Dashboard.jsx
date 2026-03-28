import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminStats } from '../../redux/slices/adminSlice';
import { 
  Users, 
  UserCheck, 
  Hotel, 
  CalendarCheck, 
  IndianRupee, 
  TrendingUp, 
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Activity,
  ShieldCheck,
  Zap,
  Star,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    if (user && user.role === 'admin') {
      dispatch(getAdminStats());
    }
  }, [dispatch, user]);

  const statCards = [
    { title: 'Global Revenue', value: stats ? formatCurrency(stats.totalRevenue) : '₹0', icon: IndianRupee, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Active Travelers', value: stats?.userCount || 0, icon: Users, trend: '+5.2%', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { title: 'Verified Partners', value: stats?.managerCount || 0, icon: UserCheck, trend: '+2.1%', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { title: 'Global Properties', value: stats?.hotelCount || 0, icon: Hotel, trend: '+8.4%', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  if (!isInitialized || loading || (!stats && !error)) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
         <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Activity size={24} className="text-primary animate-pulse" />
         </div>
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Consulting Global Oracle...</p>
    </div>
  );

  if (error && !stats) return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-6 font-serif">
         <TrendingUp size={40} className="rotate-180" />
      </div>
      <h2 className="text-2xl font-serif text-secondary-dark font-bold mb-2">Network Synchronization Failed</h2>
      <p className="text-gray-500 max-w-sm mb-8">{error}</p>
      <button onClick={() => dispatch(getAdminStats())} className="btn-gold px-10 py-4">Re-establish Connection</button>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
         <div className="hidden lg:block space-y-1">
            <h1 className="text-2xl md:text-4xl font-serif text-secondary-dark font-black tracking-tight">Executive Terminal</h1>
            <p className="text-[10px] md:text-sm text-gray-400 font-medium">Global platform oversight and operational analytics.</p>
         </div>
         <div className="hidden md:flex items-center gap-3 bg-gray-50 border border-gray-100 p-2 rounded-2xl">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-emerald-500">
               <ShieldCheck size={20} />
            </div>
            <div className="pr-4">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Security Status</p>
               <p className="text-xs font-bold text-secondary-dark leading-none">Optimal Protection</p>
            </div>
         </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 md:p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:border-primary/20 transition-all group">
            <div className={`w-12 h-12 md:w-14 md:h-14 ${card.bg} ${card.color} rounded-xl flex items-center justify-center shrink-0`}>
              <card.icon size={20} md:size={24} />
            </div>
            <div className="min-w-0">
               <p className="text-[10px] font-bold text-slate-400 font-serif uppercase tracking-widest truncate">{card.title}</p>
               <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
        {/* Main Analytics Chart */}
        <div className="xl:col-span-2 bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
           
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-10 relative z-10">
            <div>
              <h3 className="text-lg md:text-2xl font-serif text-secondary-dark font-bold leading-tight">Revenue & <span className="text-primary italic">Volume Velocity</span></h3>
              <p className="text-[10px] md:text-sm text-gray-400 font-medium">Global platform transaction trajectory.</p>
            </div>
            <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
               <button className="px-4 py-2 text-[10px] font-black uppercase text-primary bg-white shadow-sm rounded-lg tracking-wider">Financials</button>
               <button className="px-4 py-2 text-[10px] font-black uppercase text-gray-400 hover:text-secondary tracking-wider transition-colors">Volume</button>
            </div>
          </div>

          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.monthlyStats}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="_id" 
                  tickFormatter={(val) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][val.month - 1]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dy={15} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                   cursor={{stroke: '#c5a059', strokeWidth: 2}}
                   contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', padding: '15px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#c5a059" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" animationDuration={1500} />
                <Area type="monotone" dataKey="bookings" stroke="#1e293b" fill="none" strokeDasharray="5 5" opacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Health Snapshot */}
        <div className="bg-secondary-dark rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-slate-900/20">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
           
           <div className="relative z-10 space-y-10">
              <div className="space-y-4">
                 <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary border border-white/10">
                    <Zap size={24} className="fill-primary" />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-2xl font-serif text-white font-bold leading-tight">Engine <br /><span className="text-primary italic">Health Check</span></h3>
                    <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Real-time vital signs</p>
                 </div>
              </div>

              <div className="space-y-8">
                {[
                  { label: 'Network Integrity', value: '99.9%', width: 'w-[99%]', color: 'bg-emerald-500' },
                  { label: 'Transaction Success', value: '98.4%', width: 'w-[98%]', color: 'bg-primary' },
                  { label: 'Security Firewall', value: 'Active', width: 'w-[100%]', color: 'bg-blue-500' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[2px]">
                      <span className="opacity-50">{item.label}</span>
                      <span className="text-primary">{item.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div className={`${item.width} h-full ${item.color} rounded-full animate-pulse transition-all duration-1000 shadow-[0_0_10px_rgba(197,160,89,0.3)]`}></div>
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="relative z-10 pt-10">
              <button className="w-full h-16 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center gap-3 font-bold hover:bg-white/10 hover:border-white/20 transition-all group overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                 Open Global Control <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>

      {/* Activity Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8">
        {/* Latest Bookings */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full">
           <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                 <h3 className="text-lg md:text-xl font-serif text-secondary-dark font-bold">New Registrations</h3>
                 <p className="text-[10px] md:text-xs text-gray-400 font-medium whitespace-nowrap">Verify cloud accounts.</p>
              </div>
           </div>
           
           <div className="p-4 md:p-8 space-y-3">
              {stats?.recentUsers?.map((u) => (
                <div key={u._id} className="flex items-center justify-between p-5 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-xl hover:shadow-gray-100 transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-lg font-black text-secondary-dark">
                         {u.name?.charAt(0)}
                      </div>
                      <div>
                         <p className="font-black text-secondary-dark text-sm leading-tight mb-1">{u.name}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">{u.email}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border ${u.role === 'manager' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                         {u.role}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Global Reservations Monitoring */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm flex flex-col h-full">
           <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <div>
                 <h3 className="text-lg md:text-xl font-serif text-secondary-dark font-bold">Flow Monitoring</h3>
                 <p className="text-[10px] md:text-xs text-gray-400 font-medium whitespace-nowrap">Real-time stream.</p>
              </div>
           </div>
           
           <div className="p-4 md:p-8 space-y-3">
              {stats?.recentBookings?.map((b) => (
                <div key={b._id} className="flex items-center justify-between p-5 rounded-2xl border border-gray-50 hover:border-primary/20 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                         <Star size={20} className={b.totalPrice > 500 ? 'fill-primary' : ''} />
                      </div>
                      <div>
                         <p className="font-black text-secondary-dark text-sm leading-tight mb-1">{b.userId?.name}</p>
                         <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none truncate max-w-[150px]">{b.hotelId?.name}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-black text-emerald-600 text-sm leading-tight mb-1">{formatCurrency(b.totalPrice)}</p>
                      <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest leading-none">{formatDate(b.createdAt)}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
