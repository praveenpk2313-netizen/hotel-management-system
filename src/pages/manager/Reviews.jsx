import React, { useState, useEffect } from 'react';
import { fetchManagerReviews, replyToReview } from '../../services/api';
import { Star, MessageSquare, Hotel, User, Loader2, Info, Send, X } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import StarRating from '../../components/StarRating';

const ManagerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = async () => {
    try {
      const { data } = await fetchManagerReviews();
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      await replyToReview(replyingTo._id, replyText);
      setReplyingTo(null);
      setReplyText('');
      loadReviews(); // Refresh
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Guest Reviews</h1>
        <p style={{ color: '#64748b' }}>Manage feedback and respond to guest experiences.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
        {reviews.length === 0 ? (
          <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: '5rem', background: 'white', borderRadius: '24px', border: '1.5px dashed #e2e8f0' }}>
            <Info size={40} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <p style={{ color: '#94a3b8', margin: 0 }}>No reviews yet for your properties.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9', background: 'white', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', border: '1px solid #e2e8f0' }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '700', color: '#1e293b' }}>{review.userId?.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <StarRating rating={review.rating} readOnly size={14} />
                   <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>{review.rating.toFixed(1)} Rating</div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: '700' }}>
                  <Hotel size={16} />
                  <span>{review.hotelId?.name}</span>
                </div>

                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', position: 'relative', border: '1px solid #f1f5f9' }}>
                  <MessageSquare style={{ position: 'absolute', top: '15px', right: '15px', opacity: 0.05 }} size={40} />
                  <p style={{ margin: 0, color: '#475569', lineHeight: '1.6', fontStyle: 'italic', fontSize: '0.95rem' }}>
                    "{review.comment}"
                  </p>
                </div>
              </div>

              {review.managerReply ? (
                <div style={{ padding: '1.25rem', background: '#f0f9ff', borderRadius: '16px', borderLeft: '4px solid #0ea5e9' }}>
                  <p style={{ margin: '0 0 0.4rem 0', fontWeight: '800', fontSize: '0.75rem', color: '#0ea5e9', textTransform: 'uppercase' }}>Your Response</p>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#1e3a8a' }}>{review.managerReply}</p>
                </div>
              ) : (
                <div style={{ marginTop: 'auto', textAlign: 'right' }}>
                   <button 
                    onClick={() => { setReplyingTo(review); setReplyText(''); }}
                    style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', padding: '0.6rem 1.25rem', borderRadius: '10px', transition: '0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'white'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                   >
                    Reply to Guest
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="animate-fade" style={{ background: 'white', padding: '2.5rem', borderRadius: '28px', width: '90%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 className="luxury-font" style={{ fontSize: '1.5rem', margin: 0 }}>Respond to {replyingTo.userId?.name}</h3>
              <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X /></button>
            </div>

            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
               <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Guest Comment:</p>
               <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#1e293b', fontStyle: 'italic' }}>"{replyingTo.comment}"</p>
            </div>

            <form onSubmit={handleReplySubmit}>
              <textarea 
                autoFocus
                required
                rows="4"
                placeholder="Write your professional response..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1.5px solid #e2e8f0', outline: 'none', marginBottom: '1.5rem', fontSize: '0.95rem' }}
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <button type="button" onClick={() => setReplyingTo(null)} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', background: '#f1f5f9', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Cancel</button>
                 <button 
                  type="submit" 
                  disabled={submitting}
                  style={{ flex: 2, padding: '0.8rem', borderRadius: '12px', background: 'var(--primary)', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                 >
                   {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Send size={16} /> Send Reply</>}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerReviews;
