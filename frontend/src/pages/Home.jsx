import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import HotelCard from '../components/HotelCard';
import { fetchHotels } from '../services/api';
import { Loader2 } from 'lucide-react';

const Home = () => {
  const [popularHotels, setPopularHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const { data } = await fetchHotels(); // Retrieves admin-approved hotels added by managers
        setPopularHotels(data.slice(0, 6)); // Display top 6
      } catch (err) {
        console.error('Failed to fetch hotels:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHotels();
  }, []);
  const navigate = useNavigate();

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
    <div className="animate-fade" style={{ background: '#ffffff', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* Hero Section Container */}
      <section style={{ padding: '0 4%', marginTop: '1rem', position: 'relative' }}>
        <div style={{
          height: '70vh',
          minHeight: '600px',
          width: '100%',
          borderRadius: '3rem',
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'flex-start', 
          justifyContent: 'center',
          padding: '0 5%',
          background: 'linear-gradient(to right, rgba(0,0,0,0.5), rgba(0,0,0,0.1)), url("https://images.unsplash.com/photo-1537565266752-959c9d5bead5?auto=format&fit=crop&q=80&w=1920")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          overflow: 'hidden'
        }}>
          
          <div style={{ zIndex: 5, maxWidth: '700px', marginTop: '-100px' }}>
            <h1 style={{ 
              fontSize: '4.5rem', 
              fontWeight: '700', 
              marginBottom: '1.5rem', 
              letterSpacing: '-1px', 
              lineHeight: '1.1',
              textShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              Book Your Dream Stay<br />at the Best Prices
            </h1>
            <p style={{ 
              fontSize: '1.1rem', 
              opacity: 0.9, 
              margin: 0, 
              lineHeight: '1.6', 
              maxWidth: '600px',
              textShadow: '0 5px 15px rgba(0,0,0,0.2)'
            }}>
              Find the perfect place to stay, from luxury resorts to budget-friendly options. Hassle-free booking, exclusive deals, and unforgettable experiences await you!
            </p>
          </div>

          {/* Floating Search Bar overlapping bottom */}
          <div style={{ 
            position: 'absolute', 
            bottom: '2rem', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '90%', 
            maxWidth: '1000px',
            zIndex: 10
          }}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Popular Hotels Section */}
      <section id="deals" style={{ marginTop: '5rem', padding: '0 4%' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
           <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
             <span style={{ height: '3px', width: '40px', background: 'linear-gradient(90deg, transparent, #22d3ee)' }}></span>
             Popular Hotels
             <span style={{ height: '3px', width: '40px', background: 'linear-gradient(-90deg, transparent, #22d3ee)' }}></span>
           </h2>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary)" />
          </div>
        ) : popularHotels.length > 0 ? (
          <div className="hotels-grid">
            {popularHotels.map((hotel) => (
              <HotelCard key={hotel._id || hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            No hotels available at the moment.
          </div>
        )}
      </section>
      {/* About Us Section */}
      <section id="about" style={{ marginTop: '5rem', padding: '4rem 4%', background: '#f8fafc' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
           <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1.5rem' }}>About PK UrbanStay</h2>
           <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: '1.8' }}>
             We are a premium hospitality network dedicated to providing world-class stays in the heart of the city. 
             Since our inception, we have curated unique, industrial-chic luxury properties tailored for the modern traveler. 
             Whether you're looking for a peaceful retreat or a central hub for business, our verified hotels promise an unforgettable experience.
           </p>
        </div>
      </section>

      {/* Contact & Help Grid */}
      <section style={{ padding: '5rem 4%' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
            
            <div id="contact" style={{ background: 'white', padding: '3rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
               <div style={{ width: '60px', height: '60px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Contact Us</h3>
               <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Our elite customer service team is available 24/7 to assist with your reservations and special requests.</p>
               <a href="mailto:support@pkurbanstay.com" style={{ display: 'inline-block', fontWeight: 'bold', color: '#0284c7' }}>support@pkurbanstay.com</a>
            </div>

            <div id="help" style={{ background: 'white', padding: '3rem', borderRadius: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', textAlign: 'center' }}>
               <div style={{ width: '60px', height: '60px', background: '#fef3c7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
               </div>
               <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>Help & FAQs</h3>
               <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Need help managing a booking or understanding cancellation policies? We have all the answers.</p>
               <a href="/#help" style={{ display: 'inline-block', fontWeight: 'bold', color: '#d97706' }}>Visit Help Center</a>
            </div>

         </div>
      </section>
      <style>{`
        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .hotels-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hotels-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
