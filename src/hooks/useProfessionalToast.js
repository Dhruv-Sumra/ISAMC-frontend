import { toast } from 'react-hot-toast';

export const useProfessionalToast = () => {
  const showSuccess = (message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#f0fdf4',
        color: '#166534',
        border: '1px solid #bbf7d0',
        borderLeft: '4px solid #22c55e',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '300px',
        maxWidth: '400px',
      },
      iconTheme: {
        primary: '#22c55e',
        secondary: '#f0fdf4',
      },
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    return toast.error(message, {
      duration: 5000,
      position: 'top-right',
      style: {
        background: '#fef2f2',
        color: '#dc2626',
        border: '1px solid #fecaca',
        borderLeft: '4px solid #ef4444',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '300px',
        maxWidth: '400px',
      },
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fef2f2',
      },
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#fffbeb',
        color: '#92400e',
        border: '1px solid #fed7aa',
        borderLeft: '4px solid #f59e0b',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '300px',
        maxWidth: '400px',
      },
      icon: '⚠️',
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      position: 'top-right',
      style: {
        background: '#f8fafc',
        color: '#475569',
        border: '1px solid #e2e8f0',
        borderLeft: '4px solid #3b82f6',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '300px',
        maxWidth: '400px',
      },
      icon: 'ℹ️',
      ...options,
    });
  };

  const showLoading = (message, options = {}) => {
    return toast.loading(message, {
      position: 'top-right',
      style: {
        background: '#f8fafc',
        color: '#475569',
        border: '1px solid #e2e8f0',
        borderLeft: '4px solid #3b82f6',
        borderRadius: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '500',
        minWidth: '300px',
        maxWidth: '400px',
      },
      ...options,
    });
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismiss,
    dismissAll,
  };
}; 