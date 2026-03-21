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
import { Loader2, TrendingUp, DollarSign, Users, Award } from 'lucide-react';
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
    { name: 'Hotel A', value: 400 },
    { name: 'Hotel B', value: 300 },
    { name: 'Hotel C', value: 300 },
    { name: 'Hotel D', value: 200 },
  ];

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Business Analytics</h1>
        <p style={{ color: '#64748b' }}>Deep dive into your property performance and revenue trends.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', background: 'white' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Monthly Growth</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>+12.5%</h3>
            <TrendingUp size={16} color="#10b981" />
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', background: 'white' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Avg. Occupancy</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>78%</h3>
            <Users size={16} color="#6366f1" />
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', background: 'white' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Net Revenue</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>{formatCurrency(stats?.totalRevenue * 0.85)}</h3>
            <DollarSign size={16} color="#c5a059" />
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', background: 'white' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Customer Satisfaction</p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ margin: '0.5rem 0', fontSize: '1.5rem' }}>4.8/5.0</h3>
            <Award size={16} color="#f59e0b" />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        {/* Revenue Area Chart */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
          <h3 style={{ margin: '0 0 2rem 0' }}>Revenue Flow</h3>
          <div style={{ height: '350px' }}>
            <ResponsiveContainer>
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#c5a059" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Property Performance (Pie) */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
          <h3 style={{ margin: '0 0 2rem 0' }}>Revenue by Property</h3>
          <div style={{ height: '350px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '2rem' }}>
              {performanceData.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: COLORS[index % COLORS.length] }}></div>
                  <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
