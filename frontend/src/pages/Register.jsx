import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, User, Phone, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import api, { API_BASE_URL, getApiErrorMessage } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const openOAuthPopup = (provider) => {
    const origin = window.location.origin;
    const url = `${API_BASE_URL}/auth/${provider}?from=${encodeURIComponent(origin)}`;
    const w = 500, h = 600;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    window.open(url, `${provider} Register`, `width=${w},height=${h},left=${left},top=${top},popup=true`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setError('');
    setLoading(true);
    dispatch(loginStart());

    try {
      const { data } = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      login(data);
      navigate('/customer/dashboard');
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Registration failed. Please try again.');
      setError(msg);
      dispatch(loginFailure(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 lg:pt-40 pb-24 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-10 animate-fade-in">
        
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Create your account</h1>
          <p className="text-gray-500 font-medium">Join our global network of explorers</p>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-lg">
             <AlertCircle className="shrink-0" size={18} />
             <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block text-left">Full Identity Name</label>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
                className="w-full h-14 px-5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-base
                           focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/5 transition-all outline-none"
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-luxury-gold transition-colors" size={20} />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block text-left">Electronic Mail</label>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
                className="w-full h-14 px-5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-base
                           focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/5 transition-all outline-none"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-luxury-gold transition-colors" size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block text-left">Secure Password</label>
              <div className="relative group">
                <input 
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                  className="w-full h-14 px-5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-base
                             focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/5 transition-all outline-none"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-luxury-gold transition-colors" size={20} />
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 block text-left">Verify Key</label>
              <div className="relative group">
                <input 
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required 
                  className="w-full h-14 px-5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-base
                             focus:border-luxury-gold focus:ring-4 focus:ring-luxury-gold/5 transition-all outline-none"
                />
                <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-luxury-gold transition-colors" size={20} />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full h-16 bg-slate-900 text-white font-black text-base uppercase tracking-[0.2em] rounded-xl hover:bg-luxury-gold transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70 shadow-2xl shadow-slate-900/10 mt-4 group"
          >
            {loading ? <Loader2 size={24} className="animate-spin" /> : 'Begin Your Journey'}
            {!loading && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />}
          </button>
        </form>

        <div className="relative flex items-center py-6">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-6 text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">Or Join Via</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <button 
          onClick={() => openOAuthPopup('google')} 
          className="w-full h-14 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-4 font-black text-slate-900 uppercase tracking-widest text-xs hover:border-luxury-gold transition-all hover:bg-slate-50 active:scale-[0.98] shadow-sm"
        >
           <svg width="22" height="22" viewBox="0 0 24 24" className="shrink-0"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
           Universal Google Identity
        </button>

        <p className="text-center text-slate-400 text-sm font-bold">
           Already a resident? <Link to="/login" className="text-luxury-gold font-black uppercase tracking-widest hover:underline ml-2">Sign in</Link>
        </p>

        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100 opacity-50 grayscale">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest"><ShieldCheck size={14} /> Global Secure Payment</div>
        </div>

      </div>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Register;
