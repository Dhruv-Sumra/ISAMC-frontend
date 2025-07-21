import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import '../../styles/toast.css';

const ICONS = {
  success: <CheckCircle size={20} className="toast-icon success" />,
  error: <XCircle size={20} className="toast-icon error" />,
  warning: <AlertCircle size={20} className="toast-icon warning" />,
  info: <Info size={20} className="toast-icon info" />,
};

const TITLES = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
};

const ProfessionalToast = ({ message, type = 'info', visible, duration = 4000 }) => {
  return (
    <div
      className={`professional-toast ${type}`}
      style={{
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        gap: '12px',
        position: 'relative',
        minWidth: 300,
        maxWidth: 400,
        margin: '12px',
        zIndex: 9999,
        animation: visible ? 'slideInRight 0.4s cubic-bezier(0.4,0,0.2,1)' : 'slideOutRight 0.3s',
      }}
    >
      {ICONS[type]}
      <div className="toast-content">
        <div className="toast-title">{TITLES[type]}</div>
        <div className="toast-message">{message}</div>
      </div>
      {/* Progress bar */}
      <div
        className="toast-progress"
        style={{
          width: visible ? '100%' : 0,
          animation: visible ? `progress ${duration}ms linear` : 'none',
          background: 'rgba(0,0,0,0.08)',
        }}
      />
    </div>
  );
};

export default ProfessionalToast; 