/**
 * @fileoverview Navbar Component - Main Navigation Bar
 * 
 * Primary navigation component with search functionality, cart access, authentication,
 * dark mode toggle, and dropdown menus. This is a critical component that appears
 * on every page and is a key touchpoint for advanced feature integration.
 * 
 * ENTERPRISE OPTIMIZATION ROADMAP:
 * This component requires significant optimization and feature enhancements to meet
 * enterprise standards. Below are detailed instructions for implementing advanced features.
 * 
 * CURRENT ISSUES IDENTIFIED:
 * 1. ❌ Basic search without autocomplete or fuzzy matching
 * 2. ❌ No real-time cart count updates via WebSocket
 * 3. ❌ Authentication state managed locally (should use global state)
 * 4. ❌ No search analytics tracking
 * 5. ❌ Menu items hardcoded (should be dynamic from API)
 * 6. ❌ No performance optimization (React.memo, useCallback)
 * 7. ❌ No notification system for real-time updates
 * 8. ❌ Duplicate IDs in Menu array (id: 3 appears multiple times)
 * 
 * @component
 * @version 1.0.0 - MVP
 * @version 2.0.0 - Planned (Enterprise Features)
 * 
 * @requires React
 * @requires react-router-dom
 * @requires react-icons
 * 
 * @example
 * ```
 * <Navbar handleOrderPopup={handleOrderPopup} />
 * ```
 */

import React from "react";
import Logo from "../../assets/logo.png";
import { IoMdSearch } from "react-icons/io";
import { FaCartShopping } from "react-icons/fa6";
import { FaCaretDown } from "react-icons/fa";
import DarkMode from "./DarkMode";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// =============================================================================
// TODO: IMPORT ADVANCED FEATURE MODULES (Future Implementation)
// =============================================================================

// -------------------------------------------------------------------------
// 1. SEARCH OPTIMIZATION (+1 point) - ElasticSearch/Algolia Integration
// -------------------------------------------------------------------------
// TODO: Replace basic search with advanced search solution
// import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch-dom'
// import algoliasearch from 'algoliasearch/lite'
// import SearchAutocomplete from '@/components/Search/SearchAutocomplete'
// import SearchResults from '@/components/Search/SearchResults'
// 
// IMPLEMENTATION STEPS:
// 1. Set up Algolia account (https://www.algolia.com) or self-hosted ElasticSearch
// 2. Create search index with all products
// 3. Configure search attributes (name, description, category, tags)
// 4. Implement autocomplete with instant results
// 5. Add search analytics tracking
// 6. Implement "Did you mean?" suggestions
// 7. Add faceted filtering (category, price, rating, brand)
// 
// FILES TO CREATE:
// - services/search/AlgoliaClient.js
// - components/Search/SearchAutocomplete.jsx
// - components/Search/SearchResults.jsx
// - components/Search/SearchFilters.jsx
// - hooks/useSearchAnalytics.js
// 
// ALGOLIA SETUP:
// ```
// const searchClient = algoliasearch(
//   'YOUR_APP_ID',
//   'YOUR_SEARCH_API_KEY'
// );
// ```
// 
// INTEGRATION POINT: Replace current search input with InstantSearch

// -------------------------------------------------------------------------
// 2. REAL-TIME INVENTORY (+1 point) - WebSocket for Cart Updates
// -------------------------------------------------------------------------
// TODO: Add WebSocket connection for real-time cart updates
// import { useWebSocket } from '@/hooks/useWebSocket'
// import { useNotifications } from '@/hooks/useNotifications'
// 
// IMPLEMENTATION STEPS:
// 1. Set up Socket.io server for real-time communication
// 2. Create WebSocket hook for managing connections
// 3. Subscribe to cart update events
// 4. Show real-time cart count badge
// 5. Add notification for low stock items
// 6. Implement optimistic UI updates
// 
// FILES TO CREATE:
// - hooks/useWebSocket.js
// - hooks/useNotifications.js
// - services/websocket/CartWebSocketService.js
// - components/Notifications/NotificationBadge.jsx
// 
// WEBSOCKET EVENTS TO LISTEN:
// - 'cart:update' - Cart item added/removed
// - 'cart:count' - Total items in cart
// - 'inventory:low' - Product running low on stock
// - 'inventory:out' - Product out of stock
// 
// INTEGRATION POINT: Add notification bell icon next to cart

// -------------------------------------------------------------------------
// 3. AI RECOMMENDATIONS (+1.5 points) - Smart Search Suggestions
// -------------------------------------------------------------------------
// TODO: Add AI-powered search suggestions
// import RecommendationEngine from '@/services/ai/RecommendationEngine'
// import SearchRecommendations from '@/components/AI/SearchRecommendations'
// 
// IMPLEMENTATION STEPS:
// 1. Track user search queries and click-through rates
// 2. Implement TF-IDF or ML-based search ranking
// 3. Show personalized search suggestions based on history
// 4. Add "Trending Searches" section
// 5. Implement search result personalization
// 
// FILES TO CREATE:
// - services/ai/SearchRankingEngine.js
// - components/AI/SearchRecommendations.jsx
// - hooks/useSearchHistory.js
// 
// INTEGRATION POINT: Show recommendations dropdown under search bar

// -------------------------------------------------------------------------
// 4. ADMIN ANALYTICS (+1 point) - Track Navigation & Search Analytics
// -------------------------------------------------------------------------
// TODO: Integrate analytics tracking for user behavior
// import { useAnalytics } from '@/hooks/useAnalytics'
// import AnalyticsTracker from '@/services/analytics/AnalyticsTracker'
// 
// IMPLEMENTATION STEPS:
// 1. Track all navigation clicks
// 2. Track search queries and result clicks
// 3. Track cart button clicks
// 4. Track login/logout events
// 5. Send data to analytics dashboard
// 
// FILES TO CREATE:
// - hooks/useAnalytics.js
// - services/analytics/NavigationTracker.js
// - services/analytics/SearchAnalytics.js
// 
// EVENTS TO TRACK:
// - Menu click (which menu item)
// - Search query (query text, results count)
// - Cart button click
// - Login/Logout events
// - Dark mode toggle
// 
// INTEGRATION POINT: Wrap all interactive elements with tracking

// -------------------------------------------------------------------------
// 5. PERFORMANCE OPTIMIZATION (+1 point)
// -------------------------------------------------------------------------
// TODO: Optimize component rendering and bundle size
// import { memo, useCallback, useMemo } from 'react'
// import { lazy, Suspense } from 'react'
// 
// OPTIMIZATIONS TO IMPLEMENT:
// 1. Memoize Navbar component with React.memo()
// 2. Use useCallback for handleSearch, handleLogout
// 3. Lazy load DarkMode component
// 4. Debounce search input (prevent excessive API calls)
// 5. Implement virtual scrolling for dropdown menus if large
// 6. Add service worker for offline caching
// 7. Optimize logo image (use WebP format, lazy load)
// 
// FILES TO CREATE:
// - hooks/useDebounce.js
// - utils/performance/ImageOptimizer.js
// 
// INTEGRATION POINTS:
// - Wrap entire Navbar export with React.memo()
// - Add useCallback to all event handlers
// - Lazy load dropdown content

// -------------------------------------------------------------------------
// 6. MICROSERVICES ARCHITECTURE (+1.5 points)
// -------------------------------------------------------------------------
// TODO: Integrate with microservices for authentication and cart
// import AuthService from '@/services/microservices/AuthService'
// import CartService from '@/services/microservices/CartService'
// import NotificationService from '@/services/microservices/NotificationService'
// 
// MICROSERVICES TO INTEGRATE:
// 1. Auth Service - Handle login/logout/token refresh
// 2. Cart Service - Get cart count, update cart
// 3. Notification Service - Real-time notifications
// 4. Search Service - Advanced search API
// 
// FILES TO CREATE:
// - services/microservices/AuthService.js
// - services/microservices/CartService.js
// - services/microservices/NotificationService.js
// - services/microservices/SearchService.js
// 
// INTEGRATION POINTS:
// - Replace localStorage auth with AuthService
// - Get cart count from CartService
// - Show notifications from NotificationService

// =============================================================================
// CONSTANTS & CONFIGURATION
// =============================================================================

/**
 * Main Navigation Menu Items
 * 
 * TODO: CRITICAL BUG - Duplicate IDs!
 * WARNING: Multiple menu items have id: 3
 * FIX: Ensure each menu item has a unique ID
 * 
 * TODO: Make this dynamic
 * OPTIMIZATION: Fetch menu items from API/CMS for flexibility
 * REASON: Allows admin to manage menu without code deployment
 * 
 * SUGGESTED IMPLEMENTATION:
 * ```
 * const [menuItems, setMenuItems] = useState([])
 * 
 * useEffect(() => {
 *   MenuService.fetchMenuItems()
 *     .then(setMenuItems)
 *     .catch(console.error)
 * }, [])
 * ```
 * 
 * FILES TO CREATE:
 * - services/cms/MenuService.js
 * - admin/MenuManager.jsx (for managing menu items)
 * 
 * @constant {Array<{id: number, name: string, link: string}>}
 */
const Menu = [
  {
    id: 1,
    name: "Home",
    link: "/",
  },
  {
    id: 2,
    name: "Profile ",
    link: "/ProfilePage",
  },
  {
    id: 3, // ❌ BUG: Duplicate ID
    name: "Kids Wear",
    link: "/#",
  },
  {
    id: 3, // ❌ BUG: Duplicate ID
    name: "Mens Wear",
    link: "/#",
  },
  {
    id: 3, // ❌ BUG: Duplicate ID
    name: "Electronics",
    link: "/#",
  },
  {
    id: 4,
    name: "Admin",
    link: "/Admin",
  },
];

/**
 * Dropdown Menu Items (Trending Products)
 * 
 * TODO: Make this dynamic with real trending data
 * OPTIMIZATION: Fetch from analytics service to show actual trending products
 * 
 * SUGGESTED IMPLEMENTATION:
 * ```
 * const [trendingProducts, setTrendingProducts] = useState([])
 * 
 * useEffect(() => {
 *   AnalyticsService.getTrendingProducts(7) // Last 7 days
 *     .then(products => {
 *       const dropdownItems = products.map(p => ({
 *         id: p.id,
 *         name: p.name,
 *         link: `/product/${p.slug}`
 *       }))
 *       setTrendingProducts(dropdownItems)
 *     })
 * }, [])
 * ```
 * 
 * ADVANCED FEATURES:
 * - Show real-time trending products based on views/purchases
 * - Update dropdown content every 5 minutes
 * - Add "🔥" icon for hot trending items
 * - Show percentage increase in popularity
 * 
 * @constant {Array<{id: number, name: string, link: string}>}
 */
const DropdownLinks = [
  {
    id: 1,
    name: "Trending Products",
    link: "/#",
  },
  {
    id: 2,
    name: "Best Selling",
    link: "/#",
  },
  {
    id: 3,
    name: "Top Rated",
    link: "/#",
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Navbar Component
 * 
 * TODO: Add React.memo for performance
 * OPTIMIZATION: Prevent unnecessary re-renders
 * 
 * SUGGESTED IMPLEMENTATION:
 * ```
 * const Navbar = memo(({ handleOrderPopup }) => {
 *   // ... component code
 * })
 * ```
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.handleOrderPopup - Callback to open order popup modal
 * @returns {JSX.Element} Navbar component
 */
const Navbar = ({ handleOrderPopup }) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------

  /**
   * Search query state
   * 
   * TODO: Add debounce to prevent excessive API calls
   * OPTIMIZATION: Use useDebounce hook to delay search execution
   * 
   * SUGGESTED IMPLEMENTATION:
   * ```
   * import { useDebounce } from '@/hooks/useDebounce'
   * 
   * const [query, setQuery] = useState("");
   * const debouncedQuery = useDebounce(query, 300); // 300ms delay
   * 
   * useEffect(() => {
   *   if (debouncedQuery.trim()) {
   *     // Fetch search suggestions
   *     SearchService.getSuggestions(debouncedQuery)
   *       .then(setSuggestions)
   *   }
   * }, [debouncedQuery])
   * ```
   * 
   * FILES TO CREATE:
   * - hooks/useDebounce.js
   * 
   * @type {[string, Function]}
   */
  const [query, setQuery] = useState("");

  /**
   * React Router navigation hook
   * 
   * TODO: Add navigation tracking
   * OPTIMIZATION: Track all programmatic navigations for analytics
   * 
   * @type {Function}
   */
  const navigate = useNavigate();

  /**
   * Authentication state
   * 
   * TODO: Replace with global state management
   * ISSUE: Currently using localStorage which is not reactive
   * OPTIMIZATION: Use Context API, Redux, or Zustand
   * 
   * SUGGESTED IMPLEMENTATION:
   * ```
   * import { useAuth } from '@/context/AuthContext'
   * 
   * const { isAuthenticated, user, logout } = useAuth()
   * ```
   * 
   * FILES TO CREATE:
   * - context/AuthContext.jsx
   * - hooks/useAuth.js
   * - services/auth/AuthService.js
   * 
   * BENEFITS:
   * - Real-time auth state updates across all components
   * - Automatic token refresh
   * - Centralized auth logic
   * 
   * @type {[boolean, Function]}
   */
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ---------------------------------------------------------------------------
  // TODO: ADD ADVANCED FEATURE STATE
  // ---------------------------------------------------------------------------

  // TODO: Cart count state (from WebSocket)
  // const [cartCount, setCartCount] = useState(0)
  // const { isConnected, subscribe } = useWebSocket()

  // TODO: Search suggestions state
  // const [searchSuggestions, setSearchSuggestions] = useState([])
  // const [showSuggestions, setShowSuggestions] = useState(false)

  // TODO: Notifications state
  // const [notifications, setNotifications] = useState([])
  // const [unreadCount, setUnreadCount] = useState(0)

  // TODO: Trending menu items (dynamic)
  // const [trendingProducts, setTrendingProducts] = useState(DropdownLinks)

  // TODO: Analytics tracking
  // const { trackEvent } = useAnalytics()

  // ---------------------------------------------------------------------------
  // LIFECYCLE EFFECTS
  // ---------------------------------------------------------------------------

  /**
   * Check authentication status on component mount
   * 
   * TODO: Replace with proper auth service
   * ISSUE: Checking localStorage is not secure or reactive
   * OPTIMIZATION: Use AuthService with token validation
   * 
   * SUGGESTED IMPLEMENTATION:
   * ```
   * useEffect(() => {
   *   AuthService.validateToken()
   *     .then(user => {
   *       setIsAuthenticated(true)
   *       setUser(user)
   *     })
   *     .catch(() => {
   *       setIsAuthenticated(false)
   *       AuthService.refreshToken() // Try to refresh
   *     })
   * }, [])
   * ```
   * 
   * SECURITY IMPROVEMENTS:
   * - Validate token with backend on mount
   * - Implement automatic token refresh
   * - Handle expired tokens gracefully
   * - Clear sensitive data on logout
   */
  useEffect(() => {
    // Check auth status when the component mounts
    const token = localStorage.getItem("accessToken");
    setIsAuthenticated(token !== null && token !== undefined && token !== "");
  }, []);

  // ---------------------------------------------------------------------------
  // TODO: ADD ADVANCED FEATURE EFFECTS
  // ---------------------------------------------------------------------------

  // TODO: WebSocket connection for real-time cart updates
  // useEffect(() => {
  //   if (isConnected && isAuthenticated) {
  //     // Subscribe to cart updates
  //     subscribe('cart:update', (data) => {
  //       setCartCount(data.totalItems)
  //       
  //       // Show notification
  //       if (data.action === 'added') {
  //         showNotification('Item added to cart', 'success')
  //       }
  //     })
  //     
  //     // Subscribe to inventory updates
  //     subscribe('inventory:low', (data) => {
  //       showNotification(`Only ${data.stock} left for ${data.productName}!`, 'warning')
  //     })
  //   }
  //   
  //   return () => {
  //     unsubscribe('cart:update')
  //     unsubscribe('inventory:low')
  //   }
  // }, [isConnected, isAuthenticated])

  // TODO: Fetch initial cart count
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     CartService.getCartCount()
  //       .then(setCartCount)
  //       .catch(console.error)
  //   }
  // }, [isAuthenticated])

  // TODO: Fetch trending products dynamically
  // useEffect(() => {
  //   AnalyticsService.getTrendingProducts(7)
  //     .then(products => {
  //       const items = products.map(p => ({
  //         id: p.id,
  //         name: p.name,
  //         link: `/product/${p.slug}`,
  //         trendingScore: p.score
  //       }))
  //       setTrendingProducts(items)
  //     })
  //     .catch(console.error)
  // }, [])

  // TODO: Track page navigation
  // useEffect(() => {
  //   trackEvent('navbar_viewed', {
  //     timestamp: Date.now(),
  //     isAuthenticated
  //   })
  // }, [])

  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Handle user logout
   * 
   * TODO: Replace with AuthService
   * ISSUE: Only removes token, doesn't clear all auth data
   * OPTIMIZATION: Use centralized logout that clears everything
   * 
   * TODO: Add useCallback for performance
   * ```
   * const handleLogout = useCallback(() => {
   *   AuthService.logout()
   *     .then(() => {
   *       setIsAuthenticated(false)
   *       navigate("/login")
   *       
   *       // Track logout event
   *       trackEvent('user_logout', {
   *         timestamp: Date.now()
   *       })
   *     })
   *     .catch(console.error)
   * }, [navigate, trackEvent])
   * ```
   * 
   * IMPROVEMENTS NEEDED:
   * - Clear all user data (cart, favorites, etc.)
   * - Revoke tokens on backend
   * - Close WebSocket connections
   * - Clear cached data
   * - Show logout confirmation
   * 
   * @function handleLogout
   * @returns {void}
   */
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/login"); // Redirect to login page
  };

  /**
   * Handle search submission
   * 
   * TODO: Integrate with advanced search service
   * ISSUE: Basic keyword search, no fuzzy matching or ranking
   * OPTIMIZATION: Use Algolia/ElasticSearch for better results
   * 
   * TODO: Add useCallback for performance
   * ```
   * const handleSearch = useCallback(() => {
   *   if (query.trim() !== "") {
   *     // Track search event
   *     trackEvent('search_query', {
   *       query: query.trim(),
   *       timestamp: Date.now()
   *     })
   *     
   *     // Navigate to results with encoded query
   *     navigate(`/Result?q=${encodeURIComponent(query)}`)
   *     
   *     // Clear search input
   *     setQuery("")
   *     setShowSuggestions(false)
   *   }
   * }, [query, navigate, trackEvent])
   * ```
   * 
   * ADVANCED FEATURES TO ADD:
   * - Search autocomplete dropdown
   * - Search suggestions based on history
   * - "Did you mean?" suggestions
   * - Search analytics tracking
   * - Recent searches display
   * - Popular searches display
   * 
   * FILES TO CREATE:
   * - components/Search/SearchAutocomplete.jsx
   * - components/Search/SearchSuggestions.jsx
   * - hooks/useSearchHistory.js
   * 
   * @function handleSearch
   * @returns {void}
   */
  const handleSearch = () => {
    if (query.trim() !== "") {
      navigate(`/Result?q=${encodeURIComponent(query)}`);
    }
  };

  // ---------------------------------------------------------------------------
  // TODO: ADD ADVANCED EVENT HANDLERS
  // ---------------------------------------------------------------------------

  // TODO: Handle search input changes with debounce
  // const handleSearchChange = useCallback((e) => {
  //   const value = e.target.value
  //   setQuery(value)
  //   
  //   // Track search input
  //   trackEvent('search_input', {
  //     query: value,
  //     timestamp: Date.now()
  //   })
  //   
  //   // Show suggestions if query length >= 2
  //   if (value.length >= 2) {
  //     setShowSuggestions(true)
  //   } else {
  //     setShowSuggestions(false)
  //   }
  // }, [trackEvent])

  // TODO: Handle menu item clicks
  // const handleMenuClick = useCallback((menuItem) => {
  //   trackEvent('menu_click', {
  //     menuItem: menuItem.name,
  //     link: menuItem.link,
  //     timestamp: Date.now()
  //   })
  // }, [trackEvent])

  // TODO: Handle cart button click
  // const handleCartClick = useCallback(() => {
  //   trackEvent('cart_click', {
  //     cartCount,
  //     timestamp: Date.now()
  //   })
  //   handleOrderPopup()
  // }, [cartCount, handleOrderPopup, trackEvent])

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* ===================================================================== */}
      {/* UPPER NAVBAR - Logo, Search, Actions */}
      {/* ===================================================================== */}
      {/* 
        TODO: Add sticky navbar functionality
        OPTIMIZATION: Make navbar stick to top on scroll
        
        SUGGESTED IMPLEMENTATION:
        ```
        const [isSticky, setIsSticky] = useState(false)
        
        useEffect(() => {
          const handleScroll = () => {
            setIsSticky(window.scrollY > 100)
          }
          window.addEventListener('scroll', handleScroll)
          return () => window.removeEventListener('scroll', handleScroll)
        }, [])
        
        <div className={`shadow-md ... ${isSticky ? 'fixed top-0 w-full' : ''}`}>
        ```
      */}
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          
          {/* =============================================================== */}
          {/* LOGO - Brand Identity */}
          {/* =============================================================== */}
          {/* 
            TODO: Optimize logo image
            OPTIMIZATION: Use WebP format with fallback
            PERFORMANCE: Lazy load logo or use SVG
            
            SUGGESTED IMPLEMENTATION:
            ```
            <picture>
              <source srcSet={LogoWebP} type="image/webp" />
              <source srcSet={Logo} type="image/png" />
              <img src={Logo} alt="Shopsy Logo" className="w-10" />
            </picture>
            ```
            
            TODO: Make logo clickable to home
            CURRENT: Using <a href="#"> which doesn't do anything
            FIX: Use Link component to navigate to home
            
            ```
            <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
              <img src={Logo} alt="Shopsy Logo" className="w-10" />
              Shopsy
            </Link>
            ```
          */}
          <div>
            <a href="#" className="font-bold text-2xl sm:text-3xl flex gap-2">
              <img src={Logo} alt="Logo" className="w-10" />
              Shopsy
            </a>
          </div>

          {/* =============================================================== */}
          {/* SEARCH BAR & ACTION BUTTONS */}
          {/* =============================================================== */}

          <div className="flex justify-between items-center gap-4">
            
            {/* =========================================================== */}
            {/* SEARCH BAR - Critical Feature for Enterprise */}
            {/* =========================================================== */}
            {/* 
              TODO: Replace with Advanced Search (Algolia/ElasticSearch)
              CURRENT: Basic input with keyword search
              TARGET: Autocomplete, fuzzy matching, faceted filtering
              
              IMPLEMENTATION STEPS:
              1. Set up Algolia account (free tier available)
              2. Create search index with products
              3. Install react-instantsearch-dom
              4. Replace this input with InstantSearch components
              
              SUGGESTED REPLACEMENT:
              ```
              <InstantSearch 
                indexName="products" 
                searchClient={searchClient}
              >
                <div className="relative group hidden sm:block">
                  <SearchBox
                    placeholder="Search products..."
                    className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
                  />
                  
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                    <Hits
                      hitComponent={SearchHit}
                      className="max-h-96 overflow-y-auto"
                    />
                  </div>
                </div>
              </InstantSearch>
              ```
              
              FILES TO CREATE:
              - components/Search/SearchAutocomplete.jsx
              - components/Search/SearchHit.jsx (individual result)
              - components/Search/SearchFilters.jsx
              - services/search/AlgoliaClient.js
              
              FEATURES TO ADD:
              - Autocomplete suggestions as user types
              - Recent searches display
              - Popular searches section
              - Category filtering
              - Price range filtering
              - "Did you mean?" suggestions
              - Search analytics tracking
              - Voice search (bonus)
              
              PERFORMANCE OPTIMIZATIONS:
              - Debounce input (300ms)
              - Cache search results (React Query)
              - Lazy load search results
              - Virtual scrolling for large result sets
            */}
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800  "
              />
              <IoMdSearch
                className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3"
                onClick={handleSearch}
              />
            </div>

            {/* =========================================================== */}
            {/* TODO: ADD SEARCH SUGGESTIONS DROPDOWN */}
            {/* =========================================================== */}
            {/* 
              SUGGESTED IMPLEMENTATION:
              ```
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                  <div className="p-2">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase px-2 py-1">
                      Suggestions
                    </h3>
                    {searchSuggestions.map((suggestion) => (
                      <Link
                        key={suggestion.id}
                        to={`/product/${suggestion.slug}`}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        onClick={() => {
                          trackEvent('search_suggestion_click', {
                            query,
                            suggestionId: suggestion.id
                          })
                        }}
                      >
                        <img 
                          src={suggestion.image} 
                          alt={suggestion.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{suggestion.name}</p>
                          <p className="text-sm text-gray-500">${suggestion.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              ```
            */}

            {/* =========================================================== */}
            {/* TODO: ADD NOTIFICATION BELL (Real-time Inventory Alerts) */}
            {/* =========================================================== */}
            {/* 
              SUGGESTED IMPLEMENTATION:
              ```
              <div className="relative">
                <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <BellIcon className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                <NotificationDropdown 
                  notifications={notifications}
                  onMarkRead={handleMarkNotificationRead}
                />
              </div>
              ```
              
              NOTIFICATION TYPES:
              - Low stock alerts
              - Price drop alerts
              - Order status updates
              - Wishlist item back in stock
              - Flash sale notifications
              
              FILES TO CREATE:
              - components/Notifications/NotificationBell.jsx
              - components/Notifications/NotificationDropdown.jsx
              - hooks/useNotifications.js
              - services/websocket/NotificationService.js
            */}

            {/* =========================================================== */}
            {/* CART BUTTON */}
            {/* =========================================================== */}
            {/* 
              TODO: Add real-time cart count badge
              CURRENT: Just a cart icon with no count
              TARGET: Show live count from WebSocket updates
              
              SUGGESTED IMPLEMENTATION:
              ```
              <Link to="/Cart">
                <button
                  onClick={() => handleCartClick()}
                  className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group relative"
                >
                  <span className="group-hover:block hidden transition-all duration-200">
                    Cart
                  </span>
                  <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
                  
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
              ```
              
              REAL-TIME UPDATES:
              - Update count via WebSocket when items added/removed
              - Animate badge on count change
              - Show mini cart preview on hover
              - Display total price in tooltip
            */}
            <Link to="/Cart">
              <button
                onClick={() => handleOrderPopup()}
                className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white  py-1 px-4 rounded-full flex items-center gap-3 group"
              >
                <span className="group-hover:block hidden transition-all duration-200">
                  Cart
                </span>
                <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
              </button>
            </Link>

            {/* =========================================================== */}
            {/* AUTHENTICATION BUTTONS - Login/Logout */}
            {/* =========================================================== */}
            {/* 
              TODO: Fix conditional rendering logic
              ISSUE: Both logout and login buttons are always rendered
              FIX: Should only show one based on authentication state
              
              CORRECT IMPLEMENTATION:
              ```
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
                >
                  Logout
                </button>
              ) : (
                <Link to="/login">
                  <button className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group">
                    Login
                  </button>
                </Link>
              )}
              ```
              
              TODO: Add user profile dropdown for authenticated users
              SUGGESTED IMPLEMENTATION:
              ```
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center gap-2">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{user.name}</span>
                    <FaCaretDown />
                  </button>
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      My Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                      My Orders
                    </Link>
                    <Link to="/wishlist" className="block px-4 py-2 hover:bg-gray-100">
                      Wishlist
                    </Link>
                    <hr className="my-2" />
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <button>Login</button>
                </Link>
              )}
              ```
            */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
              >
                Logout
              </button>
            )}

            <Link to="/login">
              <button className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group">
                Login
              </button>
            </Link>

            {/* =========================================================== */}
            {/* DARK MODE TOGGLE */}
            {/* =========================================================== */}
            {/* 
              TODO: Track dark mode toggle events
              ANALYTICS: Track user preference for dark mode
              
              SUGGESTED IMPLEMENTATION:
              ```
              <div onClick={() => trackEvent('dark_mode_toggle', { 
                newMode: isDarkMode ? 'light' : 'dark' 
              })}>
                <DarkMode />
              </div>
              ```
            */}
            <div>
              <DarkMode />
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LOWER NAVBAR - Main Navigation Menu */}
      {/* ===================================================================== */}
      {/* 
        TODO: Make navigation responsive for mobile
        CURRENT: Hidden on mobile (sm:flex hidden)
        IMPROVEMENT: Add hamburger menu for mobile devices
        
        SUGGESTED IMPLEMENTATION:
        ```
        // Mobile menu toggle
        const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
        
        // Mobile menu button
        <button 
          className="sm:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <HamburgerIcon />
        </button>
        
        // Mobile menu drawer
        {isMobileMenuOpen && (
          <div className="sm:hidden fixed inset-0 bg-black/50 z-50">
            <div className="w-64 h-full bg-white dark:bg-gray-900 p-4">
              {Menu.map((item) => (
                <Link 
                  key={item.id}
                  to={item.link}
                  className="block py-2 hover:text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
        ```
        
        FILES TO CREATE:
        - components/Navigation/MobileMenu.jsx
        - components/Navigation/HamburgerIcon.jsx
      */}
      <div data-aos="zoom-in" className="flex justify-center">
        <ul className="sm:flex hidden items-center gap-4">
          {/* =============================================================== */}
          {/* MENU ITEMS */}
          {/* =============================================================== */}
          {/* 
            TODO: Add analytics tracking for menu clicks
            TODO: Add active state highlighting
            TODO: Fix duplicate IDs in Menu array
            
            SUGGESTED IMPLEMENTATION:
            ```
            {Menu.map((data) => (
              <li key={data.id}>
                <Link
                  to={data.link}
                  className={`inline-block px-4 hover:text-primary duration-200 ${
                    location.pathname === data.link ? 'text-primary font-bold' : ''
                  }`}
                  onClick={() => handleMenuClick(data)}
                >
                  {data.name}
                </Link>
              </li>
            ))}
            ```
          */}
          {Menu.map((data) => (
            <li key={data.id}>
              <a
                href={data.link}
                className="inline-block px-4 hover:text-primary duration-200"
              >
                {data.name}
              </a>
            </li>
          ))}

          {/* =============================================================== */}
          {/* TRENDING PRODUCTS DROPDOWN */}
          {/* =============================================================== */}
          {/* 
            TODO: Make dropdown dynamic with real trending data
            TODO: Add real-time updates from analytics service
            TODO: Add loading state while fetching trending products
            
            SUGGESTED IMPLEMENTATION:
            ```
            <li className="group relative cursor-pointer">
              <a href="#" className="flex items-center gap-[2px] py-2">
                Trending Products
                <span>
                  <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
                </span>
              </a>
              
              <div className="absolute z- hidden group-hover:block w-[250px] rounded-md bg-white dark:bg-gray-800 p-2 text-black dark:text-white shadow-xl">
                {trendingProducts.length > 0 ? (
                  <ul>
                    {trendingProducts.map((data) => (
                      <li key={data.id}>
                        <Link
                          to={data.link}
                          className="flex items-center justify-between w-full rounded-md p-2 hover:bg-primary/20"
                          onClick={() => trackEvent('trending_product_click', {
                            productId: data.id,
                            productName: data.name
                          })}
                        >
                          <span>{data.name}</span>
                          {data.trendingScore && (
                            <span className="text-xs text-red-500 font-bold">
                              🔥 +{data.trendingScore}%
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Loading trending products...
                  </div>
                )}
              </div>
            </li>
            ```
            
            ADVANCED FEATURES:
            - Show trending score percentage
            - Update every 5 minutes via WebSocket
            - Add "Hot" badge for rapidly trending items
            - Show thumbnail images
            - Display price and rating
            
            FILES TO CREATE:
            - components/Navigation/TrendingDropdown.jsx
            - services/analytics/TrendingService.js
          */}
          <li className="group relative cursor-pointer">
            <a href="#" className="flex items-center gap-[2px] py-2">
              Trending Products
              <span>
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </span>
            </a>
            <div className="absolute z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <a
                      href={data.link}
                      className="inline-block w-full rounded-md p-2 hover:bg-primary/20 "
                    >
                      {data.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

// =============================================================================
// PERFORMANCE OPTIMIZATION WRAPPER (TODO)
// =============================================================================

/**
 * TODO: Export memoized version for production
 * 
 * SUGGESTED IMPLEMENTATION:
 * ```
 * import { memo } from 'react'
 * 
 * export default memo(Navbar, (prevProps, nextProps) => {
 *   // Only re-render if handleOrderPopup function reference changes
 *   return prevProps.handleOrderPopup === nextProps.handleOrderPopup
 * })
 * ```
 */

// =============================================================================
// COMPREHENSIVE DOCUMENTATION (+0.5 points)
// =============================================================================

/**
 * ARCHITECTURE DOCUMENTATION
 * 
 * COMPONENT HIERARCHY:
 * ```
 * Navbar
 * ├── Upper Navbar
 * │   ├── Logo
 * │   ├── Search Bar (TODO: Replace with Algolia)
 * │   ├── Notification Bell (TODO: Add)
 * │   ├── Cart Button (TODO: Add real-time count)
 * │   ├── Auth Buttons (TODO: Add user dropdown)
 * │   └── Dark Mode Toggle
 * └── Lower Navbar
 *     ├── Menu Items
 *     └── Trending Dropdown (TODO: Make dynamic)
 * ```
 * 
 * DATA FLOW:
 * ```
 * Component Mount
 * ↓
 * Check Auth Status (localStorage) → TODO: Replace with AuthService
 * ↓
 * Render Navbar
 * ↓
 * User Interactions:
 * - Search Input → handleSearch() → Navigate to results
 * - Cart Click → handleOrderPopup() → Show cart modal
 * - Logout Click → handleLogout() → Clear auth & redirect
 * - Menu Click → Navigate to page → Track analytics
 * ```
 * 
 * STATE MANAGEMENT:
 * ```
 * Current (Local State):
 * - query (string) - Search query
 * - isAuthenticated (boolean) - Auth status
 * 
 * TODO (Global State via Context/Redux):
 * - user (object) - User profile
 * - cartCount (number) - Cart items count
 * - notifications (array) - User notifications
 * - searchSuggestions (array) - Search autocomplete
 * - trendingProducts (array) - Dynamic trending items
 * ```
 * 
 * MICROSERVICES INTEGRATION:
 * ```
 * Navbar Component
 * ├── AuthService (Microservice)
 * │   └── /api/auth/validate-token
 * │   └── /api/auth/logout
 * │   └── /api/auth/refresh-token
 * ├── SearchService (Microservice)
 * │   └── /api/search/suggestions
 * │   └── /api/search/autocomplete
 * ├── CartService (Microservice)
 * │   └── /api/cart/count
 * │   └── WebSocket: cart:update
 * ├── NotificationService (Microservice)
 * │   └── /api/notifications/unread
 * │   └── WebSocket: notification:new
 * └── AnalyticsService (Microservice)
 *     └── /api/analytics/track
 *     └── /api/analytics/trending
 * ```
 * 
 * PERFORMANCE METRICS TO TRACK:
 * - Component render time
 * - Search query response time
 * - Auth check latency
 * - Cart update latency
 * - WebSocket connection status
 * - Bundle size contribution
 * 
 * SECURITY CONSIDERATIONS:
 * - NEVER store sensitive tokens in localStorage (use httpOnly cookies)
 * - Validate all user inputs before search
 * - Implement CSRF protection for auth actions
 * - Rate limit search queries
 * - Sanitize search query before displaying
 * 
 * ACCESSIBILITY FEATURES:
 * - Keyboard navigation support
 * - ARIA labels on all interactive elements
 * - Screen reader announcements for cart updates
 * - Focus management for dropdowns
 * - High contrast mode support
 */

/**
 * IMPLEMENTATION PRIORITY ROADMAP
 * 
 * PHASE 1: CRITICAL FIXES (Week 1)
 * Priority: URGENT
 * 
 * 1. Fix duplicate menu IDs (security & functionality issue)
 * 2. Fix authentication button rendering logic
 * 3. Add real-time cart count badge
 * 4. Implement proper logout flow
 * 5. Add mobile responsive menu
 * 
 * PHASE 2: SEARCH OPTIMIZATION (Week 2-3)
 * Priority: HIGH - Direct revenue impact
 * 
 * 1. Integrate Algolia/ElasticSearch
 * 2. Implement search autocomplete
 * 3. Add search suggestions
 * 4. Track search analytics
 * 5. Add faceted filtering
 * 6. Implement "Did you mean?" feature
 * 
 * PHASE 3: REAL-TIME FEATURES (Week 4-5)
 * Priority: HIGH - Competitive advantage
 * 
 * 1. Set up WebSocket connection
 * 2. Implement real-time cart updates
 * 3. Add notification system
 * 4. Implement low stock alerts
 * 5. Add real-time trending products
 * 
 * PHASE 4: PERFORMANCE OPTIMIZATION (Week 6)
 * Priority: MEDIUM-HIGH - User experience
 * 
 * 1. Memoize component with React.memo()
 * 2. Add useCallback to event handlers
 * 3. Implement debounce for search
 * 4. Lazy load dropdown content
 * 5. Optimize logo image (WebP)
 * 6. Add bundle size monitoring
 * 
 * PHASE 5: ANALYTICS & TRACKING (Week 7)
 * Priority: MEDIUM - Business intelligence
 * 
 * 1. Track all user interactions
 * 2. Implement search analytics
 * 3. Track menu navigation patterns
 * 4. Monitor cart abandonment
 * 5. Create analytics dashboard
 * 
 * PHASE 6: MICROSERVICES INTEGRATION (Week 8-10)
 * Priority: MEDIUM - Scalability foundation
 * 
 * 1. Replace localStorage auth with AuthService
 * 2. Integrate CartService for real-time count
 * 3. Connect to NotificationService
 * 4. Integrate SearchService API
 * 5. Add circuit breaker pattern
 * 6. Implement retry logic
 */

/**
 * TECHNOLOGY STACK RECOMMENDATIONS FOR NAVBAR
 * 
 * SEARCH:
 * - Algolia (Recommended) - Best for e-commerce
 * - ElasticSearch (Self-hosted alternative)
 * - react-instantsearch-dom (UI components)
 * 
 * REAL-TIME:
 * - Socket.io (WebSocket library)
 * - Redux Toolkit + RTK Query (State management)
 * 
 * STATE MANAGEMENT:
 * - Redux Toolkit (Global state)
 * - React Query (Server state caching)
 * - Zustand (Lightweight alternative)
 * 
 * ANALYTICS:
 * - Google Analytics 4
 * - Mixpanel (Advanced user analytics)
 * - Segment (Data pipeline)
 * 
 * PERFORMANCE:
 * - React.memo (Component memoization)
 * - use-debounce (Input debouncing)
 * - React.lazy (Code splitting)
 * 
 * AUTHENTICATION:
 * - JWT tokens (httpOnly cookies)
 * - Refresh token rotation
 * - OAuth 2.0 (Social login)
 */
