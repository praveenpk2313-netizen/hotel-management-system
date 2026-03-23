import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff, Github, Mail, Lock, User, FileText } from 'lucide-react';
import api, { API_BASE_URL } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer'
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('error') === 'oauth_failed') {
      setError('OAuth registration failed. Please try again.');
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
            userData.role === 'admin' ? '/admin/dashboard' :
            userData.role === 'manager' ? '/manager/dashboard' :
            '/customer/dashboard'
          );
        } catch (err) {
          setError('OAuth registration failed.');
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
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    window.open(url, `${provider} Login`, `width=${w},height=${h},left=${left},top=${top},popup=true`);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      login(data);
      navigate(
        data.role === 'admin' ? '/admin/dashboard' :
        data.role === 'manager' ? '/manager/dashboard' :
        '/customer/dashboard'
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
        maxWidth: '1100px',
        minHeight: '750px',
        background: 'white',
        borderRadius: '32px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
        border: '1px solid #f1f5f9'
      }}>
        
        {/* Visual Panel */}
        <div style={{
          flex: 0.9,
          position: 'relative',
          display: window.innerWidth < 1000 ? 'none' : 'block'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1200" 
            alt="StayNow Experience" 
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
             <h2 style={{ color: 'white', fontSize: '3rem', fontWeight: '400', fontFamily: '"Playfair Display", serif', marginBottom: '1rem', lineHeight: '1.2' }}>Your Sanctuary<br />Starts Here.</h2>
             <p style={{ color: 'white', opacity: 0.8, fontSize: '1rem', fontWeight: '300', lineHeight: '1.7', maxWidth: '350px' }}>Join our global community of sophisticated travelers and property managers.</p>
          </div>
        </div>

        {/* Form Panel */}
        <div style={{
          flex: 1.1,
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'white'
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <img src="/logo.png" style={{ width: '36px', height: '36px' }} alt="StayNow Logo" />
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', fontFamily: '"Playfair Display", serif' }}>StayNow</span>
             </div>
             <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>Create Account</h1>
             <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: '500' }}>Step into a world of curated experiences.</p>
          </div>

          {error && (
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'#fff1f2', color:'#e11d48', padding:'0.75rem 1rem', borderRadius:'14px', marginBottom:'1.5rem', fontSize:'0.85rem', fontWeight: '600' }}>
               <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                   <input name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="clean-input" />
                   <User className="field-icon" size={18} />
                </div>
             </div>

             <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                   <input name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required className="clean-input" />
                   <Mail className="field-icon" size={18} />
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                   <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Password</label>
                   <div style={{ position: 'relative' }}>
                      <input name="password" type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={formData.password} onChange={handleChange} required className="clean-input" />
                      <Lock className="field-icon" size={18} />
                   </div>
                </div>
                <div className="input-group">
                   <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Confirm</label>
                   <div style={{ position: 'relative' }}>
                      <input name="confirmPassword" type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required className="clean-input" />
                      <Lock className="field-icon" size={18} />
                      <button type="button" onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                         {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                   </div>
                </div>
             </div>

             <div className="input-group">
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#0f172a', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Join As</label>
                <div style={{ position: 'relative' }}>
                   <select name="role" value={formData.role} onChange={handleChange} className="clean-input" style={{ appearance: 'none' }}>
                      <option value="customer">Traveler (Book Hotels)</option>
                      <option value="manager">Partner (List Hotels)</option>
                   </select>
                   <FileText className="field-icon" size={18} />
                </div>
             </div>

             <button type="submit" disabled={loading} className="clean-submit">
                {loading ? 'Creating Account...' : 'Sign Up For Free'}
             </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', margin: '2rem 0' }}>
             <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }}></div>
             <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Quick Connect</span>
             <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }}></div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
             <button onClick={() => openOAuthPopup('google')} className="social-pill-btn">
                <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> Google
             </button>
             <button onClick={() => openOAuthPopup('github')} className="social-pill-btn">
                <Github size={20} /> GitHub
             </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
             Already a member? <Link to="/login" style={{ color: '#0f172a', fontWeight: '800', textDecoration: 'none', marginLeft: '0.4rem' }}>Sign In</Link>
          </p>
        </div>

      </div>

      <style>{`
        .clean-input { width: 100%; height: 52px; padding: 0 1rem 0 3rem; border-radius: 12px; border: 1.5px solid #f1f5f9; background: #fdfdfd; font-size: 0.95rem; outline: none; transition: 0.3s; box-sizing: border-box; color: #0f172a; font-weight: 500; }
        .clean-input:focus { border-color: #c5a059; background: white; box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1); }
        .field-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; transition: 0.3s; }
        .clean-input:focus ~ .field-icon { color: #c5a059; }
        .clean-submit { height: 58px; background: #0f172a; color: white; border-radius: 12px; border: none; font-weight: 800; font-size: 1.05rem; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 25px rgba(15, 23, 42, 0.1); }
        .clean-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(15, 23, 42, 0.2); background: #1e293b; }
        .social-pill-btn { flex: 1; height: 50px; border-radius: 12px; border: 1.5px solid #f1f5f9; background: white; display: flex; alignItems: center; justifyContent: center; gap: 0.75rem; font-weight: 700; color: #1e293b; cursor: pointer; transition: 0.3s; font-size: 0.95rem; }
        .social-pill-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default Register;
