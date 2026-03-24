import React, { useState, useEffect } from 'react';
import { 
  fetchManagerBookings, 
  updateManagerBookingStatus 
} from '../../services/api';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Calendar, 
  CreditCard,
  Loader2,
  Info,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  MapPin,
  MessageSquare
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const ManagerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const { data } = await fetchManagerBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    
    if (statusFilter !== 'all') {
      result = result.filter(b => b.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.userId?.name.toLowerCase().includes(term) ||
        b.userId?.email.toLowerCase().includes(term) ||
        b.hotelId?.name.toLowerCase().includes(term) ||
        b._id.includes(term)
      );
    }

    setFilteredBookings(result);
  }, [searchTerm, statusFilter, bookings]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateManagerBookingStatus(id, newStatus);
      loadBookings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (loading && bookings.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Syncing Reservations...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-2xl font-serif text-secondary-dark font-black">Reservation Archive</h2>
          <p className="text-gray-400 font-medium text-sm flex items-center gap-2">
            <Zap size={14} className="text-primary" /> Track and manage global guest commitments.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search */}
          <div className="relative group w-full sm:w-80">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
               <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Guest, Property, or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
            />
          </div>

          {/* Filter */}
          <div className="relative group w-full sm:w-auto">
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 h-12 pl-6 pr-12 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-black uppercase tracking-widest text-secondary-dark appearance-none focus:bg-white focus:border-primary/20 transition-all outline-none cursor-pointer"
            >
              <option value="all">Global (All)</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
            <Filter size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {filteredBookings.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-gray-300 mb-6">
               <Calendar size={40} />
            </div>
            <h3 className="text-xl font-serif text-secondary-dark font-bold">No Records Found</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Refine your search parameters to locate specific entries.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div key={booking._id} className="group bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500 overflow-hidden relative">
              
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* 1. Guest Profile (Col 3) */}
                <div className="lg:col-span-3 flex items-center gap-5">
                   <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-xl font-black text-primary border-2 border-white shadow-sm overflow-hidden transform group-hover:rotate-6 transition-transform">
                         {booking.userId?.name?.charAt(0) || 'G'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                         <div className={`w-3 h-3 rounded-full ${booking.paymentStatus === 'paid' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      </div>
                   </div>
                   <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[2px] mb-1">Elite Guest</p>
                      <h4 className="text-lg font-bold text-secondary-dark truncate">{booking.userId?.name}</h4>
                      <p className="text-sm font-medium text-gray-400 truncate flex items-center gap-1.5 mt-0.5">
                         <Mail size={12} className="opacity-60" /> {booking.userId?.email}
                      </p>
                   </div>
                </div>

                {/* 2. Property & Room (Col 3) */}
                <div className="lg:col-span-3 space-y-3">
                   <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-secondary-dark">
                         <MapPin size={16} />
                      </div>
                      <div className="overflow-hidden">
                         <h5 className="text-sm font-black text-secondary-dark truncate">{booking.hotelId?.name}</h5>
                         <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest truncate">{booking.roomId?.type || 'Luxury Suite'}</p>
                      </div>
                   </div>
                   <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[10px] font-black text-secondary uppercase tracking-wider">
                      <Tag size={12} className="text-primary" /> ID: {booking._id.slice(-8)}
                   </div>
                </div>

                {/* 3. Duration & Dates (Col 3) */}
                <div className="lg:col-span-3">
                   <div className="bg-gray-50/50 p-5 rounded-3xl border border-gray-100 flex items-center justify-between group-hover:bg-white group-hover:shadow-sm transition-all">
                      <div className="text-center">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-in</p>
                         <p className="text-xs font-black text-secondary-dark">{formatDate(booking.checkInDate)}</p>
                      </div>
                      <ArrowRight size={14} className="text-primary opacity-40 mx-2" />
                      <div className="text-center">
                         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Check-out</p>
                         <p className="text-xs font-black text-secondary-dark">{formatDate(booking.checkOutDate)}</p>
                      </div>
                   </div>
                </div>

                {/* 4. Financials & Status (Col 2) */}
                <div className="lg:col-span-2 flex flex-col items-start lg:items-end justify-center">
                   <p className="text-2xl font-black text-secondary-dark mb-2">{formatCurrency(booking.totalPrice)}</p>
                   <div className="flex items-center gap-2">
                     <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm border ${
                       booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                       booking.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' : 
                       booking.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                     }`}>
                       <div className={`w-2 h-2 rounded-full ${
                         booking.status === 'confirmed' ? 'bg-emerald-500' : 
                         booking.status === 'cancelled' ? 'bg-rose-500' : 
                         booking.status === 'completed' ? 'bg-blue-500' : 'bg-amber-500'
                       }`} />
                       {booking.status}
                     </span>
                   </div>
                </div>

                {/* 5. Actions (Col 1) */}
                <div className="lg:col-span-1 flex lg:flex-col items-center justify-center gap-3">
                   {booking.status === 'pending' && (
                     <button 
                       onClick={() => handleStatusUpdate(booking._id, 'confirmed')} 
                       className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white shadow-sm hover:shadow-emerald-200 transition-all border border-emerald-100" 
                       title="Confirm Reservation"
                     >
                       <CheckCircle2 size={24} />
                     </button>
                   )}
                   {booking.status === 'confirmed' && (
                     <button 
                       onClick={() => handleStatusUpdate(booking._id, 'completed')} 
                       className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-600 hover:text-white shadow-sm hover:shadow-blue-200 transition-all border border-blue-100" 
                       title="Complete Stay"
                     >
                       <CheckCircle2 size={24} />
                     </button>
                   )}
                   {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                     <button 
                       onClick={() => handleStatusUpdate(booking._id, 'cancelled')} 
                       className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center hover:bg-rose-600 hover:text-white shadow-sm hover:shadow-rose-200 transition-all border border-rose-100" 
                       title="Authorize Cancellation"
                     >
                       <XCircle size={24} />
                     </button>
                   )}
                   <button className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center hover:bg-secondary-dark hover:text-white transition-all shadow-sm border border-gray-100">
                      <MessageSquare size={18} />
                   </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManagerBookings;
