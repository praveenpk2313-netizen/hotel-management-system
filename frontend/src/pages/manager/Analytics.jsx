import React, { useState, useEffect } from 'react';
import { fetchManagerAnalytics, fetchManagerStats } from '../../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Loader2, 
  IndianRupee, 
  Users, 
  Award,
  Activity,
  ChevronRight,
  Hotel,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const Analytics = () => {
  const [analytics, setAnalytics] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [aRes, sRes] = await Promise.all([
          fetchManagerAnalytics(),
          fetchManagerStats()
        ]);
        setAnalytics(aRes.data);
        setStats(sRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const COLORS = ['#c5a059', '#1e293b', '#6366f1', '#10b981'];

  const performanceData = [
    { name: 'Property Alpha', value: 400 },
    { name: 'Property Beta', value: 300 },
    { name: 'Property Gamma', value: 300 },
    { name: 'Property Delta', value: 200 },
  ];

  const kpiCards = [
    {
      label: 'Monthly Growth',
      value: '+12.5%',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      note: 'vs last month'
    },
    {
      label: 'Avg. Occupancy',
      value: '78%',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      note: 'Portfolio average'
    },
    {
      label: 'Net Revenue',
      value: formatCurrency((stats?.totalRevenue || 0) * 0.85),
      icon: IndianRupee,
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      note: 'After 15% platform fee'
    },
    {
      label: 'Guest Satisfaction',
      value: '4.8 / 5.0',
      icon: Award,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      note: 'Aggregated reviews'
    },
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity size={24} className="text-primary animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-black text-gray-400 uppercase tracking-widest animate-pulse">Compiling Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-serif text-secondary-dark font-black tracking-tight flex items-center gap-3">
          <Activity className="text-primary" size={32} />
          Business Analytics
        </h1>
        <p className="text-gray-400 font-medium">
          Deep dive into property performance and revenue intelligence.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, idx) => (
          <div key={idx} className={`bg-white rounded-2xl p-6 border ${card.border} shadow-sm flex items-center gap-5 hover:shadow-md transition-all group`}>
            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-xl flex items-center justify-center shrink-0`}>
              <card.icon size={24} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate mb-0.5">{card.label}</p>
              <h3 className="text-xl font-black text-slate-900 leading-none mb-1">{card.value}</h3>
              <p className="text-[9px] font-bold text-gray-400 italic truncate">{card.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Revenue Area Chart */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-serif text-secondary-dark font-bold">Revenue Flow</h3>
              <p className="text-sm text-gray-400 font-medium">Monthly portfolio earnings trajectory</p>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:translate-x-0.5 transition-transform">
              Full Report <ChevronRight size={14} />
            </button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="_id"
                  tickFormatter={(m) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]}
                  axisLine={false} tickLine={false}
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={12}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip
                  cursor={{stroke: '#c5a059', strokeWidth: 2}}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', padding: '15px' }}
                />
                <Area
                  type="monotone" dataKey="revenue"
                  stroke="#c5a059" strokeWidth={3}
                  fillOpacity={1} fill="url(#colorRev)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Performance Donut */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-serif text-secondary-dark font-bold">Revenue by Property</h3>
              <p className="text-sm text-gray-400 font-medium">Portfolio share distribution</p>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:translate-x-0.5 transition-transform">
              All Hotels <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="flex items-center gap-8 h-[280px]">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={performanceData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={110}
                    paddingAngle={5} dataKey="value"
                    animationBegin={0} animationDuration={1200}
                  >
                    {performanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', padding: '15px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-col gap-4 shrink-0">
              {performanceData.map((entry, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ background: COLORS[index % COLORS.length] }} />
                  <div>
                    <p className="text-[10px] font-black text-secondary-dark uppercase tracking-wider">{entry.name}</p>
                    <p className="text-[9px] text-gray-400 font-bold">{entry.value} units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Volume Bar Chart */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-serif text-secondary-dark font-bold">Monthly Booking Volume</h3>
            <p className="text-sm text-gray-400 font-medium">Total reservations across entire portfolio</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            <ArrowUpRight size={14} /> +18% YoY Growth
          </div>
        </div>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="_id"
                tickFormatter={(m) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m-1]}
                axisLine={false} tickLine={false}
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={12}
              />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', padding: '15px' }}
              />
              <Bar dataKey="bookings" fill="#1e293b" radius={[8, 8, 0, 0]} animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
