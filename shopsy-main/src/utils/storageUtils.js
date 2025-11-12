/**
 * Storage Utilities for managing localStorage operations
 * with fallback for unsupported browsers
 */

export const storageUtils = {
  /**
   * Safe localStorage setItem with error handling
   */
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      return false;
    }
  },

  /**
   * Safe localStorage getItem with error handling
   */
  getItem: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * Safe localStorage removeItem with error handling
   */
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      return false;
    }
  },

  /**
   * Clear all application-related items
   */
  clearAuthData: () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('cartCount');
      return true;
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      return false;
    }
  }
};
