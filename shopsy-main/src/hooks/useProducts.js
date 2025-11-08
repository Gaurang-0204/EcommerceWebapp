/**
 * @fileoverview Custom Hook for Products
 * Provides React Query integration for product fetching
 */

import { useQuery } from '@tanstack/react-query';
import { ProductService } from '../services/api/productService';

const DEBUG_LOGS = import.meta.env.REACT_APP_ENABLE_DEBUG_LOGS === 'true';

/**
 * Query keys for products
 */
export const productKeys = {
  all: ['products'],
  list: (options) => ['products', 'list', options],
  detail: (id) => ['products', 'detail', id],
  search: (query) => ['products', 'search', query],
};

/**
 * Hook to fetch products with caching
 * 
 * @param {Object} options - Query options
 * @param {number} options.page - Page number
 * @param {number} options.limit - Products per page
 * @param {boolean} options.enabled - Enable/disable query
 * @returns {Object} Query result
 */
export const useProducts = (options = {}) => {
  const { page = 1, limit, enabled = true } = options;

  return useQuery({
    queryKey: productKeys.list({ page, limit }),
    queryFn: async ({ signal }) => {
      const startTime = performance.now();

      try {
        const data = await ProductService.getProducts({
          page,
          limit,
          signal,
        });

        const fetchTime = performance.now() - startTime;

        if (DEBUG_LOGS) {
          console.log(`✅ [useProducts] Query successful in ${fetchTime.toFixed(2)}ms`);
          console.log(`📦 [useProducts] Fetched ${data.products.length} products`);
        }

        return data;
      } catch (error) {
        const fetchTime = performance.now() - startTime;

        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          if (DEBUG_LOGS) {
            console.error(`❌ [useProducts] Query failed after ${fetchTime.toFixed(2)}ms:`, error);
          }
        }

        throw error;
      }
    },
    enabled,
    // Additional React Query options can be passed here
  });
};

/**
 * Hook to fetch single product by ID
 * 
 * @param {string|number} productId - Product ID
 * @param {boolean} enabled - Enable/disable query
 * @returns {Object} Query result
 */
export const useProduct = (productId, enabled = true) => {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: ({ signal }) => ProductService.getProductById(productId, signal),
    enabled: enabled && !!productId,
  });
};

/**
 * Hook to search products
 * 
 * @param {string} searchQuery - Search query
 * @param {boolean} enabled - Enable/disable query
 * @returns {Object} Query result
 */
export const useProductSearch = (searchQuery, enabled = true) => {
  return useQuery({
    queryKey: productKeys.search(searchQuery),
    queryFn: ({ signal }) => ProductService.searchProducts(searchQuery, signal),
    enabled: enabled && !!searchQuery && searchQuery.length > 2,
  });
};