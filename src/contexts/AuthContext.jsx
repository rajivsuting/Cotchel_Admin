import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

// Create axios instance with default config
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://cotchel-server-tvye7.ondigitalocean.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Add response interceptor to handle token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            const response = await api.post("/api/auth/refresh-token");
            if (response.data.success) {
              // Retry the original request
              return api(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, show re-login prompt
            if (refreshError.response?.data?.reAuth) {
              toast.error("Your session has expired. Please log in again.");
              setAdmin(null);
              window.location.href = "/signin";
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      // Clean up the interceptor when the component unmounts
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  // Check authentication status using server middleware
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const response = await api.get("/api/auth/me");
        if (mounted && response.data.user) {
          setAdmin(response.data.user);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (mounted) {
          setAdmin(null);
        }
      } finally {
        if (mounted) {
          setInitialized(true);
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/auth/login", { email, password });

      if (response.data.user) {
        setAdmin(response.data.user);
        return { success: true };
      }
      return { success: false, error: "Login failed" };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
      setAdmin(null);
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error("Logout failed");
      console.error("Logout failed:", err);
    }
  };

  const value = {
    admin,
    loading,
    initialized,
    login,
    logout,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
