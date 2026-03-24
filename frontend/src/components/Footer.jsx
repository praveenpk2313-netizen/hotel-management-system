import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#003b95] text-white pt-16 pb-8 mt-auto">
      <div className="container-booking space-y-12">
        
        {/* Upper Footer: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 border-b border-white/10 pb-12">
          
          <div className="space-y-4">
            <h4 className="text-sm font-bold">Support</h4>
            <ul className="text-[13px] space-y-2 opacity-80 font-medium">
              <li><Link to="/" className="hover:underline">Coronavirus (COVID-19) FAQs</Link></li>
              <li><Link to="/" className="hover:underline">Manage your trips</Link></li>
              <li><Link to="/" className="hover:underline">Customer Service Help</Link></li>
              <li><Link to="/" className="hover:underline">Safety Resource centre</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold">Discover</h4>
            <ul className="text-[13px] space-y-2 opacity-80 font-medium">
              <li><Link to="/hotels" className="hover:underline">Genius loyalty programme</Link></li>
              <li><Link to="/hotels" className="hover:underline">Seasonal and holiday deals</Link></li>
              <li><Link to="/hotels" className="hover:underline">Travel articles</Link></li>
              <li><Link to="/hotels" className="hover:underline">Booking.com for Business</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold">Terms and settings</h4>
            <ul className="text-[13px] space-y-2 opacity-80 font-medium">
              <li><Link to="/" className="hover:underline">Privacy & cookies</Link></li>
              <li><Link to="/" className="hover:underline">Terms and conditions</Link></li>
              <li><Link to="/" className="hover:underline">Partner dispute</Link></li>
              <li><Link to="/" className="hover:underline">Modern Slavery Statement</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold">Partners</h4>
            <ul className="text-[13px] space-y-2 opacity-80 font-medium">
              <li><Link to="/manager/login" className="hover:underline">Extranet login</Link></li>
              <li><Link to="/manager/register" className="hover:underline">Partner help</Link></li>
              <li><Link to="/register" className="hover:underline">List your property</Link></li>
              <li><Link to="/" className="hover:underline">Become an affiliate</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold">About</h4>
            <ul className="text-[13px] space-y-2 opacity-80 font-medium">
              <li><Link to="/" className="hover:underline">About PK UrbanStay</Link></li>
              <li><Link to="/" className="hover:underline">Careers</Link></li>
              <li><Link to="/" className="hover:underline">Sustainability</Link></li>
              <li><Link to="/" className="hover:underline">Corporate contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Lower Footer: Brand & Social */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="space-y-2 text-center md:text-left">
              <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 justify-center md:justify-start">
                 PK <span className="text-sky-400">UrbanStay</span>
              </Link>
              <p className="text-[11px] opacity-60 font-medium">
                 PK UrbanStay is part of the global travel network. © 2026-2030 PK UrbanStay.com™. All rights reserved.
              </p>
           </div>

           <div className="flex items-center gap-6">
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity"><Facebook size={20} /></a>
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity"><Instagram size={20} /></a>
              <a href="#" className="opacity-70 hover:opacity-100 transition-opacity"><Twitter size={20} /></a>
           </div>
        </div>

        {/* Trust Row */}
        <div className="flex flex-wrap items-center justify-center gap-8 pt-4">
           <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-80 transition-all cursor-default">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Secured by SSL</span>
           </div>
           <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-80 transition-all cursor-default">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Verified Merchant</span>
           </div>
           <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-80 transition-all cursor-default">
              <Globe size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Global Partner network</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
