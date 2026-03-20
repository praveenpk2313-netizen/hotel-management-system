import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, Eye, EyeOff, X } from 'lucide-react';
import { registerUser } from '../services/api';

const AdminRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPwd,  setShowPwd]  = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name:         formData.name,
        username:     formData.username,
        email:        formData.email,
        mobileNumber: formData.mobileNumber,
        password:     formData.password,
        role:         'admin', // Explicitly registering an admin account
      });

      navigate('/admin/login', { state: { message: 'Registration successful! Please log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          padding: '3rem 4rem',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: 'white',
          overflowY: 'auto'
        }}>
           
           <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}>
             <X size={28} strokeWidth={1.5} />
           </button>
           
           <h1 style={{ 
             fontSize: '2.5rem', 
             fontWeight: '400', 
             fontFamily: '"Playfair Display", Georgia, serif', 
             color: '#111', 
             margin: '0.5rem 0 1rem 0',
             textTransform: 'uppercase',
             letterSpacing: '2px'
           }}>
             Sign Up
             <span style={{ display: 'block', fontSize: '1.1rem', marginTop: '0.4rem', fontFamily: 'sans-serif', textTransform: 'none', letterSpacing: 'normal', color: '#666', fontWeight: '500' }}>
               Administrator Registration
             </span>
           </h1>

           {/* Info badge */}
           <div style={{
             padding:'0.75rem 1rem',
             background:'#f8fafc',
             border:'1px solid #e2e8f0',
             borderRadius:'4px',
             marginBottom:'1.5rem',
             fontSize:'0.8rem',
             color:'#334155',
             fontWeight:'500',
           }}>
             🔒 Admin registration is Restricted. Your email must be pre-approved.
           </div>

           {/* Error */}
           {error && (
             <div style={{
               display:'flex', alignItems:'center', gap:'0.65rem',
               background:'#fef2f2', color:'#b91c1c', border: '1px solid #fecaca',
               padding:'0.75rem 1rem', borderRadius:'4px',
               marginBottom:'1.5rem', fontSize:'0.85rem'
             }}>
               <AlertCircle size={16} /> {error}
             </div>
           )}

           <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111' }}>Full Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Enter Full Name"
                    className="clean-input"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111' }}>Username</label>
                  <input
                    name="username"
                    type="text"
                    placeholder="Enter Username"
                    className="clean-input"
                    value={formData.username}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111' }}>Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter Email"
                    className="clean-input"
                    value={formData.email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111' }}>Mobile Number</label>
                  <input
                    name="mobileNumber"
                    type="tel"
                    placeholder="Enter Mobile"
                    className="clean-input"
                    value={formData.mobileNumber}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="password"
                      type={showPwd ? 'text' : 'password'}
                      placeholder="Password"
                      className="clean-input"
                      value={formData.password}
                      onChange={onChange}
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#111' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      name="confirmPassword"
                      type={showCPwd ? 'text' : 'password'}
                      placeholder="Confirm"
                      className="clean-input"
                      value={formData.confirmPassword}
                      onChange={onChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCPwd(!showCPwd)}
                      style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', padding: 0 }}
                    >
                      {showCPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                 <input type="checkbox" id="terms" required style={{ cursor: 'pointer' }} />
                 <label htmlFor="terms" style={{ fontSize: '0.85rem', color: '#333', cursor: 'pointer' }}>
                   I agree with the <span style={{ fontWeight: '600' }}>Terms of services</span> and <span style={{ fontWeight: '600' }}>Privacy Policy</span>
                 </label>
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
                  marginTop: '0.5rem'
                }}
                onMouseOver={(e) => !loading && (e.currentTarget.style.background = '#1a1a1a')}
                onMouseOut={(e) => !loading && (e.currentTarget.style.background = '#2d2d2d')}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
           </form>

           <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: '#111', fontWeight: '500', textAlign: 'center' }}>
             Already an admin? <Link to="/admin/login" style={{ color: '#111', textDecoration: 'underline', fontWeight: '700' }}>Sign In Now!</Link>
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

         @media (max-width: 900px) {
           .image-panel { display: none !important; }
           .form-panel { padding: 3rem 2rem !important; }
         }
      `}</style>
    </div>
  );
};

export default AdminRegisterPage;
