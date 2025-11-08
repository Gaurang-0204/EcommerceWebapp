/**
 * @fileoverview React Query Configuration
 * Central configuration for React Query client
 */

import { QueryClient } from '@tanstack/react-query';

const DEBUG_LOGS = import.meta.env.REACT_APP_ENABLE_DEBUG_LOGS === 'true';

/**
 * Default query options
 */
const defaultOptions = {
  queries: {
    // Cached data considered fresh for 5 minutes
    staleTime: parseInt(import.meta.env.REACT_APP_CACHE_STALE_TIME) || 5 * 60 * 1000,
    
    // Cached data kept in memory for 10 minutes
    cacheTime: parseInt(import.meta.env.REACT_APP_CACHE_TIME) || 10 * 60 * 1000,
    
    // Retry 3 times with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Don't refetch on window focus (can be annoying in dev)
    refetchOnWindowFocus: false,
    
    // Refetch on reconnect
    refetchOnReconnect: true,
    
    // Keep previous data while fetching new data
    keepPreviousData: true,
  },
  mutations: {
    // Retry mutations once
    retry: 1,
  },
};

/**
 * Create Query Client instance
 */
export const queryClient = new QueryClient({
  defaultOptions,
  logger: {
    log: (...args) => {
      if (DEBUG_LOGS) console.log(...args);
    },
    warn: (...args) => {
      if (DEBUG_LOGS) console.warn(...args);
    },
    error: (...args) => {
      console.error(...args);
    },
  },
});

export default queryClient;