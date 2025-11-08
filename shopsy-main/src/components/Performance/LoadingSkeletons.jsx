/**
 * @fileoverview Loading Skeleton Components
 * Provides placeholder UI while lazy components load
 */

import React from 'react';

export const ProductsSkeleton = () => {
  
  
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BannerSkeleton = () => (
  <div className="container mx-auto py-12 px-4">
    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
  </div>
);

export const TestimonialsSkeleton = () => (
  <div className="container mx-auto py-12 px-4">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse mx-auto"></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
        </div>
      ))}
    </div>
  </div>
);

export const FooterSkeleton = () => (
  <div className="bg-gray-100 dark:bg-gray-800 py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
