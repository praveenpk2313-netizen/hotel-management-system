import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Globe,
  Building2,
  ShieldCheck,
  Zap
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-32 bg-[#020617] border-t border-white/5 text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24 text-center md:text-left">
          
          <div className="space-y-10">
            <Link to="/" className="text-3xl font-serif font-black tracking-tight flex items-center justify-center md:justify-start gap-4 group">
               <div className="w-12 h-12 bg-indigo-600 flex items-center justify-center rounded-2xl shadow-2xl shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                  <Building2 size={24} className="text-white" />
               </div>
               <span className="flex items-baseline">
                PK <span className="italic ml-2 text-indigo-400">UrbanStay</span>
               </span>
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto md:mx-0">
               Pioneering architectural preservation by connecting modern travelers with historic sanctuaries reimagined for the ultimate luxury experience.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-6">
              <a href="#" className="w-12 h-12 border border-white/5 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"><Facebook size={20} /></a>
              <a href="#" className="w-12 h-12 border border-white/5 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"><Instagram size={20} /></a>
              <a href="#" className="w-12 h-12 border border-white/5 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
             <h4 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">The Collection</h4>
             <ul className="space-y-6 text-xs font-black uppercase tracking-widest">
                <li><Link to="/" className="text-slate-400 hover:text-white transition-colors">Home Experience</Link></li>
                <li><Link to="/hotels" className="text-slate-400 hover:text-white transition-colors">Portfolio Search</Link></li>
                <li><Link to="/customer/dashboard" className="text-slate-400 hover:text-white transition-colors">Manage Reservations</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Support Hub</h4>
             <ul className="space-y-6 text-xs font-black uppercase tracking-widest text-slate-400">
                <li><Link to="/manager/login" className="hover:text-white transition-colors">Manager Terminal</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Security Terminal</Link></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Concierge Desk</a></li>
             </ul>
          </div>

          <div>
             <h4 className="text-indigo-500 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Contact Data</h4>
             <div className="space-y-8 text-xs font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-start justify-center md:justify-start gap-4">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Building2 size={14} className="text-indigo-400" />
                   </div>
                   <span className="leading-relaxed">12th Ave, Mayfair, London, <br />W1K 4TQ, United Kingdom</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4">
                   <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Globe size={14} className="text-indigo-400" />
                   </div>
                   <span>concierge@pkurbanstay.com</span>
                </div>
             </div>
          </div>
        </div>

        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex flex-wrap items-center justify-center gap-10 opacity-30">
              <div className="flex items-center gap-3">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">SSL Secure Port</span>
              </div>
              <div className="flex items-center gap-3">
                 <Zap size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Quantum Confirm</span>
              </div>
           </div>
           
           <p className="text-slate-600 text-[9px] font-black uppercase tracking-[0.6em] text-center">
              © 2026 PK URBANSTAY COLLECTION. ALL RIGHTS SECURED.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
