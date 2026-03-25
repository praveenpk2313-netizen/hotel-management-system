import React, { useState } from 'react';
import { sendAdminPromotion } from '../../services/api';
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
  Zap
} from 'lucide-react';

const AdminPromotions = () => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    discount: '',
    expiryDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const { data } = await sendAdminPromotion({
        title: form.title,
        content: form.content
      });
      setSuccess(data.message);
      setForm({ title: '', content: '', discount: '', expiryDate: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send promotion');
    } finally {
      setLoading(false);
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
            Broadcast curated promotions to your entire verified guest community.
          </p>
        </div>

        {/* Live pulse indicator */}
        <div className="flex items-center gap-3 bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Broadcast Ready</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">

        {/* ── CAMPAIGN FORM (3/5) ── */}
        <div className="xl:col-span-3 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          
          <div className="p-10 border-b border-gray-50 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-serif text-secondary-dark font-bold leading-none mb-1">New Campaign</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Global email broadcast composer</p>
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
            {/* Campaign Subject */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">
                Campaign Subject Line
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

            {/* Discount + Expiry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">
                  Promo Code (Optional)
                </label>
                <div className="relative group">
                  <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="text"
                    value={form.discount}
                    onChange={e => setForm({...form, discount: e.target.value})}
                    className="input-premium w-full pl-12"
                    placeholder="SUMMER40"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">
                  Offer Expiry Date
                </label>
                <div className="relative group">
                  <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={e => setForm({...form, expiryDate: e.target.value})}
                    className="input-premium w-full pl-12"
                  />
                </div>
              </div>
            </div>

            {/* Email Body */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">
                Email Message Body
              </label>
              <textarea
                required
                rows="10"
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
                className="input-premium w-full py-5 resize-none"
                placeholder="Compose your immersive promotional email message here..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-secondary-dark text-white font-black rounded-2xl shadow-xl shadow-secondary-dark/20 hover:shadow-secondary-dark/30 active:scale-[0.99] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={22} /> Processing Broadcast...</>
              ) : (
                <><Send size={20} /> Launch Campaign <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-primary" /></>
              )}
            </button>
          </form>
        </div>

        {/* ── SIDEBAR PANEL (2/5) ── */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Reach Stats — Dark Panel */}
          <div className="bg-secondary-dark rounded-[2.5rem] p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary rounded-full blur-[80px] opacity-20 -mr-24 -mt-24" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-primary">
                  <Globe size={20} />
                </div>
                <h3 className="text-lg font-serif font-bold">Broadcast Reach</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Accounts</p>
                  <h4 className="text-3xl font-black text-white">1,248</h4>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Verified Email</p>
                  <h4 className="text-3xl font-black text-emerald-400">1,102</h4>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Email Deliverability', value: '98.2%', width: 'w-[98%]', color: 'bg-emerald-500' },
                  { label: 'Avg Open Rate', value: '64%', width: 'w-[64%]', color: 'bg-primary' },
                  { label: 'Click-through Rate', value: '38%', width: 'w-[38%]', color: 'bg-blue-500' },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="opacity-50">{stat.label}</span>
                      <span className="text-primary">{stat.value}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={`${stat.width} h-full ${stat.color} rounded-full transition-all duration-1000`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Email Preview Card */}
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex-1">
            <div className="p-8 border-b border-gray-50">
              <h3 className="text-lg font-serif text-secondary-dark font-bold">Live Preview</h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">See how recipients will view your email</p>
            </div>
            <div className="p-6">
              {/* Mac-style browser bar */}
              <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 bg-white rounded-lg px-3 py-1">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate">
                      To: All Verified Guests
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-serif font-black text-secondary-dark text-base mb-4 leading-tight">
                    {form.title || <span className="text-gray-300 italic font-normal">Campaign Subject Placeholder...</span>}
                  </p>
                  <div className="text-sm text-gray-500 leading-relaxed font-medium whitespace-pre-wrap min-h-[80px]">
                    {form.content || <span className="text-gray-300 italic">Your promotional message...</span>}
                  </div>
                  {form.discount && (
                    <div className="mt-6 inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl">
                      <Tag size={14} />
                      <span className="font-black text-xs uppercase tracking-widest">{form.discount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPromotions;
