import axios from 'axios';

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const logoutUser = () => api.post('/auth/logout');
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);

// ─── Hotels ───────────────────────────────────────────────────────────────────

export const fetchHotels          = (params)        => api.get('/hotels', { params });
export const fetchHotelById       = (id)            => api.get(`/hotels/${id}`);
export const fetchSuggestions     = (query)         => api.get(`/hotels/suggestions?query=${query}`);
export const fetchAllHotelsAdmin  = ()              => api.get('/hotels/admin/all');
export const createHotel          = (data)          => api.post('/hotels', data);
export const approveHotel         = (id, isApproved)=> api.put(`/hotels/${id}/approve`, { isApproved });
export const updateHotel          = (id, data)      => api.put(`/hotels/${id}`, data);
export const deleteHotel          = (id)            => api.delete(`/hotels/${id}`);

// ─── Rooms ────────────────────────────────────────────────────────────────────

export const fetchRooms  = (hotelId) => api.get(`/rooms/hotel/${hotelId}`);
export const createRoom  = (data)    => api.post('/rooms', data);
export const updateRoom  = (id, data)=> api.put(`/rooms/${id}`, data);
export const deleteRoom  = (id)      => api.delete(`/rooms/${id}`);

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const createBooking     = (data)          => api.post('/bookings', data);
export const fetchUserBookings = ()              => api.get('/bookings/user');
export const modifyBooking     = (id, data)      => api.put(`/bookings/${id}`, data);
export const cancelBooking     = (id)            => api.delete(`/bookings/${id}`);
export const fetchAllBookings      = ()           => api.get('/bookings');
export const updateBookingStatus   = (id, data) => api.put(`/bookings/${id}/status`, typeof data === 'string' ? { status: data } : data);

// ─── Payments ─────────────────────────────────────────────────────────────────

export const createRazorpayOrder = (bookingId) => api.post('/payments/create-order', { bookingId });
export const verifyRazorpayPayment = (paymentData) => api.post('/payments/verify', paymentData);
export const createStripeIntent = (bookingId) => api.post('/payments/create-stripe-intent', { bookingId });
export const verifyStripePayment = (paymentData) => api.post('/payments/verify-stripe', paymentData);

// ─── Manager ──────────────────────────────────────────────────────────────────

export const fetchManagerStats = () => api.get('/manager/stats');
export const fetchManagerAnalytics = () => api.get('/manager/analytics');
export const fetchManagerHotels = () => api.get('/manager/hotels');
export const createManagerHotel = (data) => api.post('/manager/hotels', data);
export const updateManagerHotel = (id, data) => api.put(`/manager/hotels/${id}`, data);
export const deleteManagerHotel = (id) => api.delete(`/manager/hotels/${id}`);
export const fetchManagerRooms = () => api.get('/manager/rooms');
export const createManagerRoom = (data) => api.post('/manager/rooms', data);
export const updateManagerRoom = (id, data) => api.put(`/manager/rooms/${id}`, data);
export const deleteManagerRoom = (id) => api.delete(`/manager/rooms/${id}`);
export const fetchManagerBookings = () => api.get('/manager/bookings');
export const updateManagerBookingStatus = (id, status) => api.put(`/manager/bookings/${id}/status`, { status });
export const fetchManagerReviews = () => api.get('/manager/reviews');

// ─── Admin ────────────────────────────────────────────────────────────────────

export const fetchAdminStats = () => api.get('/admin/stats');
export const fetchAdminUsers = () => api.get('/admin/users');
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
export const toggleBlockUser = (id) => api.put(`/admin/users/block/${id}`);
export const updateAdminUserRole = (id, role) => api.put(`/admin/users/role/${id}`, { role });
export const fetchAdminHotels = () => api.get('/admin/hotels');
export const updateAdminHotelStatus = (id, status) => api.put(`/admin/hotels/status/${id}`, { status });
export const deleteAdminHotel = (id) => api.delete(`/admin/hotels/${id}`);
export const fetchAdminBookings = () => api.get('/admin/bookings');
export const cancelAdminBooking = (id) => api.put(`/admin/bookings/cancel/${id}`);
export const fetchAdminPayments = () => api.get('/admin/payments');
export const fetchAdminReviews = () => api.get('/admin/reviews');
export const deleteAdminReview = (id) => api.delete(`/admin/reviews/${id}`);
export const sendAdminPromotion = (data) => api.post('/admin/send-promotion', data);

// ─── Reviews ───────────────────────────────────────────────────────────────────
export const addReview = (data) => api.post('/reviews', data);
export const fetchHotelReviews = (hotelId) => api.get(`/reviews/${hotelId}`);
export const fetchReviewByBookingId = (bookingId) => api.get(`/reviews/booking/${bookingId}`);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const replyToReview = (id, reply) => api.post(`/reviews/reply/${id}`, { reply });

// ─── Upload ───────────────────────────────────────────────────────────────────

export const uploadImage = (formData) =>
  api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// ─── Notifications ────────────────────────────────────────────────────────────
export const fetchNotifications = () => api.get('/notifications');
export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);

export default api;
