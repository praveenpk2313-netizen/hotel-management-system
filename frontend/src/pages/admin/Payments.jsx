import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminPayments } from '../../redux/slices/adminSlice';
import { 
  CreditCard, 
  Search, 
  TrendingUp, 
  Loader2,
  Calendar,
  User,
  Activity,
  DollarSign,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/helpers';

const PaymentManagement = () => {
  const dispatch = useDispatch();
  const { payments, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getAdminPayments());
  }, [dispatch]);

  const filteredPayments = (payments || []).filter(p =>
    (p.userId?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.razorpayOrderId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = (payments || []).reduce((s, p) => s + (p.amount || 0), 0);
  const paidCount = (payments || []).filter(p => p.paymentStatus === 'paid').length;

  if (loading && (!payments || payments.length === 0)) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 font-serif uppercase tracking-widest animate-pulse">Auditing Financial Ledger...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-10">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl font-serif text-secondary-dark font-black tracking-tight flex items-center gap-3">
          <DollarSign className="text-primary" size={32} />
          Financial Audit
        </h1>
        <p className="text-gray-400 font-medium">Detailed tracking of platform revenue and individual transactions.</p>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Processed</p>
            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(totalRevenue)}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Zap size={24} className="fill-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Confirmed Payments</p>
            <h3 className="text-2xl font-black text-slate-900">{paidCount}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Transactions</p>
            <h3 className="text-2xl font-black text-slate-900">{(payments || []).length}</h3>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-8 md:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search customer or transaction ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl pl-14 pr-6 text-sm font-bold text-secondary-dark placeholder:text-gray-300 focus:bg-white focus:border-primary/30 focus:shadow-xl focus:shadow-primary/5 outline-none transition-all"
            />
          </div>
          <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-2 rounded-full uppercase tracking-widest whitespace-nowrap">
            {filteredPayments.length} Records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Order Ref</p>
                        <p className="font-black text-secondary-dark text-xs font-mono truncate max-w-[160px]">{payment.razorpayOrderId || 'SYSTEM_PAYMENT'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg font-serif font-black text-secondary-dark">
                        {payment.userId?.name?.charAt(0) || '?'}
                      </div>
                      <p className="font-black text-secondary-dark text-sm">{payment.userId?.name || '—'}</p>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <p className={`text-base font-black ${payment.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {formatCurrency(payment.amount)}
                    </p>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-2 text-gray-500 text-xs font-bold">
                      <Calendar size={14} className="text-primary/60" />
                      {formatDate(payment.createdAt)}
                    </div>
                  </td>
                  <td className="px-10 py-7 text-center">
                    <div className={`inline-flex items-center gap-2 pl-3 pr-4 py-1.5 rounded-full border ${
                      payment.paymentStatus === 'paid'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                        : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${payment.paymentStatus === 'paid' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{payment.paymentStatus}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPayments.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-8">
                <Activity size={48} />
              </div>
              <h3 className="text-2xl font-serif text-secondary-dark font-bold mb-2">No Transactions Found</h3>
              <p className="text-gray-400 font-medium max-w-xs">The financial ledger is clear for this search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
