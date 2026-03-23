import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, Eye, EyeOff, Github, Mail, Lock } from 'lucide-react';
import api, { API_BASE_URL } from '../services/api';

const Login = () => {
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPwd,     setShowPwd]     = useState(false);
  const [error,       setError]       = useState('');
  const [loading,     setLoading]     = useState(false);

  const { login } = useAuth();
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error') === 'oauth_failed') {
      setError('OAuth authentication failed. Please try again.');
    }
  }, [searchParams]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_SUCCESS') {
        try {
          const userData = JSON.parse(event.data.payload);
          login(userData);
          navigate(
            userData.role === 'admin'   ? '/admin/dashboard'   :
            userData.role === 'manager' ? '/manager/dashboard' :
            '/customer/dashboard'
          );
        } catch {
          setError('OAuth processing failed.');
        }
      } else if (event.data?.type === 'OAUTH_ERROR') {
        setError(event.data.message || 'OAuth failed.');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [login, navigate]);

  const openOAuthPopup = (provider) => {
    // Ensure we use the correct API_BASE_URL (not the /api suffix)
    const url = `${API_BASE_URL}/auth/${provider}`;
    const w = 500, h = 600;
    const left = window.screenX + (window.outerWidth  - w) / 2;
    const top  = window.screenY + (window.outerHeight - h) / 2;
    window.open(url, `${provider} Login`, `width=${w},height=${h},left=${left},top=${top},popup=true`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    dispatch(loginStart());

    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data);
      const from = location.state?.from || (
        data.role === 'admin'   ? '/admin/dashboard'   :
        data.role === 'manager' ? '/manager/dashboard' :
        '/customer/dashboard'
      );
      navigate(from, { state: location.state, replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      dispatch(loginFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f8fafc',
      padding: '1.5rem',
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        background: 'white',
        borderRadius: '30px',
        padding: '3rem',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
        border: '1px solid #f1f5f9'
      }}>
        
        {/* Branding & Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <img src="/logo.png" alt="StayNow" style={{ width: '42px', height: '42px', objectFit: 'contain' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0, fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}>StayNow</h3>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>Welcome Back</h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Enter your credentials to access your account</p>
        </div>

        {error && (
          <div style={{ 
            display:'flex', alignItems:'center', gap:'0.75rem', 
            background:'#fff1f2', color:'#e11d48', border: '1px solid #ffe4e6',
            padding:'1rem', borderRadius:'16px', marginBottom:'2rem', fontSize:'0.9rem', fontWeight: '600'
          }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group">
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.6rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="name@example.com"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Mail size={18} className="input-icon" />
            </div>
          </div>

          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#c5a059', fontWeight: '800', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Lock size={18} className="input-icon" />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="login-submit">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Social Login Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2.5rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }}></div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }}></div>
        </div>

        {/* Social Login Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => openOAuthPopup('google')} className="social-btn">
             <svg width="20" height="20" viewBox="0 0 24 24">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
             </svg> Google
          </button>
          <button onClick={() => openOAuthPopup('github')} className="social-btn">
             <Github size={20} /> GitHub
          </button>
        </div>

        {/* Register Link */}
        <p style={{ textAlign: 'center', marginTop: '3rem', color: '#94a3b8', fontSize: '0.95rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#0f172a', fontWeight: '800', textDecoration: 'none', marginLeft: '0.4rem' }}>Sign Up</Link>
        </p>

      </div>

      <style>{`
        .login-input {
          width: 100%;
          height: 56px;
          padding: 0 1rem 0 3.2rem;
          border-radius: 16px;
          border: 1.5px solid #f1f5f9;
          background: #f8fafc;
          font-size: 1rem;
          outline: none;
          transition: 0.3s;
          box-sizing: border-box;
          color: #0f172a;
          font-weight: 500;
        }
        .login-input:focus {
          border-color: #c5a059;
          background: white;
          box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1);
        }
        .input-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: 0.3s;
        }
        .login-input:focus + .input-icon {
          color: #c5a059;
        }
        .login-submit {
          height: 60px;
          background: #0f172a;
          color: white;
          border-radius: 16px;
          border: none;
          font-weight: 800;
          font-size: 1.05rem;
          cursor: pointer;
          transition: 0.3s;
          margin-top: 0.5rem;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.15);
        }
        .login-submit:hover:not(:disabled) {
          background: #1e293b;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(15, 23, 42, 0.25);
        }
        .login-submit:disabled { opacity: 0.7; cursor: not-allowed; }
        .social-btn {
          flex: 1;
          height: 54px;
          border-radius: 16px;
          border: 1.5px solid #f1f5f9;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-weight: 700;
          color: #1e293b;
          cursor: pointer;
          transition: 0.3s;
        }
        .social-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default Login;
