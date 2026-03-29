import React from 'react';
import { useProducts } from '../context/ProductContext';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import './Notification.css';

const Notification = () => {
  const { notifications } = useProducts();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id} className={`notification-item ${n.type} fade-in`}>
          <div className="notification-icon">
            {n.type === 'success' && <CheckCircle size={18} />}
            {n.type === 'warning' && <AlertTriangle size={18} />}
            {n.type === 'error' && <AlertCircle size={18} />}
            {n.type === 'info' && <Info size={18} />}
          </div>
          <div className="notification-content">
            <p className="notification-message">{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notification;
