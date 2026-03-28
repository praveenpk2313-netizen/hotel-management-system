import React, { useState, useEffect } from 'react';
import { 
  createAdminPromotion, 
  fetchAdminHotels, 
  fetchAdminPromotions, 
  deleteAdminPromotion 
} from '../../services/api';
import { 
  Mail, 
  Send, 
  Tag, 
  Calendar, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Megaphone,
  Users,
  Sparkles,
  ArrowRight,
  Globe,
  Hotel,
  Trash2,
  Clock
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const AdminPromotions = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    hotelId: '',
    duration: '7'
  });
  const [hotels, setHotels] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setFetching(true);
      const [hotelsRes, promoRes] = await Promise.all([
        fetchAdminHotels(),
        fetchAdminPromotions()
      ]);
      setHotels(hotelsRes.data);
      setPromotions(promoRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const { data } = await createAdminPromotion(form);
      setSuccess(data.message);
      setForm({ title: '', content: '', hotelId: '', duration: '7' });
      loadData(); // Refresh list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this promotion from landing page and users dashboard?')) return;
    try {
      await deleteAdminPromotion(id);
      setPromotions(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-secondary-dark font-black tracking-tight flex items-center gap-3">
            <Megaphone className="text-primary" size={32} />
            Campaign Control
          </h1>
          <p className="text-gray-400 font-medium">
            Broadcast curated promotions and manage active deals on the landing page.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Broadcast Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

        {/* ── CAMPAIGN FORM (3/5) ── */}
        <div className="xl:col-span-3 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            
            <div className="p-10 border-b border-gray-50 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-serif text-secondary-dark font-bold leading-none mb-1">New Campaign</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global broadcast & landing page feature</p>
              </div>
            </div>

            {/* Alerts */}
            {success && (
              <div className="mx-10 mt-8 flex items-center gap-4 bg-emerald-50 border border-emerald-100 text-emerald-700 px-6 py-5 rounded-2xl">
                <CheckCircle2 size={22} className="shrink-0" />
                <p className="font-bold text-sm">{success}</p>
              </div>
            )}
            {error && (
              <div className="mx-10 mt-8 flex items-center gap-4 bg-rose-50 border border-rose-100 text-rose-700 px-6 py-5 rounded-2xl">
                <AlertCircle size={22} className="shrink-0" />
                <p className="font-bold text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">
                  Campaign Title
                </label>
                <input
                  required
                  type="text"
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="input-premium w-full"
                  placeholder="e.g. 🌴 Summer Flash Sale — 40% OFF Luxury Suites!"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">
                    Apply to Specific Property
                  </label>
                  <div className="relative group">
                    <Hotel className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                    <select
                      value={form.hotelId}
                      onChange={e => setForm({...form, hotelId: e.target.value})}
                      className="input-premium w-full pl-12 appearance-none cursor-pointer"
                    >
                      <option value="">Global Promotion (All Hotels)</option>
                      {hotels.filter(h => h.isApproved).map(h => (
                        <option key={h._id} value={h._id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">
                    Campaign Duration (Days)
                  </label>
                  <div className="relative group">
                    <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={form.duration}
                      onChange={e => setForm({...form, duration: e.target.value})}
                      className="input-premium w-full pl-12"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">
                  Description / Content
                </label>
                <textarea
                  required
                  rows="6"
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  className="input-premium w-full py-5 resize-none"
                  placeholder="Describe the offer highlights..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 bg-secondary-dark text-white font-black rounded-2xl shadow-xl shadow-secondary-dark/20 hover:shadow-secondary-dark/30 active:scale-[0.99] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={22} /> Launching Offer...</>
                ) : (
                  <><Send size={20} /> Create Promotion <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-primary" /></>
                )}
              </button>
            </form>
          </div>

          {/* Active Promotions List */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 bg-gray-50/50">
               <h3 className="text-lg font-serif text-secondary-dark font-bold">Active Campaigns Archive</h3>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Publicly visible on landing page</p>
            </div>
            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
              {fetching ? (
                 <div className="p-20 text-center"><Loader2 className="animate-spin text-primary mx-auto" size={32} /></div>
              ) : promotions.length === 0 ? (
                 <div className="p-12 text-center text-gray-400">No active campaigns found.</div>
              ) : (
                promotions.map(promo => (
                  <div key={promo._id} className="p-8 flex justify-between items-start hover:bg-slate-50 transition-colors group">
                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {promo.hotelId?.name ? `Exclusive @ ${promo.hotelId.name}` : 'Global Collection Offer'}
                       </span>
                       <h4 className="text-lg font-bold text-secondary-dark">{promo.title}</h4>
                       <p className="text-sm text-gray-500 line-clamp-2 max-w-xl">{promo.content}</p>
                       <div className="flex items-center gap-4 pt-2">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                             <Clock size={12} /> Expires: {new Date(promo.expiresAt).toLocaleDateString()}
                          </span>
                       </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(promo._id)}
                      className="p-3 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ── SIDEBAR PANEL (2/5) ── */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Email Preview Card */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden sticky top-8">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-lg font-serif text-secondary-dark font-bold">Live Landing Preview</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">How this deal will look to visitors</p>
            </div>
            <div className="p-8 space-y-6">
              <div className="p-6 bg-slate-900 rounded-3xl border border-white/10 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-[50px] opacity-10" />
                 <div className="relative z-10 space-y-4">
                    <div className="flex justify-between items-start text-white">
                       <div className="p-2 bg-primary/20 rounded-lg text-primary">
                          <Tag size={18} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-[#c5a059]">Active Offer</span>
                    </div>
                    <h4 className="text-xl font-bold text-white leading-tight">
                       {form.title || <span className="text-white/20">Your Catchy Title...</span>}
                    </h4>
                    <p className="text-xs text-gray-400 line-clamp-3">
                       {form.content || <span className="italic opacity-30">Compose description...</span>}
                    </p>
                    <div className="pt-2 flex justify-between items-center text-white">
                       <span className="text-[10px] font-bold text-gray-500">Starts: Today</span>
                       <ArrowRight size={16} className="text-primary" />
                    </div>
                 </div>
              </div>

              <div className="bg-slate-50 border border-dashed border-gray-200 p-6 rounded-3xl">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Target Audience</p>
                 <div className="flex -space-x-3 mb-4">
                    {[1,2,3,4].map(i => (
                       <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img src={`https://i.pravatar.cc/100?u=${i}`} alt="" />
                       </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] font-black text-white">
                       +1k
                    </div>
                 </div>
                 <p className="text-xs font-medium text-gray-500">This campaign will reach over 1.2k verified luxury travelers via email & app push notifications.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPromotions;
