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
import { useInventory } from "../../contexts/InventoryContext";
import { StockBadge, OutOfStockOverlay, LowStockWarning } from "../Inventory/StockBadge";

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
  const { data, isLoading, isError, error, refetch, isFetching } = useProducts({
    page: 1,
  });
  
  // NEW: Real-time inventory context
  const { 
    isOutOfStock, 
    isLowStock, 
    getInventoryStatus,
    connectionStatus,
    lowStockAlerts 
  } = useInventory();

  const products = data?.products || [];

  // =========================================================================
  // REAL-TIME INVENTORY STATUS DISPLAY
  // =========================================================================

  const renderProductCard = (product, index) => {
    const outOfStock = isOutOfStock(product.id);
    const lowStock = isLowStock(product.id);
    const quantity = lowStockAlerts[product.id];

    return (
      <div
        key={product.id}
        data-aos="fade-up"
        data-aos-delay={Math.min(index * 50, 500)}
        className="space-y-3"
      >
        {/* Out of Stock Overlay */}
        <OutOfStockOverlay isOutOfStock={outOfStock}>
          <div
            onClick={() => !outOfStock && handleProductClick(product.id)}
            className={`cursor-pointer rounded-md overflow-hidden transition-all duration-300 ${
              outOfStock ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-[220px] w-[150px] object-cover"
              loading="lazy"
            />
          </div>
        </OutOfStockOverlay>

        {/* Low Stock Warning */}
        <LowStockWarning isLowStock={lowStock} quantity={quantity} />

        {/* Stock Badge */}
        <StockBadge 
          productId={product.id} 
          productName={product.name}
          className="w-full justify-center"
        />

        {/* Product Details */}
        <div className="pointer-events-none">
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

        {/* Add to Cart Button - Disabled if out of stock */}
        <button
          onClick={() => handleAddToCart(product.id)}
          disabled={outOfStock}
          className={`w-full py-2 rounded-md font-semibold transition-all ${
            outOfStock
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    );
  };

  // =========================================================================
  // EVENT HANDLERS
  // =========================================================================

  const handleProductClick = (id) => {
    if (DEBUG_LOGS) console.log(`🔍 [PRODUCTS] Navigating to product: ${id}`);
    navigate(`/ProductDetails/${id}`);
  };

  const handleAddToCart = (productId) => {
    if (isOutOfStock(productId)) {
      if (DEBUG_LOGS) console.log(`❌ [PRODUCTS] Cannot add out-of-stock item to cart`);
      return;
    }
    console.log(`🛒 [PRODUCTS] Added product ${productId} to cart`);
    // Implement add to cart logic
  };

  const handleRetry = () => {
    if (DEBUG_LOGS) console.log('🔄 [PRODUCTS] Manual retry triggered');
    refetch();
  };

  // =========================================================================
  // LOADING STATE
  // =========================================================================

  if (isLoading) {
    return <ProductsSkeleton />;
  }

  // =========================================================================
  // ERROR STATE
  // =========================================================================

  if (isError) {
    return (
      <div className="bg-white dark:bg-gray-900 dark:text-white min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Products Load Failed</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Please try again</p>
          <button
            onClick={handleRetry}
            disabled={isFetching}
            className="bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition disabled:opacity-50"
          >
            {isFetching ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // EMPTY STATE
  // =========================================================================

  if (products.length === 0) {
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

  // =========================================================================
  // MAIN RENDER
  // =========================================================================

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      {/* Connection Status Indicator */}
      <div className="text-center mb-4">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
          connectionStatus === 'connected' 
            ? 'bg-green-100 text-green-800' 
            : connectionStatus === 'polling'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          <span className={`inline-block w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-600' : 'bg-gray-600'
          }`}></span>
          Real-time {connectionStatus === 'connected' ? 'Connected' : connectionStatus === 'polling' ? 'Polling' : 'Disconnected'}
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-10 max-w-[600px] mx-auto mt-10">
        <h1 data-aos="fade-up" className="text-3xl font-bold">
          Our Products
        </h1>
        <p data-aos="fade-up" data-aos-delay="100" className="text-gray-600 dark:text-gray-400 mt-2">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Refetch Indicator */}
      {isFetching && !isLoading && (
        <div className="fixed top-4 right-4 bg-primary text-white px-4 py-2 rounded-md shadow-lg z-50 animate-pulse">
          Updating products...
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 px-4">
        {products.map((product, index) => renderProductCard(product, index))}
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-10 mb-4">
        <Link to="/Allproducts">
          <button className="text-center cursor-pointer bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors duration-300">
            View All Products
          </button>
        </Link>
      </div>
    </div>
  );
};

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
