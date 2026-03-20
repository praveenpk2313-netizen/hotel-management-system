import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Info, CreditCard, XCircle, Calendar } from 'lucide-react';
import { useSelector } from 'react-redux';

const RealTimeToast = () => {
  const [activeToast, setActiveToast] = useState(null);
  const { notifications } = useSelector(state => state.notifications);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      
      // Only show toast if it was created in the last 10 seconds (real-time only)
      const diffSinceCreated = Date.now() - new Date(latest.createdAt).getTime();
      
      if (diffSinceCreated < 10000 && !latest.isRead) {
        setActiveToast(latest);
        const timer = setTimeout(() => {
          setActiveToast(null);
        }, 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [notifications]);

  if (!activeToast) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return <Calendar size={20} color="#0ea5e9" />;
      case 'payment': return <CreditCard size={20} color="#10b981" />;
      case 'cancellation': return <XCircle size={20} color="#ef4444" />;
      default: return <Bell size={20} color="var(--primary)" />;
    }
  };

  return (
    <div className="toast-container">
      <div className="toast-content" onClick={() => setActiveToast(null)}>
        <div className="toast-icon">
          {getIcon(activeToast.type)}
        </div>
        <div className="toast-body">
          <h4 className="toast-title">{activeToast.title}</h4>
          <p className="toast-message">{activeToast.message}</p>
        </div>
        <button className="toast-close">
          <X size={16} />
        </button>
      </div>

      <style>{`
        .toast-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 9999;
          animation: slide-up 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
        }
        .toast-content {
          background: white;
          padding: 1rem 1.25rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
          border: 1px solid #f1f5f9;
          min-width: 320px;
          max-width: 420px;
          cursor: pointer;
          position: relative;
        }
        .toast-icon {
          width: 40px;
          height: 40px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .toast-body {
          flex: 1;
        }
        .toast-title {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.2rem;
        }
        .toast-message {
          margin: 0;
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .toast-close {
          background: none;
          border: none;
          color: #94a3b8;
          padding: 4px;
          cursor: pointer;
        }
        @keyframes slide-up {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default RealTimeToast;
