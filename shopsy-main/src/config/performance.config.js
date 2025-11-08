/**
 * @fileoverview Performance Configuration
 * Central configuration for performance settings
 */

export const PERFORMANCE_CONFIG = {
  // Lazy loading configuration
  lazyLoading: {
    enabled: true,
    intersectionObserverOptions: {
      root: null,
      rootMargin: '50px', // Start loading 50px before element enters viewport
      threshold: 0.01
    }
  },

  // Code splitting configuration
  codeSplitting: {
    enabled: true,
    suspenseFallbackDelay: 200 // ms
  },

  // Image optimization
  images: {
    lazyLoad: true,
    placeholder: 'blur',
    formats: ['webp', 'avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },

  // Performance budgets
  budgets: {
    maxBundleSize: 250, // KB
    maxInitialLoad: 3000, // ms
    maxLCP: 2500, // ms
    maxFID: 100, // ms
    maxCLS: 0.1
  },

  // Monitoring
  monitoring: {
    enabled: true,
    sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1, // 10% in prod, 100% in dev
    logToConsole: process.env.NODE_ENV === 'development'
  }
};

export default PERFORMANCE_CONFIG;
