import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  fetchManagerHotels, 
  createManagerHotel, 
  updateManagerHotel, 
  deleteManagerHotel,
  uploadImage
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
  Bed
} from 'lucide-react';
import { fetchRooms, createManagerRoom, updateManagerRoom, deleteManagerRoom } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';

const ManagerHotels = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    address: '',
    city: '',
    amenities: '',
    images: []
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
    type: 'Luxury Suite',
    price: '',
    capacity: 2,
    totalRooms: 1,
    amenities: '',
    images: []
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
      setForm({
        ...hotel,
        amenities: hotel.amenities.join(', ')
      });
    } else {
      setEditingHotel(null);
      setForm({
        name: '',
        location: '',
        description: '',
        address: '',
        city: '',
        amenities: '',
        images: []
      });
    }
    setShowModal(true);
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
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
    
    setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const hotelData = {
      ...form,
      amenities: form.amenities.split(',').map(a => a.trim()).filter(a => a)
    };

    try {
      if (editingHotel) {
        await updateManagerHotel(editingHotel._id, hotelData);
      } else {
        await createManagerHotel(hotelData);
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
    if (!window.confirm('Delete this hotel? All associated rooms will be affected.')) return;
    try {
      await deleteManagerHotel(id);
      loadHotels();
    } catch (err) {
      alert('Failed to delete hotel');
    }
  };

  // --- Room Management Functions ---
  const loadRooms = async (hotelId) => {
    setLoadingRooms(true);
    try {
      const { data } = await fetchRooms(hotelId);
      setRooms(data);
    } catch (err) {
      console.error('Failed to load rooms');
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setRoomForm({
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        totalRooms: room.totalRooms,
        amenities: room.amenities?.join(', ') || '',
        images: room.images || []
      });
    } else {
      setEditingRoom(null);
      setRoomForm({
        type: 'Luxury Suite',
        price: '',
        capacity: 2,
        totalRooms: 1,
        amenities: '',
        images: []
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
      const roomData = {
        ...roomForm,
        hotelId: selectedHotelForRooms._id,
        amenities: roomForm.amenities.split(',').map(a => a.trim()).filter(a => a)
      };

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
                    onClick={() => {
                      setSelectedHotelForRooms(hotel);
                      loadRooms(hotel._id);
                    }}
                    style={{ 
                      width: '100%',
                      padding: '1rem', 
                      background: '#1e293b', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '16px', 
                      fontWeight: '700', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      transition: '0.2s',
                      marginTop: '1.5rem'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#334155'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#1e293b'}
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
          <button 
            onClick={() => setSelectedHotelForRooms(null)} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'none', 
              border: 'none', 
              color: '#64748b', 
              cursor: 'pointer', 
              fontWeight: '600',
              marginBottom: '2rem',
              padding: 0
            }}
          >
            <ArrowLeft size={20} /> Back to My Hotels
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <div>
              <h1 className="luxury-font" style={{ fontSize: '2.4rem', margin: '0 0 0.5rem 0' }}>{selectedHotelForRooms.name}</h1>
              <p style={{ color: '#64748b' }}>Inventory and Room Management</p>
            </div>
            <button 
              onClick={() => handleOpenRoomModal()} 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 1.8rem' }}
            >
              <Plus size={20} /> Add Room Type
            </button>
          </div>

          {loadingRooms ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
              <Loader2 className="animate-spin" size={32} color="var(--primary)" />
            </div>
          ) : rooms.length === 0 ? (
            <div style={{ 
              padding: '8rem 2rem', 
              textAlign: 'center', 
              background: 'white', 
              borderRadius: '32px', 
              border: '2px dashed #e2e8f0' 
            }}>
              <BedDouble size={48} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
              <h2 className="luxury-font" style={{ fontSize: '1.8rem', margin: '0 0 1rem 0' }}>No rooms yet</h2>
              <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Get started by adding your first room type for this hotel.</p>
              <button 
                onClick={() => handleOpenRoomModal()} 
                className="btn-primary" 
                style={{ padding: '1rem 2.5rem', borderRadius: '16px' }}
              >
                Create Room Type
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
              {rooms.map((room) => (
                <div key={room._id} className="glass-panel" style={{ borderRadius: '28px', overflow: 'hidden', border: '1px solid #f1f5f9', background: 'white' }}>
                  <div style={{ height: '220px', position: 'relative' }}>
                    <img src={room.images?.[0] || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={room.type} />
                    <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(255,255,255,0.95)', padding: '8px 16px', borderRadius: '40px', fontWeight: '800', color: 'var(--primary)', fontSize: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      {formatCurrency(room.price)}/night
                    </div>
                  </div>
                  <div style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                      <h3 className="luxury-font" style={{ margin: 0, fontSize: '1.4rem' }}>{room.type}</h3>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => handleOpenRoomModal(room)} style={{ color: '#6366f1', background: '#f5f3ff', width: '36px', height: '36px', borderRadius: '10px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteRoom(room._id)} style={{ color: '#ef4444', background: '#fef2f2', width: '36px', height: '36px', borderRadius: '10px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={18} /></button>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontWeight: '500' }}>
                        <Users size={18} /> {room.capacity} Guests
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', fontWeight: '500' }}>
                        <Bed size={18} /> {room.totalRooms} Units
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {room.amenities?.map((a, i) => (
                        <span key={i} style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{a}</span>
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
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="animate-fade" style={{ background: 'white', width: '90%', maxWidth: '600px', borderRadius: '28px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="luxury-font" style={{ fontSize: '1.8rem', margin: 0 }}>{editingRoom ? 'Edit Room' : 'Add Room Type'}</h2>
              <button onClick={() => setShowRoomModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <form onSubmit={handleRoomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Room Type</label>
                  <input required type="text" value={roomForm.type} onChange={e => setRoomForm({...roomForm, type: e.target.value})} className="form-input" placeholder="e.g. Presidential Suite" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Price Per Night</label>
                  <input required type="number" value={roomForm.price} onChange={e => setRoomForm({...roomForm, price: e.target.value})} className="form-input" placeholder="0.00" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Capacity (Guests)</label>
                  <input required type="number" value={roomForm.capacity} onChange={e => setRoomForm({...roomForm, capacity: e.target.value})} className="form-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Total Units Available</label>
                  <input required type="number" value={roomForm.totalRooms} onChange={e => setRoomForm({...roomForm, totalRooms: e.target.value})} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Amenities (comma separated)</label>
                <input type="text" value={roomForm.amenities} onChange={e => setRoomForm({...roomForm, amenities: e.target.value})} className="form-input" placeholder="Kingsize Bed, Sea View, Mini Bar" />
              </div>

              <div>
                <label style={{ fontWeight: '700', fontSize: '0.9rem', display: 'block', marginBottom: '0.75rem' }}>Room Images</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {roomForm.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => setRoomForm({...roomForm, images: roomForm.images.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '18px', height: '18px', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
                    </div>
                  ))}
                  <label style={{ height: '80px', border: '2px dashed #e2e8f0', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}>
                    <ImageIcon size={20} />
                    <input type="file" multiple hidden onChange={handleRoomImageUpload} />
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowRoomModal(false)} style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: '#f1f5f9', border: 'none', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 2, padding: '0.8rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="animate-fade" style={{ 
            background: 'white', 
            width: '100%', 
            maxWidth: '720px', 
            maxHeight: '90vh',
            borderRadius: '24px', 
            display: 'flex', 
            flexDirection: 'column', 
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)', 
            overflow: 'hidden' 
          }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'white' }}>
              <h2 className="luxury-font" style={{ fontSize: '1.6rem', margin: 0, color: '#1e293b' }}>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
            </div>

            {/* Modal Body - Scrollable */}
            <div style={{ padding: '2rem', overflowY: 'auto', flex: 1 }}>
              {error && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <AlertCircle size={20} /> {error}
                </div>
              )}

              <form id="hotelForm" onSubmit={handleSubmit}>
                {/* Row 1: Name + Location */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="form-label">Hotel Name</label>
                    <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="e.g. PK UrbanStay Palace" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="form-label">Location / Area</label>
                    <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="form-input" placeholder="e.g. Downtown" />
                  </div>
                </div>

                {/* Row 2: City + Address */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="form-label">City</label>
                    <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="form-input" placeholder="e.g. Mumbai" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label className="form-label">Full Address</label>
                    <input required type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="form-input" placeholder="e.g. 12 Marine Drive" />
                  </div>
                </div>

                {/* Row 3: Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <label className="form-label">Description</label>
                  <textarea required rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="form-input" style={{ resize: 'vertical' }}></textarea>
                </div>

                {/* Row 4: Amenities */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <label className="form-label">Amenities (comma separated)</label>
                  <input required type="text" value={form.amenities} onChange={e => setForm({...form, amenities: e.target.value})} className="form-input" placeholder="WiFi, Pool, Spa, Breakfast" />
                </div>

                {/* Row 5: Images */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <label className="form-label">Hotel Images</label>
                  <div className="image-upload-grid">
                    {form.images.map((img, i) => (
                      <div key={i} style={{ position: 'relative', height: '100px', borderRadius: '12px', overflow: 'hidden' }}>
                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button type="button" onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={12} /></button>
                      </div>
                    ))}
                    <label style={{ height: '100px', border: '2px dashed #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', background: '#f8fafc' }}>
                      <ImageIcon size={24} />
                      <span style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Upload</span>
                      <input type="file" multiple hidden onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '1rem', background: '#fdfcfb', flexShrink: 0 }}>
              <button type="button" onClick={() => setShowModal(false)} className="btn-cancel" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>Cancel</button>
              <button type="submit" form="hotelForm" disabled={submitting} className="btn-primary" style={{ flex: 1, padding: '0.75rem 1.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                {editingHotel ? 'Update Hotel' : 'Add Hotel'}
              </button>
            </div>

          </div>
        </div>
      )}

      <style>{`
        .hotel-form {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .full-width {
          grid-column: span 2;
        }

        .form-label {
          font-weight: 700;
          font-size: 0.9rem;
          color: #1e293b;
        }

        .form-input { 
          padding: 0.8rem 1rem; 
          border: 1px solid #e2e8f0; 
          border-radius: 10px; 
          outline: none; 
          transition: 0.2s; 
          font-family: inherit;
        }
        .form-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.1); }

        .image-upload-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .btn-cancel {
          flex: 1;
          padding: 1rem;
          border-radius: 10px;
          background: #f1f5f9;
          border: none;
          font-weight: 700;
          color: #475569;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-cancel:hover { background: #e2e8f0; }

        @media (max-width: 768px) {
          .hotel-form { grid-template-columns: 1fr; }
          .full-width { grid-column: span 1; }
        }
      `}</style>
    </div>
  );
};

export default ManagerHotels;
