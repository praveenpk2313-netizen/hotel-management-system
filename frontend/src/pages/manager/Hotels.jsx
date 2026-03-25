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
  ChevronDown,
  ArrowLeft,
  Users,
  Bed,
  Check,
  Star,
  ExternalLink,
  Info,
  Camera,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { formatCurrency } from '../../utils/helpers';

const HOTEL_AMENITIES = [
  { id: 'wifi', name: 'Free Wi-Fi', icon: '📶' },
  { id: 'front-desk', name: '24/7 Front Desk', icon: '🛎️' },
  { id: 'ac', name: 'Air Conditioning', icon: '❄️' },
  { id: 'room-service', name: 'Room Service', icon: '🍽️' },
  { id: 'housekeeping', name: 'Daily Housekeeping', icon: '🧹' },
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

const ROOM_CATEGORIES = [
  'Standard Room', 'Deluxe Room', 'Executive Suite', 'Presidential Suite', 'Family Suite', 'Studio Apartment', 'Penthouse'
];

const BED_TYPES = [
  'Single Bed', 'Twin Beds', 'Double Bed', 'Triple Beds', 'King-size Bed', 'Queen-size Bed', 'Bunk Beds'
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
    type: 'Deluxe Room', bedType: 'King-size Bed', price: '', capacity: 2, totalRooms: 1, amenities: [], images: []
  });

  const loadHotels = async () => {
    setLoading(true);
    try {
      const { data } = await fetchManagerHotels();
      setHotels(data);
    } catch (err) { setError('Failed to load hotels'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadHotels(); }, []);

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
        bedType: room.bedType || 'King-size Bed',
        price: room.price,
        capacity: room.capacity,
        totalRooms: room.totalRooms,
        amenities: Array.isArray(room.amenities) ? room.amenities : [],
        images: room.images || []
      });
    } else {
      setEditingRoom(null);
      setRoomForm({ type: 'Deluxe Room', bedType: 'King-size Bed', price: '', capacity: 2, totalRooms: 1, amenities: [], images: [] });
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
      if (roomData.images.length === 0) {
        // Add a default room image if none selected
        roomData.images = ["https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"];
      }

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
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Retrieving Portfolio...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {!selectedHotelForRooms ? (
        <>
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-serif text-secondary-dark font-black">Your Luxury Portfolio</h2>
              <p className="text-gray-400 font-medium">Manage and refine your property experiences.</p>
            </div>
            <button 
              onClick={() => navigate('/manager/add-hotel')} 
              className="px-8 py-4 bg-gradient-to-r from-secondary-light to-secondary-dark text-white font-bold rounded-2xl shadow-xl shadow-secondary/20 hover:shadow-secondary/30 transition-all flex items-center gap-3 active:scale-95 whitespace-nowrap"
            >
              <Plus size={20} /> Add New Property
            </button>
          </div>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div key={hotel._id} className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-premium transition-all duration-500 overflow-hidden flex flex-col">
                <div className="relative h-[250px] overflow-hidden">
                  <img 
                    src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200"} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                    alt={hotel.name} 
                  />
                  
                  <div className="absolute top-5 left-5 flex gap-2">
                    {!hotel.isApproved ? (
                       <div className="px-3 py-1.5 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Pending Review</div>
                    ) : (
                       <div className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Verified</div>
                    )}
                  </div>

                  <div className="absolute top-5 right-5 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => handleOpenModal(hotel)} 
                      className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-secondary hover:bg-white hover:text-primary shadow-lg transition-all"
                    >
                       <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(hotel._id)} 
                      className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white shadow-lg transition-all"
                    >
                       <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h3 className="text-2xl font-serif text-secondary-dark font-bold group-hover:text-primary transition-colors">{hotel.name}</h3>
                        <div className="flex items-center gap-1.5 text-gray-400 font-medium text-sm mt-1">
                           <MapPin size={14} className="text-primary" />
                           {hotel.city || 'Global Destination'}
                        </div>
                     </div>
                     <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-xs font-black text-amber-700">4.9</span>
                     </div>
                  </div>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-8 leading-relaxed italic">
                    {hotel.description || "A sanctuary of luxury and sophistication, offering unparalleled comfort."}
                  </p>

                  <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between gap-4">
                     <button 
                       onClick={() => { setSelectedHotelForRooms(hotel); loadRooms(hotel._id); }} 
                       className="flex-1 h-14 bg-gray-50 text-secondary-dark font-bold rounded-2xl hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 group/btn"
                     >
                       <Layers size={18} className="text-primary group-hover/btn:text-white" />
                       Manage Inventory
                     </button>
                  </div>
                </div>
              </div>
            ))}

            <button 
              onClick={() => navigate('/manager/add-hotel')}
              className="h-[550px] border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 group hover:border-primary/20 hover:bg-gray-50/50 transition-all"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                 <Plus size={40} className="group-hover:rotate-90 transition-transform duration-500" />
              </div>
              <div className="text-center">
                 <p className="font-serif text-xl text-gray-400 font-bold group-hover:text-secondary-dark transition-colors">List New Property</p>
                 <p className="text-sm text-gray-400 mt-1">Expansion awaits your portfolio.</p>
              </div>
            </button>
          </div>
        </>
      ) : (
        <div className="animate-fade-in space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
               <button 
                 onClick={() => setSelectedHotelForRooms(null)} 
                 className="flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:-translate-x-1 transition-transform"
               >
                 <ArrowLeft size={16} /> Portfolio Overview
               </button>
               <div>
                  <h2 className="text-3xl font-serif text-secondary-dark font-black tracking-tight flex items-center gap-3">
                     <Sparkles size={28} className="text-primary animate-pulse" />
                     {selectedHotelForRooms.name}
                  </h2>
                  <p className="text-gray-400 font-medium">Room Categories & Global Inventory Management</p>
               </div>
            </div>
            
            <button 
              onClick={() => handleOpenRoomModal()} 
              className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all flex items-center gap-3"
            >
              <Plus size={20} /> Create Room Category
            </button>
          </div>

          {loadingRooms ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
               <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
               <p className="text-xs font-black text-gray-400 tracking-widest uppercase">Syncing Inventory...</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="py-32 bg-gray-50/50 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 bg-white rounded-3xl shadow-sm flex items-center justify-center text-gray-300 mb-8">
                  <Layers size={48} />
               </div>
               <h3 className="text-2xl font-serif text-secondary-dark font-bold mb-3">No Room Categories Defined</h3>
               <p className="text-gray-400 max-w-sm mb-10 font-medium leading-relaxed">Establish your first room collection to start accepting world-class travelers.</p>
               <button onClick={() => handleOpenRoomModal()} className="btn-gold">Create First Category</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
              {rooms.map((room) => (
                <div key={room._id} className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-premium transition-all duration-500">
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={room.images?.[0] || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                      alt={room.type} 
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
                       <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-[2px] mb-1">{room.bedType || 'Luxury Tier'}</p>
                          <h4 className="text-lg font-bold text-white leading-none">{room.type}</h4>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Starts at</p>
                          <p className="text-xl font-black text-white">{formatCurrency(room.price)}<span className="text-[10px] text-gray-400">/nt</span></p>
                       </div>
                    </div>
                  </div>

                  <div className="p-7 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                             <Users size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max Load</p>
                             <p className="text-sm font-bold text-secondary-dark">{room.capacity} Guests</p>
                          </div>
                       </div>
                       <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-500">
                             <Bed size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available</p>
                             <p className="text-sm font-bold text-emerald-600">{room.totalRooms} Units</p>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[60px]">
                       {room.amenities?.slice(0, 4).map((a, i) => (
                         <span key={i} className="px-3 py-1.5 bg-gray-50 text-[10px] font-black text-gray-500 uppercase tracking-wider rounded-lg border border-gray-100 flex items-center gap-1.5">
                            <Check size={10} className="text-primary" /> {a}
                         </span>
                       ))}
                       {room.amenities?.length > 4 && (
                         <span className="px-3 py-1.5 bg-secondary-dark text-[10px] font-black text-white uppercase tracking-wider rounded-lg">+{room.amenities.length - 4} More</span>
                       )}
                    </div>

                    <div className="flex gap-3 pt-2">
                       <button 
                         onClick={() => handleOpenRoomModal(room)} 
                         className="flex-1 h-12 bg-white border border-gray-100 text-secondary font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
                       >
                          <Edit2 size={16} /> Edit Category
                       </button>
                       <button 
                         onClick={() => handleDeleteRoom(room._id)} 
                         className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all border border-rose-100 shadow-sm"
                       >
                          <Trash2 size={18} />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(showModal || showRoomModal) && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8 animate-fade-in">
           <div className="absolute inset-0 bg-secondary-dark/60 backdrop-blur-md" onClick={() => { setShowModal(false); setShowRoomModal(false); }} />
           
           <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-premium overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 md:px-12 md:py-8 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-primary">
                       {showModal ? <Layers size={24} /> : <BedDouble size={24} />}
                    </div>
                    <div>
                       <h3 className="text-2xl font-serif text-secondary-dark font-bold leading-none mb-1">
                          {showModal ? (editingHotel ? 'Refine Property' : 'New Property Registration') : (editingRoom ? 'Update Category' : 'Register Category')}
                       </h3>
                       <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">Global Standard Registration</p>
                    </div>
                 </div>
                 <button 
                   onClick={() => { setShowModal(false); setShowRoomModal(false); }} 
                   className="w-10 h-10 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-secondary hover:shadow-sm transition-all flex items-center justify-center"
                 >
                    <X size={20} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10 custom-scrollbar">
                 {showModal ? (
                    <form id="hotelForm" onSubmit={handleSubmit} className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Property Name</label>
                             <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-premium" placeholder="Ex: PK Urban Ritz" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Elite Location / Area</label>
                             <input required type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input-premium" placeholder="Ex: Downtown Plaza" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Metropolitan City</label>
                             <input required type="text" value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input-premium" placeholder="Ex: New York" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Registry Address</label>
                             <input required type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-premium" placeholder="Full street address" />
                          </div>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Property Narrative</label>
                          <textarea required rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-premium py-5 min-h-[120px]" placeholder="Explain the heritage and luxury of this property..."></textarea>
                       </div>

                       <div className="space-y-6">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                             <label className="text-xs font-black text-secondary-dark uppercase tracking-widest">Available Amenities</label>
                             <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{form.amenities.length} Selected</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                             {HOTEL_AMENITIES.map((item) => (
                               <button 
                                 key={item.id} 
                                 type="button"
                                 onClick={() => toggleHotelAmenity(item.name)} 
                                 className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-3 group relative overflow-hidden ${form.amenities.includes(item.name) ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50/50 hover:bg-white hover:border-gray-200'}`}
                               >
                                  <span className="text-2xl">{item.icon}</span>
                                  <span className={`text-[10px] font-black uppercase tracking-wider ${form.amenities.includes(item.name) ? 'text-secondary-dark' : 'text-gray-400'}`}>{item.name}</span>
                                  {form.amenities.includes(item.name) && (
                                    <div className="absolute top-2 right-2 flex items-center justify-center w-5 h-5 bg-primary text-white rounded-full">
                                       <Check size={12} strokeWidth={4} />
                                    </div>
                                  )}
                               </button>
                             ))}
                          </div>
                       </div>

                       <div className="space-y-6">
                          <label className="text-xs font-black text-secondary-dark uppercase tracking-widest block border-b border-gray-100 pb-4">Visual Gallery</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                             {form.images.map((img, i) => (
                               <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Preview" />
                                  <button type="button" onClick={() => setForm({...form, images: form.images.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-rose-500">
                                     <X size={14} />
                                  </button>
                               </div>
                             ))}
                             <label className="aspect-square border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-300 cursor-pointer hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all">
                                <Camera size={24} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Add Photo</span>
                                <input type="file" multiple hidden onChange={handleImageUpload} />
                             </label>
                          </div>
                       </div>
                    </form>
                 ) : (
                    <form id="roomForm" onSubmit={handleRoomSubmit} className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Category Tier</label>
                              <div className="relative group">
                                 <select value={roomForm.type} onChange={e => setRoomForm({...roomForm, type: e.target.value})} className="input-premium font-bold appearance-none cursor-pointer bg-white">
                                   {ROOM_CATEGORIES.map(t => <option key={t} value={t}>{t}</option>)}
                                 </select>
                                 <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary pointer-events-none transition-colors" size={20} />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Room Type</label>
                              <div className="relative group">
                                 <select value={roomForm.bedType} onChange={e => setRoomForm({...roomForm, bedType: e.target.value})} className="input-premium font-bold appearance-none cursor-pointer bg-white">
                                   {BED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                 </select>
                                 <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary pointer-events-none transition-colors" size={20} />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Nightly Price (USD)</label>
                              <div className="relative group">
                                 <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black opacity-60">$</div>
                                 <input required type="number" value={roomForm.price} onChange={e => setRoomForm({...roomForm, price: e.target.value})} className="input-premium pl-10 font-black text-lg h-14" placeholder="0.00" />
                              </div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Guest Capacity</label>
                              <div className="flex bg-gray-50/50 p-1 rounded-2xl border border-gray-100">
                                 {[1, 2, 3, 4, 5, 6].map(num => (
                                   <button 
                                     key={num} 
                                     type="button" 
                                     onClick={() => setRoomForm({...roomForm, capacity: num})} 
                                     className={`flex-1 h-10 rounded-xl text-xs font-black transition-all ${roomForm.capacity === num ? 'bg-secondary-dark text-white shadow-xl shadow-secondary-dark/20' : 'text-gray-400 hover:text-secondary-dark'}`}
                                   >
                                     {num}
                                   </button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black text-secondary-dark uppercase tracking-widest ml-1">Total Inventory</label>
                              <div className="relative group">
                                 <input required type="number" value={roomForm.totalRooms} onChange={e => setRoomForm({...roomForm, totalRooms: e.target.value})} className="input-premium font-black h-14" placeholder="Total units" />
                                 <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Units</div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                              <label className="text-xs font-black text-secondary-dark uppercase tracking-widest">Room Specific Amenities</label>
                              <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">{roomForm.amenities.length} selected</span>
                           </div>
                           <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                             {ROOM_AMENITIES.map((item) => (
                               <button 
                                 key={item.name} 
                                 type="button"
                                 onClick={() => {
                                   const isSelected = roomForm.amenities.includes(item.name);
                                   setRoomForm({
                                     ...roomForm,
                                     amenities: isSelected 
                                       ? roomForm.amenities.filter(a => a !== item.name)
                                       : [...roomForm.amenities, item.name]
                                   });
                                 }} 
                                 className={`h-11 px-4 rounded-xl border text-[10px] font-black transition-all flex items-center gap-2 relative overflow-hidden uppercase tracking-tighter ${roomForm.amenities.includes(item.name) ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-gray-50/50 text-gray-400 hover:bg-white hover:border-gray-200 hover:text-gray-600'}`}
                               >
                                  <span className="text-base">{item.icon}</span>
                                  <span className="truncate">{item.name}</span>
                               </button>
                             ))}
                           </div>
                        </div>

                        <div className="space-y-6">
                           <label className="text-xs font-black text-secondary-dark uppercase tracking-widest block border-b border-gray-100 pb-4">Room Category Gallery</label>
                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              {roomForm.images.map((img, i) => (
                                <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                                   <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Room Preview" />
                                   <button type="button" onClick={() => setRoomForm({...roomForm, images: roomForm.images.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-rose-500">
                                      <X size={14} />
                                   </button>
                                </div>
                              ))}
                              <label className="aspect-square border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-300 cursor-pointer hover:border-primary/30 hover:bg-primary/5 hover:text-primary transition-all">
                                 <Camera size={24} />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-center px-2">Attach Room Photo</span>
                                 <input type="file" multiple hidden onChange={handleRoomImageUpload} />
                              </label>
                           </div>
                        </div>
                     </form>
                 )}
              </div>

              <div className="p-10 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4">
                 <button 
                   type="button" 
                   onClick={() => { setShowModal(false); setShowRoomModal(false); }} 
                   className="flex-1 h-14 bg-white border border-gray-200 rounded-2xl text-gray-500 font-bold hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                 >
                    Cancel Transaction
                 </button>
                 <button 
                   type="submit" 
                   form={showModal ? "hotelForm" : "roomForm"} 
                   disabled={submitting} 
                   className="flex-[2] h-14 bg-secondary-dark text-white font-bold rounded-2xl shadow-xl shadow-secondary-dark/20 hover:shadow-secondary-dark/40 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs group"
                 >
                   {submitting ? (
                     <Loader2 className="animate-spin" size={20} />
                   ) : (
                     <>
                        {showModal ? (editingHotel ? 'Commit Changes' : 'Initialize Property') : (editingRoom ? 'Commit Category Update' : 'Initialize Category')}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform text-primary" />
                     </>
                   )}
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ManagerHotels;
