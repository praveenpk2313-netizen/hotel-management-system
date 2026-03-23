import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import api from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
        textAlign: 'center'
      }}>
        
        {status === 'loading' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <Loader2 size={48} className="animate-spin" style={{ color: '#22d3ee' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>Verifying Your Email</h2>
            <p style={{ color: '#64748b' }}>Please wait while we process your request...</p>
          </div>
        )}

        {status === 'success' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%', color: '#10b981' }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>Email Verified!</h2>
            <p style={{ color: '#64748b' }}>{message}</p>
            <Link 
              to="/login" 
              style={{
                marginTop: '1.5rem',
                width: '100%',
                background: '#1e1e1e',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              Sign In Now <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '50%', color: '#ef4444' }}>
              <XCircle size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>Verification Failed</h2>
            <p style={{ color: '#64748b' }}>{message}</p>
            <Link 
              to="/register" 
              style={{
                marginTop: '1.5rem',
                color: '#1e1e1e',
                textDecoration: 'underline',
                fontWeight: '600'
              }}
            >
              Try Registering Again
            </Link>
          </div>
        )}

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default VerifyEmail;
