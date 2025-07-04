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
  
  // Check if current route is public
  const isPublicRoute = publicRoutes.includes(location.pathname);

  const checkAndRefreshToken = useCallback(async () => {
    try {
      // For protected routes only, attempt auth operations
      if (!isPublicRoute) {
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
            setInternalLoading(false);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Handle 401/403 errors gracefully
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Do nothing for public routes
      }
    } finally {
      setInternalLoading(false);
    }
  }, [accessToken, refreshAccessToken, isPublicRoute, checkServerRestart]);

  // Initial auth check when app loads
  useEffect(() => {
    if (isPublicRoute) {
      // For public routes, immediately stop loading
      setInternalLoading(false);
      return;
    }
    
    if (hasHydrated) {
      checkAndRefreshToken();
    } else {
      // If not hydrated, still set loading to false after a timeout
      const timeout = setTimeout(() => {
        setInternalLoading(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [hasHydrated, checkAndRefreshToken, isPublicRoute]);

  // Fallback if hydration never triggers
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasHydrated) {
        setHasHydrated();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [hasHydrated, setHasHydrated]);

  // Show spinner only during initial load for protected routes
  if (internalLoading && hasHydrated && !isPublicRoute) {
    return <Spinner />;
  }

  return children;
};

export default AuthProvider;