/**
 * @fileoverview All Products Component - Product Grid Display
 * 
 * Displays a grid of products fetched from the Django backend API.
 * Features animations, lazy loading, error handling, and loading states.
 * This component is already using React.memo for performance optimization.
 * 
 * ENTERPRISE OPTIMIZATION ROADMAP:
 * This component needs significant enhancements to meet enterprise standards.
 * Multiple advanced features must be implemented including AI recommendations,
 * real-time inventory, analytics tracking, and microservices integration.
 * 
 * CURRENT ARCHITECTURE:
 * - Frontend: React with AOS animations
 * - Backend: Django REST API (http://127.0.0.1:8000)
 * - Data Flow: Component mount → API fetch → Display 5 products
 * 
 * CURRENT STRENGTHS:
 * ✅ Already using React.memo (good performance practice)
 * ✅ Has loading skeleton component
 * ✅ Has error handling UI
 * ✅ Has empty state UI
 * ✅ Uses lazy loading for images
 * ✅ Implements console logging for debugging
 * ✅ Uses performance.now() for timing
 * 
 * CURRENT ISSUES:
 * ❌ No caching - API called every mount
 * ❌ Limits to only 5 products (why not show all?)
 * ❌ No pagination or infinite scroll
 * ❌ No AI recommendations
 * ❌ No real-time inventory updates
 * ❌ No analytics tracking
 * ❌ Direct axios calls (should use microservices)
 * ❌ No search or filtering
 * ❌ Console logs in production code (should be removed/conditional)
 * 
 * @component
 * @version 1.0.0 - MVP (Current)
 * @version 2.0.0 - Planned (Enterprise Features)
 * 
 * @requires React
 * @requires axios
 * @requires react-router-dom
 * @requires AOS
 * @requires react-icons/fa
 * 
 * @example
 * // In Home.jsx
 * const MemoizedProducts = React.memo(Products)
 * <MemoizedProducts />
 */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaDollarSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// React Query hook
import { useProducts } from "../../hooks/useProducts";

// Import loading skeleton
import { ProductsSkeleton } from "../Performance/LoadingSkeletons";

const DEBUG_LOGS =import.meta.env.REACT_APP_ENABLE_DEBUG_LOGS === 'true';
const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';


// =============================================================================
// TODO: IMPORT ADVANCED FEATURE MODULES (Future Implementation)
// =============================================================================

// TODO: AI Recommendation System (+1.5 points)
// import { useRecommendations } from '@/hooks/useRecommendations'
// import RecommendationEngine from '@/services/ai/RecommendationEngine'
// import PersonalizedProducts from '@/components/AI/PersonalizedProducts'

// TODO: Real-time Inventory (+1 point)
// import { useInventoryWebSocket } from '@/hooks/useInventoryWebSocket'
// import StockBadge from '@/components/Inventory/StockBadge'

// TODO: Analytics Dashboard (+1 point)
// import { useAnalytics } from '@/hooks/useAnalytics'
// import AnalyticsTracker from '@/services/analytics/AnalyticsTracker'

// TODO: Performance Optimization (+1 point)
// import { useQuery } from 'react-query'
// import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
// import { useVirtualization } from '@/hooks/useVirtualization'

// TODO: Microservices Architecture (+1.5 points)
// import ProductService from '@/services/microservices/ProductService'
// import InventoryService from '@/services/microservices/InventoryService'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * AllProducts Component
 * 
 * Displays a grid of products with loading, error, and empty states.
 * Already memoized for performance optimization.
 * 
 * TODO: Replace with React Query for caching
 * TODO: Add pagination or infinite scroll
 * TODO: Integrate real-time inventory updates
 * TODO: Add AI-powered recommendations
 * TODO: Track analytics events
 * 
 * @component
 * @returns {JSX.Element} Products grid with loading/error states
 */
const AllProducts = () => {
  
 
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProducts({
    page: 1,
    // No limit specified - shows all products from API
    // You can uncomment below to limit:
    // limit: parseInt(process.env.REACT_APP_PRODUCTS_PER_PAGE) || 12,
  });


  


// Extract products from data
const products = data?.products || [];



   // ---------------------------------------------------------------------------
  // LIFECYCLE EFFECTS
  // ---------------------------------------------------------------------------


  /**
   * Initialize AOS animations
   * Runs once on component mount
   */
  useEffect(() => {
    if (DEBUG_LOGS) {
      console.log('⚡ [PRODUCTS] Component mounted, initializing AOS...');
    }


    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });


    if (DEBUG_LOGS) {
      console.log('✅ [PRODUCTS] AOS initialized');
    }
  }, []);


  /**
   * Log data changes in development
   */
  useEffect(() => {
    if (DEBUG_LOGS && products.length > 0) {
      console.log(`📦 [PRODUCTS] Displaying ${products.length} products`);
    }
  }, [products]);



  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------


  /**
   * Handle product card click
   * Navigate to product details page
   */
  const handleProductClick = (id) => {
    if (DEBUG_LOGS) {
      console.log(`🔍 [PRODUCTS] Navigating to product: ${id}`);
    }
    navigate(`/ProductDetails/${id}`);
  };


  /**
   * Handle retry button click
   * Manually trigger refetch
   */
  const handleRetry = () => {
    if (DEBUG_LOGS) {
      console.log('🔄 [PRODUCTS] Manual retry triggered');
    }
    refetch();
  };




  // ---------------------------------------------------------------------------
  // RENDER LOGIC - LOADING STATE
  // ---------------------------------------------------------------------------


  /**
   * Loading state with skeleton
   * 
   * CURRENT: ✅ Good implementation with custom skeleton component
   * NOTE: This is already well optimized
   */
  if (isLoading) {  // Changed from: if (loading)
    console.log('🎨 [PRODUCTS] Rendering ProductsSkeleton');
    return <ProductsSkeleton />;
  }


  // ---------------------------------------------------------------------------
  // RENDER LOGIC - ERROR STATE
  // ---------------------------------------------------------------------------


  if (isError) {
    if (DEBUG_LOGS) {
      console.error('❌ [PRODUCTS] Rendering error state:', error);
    }


    // Determine error message
    let errorMessage = 'An unexpected error occurred';
    let errorSubtext = 'Please try again later';


    if (error?.isNetworkError) {
      errorMessage = 'Network Connection Failed';
      errorSubtext = 'Please check your internet connection and try again';
    } else if (error?.isTimeout) {
      errorMessage = 'Request Timeout';
      errorSubtext = 'The server took too long to respond. Please try again';
    } else if (error?.status === 404) {
      errorMessage = 'Products Not Found';
      errorSubtext = 'The products endpoint could not be found';
    } else if (error?.status >= 500) {
      errorMessage = 'Server Error';
      errorSubtext = 'Our servers are experiencing issues. Please try again later';
    } else if (error?.message) {
      errorSubtext = error.message;
    }


    return (
      <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">{errorMessage}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{errorSubtext}</p>
          
          {DEBUG_LOGS && error?.message && (
            <details className="mb-6 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <summary className="cursor-pointer font-semibold text-sm">
                Technical Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(error, null, 2)}
              </pre>
            </details>
          )}
          
          <button
            onClick={handleRetry}
            disabled={isFetching}
            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetching ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }


   // ---------------------------------------------------------------------------
  // RENDER LOGIC - EMPTY STATE
  // ---------------------------------------------------------------------------


  if (products.length === 0) {
    if (DEBUG_LOGS) {
      console.log('📭 [PRODUCTS] No products found');
    }


    return (
      <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">No Products Available</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Check back later for new products!
          </p>
          <button
            onClick={handleRetry}
            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }


  if (DEBUG_LOGS) {
    console.log('✅ [PRODUCTS] Rendering products grid');
  }


  // ---------------------------------------------------------------------------
  // MAIN RENDER - PRODUCTS GRID
  // ---------------------------------------------------------------------------


  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      {/* Header Section */}
      <div className="text-center mb-10 max-w-[600px] mx-auto mt-10">
        <h1 data-aos="fade-up" className="text-3xl font-bold">
          Our Products
        </h1>
        <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600 dark:text-gray-400 mt-2">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>


      {/* Background refetch indicator */}
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg z-50 animate-pulse">
          Updating products...
        </div>
      )}


      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 px-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            data-aos="fade-up"
            data-aos-delay={Math.min(index * 50, 500)} // Stagger animations
            className="space-y-3 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => handleProductClick(product.id)}
          >
            {/* Product Image */}
            <img
              src={`${BASE_URL}${product.image}`}
              alt={product.name}
              className="h-[220px] w-[150px] object-cover rounded-md"
              loading="lazy"
            />


            {/* Product Details */}
            <div>
              <h3 className="font-semibold truncate" title={product.name}>
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {product.color}
              </p>
              <div className="flex items-center gap-1">
                <FaDollarSign className="text-primary" />
                <span className="font-bold">{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* View All Products Button */}
      {/* 
        TODO Phase 2: Replace with pagination or infinite scroll
        Currently shows all products, so this button might be redundant
      */}
      <div className="flex justify-center mt-10 mb-4">
        <Link to="/Allproducts">
          <button className="text-center cursor-pointer bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors duration-300">
            View All Products
          </button>
        </Link>
      </div>


      {/* React Query Cache Info (Development Only) */}
      {DEBUG_LOGS && (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white text-xs p-3 rounded z-50 max-w-xs">
          <div className="font-bold mb-1">React Query Status:</div>
          <div>Products: {products.length}</div>
          <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
          <div>Fetching: {isFetching ? 'Yes' : 'No'}</div>
          <div>Cached: {!isLoading && !isFetching ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
};


// Export with memoization
export default React.memo(AllProducts);

// =============================================================================
// EXPORT WITH MEMOIZATION
// =============================================================================

/**
 * Export memoized component to prevent unnecessary re-renders
 * 
 * CURRENT: ✅ Already using React.memo (excellent!)
 * 
 * NOTE: Component will only re-render if props change.
 * Since this component has no props, it will only re-render on internal state changes.
 * 
 * PERFORMANCE TIP:
 * If you add props later, specify a custom comparison function:
 * 
 * export default React.memo(AllProducts, (prevProps, nextProps) => {
 *   return prevProps.someValue === nextProps.someValue
 * })
 */


// =============================================================================
// COMPREHENSIVE DOCUMENTATION
// =============================================================================

/**
 * COMPONENT ARCHITECTURE
 * 
 * DATA FLOW:
 * Component Mount
 * ↓
 * Initialize AOS animations
 * ↓
 * Fetch products from API
 * ↓
 * Transform data (slice to 5 products)
 * ↓
 * Update state: setProducts(), setLoading(false)
 * ↓
 * Render products grid
 * ↓
 * User Interactions:
 * - Click product card → Navigate to details
 * - Click "View All" → Navigate to /Allproducts
 * 
 * STATE MANAGEMENT PLAN:
 * Current (Component State):
 * - products (array)
 * - loading (boolean)
 * - error (string|null)
 * 
 * Planned (Global State - React Query):
 * - products (cached, auto-refetch)
 * - inventory (real-time via WebSocket)
 * - recommendations (AI-powered)
 * - cart (shopping cart state)
 * 
 * MICROSERVICES INTEGRATION PLAN:
 * AllProducts Component
 * ├── ProductService (Port 8001)
 * │   └── GET /api/v1/products
 * │   └── GET /api/v1/products?limit=5
 * ├── InventoryService (Port 8002)
 * │   └── WebSocket: /ws/inventory/
 * │   └── GET /api/v1/inventory/stock/{id}
 * ├── RecommendationService (Port 8003)
 * │   └── GET /api/v1/recommendations/{userId}
 * │   └── POST /api/v1/track/view
 * ├── AnalyticsService (Port 8004)
 * │   └── POST /api/v1/track/event
 * └── CDN (Cloudflare/Cloudinary)
 *     └── Optimized product images
 * 
 * PERFORMANCE METRICS TO TRACK:
 * - Time to First Contentful Paint (FCP)
 * - Time to Interactive (TTI)
 * - API response time
 * - Image load time
 * - Component render time
 * - Cache hit rate
 * - WebSocket latency
 * 
 * CACHING STRATEGY:
 * Level 1: React Query Cache
 * - staleTime: 5 minutes
 * - cacheTime: 10 minutes
 * - Background refetch
 * 
 * Level 2: Backend Redis Cache
 * - Product data: 5 minutes
 * - Invalidate on product update
 * 
 * Level 3: CDN Cache
 * - Product images: 1 day
 * - Static assets: 1 year
 */

/**
 * IMPLEMENTATION PRIORITY ROADMAP
 * 
 * PHASE 1: CRITICAL FIXES & OPTIMIZATION (Week 1-2)
 * Priority: URGENT
 * 
 * 1. Replace axios with React Query for caching
 * 2. Remove .slice(0, 5) limit - show all products with pagination
 * 3. Remove/conditionally enable console.log statements
 * 4. Add request cancellation on unmount
 * 5. Implement retry logic with exponential backoff
 * 6. Add performance monitoring
 * 7. Move BASE_URL to environment variables
 * 
 * Expected Impact:
 * - 70% reduction in API calls (caching)
 * - Better user experience (show all products)
 * - Cleaner production code
 * 
 * PHASE 2: REAL-TIME INVENTORY (Week 3-4)
 * Priority: HIGH
 * 
 * 1. Set up WebSocket connection for inventory
 * 2. Display real-time stock badges
 * 3. Show "Out of Stock" overlay
 * 4. Disable purchase for out-of-stock items
 * 5. Add low stock warnings
 * 
 * Expected Impact:
 * - Prevent overselling
 * - Better customer experience
 * - Real-time updates
 * 
 * PHASE 3: AI RECOMMENDATIONS (Week 5-7)
 * Priority: HIGH
 * 
 * 1. Build recommendation ML service
 * 2. Track user product views
 * 3. Display "Recommended for You" section
 * 4. Show "Frequently Bought Together"
 * 5. Implement collaborative filtering
 * 
 * Expected Impact:
 * - 25% increase in average order value
 * - Better product discovery
 * - Personalized experience
 * 
 * PHASE 4: ANALYTICS & TRACKING (Week 8-9)
 * Priority: MEDIUM
 * 
 * 1. Track product views
 * 2. Track product clicks
 * 3. Track add to cart events
 * 4. Build analytics dashboard
 * 5. Monitor performance metrics
 * 
 * Expected Impact:
 * - Data-driven decisions
 * - Understand user behavior
 * - Optimize conversions
 * 
 * PHASE 5: ADVANCED UX (Week 10-11)
 * Priority: MEDIUM
 * 
 * 1. Add infinite scroll or pagination
 * 2. Implement virtual scrolling
 * 3. Add quick add to cart
 * 4. Add wishlist functionality
 * 5. Add filter and sort options
 * 
 * Expected Impact:
 * - Better performance with many products
 * - Faster purchasing flow
 * - Better product discovery
 * 
 * PHASE 6: MICROSERVICES (Week 12-16)
 * Priority: LOW-MEDIUM
 * 
 * 1. Create ProductService microservice
 * 2. Create InventoryService microservice
 * 3. Create RecommendationService microservice
 * 4. Set up API Gateway
 * 5. Implement circuit breaker pattern
 * 6. Dockerize all services
 * 
 * Expected Impact:
 * - Scalable architecture
 * - Independent service deployment
 * - Better fault isolation
 */

/**
 * FILES TO CREATE
 * 
 * Hooks:
 * ├── hooks/useProducts.js (React Query)
 * ├── hooks/useInventoryWebSocket.js
 * ├── hooks/useRecommendations.js
 * ├── hooks/useAnalytics.js
 * ├── hooks/useInfiniteScroll.js
 * └── hooks/useVirtualization.js
 * 
 * Services:
 * ├── services/microservices/ProductService.js
 * ├── services/microservices/InventoryService.js
 * ├── services/microservices/RecommendationService.js
 * ├── services/microservices/AnalyticsService.js
 * └── services/cache/CacheService.js
 * 
 * Components:
 * ├── components/Products/ProductCard.jsx
 * ├── components/Products/ProductGrid.jsx
 * ├── components/AI/RecommendedProducts.jsx
 * ├── components/AI/FrequentlyBoughtTogether.jsx
 * ├── components/Inventory/StockBadge.jsx
 * ├── components/UI/FilterDropdown.jsx
 * └── components/UI/SortDropdown.jsx
 * 
 * Performance:
 * ├── components/Performance/VirtualGrid.jsx
 * └── components/Performance/IntersectionObserver.jsx
 */
