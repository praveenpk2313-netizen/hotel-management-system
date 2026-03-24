import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  ShieldCheck,
  CheckCircle2,
  Globe
} from 'lucide-react';

const Footer = () => {
  return (
    <footer id="about" className="bg-booking-blue text-white pt-16 pb-12 mt-auto">
      <div className="container-booking space-y-12">
        
        {/* Upper Footer: Simplified Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-white/10 pb-12">
          
          <div className="space-y-4">
             <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2">
                PK <span className="text-secondary font-black">UrbanStay</span>
             </Link>
             <p className="text-xs opacity-60 leading-relaxed font-medium">
                Your premier destination for luxury stays and urban escapes. Experience the city like never before.
             </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-2 col-span-2 gap-8">
             <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest opacity-80">Quick Links</h4>
                <ul className="text-sm space-y-3 font-bold">
                   <li><Link to="/" className="hover:text-blue-200 transition-colors">Home</Link></li>
                   <li><Link to="/hotels" className="hover:text-blue-200 transition-colors">Find Hotels</Link></li>
                   <li><Link to="/register" className="hover:text-blue-200 transition-colors">List Property</Link></li>
                </ul>
             </div>
             <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest opacity-80">Support</h4>
                <ul className="text-sm space-y-3 font-bold">
                   <li><Link to="/manager/login" className="hover:text-blue-200 transition-colors">Manager Login</Link></li>
                   <li><Link to="/admin/login" className="hover:text-blue-200 transition-colors">Admin Portal</Link></li>
                   <li><Link to="/" className="hover:text-blue-200 transition-colors">Help Center</Link></li>
                </ul>
             </div>
          </div>

          <div className="space-y-6">
             <h4 className="text-sm font-bold uppercase tracking-widest opacity-80">Follow Us</h4>
             <div className="flex items-center gap-6">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><Facebook size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><Twitter size={20} /></a>
             </div>
          </div>
        </div>

        {/* Lower Footer: Trust & Copyright */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
           <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2">
                 <CheckCircle2 size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Verified Payment</span>
              </div>
              <div className="flex items-center gap-2">
                 <Globe size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Global Partners</span>
              </div>
           </div>
           
           <p className="text-[11px] font-black opacity-40 uppercase tracking-widest text-center">
              © 2026-2030 PK URBANSTAY.COM™. ALL RIGHTS RESERVED.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
