import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { Loader2, Star, Shield, Clock, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Heart, ArrowRight } from 'lucide-react';

const Home = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const { data } = await fetchHotels();
        setPopularHotels(data.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleSearch = (query) => {
    const checkin = query.startDate ? new Date(query.startDate.getTime() - (query.startDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
    const checkout = query.endDate ? new Date(query.endDate.getTime() - (query.endDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0] : '';
    const params = new URLSearchParams();
    if (query.location) params.append('location', query.location);
    if (checkin) params.append('checkin', checkin);
    if (checkout) params.append('checkout', checkout);
    if (query.guests) params.append('guests', query.guests);
    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <div className="animate-fade" style={{ background: '#ffffff', minHeight: '100vh', scrollBehavior: 'smooth' }}>
      
      {/* 1. HERO SECTION (HOME) */}
      <section id="home" style={{ padding: '0 4%', marginTop: '1.5rem', position: 'relative' }}>
        <div className="hero-container" style={{
          height: '85vh',
          minHeight: '750px',
          width: '100%',
          borderRadius: '2.5rem',
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          background: 'linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.6)), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          
          <div style={{ zIndex: 5, maxWidth: '900px', marginBottom: '8rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', padding: '0.6rem 1.4rem', borderRadius: '50px', marginBottom: '2.5rem', border: '1px solid rgba(255,255,255,0.25)' }}>
              <Heart size={18} fill="#ff385c" color="#ff385c" />
              <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Chosen By Travelers Globally</span>
            </div>
            <h1 className="hero-title" style={{ 
              fontSize: '6rem', 
              fontWeight: '400', 
              fontFamily: '"Playfair Display", serif',
              marginBottom: '1.5rem', 
              lineHeight: '1',
              textShadow: '0 15px 45px rgba(0,0,0,0.3)',
              letterSpacing: '-2px'
            }}>
              Discover Elegance<br />Beyond Compare
            </h1>
            <p className="hero-subtitle" style={{ 
              fontSize: '1.4rem', 
              opacity: 0.95, 
              margin: '0 auto', 
              lineHeight: '1.6', 
              maxWidth: '750px',
              fontStyle: 'italic',
              fontWeight: '300'
            }}>
              Find your sanctuary with StayNow. From coastal retreats to mountain escapes, rediscover the art of travel.
            </p>
          </div>

          <div style={{ 
            position: 'absolute', 
            bottom: '2.5rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '92%', 
            maxWidth: '1050px',
            zIndex: 10
          }}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* 2. POPULAR HOTELS SECTION */}
      <section id="hotels" style={{ marginTop: '12rem', padding: '0 8%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
           <div>
              <span style={{ color: '#c5a059', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.85rem' }}>Curated Selections</span>
              <h2 className="luxury-font" style={{ fontSize: '3.5rem', margin: '0.75rem 0', color: '#0f172a' }}>Signature Destinations</h2>
           </div>
           <button onClick={() => navigate('/hotels')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#1e293b', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', borderBottom: '2px solid #c5a059', paddingBottom: '4px' }}>
              View All Properties <ArrowRight size={18} />
           </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8rem 0' }}>
            <Loader2 className="animate-spin" size={60} color="#c5a059" />
          </div>
        ) : popularHotels.length > 0 ? (
          <div className="hotels-grid">
            {popularHotels.map((hotel) => (
              <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '6rem', color: '#64748b', background: '#f8fafc', borderRadius: '32px', fontSize: '1.2rem' }}>
            Our exclusive collection is being refreshed. Return soon for new discoveries.
          </div>
        )}
      </section>

      {/* 3. DEALS SECTION */}
      <section id="deals" style={{ marginTop: '12rem', background: '#fdfcfb', padding: '10rem 8%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '6rem', alignItems: 'center' }}>
          <div>
             <span style={{ color: '#c5a059', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2.5px', fontSize: '0.85rem' }}>Member Access</span>
             <h2 className="luxury-font" style={{ fontSize: '4rem', margin: '1.25rem 0 2rem 0', color: '#0f172a', lineHeight: '1.1' }}>Exclusive Privileges For Every Journey</h2>
             <p style={{ color: '#64748b', fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '3.5rem', maxWidth: '600px' }}>
               StayNow members receive unparalleled benefits. Unlock secret rates, complimentary breakfast, and personalized concierge services at any destination.
             </p>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                <div className="privilege-item">
                   <div style={{ marginBottom: '1.25rem' }}><Star color="#c5a059" size={32} /></div>
                   <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Seasonal Savings</h4>
                   <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Enjoy up to 30% discount on off-peak bookings and extended stays.</p>
                </div>
                <div className="privilege-item">
                   <div style={{ marginBottom: '1.25rem' }}><Shield color="#c5a059" size={32} /></div>
                   <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.5rem' }}>Luxury Protection</h4>
                   <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Full insurance and flexible cancellations on all Platinum properties.</p>
                </div>
             </div>
             <button onClick={() => navigate('/hotels')} style={{ marginTop: '4rem', padding: '1.4rem 3.5rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '100px', fontWeight: '800', cursor: 'pointer', fontSize: '1.05rem', transition: '0.3s', boxShadow: '0 15px 30px rgba(15, 23, 42, 0.2)' }}>
                Become A Member
             </button>
          </div>
          <div style={{ position: 'relative' }}>
             <div style={{ width: '100%', height: '700px', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.15)' }}>
                <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <div style={{ position: 'absolute', bottom: '40px', left: '-40px', background: 'white', padding: '2.5rem', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
                <div style={{ color: '#c5a059', display: 'flex', gap: '4px', marginBottom: '0.75rem' }}>
                   {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="#c5a059" />)}
                </div>
                <p style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1e293b', marginBottom: '0.25rem' }}>Premium Satisfaction</p>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '600' }}>Voted #1 App 2026</p>
             </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section id="about-us" style={{ padding: '12rem 8%' }}>
        <div style={{ display: 'flex', gap: '8rem', alignItems: 'center' }}>
           <div style={{ flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600" style={{ width: '100%', borderRadius: '40px' }} />
           </div>
           <div style={{ flex: 1.2 }}>
              <span style={{ color: '#c5a059', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.85rem' }}>Our Mission</span>
              <h2 className="luxury-font" style={{ fontSize: '4rem', margin: '1rem 0 2rem 0', color: '#0f172a', lineHeight: '1.1' }}>Crafting Timeless Moments</h2>
              <p style={{ color: '#64748b', fontSize: '1.2rem', lineHeight: '1.9', marginBottom: '3rem' }}>
                At StayNow, we don’t just book rooms; we create gateways to experiences. Our collection is handpicked for quality, character, and exceptional service. Whether it's a bustling city center or a desert oasis, your journey is our masterpiece.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
                 <div style={{ textAlign: 'center' }}>
                    <h4 style={{ fontSize: '3rem', fontWeight: '400', color: '#0f172a', margin: 0, fontFamily: '"Playfair Display", serif' }}>450+</h4>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Destinations</span>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <h4 style={{ fontSize: '3rem', fontWeight: '400', color: '#0f172a', margin: 0, fontFamily: '"Playfair Display", serif' }}>15k</h4>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Luxury Rooms</span>
                 </div>
                 <div style={{ textAlign: 'center' }}>
                    <h4 style={{ fontSize: '3rem', fontWeight: '400', color: '#0f172a', margin: 0, fontFamily: '"Playfair Display", serif' }}>24h</h4>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Elite Concierge</span>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 5. CONTACT US SECTION (FOOTER) */}
      <footer id="contact-us" style={{ background: '#0f172a', color: 'white', padding: '10rem 8% 5rem 8%', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4rem', paddingBottom: '8rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ maxWidth: '350px' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <img src="/logo.png" style={{ width: '45px', height: '45px', objectFit: 'contain' }} alt="StayNow" />
                <h2 className="luxury-font" style={{ fontSize: '2.5rem', fontStyle: 'italic', fontWeight: '400', margin: 0 }}>StayNow</h2>
             </div>
             <p style={{ opacity: 0.6, lineHeight: '2', fontSize: '1rem', marginBottom: '3rem' }}>
                Redefining the standard of luxury travel through curated experiences and impeccable service since 2012.
             </p>
             <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ padding: '12px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}><Facebook size={20} /></div>
                <div style={{ padding: '12px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}><Instagram size={20} /></div>
                <div style={{ padding: '12px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}><Twitter size={20} /></div>
             </div>
          </div>
          
          <div className="footer-links" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 160px)', gap: '4rem' }}>
             <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '2.5rem', color: '#c5a059', textTransform: 'uppercase', letterSpacing: '1px' }}>Explore</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: 0.7, fontSize: '0.95rem' }}>
                   <li style={{ cursor: 'pointer' }}>Properties</li>
                   <li style={{ cursor: 'pointer' }}>Memorable Deals</li>
                   <li style={{ cursor: 'pointer' }}>Member Lounge</li>
                   <li style={{ cursor: 'pointer' }}>Journal</li>
                </ul>
             </div>
             <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '2.5rem', color: '#c5a059', textTransform: 'uppercase', letterSpacing: '1px' }}>Support</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: 0.7, fontSize: '0.95rem' }}>
                   <li style={{ cursor: 'pointer' }}>Concierge Help</li>
                   <li style={{ cursor: 'pointer' }}>Travel Advisory</li>
                   <li style={{ cursor: 'pointer' }}>Refund Policy</li>
                   <li style={{ cursor: 'pointer' }}>FAQ</li>
                </ul>
             </div>
             <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '2.5rem', color: '#c5a059', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact</h4>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.7, fontSize: '0.95rem' }}>
                   <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><MapPin size={18} /> Global Hub, UK</li>
                   <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Mail size={18} /> hello@staynow.com</li>
                   <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Phone size={18} /> +44 20 7946 0958</li>
                </ul>
             </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '5rem', opacity: 0.3, fontSize: '0.85rem', fontWeight: '600' }}>
           © {new Date().getFullYear()} StayNow Luxury Hospitality Group.
        </div>
      </footer>

      <style>{`
        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4rem;
        }

        .luxury-font {
          font-family: 'Playfair Display', serif;
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1200px) {
          .hotels-grid { grid-template-columns: repeat(2, 1fr); gap: 3rem; }
          .footer-links { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 1024px) {
          .hero-title { font-size: 4.5rem !important; }
          section { padding: 8rem 6% !important; }
          div[style*="gridTemplateColumns: 1.2fr 0.8fr"] { grid-template-columns: 1fr !important; }
          div[style*="display: flex; gap: 8rem"] { flex-direction: column !important; gap: 4rem !important; }
        }

        @media (max-width: 768px) {
          .hotels-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 3.5rem !important; letter-spacing: -1px !important; }
          .hero-subtitle { font-size: 1.1rem !important; }
          .footer-links { grid-template-columns: 1fr !important; }
          .hero-container { border-radius: 1.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
