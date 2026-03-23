import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, Eye, EyeOff, Mail, Lock, ShieldCheck } from 'lucide-react';
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
      padding: '2rem'
    }}>
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1050px',
        minHeight: '650px',
        background: 'white',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
        border: '1px solid #f1f5f9'
      }}>
        
        {/* Visual Panel - Relevant Luxury Image */}
        <div style={{
          flex: 1,
          position: 'relative',
          display: window.innerWidth < 900 ? 'none' : 'block'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" 
            alt="Luxury Interior" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            background: 'linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7))',
            padding: '4rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end'
          }}>
             <h2 style={{ color: 'white', fontSize: '3rem', fontWeight: '400', fontFamily: '"Playfair Display", serif', marginBottom: '1rem', lineHeight: '1.2' }}>Discover Perfection<br />In Every Stay.</h2>
             <p style={{ color: 'white', opacity: 0.8, fontSize: '1rem', fontWeight: '300', lineHeight: '1.7', maxWidth: '350px' }}>Your global portal for extraordinary accommodations and world-class hospitality.</p>
          </div>
        </div>

        {/* Clean Form Panel */}
        <div style={{
          flex: 0.9,
          padding: '4rem 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'white'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '3.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <img src="/logo.png" style={{ width: '36px', height: '36px' }} alt="StayNow Logo" />
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', fontFamily: '"Playfair Display", serif' }}>StayNow</span>
             </div>
             <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>Welcome Back</h1>
             <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: '500' }}>Enter your credential details to log in.</p>
          </div>

          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'#fff1f2', color:'#e11d48', padding:'1rem 1.25rem', borderRadius:'16px', marginBottom:'2rem', fontSize:'0.9rem', fontWeight: '600' }}>
               <AlertCircle size={20} /> {error}
            </div>
          )}

          {/* Regular Login */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div className="input-field">
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                   <input type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="clean-input" />
                   <Mail className="field-icon" size={18} />
                </div>
             </div>
             
             <div className="input-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                   <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>Password</label>
                   <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#c5a059', fontWeight: '800', textDecoration: 'none' }}>Forgot?</Link>
                </div>
                <div style={{ position: 'relative' }}>
                   <input type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="clean-input" />
                   <Lock className="field-icon" size={18} />
                   <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                </div>
             </div>

             <button type="submit" disabled={loading} className="clean-submit">
                {loading ? 'Authenticating...' : 'Sign In To Account'}
             </button>
          </form>

          {/* Google Sign In ONLY */}
          <button onClick={() => openOAuthPopup('google')} className="social-pill-btn" style={{ width: '100%', marginTop: '1rem' }}>
             <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
             Continue with Google
          </button>

          <p style={{ textAlign: 'center', marginTop: '3rem', color: '#94a3b8', fontSize: '0.95rem' }}>
             New to StayNow? <Link to="/register" style={{ color: '#0f172a', fontWeight: '800', textDecoration: 'none', marginLeft: '0.4rem' }}>Create Account</Link>
          </p>
        </div>

      </div>

      <style>{`
        .clean-input {
          width: 100%;
          height: 56px;
          padding: 0 1rem 0 3.2rem;
          border-radius: 12px;
          border: 1.5px solid #f1f5f9;
          background: #fdfdfd;
          font-size: 1rem;
          outline: none;
          transition: 0.3s;
          box-sizing: border-box;
          color: #0f172a;
          font-weight: 500;
        }
        .clean-input:focus {
          border-color: #c5a059;
          background: white;
          box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1);
        }
        .field-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          transition: 0.3s;
        }
        .clean-input:focus ~ .field-icon { color: #c5a059; }
        
        .clean-submit {
          height: 60px;
          background: #0f172a;
          color: white;
          border-radius: 12px;
          border: none;
          font-weight: 800;
          font-size: 1.05rem;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
        }
        .clean-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(15, 23, 42, 0.25);
          background: #1e293b;
        }
        .social-pill-btn {
          flex: 1;
          height: 54px;
          border-radius: 12px;
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
        .social-pill-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default Login;
