import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!token) {
      setError('Reset token is missing.');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. The link may be invalid or expired.');
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
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
      }}>
        
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          color: '#1e293b', 
          marginBottom: '0.5rem',
          fontFamily: '"Playfair Display", Georgia, serif'
        }}>
          Reset Password
        </h1>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '1rem' }}>
          Please enter your new secure password below.
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
            <p style={{ color: '#15803d', fontWeight: '500', textAlign: 'center' }}>
              {success} Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>New Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="clean-input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: '1rem', top: '50', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter the same password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="clean-input"
                  required
                />
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
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Update Password'}
            </button>
          </form>
        )}

        <style>{`
          .clean-input {
            width: 100%;
            height: 52px;
            padding: 0 1.2rem;
            border-radius: 12px;
            border: 1px solid rgba(0,0,0,0.1);
            background: white;
            font-size: 1rem;
            outline: none;
            box-sizing: border-box;
            transition: all 0.2s;
          }
          .clean-input:focus {
            border-color: #1e1e1e;
            box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
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
          }
          .submit-btn:hover:not(:disabled) {
            background: #2d2d2d;
            transform: translateY(-2px);
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

export default ResetPassword;
