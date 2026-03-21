import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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

// ─── Role → dashboard mapping ────────────────────────────────────────────────

const ROLE_HOME = {
  admin:    '/admin/dashboard',
  manager:  '/manager/dashboard',
  customer: '/customer/dashboard',
};

const roleDashboard = (role) => ROLE_HOME[role] || '/';

// ─── Protected Route ─────────────────────────────────────────────────────────

/**
 * Renders children only when the user is authenticated and (optionally) has
 * one of the required roles.  Otherwise redirects to the appropriate page.
 *
 * Props:
 *   allowedRoles  – string[] of permitted roles; omit to allow any logged-in user
 *   redirectTo    – fallback redirect when unauthenticated (default: '/login')
 */
const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/login' }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Wait for localStorage rehydration before deciding
  if (loading) return null;

  // Not logged in → send to login, preserving the state (including bookingData!)
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location.pathname, ...location.state }} replace />;
  }

  // Wrong role → send to their own dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleDashboard(user.role)} replace />;
  }

  return children;
};

// ─── App ─────────────────────────────────────────────────────────────────────

function App() {
  const { user } = useAuth();
  useSocket();
  const location = useLocation();

  // Hide Navbar / Footer inside dashboard pages
  const isDashboard =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/manager') ||
    location.pathname.startsWith('/dashboard');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isDashboard && <Navbar />}

      <main style={{ flexGrow: 1 }}>
        <Routes>
          {/* ── Public ──────────────────────────────────────────────────────── */}
          <Route path="/" element={<Home />} />

          <Route
            path="/login"
            element={user ? <Navigate to={roleDashboard(user.role)} replace /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to={roleDashboard(user.role)} replace /> : <Register />}
          />

          {/* OAuth callback — handles popup messaging + redirect */}
          <Route path="/oauth/callback" element={<OAuthCallback />} />

          {/* Hotel browsing */}
          <Route path="/hotel/:id" element={<HotelDetails />} />
          <Route path="/hotels"    element={<HotelListPage />} />

          {/* ── Portals ────────────────────────────────────────────────────── */}
          
          {/* Manager Portal */}
          <Route path="/manager">
            <Route index element={user ? <Navigate to="dashboard" replace /> : <ManagerLoginPage />} />
            <Route path="login" element={user ? <Navigate to="dashboard" replace /> : <ManagerLoginPage />} />
            <Route path="register" element={user ? <Navigate to="dashboard" replace /> : <ManagerRegisterPage />} />
            
            <Route element={<ProtectedRoute allowedRoles={['manager', 'admin']} redirectTo="/manager/login"><ManagerLayout /></ProtectedRoute>}>
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
            <Route index element={user ? <Navigate to="dashboard" replace /> : <AdminLoginPage />} />
            <Route path="login" element={user ? <Navigate to="dashboard" replace /> : <AdminLoginPage />} />
            <Route path="register" element={user ? <Navigate to="dashboard" replace /> : <AdminRegisterPage />} />
            
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

          {/* ── Customer dashboard ──────────────────────────────────────────── */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
                <BookingHistory />
              </ProtectedRoute>
            }
          />

          {/* Generic /dashboard → role-based redirect */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navigate to={roleDashboard(user?.role)} replace />
              </ProtectedRoute>
            }
          />

          {/* Booking / Payment (Any logged-in user can book) */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking-history"
            element={
              <ProtectedRoute allowedRoles={['customer', 'manager', 'admin']}>
                <BookingHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
      <RealTimeToast />
    </div>
  );
}

export default App;
