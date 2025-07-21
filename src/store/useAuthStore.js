import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api.js";
import toast from "react-hot-toast";
import axios from "axios";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      hasHydrated: false,
      serverStartTime: null,
      isRefreshing: false,
      setHasHydrated: () => set({ hasHydrated: true }),

      setAccessToken: (token) => {
        set({ accessToken: token, isAuthenticated: !!token });
      },

      setUser: (userData) => {
        set({ user: userData, isAuthenticated: !!userData });
      },
      
      // Check if server has restarted and clear auth if needed
      checkServerRestart: async () => {
        try {
          // Use fetch instead of api to avoid interceptors
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
          const response = await fetch(`${apiUrl}/api/auth/server-time`, {
            method: 'GET',
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          
          const data = await response.json();
          const serverTime = data.serverStartTime;
          const currentServerTime = get().serverStartTime;
          
          // If server time is different or doesn't exist, server has restarted
          if (!currentServerTime || currentServerTime !== serverTime) {
            // Clear authentication state
            set({ 
              user: null, 
              accessToken: null, 
              isAuthenticated: false,
              serverStartTime: serverTime 
            });
            return true; // Server restarted
          }
          return false; // Server didn't restart
        } catch (error) {
          console.warn('Could not check server restart status:', error.message);
          // Only clear auth if we have a token but server is unreachable
          const currentToken = get().accessToken;
          if (currentToken) {
            set({ 
              user: null, 
              accessToken: null, 
              isAuthenticated: false,
              serverStartTime: null 
            });
            return true;
          }
          return false; // Don't clear auth if no token exists
        }
      },

      login: async (formdata) => {
        const { email, password } = formdata;
        try {
          set({ loading: true, error: null });
          const response = await api.post("/auth/login", { email, password });
          const { user, accessToken, message, serverStartTime } = response.data;
          if (response.data.success) {
            // Merge with lastProfile from localStorage for missing fields
            let mergedUser = { ...user };
            try {
              const lastProfile = JSON.parse(localStorage.getItem('lastProfile'));
              if (lastProfile && typeof lastProfile === 'object') {
                mergedUser = { ...lastProfile, ...mergedUser };
              }
            } catch (e) { /* ignore */ }

            // Fetch full profile if fields are missing
            const requiredFields = ['contact', 'designation', 'institute', 'gender'];
            const missingFields = requiredFields.filter(f => !mergedUser[f]);
            if (missingFields.length > 0) {
              try {
                const profileResp = await api.get('/user/profile');
                mergedUser = { ...mergedUser, ...profileResp.data.user };
              } catch (e) { /* ignore */ }
            }

            set({
              user: {
                ...mergedUser,
                name: mergedUser.name || mergedUser.fullName || mergedUser.username || '',
                email: mergedUser.email || '',
                contact: mergedUser.contact || mergedUser.phone || '',
                bio: mergedUser.bio || '',
                institute: mergedUser.institute || '',
                designation: mergedUser.designation || '',
                gender: mergedUser.gender || '',
                expertise: mergedUser.expertise || '',
                dateOfBirth: mergedUser.dateOfBirth || mergedUser.dob || '',
                linkedinUrl: mergedUser.linkedinUrl || mergedUser.linkedinProfile || '',
                isVerified: mergedUser.isVerified || false
              },
              accessToken,
              isAuthenticated: true,
              loading: false,
              error: null,
              serverStartTime: serverStartTime || Date.now(),
            });

            toast.success(message || "Login successful");
            return { success: true };
          }
          // Handle unverified account
          if (message === "Account not verified. Please register again.") {
            window.location.href = "/register";
            toast.error("Registration failed. Please register again.");
            return { success: false };
          }
          return { success: false };
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Login failed";
          set({
            error: errorMessage,
            loading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
          });
        }
      },

      updateProfile: async (profileData) => {
        try {
          const token = get().accessToken;
          console.log('Current token:', token ? 'Token exists' : 'No token');
          console.log('Sending profile update:', profileData);
          
          const response = await api.put('/user/profile', profileData);
          console.log('Update response:', response.data);
          
          if (response.data.success) {
            set({ user: response.data.user });
            toast.success(response.data.message || 'Profile updated successfully');
          }
          return response.data;
        } catch (error) {
          console.error('Profile update error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
          });
          
          if (error.response?.status === 403) {
            console.log('Attempting token refresh...');
            const refreshResult = await get().refreshAccessToken();
            if (refreshResult.success) {
              console.log('Token refreshed, retrying...');
              return await get().updateProfile(profileData);
            }
          }
          
          const errorMessage = error.response?.data?.message || error.message || "Profile update failed";
          toast.error(errorMessage);
          throw errorMessage;
        }
      },

  
      updatePassword: async (currentPassword, newPassword) => {
        console.log('updatePassword function called'); 
        try {
          const response = await api.put('/user/password', {
            currentPassword,
            newPassword
          });
          
          if (response.data.success) {
            console.log('Showing success toast'); 
            toast.dismiss('password-update-success');
            
            toast.success(response.data.message || 'Password updated successfully', {
              id: 'password-update-success',
              duration: 3000,
            });
          }
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Password update failed";
          
          toast.dismiss('password-update-error');
          toast.error(errorMessage, {
            id: 'password-update-error',
            duration: 3000,
          });
          throw errorMessage;
        }
      },
      register: async (formData) => {
        try {
          set({ loading: true, error: null });
          const response = await api.post("/auth/register", formData);
          const { success, message, regToken } = response.data;
          if (success && regToken) {
            // Store regToken in state for OTP verification
            set({ loading: false, error: null });
            return { success: true, regToken, message };
          }
          set({ loading: false, error: message || "Registration failed" });
          return { success: false, error: message || "Registration failed" };
        } catch (error) {
          const errorMessage = error.response?.data?.message || "Registration failed";
          set({ loading: false, error: errorMessage });
          return { success: false, error: errorMessage };
        }
      },
      logout: async () => {
        try {
          // Set a flag to indicate user-initiated logout
          window.__isManualLogout = true;
          await api.post("/auth/logout");
          set({ user: null, accessToken: null, isAuthenticated: false });
          if (get().user) {
            localStorage.setItem('lastProfile', JSON.stringify(get().user));
          }
        } catch (error) {
          console.error("Logout failed:", error);
          set({
            error: error.response?.data?.message || "Logout failed",
            loading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
          });
        } finally {
          // Clear the flag after a short delay
          setTimeout(() => { window.__isManualLogout = false; }, 1000);
        }
      },
      refreshAccessToken: async () => {
        // Prevent cascading refresh calls
        const state = get();
        if (state.isRefreshing) {
          return { success: false, message: 'Already refreshing' };
        }
        
        try {
          set({ isRefreshing: true });
          const response = await api.get("/auth/refresh");
          const { accessToken, user, serverStartTime } = response.data;

          set({
            accessToken,
            user: {
              ...user,
              contact: user.contact || "",
              bio: user.bio || "",
              isVerified: user.isVerified || false
            },
            isAuthenticated: true,
            loading: false,
            error: null,
            serverStartTime: serverStartTime || Date.now(),
            isRefreshing: false,
          });

          return { success: true };
        } catch (error) {
          // If 401 Unauthorized, force logout and redirect
          if (error.response && error.response.status === 401) {
            set({
              accessToken: null,
              user: null,
              isAuthenticated: false,
              loading: false,
              error: null,
              isRefreshing: false,
            });
            // Only show toast/redirect if not a manual logout
            if (!window.__isManualLogout) {
              toast.error('Session expired. Please log in again.');
              window.location.href = '/login';
            }
            return { success: false, message: 'Session expired' };
          }
          set({
            accessToken: null,
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            isRefreshing: false,
          });
          return { success: false };
        }
      },
      verifyEmail: async (otp) => {
        try {
          const userId = get().user._id;
          if (!userId) {
            toast.error("User not found. Please login again.");
            return { success: false, message: "User not found" };
          }
          
          const response = await api.post("/auth/verify-account", {
            userId,
            otp,
          });
          
          if (response.data.success) {
            set((state) => ({
              user: {
                ...state.user,
                isVerified: true
              }
            }));
            
            toast.success(response.data.message || "Email verified successfully");
            return { success: true };
          }
          
          return { success: false, message: response.data.message };
        } catch (error) {
          console.error("Verification failed:", error);
          const errorMessage = error.response?.data?.message || "Verification failed";
          toast.error(errorMessage);
          return { success: false, message: errorMessage };
        }
      },
      sendResetOtp: async (email) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/send-reset-password", {
            email,
          });
          if (response.data.success) {
            toast.success(
              response.data.message || "Reset OTP sent successfully"
            );
            set({ loading: false, error: null });
            return { success: true };
          }
          set({ loading: false, error: response.data.message });
          return { success: false, message: response.data.message };
        } catch (error) {
          console.error("Error sending reset OTP:", error);
          set({ loading: false, error: error.response?.data?.message });
          return { success: false, message: error.response?.data?.message };
        }
      },
      resetPassword: async (formdata) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post("/auth/reset-password", formdata);
          if (response.data.success) {
            toast.success(
              response.data.message || "Password reset successfully"
            );
            set({ loading: false, error: null });
            return { success: true, message: response.data.message };
          }
          set({ loading: false, error: response.data.message });
          return { success: false, message: response.data.message };
        } catch (error) {
          console.error("Error resetting password:", error);
          set({ loading: false, error: error.response?.data?.message });
          return { success: false, message: error.response?.data?.message };
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        serverStartTime: state.serverStartTime,
      }),
      onRehydrateStorage: () => (state) => {
        get().setHasHydrated();
      },
    }
  )
);
