import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import api, { API_BASE_URL, getApiErrorMessage } from '../services/api';

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
    const origin = window.location.origin;
    const url = `${API_BASE_URL}/auth/${provider}?from=${encodeURIComponent(origin)}`;
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
      const msg = getApiErrorMessage(err, 'Login failed. Please check your credentials.');
      setError(msg);
      dispatch(loginFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white rounded-[2.5rem] overflow-hidden shadow-premium border border-gray-100 min-h-[700px]">
        
        {/* Left: Illustrative / Branding Section */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary-dark p-12 flex-col justify-between">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay scale-110" 
              alt="Luxury Hotel"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary-dark/40 to-transparent" />
          </div>

          {/* Top Brand */}
          <div className="relative z-10 flex items-center gap-3">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-serif text-xl font-bold">P</span>
             </div>
             <span className="text-white font-serif text-2xl tracking-wider uppercase">PK UrbanStay</span>
          </div>

          {/* Bottom Content */}
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-sm">
               <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
               Experience the Pinnacle of Luxury
            </div>
            <h2 className="text-5xl xl:text-6xl text-white font-serif leading-tight">
               Your Gateway <br />
               To Global <span className="text-primary italic">Comfort</span>.
            </h2>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
               Access high-end stays and personalized hospitality through our exclusive management portal.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
               <div className="space-y-1">
                  <div className="text-primary font-bold text-2xl">500+</div>
                  <div className="text-gray-500 text-sm uppercase tracking-widest">Properties</div>
               </div>
               <div className="space-y-1">
                  <div className="text-primary font-bold text-2xl">24/7</div>
                  <div className="text-gray-500 text-sm uppercase tracking-widest">Support</div>
               </div>
            </div>
          </div>
        </div>

        {/* Right: Login Form Section */}
        <div className="flex-1 p-8 md:p-16 lg:p-20 flex flex-col justify-center bg-white">
          {/* Mobile Brand Show */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
             <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-serif text-xl font-bold">P</span>
             </div>
             <span className="text-secondary-dark font-serif text-2xl tracking-wider uppercase">PK UrbanStay</span>
          </div>

          <div className="max-w-md w-full mx-auto space-y-10">
            <div className="space-y-3">
              <h1 className="text-4xl font-serif text-secondary-dark font-bold">Welcome Back</h1>
              <p className="text-gray-500 font-medium">Please enter your account details to sign in.</p>
            </div>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl animate-fade-in">
                 <AlertCircle className="shrink-0" size={20} />
                 <p className="text-sm font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-secondary-dark uppercase tracking-[1.5px] ml-1">Email Address</label>
                <div className="relative group">
                   <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full h-16 pl-12 pr-6 bg-gray-50 border-2 border-transparent rounded-2xl text-secondary-dark font-medium 
                               focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                   />
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end ml-1">
                   <label className="text-[11px] font-black text-secondary-dark uppercase tracking-[1.5px]">Password</label>
                   <Link to="/forgot-password" size={18} className="text-xs text-primary font-bold hover:underline">Forgot?</Link>
                </div>
                <div className="relative group">
                   <input 
                    type={showPwd ? 'text' : 'password'} 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full h-16 pl-12 pr-12 bg-gray-50 border-2 border-transparent rounded-2xl text-secondary-dark font-medium 
                               focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                   />
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                   <button 
                    type="button" 
                    onClick={() => setShowPwd(!showPwd)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary-dark transition-colors p-1"
                   >
                      {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                   </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full h-16 bg-gradient-to-r from-secondary-light to-secondary-dark text-white font-bold rounded-2xl 
                           shadow-2xl shadow-secondary/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all 
                           hover:shadow-secondary/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <><Loader2 size={24} className="animate-spin" /> Authenticating...</>
                ) : (
                  <>Sign In To Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>
            </form>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Or login with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            <button 
              onClick={() => openOAuthPopup('google')} 
              className="w-full h-16 bg-white border-2 border-gray-50 rounded-2xl flex items-center justify-center gap-3 
                         font-bold text-secondary-dark hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-[0.98]"
            >
               <svg width="24" height="24" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
               Google Account
            </button>

            <p className="text-center pt-6 text-gray-500 font-medium">
               New to the platform? <Link to="/register" className="text-secondary-dark font-black hover:text-primary transition-colors">Create Free Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
