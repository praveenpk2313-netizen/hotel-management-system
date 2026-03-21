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
  Users
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
      // For now, we use the simple send-promotion API. 
      // We can enhance it to include discount and expiry in the future components.
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
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0', color: '#0f172a' }}>Campaign Management</h1>
        <p style={{ color: '#64748b' }}>Drive engagement by blasting promotional offers to your entire guest community.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
        {/* Campaign Form */}
        <div style={{ background: 'white', padding: '3rem', borderRadius: '28px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2.5rem' }}>
             <Megaphone size={28} color="#0ea5e9" />
             <h2 className="luxury-font" style={{ fontSize: '1.8rem', margin: 0 }}>Create New Campaign</h2>
          </div>

          {success && (
            <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={24} /> {success}
            </div>
          )}

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={24} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Campaign Subject</label>
                <input 
                  required 
                  type="text" 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="promotion-input" 
                  placeholder="e.g. 🌴 Summer Resort Flash Sale - 40% OFF!" 
                />
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Discount Code (Optional)</label>
                  <div style={{ position: 'relative' }}>
                    <Tag size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      value={form.discount}
                      onChange={e => setForm({...form, discount: e.target.value})}
                      className="promotion-input" 
                      style={{ paddingLeft: '2.75rem' }}
                      placeholder="SUMMER40" 
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Expiry Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                      type="date" 
                      value={form.expiryDate}
                      onChange={e => setForm({...form, expiryDate: e.target.value})}
                      className="promotion-input" 
                      style={{ paddingLeft: '2.75rem' }}
                    />
                  </div>
                </div>
             </div>

             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.9rem', color: '#1e293b' }}>Email Body (HTML Supported)</label>
                <textarea 
                  required 
                  rows="10" 
                  value={form.content}
                  onChange={e => setForm({...form, content: e.target.value})}
                  className="promotion-input" 
                  style={{ resize: 'none' }}
                  placeholder="Write your beautiful email content here..."
                ></textarea>
             </div>

             <button 
               type="submit" 
               disabled={loading}
               style={{ 
                 marginTop: '1rem', 
                 padding: '1.25rem', 
                 borderRadius: '16px', 
                 background: '#0ea5e9', 
                 color: 'white', 
                 border: 'none', 
                 fontWeight: '800', 
                 fontSize: '1rem', 
                 display: 'flex', 
                 alignItems: 'center', 
                 justifyContent: 'center', 
                 gap: '0.75rem',
                 cursor: loading ? 'not-allowed' : 'pointer',
                 boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
               }}
             >
               {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
               {loading ? 'Processing Broadcast...' : 'Launch Campaign'}
             </button>
          </form>
        </div>

        {/* Live Preview / Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div style={{ background: '#0f172a', padding: '2.5rem', borderRadius: '28px', color: 'white' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} color="#38bdf8" /> Reach Statistics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                 <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800' }}>TOTAL CUSTOMERS</p>
                    <h4 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem' }}>1,248</h4>
                 </div>
                 <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: '800' }}>REACHABLE (VERIFIED)</p>
                    <h4 style={{ margin: '0.5rem 0 0 0', fontSize: '1.5rem', color: '#10b981' }}>1,102</h4>
                 </div>
              </div>
           </div>

           <div style={{ background: 'white', padding: '2.5rem', borderRadius: '28px', border: '1px solid #f1f5f9', flexGrow: 1 }}>
              <h3 style={{ margin: '0 0 1.5rem 0' }}>Email Preview</h3>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                 <div style={{ background: '#f8fafc', padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                       <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
                       <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
                       <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>To: All Customers</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{form.title || 'Draft: Campaign Subject Placeholder'}</p>
                 </div>
                 <div style={{ padding: '2rem', minHeight: '200px', whiteSpace: 'pre-wrap', color: '#475569', fontSize: '0.9rem' }}>
                    {form.content || 'Your promotional message will appear here...'}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .promotion-input { padding: 0.85rem 1.25rem; border: 1.5px solid #e2e8f0; border-radius: 14px; outline: none; transition: 0.2s; font-size: 1rem; width: 100%; }
        .promotion-input:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1); }
      `}</style>
    </div>
  );
};

export default AdminPromotions;
