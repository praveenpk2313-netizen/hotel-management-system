import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminPayments } from '../../redux/slices/adminSlice';
import { 
  CreditCard, 
  Search, 
  TrendingUp, 
  Loader2,
  Calendar,
  User
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

  if (loading && payments.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={40} color="#0ea5e9" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Financial Audit</h1>
        <p style={{ color: '#64748b' }}>Detailed tracking of platform revenue and individual transactions.</p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '14px', marginBottom: '2.5rem', border: '1px solid #e2e8f0' }}>
          <Search size={18} color="#94a3b8" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ background: 'none', border: 'none', paddingLeft: '1rem', outline: 'none', width: '100%' }} 
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '1.25rem', color: '#64748b' }}>TRANSACTION</th>
                <th style={{ padding: '1.25rem', color: '#64748b' }}>CUSTOMER</th>
                <th style={{ padding: '1.25rem', color: '#64748b' }}>AMOUNT</th>
                <th style={{ padding: '1.25rem', color: '#64748b' }}>DATE</th>
                <th style={{ padding: '1.25rem', color: '#64748b' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                     <p style={{ margin: 0, fontWeight: '700', fontSize: '0.9rem' }}>{payment.razorpayOrderId || 'SYSTEM'}</p>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={16} color="#64748b" />
                      <p style={{ margin: 0, fontWeight: '600' }}>{payment.userId?.name}</p>
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <span style={{ fontWeight: '800', color: payment.paymentStatus === 'paid' ? '#10b981' : '#f59e0b' }}>
                      {formatCurrency(payment.amount)}
                    </span>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.8rem' }}>
                      <Calendar size={14} /> {formatDate(payment.createdAt)}
                    </div>
                  </td>
                  <td style={{ padding: '1.5rem 1.25rem' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '30px', 
                      fontSize: '0.65rem', 
                      fontWeight: '800', 
                      background: payment.paymentStatus === 'paid' ? '#dcfce7' : '#fef9c3',
                      color: payment.paymentStatus === 'paid' ? '#166534' : '#854d0e',
                    }}>
                      {payment.paymentStatus.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;
