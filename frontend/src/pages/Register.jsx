import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, Eye, EyeOff, CheckCircle2, X, User, Mail, Lock, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const PASSWORD_RULES = [
  { test: (p) => p.length >= 6,          label: 'At least 6 characters'   },
  { test: (p) => /[A-Z]/.test(p),        label: 'One uppercase letter'    },
  { test: (p) => /[0-9]/.test(p),        label: 'One number'              },
];

const Register = () => {
  const [formData, setFormData] = useState({ name:'', email:'', password:'', confirmPassword:'' });
  const [showPwd,   setShowPwd]  = useState(false);
  const [error,     setError]    = useState('');
  const [success,   setSuccess]  = useState('');
  const [loading,   setLoading]  = useState(false);

  const { login }  = useAuth();
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    dispatch(loginStart());

    try {
      const { data } = await api.post('/auth/register', {
        name:     formData.name,
        email:    formData.email,
        password: formData.password,
        role:     'customer',   
      });
      
      setSuccess(data.message || 'Registration successful! Please check your email to verify.');
      // After successfully registering, we don't automatically login if verification is required
      // But the backend current returns a message.
      
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed.';
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
          flex: 1,
          position: 'relative',
          borderRadius: '32px',
          overflow: 'hidden',
          display: window.innerWidth < 900 ? 'none' : 'block',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
        }}>
          <img 
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1200" 
            alt="Paradise Resort"
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
               Join The<br />Stay Savvy Club.
             </h2>
             <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.2rem', maxWidth: '500px' }}>
               Create an account to start your journey towards exclusive stays and premium hospitality.
             </p>
          </div>
        </div>

        {/* Form Side */}
        <div style={{
          flex: 1.2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem',
          maxWidth: '600px',
          margin: 'auto'
        }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#1e1e1e', color: 'white', padding: '0.5rem', borderRadius: '12px' }}>
                 <ShieldCheck size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Stay Savvy</h3>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.8rem' }}>Create Account</h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Step into a world of curated experiences.</p>
          </div>

          {success && (
             <div style={{ 
               display:'flex', alignItems:'center', gap:'0.8rem', 
               background:'#dcfce7', color:'#15803d', border: '1px solid #bcf0da',
               padding:'1rem', borderRadius:'16px', marginBottom:'2rem', fontSize:'0.95rem', fontWeight: '600'
             }}>
               <CheckCircle2 size={24} /> {success}
             </div>
          )}

          {error && (
            <div style={{ 
              display:'flex', alignItems:'center', gap:'0.8rem', 
              background:'#fef2f2', color:'#b91c1c', border: '1px solid #fecaca',
              padding:'1rem', borderRadius:'16px', marginBottom:'2rem', fontSize:'0.9rem' 
            }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="modern-input"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className="modern-input"
                    value={formData.email}
                    onChange={onChange}
                    required
                  />
                  <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="modern-input"
                      value={formData.password}
                      onChange={onChange}
                      required
                    />
                    <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Confirm</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="confirmPassword"
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="modern-input"
                      value={formData.confirmPassword}
                      onChange={onChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.8rem' }}>Password Strength:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {PASSWORD_RULES.map((rule, index) => {
                    const passed = rule.test(formData.password);
                    return (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: passed ? '#10b981' : '#94a3b8', fontSize: '0.8rem', fontWeight: '500' }}>
                        {passed ? <CheckCircle2 size={14} /> : <X size={14} />} {rule.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="modern-submit"
              >
                {loading ? 'Creating Account...' : 'Continue'}
              </button>
            </form>
          )}

          <p style={{ textAlign: 'center', marginTop: '2rem', color: '#64748b', fontSize: '0.95rem' }}>
            Already have an account? <Link to="/login" style={{ color: '#111', fontWeight: '700', textDecoration: 'none', marginLeft: '0.4rem' }}>Log In</Link>
          </p>
        </div>
      </div>

      <style>{`
        .modern-input {
          width: 100%;
          height: 52px;
          padding: 0 1rem 0 3rem;
          border-radius: 12px;
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
          margin-top: 1.5rem;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .modern-submit:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
};

export default Register;
