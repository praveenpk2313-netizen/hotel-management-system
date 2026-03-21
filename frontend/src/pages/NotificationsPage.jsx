import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getNotifications, markRead, markAllRead } from '../redux/slices/notificationSlice';
import { 
  Bell, 
  Check, 
  Trash2, 
  Clock, 
  Info, 
  CreditCard, 
  XCircle, 
  Calendar,
  Filter,
  CheckCircle,
  MoreVertical
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { deleteNotification } from '../services/api';

const NotificationsPage = () => {
  const dispatch = useDispatch();
  const { notifications, loading, unreadCount } = useSelector(state => state.notifications);
  const [filter, setFilter] = useState('all');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);

  const handleMarkRead = (id) => {
    dispatch(markRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllRead());
    setSuccess('All notifications marked as read');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this notification?')) {
      try {
        await deleteNotification(id);
        dispatch(getNotifications());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.type === filter;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return <Calendar size={20} color="#0ea5e9" />;
      case 'payment': return <CreditCard size={20} color="#10b981" />;
      case 'cancellation': return <XCircle size={20} color="#ef4444" />;
      default: return <Info size={20} color="var(--primary)" />;
    }
  };

  return (
    <div className="animate-fade" style={{ background: '#f8fafc', minHeight: '100vh', padding: '4rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <h1 className="luxury-font" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Notifications</h1>
            <p style={{ color: '#64748b' }}>Stay updated with your latest booking activity and system alerts.</p>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="btn-outline" 
              style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Check size={18} /> Mark all as read
            </button>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          
          {/* Filters */}
          <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1.5rem', overflowX: 'auto' }}>
            {['all', 'unread', 'booking', 'payment', 'cancellation'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.5rem 0',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: filter === f ? 'var(--primary)' : '#94a3b8',
                  borderBottom: filter === f ? '2px solid var(--primary)' : '2px solid transparent',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  whiteSpace: 'nowrap'
                }}
              >
                {f}
              </button>
            ))}
          </div>

          {loading && notifications.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div className="skeleton" style={{ width: '100%', height: '80px', borderRadius: '12px', marginBottom: '1rem' }}></div>
              <div className="skeleton" style={{ width: '100%', height: '80px', borderRadius: '12px' }}></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
              <Bell size={48} color="#e2e8f0" style={{ marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', color: '#1e293b', marginBottom: '0.5rem' }}>No notifications found</h3>
              <p style={{ color: '#94a3b8' }}>You're all caught up! Come back later for updates.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredNotifications.map((n) => (
                <div 
                  key={n._id}
                  style={{ 
                    padding: '1.5rem 2rem', 
                    borderBottom: '1px solid #f1f5f9',
                    display: 'flex',
                    gap: '1.5rem',
                    background: n.isRead ? 'transparent' : 'rgba(197, 160, 89, 0.02)',
                    transition: '0.2s',
                    position: 'relative'
                  }}
                  className="notification-item"
                >
                  <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    borderRadius: '12px', 
                    background: '#f8fafc', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {getIcon(n.type)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '700', color: '#1e293b' }}>{n.title}</h4>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {!n.isRead && (
                          <button 
                            onClick={() => handleMarkRead(n._id)}
                            style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer', padding: '4px' }}
                            title="Mark as read"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(n._id)}
                          style={{ background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', padding: '4px' }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p style={{ margin: '0 0 0.75rem 0', color: '#64748b', lineHeight: '1.5' }}>{n.message}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
                        <Clock size={14} />
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </div>
                      {!n.isRead && (
                        <span style={{ height: '6px', width: '6px', borderRadius: '50%', background: 'var(--primary)' }}></span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .notification-item:hover {
          background: #f8fafc !important;
        }
        .btn-outline {
          background: white;
          border: 1.5px solid #e2e8f0;
          color: #475569;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-outline:hover {
          border-color: var(--primary);
          color: var(--primary);
        }
           .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export default NotificationsPage;
