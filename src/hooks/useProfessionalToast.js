import { toast } from 'react-hot-toast';
import ProfessionalToast from '../components/ui/ProfessionalToast';

export const useProfessionalToast = () => {
  const showSuccess = (message, options = {}) => {
    return toast.custom((t) => (
      <ProfessionalToast message={message} type="success" visible={t.visible} duration={options.duration || 4000} />
    ), { duration: options.duration || 4000, position: options.position || 'top-right', ...options });
  };

  const showError = (message, options = {}) => {
    return toast.custom((t) => (
      <ProfessionalToast message={message} type="error" visible={t.visible} duration={options.duration || 5000} />
    ), { duration: options.duration || 5000, position: options.position || 'top-right', ...options });
  };

  const showWarning = (message, options = {}) => {
    return toast.custom((t) => (
      <ProfessionalToast message={message} type="warning" visible={t.visible} duration={options.duration || 4000} />
    ), { duration: options.duration || 4000, position: options.position || 'top-right', ...options });
  };

  const showInfo = (message, options = {}) => {
    return toast.custom((t) => (
      <ProfessionalToast message={message} type="info" visible={t.visible} duration={options.duration || 4000} />
    ), { duration: options.duration || 4000, position: options.position || 'top-right', ...options });
  };

  const showLoading = (message, options = {}) => {
    return toast.custom((t) => (
      <ProfessionalToast message={message} type="info" visible={t.visible} duration={options.duration || 4000} />
    ), { duration: options.duration || 4000, position: options.position || 'top-right', ...options });
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