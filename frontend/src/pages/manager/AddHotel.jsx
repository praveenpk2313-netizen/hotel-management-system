import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  createManagerHotel, 
  uploadImage 
} from '../../services/api';
import { 
  X, 
  Loader2,
  AlertCircle,
  Save,
  ArrowLeft,
  Building2,
  Camera
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
      setError(err.response?.data?.message || 'Failed to add hotel. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-800 placeholder-gray-400 font-sans text-sm";

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-12">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/manager/hotels')}
        className="flex items-center gap-2 text-gray-500 hover:text-primary font-semibold text-sm mb-6 transition-colors font-sans"
      >
        <ArrowLeft size={16} /> Back to Hotels
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-gray-100 flex items-center gap-6 bg-gray-50/50">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary shrink-0">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold text-secondary-dark mb-2">Add New Hotel</h1>
            <p className="text-gray-500 text-sm font-sans">Fill in the details below to register a new property in your portfolio.</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm font-medium font-sans">
               <AlertCircle size={20} className="shrink-0 mt-0.5" />
               <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Section 1: Basic Info */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-lg font-serif font-bold text-secondary-dark">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Property Name</label>
                  <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClass} placeholder="e.g. Grand Plaza Hotel" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Area / Neighborhood</label>
                  <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className={inputClass} placeholder="e.g. Downtown" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">City</label>
                  <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className={inputClass} placeholder="e.g. New York" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Full Address</label>
                  <input required type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className={inputClass} placeholder="e.g. 123 Main Street" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Property Description</label>
                  <textarea required rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={`${inputClass} resize-none`} placeholder="Describe the hotel's features, ambiance, and location..."></textarea>
                </div>
              </div>
            </div>

            {/* Section 2: Amenities */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-lg font-serif font-bold text-secondary-dark">Amenities & Features</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 font-sans">
                {AMENITIES_LIST.map((item) => {
                  const isSelected = form.amenities.includes(item.name);
                  return (
                    <button 
                      key={item.id}
                      type="button"
                      onClick={() => toggleAmenity(item.name)}
                      className={`p-4 rounded-xl border transition-all text-center flex flex-col items-center gap-3 ${
                        isSelected 
                        ? 'border-primary bg-primary/5 shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <span className={`text-xs font-semibold ${isSelected ? 'text-primary' : 'text-gray-600'}`}>
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Gallery */}
            <div className="space-y-6">
              <div className="border-b border-gray-100 pb-3">
                <h3 className="text-lg font-serif font-bold text-secondary-dark">Property Gallery</h3>
                <p className="text-sm text-gray-500 mt-1 font-sans">Upload high-quality images of the exterior, lobby, and amenities.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 font-sans">
                {form.images.map((img, i) => (
                  <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                    <img src={img} className="w-full h-full object-cover" alt="Hotel preview" />
                    <button 
                      type="button" 
                      onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx !== i)})} 
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-lg text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors bg-gray-50/50">
                  <Camera size={24} />
                  <span className="text-xs font-semibold">Upload Photo</span>
                  <input type="file" multiple hidden onChange={handleImageUpload} accept="image/*" />
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4 font-sans">
              <button 
                type="button"
                onClick={() => navigate('/manager/hotels')}
                className="px-6 py-3 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submitting} 
                className="px-8 py-3 bg-secondary-dark text-white font-bold rounded-xl shadow-md shadow-secondary-dark/20 hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Property
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHotel;
