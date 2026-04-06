import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  BedDouble, 
  BookOpen, 
  IndianRupee, 
  LogOut, 
  Bell, 
  LayoutDashboard, 
  MessageSquare,
  Hotel,
  Plus,
  Trash2,
  X,
  Search,
  Save,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../services/api';

const AMENITIES_LIST = [
  { id: 'wifi', label: 'Free WiFi', icon: '📶' },
  { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
  { id: 'gym', label: 'Fitness Center', icon: '🏋️' },
  { id: 'spa', label: 'Luxury Spa', icon: '💆' },
  { id: 'breakfast', label: 'Breakfast Included', icon: '🍳' },
  { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
  { id: 'parking', label: 'Free Parking', icon: '🅿️' },
  { id: 'tv', label: 'Smart TV', icon: '📺' }
];

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Forms
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [hotelImageUrls, setHotelImageUrls] = useState([]);
  const [roomImageUrls, setRoomImageUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [hotelsRes, bookingsRes] = await Promise.all([
        api.fetchManagerHotels(),
        api.fetchAllBookings()
      ]);
      setHotels(hotelsRes.data);
      setBookings(bookingsRes.data);
      if (hotelsRes.data.length > 0) {
        setSelectedHotel(hotelsRes.data[0]);
        loadRooms(hotelsRes.data[0]._id);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async (hotelId) => {
    try {
      const res = await api.fetchRooms(hotelId);
      setRooms(res.data);
    } catch (err) {
      console.error('Error loading rooms:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/manager/login');
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const uploadFileHandler = async (e, setImageUrls) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }
    setUploading(true);
    try {
      const { data } = await api.uploadImage(formData);
      setImageUrls(prev => [...prev, ...data]);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const removeImage = (url, setImageUrls) => {
    setImageUrls(prev => prev.filter(item => item !== url));
  };

  // Calculate stats
  const totalHotels = hotels.length;
  const totalRooms = rooms.length;
  const today = new Date().toISOString().split('T')[0];
  const bookingsToday = bookings.filter(b => b.createdAt && b.createdAt.startsWith(today)).length;
  const revenue = bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  // --- Render Sections ---
  const renderDashboard = () => (
    <div style={{ padding: '2rem 3rem' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '2rem' }}>Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {/* Total Hotels */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #f3f4f6' }}>
          <div style={{ width: '48px', height: '48px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={24} color="#3b82f6" />
          </div>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Total Hotels</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827' }}>{totalHotels}</h3>
          </div>
        </div>

        {/* Total Rooms */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #f3f4f6' }}>
          <div style={{ width: '48px', height: '48px', background: '#fff7ed', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BedDouble size={24} color="#f97316" />
          </div>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Total Rooms</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827' }}>{totalRooms}</h3>
          </div>
        </div>

        {/* Bookings Today */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #f3f4f6' }}>
          <div style={{ width: '48px', height: '48px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="#22c55e" />
          </div>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Bookings Today</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827' }}>{bookingsToday}</h3>
          </div>
        </div>

        {/* Revenue */}
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #f3f4f6' }}>
          <div style={{ width: '48px', height: '48px', background: '#faf5ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IndianRupee size={24} color="#a855f7" />
          </div>
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Revenue</p>
            <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#111827' }}>₹{revenue.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '2rem 0' }} />
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '50px', height: '50px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <Building2 size={24} color="#111" />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>NK Hotel Bookings</h2>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem', marginTop: '2rem' }}>
         <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px', color: '#111' }}>PRIVACY</span>
         <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px', color: '#111' }}>TERMS</span>
         <span style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px', color: '#111' }}>CONTACT</span>
      </div>
    </div>
  );

  const renderManageHotels = () => (
    <div style={{ padding: '2rem 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>Manage Hotels</h2>
        <button 
          onClick={() => setShowAddHotel(true)} 
          style={{ background: '#ff5a36', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> Add Hotel
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Hotel Name</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Location</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Image</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map(h => (
              <tr key={h._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#111827' }}>{h.name}</td>
                <td style={{ padding: '1rem', color: '#4b5563' }}>{h.city}</td>
                <td style={{ padding: '1rem' }}>
                  {h.images?.length > 0 ? (
                    <img src={`http://localhost:5000${h.images[0]}`} alt={h.name} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : <div style={{ width: '48px', height: '48px', background: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Hotel size={20} color="#9ca3af" /></div>}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => { setSelectedHotel(h); loadRooms(h._id); setActiveSection('manage_rooms'); }}
                      style={{ background: '#f3f4f6', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontWeight: '600', color: '#111827', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Manage Rooms
                    </button>
                    <button onClick={() => api.deleteHotel(h._id).then(loadDashboardData)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center' }}>Loading...</td></tr>}
            {!loading && hotels.length === 0 && <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>No hotels found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderManageRooms = () => (
    <div style={{ padding: '2rem 3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>Manage Rooms</h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>Hotel: <strong>{selectedHotel?.name || 'Please select a hotel first'}</strong></p>
        </div>
        {selectedHotel && (
          <button 
            onClick={() => setShowAddRoom(true)} 
            style={{ background: '#ff5a36', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} /> Add Room
          </button>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Room No</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Category</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Price</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem', fontWeight: '600', color: '#111827' }}>#{r.roomNumber}</td>
                <td style={{ padding: '1rem', color: '#4b5563' }}>{r.type}</td>
                <td style={{ padding: '1rem', color: '#111827', fontWeight: '600' }}>₹{r.price}</td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => api.deleteRoom(r._id).then(() => loadRooms(selectedHotel._id))} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {!selectedHotel && <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>Select a hotel from Manage Hotels first.</td></tr>}
            {selectedHotel && rooms.length === 0 && <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>No rooms found for this hotel.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReservations = () => (
    <div style={{ padding: '2rem 3rem' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '2rem' }}>Reservations</h2>
      
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Guest</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Hotel</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Dates</th>
              <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '1rem' }}>
                  <p style={{ fontWeight: '600', color: '#111827' }}>{b.user?.name}</p>
                  <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{b.user?.email}</p>
                </td>
                <td style={{ padding: '1rem', color: '#4b5563' }}>{b.hotel?.name || 'N/A'}</td>
                <td style={{ padding: '1rem', color: '#4b5563', fontSize: '0.875rem' }}>
                  {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '999px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    background: b.status === 'confirmed' ? '#dcfce7' : '#f3f4f6', 
                    color: b.status === 'confirmed' ? '#166534' : '#4b5563',
                    textTransform: 'capitalize'
                  }}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>No reservations found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div style={{ padding: '2rem 3rem' }}>
      <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827', marginBottom: '2rem' }}>Reviews</h2>
      <div style={{ padding: '3rem', textAlign: 'center', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
        <MessageSquare size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: '#4b5563', fontWeight: '600' }}>No reviews available at the moment.</p>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#fafafa', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
        style={{ position: 'fixed', top: '15px', left: '15px', zIndex: 1000, background: 'white', border: 'none', padding: '0.5rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', display: 'none' }}
        className="mobile-only-btn"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? 'open' : ''}`} style={{ 
        width: '260px', 
        background: '#ffffff', 
        borderRight: '1px solid #e5e7eb', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }}>
        <div style={{ padding: '2rem 1.5rem', flexShrink: 0 }}>
          <h1 style={{ color: '#ff5a36', fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>Manager Portal</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginTop: '0.3rem', fontWeight: '600' }}>Welcome back, Manager</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 1rem' }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'manage_hotels', label: 'Manage Hotels', icon: Building2 },
            { id: 'manage_rooms', label: 'Manage Rooms', icon: BedDouble },
            { id: 'reservations', label: 'Reservations', icon: BookOpen },
            { id: 'reviews', label: 'Reviews', icon: MessageSquare }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setIsMobileMenuOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', width: '100%',
                background: activeSection === item.id ? '#ff5a36' : 'transparent',
                color: activeSection === item.id ? 'white' : '#4b5563',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                textAlign: 'left', fontWeight: '600', fontSize: '0.9rem',
                transition: '0.2s'
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: '1.5rem' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', padding: '0.8rem 1rem',
              background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer',
              fontWeight: '700', fontSize: '0.9rem'
            }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Top Navbar */}
        <header style={{ 
          height: '70px', 
          background: '#ffffff', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', background: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Building2 size={18} color="#111" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#111827' }}>NK Manager</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: '500' }}>Manager</span>
            <div style={{ width: '36px', height: '36px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={18} color="#4b5563" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <div style={{ width: '28px', height: '28px', border: '1px solid #e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
               </div>
               <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#111827' }}>Manager</span>
               <span style={{ background: '#ffedd5', color: '#ea580c', fontSize: '0.6rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '800' }}>MANAGER</span>
            </div>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}>
               <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        {/* Dynamic Content */}
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'manage_hotels' && renderManageHotels()}
        {activeSection === 'manage_rooms' && renderManageRooms()}
        {activeSection === 'reservations' && renderReservations()}
        {activeSection === 'reviews' && renderReviews()}

      </main>

      {/* Add Hotel Modal Overlay */}
      {showAddHotel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Add New Hotel</h3>
              <button onClick={() => { setShowAddHotel(false); setSelectedAmenities([]); setHotelImageUrls([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <form id="addHotelForm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    name: formData.get('name'),
                    description: formData.get('description'),
                    city: formData.get('city'),
                    address: formData.get('address'),
                    amenities: selectedAmenities,
                    images: hotelImageUrls
                  };
                  await api.createHotel(data);
                  setShowAddHotel(false);
                  setSelectedAmenities([]);
                  setHotelImageUrls([]);
                  loadDashboardData();
                }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Hotel Name</label>
                  <input name="name" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>City</label>
                    <input name="city" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Address</label>
                    <input name="address" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Description</label>
                  <textarea name="description" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', minHeight: '100px' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Amenities</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                    {AMENITIES_LIST.map((item) => (
                      <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={selectedAmenities.includes(item.id)} onChange={() => toggleAmenity(item.id)} />
                        {item.icon} {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Images</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => uploadFileHandler(e, setHotelImageUrls)} style={{ fontSize: '0.85rem' }} />
                  {uploading && <span style={{ fontSize: '0.75rem', color: '#ff5a36' }}>Uploading...</span>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {hotelImageUrls.map((url, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={`http://localhost:5000${url}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                        <button type="button" onClick={() => removeImage(url, setHotelImageUrls)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowAddHotel(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button form="addHotelForm" type="submit" disabled={uploading} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '8px', background: '#ff5a36', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Save size={18} /> Save Hotel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Room Modal Overlay */}
      {showAddRoom && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>Add New Room</h3>
              <button onClick={() => { setShowAddRoom(false); setRoomImageUrls([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b" /></button>
            </div>
            
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              <form id="addRoomForm" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = {
                    hotel: selectedHotel?._id,
                    roomNumber: formData.get('roomNumber'),
                    type: formData.get('type'),
                    price: Number(formData.get('price')),
                    capacity: Number(formData.get('capacity')),
                    images: roomImageUrls
                  };
                  await api.createRoom(data);
                  setShowAddRoom(false);
                  setRoomImageUrls([]);
                  loadRooms(selectedHotel?._id);
                }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Room Number</label>
                    <input name="roomNumber" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Category</label>
                    <select name="type" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }}>
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Price/Night (₹)</label>
                    <input name="price" type="number" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Capacity</label>
                    <input name="capacity" type="number" required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>Images</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => uploadFileHandler(e, setRoomImageUrls)} style={{ fontSize: '0.85rem' }} />
                  {uploading && <span style={{ fontSize: '0.75rem', color: '#ff5a36' }}>Uploading...</span>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {roomImageUrls.map((url, idx) => (
                      <div key={idx} style={{ position: 'relative' }}>
                        <img src={`http://localhost:5000${url}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                        <button type="button" onClick={() => removeImage(url, setRoomImageUrls)} style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </form>
            </div>
            <div style={{ padding: '1.25rem 1.5rem', background: '#f9fafb', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '1rem' }}>
              <button onClick={() => setShowAddRoom(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', background: 'white', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button form="addRoomForm" type="submit" disabled={uploading} style={{ flex: 1, padding: '0.75rem', border: 'none', borderRadius: '8px', background: '#ff5a36', color: 'white', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Save size={18} /> Add Room
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        body { margin: 0; padding: 0; }
        * { box-sizing: border-box; }
        @media (max-width: 768px) {
          .mobile-only-btn { display: block !important; }
          .dashboard-sidebar {
            position: fixed !important;
            transform: translateX(-100%);
            transition: 0.3s;
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          header { flex-wrap: wrap; height: auto !important; padding: 1rem !important; gap: 1rem; }
          header > div:last-child {
            display: none !important; /* Hide right menu on mobile for simplicity */
          }
        }
      `}</style>
    </div>
  );
};

export default ManagerDashboard;
