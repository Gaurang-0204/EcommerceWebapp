/**
 * @fileoverview Performance Monitor Wrapper
 * Wraps components to track render performance
 */

import React, { useEffect, useRef } from 'react';
import { usePerformanceMetrics } from '../../hooks/usePerformanceMetrics';

const PerformanceMonitor = ({ children, componentName = 'Unknown' }) => {
  const { recordComponentRender } = usePerformanceMetrics();
  const renderStartTime = useRef(Date.now());

  useEffect(() => {
    const renderTime = Date.now() - renderStartTime.current;
    recordComponentRender(componentName, renderTime);
  }, [componentName, recordComponentRender]);

  // Show performance overlay in development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="relative">
        {children}
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded z-50">
          {componentName}: {Date.now() - renderStartTime.current}ms
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PerformanceMonitor;

