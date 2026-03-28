import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminBookings, cancelBookingAdmin } from '../../redux/slices/adminSlice';
import { 
  CalendarCheck, 
  Search, 
  Hotel, 
  XSquare, 
  Loader2,
  Activity,
  ArrowRight,
  Clock,
  Users
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const BookingMonitoring = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    dispatch(getAdminBookings());
  }, [dispatch]);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchesSearch = (b.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (b.hotelId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b._id.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const statusMap = {
    confirmed: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-500' },
    pending:   { color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   dot: 'bg-amber-500 animate-pulse' },
    cancelled: { color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    dot: 'bg-rose-500' },
  };

  if (loading && bookings.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 font-serif uppercase tracking-widest animate-pulse">Pulling Reservation Ledger...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-serif text-secondary-dark font-black tracking-tight flex items-center gap-3">
            <CalendarCheck className="text-primary hidden sm:block" size={32} />
            Reservation Command
          </h1>
          <p className="text-xs md:text-sm text-gray-400 font-medium">Global platform reservation monitoring.</p>
        </div>

        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto no-scrollbar max-w-full">
          {['all', 'confirmed', 'pending', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 md:px-5 py-2 text-[8px] md:text-[9px] whitespace-nowrap font-black uppercase tracking-widest rounded-xl transition-all ${statusFilter === s ? 'bg-secondary-dark text-white shadow-lg' : 'text-gray-400 hover:text-secondary'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-6 md:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search guest, hotel, or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-12 md:h-14 bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 md:pl-14 pr-6 text-sm font-bold text-secondary-dark placeholder:text-gray-300 focus:bg-white focus:border-primary/30 focus:shadow-xl focus:shadow-primary/5 outline-none transition-all"
            />
          </div>
          <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-2 rounded-full uppercase tracking-widest whitespace-nowrap">
            {filteredBookings.length} Reservations
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
               <tr className="bg-gray-50/50">
                <th className="px-6 md:px-10 py-5 md:py-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Identity</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Property Details</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Revenue</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Period</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-center">Status</th>
                <th className="px-6 md:px-10 py-5 md:py-6 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.map((b) => {
                const st = statusMap[b.status] || statusMap.pending;
                return (
                   <tr key={b._id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 md:px-10 py-5 md:py-7">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                          <CalendarCheck size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">ID</p>
                          <p className="font-black text-secondary-dark text-[11px] md:text-sm font-mono truncate">#{b._id.substr(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-5 md:py-7">
                      <p className="font-black text-secondary-dark text-xs md:text-sm mb-1 truncate">{b.userId?.name || '—'}</p>
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] md:text-xs font-bold truncate">
                        <Hotel size={12} className="text-primary/60 flex-shrink-0" />
                        {b.hotelId?.name || 'Property'}
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-5 md:py-7 whitespace-nowrap">
                      <p className="font-black text-emerald-600 text-sm md:text-base">{formatCurrency(b.totalPrice)}</p>
                    </td>
                    <td className="px-6 md:px-10 py-5 md:py-7 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-secondary-dark text-[10px] md:text-xs font-black">
                        <Clock size={12} className="text-primary/60" />
                        {formatDate(b.checkInDate)}
                      </div>
                    </td>
                    <td className="px-6 md:px-10 py-5 md:py-7 text-center whitespace-nowrap">
                      <div className={`inline-flex items-center gap-2 pl-2 md:pl-3 pr-3 md:pr-4 py-1.5 rounded-full border ${st.bg} ${st.border}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${st.color}`}>{b.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-7 text-right">
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => dispatch(cancelBookingAdmin(b._id))}
                          className="w-11 h-11 bg-rose-50 border border-rose-100 text-rose-400 rounded-xl flex items-center justify-center ml-auto hover:bg-rose-500 hover:text-white transition-all shadow-sm group-hover:opacity-100 opacity-0 translate-x-2 group-hover:translate-x-0 duration-300"
                          title="Cancel Reservation"
                        >
                          <XSquare size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredBookings.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-8">
                <Activity size={48} />
              </div>
              <h3 className="text-2xl font-serif text-secondary-dark font-bold mb-2">Reservation Ledger Clear</h3>
              <p className="text-gray-400 font-medium max-w-xs">No bookings found for the current filter selection.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
          <p className="text-xs text-gray-400 font-medium italic">Displaying all platform reservations — sorted by most recent.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingMonitoring;
