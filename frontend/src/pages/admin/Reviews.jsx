import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminReviews, deleteReviewAdmin } from '../../redux/slices/adminSlice';
import { 
  Star, 
  Trash2, 
  Search, 
  User, 
  Hotel, 
  Loader2,
  ShieldAlert
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const ReviewModeration = () => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAdminReviews());
  }, [dispatch]);

  const filteredReviews = reviews.filter(r => 
    r.comment.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.hotelId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && reviews.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={40} color="#0ea5e9" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Review Moderation</h1>
        <p style={{ color: '#64748b' }}>Maintain platform integrity by moderating guest feedback.</p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '14px', marginBottom: '2.5rem', border: '1px solid #e2e8f0' }}>
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search reviews..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'none', border: 'none', paddingLeft: '1rem', outline: 'none', width: '100%' }} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {filteredReviews.map((review) => (
            <div key={review._id} style={{ 
              padding: '1.5rem', 
              borderRadius: '20px', 
              border: '1px solid #f1f5f9', 
              background: '#f8fafc' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={18} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{review.userId?.name}</p>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8' }}>{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '20px', fontWeight: '800', fontSize: '0.7rem' }}>
                  <Star size={14} fill="#d97706" /> {review.rating.toFixed(1)}
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                <Hotel size={14} style={{ marginRight: '4px' }} /> {review.hotelId?.name}
              </div>

              <p style={{ fontSize: '0.9rem', color: '#4a5568', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                "{review.comment}"
              </p>

              <div style={{ textAlign: 'right' }}>
                <button 
                  onClick={() => dispatch(deleteReviewAdmin(review._id))}
                  style={{ padding: '8px 16px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444', border: 'none', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewModeration;
