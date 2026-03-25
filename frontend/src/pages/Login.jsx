import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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
        '/booking-history'
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
    <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-20 px-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-10 animate-fade-in">
        
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Sign in to your account</h1>
          <p className="text-gray-500 font-medium">Manage your bookings and travel preferences</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-lg">
             <AlertCircle className="shrink-0" size={18} />
             <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Email address</label>
            <div className="relative group">
               <input 
                type="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full h-14 px-5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-base
                           focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/5 transition-all outline-none placeholder:text-slate-400"
               />
               <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-luxury-gold transition-colors" size={20} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center pl-1">
               <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Password</label>
               <Link to="/forgot-password" size={18} className="text-[10px] text-luxury-gold font-black uppercase tracking-widest hover:underline">Forgot security key?</Link>
            </div>
            <div className="relative group">
               <input 
                type={showPwd ? 'text' : 'password'} 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full h-14 px-5 pr-12 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold text-base
                           focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/5 transition-all outline-none placeholder:text-slate-400"
               />
               <button 
                type="button" 
                onClick={() => setShowPwd(!showPwd)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-luxury-gold transition-colors"
               >
                  {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
               </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full h-16 bg-slate-900 text-white font-black text-base uppercase tracking-[0.2em] rounded-xl hover:bg-luxury-gold transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 shadow-2xl shadow-slate-900/20 group overflow-hidden relative"
          >
            <span className="relative z-10">{loading ? <Loader2 size={24} className="animate-spin" /> : 'Log In To Sanctuary'}</span>
            {!loading && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-6 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Identity Access</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button 
          type="button"
          onClick={() => openOAuthPopup('google')} 
          className="w-full h-14 bg-white border border-slate-300 rounded-xl flex items-center justify-center gap-4 font-black text-slate-900 uppercase tracking-widest text-xs hover:border-luxury-gold transition-all hover:bg-slate-50 active:scale-[0.98] shadow-sm"
        >
           <svg width="22" height="22" viewBox="0 0 24 24" className="shrink-0"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
           Universal Google Auth
        </button>

        <p className="text-center text-slate-400 text-sm font-bold">
           New to Stay Savvy? <Link to="/register" className="text-luxury-gold font-black uppercase tracking-widest hover:underline ml-2">Create Account</Link>
        </p>

        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100 opacity-50 grayscale">
           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"><ShieldCheck size={14} /> Secure Login</div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Login;
