import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchManagerHotels, 
  createManagerHotel, 
  updateManagerHotel, 
  deleteManagerHotel,
  uploadImage,
  fetchRooms, 
  createManagerRoom, 
  updateManagerRoom, 
  deleteManagerRoom 
} from '../../services/api';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  MapPin, 
  Image as ImageIcon, 
  X, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  BedDouble,
  ChevronRight,
  ArrowLeft,
  Users,
  Bed,
  Check,
  Maximize2,
  Tv,
  Coffee,
  Wind,
  Bath,
  Vault,
  Wifi,
  Layout
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const HOTEL_AMENITIES = [
  { id: 'wifi', name: 'Free Wi-Fi', icon: '📶' },
  { id: 'front-desk', name: '24/7 Front Desk', icon: '🛎️' },
  { id: 'ac', name: 'Air Conditioning', icon: '❄️' },
  { id: 'room-service', name: 'Room Service', icon: '🍽️' },
  { id: 'housekeeping', name: 'Daily Housekeeping', icon: '🧹' },
  { id: 'power', name: 'Power Backup', icon: '🔌' },
  { id: 'restaurant', name: 'Restaurant', icon: '🍴' },
  { id: 'breakfast', name: 'Complimentary Breakfast', icon: '🥐' },
  { id: 'pool', name: 'Swimming Pool', icon: '🏊' },
  { id: 'gym', name: 'Gym / Fitness Center', icon: '🏋️' },
  { id: 'spa', name: 'Spa & Wellness', icon: '💆' },
  { id: 'lounge', name: 'Lounge Area', icon: '🛋️' },
  { id: 'parking', name: 'Free Parking', icon: '🅿️' },
  { id: 'pickup', name: 'Airport Pickup/Drop', icon: '🚖' },
  { id: 'travel', name: 'Travel Desk', icon: '🧳' }
];

const ROOM_AMENITIES = [
  { name: 'Kingsize Bed', icon: '🛏️' },
  { name: 'Private Bathroom', icon: '🚿' },
  { name: 'Bathtub', icon: '🛁' },
  { name: 'Workspace / Desk', icon: '🖥️' },
  { name: 'Smart TV', icon: '📺' },
  { name: 'Kitchenette', icon: '🍳' },
  { name: 'Mini Bar', icon: '🧊' },
  { name: 'Coffee Maker', icon: '☕' },
  { name: 'In-room Safe', icon: '🗄️' },
  { name: 'Hair Dryer', icon: '🧺' },
  { name: 'Balcony / Terrace', icon: '🚪' },
  { name: 'Blackout Curtains', icon: '🌑' },
  { name: 'Room Service', icon: '🍽️' },
  { name: 'Daily Housekeeping', icon: '🧹' }
];

const ROOM_TYPES = [
  'Standard Room', 'Deluxe Room', 'Executive Suite', 'Presidential Suite', 'Family Suite', 'Studio Apartment', 'Penthouse'
];

const ManagerHotels = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [form, setForm] = useState({
    name: '', location: '', description: '', address: '', city: '', amenities: [], images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // --- Room Management State ---
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    type: 'Luxury Suite', price: '', capacity: 2, totalRooms: 1, amenities: [], images: []
  });

  const loadHotels = async () => {
    setLoading(true);
    try {
      const { data } = await fetchManagerHotels();
      setHotels(data);
    } catch (err) {
      setError('Failed to load hotels');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleOpenModal = (hotel = null) => {
    if (hotel) {
      setEditingHotel(hotel);
      setForm({ ...hotel, amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [] });
    } else {
      setEditingHotel(null);
      setForm({ name: '', location: '', description: '', address: '', city: '', amenities: [], images: [] });
    }
    setShowModal(true);
  };

  const toggleHotelAmenity = (name) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter(a => a !== name)
        : [...prev.amenities, name]
    }));
  };

  const toggleRoomAmenity = (name) => {
    setRoomForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(name)
        ? prev.amenities.filter(a => a !== name)
        : [...prev.amenities, name]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const { data } = await uploadImage(formData);
        uploadedUrls.push(data.url);
      } catch (err) { console.error('Upload failed', err); }
    }
    setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (editingHotel) {
        await updateManagerHotel(editingHotel._id, form);
      } else {
        await createManagerHotel(form);
      }
      setShowModal(false);
      loadHotels();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hotel?')) return;
    try {
      await deleteManagerHotel(id);
      loadHotels();
    } catch (err) { alert('Failed to delete hotel'); }
  };

  // --- Room Management Functions ---
  const loadRooms = async (hotelId) => {
    setLoadingRooms(true);
    try {
      const { data } = await fetchRooms(hotelId);
      setRooms(data);
    } catch (err) { console.error('Failed to load rooms'); }
    finally { setLoadingRooms(false); }
  };

  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setRoomForm({
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        totalRooms: room.totalRooms,
        amenities: Array.isArray(room.amenities) ? room.amenities : [],
        images: room.images || []
      });
    } else {
      setEditingRoom(null);
      setRoomForm({
        type: 'Deluxe Room', price: '', capacity: 2, totalRooms: 1, amenities: [], images: []
      });
    }
    setShowRoomModal(true);
  };

  const handleRoomImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const { data } = await uploadImage(formData);
        uploadedUrls.push(data.url);
      } catch (err) { console.error(err); }
    }
    setRoomForm(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const roomData = { ...roomForm, hotelId: selectedHotelForRooms._id };
      if (editingRoom) {
        await updateManagerRoom(editingRoom._id, roomData);
      } else {
        await createManagerRoom(roomData);
      }
      setShowRoomModal(false);
      loadRooms(selectedHotelForRooms._id);
    } catch (err) {
      alert(err.response?.data?.message || 'Room action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Delete this room type?')) return;
    try {
      await deleteManagerRoom(id);
      loadRooms(selectedHotelForRooms._id);
    } catch (err) { alert('Failed to delete room'); }
  };

  if (loading && hotels.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="animate-fade">
      {!selectedHotelForRooms ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Manage Hotels</h1>
              <p style={{ color: '#64748b' }}>List and organize your luxury properties.</p>
            </div>
            <button onClick={() => navigate('/manager/add-hotel')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1.6rem' }}>
              <Plus size={20} /> Add New Hotel
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
            {hotels.map((hotel) => (
              <div key={hotel._id} className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9', background: 'white' }}>
                <div style={{ height: '220px', position: 'relative' }}>
                  <img 
                    src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600"} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    alt={hotel.name} 
                  />
                  <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleOpenModal(hotel)} style={{ background: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(hotel._id)} style={{ background: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {!hotel.isApproved && (
                    <div style={{ position: 'absolute', top: '15px', left: '15px', background: '#fef9c3', color: '#854d0e', padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '800' }}>
                      PENDING APPROVAL
                    </div>
                  )}
                </div>
                <div style={{ padding: '2rem' }}>
                  <h3 className="luxury-font" style={{ fontSize: '1.6rem', margin: '0 0 0.5rem 0' }}>{hotel.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                    <MapPin size={18} /> {hotel.city}, {hotel.location}
                  </div>
                  <button 
                    onClick={() => { setSelectedHotelForRooms(hotel); loadRooms(hotel._id); }}
                    style={{ 
                      width: '100%', padding: '1rem', background: '#1e293b', color: 'white', border: 'none', borderRadius: '16px', fontWeight: '700', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.2s', marginTop: '1.5rem'
                    }}
                  >
                    <BedDouble size={20} /> Manage Rooms <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="rooms-management animate-fade">
          <button onClick={() => setSelectedHotelForRooms(null)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '600', marginBottom: '2rem', padding: 0 }}>
            <ArrowLeft size={20} /> Back to My Hotels
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h1 className="luxury-font" style={{ fontSize: '2.4rem', margin: '0 0 0.5rem 0' }}>{selectedHotelForRooms.name}</h1>
              <p style={{ color: '#64748b' }}>Inventory and Room Management</p>
            </div>
            <button onClick={() => handleOpenRoomModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 1.8rem' }}>
              <Plus size={20} /> Add Room Type
            </button>
          </div>

          {loadingRooms ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            </div>
          ) : rooms.length === 0 ? (
            <div style={{ padding: '8rem 2rem', textAlign: 'center', background: 'white', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
              <BedDouble size={48} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
              <h2 className="luxury-font" style={{ fontSize: '1.8rem', margin: '0 0 1rem 0' }}>No rooms yet</h2>
              <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Get started by adding your first room type for this hotel.</p>
              <button onClick={() => handleOpenRoomModal()} className="btn-primary" style={{ padding: '1rem 2.5rem', borderRadius: '16px' }}>
                Create Room Type
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
              {rooms.map((room) => (
                <div key={room._id} className="glass-panel" style={{ borderRadius: '28px', overflow: 'hidden', border: '1px solid #f1f5f9', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ height: '220px', position: 'relative' }}>
                    <img src={room.images?.[0] || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={room.type} />
                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', padding: '8px 16px', borderRadius: '40px', fontWeight: '800', color: '#c5a059', fontSize: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {formatCurrency(room.price)}/night
                    </div>
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <h3 className="luxury-font" style={{ margin: 0, fontSize: '1.6rem', color: '#0f172a' }}>{room.type}</h3>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => handleOpenRoomModal(room)} style={{ color: '#6366f1', background: '#f5f3ff', width: '38px', height: '38px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteRoom(room._id)} style={{ color: '#ef4444', background: '#fef2f2', width: '38px', height: '38px', borderRadius: '12px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={18} /></button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>
                        <Users size={18} /> {room.capacity} Guests
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>
                        <Bed size={18} /> {room.totalRooms} Units
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {room.amenities?.map((a, i) => (
                        <span key={i} style={{ padding: '5px 14px', background: '#f1f5f9', borderRadius: '10px', fontSize: '0.75rem', color: '#1e293b', fontWeight: '700', border: '1px solid #e2e8f0' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1.5rem' }}>
          <div className="animate-fade" style={{ background: 'white', width: '100%', maxWidth: '850px', borderRadius: '32px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              <div>
                <h2 className="luxury-font" style={{ fontSize: '2rem', margin: 0, color: '#0f172a' }}>{editingRoom ? 'Update Room Type' : 'Register Room Type'}</h2>
                <p style={{ margin: '0.25rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Configure the specifications for this category.</p>
              </div>
              <button onClick={() => setShowRoomModal(false)} style={{ background: '#f1f5f9', border: 'none', color: '#94a3b8', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ padding: '2.5rem', overflowY: 'auto', flex: 1 }}>
              <form onSubmit={handleRoomSubmit} id="roomForm">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Classification</label>
                    <select 
                      value={roomForm.type} 
                      onChange={e => setRoomForm({...roomForm, type: e.target.value})} 
                      className="form-input"
                      style={{ height: '54px' }}
                    >
                      {ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      {!ROOM_TYPES.includes(roomForm.type) && <option value={roomForm.type}>{roomForm.type}</option>}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nightly Rate (USD)</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: '#94a3b8' }}>$</span>
                      <input required type="number" value={roomForm.price} onChange={e => setRoomForm({...roomForm, price: e.target.value})} className="form-input" style={{ paddingLeft: '2.5rem' }} placeholder="0.00" />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Occupancy (Max Guests)</label>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', borderRadius: '16px', padding: '0.5rem', border: '1.5px solid #e2e8f0' }}>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <button 
                          key={num} 
                          type="button" 
                          onClick={() => setRoomForm({...roomForm, capacity: num})}
                          style={{ 
                            flex: 1, height: '40px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700',
                            background: roomForm.capacity === num ? '#0f172a' : 'transparent',
                            color: roomForm.capacity === num ? 'white' : '#64748b',
                            transition: '0.2s'
                          }}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Inventory (Rooms Available)</label>
                    <input required type="number" value={roomForm.totalRooms} onChange={e => setRoomForm({...roomForm, totalRooms: e.target.value})} className="form-input" />
                  </div>
                </div>

                <div style={{ marginBottom: '2.5rem' }}>
                  <label className="form-label" style={{ marginBottom: '1.25rem', display: 'block' }}>In-Room Amenities & Essentials</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                    {ROOM_AMENITIES.map((item) => (
                      <div 
                        key={item.name}
                        onClick={() => toggleRoomAmenity(item.name)}
                        style={{
                          padding: '1rem', borderRadius: '16px', border: `2px solid ${roomForm.amenities.includes(item.name) ? '#c5a059' : '#f1f5f9'}`,
                          background: roomForm.amenities.includes(item.name) ? 'rgba(197, 160, 89, 0.05)' : '#f8fafc',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.85rem', transition: '0.2s', position: 'relative'
                        }}
                      >
                        <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: roomForm.amenities.includes(item.name) ? '#1e293b' : '#64748b' }}>{item.name}</span>
                        {roomForm.amenities.includes(item.name) && (
                          <div style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c5a059', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={12} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="form-label" style={{ marginBottom: '1.25rem', display: 'block' }}>Room Showcase (Images)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1.25rem' }}>
                    {roomForm.images.map((img, i) => (
                      <div key={i} style={{ position: 'relative', height: '110px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => setRoomForm({...roomForm, images: roomForm.images.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '6px', right: '6px', background: 'rgba(239, 68, 68, 0.9)', borderRadius: '50%', width: '24px', height: '24px', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12} /></button>
                      </div>
                    ))}
                    <label style={{ height: '110px', border: '2px dashed #cbd5e1', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', background: '#f8fafc', transition: '0.2s' }} className="image-label">
                      <ImageIcon size={24} />
                      <span style={{ fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: '700' }}>Add Photo</span>
                      <input type="file" multiple hidden onChange={handleRoomImageUpload} />
                    </label>
                  </div>
                </div>
              </form>
            </div>

            <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid #f1f5f9', background: '#fdfcfb', display: 'flex', gap: '1.25rem' }}>
              <button type="button" onClick={() => setShowRoomModal(false)} style={{ flex: 1, height: '54px', borderRadius: '16px', background: '#f1f5f9', color: '#475569', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' }}>Cancel</button>
              <button type="submit" form="roomForm" disabled={submitting} className="btn-primary" style={{ flex: 2, height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1rem', fontWeight: '700' }}>
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                {editingRoom ? 'Update Room Type' : 'Create Room Type'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hotel Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div className="animate-fade" style={{ background: 'white', width: '100%', maxWidth: '900px', maxHeight: '90vh', borderRadius: '32px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflow: 'hidden' }}>
            <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
              <h2 className="luxury-font" style={{ fontSize: '1.8rem', margin: 0, color: '#0f172a' }}>{editingHotel ? 'Edit Luxury Property' : 'List New Property'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', width: '38px', height: '38px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
            </div>
            <div style={{ padding: '2.5rem', overflowY: 'auto', flex: 1 }}>
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertCircle size={20} /> {error}
                </div>
              )}
              <form id="hotelForm" onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Hotel Name</label>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="e.g. PK Grand Palace" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location / Area</label>
                    <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="form-input" placeholder="e.g. Downtown" />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="form-input" placeholder="e.g. Mumbai" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Full Address</label>
                    <input required type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="form-input" placeholder="Complete address" />
                  </div>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Detailed Description</label>
                  <textarea required rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="form-input" style={{ resize: 'none' }}></textarea>
                </div>
                <div style={{ marginBottom: '2.5rem' }}>
                  <label className="form-label" style={{ marginBottom: '1.25rem', display: 'block' }}>Standard Amenities</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.75rem' }}>
                    {HOTEL_AMENITIES.map((item) => (
                      <div 
                        key={item.name}
                        onClick={() => toggleHotelAmenity(item.name)}
                        style={{
                          padding: '0.85rem 1rem', borderRadius: '14px', border: `2px solid ${form.amenities.includes(item.name) ? '#c5a059' : '#f1f5f9'}`,
                          background: form.amenities.includes(item.name) ? 'rgba(197, 160, 89, 0.05)' : '#f8fafc',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: '0.2s', position: 'relative'
                        }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: form.amenities.includes(item.name) ? '#1e293b' : '#64748b' }}>{item.name}</span>
                        {form.amenities.includes(item.name) && (
                          <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#c5a059', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Check size={12} strokeWidth={4} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="form-label" style={{ marginBottom: '1rem', display: 'block' }}>Hotel Visuals</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1.25rem' }}>
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: 'relative', height: '100px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)', borderRadius: '50%', width: '22px', height: '22px', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={12} /></button>
                      </div>
                    ))}
                    <label style={{ height: '100px', border: '2px dashed #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', background: '#f8fafc' }} className="image-label">
                      <ImageIcon size={24} />
                      <span style={{ fontSize: '0.75rem', marginTop: '0.4rem', fontWeight: '700' }}>Upload</span>
                      <input type="file" multiple hidden onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1.25rem', background: '#fdfcfb' }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, height: '54px', borderRadius: '16px', background: '#f1f5f9', color: '#64748b', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" form="hotelForm" disabled={submitting} className="btn-primary" style={{ flex: 1, padding: '0.8rem 1.5rem', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700' }}>
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                {editingHotel ? 'Save Changes' : 'Publish Property'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .form-group { display: flex; flexDirection: column; gap: 0.75rem; }
        .form-label { font-weight: 800; font-size: 0.9rem; color: #1e293b; letter-spacing: 0.2px; }
        .form-input { 
          padding: 1.1rem 1.4rem; border: 1.5px solid #e2e8f0; border-radius: 16px; outline: none; 
          transition: 0.2s; font-family: inherit; font-size: 1rem; width: 100%; box-sizing: border-box; background: #ffffff;
        }
        .form-input:focus { border-color: #c5a059; box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1); background: #fffcf5; }
        .image-label:hover { border-color: #c5a059; background: #fffcf5; color: #c5a059; }
      `}</style>
    </div>
  );
};

export default ManagerHotels;
