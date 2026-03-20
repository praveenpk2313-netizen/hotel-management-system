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
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowLeft
} from 'lucide-react';

const AddHotel = () => {
  const navigate = useNavigate();
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
      await createManagerHotel(hotelData);
      navigate('/manager/hotels');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create hotel');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/manager/hotels')}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', fontWeight: '600', cursor: 'pointer', marginBottom: '2rem' }}
      >
        <ArrowLeft size={18} /> Back to My Hotels
      </button>

      <div className="glass-panel" style={{ borderRadius: '24px', padding: '3rem', border: '1px solid #f1f5f9' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>Add New Hotel</h1>
          <p style={{ color: '#64748b' }}>Enter the details of your luxury property to list it for approval.</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '1.25rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="hotel-form-page">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Hotel Name</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input" placeholder="e.g. PK UrbanStay Palace" />
            </div>
            <div className="form-group">
              <label className="form-label">Location/Area</label>
              <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="form-input" placeholder="e.g. Downtown" />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="form-input" placeholder="City name" />
            </div>
            <div className="form-group">
              <label className="form-label">Full Address</label>
              <input required type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="form-input" placeholder="Full postal address" />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Description</label>
            <textarea required rows="5" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="form-input" style={{ resize: 'none' }} placeholder="Tell us what makes this hotel special..."></textarea>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Amenities (comma separated)</label>
            <input required type="text" value={form.amenities} onChange={e => setForm({...form, amenities: e.target.value})} className="form-input" placeholder="WiFi, Pool, Spa, Breakfast, Gym" />
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Hotel Images</label>
            <div className="image-grid">
              {form.images.map((img, i) => (
                <div key={i} style={{ position: 'relative', height: '120px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx !== i)})} style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={14} /></button>
                </div>
              ))}
              <label style={{ height: '120px', border: '2px dashed #e2e8f0', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', background: '#f8fafc', transition: '0.2s' }} className="image-label">
                <ImageIcon size={32} />
                <span style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '600' }}>Add Photo</span>
                <input type="file" multiple hidden onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <div style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              disabled={submitting} 
              className="btn-primary" 
              style={{ width: '250px', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '1rem' }}
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {submitting ? 'Creating Hotel...' : 'Submit for Approval'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .form-label {
          font-weight: 700;
          font-size: 0.9rem;
          color: #1e293b;
        }
        .form-input { 
          padding: 1rem 1.25rem; 
          border: 1px solid #e2e8f0; 
          border-radius: 12px; 
          outline: none; 
          transition: 0.2s; 
          font-family: inherit;
          font-size: 1rem;
        }
        .form-input:focus { 
          border-color: var(--primary); 
          box-shadow: 0 0 0 4px rgba(197, 160, 89, 0.1); 
        }
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 0.5rem;
        }
        .image-label:hover {
          border-color: var(--primary);
          background: #fdfcfb;
          color: var(--primary);
        }
        @media (max-width: 640px) {
          .form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default AddHotel;
