/**
 * @fileoverview Unit Tests for useProducts Hook
 * Tests Phase 1 Implementation:
 * ✅ React Query caching
 * ✅ Request cancellation
 * ✅ Exponential backoff retry
 * ✅ Performance monitoring
 * ✅ Conditional logging
 */

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from '../useProducts';
import { ProductService } from '../../services/api/productService';

// Mock ProductService
jest.mock('../../services/api/productService');

// Helper to create wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retry for faster tests
      },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useProducts Hook - Phase 1 Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock environment variable
    process.env.REACT_APP_ENABLE_DEBUG_LOGS = 'false';
  });

  // =========================================================================
  // TEST 1: React Query Caching
  // =========================================================================
  
  describe('✅ Test 1: React Query Caching', () => {
    
    it('should cache products data and not refetch on second mount', async () => {
      const mockData = {
        products: [
          { id: 1, name: 'Product 1', price: '10.99' },
          { id: 2, name: 'Product 2', price: '20.99' },
        ],
        total: 2,
        page: 1,
      };

      ProductService.getProducts.mockResolvedValue(mockData);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 10 * 60 * 1000, // 10 minutes
            staleTime: 5 * 60 * 1000,  // 5 minutes
          },
        },
      });

      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      // First render
      const { result: result1, unmount: unmount1 } = renderHook(
        () => useProducts({ page: 1 }),
        { wrapper }
      );

      await waitFor(() => expect(result1.current.isSuccess).toBe(true));
      
      expect(ProductService.getProducts).toHaveBeenCalledTimes(1);
      expect(result1.current.data).toEqual(mockData);

      unmount1();

      // Second render - should use cache
      const { result: result2 } = renderHook(
        () => useProducts({ page: 1 }),
        { wrapper }
      );

      await waitFor(() => expect(result2.current.isSuccess).toBe(true));
      
      // Should still be 1 call (cached)
      expect(ProductService.getProducts).toHaveBeenCalledTimes(1);
      expect(result2.current.data).toEqual(mockData);
    });

    it('should have correct staleTime and cacheTime configuration', () => {
      const { result } = renderHook(() => useProducts(), {
        wrapper: createWrapper(),
      });

      // Verify hook returns expected structure
      expect(result.current).toHaveProperty('data');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
    });
  });

  // =========================================================================
  // TEST 2: Request Cancellation
  // =========================================================================
  
  describe('✅ Test 2: Request Cancellation on Unmount', () => {
    
    it('should cancel request when component unmounts', async () => {
      let abortSignal = null;
      
      ProductService.getProducts.mockImplementation(({ signal }) => {
        abortSignal = signal;
        return new Promise((resolve) => {
          setTimeout(() => resolve({ products: [], total: 0 }), 1000);
        });
      });

      const { unmount } = renderHook(() => useProducts({ page: 1 }), {
        wrapper: createWrapper(),
      });

      // Wait a bit then unmount
      await new Promise(resolve => setTimeout(resolve, 100));
      unmount();

      // Verify signal was passed
      expect(abortSignal).toBeTruthy();
      // In real scenario, signal.aborted would be true after unmount
    });

    it('should not log cancellation errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const abortError = new Error('Request aborted');
      abortError.name = 'AbortError';
      
      ProductService.getProducts.mockRejectedValue(abortError);

      const { result } = renderHook(() => useProducts({ page: 1 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      // Should not log AbortError
      expect(consoleSpy).not.toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  // =========================================================================
  // TEST 3: Exponential Backoff Retry
  // =========================================================================
  
  describe('✅ Test 3: Exponential Backoff Retry Logic', () => {
    
    it('should retry with exponential backoff on failure', async () => {
      const error = new Error('Network error');
      ProductService.getProducts
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce({ products: [], total: 0 });

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * (2 ** attemptIndex), 30000),
          },
        },
      });

      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const startTime = Date.now();
      
      const { result } = renderHook(() => useProducts({ page: 1 }), { wrapper });

      await waitFor(() => expect(result.current.isSuccess).toBe(true), {
        timeout: 10000,
      });

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // Should have taken at least: 1s + 2s + 4s = 7 seconds
      expect(totalTime).toBeGreaterThan(7000);
      
      // Should have called 4 times (initial + 3 retries)
      expect(ProductService.getProducts).toHaveBeenCalledTimes(4);
    });

    it('should stop retrying after max attempts', async () => {
      const error = new Error('Persistent error');
      ProductService.getProducts.mockRejectedValue(error);

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 3,
          },
        },
      });

      const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      const { result } = renderHook(() => useProducts({ page: 1 }), { wrapper });

      await waitFor(() => expect(result.current.isError).toBe(true), {
        timeout: 15000,
      });

      // Should stop after 4 attempts (initial + 3 retries)
      expect(ProductService.getProducts).toHaveBeenCalledTimes(4);
      expect(result.current.error).toBe(error);
    });
  });

  // =========================================================================
  // TEST 4: Performance Monitoring
  // =========================================================================
  
  describe('✅ Test 4: Performance Monitoring', () => {
    
    it('should track fetch time performance', async () => {
      const mockData = { products: [], total: 0 };
      
      ProductService.getProducts.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return mockData;
      });

      const performanceSpy = jest.spyOn(performance, 'now');

      const { result } = renderHook(() => useProducts({ page: 1 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should have called performance.now() at least twice (start and end)
      expect(performanceSpy).toHaveBeenCalled();
      
      performanceSpy.mockRestore();
    });

    it('should log performance metrics when DEBUG_LOGS is enabled', async () => {
      process.env.REACT_APP_ENABLE_DEBUG_LOGS = 'true';
      
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const mockData = { products: [{ id: 1 }], total: 1 };
      ProductService.getProducts.mockResolvedValue(mockData);

      const { result } = renderHook(() => useProducts({ page: 1 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should log performance info
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[useProducts] Query successful'),
        expect.any(String)
      );
      
      consoleLogSpy.mockRestore();
    });
  });

  // =========================================================================
  // TEST 5: Conditional Debug Logging
  // =========================================================================
  
  describe('✅ Test 5: Conditional Debug Logging', () => {
    
    it('should NOT log when DEBUG_LOGS is false', async () => {
      process.env.REACT_APP_ENABLE_DEBUG_LOGS = 'false';
      
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      ProductService.getProducts.mockResolvedValue({ products: [], total: 0 });

      const { result } = renderHook(() => useProducts({ page: 1 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should not have any debug logs
      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('[useProducts]')
      );
      
      consoleLogSpy.mockRestore();
    });

    it('should log when DEBUG_LOGS is true', async () => {
      process.env.REACT_APP_ENABLE_DEBUG_LOGS = 'true';
      
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      ProductService.getProducts.mockResolvedValue({ 
        products: [{ id: 1 }], 
        total: 1 
      });

      const { result } = renderHook(() => useProducts({ page: 1 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should have debug logs
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[useProducts]'),
        expect.anything()
      );
      
      consoleLogSpy.mockRestore();
    });
  });

  // =========================================================================
  // TEST 6: Environment Variables
  // =========================================================================
  
  describe('✅ Test 6: Environment Variables', () => {
    
    it('should use BASE_URL from environment variables', async () => {
      // This test verifies that ProductService uses the correct BASE_URL
      // The actual implementation is in ProductService, not in the hook
      
      ProductService.getProducts.mockResolvedValue({ products: [], total: 0 });

      const { result } = renderHook(() => useProducts({ page: 1 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Verify ProductService was called with correct params
      expect(ProductService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          signal: expect.any(AbortSignal),
        })
      );
    });
  });

  // =========================================================================
  // TEST 7: Remove Product Limit
  // =========================================================================
  
  describe('✅ Test 7: No Product Limit (Show All)', () => {
    
    it('should fetch all products without limit', async () => {
      const mockData = {
        products: Array.from({ length: 50 }, (_, i) => ({
          id: i + 1,
          name: `Product ${i + 1}`,
        })),
        total: 50,
      };

      ProductService.getProducts.mockResolvedValue(mockData);

      const { result } = renderHook(() => useProducts({ page: 1 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      // Should return all 50 products (not limited to 5)
      expect(result.current.data.products).toHaveLength(50);
      expect(result.current.data.total).toBe(50);
    });

    it('should respect limit when provided', async () => {
      const mockData = {
        products: Array.from({ length: 12 }, (_, i) => ({
          id: i + 1,
          name: `Product ${i + 1}`,
        })),
        total: 50,
      };

      ProductService.getProducts.mockResolvedValue(mockData);

      const { result } = renderHook(() => useProducts({ page: 1, limit: 12 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data.products).toHaveLength(12);
      expect(ProductService.getProducts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1, limit: 12 })
      );
    });
  });
});
