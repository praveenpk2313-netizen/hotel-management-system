import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  Award,
  ArrowUpRight,
  MessageCircle,
  Zap
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-32 pb-16 px-4 md:px-10 lg:px-20 relative overflow-hidden mt-auto">
      {/* Dynamic Background Decoration */}
      <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-gray-50 rounded-full -mr-[30vw] -mb-[30vw] -z-10" />
      
      <div className="max-w-7xl mx-auto space-y-24">
        
        {/* Primary Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Brand Architecture Column */}
          <div className="lg:col-span-4 space-y-10 group">
            <div className="space-y-6">
               <Link to="/" className="flex items-center gap-5">
                  <div style={{ width: '56px', height: '56px' }} className="bg-secondary-dark rounded-2xl flex items-center justify-center p-2 flex-shrink-0 shadow-xl group-hover:rotate-12 transition-transform duration-500">
                     <img src="/logo.png" style={{ width: '36px', height: '36px' }} className="object-contain" alt="PK UrbanStay" />
                  </div>
                  <div>
                     <h2 className="text-3xl font-serif font-black italic text-secondary-dark leading-none tracking-tighter">PK UrbanStay</h2>
                     <p className="text-[10px] font-black text-primary uppercase tracking-[4px] mt-2">Hospitality Group International</p>
                  </div>
               </Link>
               <p className="text-gray-400 font-medium text-lg leading-relaxed max-w-sm">
                  Establishing the gold standard of luxury stay management through verified covenants since 2012. Refined for the global elite.
               </p>
            </div>
            
            <div className="flex gap-4">
               {[Facebook, Instagram, Twitter, Mail].map((Icon, i) => (
                 <button key={i} className="w-14 h-14 bg-gray-50 text-secondary-dark rounded-2xl flex items-center justify-center hover:bg-secondary-dark hover:text-white transition-all border border-gray-100 shadow-sm relative group/btn">
                    <Icon size={20} className="group-hover/btn:scale-110 transition-transform" />
                 </button>
               ))}
            </div>
          </div>

          {/* Hubs & Access Column */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-12 pt-6">
             <div className="space-y-10">
                <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[5px] border-b border-primary/10 pb-4">The Archive</h4>
                <ul className="space-y-5 text-xs font-bold text-gray-400">
                   <li><Link to="/hotels" className="hover:text-primary tracking-wider transition-colors">PROPERTIES</Link></li>
                   <li><Link to="/#deals" className="hover:text-primary tracking-wider transition-colors">ELITE DEALS</Link></li>
                   <li><Link to="/#about-us" className="hover:text-primary tracking-wider transition-colors">HERITAGE</Link></li>
                   <li><Link to="/" className="hover:text-primary tracking-wider transition-colors">JOURNAL</Link></li>
                </ul>
             </div>
             
             <div className="space-y-10">
                <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[5px] border-b border-primary/10 pb-4">Portal Hub</h4>
                <ul className="space-y-5 text-xs font-bold text-gray-400">
                   <li><Link to="/login" className="hover:text-primary tracking-wider transition-colors">SIGN IN</Link></li>
                   <li><Link to="/register" className="hover:text-primary tracking-wider transition-colors">JOIN COVENANT</Link></li>
                   <li><Link to="/manager/login" className="hover:text-primary tracking-wider transition-colors">MANAGER SUITE</Link></li>
                   <li><Link to="/admin/login" className="hover:text-primary tracking-wider transition-colors">ADMIN SHELL</Link></li>
                </ul>
             </div>

             <div className="space-y-10 hidden md:block">
                <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[5px] border-b border-primary/10 pb-4">Protocol</h4>
                <ul className="space-y-5 text-xs font-bold text-gray-400">
                   <li><Link to="/" className="hover:text-primary tracking-wider transition-colors">STATUTES</Link></li>
                   <li><Link to="/" className="hover:text-primary tracking-wider transition-colors">PRIVACY CODES</Link></li>
                   <li><Link to="/" className="hover:text-primary tracking-wider transition-colors">REFUND LOGIC</Link></li>
                </ul>
             </div>
          </div>

          {/* Intelligence & Support Column */}
          <div className="lg:col-span-3 pt-6">
             <div className="bg-gray-50 p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-between group h-full shadow-sm hover:shadow-premium transition-all duration-500">
                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-secondary-dark uppercase tracking-[5px] flex items-center gap-3">
                      <Zap size={14} className="text-primary animate-pulse" /> Contact Hub
                   </h4>
                   <div className="space-y-6">
                      <div className="flex items-start gap-4 group/item">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100 group-hover/item:bg-primary group-hover/item:text-white transition-all flex-shrink-0">
                            <Mail size={16} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">Global Direct</p>
                            <p className="text-[10px] font-black text-secondary-dark uppercase tracking-widest">Consult@PKURBANSTAY.COM</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-4 group/item">
                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100 group-hover/item:bg-primary group-hover/item:text-white transition-all flex-shrink-0">
                            <Phone size={16} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1 leading-none">Concierge Line</p>
                            <p className="text-[10px] font-black text-secondary-dark uppercase tracking-widest">+1 (800) URBANLIVING</p>
                         </div>
                      </div>
                   </div>
                </div>
                
                <button className="mt-12 w-full h-16 bg-secondary-dark text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[4px] shadow-2xl flex items-center justify-center gap-3 hover:bg-primary transition-all active:scale-95 group/btn">
                   Consult Concierge <MessageCircle size={18} className="group-hover/btn:scale-125 transition-transform" />
                </button>
             </div>
          </div>
        </div>

        {/* Global Covenant Footer */}
        <div className="pt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="space-y-4 text-center md:text-left">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-[2.2]">
                 © {new Date().getFullYear()} PK UrbanStay Hospitality Group International PLC. <br /> 
                 Establishing Global Benchmarks in verified travel covenants since 2012. <br />
                 All Rights Reserved.
              </p>
           </div>
           
           <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 pointer-events-none grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                 <ShieldCheck size={16} className="text-emerald-500" /> 
                 <span className="text-[10px] font-black text-secondary-dark uppercase tracking-[4px]">SSL SECURED ENDPOINT</span>
              </div>
              <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 pointer-events-none grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                 <Globe size={16} className="text-primary" /> 
                 <span className="text-[10px] font-black text-secondary-dark uppercase tracking-[4px]">ISO 9001 COMPLIANT</span>
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
