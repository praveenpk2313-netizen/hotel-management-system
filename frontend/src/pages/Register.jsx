import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Eye, EyeOff, Mail, Lock, User, FileText, ArrowRight, Loader2, ShieldCheck, Sparkles } from 'lucide-react';
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
    const origin = window.location.origin;
    const url = `${API_BASE_URL}/auth/${provider}?from=${encodeURIComponent(origin)}`;
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 font-sans pt-32 lg:pt-40">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-premium border border-gray-100 min-h-[800px]">
        
        {/* Left: Illustrative Section */}
        <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-secondary-dark p-12 flex-col justify-between">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay" 
              alt="Luxury Pool"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary-dark/20 to-transparent" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-serif text-xl font-bold">P</span>
             </div>
             <span className="text-white font-serif text-2xl tracking-wider uppercase">PK UrbanStay</span>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl text-white font-serif leading-tight">
                 Begin Your <br />
                 <span className="text-primary italic">Journey</span> Today.
              </h2>
              <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
                 Join thousands of travelers enjoying curated luxury across the globe.
              </p>
            </div>

            <div className="space-y-6 pt-6">
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-white/10">
                     <ShieldCheck size={24} />
                  </div>
                  <div>
                     <h4 className="text-white font-bold mb-1">Secure & Private</h4>
                     <p className="text-gray-500 text-sm">Your data is encrypted and handled with elite care.</p>
                  </div>
               </div>
               <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-white/10">
                     <Sparkles size={24} />
                  </div>
                  <div>
                     <h4 className="text-white font-bold mb-1">Exclusive Access</h4>
                     <p className="text-gray-500 text-sm">Unlock secret deals and members-only properties.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="flex-1 p-8 md:p-14 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md w-full mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-serif text-secondary-dark font-bold">Create Account</h1>
              <p className="text-gray-500 font-medium">Join PK UrbanStay and start your luxury experience.</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl animate-fade-in text-sm font-semibold">
                 <AlertCircle className="shrink-0" size={18} />
                 {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-secondary-dark uppercase tracking-[1.5px] ml-1">Full Name</label>
                <div className="relative group">
                   <input 
                    name="name"
                    type="text" 
                    placeholder="Enter your full name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl text-secondary-dark font-medium 
                               focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                   />
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-secondary-dark uppercase tracking-[1.5px] ml-1">Email Address</label>
                <div className="relative group">
                   <input 
                    name="email"
                    type="email" 
                    placeholder="name@example.com" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl text-secondary-dark font-medium 
                               focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                   />
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-secondary-dark uppercase tracking-[1.5px] ml-1">Password</label>
                  <div className="relative group">
                    <input 
                      name="password"
                      type={showPwd ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      value={formData.password} 
                      onChange={handleChange} 
                      required 
                      className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl text-secondary-dark font-medium 
                                focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-secondary-dark uppercase tracking-[1.5px] ml-1">Confirm</label>
                  <div className="relative group">
                    <input 
                      name="confirmPassword"
                      type={showPwd ? 'text' : 'password'} 
                      placeholder="••••••••" 
                      value={formData.confirmPassword} 
                      onChange={handleChange} 
                      required 
                      className="w-full h-14 pl-12 pr-12 bg-gray-50 border-2 border-transparent rounded-2xl text-secondary-dark font-medium 
                                focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <button 
                      type="button" 
                      onClick={() => setShowPwd(!showPwd)} 
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary-dark transition-colors p-1"
                    >
                        {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-secondary-dark uppercase tracking-[1.5px] ml-1">I want to join as</label>
                <div className="relative group">
                  <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange} 
                    className="w-full h-14 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl text-secondary-dark font-bold appearance-none
                               focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none cursor-pointer"
                  >
                    <option value="customer">Traveler (Book Exclusive Stays)</option>
                    <option value="manager">Partner (Manage Properties)</option>
                  </select>
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none" size={20} />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ArrowRight className="rotate-90" size={16} />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full h-14 mt-4 bg-gradient-to-r from-secondary-light to-secondary-dark text-white font-bold rounded-2xl 
                           shadow-2xl shadow-secondary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all 
                           hover:shadow-secondary/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <><Loader2 size={24} className="animate-spin" /> Creating Account...</>
                ) : (
                  <>Create My Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Or join with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <button 
              onClick={() => openOAuthPopup('google')} 
              className="w-full h-14 bg-white border-2 border-gray-50 rounded-2xl flex items-center justify-center gap-3 
                         font-bold text-secondary-dark hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]"
            >
               <svg width="22" height="22" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
               Google One-Tap
            </button>

            <p className="text-center pt-2 text-gray-500 font-medium">
               Already have an account? <Link to="/login" className="text-secondary-dark font-black hover:text-primary transition-colors">Sign In Instead</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
