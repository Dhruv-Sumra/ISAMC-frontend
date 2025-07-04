import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

const ProfessionalToast = ({ message, type = 'info', visible }) => {
  const getToastStyles = () => {
    const baseStyles = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      minWidth: '300px',
      maxWidth: '400px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid',
      transform: visible ? 'translateX(0)' : 'translateX(100%)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: visible ? 1 : 0,
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          background: '#f0fdf4',
          color: '#166534',
          borderColor: '#bbf7d0',
          borderLeft: '4px solid #22c55e',
        };
      case 'error':
        return {
          ...baseStyles,
          background: '#fef2f2',
          color: '#dc2626',
          borderColor: '#fecaca',
          borderLeft: '4px solid #ef4444',
        };
      case 'warning':
        return {
          ...baseStyles,
          background: '#fffbeb',
          color: '#92400e',
          borderColor: '#fed7aa',
          borderLeft: '4px solid #f59e0b',
        };
      default:
        return {
          ...baseStyles,
          background: '#f8fafc',
          color: '#475569',
          borderColor: '#e2e8f0',
          borderLeft: '4px solid #3b82f6',
        };
    }
  };

  const getIcon = () => {
    const iconSize = 20;
    switch (type) {
      case 'success':
        return <CheckCircle size={iconSize} className="text-green-600" />;
      case 'error':
        return <XCircle size={iconSize} className="text-red-600" />;
      case 'warning':
        return <AlertCircle size={iconSize} className="text-amber-600" />;
      default:
        return <Info size={iconSize} className="text-blue-600" />;
    }
  };

  return (
    <div style={getToastStyles()}>
      {getIcon()}
      <span style={{ flex: 1 }}>{message}</span>
    </div>
  );
};

export default ProfessionalToast; 