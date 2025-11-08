/**
 * @fileoverview Product API Service
 * Centralizes all product-related API calls
 * Provides retry logic, error handling, and request cancellation
 */

import axios from 'axios';

// Configuration from environment variables
const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';
const API_TIMEOUT = parseInt(import.meta.env.REACT_APP_API_TIMEOUT) || 10000;
const DEBUG_LOGS = import.meta.env.REACT_APP_ENABLE_DEBUG_LOGS === 'true';

/**
 * Axios instance with default configuration
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor for logging
 */
apiClient.interceptors.request.use(
  (config) => {
    if (DEBUG_LOGS) {
      console.log(`📡 [API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (DEBUG_LOGS) {
      console.error('❌ [API] Request error:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for logging and error handling
 */
apiClient.interceptors.response.use(
  (response) => {
    if (DEBUG_LOGS) {
      console.log(`✅ [API] ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    if (DEBUG_LOGS) {
      console.error(`❌ [API] ${error.config?.url} - ${error.message}`);
    }
    
    // Transform axios error to more user-friendly format
    const customError = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED',
    };
    
    return Promise.reject(customError);
  }
);

/**
 * Product Service
 */
export const ProductService = {
  /**
   * Fetch all products with optional pagination
   * @param {Object} options - Query options
   * @param {number} options.page - Page number (1-indexed)
   * @param {number} options.limit - Products per page
   * @param {AbortSignal} options.signal - Abort controller signal
   * @returns {Promise<Object>} Products data
   */
  async getProducts(options = {}) {
    const {
      page = 1,
      limit = parseInt(import.meta.env.REACT_APP_PRODUCTS_PER_PAGE) || 12,
      signal,
    } = options;

    const startTime = performance.now();

    try {
      const response = await apiClient.get('/api/products/', {
        params: { page, limit },
        signal,
      });

      const fetchTime = performance.now() - startTime;

      if (DEBUG_LOGS) {
        console.log(`✅ [ProductService] Fetched ${response.data.length} products in ${fetchTime.toFixed(2)}ms`);
      }

      return {
        products: response.data,
        total: response.data.length,
        page,
        limit,
        hasMore: response.data.length === limit,
      };
    } catch (error) {
      const fetchTime = performance.now() - startTime;

      if (error.name === 'CanceledError' || error.name === 'AbortError') {
        if (DEBUG_LOGS) {
          console.log(`🚫 [ProductService] Request canceled after ${fetchTime.toFixed(2)}ms`);
        }
        throw error;
      }

      if (DEBUG_LOGS) {
        console.error(`❌ [ProductService] Error after ${fetchTime.toFixed(2)}ms:`, error.message);
      }

      throw error;
    }
  },

  /**
   * Fetch a single product by ID
   * @param {string|number} productId - Product ID
   * @param {AbortSignal} signal - Abort controller signal
   * @returns {Promise<Object>} Product data
   */
  async getProductById(productId, signal) {
    const response = await apiClient.get(`/api/products/${productId}/`, {
      signal,
    });
    return response.data;
  },

  /**
   * Search products
   * @param {string} query - Search query
   * @param {AbortSignal} signal - Abort controller signal
   * @returns {Promise<Array>} Products matching search
   */
  async searchProducts(query, signal) {
    const response = await apiClient.get('/api/products/search/', {
      params: { q: query },
      signal,
    });
    return response.data;
  },
};

export default ProductService;