// frontend/src/providers/AuthProvider.jsx
import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useLocation } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';

const AuthProvider = ({ children }) => {
  const location = useLocation();
  const {
    refreshAccessToken,
    hasHydrated,
    setHasHydrated,
    accessToken,
    checkServerRestart,
  } = useAuthStore();

  const [internalLoading, setInternalLoading] = useState(true);

  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/send-verify-otp', '/verify-email'];

  const checkAndRefreshToken = useCallback(async () => {
    try {
      // Skip auth check for public routes
      if (publicRoutes.includes(location.pathname)) {
        setInternalLoading(false);
        return;
      }

      // First check if server has restarted
      const serverRestarted = await checkServerRestart();
      if (serverRestarted) {
        // Server restarted, user needs to login again
        setInternalLoading(false);
        return;
      }

      // Only attempt refresh if we don't have an access token
      if (!accessToken) {
        const { success } = await refreshAccessToken();
        if (!success) {
          return;
        }
      }
    } catch (error) {
      // Handle 401/403 errors by redirecting to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        return;
      }
    } finally {
      setInternalLoading(false);
    }
  }, [accessToken, refreshAccessToken, location.pathname, checkServerRestart]);

  // Initial auth check when app loads
  useEffect(() => {
    if (hasHydrated) {
      checkAndRefreshToken();
    } else {
      // If not hydrated, still set loading to false after a timeout
      const timeout = setTimeout(() => {
        setInternalLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasHydrated, checkAndRefreshToken]);

  // Fallback if hydration never triggers
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasHydrated) {
        setHasHydrated();
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [hasHydrated, setHasHydrated]);

  // Show spinner only during initial load
  if (internalLoading && hasHydrated) {
    return <Spinner />;
  }

  return children;
};

export default AuthProvider;