import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { loginStart, loginFailure } from '../redux/slices/authSlice';
import { AlertCircle, CheckCircle2, Eye, EyeOff, X, Briefcase, UserCheck, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
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
                  <ShieldCheck size={12} className="text-primary" /> Secure Access Tier
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

            {/* Footer Links */}
            <div className="pt-8 text-center space-y-4 border-t border-gray-50">
               <div className="flex items-center justify-center gap-6 pt-4">
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
