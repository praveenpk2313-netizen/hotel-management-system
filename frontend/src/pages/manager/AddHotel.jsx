import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createManagerHotel, 
  uploadImage 
} from '../../services/api';
import { 
  Plus, 
  Image as ImageIcon, 
  X, 
  Loader2,
  AlertCircle,
  Save,
  ArrowLeft,
  Check
} from 'lucide-react';

const AMENITIES_LIST = [
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

const AddHotel = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    location: '',
    description: '',
    address: '',
    city: '',
    amenities: [],
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleAmenity = (name) => {
    setForm(prev => ({
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
      } catch (err) {
        console.error('Upload failed', err);
      }
    }
    
    setForm(prev => ({ ...prev, images: [...prev.images, ...uploadedUrls] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) {
      setError('Please upload at least one hotel image.');
      return;
    }
    if (form.amenities.length === 0) {
      setError('Please select at least one amenity.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createManagerHotel(form);
      navigate('/manager/hotels');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create hotel');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
      <button 
        onClick={() => navigate('/manager/hotels')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer', marginBottom: '2rem' }}
      >
        <ArrowLeft size={18} /> Back to My Hotels
      </button>

      <div className="glass-panel" style={{ borderRadius: '32px', padding: '3.5rem', border: '1px solid #f1f5f9', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 className="luxury-font" style={{ fontSize: '2.8rem', margin: '0 0 0.75rem 0', color: '#0f172a' }}>Add New Hotel</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Define the soul of your property. Provide accurate details to attract sophisticated travelers.</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1.25rem', borderRadius: '16px', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="form-group-custom">
              <label className="label-custom">Hotel Name</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-custom" placeholder="e.g. Royal Grand Palace" />
            </div>
            <div className="form-group-custom">
              <label className="label-custom">Location / Area</label>
              <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-custom" placeholder="e.g. Marine Drive" />
            </div>
            <div className="form-group-custom">
              <label className="label-custom">City</label>
              <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input-custom" placeholder="e.g. Mumbai" />
            </div>
            <div className="form-group-custom">
              <label className="label-custom">Full Address</label>
              <input required type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-custom" placeholder="Complete postal address" />
            </div>
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <label className="label-custom">Property Description</label>
            <textarea required rows="5" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-custom" style={{ resize: 'none', height: '150px' }} placeholder="Describe the ambiance, the view, and the unique experiences awaiting your guests..."></textarea>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <label className="label-custom" style={{ marginBottom: '1.5rem', display: 'block' }}>Key Amenities & Services</label>
            <div className="amenities-grid-custom">
              {AMENITIES_LIST.map((item) => (
                <div 
                  key={item.name}
                  onClick={() => toggleAmenity(item.name)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '16px',
                    border: `2px solid ${form.amenities.includes(item.name) ? 'var(--primary)' : '#f1f5f9'}`,
                    background: form.amenities.includes(item.name) ? 'rgba(197, 160, 89, 0.05)' : '#f8fafc',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    transition: '0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={e => !form.amenities.includes(item.name) && (e.currentTarget.style.borderColor = '#e2e8f0')}
                  onMouseLeave={e => !form.amenities.includes(item.name) && (e.currentTarget.style.borderColor = '#f1f5f9')}
                >
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: form.amenities.includes(item.name) ? '#1e293b' : '#64748b' }}>{item.name}</span>
                  {form.amenities.includes(item.name) && (
                    <div style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} strokeWidth={4} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '3.5rem' }}>
            <label className="label-custom" style={{ marginBottom: '1.5rem', display: 'block' }}>Property Gallery</label>
            <div className="image-grid-custom" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: 'relative', height: '140px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' }}>
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={16} /></button>
                </div>
              ))}
              <label style={{ height: '140px', border: '2px dashed #cbd5e1', borderRadius: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', background: '#f8fafc', transition: '0.3s' }} className="image-upload-btn">
                <ImageIcon size={32} />
                <span style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontWeight: '700' }}>Add Photo</span>
                <input type="file" multiple hidden onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div style={{ marginTop: '4rem', borderTop: '1px solid #f1f5f9', paddingTop: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={submitting} 
              style={{ 
                width: '300px', 
                height: '60px',
                background: '#0f172a',
                color: 'white',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
                transition: '0.3s'
              }}
              onMouseEnter={e => !submitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => !submitting && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {submitting ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
              {submitting ? 'Creating Property...' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-group-custom { display: flex; flexDirection: column; gap: 0.75rem; }
        .label-custom { font-weight: 700; font-size: 0.95rem; color: #1e293b; margin-bottom: 0.5rem; display: block; }
        .input-custom { padding: 1.1rem 1.4rem; border: 1.5px solid #e2e8f0; border-radius: 16px; outline: none; transition: 0.3s; font-size: 1rem; width: 100%; box-sizing: border-box; }
        .input-custom:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1); }
        .image-upload-btn:hover { border-color: var(--primary); background: #fdfcfb; color: var(--primary); }
        .amenities-grid-custom { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }

        @media (max-width: 900px) {
          .glass-panel { padding: 2rem !important; }
          .luxury-font { font-size: 2.2rem !important; }
        }

        @media (max-width: 640px) {
          .glass-panel { padding: 1.5rem !important; border-radius: 20px !important; }
          .input-custom { padding: 0.9rem 1.1rem !important; }
          .amenities-grid-custom { grid-template-columns: 1fr 1fr !important; }
        }

        @media (max-width: 480px) {
          .amenities-grid-custom { grid-template-columns: 1fr !important; }
          .luxury-font { font-size: 1.8rem !important; }
        }
      `}</style>
    </div>
  );
};

export default AddHotel;
