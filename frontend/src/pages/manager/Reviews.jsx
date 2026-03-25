import React, { useState, useEffect } from 'react';
import { fetchManagerReviews, replyToReview } from '../../services/api';
import { Star, MessageSquare, Hotel, User, Loader2, Info, Send, X, Activity, Check } from 'lucide-react';
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
      loadReviews();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Loading Guest Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-secondary-dark font-black tracking-tight flex items-center gap-3">
            <MessageSquare className="text-primary" size={32} />
            Guest Sentiment
          </h1>
          <p className="text-gray-400 font-medium">Monitor feedback and craft thoughtful guest responses.</p>
        </div>

        {/* KPI Strip */}
        <div className="flex items-center gap-4">
          <div className="bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Portfolio Rating</p>
            <div className="flex items-center gap-1.5">
              <Star size={16} className="fill-amber-500 text-amber-500" />
              <span className="text-xl font-black text-slate-900">{avgRating}</span>
              <span className="text-xs text-gray-400 font-bold">/ 5.0</span>
            </div>
          </div>
          <div className="bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Reviews</p>
            <span className="text-xl font-black text-slate-900">{reviews.length}</span>
          </div>
          <div className="bg-white border border-gray-100 px-6 py-4 rounded-2xl shadow-sm text-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Responded</p>
            <span className="text-xl font-black text-emerald-600">{reviews.filter(r => r.managerReply).length}</span>
          </div>
        </div>
      </div>

      {/* Reviews Grid */}
      {reviews.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-300 mb-6">
            <Activity size={40} />
          </div>
          <h3 className="text-xl font-serif text-secondary-dark font-bold mb-2">No Guest Feedback Yet</h3>
          <p className="text-gray-400 font-medium text-sm">Reviews from your properties will appear here once submitted.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review._id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500 flex flex-col p-8 relative overflow-hidden">
              {/* Gold accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header: Guest + Rating */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl font-serif font-black text-secondary-dark group-hover:bg-white group-hover:shadow-lg transition-all">
                    {review.userId?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-black text-secondary-dark text-base leading-tight mb-1">{review.userId?.name}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating rating={review.rating} readOnly size={14} />
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">
                    <Star size={10} className="fill-amber-500 text-amber-500" />
                    <span className="text-[10px] font-black text-amber-700">{review.rating?.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Hotel Tag */}
              <div className="flex items-center gap-2 mb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Hotel size={12} className="text-primary" />
                <span className="truncate">{review.hotelId?.name}</span>
              </div>

              {/* Comment Block */}
              <div className="flex-1 bg-gray-50/50 rounded-2xl p-6 border border-gray-50 relative mb-6">
                <MessageSquare className="absolute top-4 right-4 text-gray-100" size={32} />
                <p className="text-sm text-gray-500 font-medium leading-relaxed italic font-serif">
                  "{review.comment}"
                </p>
              </div>

              {/* Manager Reply or Reply Button */}
              {review.managerReply ? (
                <div className="bg-primary/5 border-l-4 border-primary px-6 py-5 rounded-r-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Check size={14} className="text-primary" />
                    <p className="text-[9px] font-black text-primary uppercase tracking-widest">Your Response</p>
                  </div>
                  <p className="text-sm text-secondary-dark font-medium leading-relaxed">{review.managerReply}</p>
                </div>
              ) : (
                <button
                  onClick={() => { setReplyingTo(review); setReplyText(''); }}
                  className="self-end flex items-center gap-2 h-11 px-6 border border-gray-100 bg-white text-secondary-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:border-primary/30 hover:shadow-md hover:text-primary transition-all"
                >
                  <MessageSquare size={14} /> Reply to Guest
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[1000] p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg relative">
            {/* Close */}
            <button
              onClick={() => setReplyingTo(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="space-y-1 mb-8">
              <h3 className="text-2xl font-serif text-secondary-dark font-black">
                Respond to <span className="text-primary italic">{replyingTo.userId?.name}</span>
              </h3>
              <p className="text-sm text-gray-400 font-medium">Craft a professional, thoughtful public response.</p>
            </div>

            {/* Original comment */}
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-8">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Original Comment</p>
              <p className="text-sm text-gray-600 italic font-medium leading-relaxed">"{replyingTo.comment}"</p>
            </div>

            <form onSubmit={handleReplySubmit} className="space-y-6">
              <textarea
                autoFocus
                required
                rows="4"
                placeholder="Write a professional and warm response..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-medium text-secondary-dark placeholder:text-gray-300 focus:bg-white focus:border-primary/30 focus:shadow-xl focus:shadow-primary/5 outline-none transition-all resize-none"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="flex-1 h-13 bg-gray-50 border border-gray-100 text-gray-400 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-colors py-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-[2] h-13 bg-secondary-dark text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-secondary-dark/20 hover:shadow-secondary-dark/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 py-4"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <><Send size={16} /> Dispatch Response</>}
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
