import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Hotel as HotelIcon, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  CheckCircle,
  Menu,
  Clock,
  ArrowUpRight,
  UserSquare2,
  X,
  Upload,
  Save,
  Check,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
} from 'recharts';
import Sidebar from '../components/Sidebar';
import * as api from '../services/api';

const occupancyData = [
  { name: 'Week 1', value: 65 },
  { name: 'Week 2', value: 72 },
  { name: 'Week 3', value: 85 },
  { name: 'Week 4', value: 78 },
];

const AMENITIES_LIST = [
  { id: 'wifi', label: 'Free Wi-Fi', icon: '📶' },
  { id: 'ac', label: 'Air Conditioning (AC)', icon: '❄️' },
  { id: 'power', label: '24/7 Power Backup', icon: '⚡' },
  { id: 'lift', label: 'Lift / Elevator', icon: '🛗' },
  { id: 'parking', label: 'Free Parking', icon: '🅿️' },
  { id: 'reception', label: '24-hour Reception', icon: '🏪' },
  { id: 'tv', label: 'Smart TV', icon: '📺' },
  { id: 'bathroom', label: 'Attached Bathroom', icon: '🚿' },
  { id: 'geyser', label: 'Geyser (Hot Water)', icon: '🌡️' },
  { id: 'kettle', label: 'Electric Kettle', icon: '☕' },
  { id: 'desk', label: 'Study / Work Desk', icon: '💻' },
  { id: 'wardrobe', label: 'Wardrobe / Cupboard', icon: '🧺' },
  { id: 'heater', label: 'Room Heater', icon: '♨️' },
];

const ManagerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hotels');
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [showAddHotel, setShowAddHotel] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [hotelImageUrls, setHotelImageUrls] = useState([]);
  const [roomImageUrls, setRoomImageUrls] = useState([]);

  const toggleAmenity = (label) => {
    setSelectedAmenities(prev => 
      prev.includes(label) ? prev.filter(a => a !== label) : [...prev, label]
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
      // data is an array of paths
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

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.updateBookingStatus(id, status);
      loadDashboardData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const renderOverview = () => (
    <>
    </>
  );

  const renderHotels = () => (
    <div className="table-container">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 className="luxury-font" style={{ fontSize: '1.25rem' }}>Hotels Manager</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add new hotels and manage images</p>
        </div>
        <button onClick={() => setShowAddHotel(true)} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Add Hotel
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Hotel Name</th>
            <th>Location</th>
            <th>Image</th>
            <th>Amenities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((h) => (
            <tr key={h._id}>
              <td style={{ fontWeight: '600' }}>{h.name}</td>
              <td>{h.city}</td>
              <td>
                {h.images && h.images[0] ? (
                  <img src={`${api.API_BASE_URL}${h.images[0]}`} alt={h.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HotelIcon size={16} /></div>}
              </td>
              <td>{h.amenities?.slice(0, 2).join(', ')}...</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setSelectedHotel(h); loadRooms(h._id); setActiveSection('rooms'); }} className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>Manage Rooms</button>
                  <button onClick={() => api.deleteHotel(h._id).then(loadDashboardData)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const handleUpdateRoom = async (id, data) => {
    try {
      await api.updateRoom(id, data);
      loadRooms(selectedHotel?._id);
    } catch (err) {
      alert('Update failed');
    }
  };

  const renderRoomCategories = () => (
    <div className="table-container">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 className="luxury-font" style={{ fontSize: '1.25rem' }}>Room Management</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Create room categories for <strong>{selectedHotel?.name}</strong></p>
        </div>
        <button onClick={() => setShowAddRoom(true)} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> Create Room
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Room No</th>
            <th>Category</th>
            <th>Image</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r._id}>
              <td style={{ fontWeight: '700' }}>#{r.roomNumber}</td>
              <td>{r.type}</td>
              <td>
                {r.images && r.images[0] ? (
                  <img src={`${api.API_BASE_URL}${r.images[0]}`} alt={r.type} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                ) : <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={16} /></div>}
              </td>
              <td>{r.capacity} Persons</td>
              <td>
                <button onClick={() => api.deleteRoom(r._id).then(() => loadRooms(selectedHotel._id))} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}><Trash2 size={16} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPricingAvailability = () => (
    <div className="table-container">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
        <h3 className="luxury-font" style={{ fontSize: '1.25rem' }}>Price & Availability</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-time inventory management for <strong>{selectedHotel?.name}</strong></p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Room</th>
            <th>Price per Night</th>
            <th>Current Status</th>
            <th>Quick Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r._id}>
              <td style={{ fontWeight: '600' }}>{r.type} (#{r.roomNumber})</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>$</span>
                  <input 
                    type="number" 
                    defaultValue={r.price} 
                    onBlur={(e) => handleUpdateRoom(r._id, { price: Number(e.target.value) })}
                    style={{ width: '90px', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontWeight: '700', color: 'var(--primary)' }}
                  />
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: r.isAvailable ? '#10b981' : '#ef4444' }}></div>
                  <span style={{ fontWeight: '500', color: r.isAvailable ? '#10b981' : '#ef4444' }}>
                    {r.isAvailable ? 'Available' : 'Booked/Maintenance'}
                  </span>
                </div>
              </td>
              <td>
                <button 
                  onClick={() => handleUpdateRoom(r._id, { isAvailable: !r.isAvailable })}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    background: 'white',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  Mark as {r.isAvailable ? 'Unavailable' : 'Available'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBookings = () => (
    <div className="table-container">
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #f1f5f9' }}>
        <h3 className="luxury-font" style={{ fontSize: '1.25rem' }}>Reservation Tracking</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage guest check-ins and statuses</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Guest</th>
            <th>Hotel/Room</th>
            <th>Dates</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b._id}>
              <td>
                <p style={{ fontWeight: '600' }}>{b.user?.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.user?.email}</p>
              </td>
              <td>
                <p style={{ fontWeight: '500' }}>{b.hotel?.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Room #{b.room?.roomNumber}</p>
              </td>
              <td>
                <p style={{ fontSize: '0.85rem' }}>{new Date(b.checkInDate).toLocaleDateString()}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>to {new Date(b.checkOutDate).toLocaleDateString()}</p>
              </td>
              <td style={{ fontWeight: '600' }}>${b.totalPrice}</td>
              <td>
                <select 
                  value={b.status} 
                  onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td>
                <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.7rem' }}>View Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSection = () => {
    if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>Loading dashboard...</div>;
    
    switch (activeSection) {
      case 'hotels': return renderHotels();
      case 'rooms': return renderRoomCategories();
      case 'pricing': return renderPricingAvailability();
      case 'bookings': return renderBookings();
      default: return renderHotels();
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={isSidebarOpen} 
        activeSection={activeSection} 
        onSectionChange={(id) => {
          setActiveSection(id);
          setIsSidebarOpen(false);
        }}
      />
      
      <main className="dashboard-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
              className="mobile-menu-btn"
            >
              <Menu size={24} />
            </button>
            <h1 className="luxury-font" style={{ fontSize: '2rem', textTransform: 'capitalize' }}>
              {activeSection} Portal
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-primary" onClick={() => setShowAddHotel(true)}>Add Hotel</button>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input type="text" placeholder="Search..." style={{ padding: '10px 12px 10px 40px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '250px' }} />
            </div>
          </div>
        </header>

        {renderSection()}

        {/* Add Hotel Modal */}
        {showAddHotel && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
            <div className="stat-card" style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95%', 
              maxWidth: '600px', 
              maxHeight: '90vh',
              background: 'white', 
              borderRadius: '16px', 
              display: 'flex', 
              flexDirection: 'column', 
              padding: 0, 
              overflow: 'hidden' 
            }}>
              
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <h3 className="luxury-font" style={{ margin: 0 }}>Add New Hotel</h3>
                <button onClick={() => { setShowAddHotel(false); setSelectedAmenities([]); setHotelImageUrls([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={20} color="#64748b" /></button>
              </div>

              <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                <form id="dashboardHotelForm" onSubmit={async (e) => {
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
                }} className="better-form">
                  <div className="form-group-col">
                    <label className="input-label">Hotel Name</label>
                    <input name="name" placeholder="Enter hotel name" required className="styled-input" />
                  </div>
                  
                  <div className="form-row-2">
                    <div className="form-group-col">
                      <label className="input-label">City</label>
                      <input name="city" placeholder="City" required className="styled-input" />
                    </div>
                    <div className="form-group-col">
                      <label className="input-label">Address</label>
                      <input name="address" placeholder="Full address" required className="styled-input" />
                    </div>
                  </div>
                  
                  <div className="form-group-col">
                    <label className="input-label">Description</label>
                    <textarea name="description" placeholder="Describe the hotel..." required className="styled-input" style={{ height: '100px', resize: 'vertical' }} />
                  </div>
                    
                  <div>
                    <p style={{ fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Select Amenities</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', padding: '10px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                      {AMENITIES_LIST.map((item) => (
                        <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedAmenities.includes(`${item.label} ${item.icon}`)}
                            onChange={() => toggleAmenity(`${item.label} ${item.icon}`)}
                          />
                          <span>{item.icon} {item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Hotel Images</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={(e) => uploadFileHandler(e, setHotelImageUrls)}
                        style={{ fontSize: '0.85rem' }}
                      />
                      {uploading && <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Uploading...</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {hotelImageUrls.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', width: 'fit-content' }}>
                          <img src={`${api.API_BASE_URL}${url}`} alt="Preview" style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                          <button 
                            type="button"
                            onClick={() => removeImage(url, setHotelImageUrls)} 
                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1rem', background: '#f8fafc', flexShrink: 0 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', fontWeight: '600' }} onClick={() => setShowAddHotel(false)}>Cancel</button>
                <button type="submit" form="dashboardHotelForm" className="btn-primary" disabled={uploading} style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  {uploading ? 'Processing...' : <><Save size={18} /> Save Hotel</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Room Modal */}
        {showAddRoom && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
            <div className="stat-card" style={{ 
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '95%', 
              maxWidth: '500px', 
              maxHeight: '90vh',
              background: 'white', 
              borderRadius: '16px', 
              display: 'flex', 
              flexDirection: 'column', 
              padding: 0, 
              overflow: 'hidden' 
            }}>
              
              <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <h3 className="luxury-font" style={{ margin: 0 }}>Add New Room</h3>
                <button onClick={() => { setShowAddRoom(false); setRoomImageUrls([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}><X size={20} color="#64748b" /></button>
              </div>

              <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
                <form id="dashboardRoomForm" onSubmit={async (e) => {
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
                }} className="better-form">
                  <div className="form-row-2">
                    <div className="form-group-col">
                      <label className="input-label">Room Number</label>
                      <input name="roomNumber" placeholder="Ex: 101" required className="styled-input" />
                    </div>
                    <div className="form-group-col">
                      <label className="input-label">Category</label>
                      <select name="type" required className="styled-input">
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Presidential">Presidential</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-row-2">
                    <div className="form-group-col">
                      <label className="input-label">Price/Night</label>
                      <input name="price" type="number" placeholder="Ex: 150" required className="styled-input" />
                    </div>
                    <div className="form-group-col">
                      <label className="input-label">Capacity (Persons)</label>
                      <input name="capacity" type="number" placeholder="Ex: 2" required className="styled-input" />
                    </div>
                  </div>
                    
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Room Images</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        multiple
                        onChange={(e) => uploadFileHandler(e, setRoomImageUrls)}
                        style={{ fontSize: '0.85rem' }}
                      />
                      {uploading && <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Uploading...</span>}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                      {roomImageUrls.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', width: 'fit-content' }}>
                          <img src={`${api.API_BASE_URL}${url}`} alt="Preview" style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                          <button 
                            type="button"
                            onClick={() => removeImage(url, setRoomImageUrls)} 
                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--error)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1rem', background: '#f8fafc', flexShrink: 0 }}>
                <button type="button" className="btn-secondary" style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', fontWeight: '600' }} onClick={() => setShowAddRoom(false)}>Cancel</button>
                <button type="submit" form="dashboardRoomForm" className="btn-primary" disabled={uploading} style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {uploading ? 'Processing...' : <><Save size={18} /> Add Room</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .modal-overlay { 
          animation: fadeIn 0.2s ease-out; 
          backdrop-filter: blur(4px);
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        .stat-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .better-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group-col {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .input-label {
          font-weight: 600;
          font-size: 0.9rem;
          color: #1e293b;
        }

        .styled-input {
          padding: 10px 14px;
          border-radius: 8px;
          border: 1px solid #cbd5e1;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .styled-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.1);
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .modal-actions button {
          flex: 1;
          padding: 0.8rem;
          border-radius: 8px;
          font-weight: 600;
        }

        .btn-secondary {
          background: #f1f5f9;
          border: none;
          color: #475569;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-secondary:hover {
          background: #e2e8f0;
        }

        @media (max-width: 1024px) {
          .mobile-menu-btn { display: block !important; }
          .dashboard-content { padding: 1.5rem !important; }
          header { flex-direction: column; align-items: flex-start !important; gap: 1.5rem; }
          div[style*="gridTemplateColumns: 1.5fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .data-table { display: block; overflow-x: auto; }
        }
      `}</style>
    </div>
  );
};

export default ManagerDashboard;
