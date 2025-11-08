/**
 * @fileoverview Performance Metrics Hook
 * Tracks and records performance metrics including Web Vitals
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    pageLoadTime: null,
    cls: null,
    fid: null,
    fcp: null,
    lcp: null,
    ttfb: null,
    componentRenderTime: {}
  });

  // ✅ FIX 1: Use useRef to store the function so it doesn't change
  const recordMetricRef = useRef();

  // Record a custom metric
  const recordMetric = useCallback((name, value) => {
    setMetrics(prev => ({
      ...prev,
      [name]: value
    }));

    // Log to console in development
    if (import.meta.env.DEV) {
      console.log(`Performance Metric [${name}]:`, value);
    }

    // TODO: Send to analytics service
    // sendToAnalytics('performance_metric', { name, value });
  }, []); // ✅ Empty dependency array - function never changes

  // Store the stable reference
  recordMetricRef.current = recordMetric;

  // Record component render time
  const recordComponentRender = useCallback((componentName, renderTime) => {
    setMetrics(prev => ({
      ...prev,
      componentRenderTime: {
        ...prev.componentRenderTime,
        [componentName]: renderTime
      }
    }));
  }, []); // ✅ Empty dependency array

  // ✅ FIX 2: Initialize Web Vitals tracking - RUNS ONLY ONCE
  useEffect(() => {
    // Dynamic import to keep bundle small
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      // ✅ FIX 3: Use onCLS instead of getCLS (web-vitals v3+)
      onCLS((metric) => recordMetricRef.current('cls', metric.value));
      onFID((metric) => recordMetricRef.current('fid', metric.value));
      onFCP((metric) => recordMetricRef.current('fcp', metric.value));
      onLCP((metric) => recordMetricRef.current('lcp', metric.value));
      onTTFB((metric) => recordMetricRef.current('ttfb', metric.value));
    }).catch(err => {
      console.error('Failed to load web-vitals:', err);
    });

    // Record page load time
    if (window.performance && window.performance.timing) {
      const loadTime = window.performance.timing.loadEventEnd - 
                      window.performance.timing.navigationStart;
      recordMetricRef.current('page_load_time', loadTime);
    }
  }, []); // ✅ Empty array - run only once on mount

  return {
    metrics,
    recordMetric,
    recordComponentRender
  };
};
