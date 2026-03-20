import React, { useState, useEffect } from 'react';
import { 
  fetchManagerRooms, 
  fetchManagerHotels,
  createManagerRoom, 
  updateManagerRoom, 
  deleteManagerRoom,
  uploadImage
} from '../../services/api';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Bed, 
  Users, 
  Image as ImageIcon, 
  X, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const ManagerRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form, setForm] = useState({
    hotelId: '',
    type: 'Deluxe Suite',
    price: '',
    capacity: 2,
    totalRooms: 5,
    amenities: '',
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [rRes, hRes] = await Promise.all([
        fetchManagerRooms(),
        fetchManagerHotels()
      ]);
      setRooms(rRes.data);
      setHotels(hRes.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setForm({
        hotelId: room.hotelId._id || room.hotelId,
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        totalRooms: room.totalRooms,
        amenities: room.amenities?.join(', ') || '',
        images: room.images || []
      });
    } else {
      setEditingRoom(null);
      setForm({
        hotelId: hotels[0]?._id || '',
        type: 'Deluxe Suite',
        price: '',
        capacity: 2,
        totalRooms: 5,
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
      } catch (err) { console.error(err); }
    }
    setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const roomData = {
      ...form,
      amenities: form.amenities.split(',').map(a => a.trim()).filter(a => a)
    };

    try {
      if (editingRoom) {
        await updateManagerRoom(editingRoom._id, roomData);
      } else {
        await createManagerRoom(roomData);
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Action failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this room type?')) return;
    try {
      await deleteManagerRoom(id);
      loadData();
    } catch (err) { alert('Failed to delete room'); }
  };

  if (loading && rooms.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Room Inventory</h1>
          <p style={{ color: '#64748b' }}>Manage types, pricing, and availability across your properties.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem' }}>
          <Plus size={20} /> Add Room Type
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {rooms.map((room) => (
          <div key={room._id} className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden', border: '1px solid #f1f5f9', background: 'white' }}>
            <div style={{ height: '180px', position: 'relative' }}>
              <img src={room.images?.[0] || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=600"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={room.type} />
              <div style={{ position: 'absolute', bottom: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 12px', borderRadius: '30px', fontWeight: '800', color: 'var(--primary)', fontSize: '0.9rem' }}>
                {formatCurrency(room.price)}/night
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.2rem 0', fontSize: '1.2rem' }}>{room.type}</h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>{room.hotelId?.name}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenModal(room)} style={{ color: '#6366f1', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={18} /></button>
                  <button onClick={() => handleDelete(room._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                  <Users size={16} /> Up to {room.capacity} Guests
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                  <Bed size={16} /> {room.totalRooms} Units
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {room.amenities?.slice(0, 4).map((a, i) => (
                  <span key={i} style={{ padding: '3px 8px', background: '#f8fafc', borderRadius: '4px', fontSize: '0.7rem', color: '#94a3b8', border: '1px solid #f1f5f9' }}>{a}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem' }}>
          <div className="animate-fade" style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '28px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 className="luxury-font" style={{ fontSize: '1.8rem', margin: 0 }}>{editingRoom ? 'Edit Room' : 'Add Room Type'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertCircle size={20} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Select Hotel</label>
                <select required value={form.hotelId} onChange={e => setForm({...form, hotelId: e.target.value})} className="form-input">
                  <option value="" disabled>Choose a property</option>
                  {hotels.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Room Type</label>
                  <input required type="text" value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="form-input" placeholder="e.g. Presidential Suite" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Price Per Night</label>
                  <input required type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="form-input" placeholder="0.00" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Capacity (Guests)</label>
                  <input required type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className="form-input" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Total Units Available</label>
                  <input required type="number" value={form.totalRooms} onChange={e => setForm({...form, totalRooms: e.target.value})} className="form-input" />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Amenities</label>
                <input type="text" value={form.amenities} onChange={e => setForm({...form, amenities: e.target.value})} className="form-input" placeholder="Kingsize Bed, Sea View, Mini Bar" />
              </div>

              <div>
                <label style={{ fontWeight: '700', fontSize: '0.9rem', display: 'block', marginBottom: '0.75rem' }}>Room Images</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                  {form.images.map((img, i) => (
                    <div key={i} style={{ position: 'relative', height: '80px', borderRadius: '10px', overflow: 'hidden' }}>
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button type="button" onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '3px', right: '3px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', width: '18px', height: '18px', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={10} /></button>
                    </div>
                  ))}
                  <label style={{ height: '80px', border: '2px dashed #e2e8f0', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}>
                    <ImageIcon size={20} />
                    <input type="file" multiple hidden onChange={handleImageUpload} />
                  </label>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', background: '#f1f5f9', border: 'none', fontWeight: '700' }}>Cancel</button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ flex: 2, padding: '0.8rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .form-input { padding: 0.8rem; border: 1px solid #e2e8f0; borderRadius: 10px; outline: none; transition: 0.2s; }
        .form-input:focus { border-color: var(--primary); }
      `}</style>
    </div>
  );
};

export default ManagerRooms;
