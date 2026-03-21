import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../redux/slices/notificationSlice';
import { getAdminStats } from '../redux/slices/adminSlice';
import { getManagerStats, getManagerAnalytics } from '../redux/slices/managerSlice';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const useSocket = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?._id) return;

    // Connect to socket.io
    const token = localStorage.getItem('token');
    const socketInstance = io(SOCKET_URL, {
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Real-time service established');
    });

    socketInstance.on('notification', (data) => {
      console.log('📬 Live Update:', data);
      dispatch(addNotification(data));
      
      // Auto-refresh manager stats if it's a booking update
      if ((data.type === 'booking' || data.type === 'payment') && user?.role === 'manager') {
        dispatch(getManagerStats());
        dispatch(getManagerAnalytics());
      }
      
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {}); // Quietly handle audio block
    });

    socketInstance.on('adminNotification', (data) => {
      console.log('🛡️ Admin Alert:', data);
      
      if (user?.role === 'admin') {
        // Refresh admin dashboard stats
        dispatch(getAdminStats());
      }
      
      // Add to notifications too
      dispatch(addNotification({
        ...data,
        createdAt: new Date().toISOString(),
        isRead: false
      }));

      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('⚠️ Real-time connection error:', err.message);
    });

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [user?._id, dispatch]);

  return null; // Don't expose socket directly to avoid misused global references
};
