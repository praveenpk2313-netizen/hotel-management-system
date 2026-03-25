import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAdminHotels, 
  updateHotelStatusAdmin, 
  deleteHotelAdmin 
} from '../../redux/slices/adminSlice';
import { 
  Hotel, 
  MapPin, 
  User, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Loader2,
  AlertTriangle,
  Search,
  Check,
  X,
  ExternalLink,
  Star,
  Activity,
  ArrowRight
} from 'lucide-react';

const HotelApproval = () => {
  const dispatch = useDispatch();
  const { hotels, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(getAdminHotels());
  }, [dispatch]);

  const filteredHotels = hotels.filter(h => {
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'pending' && !h.isApproved) || 
                         (statusFilter === 'approved' && h.isApproved);
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading && hotels.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 font-serif uppercase tracking-widest animate-pulse">Surveying Global Estates...</p>
    </div>
  );

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-secondary-dark font-black tracking-tight flex items-center gap-3">
             <Hotel className="text-primary" size={32} />
             Property Moderation
          </h1>
          <p className="text-gray-400 font-medium">Approve or reject property listings across the platform.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
           {['all', 'pending', 'approved'].map((s) => (
             <button
               key={s}
               onClick={() => setStatusFilter(s)}
               className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter === s ? 'bg-secondary-dark text-white shadow-lg shadow-black/10' : 'text-gray-400 hover:text-secondary'}`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      {/* Grid Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
         <div className="relative w-full max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by hotel name or city..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-14 pr-6 text-sm font-bold text-secondary-dark placeholder:text-gray-300 focus:border-primary/30 focus:shadow-xl focus:shadow-primary/5 outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-2 rounded-full uppercase tracking-widest">
               {filteredHotels.length} Properties in queue
            </span>
         </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredHotels.map((hotel) => (
          <div key={hotel._id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500 flex flex-col">
            {/* Image Overlay Section */}
            <div className="relative h-[280px] overflow-hidden">
               <img 
                 src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200"} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                 alt={hotel.name} 
               />
               
               {/* Header Badges */}
               <div className="absolute top-6 left-6 flex gap-2">
                 {!hotel.isApproved ? (
                    <div className="px-3 py-1.5 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">Pending Validation</div>
                 ) : (
                    <div className="px-3 py-1.5 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-lg">Verified Asset</div>
                 )}
               </div>

               {/* Quick Info Overlay */}
               <div className="absolute bottom-6 left-6 right-6 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                     <span className="opacity-60">Manager Identity</span>
                     <span className="text-primary">{hotel.managerId?.name || 'Partner Account'}</span>
                  </div>
               </div>

               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
            </div>

            {/* Content Section */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                 <div>
                    <h3 className="text-2xl font-serif text-secondary-dark font-black hover:text-primary transition-colors cursor-pointer">{hotel.name}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 font-serif text-sm font-bold mt-1.5">
                       <MapPin size={14} className="text-primary" />
                       {hotel.city}, {hotel.location}
                    </div>
                 </div>
                 <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-100">
                    <Star size={14} className="text-amber-500 fill-amber-500 outline-none" />
                    <span className="text-[10px] font-black text-amber-700">NEW</span>
                 </div>
              </div>

              <div className="space-y-4 mb-8">
                 <div className="flex items-center justify-between py-2 border-b border-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Registry Address</span>
                    <span className="text-secondary-dark truncate ml-4 max-w-[150px]">{hotel.address}</span>
                 </div>
              </div>

              {/* Action Ecosystem */}
              <div className="mt-auto pt-6 flex gap-3">
                 {!hotel.isApproved ? (
                   <button 
                     onClick={() => dispatch(updateHotelStatusAdmin({ id: hotel._id, status: 'approved' }))}
                     className="flex-[3] h-12 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                   >
                     <CheckCircle2 size={16} /> Authorize Property
                   </button>
                 ) : (
                   <button 
                     onClick={() => dispatch(updateHotelStatusAdmin({ id: hotel._id, status: 'rejected' }))}
                     className="flex-[3] h-12 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-900/10 hover:bg-black transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
                   >
                     <XCircle size={16} /> De-authorize
                   </button>
                 )}
                 <button 
                   onClick={() => dispatch(deleteHotelAdmin(hotel._id))}
                   className="flex-1 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredHotels.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-[3rem] flex items-center justify-center text-gray-200 mb-8">
                <Activity size={48} />
             </div>
             <h3 className="text-2xl font-serif text-secondary-dark font-bold mb-2">Portfolio Clear</h3>
             <p className="text-gray-400 font-medium max-w-sm">No new property registrations are currently awaiting validation in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelApproval;
