import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';

const AuthDebug = () => {
  const [authInfo, setAuthInfo] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    const isValid = adminService.hasValidToken();
    
    let tokenPayload = null;
    if (token) {
      try {
        tokenPayload = JSON.parse(atob(token.split('.')[1]));
      } catch (error) {
        tokenPayload = { error: 'Invalid token format' };
      }
    }

    setAuthInfo({
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      isValid,
      tokenPayload,
      timestamp: new Date().toISOString()
    });
  };

  const handleRefreshToken = async () => {
    setIsRefreshing(true);
    try {
      const success = await adminService.refreshToken();
      console.log('Refresh result:', success);
      checkAuth();
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const testApiCall = async () => {
    try {
      const result = await adminService.getDashboard();
      console.log('API call result:', result);
      alert('API call successful!');
    } catch (error) {
      console.error('API call error:', error);
      alert(`API call failed: ${error.message}`);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border">
      <h3 className="text-lg font-bold mb-4">Authentication Debug</h3>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={checkAuth}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Check Auth Status
          </button>
          
          <button
            onClick={handleRefreshToken}
            disabled={isRefreshing}
            className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Token'}
          </button>
          
          <button
            onClick={testApiCall}
            className="ml-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Test API Call
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-4 rounded border">
          <h4 className="font-semibold mb-2">Auth Information:</h4>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(authInfo, null, 2)}
          </pre>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p><strong>Has Token:</strong> {authInfo.hasToken ? 'Yes' : 'No'}</p>
          <p><strong>Token Valid:</strong> {authInfo.isValid ? 'Yes' : 'No'}</p>
          {authInfo.tokenPayload && (
            <>
              <p><strong>Token Expires:</strong> {authInfo.tokenPayload.exp ? new Date(authInfo.tokenPayload.exp * 1000).toLocaleString() : 'N/A'}</p>
              <p><strong>User ID:</strong> {authInfo.tokenPayload.id || 'N/A'}</p>
              <p><strong>User Role:</strong> {authInfo.tokenPayload.role || 'N/A'}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;
