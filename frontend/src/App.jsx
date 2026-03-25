import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelDetails from './pages/HotelDetails';
import BookingHistory from './pages/BookingHistory';
import ManagerLoginPage from './pages/ManagerLoginPage';
import ManagerRegisterPage from './pages/ManagerRegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import OAuthCallback from './pages/OAuthCallback';
import PaymentPage from './pages/PaymentPage';
import HotelListPage from './pages/HotelListPage';
import ManagerLayout from './pages/manager/ManagerLayout';
import ManagerDashboardPage from './pages/manager/Dashboard';
import ManagerHotels from './pages/manager/Hotels';
import ManagerRooms from './pages/manager/Rooms';
import ManagerBookings from './pages/manager/Bookings';
import ManagerReviews from './pages/manager/Reviews';
import ManagerAnalytics from './pages/manager/Analytics';
import AddHotel from './pages/manager/AddHotel';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/Dashboard';
import UserManagement from './pages/admin/Users';
import HotelApproval from './pages/admin/Hotels';
import BookingMonitoring from './pages/admin/Bookings';
import PaymentManagement from './pages/admin/Payments';
import ReviewModeration from './pages/admin/Reviews';
import AdminPromotions from './pages/admin/Promotions';
import NotificationsPage from './pages/NotificationsPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import { useAuth } from './context/AuthContext';
import { useSocket } from './hooks/useSocket';
import RealTimeToast from './components/RealTimeToast';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BookingSuccess from './pages/BookingSuccess';
import api from './services/api';

const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/login' }) => {
  const { user, loading, isInitialized } = useAuth();
  const location = useLocation();

  if (loading || !isInitialized) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
       <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-[#c5a059]" />
          <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-400">Authenticating...</p>
       </div>
    </div>
  );

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Elevate admin permissions to include manager-level access
    if (user.role === 'admin' && allowedRoles.includes('manager')) {
      return children;
    }
    
    // Intelligent role-based redirection 
    const targetDashboard = 
       user.role === 'admin'   ? '/admin/dashboard' : 
       user.role === 'manager' ? '/manager/dashboard' : 
       '/customer/dashboard';

    return <Navigate to={targetDashboard} replace />;
  }

  return children;
};

function App() {
  const { user } = useAuth();
  useSocket();
  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/manager') ||
    location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-blue-100 selection:text-blue-900">
      {!isDashboard && <Navbar />}

      <main className="flex-grow pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/hotels" element={<HotelListPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Manager Portal */}
          <Route path="/manager">
            <Route index element={<ManagerLoginPage />} />
            <Route path="login" element={<ManagerLoginPage />} />
            <Route path="register" element={<ManagerRegisterPage />} />
            <Route element={<ProtectedRoute allowedRoles={['manager']} redirectTo="/manager/login"><ManagerLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<ManagerDashboardPage />} />
              <Route path="hotels" element={<ManagerHotels />} />
              <Route path="add-hotel" element={<AddHotel />} />
              <Route path="rooms" element={<ManagerRooms />} />
              <Route path="bookings" element={<ManagerBookings />} />
              <Route path="reviews" element={<ManagerReviews />} />
              <Route path="analytics" element={<ManagerAnalytics />} />
            </Route>
          </Route>

          {/* Admin Portal */}
          <Route path="/admin">
            <Route index element={<AdminLoginPage />} />
            <Route path="login" element={<AdminLoginPage />} />
            <Route path="register" element={<AdminRegisterPage />} />
            <Route element={<ProtectedRoute allowedRoles={['admin']} redirectTo="/admin/login"><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="hotels" element={<HotelApproval />} />
              <Route path="bookings" element={<BookingMonitoring />} />
              <Route path="payments" element={<PaymentManagement />} />
              <Route path="reviews" element={<ReviewModeration />} />
              <Route path="promotions" element={<AdminPromotions />} />
            </Route>
          </Route>

          <Route path="/customer/dashboard" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/booking-success" element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
          <Route path="/booking-history" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
      <RealTimeToast />
    </div>
  );
}

export default App;
