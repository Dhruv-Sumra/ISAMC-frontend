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
          const response = await api.get("/auth/server-time");
          const serverTime = response.data.serverStartTime;
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
          // If we can't reach the server, assume it restarted
          set({ 
            user: null, 
            accessToken: null, 
            isAuthenticated: false,
            serverStartTime: null 
          });
          return true;
        }
      },

      login: async (formdata) => {
        const { email, password } = formdata;
        try {
          set({ loading: true, error: null });
          const response = await api.post("/auth/login", { email, password });
          const { user, accessToken, message, serverStartTime } = response.data;
          if (response.data.success) {
            set({
              user: {
                ...user,
                contact: user.contact || "",
                bio: user.bio || "",
                isVerified: user.isVerified || false
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
      register: async (formdata) => {
        const { name, email, password } = formdata;

        try {
          set({ loading: true, error: null });
          const response = await api.post("/auth/register", {
            name,
            email,
            password,
          });
          
          const { user, accessToken, message, serverStartTime } = response.data;
          if (response.data.success) {
            set({
              user: {
                ...user,
                contact: user.contact || "",
                bio: user.bio || "",
                isVerified: user.isVerified || false
              },
              accessToken,
              isAuthenticated: true,
              loading: false,
              error: null,
              serverStartTime: serverStartTime || Date.now(),
            });
            toast.success(message || "Register successful");
            return { success: true };
          }
          return { success: false };
        } catch (error) {
          console.error("Registration error:", error);
          
          // Handle specific error cases
          let errorMessage = "Registration failed";
          
          if (error.response?.status === 409) {
            errorMessage = "User already exists with this email address";
          } else if (error.response?.status === 400) {
            errorMessage = error.response?.data?.message || "Please check your input";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({
            error: errorMessage,
            loading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
          });
          
          // Show error toast
          toast.error(errorMessage);
          
          return { success: false, error: errorMessage };
        }
      },
      logout: async () => {
        try {
          await api.post("/auth/logout");
          set({ user: null, accessToken: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout failed:", error);
          set({
            error: error.response?.data?.message || "Logout failed",
            loading: false,
            isAuthenticated: false,
            user: null,
            accessToken: null,
          });
        }
      },
      refreshAccessToken: async () => {
        try {
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
          });

          return { success: true };
        } catch (error) {
          set({
            accessToken: null,
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
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
