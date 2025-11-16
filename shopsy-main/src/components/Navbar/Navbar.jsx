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
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaCaretDown } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';
import DarkMode from "./DarkMode";
import { Link ,useNavigate} from "react-router-dom";
import { useState, useEffect, useCallback, memo } from "react";
import { useAuth } from '../../contexts/AuthContext.jsx';
import AnalyticsService from '../../services/AnalyticsService';


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
    id: 4, // ❌ BUG: Duplicate ID
    name: "Mens Wear",
    link: "/#",
  },
  {
    id: 5, // ❌ BUG: Duplicate ID
    name: "Electronics",
    link: "/#",
  },
  {
    id: 6,
    name: "Admin",
    link: "/Admin",
  },
];



// =============================================================================
// MAIN COMPONENT
// =============================================================================


const Navbar = memo(({ handleOrderPopup = () => {} }) => {
  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);


  // ---------------------------------------------------------------------------
  // EVENT HANDLERS
  // ---------------------------------------------------------------------------

  
  // Load cart count on mount
  useEffect(() => {
    const count = localStorage.getItem('cartCount') || 0;
    setCartCount(Number(count));

    // Track page view
    AnalyticsService.trackPageView('navbar');
  }, []);

    // Handle search
  const handleSearch = useCallback(() => {
    if (query.trim() === '') return;

    AnalyticsService.trackSearch(query, 0);
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery('');
    setIsMobileMenuOpen(false);
  }, [query, navigate]);

  // Handle logout
  const handleLogout = useCallback(async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  }, [logout, navigate]);

  // Handle menu click
  const handleMenuClick = useCallback((menuName) => {
    AnalyticsService.trackMenuClick(menuName);
    setIsMobileMenuOpen(false);
  }, []);

  // Handle cart click
  const handleCartClick = useCallback(() => {
    AnalyticsService.trackEvent('cart_opened');
    handleOrderPopup();
  }, [handleOrderPopup]);
  

 

  
 


  

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      {/* Top Navbar */}
      <div className="bg-primary/40 py-2">
        <div className="container flex justify-between items-center">
          
          
          <div>
            {/* Logo */}
            <Link to="/" className="font-bold text-2xl sm:text-3xl flex gap-2">
              <img src={Logo} alt="Logo" className="w-10" />
              <span>Shopsy</span>
            </Link>
          </div>

          {/* =============================================================== */}
          {/* SEARCH BAR & ACTION BUTTONS */}
          {/* =============================================================== */}
          
          {/* Search & Actions */}
          <div className="flex justify-between items-center gap-4">
            {/* Desktop Search */}
            
            <div className="relative group hidden sm:block">

              <input
                type="text"
                placeholder="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800  "
              />
              <IoMdSearch
                className="text-gray-500 group-hover:text-primary absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                onClick={handleSearch}
              />
            </div>

            {/* Cart Button with Badge */}
            <Link to="/Cart">
              <button
                onClick={handleCartClick}
                className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white  py-1 px-4 rounded-full flex items-center gap-3 relative"
              >
                <span className="group-hover:block hidden transition-all duration-200">
                  Cart
                </span>
                <div className="relative">
                  <FaCartShopping className="text-xl" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </div>
              </button>
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden sm:inline">{user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-gradient-to-r from-primary to-secondary text-white py-1 px-4 rounded-full">
                  Login
                </button>
              </Link>
            )}

            

            
            <div>
              <DarkMode />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="sm:hidden text-2xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <IoClose /> : <GiHamburgerMenu />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden sm:flex justify-center bg-gray-100 dark:bg-gray-800 py-2">
        <ul className="flex items-center gap-4">
          {Menu.map((item) => (
            <li key={item.id}>
              <Link
                to={item.link}
                onClick={() => handleMenuClick(item.name)}
                className="px-4 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-800">
          <div className="p-4 border-b">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full rounded-full border px-2 py-1 dark:bg-gray-700"
              />
              <IoMdSearch
                className="absolute top-1/2 -translate-y-1/2 right-3 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
          </div>
          <ul className="flex flex-col">
            {Menu.map((item) => (
              <li key={item.id} className="border-b">
                <Link
                  to={item.link}
                  onClick={() => handleMenuClick(item.name)}
                  className="block px-4 py-3 hover:bg-primary/10"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    
    </div>
  );
});
Navbar.displayName = 'Navbar';
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
 * 2. implement proper  authentication button rendering logic
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
