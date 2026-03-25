import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminReviews, deleteReviewAdmin } from '../../redux/slices/adminSlice';
import { 
  Star, 
  Trash2, 
  Search, 
  Hotel, 
  Loader2,
  ShieldAlert,
  MessageSquare,
  Activity,
  Check
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const ReviewModeration = () => {
  const dispatch = useDispatch();
  const { reviews, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    dispatch(getAdminReviews());
  }, [dispatch]);

  const filteredReviews = reviews.filter(r => {
    const matchesRating = ratingFilter === 'all' || Math.floor(r.rating) === parseInt(ratingFilter);
    const comment = r.comment || '';
    const name = r.userId?.name || '';
    const hotelName = r.hotelId?.name || '';
    const matchesSearch = comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotelName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading && reviews.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 font-serif uppercase tracking-widest animate-pulse">Scanning Guest Commentary...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-secondary-dark font-black tracking-tight flex items-center gap-3">
            <MessageSquare className="text-primary" size={32} />
            Intelligence Moderation
          </h1>
          <p className="text-gray-400 font-medium">Maintain platform integrity by auditing guest feedback.</p>
        </div>

        {/* Rating Filter Pills */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          <button onClick={() => setRatingFilter('all')} className={`px-5 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${ratingFilter === 'all' ? 'bg-secondary-dark text-white shadow-lg' : 'text-gray-400 hover:text-secondary'}`}>All</button>
          {[5, 4, 3, 2, 1].map(n => (
            <button key={n} onClick={() => setRatingFilter(String(n))}
              className={`px-3 py-2 text-[9px] font-black rounded-xl flex items-center gap-1 transition-all ${ratingFilter === String(n) ? 'bg-amber-500 text-white shadow-lg' : 'text-gray-400 hover:text-amber-500'}`}>
              <Star size={10} className={ratingFilter === String(n) ? 'fill-white' : ''} />{n}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
            <Star size={24} className="fill-amber-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Platform Avg Rating</p>
            <h3 className="text-2xl font-black text-slate-900">{avgRating} <span className="text-sm text-gray-400 font-bold">/ 5.0</span></h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Reviews</p>
            <h3 className="text-2xl font-black text-slate-900">{reviews.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <Check size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">5-Star Reviews</p>
            <h3 className="text-2xl font-black text-slate-900">{reviews.filter(r => r.rating >= 4.5).length}</h3>
          </div>
        </div>
      </div>

      {/* Search + Grid */}
      <div className="space-y-8">
        <div className="relative w-full max-w-lg group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search by guest, hotel, or comment..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-14 pr-6 text-sm font-bold text-secondary-dark placeholder:text-gray-300 focus:border-primary/30 focus:shadow-xl focus:shadow-primary/5 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredReviews.map((review) => (
            <div key={review._id} className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500 flex flex-col p-8 relative overflow-hidden">
              {/* Gold accent top bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-2xl font-serif font-black text-secondary-dark group-hover:bg-white group-hover:shadow-lg transition-all">
                    {review.userId?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-black text-secondary-dark leading-tight mb-1">{review.userId?.name || 'Anonymous'}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3.5 py-2 rounded-xl">
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                  <span className="text-sm font-black text-amber-700">{review.rating ? review.rating.toFixed(1) : '—'}</span>
                </div>
              </div>

              {/* Hotel Tag */}
              <div className="flex items-center gap-2 mb-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Hotel size={12} className="text-primary" />
                <span className="truncate">{review.hotelId?.name || 'Property Unlisted'}</span>
              </div>

              {/* Comment */}
              <blockquote className="flex-1 text-sm text-gray-500 italic font-serif leading-relaxed mb-8 border-l-4 border-gray-100 pl-5">
                "{review.comment}"
              </blockquote>

              {/* Action */}
              <div className="flex justify-end">
                <button
                  onClick={() => dispatch(deleteReviewAdmin(review._id))}
                  className="flex items-center gap-2 h-10 px-5 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                >
                  <Trash2 size={14} /> Remove Review
                </button>
              </div>
            </div>
          ))}
          
          {filteredReviews.length === 0 && (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-200 mb-8">
                <Activity size={48} />
              </div>
              <h3 className="text-2xl font-serif text-secondary-dark font-bold mb-2">Moderation Queue Clear</h3>
              <p className="text-gray-400 font-medium max-w-sm">No reviews found matching the current filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModeration;
