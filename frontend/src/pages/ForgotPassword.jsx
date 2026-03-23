import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setSuccess(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.06)'
      }}>
        
        <Link 
          to="/login" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#64748b',
            textDecoration: 'none',
            fontSize: '0.9rem',
            marginBottom: '2rem',
            fontWeight: '600'
          }}
        >
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
        
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1e293b', 
          marginBottom: '0.5rem',
          fontFamily: '"Playfair Display", Georgia, serif'
        }}>
          Forgot Password?
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1rem', lineHeight: '1.5' }}>
          No worries! Just enter your registered email and we'll send you a secure reset link.
        </p>

        {success ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%', color: '#10b981' }}>
              <CheckCircle2 size={48} />
            </div>
            <p style={{ color: '#15803d', fontWeight: '500', textAlign: 'center', lineHeight: '1.6' }}>
              {success}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="clean-input"
                  required
                />
                <Mail size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.85rem', background: '#fee2e2', padding: '0.8rem', borderRadius: '8px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}

        <style>{`
          .clean-input {
            width: 100%;
            height: 52px;
            padding: 0 3rem 0 1.2rem;
            border-radius: 12px;
            border: 1px solid rgba(0,0,0,0.08);
            background: white;
            font-size: 1rem;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s, box-shadow 0.2s;
          }
          .clean-input:focus {
            border-color: #22d3ee;
            box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.1);
          }
          .submit-btn {
            height: 52px;
            background: #1e1e1e;
            color: white;
            border-radius: 12px;
            border: none;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          }
          .submit-btn:hover:not(:disabled) {
            background: #2d2d2d;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          }
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

export default ForgotPassword;
