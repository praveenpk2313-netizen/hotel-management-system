import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';


const Footer = () => {
  return (
    <footer style={{ 
      backgroundColor: 'var(--secondary)', 
      color: 'white', 
      padding: '4rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container">
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h3 className="luxury-font" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>PK UrbanStay</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>
              Experience luxury like never before. Our hotels offer the finest amenities and world-class service in the most beautiful locations.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <Facebook size={20} style={{ cursor: 'pointer' }} />
              <Twitter size={20} style={{ cursor: 'pointer' }} />
              <Instagram size={20} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#94a3b8' }}>
              <li><a href="/">Home</a></li>
              <li><a href="/login">Customer Login</a></li>
              <li><a href="/register">Customer Sign Up</a></li>
              <li><a href="/booking-history">My Bookings</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Portals</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem', color: '#94a3b8' }}>
              <li><a href="/manager/login">Manager Portal</a></li>
              <li><a href="/admin/login">Admin Portal</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ marginBottom: '1.5rem' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94a3b8' }}>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <MapPin size={18} /> 123 Luxury Ave, Beverly Hills, CA
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Phone size={18} /> +1 (555) 000-0000
              </li>
              <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <Mail size={18} /> contact@pkurbanstay.com
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{ 
          borderTop: '1px solid #334155', 
          paddingTop: '2rem', 
          textAlign: 'center', 
          color: '#64748b',
          fontSize: '0.9rem'
        }}>
          &copy; {new Date().getFullYear()} PK UrbanStay. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
