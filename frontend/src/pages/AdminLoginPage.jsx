import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Github, X, ShieldCheck, ArrowRight, UserCheck, Loader2, Briefcase } from 'lucide-react';
import api, { getApiErrorMessage, API_BASE_URL } from '../services/api';

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
  }, [location.state]);

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

  const openOAuthPopup = (provider) => {
    const origin = window.location.origin;
    const url = `${API_BASE_URL}/auth/${provider}?from=${encodeURIComponent(origin)}`;
    const w = 500, h = 600;
    const left = window.screenX + (window.outerWidth  - w) / 2;
    const top  = window.screenY + (window.outerHeight - h) / 2;
    window.open(url, `${provider} Login`, `width=${w},height=${h},left=${left},top=${top},popup=true`);
  };

  useEffect(() => {
    const handleOAuthMessage = (e) => {
      if (e.data?.type === 'OAUTH_SUCCESS') {
        try {
          const userData = JSON.parse(decodeURIComponent(e.data.payload));
          if (userData.role !== 'admin') {
            setError('Access denied. Valid Administrator credentials required.');
            return;
          }
          login(userData);
          navigate('/admin/dashboard');
        } catch (err) {
          setError('Failed to process OAuth data');
        }
      } else if (e.data?.type === 'OAUTH_ERROR') {
        setError(e.data.message || 'OAuth authentication failed.');
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [login, navigate]);

  return (
    <div className="min-h-screen bg-secondary-dark flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* Left Decoration / Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-secondary-dark group">
         <img 
           src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
           alt="Admin Portal" 
           className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-[4s] grayscale-[20%]"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary-dark/60 to-transparent" />
         
         <div className="absolute inset-x-20 bottom-32 space-y-8">
            <div className="w-20 h-1 bg-primary" />
            <div className="space-y-4">
               <h2 className="text-6xl font-serif text-white font-bold tracking-tight leading-tight uppercase">
                 Executive <br />
                 <span className="text-primary italic">Terminal</span>
               </h2>
               <p className="text-xl text-gray-300 font-medium max-w-sm leading-relaxed">
                 Command the PK UrbanStay platform with precision and absolute control.
               </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-10">
               {[
                 { label: 'System Status', value: 'Nominal' },
                 { label: 'Cloud Security', value: 'Active' }
               ].map((stat, i) => (
                 <div key={i} className="border-l border-white/10 pl-6">
                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white uppercase tracking-tighter">{stat.value}</p>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 relative bg-white lg:rounded-l-[3.5rem] shadow-2xl">
         
         <div className="w-full max-w-md space-y-12">
            {/* Header */}
            <div className="space-y-4 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-dark/5 rounded-full text-secondary-dark font-black text-[10px] uppercase tracking-[3px] animate-fade-in border border-secondary-dark/10">
                  <Briefcase size={12} /> Root Access Only
               </div>
               <h1 className="text-4xl lg:text-5xl font-serif text-secondary-dark font-black tracking-tight">
                  Admin Sign In
               </h1>
               <p className="text-gray-400 font-medium tracking-tight">Enter your secure credentials to bypass external protection.</p>
            </div>

            {/* Notifications */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-shake">
                 <AlertCircle size={18} /> {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600 text-sm font-bold animate-fade-in">
                 <CheckCircle2 size={18} /> {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Admin Identifier</label>
                  <input
                    type="email"
                    placeholder="admin@pkurbanstay.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-14 px-6 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none placeholder:text-gray-300"
                  />
               </div>

               <div className="space-y-2 group">
                  <div className="flex justify-between items-center ml-1">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest group-focus-within:text-primary transition-colors">Encrypted Key</label>
                     <Link to="/forgot-password" size={14} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Reset key?</Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-14 px-6 bg-gray-50 border-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none placeholder:text-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary-dark transition-colors"
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
               </div>

               <button
                 type="submit"
                 disabled={loading}
                 className="w-full h-16 bg-secondary-dark text-white font-bold rounded-2xl shadow-xl shadow-secondary/20 hover:shadow-secondary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                       Access Terminal <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-primary" />
                    </>
                  )}
               </button>
            </form>

            {/* Social Login */}
            <div className="space-y-6 pt-4">
               <div className="relative flex items-center justify-center">
                  <div className="absolute inset-x-0 h-px bg-gray-100" />
                  <span className="relative px-4 bg-white text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Auth Layers</span>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => openOAuthPopup('google')} className="h-14 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-secondary group">
                     <svg width="18" height="18" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                     </svg>
                     Google
                  </button>
                  <button onClick={() => openOAuthPopup('github')} className="h-14 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest text-secondary group">
                     <Github size={18} />
                     GitHub
                  </button>
               </div>
            </div>

            {/* Footer Links */}
            <div className="pt-8 text-center space-y-4">
               <p className="text-sm font-medium text-gray-500">
                  Expansion ready? <Link to="/admin/register" className="text-secondary-dark font-black tracking-tight hover:text-primary transition-colors">Deploy New Instance</Link>
               </p>
               <div className="flex items-center justify-center gap-6">
                  <Link to="/login" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1.5">
                     <UserCheck size={14} /> Guest Portal
                  </Link>
                  <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                  <Link to="/" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1.5">
                     <X size={14} /> Back to Site
                  </Link>
               </div>
            </div>
         </div>
      </div>
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
