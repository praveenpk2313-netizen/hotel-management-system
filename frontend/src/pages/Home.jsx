import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { Loader2, Star, Shield, Clock, MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

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

  // Handle smooth scroll when navigating via hash
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
          height: '80vh',
          minHeight: '700px',
          width: '100%',
          borderRadius: '4rem',
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center',
          background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.7)), url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)'
        }}>
          
          <div style={{ zIndex: 5, maxWidth: '900px', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '0.6rem 1.25rem', borderRadius: '50px', marginBottom: '2rem', border: '1px solid rgba(255,255,255,0.2)' }}>
              <Star size={18} fill="#ffb800" color="#ffb800" />
              <span style={{ fontSize: '0.9rem', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>Excellence In Hospitality</span>
            </div>
            <h1 className="hero-title" style={{ 
              fontSize: '5.5rem', 
              fontWeight: '400', 
              fontFamily: '"Playfair Display", serif',
              marginBottom: '1.5rem', 
              lineHeight: '1.1',
              textShadow: '0 10px 30px rgba(0,0,0,0.4)',
              letterSpacing: '-1px'
            }}>
              Discover Elegance<br />Beyond Compare
            </h1>
            <p className="hero-subtitle" style={{ 
              fontSize: '1.25rem', 
              opacity: 0.95, 
              margin: '0 auto', 
              lineHeight: '1.7', 
              maxWidth: '750px',
              fontWeight: '400',
              fontStyle: 'italic'
            }}>
              Embark on a journey of luxury and comfort. From secluded mountain retreats to vibrant urban sanctuaries, find your perfect sanctuary with Stay Savvy.
            </p>
          </div>

          <div style={{ 
            position: 'absolute', 
            bottom: '-40px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '90%', 
            maxWidth: '1100px',
            zIndex: 10
          }}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* 2. POPULAR HOTELS SECTION */}
      <section id="hotels" style={{ marginTop: '10rem', padding: '0 6%' }}>
        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
           <span style={{ color: '#c5a059', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.9rem' }}>Curated Selections</span>
           <h2 className="luxury-font" style={{ fontSize: '3.2rem', margin: '0.75rem 0', color: '#0f172a' }}>Signature Destinations</h2>
           <div style={{ height: '4px', width: '80px', background: '#c5a059', margin: '1.5rem auto' }}></div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
            <Loader2 className="animate-spin" size={50} color="#c5a059" />
          </div>
        ) : popularHotels.length > 0 ? (
          <div className="hotels-grid">
            {popularHotels.map((hotel) => (
              <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b', fontSize: '1.2rem' }}>
            Our exclusive collection is being updated. Please check back shortly.
          </div>
        )}
      </section>

      {/* 3. DEALS SECTION */}
      <section id="deals" style={{ marginTop: '10rem', background: '#f8fafc', padding: '8rem 6%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
             <span style={{ color: '#c5a059', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.9rem' }}>Limited Offers</span>
             <h2 className="luxury-font" style={{ fontSize: '3.5rem', margin: '1rem 0 2rem 0', color: '#0f172a', lineHeight: '1.2' }}>Exclusive Member Privileges</h2>
             <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem' }}>
               Unlock unparalleled value with our seasonal promotions. Members enjoy complimentary upgrades, early check-ins, and bespoke experiences tailored to your desires.
             </p>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}><Star color="#c5a059" size={24} /></div>
                   <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' }}>Up to 35% Off Seasonal Bookings</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}><Shield color="#c5a059" size={24} /></div>
                   <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' }}>Complimentary Spa & Wellness Access</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}><Clock color="#c5a059" size={24} /></div>
                   <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' }}>Flexible Cancellation Policies</span>
                </div>
             </div>
             <button onClick={() => navigate('/hotels')} style={{ marginTop: '3.5rem', padding: '1.2rem 3rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '50px', fontWeight: '700', cursor: 'pointer', fontSize: '1rem', transition: '0.3s' }}>
                Explore All Deals
             </button>
          </div>
          <div style={{ position: 'relative' }}>
             <div style={{ width: '100%', height: '600px', borderRadius: '30px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.15)' }}>
                <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             </div>
             <div style={{ position: 'absolute', top: '-30px', right: '-30px', background: '#c5a059', color: 'white', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 40px rgba(197, 160, 89, 0.3)' }}>
                <span style={{ fontSize: '3rem', fontWeight: '800', display: 'block' }}>35%</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Limited Time</span>
             </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT US SECTION */}
      <section id="about-us" style={{ padding: '10rem 6%' }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
           <span style={{ color: '#c5a059', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.9rem' }}>Our Heritage</span>
           <h2 className="luxury-font" style={{ fontSize: '3.5rem', margin: '1rem 0 2.5rem 0', color: '#0f172a' }}>Redefining Hospitality</h2>
           <p style={{ color: '#64748b', fontSize: '1.2rem', lineHeight: '2', fontStyle: 'italic' }}>
             "At StayNow, we believe that travel is more than just reaching a destination; it's about the moments that linger long after you return home. We curate only the most exceptional properties, ensuring every guest experiences the epitome of luxury, service, and local charm."
           </p>
           <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', marginTop: '5rem' }}>
              <div>
                 <h4 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', margin: '0' }}>500+</h4>
                 <p style={{ color: '#c5a059', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '0.5rem' }}>Luxury Hotels</p>
              </div>
              <div>
                 <h4 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', margin: '0' }}>120k</h4>
                 <p style={{ color: '#c5a059', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '0.5rem' }}>Happy Guests</p>
              </div>
              <div>
                 <h4 style={{ fontSize: '3rem', fontWeight: '800', color: '#0f172a', margin: '0' }}>45</h4>
                 <p style={{ color: '#c5a059', fontWeight: '700', textTransform: 'uppercase', fontSize: '0.8rem', marginTop: '0.5rem' }}>Global Cities</p>
              </div>
           </div>
        </div>
      </section>

      {/* 5. CONTACT US SECTION (FOOTER) */}
      <footer id="contact-us" style={{ background: '#0f172a', color: 'white', padding: '8rem 6% 4rem 6%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4rem', paddingBottom: '6rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ gridColumn: 'span 1' }}>
             <h2 className="luxury-font" style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontStyle: 'italic', fontWeight: '400' }}>StayNow</h2>
             <p style={{ opacity: 0.6, lineHeight: '1.8', fontSize: '0.95rem' }}>
                Your global gateway to curated luxury accommodations and unparalleled travel experiences.
             </p>
             <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2.5rem' }}>
                <div style={{ cursor: 'pointer', color: '#94a3b8' }} onMouseOver={e => e.currentTarget.style.color = '#c5a059'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}><Facebook size={20} /></div>
                <div style={{ cursor: 'pointer', color: '#94a3b8' }} onMouseOver={e => e.currentTarget.style.color = '#c5a059'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}><Instagram size={20} /></div>
                <div style={{ cursor: 'pointer', color: '#94a3b8' }} onMouseOver={e => e.currentTarget.style.color = '#c5a059'} onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}><Twitter size={20} /></div>
             </div>
          </div>
          
          <div>
             <h4 style={{ fontSize: '1.1rem', marginBottom: '2rem', fontWeight: '700' }}>Discover</h4>
             <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.7, fontSize: '0.95rem' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => navigate('/hotels')}>Latest Hotels</li>
                <li style={{ cursor: 'pointer' }} onClick={() => window.scrollTo(0,0)}>Special Deals</li>
                <li style={{ cursor: 'pointer' }}>Travel Guides</li>
                <li style={{ cursor: 'pointer' }}>Loyalty Program</li>
             </ul>
          </div>

          <div>
             <h4 style={{ fontSize: '1.1rem', marginBottom: '2rem', fontWeight: '700' }}>Support</h4>
             <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.7, fontSize: '0.95rem' }}>
                <li style={{ cursor: 'pointer' }}>Help Center</li>
                <li style={{ cursor: 'pointer' }}>Booking Terms</li>
                <li style={{ cursor: 'pointer' }}>Privacy Policy</li>
                <li style={{ cursor: 'pointer' }}>Contact Us</li>
             </ul>
          </div>

          <div>
             <h4 style={{ fontSize: '1.1rem', marginBottom: '2rem', fontWeight: '700' }}>Reach Us</h4>
             <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem', opacity: 0.7, fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><MapPin size={18} color="#c5a059" /> 123 Luxury Ave, London, UK</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Phone size={18} color="#c5a059" /> +1 (234) 567-890</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}><Mail size={18} color="#c5a059" /> concierge@staysavvy.com</li>
             </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: '4rem', opacity: 0.4, fontSize: '0.85rem' }}>
           © {new Date().getFullYear()} StayNow Luxury Hotels. All rights reserved.
        </div>
      </footer>

      <style>{`
        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3rem;
        }

        .luxury-font {
          font-family: 'Playfair Display', serif;
          font-weight: 400;
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .hotels-grid { grid-template-columns: repeat(2, 1fr); }
          .hero-title { font-size: 4rem !important; }
        }

        @media (max-width: 768px) {
          .hotels-grid { grid-template-columns: 1fr; }
          .hero-title { font-size: 2.8rem !important; }
          .hero-container { border-radius: 2rem !important; height: 600px !important; }
          .luxury-font { font-size: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
};

export default Home;
