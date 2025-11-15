import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AuthService from '../services/AuthService';
import AnalyticsService from '../services/AnalyticsService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);

          // Verify with server
          const result = await AuthService.getCurrentUser();
          if (result.success) {
            setUser(result.user);

            // Connect to analytics SSE
            AnalyticsService.connectToSSE();
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Register user
   */
  const register = useCallback(async (email, username, password, firstName, lastName) => {
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.register(
        email,
        username,
        password,
        firstName,
        lastName
      );

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);

        // Track registration
        AnalyticsService.trackEvent('user_registered', {
          email,
          username,
        });

        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login user
   */
  const login = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const result = await AuthService.login(email, password);

      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);

        // Connect to analytics
        AnalyticsService.connectToSSE();

        // Track login
        AnalyticsService.trackEvent('user_login', { email });

        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);

      await AuthService.logout();

      setUser(null);
      setIsAuthenticated(false);
      setError(null);

      // Disconnect analytics
      AnalyticsService.disconnectSSE();
      AnalyticsService.trackEvent('user_logout');

      // Flush any remaining events
      await new Promise(resolve => setTimeout(resolve, 100));
      AnalyticsService.flushEvents();

      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update profile
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);

      const result = await AuthService.updateProfile(profileData);

      if (result.success) {
        setUser(result.user);

        // Track update
        AnalyticsService.trackEvent('profile_updated', profileData);

        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    isAuthenticated,
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
