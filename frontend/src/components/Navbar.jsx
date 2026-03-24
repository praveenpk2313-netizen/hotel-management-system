import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, ChevronDown, User, Globe, Search } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (location.pathname !== '/') navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[1000] py-4 bg-transparent">
      <div className="max-w-[1440px] mx-auto px-10 flex justify-between items-center text-white">
        
        {/* Navigation Links */}
        <div className="flex items-center gap-12 font-semibold text-sm">
          <button onClick={scrollToTop} className="hover:text-[#c5a059] transition-colors">Home</button>
          <button onClick={() => scrollToSection('about')} className="hover:text-[#c5a059] transition-colors">About us</button>
          <button className="hover:text-[#c5a059] transition-colors">Gallery</button>
          <button onClick={() => scrollToSection('contact')} className="hover:text-[#c5a059] transition-colors">Contact us</button>
        </div>

        {/* Search and Auth */}
        <div className="flex items-center gap-8">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search Room..." 
              className="bg-white rounded-full px-6 py-2.5 w-[300px] text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#c5a059]/50 transition-all pl-12"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#c5a059]" size={18} />
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="flex items-center gap-2 hover:text-[#c5a059] transition-colors font-semibold text-sm">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <User size={16} className="text-[#c5a059]" />
              </div>
              <span>Sign In | Log In</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

