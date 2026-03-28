import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Clock, Info, CreditCard, XCircle, Calendar } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markRead, markAllRead } from '../redux/slices/notificationSlice';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading } = useSelector(state => state.notifications);

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
  };

  const handleMarkRead = (id, e) => {
    e.stopPropagation();
    dispatch(markRead(id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return <Calendar size={18} color="#0ea5e9" />;
      case 'payment': return <CreditCard size={18} color="#10b981" />;
      case 'cancellation': return <XCircle size={18} color="#ef4444" />;
      default: return <Info size={18} color="#C5A059" />;
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          position: 'relative',
          padding: '8px',
          borderRadius: '50%',
          transition: '0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
        onMouseLeave={e => e.currentTarget.style.background = 'none'}
      >
        <Bell size={22} color={isOpen ? '#C5A059' : '#64748b'} />
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', 
            top: '4px', 
            right: '4px', 
            background: '#ef4444', 
            color: 'white', 
            fontSize: '10px', 
            fontWeight: '800', 
            padding: '2px 5px', 
            borderRadius: '10px',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="animate-fade-in notification-dropdown" style={{ 
          position: 'fixed', 
          top: '70px', 
          right: '10px', 
          left: '10px',
          maxWidth: '400px',
          margin: '0 auto',
          background: 'white', 
          borderRadius: '24px', 
          boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 0 1px rgba(0,0,0,0.1)', 
          zIndex: 2000,
          overflow: 'hidden',
          border: '1px solid rgba(241, 245, 249, 0.8)',
          maxHeight: 'calc(100vh - 100px)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ padding: '1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdfcfb', flexShrink: 0 }}>
            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800', color: '#1e293b' }}>Intelligent Alerts</h4>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead} 
                style={{ background: 'none', border: 'none', color: '#C5A059', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Clear All
              </button>
            )}
          </div>

          <div style={{ maxHeight: '380px', overflowY: 'auto', flex: 1 }}>
            {loading && notifications.length === 0 ? (
               <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <Bell size={40} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n, i) => (
                <div 
                  key={n._id || i} 
                  style={{ 
                    padding: '1.25rem', 
                    borderBottom: '1px solid #f1f5f9', 
                    background: n.isRead ? 'transparent' : 'rgba(197, 160, 89, 0.03)',
                    cursor: 'pointer',
                    transition: '0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(197, 160, 89, 0.03)'}
                >
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ 
                      width: '36px', 
                      height: '36px', 
                      borderRadius: '10px', 
                      background: '#f8fafc', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {getIcon(n.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{n.title}</span>
                        {!n.isRead && (
                          <button 
                            onClick={(e) => handleMarkRead(n._id, e)}
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 0.5rem 0', lineHeight: '1.4' }}>{n.message}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#94a3b8' }}>
                        <Clock size={12} />
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <Link 
            to="/notifications" 
            onClick={() => setIsOpen(false)}
            style={{ 
              display: 'block', 
              textAlign: 'center', 
              padding: '1rem', 
              fontSize: '0.9rem', 
              fontWeight: '700', 
              color: '#C5A059', 
              textDecoration: 'none', 
              background: '#fdfcfb',
              borderTop: '1px solid #f1f5f9'
            }}
          >
            View all activity
          </Link>
        </div>
      )}

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (min-width: 1024px) {
          .notification-dropdown {
            position: absolute !important;
            top: 100% !important;
            right: 0 !important;
            left: auto !important;
            width: 380px !important;
            margin-top: 15px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
