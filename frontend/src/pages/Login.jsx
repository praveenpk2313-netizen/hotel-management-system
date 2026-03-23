import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, Eye, EyeOff, Github, X, ShieldCheck, Mail, Lock } from 'lucide-react';
import api from '../services/api';

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
    const baseURL = api.API_BASE_URL;
    const url = `${baseURL}/auth/${provider}`;
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
      background: '#f8fafc',
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1440px',
        margin: '2rem auto',
        padding: '1rem',
        gap: '2rem'
      }}>
        {/* Visual Side */}
        <div style={{
          flex: 1.2,
          position: 'relative',
          borderRadius: '32px',
          overflow: 'hidden',
          display: window.innerWidth < 900 ? 'none' : 'block',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200" 
            alt="Luxury Hotel"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 60%)',
            padding: '4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}>
             <h2 style={{ 
               color: 'white', 
               fontSize: '3.5rem', 
               fontWeight: '700', 
               fontFamily: '"Playfair Display", serif',
               lineHeight: '1.1',
               marginBottom: '1rem'
             }}>
               Experience<br />The Extraordinary.
             </h2>
             <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', maxWidth: '500px' }}>
               Welcome back to StayNow. Your journey towards a perfect stay continues here.
             </p>
          </div>
        </div>

        {/* Form Side */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem',
          maxWidth: '550px',
          margin: 'auto'
        }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#1e1e1e', color: 'white', padding: '0.5rem', borderRadius: '12px' }}>
                 <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>StayNow</h3>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.8rem' }}>Welcome Back</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Enter your details to access your account.</p>
          </div>

          {error && (
            <div style={{ 
              display:'flex', alignItems:'center', gap:'0.8rem', 
              background:'#fef2f2', color:'#b91c1c', border: '1px solid #fecaca',
              padding:'1rem', borderRadius:'16px', marginBottom:'2rem', fontSize:'0.9rem' 
            }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="modern-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '0.95rem', fontWeight: '600', color: '#1e293b' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#111', fontWeight: '600', textDecoration: 'none' }}>Forgot Password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="modern-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="modern-submit"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.95rem' }}>
            Don't have an account? <Link to="/register" style={{ color: '#111', fontWeight: '700', textDecoration: 'none', marginLeft: '0.4rem' }}>Create Account</Link>
          </p>

          <div style={{ margin: '2.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600' }}>Or continue with</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          </div>

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
        </div>
      </div>

      <style>{`
        .modern-input {
          width: 100%;
          height: 54px;
          padding: 0 1rem 0 3rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: #fff;
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
        }
        .modern-input:focus {
          border-color: #1e1e1e;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.03);
        }
        .modern-submit {
          height: 56px;
          background: #1e1e1e;
          color: white;
          border-radius: 16px;
          border: none;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 1rem;
          box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        }
        .modern-submit:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.3);
        }
        .modern-submit:active {
          transform: translateY(0);
        }
        .social-btn {
          flex: 1;
          height: 54px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          font-weight: 600;
          color: #1e293b;
          cursor: pointer;
          transition: all 0.2s;
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
