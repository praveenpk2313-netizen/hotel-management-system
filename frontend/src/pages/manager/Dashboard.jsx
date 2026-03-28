import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../context/AuthContext';
import { getManagerStats, getManagerAnalytics } from '../../redux/slices/managerSlice';
import { 
  TrendingUp, 
  Hotel, 
  Calendar, 
  IndianRupee, 
  ArrowUpRight, 
  Loader2,
  Users,
  Briefcase,
  ArrowRight,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { formatCurrency, formatDate } from '../../utils/helpers';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { stats, analytics, loading, error } = useSelector((state) => state.manager);
  const { user, isInitialized } = useAuth();

  useEffect(() => {
    // Only fetch if we have a valid manager/admin session ready
    if (isInitialized && user && (user.role === 'manager' || user.role === 'admin')) {
      dispatch(getManagerStats());
      dispatch(getManagerAnalytics());
    }
  }, [dispatch, user, isInitialized]);

  const statCards = [
    { title: 'Gross Revenue', value: stats ? formatCurrency(stats.totalRevenue) : '₹0', icon: IndianRupee, trend: '+12.5%', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { title: 'Elite Properties', value: stats?.totalHotels || 0, icon: Hotel, trend: 'Managed', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { title: 'Total Inventory', value: stats?.totalRooms || 0, icon: Briefcase, trend: 'Rooms', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { title: 'Confirmed Stays', value: stats?.totalBookings || 0, icon: Calendar, trend: 'Reservations', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
  ];

  if (!isInitialized || loading || (!stats && !error)) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
         <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center">
            <Hotel size={24} className="text-primary animate-pulse" />
         </div>
      </div>
      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
    </div>
  );

  if (error && !stats) return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-6">
         <TrendingUp size={40} className="rotate-180" />
      </div>
      <h2 className="text-2xl font-serif text-secondary-dark font-bold mb-2">Systems Interrupted</h2>
      <p className="text-gray-500 max-w-sm mb-8">{error}</p>
      <button
        onClick={() => { dispatch(getManagerStats()); dispatch(getManagerAnalytics()); }}
        className="btn-gold"
      >
        Re-establish Connection
      </button>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:border-[#c5a059]/20 transition-all group">
            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-xl flex items-center justify-center shrink-0`}>
              <card.icon size={24} />
            </div>
            
            <div className="min-w-0">
               <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest truncate">{card.title}</p>
               <h3 className="text-2xl font-bold text-slate-900 mt-0.5">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Analytics */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h3 className="text-2xl font-serif text-secondary-dark font-bold">Revenue Performance</h3>
              <p className="text-sm text-gray-400 font-medium">Monthly growth across your portfolio.</p>
            </div>
            <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
               <button className="px-4 py-2 text-xs font-black uppercase text-primary bg-white shadow-sm rounded-lg tracking-wider">Revenue</button>
               <button className="px-4 py-2 text-xs font-black uppercase text-gray-400 hover:text-secondary tracking-wider transition-colors">Bookings</button>
            </div>
          </div>
          
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="_id" 
                  tickFormatter={(m) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m-1]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                />
                <Tooltip 
                  cursor={{stroke: '#c5a059', strokeWidth: 2}}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', padding: '15px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#c5a059" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Stats / Quick Info */}
        <div className="bg-secondary-dark rounded-[2.5rem] p-10 text-white relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[120px] opacity-20 -mr-32 -mt-32" />
           
           <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                 <h3 className="text-2xl font-serif text-white font-bold leading-tight">Property <br /><span className="text-primary italic">Distribution</span></h3>
                 <p className="text-gray-400 text-sm font-medium">Your current occupancy health.</p>
              </div>

              <div className="space-y-6">
                 {[
                   { label: 'Room Occupancy', value: '82%', width: 'w-[82%]', color: 'bg-primary' },
                   { label: 'Staffing Capacity', value: '94%', width: 'w-[94%]', color: 'bg-emerald-500' },
                   { label: 'Customer Satisfaction', value: '4.8/5', width: 'w-[96%]', color: 'bg-blue-500' }
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest overflow-hidden">
                         <span className="opacity-60">{stat.label}</span>
                         <span className="text-primary">{stat.value}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className={`${stat.width} h-full ${stat.color} rounded-full animate-pulse transition-all duration-1000`} />
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10 pt-10">
              <button className="w-full h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center gap-3 font-bold hover:bg-white/20 transition-all group">
                 Open Full Analytics <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </div>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
        <div className="p-8 md:p-10 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-2xl font-serif text-secondary-dark font-bold">Recent Reservations</h3>
            <p className="text-sm text-gray-400 font-medium">Verify and manage latest guest activity.</p>
          </div>
          <button className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-[2px] hover:translate-x-1 transition-transform group">
             Explore All <ArrowRight size={16} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {(!stats?.recentBookings || stats.recentBookings.length === 0) ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-300">
               <Calendar size={60} strokeWidth={1} className="mb-4 opacity-30" />
               <p className="font-bold text-sm tracking-widest uppercase">No pending reservations</p>
            </div>
          ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Guest Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Location</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stay Period</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Revenue</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentBookings?.map((booking) => (
                <tr key={booking._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-black text-primary border-2 border-white">
                          {booking.userId?.name?.charAt(0)}
                       </div>
                       <div>
                          <p className="font-black text-secondary-dark text-sm leading-none mb-1">{booking.userId?.name}</p>
                          <p className="text-xs text-gray-400 font-medium">{booking.userId?.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex items-center gap-2 text-secondary-dark font-bold text-sm">
                       <Hotel size={16} className="text-primary opacity-60" />
                       {booking.hotelId?.name}
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="text-xs font-black text-secondary-dark tracking-tighter">
                       {formatDate(booking.checkInDate)} — {formatDate(booking.checkOutDate)}
                    </div>
                  </td>
                  <td className="px-8 py-7 text-center">
                    <span className="text-emerald-600 font-black text-sm">{formatCurrency(booking.totalPrice)}</span>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="inline-flex items-center gap-1.5 pl-3 pr-4 py-1.5 rounded-full border shadow-sm">
                       <div className={`w-2 h-2 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                       <span className={`text-[10px] font-black uppercase tracking-wider ${booking.status === 'confirmed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {booking.status}
                       </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
