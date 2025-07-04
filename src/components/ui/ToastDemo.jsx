import React from 'react';
import { useProfessionalToast } from '../../hooks/useProfessionalToast';

const ToastDemo = () => {
  const { showSuccess, showError, showWarning, showInfo, showLoading, dismissAll } = useProfessionalToast();

  const handleSuccessToast = () => {
    showSuccess('Operation completed successfully!', {
      id: 'success-demo',
    });
  };

  const handleErrorToast = () => {
    showError('Something went wrong. Please try again.', {
      id: 'error-demo',
    });
  };

  const handleWarningToast = () => {
    showWarning('Please review your input before proceeding.', {
      id: 'warning-demo',
    });
  };

  const handleInfoToast = () => {
    showInfo('Here is some helpful information for you.', {
      id: 'info-demo',
    });
  };

  const handleLoadingToast = () => {
    const loadingId = showLoading('Processing your request...', {
      id: 'loading-demo',
    });
    
    // Simulate loading completion
    setTimeout(() => {
      showSuccess('Request completed successfully!', {
        id: loadingId,
      });
    }, 3000);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Professional Toast Demo</h2>
      
      <div className="space-y-3">
        <button
          onClick={handleSuccessToast}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Show Success Toast
        </button>
        
        <button
          onClick={handleErrorToast}
          className="w-full py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Show Error Toast
        </button>
        
        <button
          onClick={handleWarningToast}
          className="w-full py-2 px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
        >
          Show Warning Toast
        </button>
        
        <button
          onClick={handleInfoToast}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Show Info Toast
        </button>
        
        <button
          onClick={handleLoadingToast}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        >
          Show Loading Toast
        </button>
        
        <button
          onClick={dismissAll}
          className="w-full py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Dismiss All Toasts
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Features:</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Professional design with gradients and shadows</li>
          <li>• Smooth animations and transitions</li>
          <li>• Color-coded for different message types</li>
          <li>• Responsive design for mobile devices</li>
          <li>• Dark mode support</li>
          <li>• Hover effects and progress indicators</li>
        </ul>
      </div>
    </div>
  );
};

export default ToastDemo; 