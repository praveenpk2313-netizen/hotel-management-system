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
