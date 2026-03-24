import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDispatch } from 'react-redux';
import { AlertCircle, Eye, EyeOff, X, Briefcase, UserPlus, ArrowRight, ShieldCheck, CheckCircle2, Loader2, Phone, Mail, User, Lock } from 'lucide-react';
import { registerUser } from '../services/api';

const ManagerRegisterPage = () => {
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
        role:         'manager',
      });

      navigate('/manager/login', { state: { message: 'Inquiry received. Please verify and log in.' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-dark flex flex-col lg:flex-row font-sans overflow-hidden">
      
      {/* Left Decoration / Branding */}
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-secondary-dark group">
         <img 
           src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000" 
           alt="Partner Registration" 
           className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-[3s]"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-secondary-dark/40 to-transparent" />
         
         <div className="absolute inset-x-16 bottom-24 space-y-8">
            <div className="w-16 h-1 w-20 bg-primary" />
            <div className="space-y-4">
               <h2 className="text-5xl font-serif text-white font-bold tracking-tight leading-tight uppercase">
                 Expand Your <br />
                 <span className="text-primary italic">Heritage</span>
               </h2>
               <p className="text-lg text-gray-300 font-medium max-w-sm leading-relaxed">
                 Join our exclusive network of luxury stays. Provide your credentials to begin the application process.
               </p>
            </div>
            
            <div className="space-y-6 pt-4">
               {[
                 { icon: Briefcase, text: 'Manage Multiple Properties' },
                 { icon: ShieldCheck, text: 'Advanced Inventory Logic' },
                 { icon: CheckCircle2, text: 'Global Marketing Support' }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 text-white/80 font-bold text-sm tracking-wide">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <item.icon size={16} />
                    </div>
                    {item.text}
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Right Form Section */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 relative bg-white lg:rounded-l-[4rem] shadow-2xl overflow-y-auto custom-scrollbar">
         
         <div className="w-full max-w-2xl space-y-10 py-10">
            {/* Header */}
            <div className="space-y-4 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary font-black text-[10px] uppercase tracking-[3px]">
                  <UserPlus size={14} /> Partnership Application
               </div>
               <h1 className="text-4xl lg:text-5xl font-serif text-secondary-dark font-black tracking-tight">
                  Manager Enrollment
               </h1>
               <p className="text-gray-400 font-medium tracking-tight">Create your professional PK UrbanStay identity.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-shake">
                 <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Legal Full Name</label>
                     <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                        <input
                          name="name"
                          type="text"
                          placeholder="Your official name"
                          value={formData.name}
                          onChange={onChange}
                          required
                          className="input-premium pl-14"
                        />
                     </div>
                  </div>

                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Management ID (Username)</label>
                     <div className="relative">
                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                        <input
                          name="username"
                          type="text"
                          placeholder="Unique ID"
                          value={formData.username}
                          onChange={onChange}
                          required
                          className="input-premium pl-14"
                        />
                     </div>
                  </div>

                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Corporate Email</label>
                     <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                        <input
                          name="email"
                          type="email"
                          placeholder="business@example.com"
                          value={formData.email}
                          onChange={onChange}
                          required
                          className="input-premium pl-14"
                        />
                     </div>
                  </div>

                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Contact Terminal (Mobile)</label>
                     <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                        <input
                          name="mobileNumber"
                          type="tel"
                          placeholder="+1 234 567 89"
                          value={formData.mobileNumber}
                          onChange={onChange}
                          required
                          className="input-premium pl-14"
                        />
                     </div>
                  </div>

                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Access Logic (Password)</label>
                     <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                        <input
                          name="password"
                          type={showPwd ? 'text' : 'password'}
                          placeholder="Secure key"
                          value={formData.password}
                          onChange={onChange}
                          required
                          className="input-premium pl-14 pr-14"
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

                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Verify Logic</label>
                     <div className="relative">
                        <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
                        <input
                          name="confirmPassword"
                          type={showCPwd ? 'text' : 'password'}
                          placeholder="Verify key"
                          value={formData.confirmPassword}
                          onChange={onChange}
                          required
                          className="input-premium pl-14 pr-14"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCPwd(!showCPwd)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary-dark transition-colors"
                        >
                          {showCPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                     </div>
                  </div>
               </div>

               <div className="flex items-center gap-3 px-1">
                  <input type="checkbox" id="terms" required className="w-5 h-5 rounded-lg border-2 border-gray-100 text-primary focus:ring-primary shadow-sm cursor-pointer" />
                  <label htmlFor="terms" className="text-xs font-medium text-gray-500 cursor-pointer select-none">
                    I acknowledge the <span className="text-secondary-dark font-bold hover:underline">Partnership Covenant</span> and <span className="text-secondary-dark font-bold hover:underline">Privacy Statues</span>.
                  </label>
               </div>

               <button
                 type="submit"
                 disabled={loading}
                 className="w-full h-16 bg-secondary-dark text-white font-bold rounded-2xl shadow-xl shadow-secondary/20 hover:shadow-secondary/30 active:scale-95 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                       Sumbit Application <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform text-primary" />
                    </>
                  )}
               </button>
            </form>

            <div className="pt-8 text-center space-y-6">
               <p className="text-sm font-medium text-gray-500">
                  Already manage properties? <Link to="/manager/login" className="text-secondary-dark font-black tracking-tight hover:text-primary transition-colors">Re-establish Access</Link>
               </p>
               
               <div className="flex items-center justify-center gap-6 border-t border-gray-50 pt-8">
                  <Link to="/" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1.5">
                     <X size={14} /> Back to Site
                  </Link>
                  <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                  <Link to="/register" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1.5">
                     <User size={14} /> Guest Register
                  </Link>
               </div>
            </div>
         </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default ManagerRegisterPage;
