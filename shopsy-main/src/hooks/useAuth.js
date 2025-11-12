import { useState, useEffect, useCallback } from 'react';
import { storageUtils } from '../utils/storageUtils';

/**
 * Custom hook for managing authentication state
 * Handles token validation, logout, and auth status
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Check authentication status on mount
   * Validates token and restores user session
   */
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = storageUtils.getItem('accessToken');
        const userData = storageUtils.getItem('user');

        if (token && token !== '' && token !== 'undefined') {
          // TODO: Phase 2 - Validate token with backend
          // const isValid = await validateToken(token);
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError(err.message);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  /**
   * Logout handler - clears auth data and updates state
   */
  const logout = useCallback(async () => {
    try {
      // TODO: Phase 2 - Call logout API endpoint
      // await logoutAPI();
      
      storageUtils.clearAuthData();
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  /**
   * Login handler - sets auth data
   */
  const login = useCallback((token, userData) => {
    try {
      storageUtils.setItem('accessToken', token);
      storageUtils.setItem('user', userData);
      setIsAuthenticated(true);
      setUser(userData);
      setError(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  }, []);

  return {
    isAuthenticated,
    user,
    loading,
    error,
    logout,
    login
  };
};
