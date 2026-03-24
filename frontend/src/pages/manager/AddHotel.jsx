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
  Check,
  Building2,
  MapPin,
  Sparkles,
  Camera,
  ChevronRight,
  Info
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
      setError('Please upload at least one hotel image for the collection.');
      return;
    }
    if (form.amenities.length === 0) {
      setError('Please select at least one amenity to highlight your property.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createManagerHotel(form);
      navigate('/manager/hotels');
    } catch (err) {
      setError(err.response?.data?.message || 'Property registration failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto pb-20">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/manager/hotels')}
        className="group flex items-center gap-2 text-primary font-black uppercase text-xs tracking-[2px] mb-10 hover:-translate-x-1 transition-transform"
      >
        <ArrowLeft size={16} /> Portfolio Collection
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-premium overflow-hidden">
        
        {/* Header Section */}
        <div className="p-10 md:p-16 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-gray-50/50">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-[3px]">
                <Sparkles size={16} className="animate-pulse" /> Global Standard Registration
             </div>
             <h1 className="text-4xl md:text-5xl font-serif text-secondary-dark font-black tracking-tight leading-none">
                Expand Your <br />
                <span className="text-primary italic">Heritage</span>
             </h1>
             <p className="text-gray-400 font-medium max-w-md leading-relaxed">
                Provide precise details to register your property within the PK UrbanStay luxury elite collection.
             </p>
          </div>
          <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center text-primary transform rotate-6">
             <Building2 size={40} />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-10 md:p-16">
          {error && (
            <div className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] flex items-center gap-4 text-rose-600 text-sm font-bold mb-12 animate-shake">
               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm">
                  <AlertCircle size={20} />
               </div>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-16">
            
            {/* Section 1: Core Details */}
            <div className="space-y-10">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary-dark text-white flex items-center justify-center font-black text-xs">01</div>
                  <h3 className="text-xl font-bold text-secondary-dark font-serif uppercase tracking-wider">Identity & Location</h3>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Property Moniker</label>
                     <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-premium" placeholder="Ex: PK Urban Ritz" />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Strategic Area</label>
                     <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-premium" placeholder="Ex: Downtown Plaza" />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Metropolitan City</label>
                     <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input-premium" placeholder="Ex: London" />
                  </div>
                  <div className="space-y-2 group">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1 group-focus-within:text-primary transition-colors">Verified Registry Address</label>
                     <input required type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-premium" placeholder="Full street address" />
                  </div>
               </div>

               <div className="space-y-2 group">
                  <div className="flex justify-between items-center ml-1">
                     <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest group-focus-within:text-primary transition-colors">Property Narrative</label>
                     <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Min 50 chars</span>
                  </div>
                  <textarea required rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-premium py-6 min-h-[160px]" placeholder="Explain the heritage and unique atmosphere of this property..."></textarea>
               </div>
            </div>

            {/* Section 2: Amenities */}
            <div className="space-y-10">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary-dark text-white flex items-center justify-center font-black text-xs">02</div>
                  <h3 className="text-xl font-bold text-secondary-dark font-serif uppercase tracking-wider">Features & Amenities</h3>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {AMENITIES_LIST.map((item) => (
                    <button 
                      key={item.id}
                      type="button"
                      onClick={() => toggleAmenity(item.name)}
                      className={`p-5 rounded-3xl border transition-all text-left flex flex-col gap-4 group relative overflow-hidden ${form.amenities.includes(item.name) ? 'border-primary bg-primary/5 shadow-premium' : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200'}`}
                    >
                       <span className="text-3xl group-hover:scale-110 transition-transform inline-block">{item.icon}</span>
                       <span className={`text-[10px] font-black uppercase tracking-wider leading-tight ${form.amenities.includes(item.name) ? 'text-secondary-dark' : 'text-gray-400'}`}>{item.name}</span>
                       {form.amenities.includes(item.name) && (
                         <div className="absolute top-3 right-3 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                            <Check size={14} strokeWidth={4} />
                         </div>
                       )}
                    </button>
                  ))}
               </div>
            </div>

            {/* Section 3: Visual Identity */}
            <div className="space-y-10">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary-dark text-white flex items-center justify-center font-black text-xs">03</div>
                  <h3 className="text-xl font-bold text-secondary-dark font-serif uppercase tracking-wider">Visual Heritage (Gallery)</h3>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {form.images.map((img, i) => (
                    <div key={i} className="group relative aspect-square rounded-[2rem] overflow-hidden border-4 border-white shadow-premium">
                       <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Preview" />
                       <button 
                         type="button" 
                         onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx !== i)})} 
                         className="absolute top-4 right-4 w-9 h-9 bg-black/60 backdrop-blur-md rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-rose-500 shadow-lg"
                       >
                          <X size={16} />
                       </button>
                    </div>
                  ))}
                  <label className="aspect-square border-4 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-gray-300 cursor-pointer hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all group shadow-sm hover:shadow-premium">
                     <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <Camera size={28} />
                     </div>
                     <span className="text-[10px] font-black uppercase tracking-widest">Add Legacy Photo</span>
                     <input type="file" multiple hidden onChange={handleImageUpload} />
                  </label>
               </div>
            </div>

            {/* Submit Block */}
            <div className="pt-16 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="flex items-center gap-3 text-gray-400">
                  <Info size={20} className="text-primary" />
                  <p className="text-sm font-medium">Verified properties receive priority indexing.</p>
               </div>
               
               <button 
                 type="submit" 
                 disabled={submitting} 
                 className="w-full md:w-[320px] h-16 bg-secondary-dark text-white font-bold rounded-2xl shadow-xl shadow-secondary-dark/20 hover:shadow-secondary-dark/40 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs group relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                 {submitting ? (
                   <Loader2 className="animate-spin" size={20} />
                 ) : (
                   <>
                      Submit for Global Audit <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-primary" />
                   </>
                 )}
               </button>
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-5px); } 40%, 80% { transform: translateX(5px); } }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
};

export default AddHotel;
