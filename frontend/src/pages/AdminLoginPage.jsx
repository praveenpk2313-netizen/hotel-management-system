import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Github, X } from 'lucide-react';
import api, { getApiErrorMessage } from '../services/api';

const AdminLoginPage = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login }  = useAuth();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      window.history.replaceState({}, document.title);
    }
    if (searchParams.get('error') === 'oauth_failed') {
      setError('OAuth authentication failed. Please try again or use email login.');
    }
  }, [location.state, searchParams]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === 'OAUTH_SUCCESS') {
        try {
          const userData = JSON.parse(event.data.payload);
          if (userData.role !== 'admin') {
            setError(`Access denied. Your account (${userData.email}) does not have Administrator privileges.`);
            return;
          }
          login(userData);
          navigate('/admin/dashboard');
        } catch {
          setError('Failed to process OAuth data. Please try again.');
        }
      } else if (event.data?.type === 'OAUTH_ERROR') {
        setError(event.data.message || 'OAuth authentication failed.');
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
    setSuccess('');
    setLoading(true);
    dispatch(loginStart());

    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.role !== 'admin') {
        const msg = 'Access denied. Valid Administrator credentials required.';
        setError(msg);
        dispatch(loginFailure(msg));
        setLoading(false);
        return;
      }
      login(data);
      navigate('/admin/dashboard');
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Login failed. Please check your credentials.');
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
      background: '#1a1a1a', 
    }}>
      <div style={{
        width: '100%',
        background: 'white',
        display: 'flex',
        minHeight: '100vh',
        position: 'relative',
      }}>
        
        {/* Left Side - Image */}
        <div className="image-panel" style={{
          flex: 1.2,
          position: 'relative',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 40%), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200") center/cover no-repeat',
        }}>
          <div style={{
            position: 'absolute',
            bottom: '3rem',
            left: '3rem',
            right: '2rem'
          }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '2.5rem', 
              fontWeight: '400', 
              fontFamily: '"Playfair Display", Georgia, serif', 
              lineHeight: '1.2', 
              margin: 0,
              letterSpacing: '1px',
              textTransform: 'uppercase'
            }}>
              Perfect Stay For<br/>Your Perfect Vacay
            </h2>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="form-panel" style={{
          flex: 1,
          padding: '4rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: 'white'
        }}>
           
           <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}>
             <X size={28} strokeWidth={1.5} />
           </button>
           
           <h1 style={{ 
             fontSize: '2.5rem', 
             fontWeight: '400', 
             fontFamily: '"Playfair Display", Georgia, serif', 
             color: '#111', 
             margin: '1.5rem 0 2.5rem 0',
             textTransform: 'uppercase',
             letterSpacing: '2px'
           }}>
             Sign In
             <span style={{ display: 'block', fontSize: '1.1rem', marginTop: '0.4rem', fontFamily: 'sans-serif', textTransform: 'none', letterSpacing: 'normal', color: '#666', fontWeight: '500' }}>
               Administrator Access
             </span>
           </h1>

           {/* Success */}
           {success && (
             <div style={{
               width: '100%',
               display:'flex', alignItems:'center', gap:'0.65rem',
               background:'#dcfce7', color:'#15803d',
               padding:'0.75rem 1rem', borderRadius:'4px',
               marginBottom:'1.5rem', fontSize:'0.85rem', fontWeight:'500'
             }}>
               <CheckCircle2 size={16} /> {success}
             </div>
           )}

           {/* Error */}
           {error && (
             <div style={{
               display:'flex', alignItems:'center', gap:'0.65rem',
               background:'#fef2f2', color:'#b91c1c', border: '1px solid #fecaca',
               padding:'0.75rem 1rem', borderRadius:'4px',
               marginBottom:'1.5rem', fontSize:'0.85rem', fontWeight:'500'
             }}>
               <AlertCircle size={16} /> {error}
             </div>
           )}

           <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111' }}>Email</label>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="clean-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Enter Your Password"
                    className="clean-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', padding: 0 }}
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  height: '52px',
                  background: '#2d2d2d',
                  color: 'white',
                  borderRadius: '4px',
                  border: 'none',
                  fontWeight: '500',
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  marginTop: '1.5rem'
                }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.background = '#1a1a1a')}
                onMouseOut={(e) => !loading && (e.currentTarget.style.background = '#2d2d2d')}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
           </form>

           <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#111', fontWeight: '500', textAlign: 'center' }}>
             New admin? <Link to="/admin/register" style={{ color: '#111', textDecoration: 'underline', fontWeight: '700' }}>Register Now!</Link>
           </div>
           
           <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#111', fontWeight: '500', textAlign: 'center' }}>
             Go back to <Link to="/login" style={{ color: '#111', textDecoration: 'underline', fontWeight: '700' }}>Customer Login</Link>
           </div>

           {/* Divider */}
           <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '2rem 0', gap: '0.75rem' }}>
             <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
             <span style={{ fontSize: '0.8rem', color: '#888', fontWeight: '400' }}>Or sign in with</span>
             <div style={{ flex: 1, height: '1px', background: '#eaeaea' }}></div>
           </div>

           {/* OAuth Options */}
           <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <button onClick={() => openOAuthPopup('google')} className="oauth-btn">
                 <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                 </svg> Google
              </button>
              <button onClick={() => openOAuthPopup('github')} className="oauth-btn">
                 <Github size={18} /> GitHub
              </button>
           </div>

        </div>
      </div>
      <style>{`
         .clean-input {
           width: 100%;
           height: 48px;
           padding: 0 1rem;
           border-radius: 4px;
           border: 1px solid #eaeaea;
           background: #ffffff;
           color: #111;
           font-size: 0.95rem;
           outline: none;
           box-sizing: border-box;
           transition: border-color 0.2s;
         }
         .clean-input:focus {
           border-color: #111;
           border-width: 1.5px;
         }
         .clean-input::placeholder {
           color: #a0a0a0;
         }
         
         .oauth-btn {
           flex: 1;
           height: 48px;
           border-radius: 4px;
           border: 1px solid #eaeaea;
           background: white;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 0.5rem;
           font-weight: 500;
           color: #111;
           font-size: 0.9rem;
           cursor: pointer;
           transition: background 0.2s;
         }
         .oauth-btn:hover {
           background: #f9fafb;
         }

         @media (max-width: 900px) {
           .image-panel { display: none !important; }
           .form-panel { padding: 3rem 2rem !important; }
         }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
