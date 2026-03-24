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
    <footer className="py-20 bg-[#1a1a1a] border-t border-white/5 text-white">
      <div className="max-w-[1440px] mx-auto px-[4%]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20 text-center md:text-left">
          
          <div className="space-y-8">
            <Link to="/" className="text-3xl font-serif font-black tracking-tight flex justify-center md:justify-start">
               UrbanStay<span className="text-[#c5a059]">.</span>
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs mx-auto md:mx-0">
               Founded on architectural preservation, we connect travelers with historic havens reimagined for luxury.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-6">
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#c5a059] hover:border-[#c5a059] transition-all"><Facebook size={18} /></a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#c5a059] hover:border-[#c5a059] transition-all"><Instagram size={18} /></a>
              <a href="#" className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-[#c5a059] hover:border-[#c5a059] transition-all"><Twitter size={18} /></a>
            </div>
          </div>

          <div>
             <h4 className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.3em] mb-10">Quick Links</h4>
             <ul className="space-y-6 text-sm font-bold">
                <li><Link to="/" className="hover:text-[#c5a059] transition-colors">Home Experience</Link></li>
                <li><Link to="/hotels" className="hover:text-[#c5a059] transition-colors">Portfolio Search</Link></li>
                <li><Link to="/booking-history" className="hover:text-[#c5a059] transition-colors">Manage Reservations</Link></li>
             </ul>
          </div>

          <div>
             <h4 className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.3em] mb-10">Support Hub</h4>
             <ul className="space-y-6 text-sm font-bold text-slate-400">
                <li><Link to="/manager/login" className="hover:text-white transition-colors">Manager Portal</Link></li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Console</Link></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Concierge Desk</a></li>
             </ul>
          </div>

          <div>
             <h4 className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.3em] mb-10">Global Presence</h4>
             <div className="space-y-6 text-sm font-bold text-slate-400">
                <div className="flex items-start justify-center md:justify-start gap-4">
                   <Building2 size={16} className="text-[#c5a059] flex-shrink-0" />
                   <span>120 Baker Street, London, <br />W1U 6TU, United Kingdom</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-4">
                   <Globe size={16} className="text-[#c5a059]" />
                   <span>support@urbanstay.com</span>
                </div>
             </div>
          </div>
        </div>

        <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
           <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale">
              <div className="flex items-center gap-3">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">SSL Secure Haven</span>
              </div>
              <div className="flex items-center gap-3">
                 <Zap size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Instant Confirmation</span>
              </div>
           </div>
           
           <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em] text-center">
              © 2026 URBANSTAY COLLECTION. WORLDWIDE RIGHTS RESERVED.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
