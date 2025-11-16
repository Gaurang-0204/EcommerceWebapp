/**
 * Analytics Service
 * Tracks user interactions and events using SSE and polling
 */

const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const ANALYTICS_ENABLED = import.meta.env.REACT_APP_ANALYTICS_ENABLED !== 'false';

class AnalyticsService {
  constructor() {
    this.eventQueue = [];
    this.isOnline = navigator.onLine;
    this.sseConnection = null;
    this.flushInterval = 30000; // 30 seconds
    this.sessionId = this.generateSessionId();

    // Setup online/offline listeners
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Start event flushing
    this.startEventFlushing();
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Handle going online
   */
  handleOnline() {
    this.isOnline = true;
    console.log('✅ Online - flushing queued events');
    this.flushEvents();
  }

  /**
   * Handle going offline
   */
  handleOffline() {
    this.isOnline = false;
    console.log('❌ Offline - queuing events');
  }

  /**
   * Track event
   */
  trackEvent(eventType, eventData = {}) {
    if (!ANALYTICS_ENABLED) return;

    const event = {
      event_type: eventType,
      event_data: {
        ...eventData,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
    };

    this.eventQueue.push(event);

    // Flush if queue is large
    if (this.eventQueue.length >= 10) {
      this.flushEvents();
    }
  }

/**
 * Flush events to server
 */
async flushEvents() {
  if (this.eventQueue.length === 0 || !this.isOnline) {
    return;
  }

  const eventsToSend = [...this.eventQueue];
  this.eventQueue = [];

  try {
    // ✅ FIX: Send each event individually
    for (const event of eventsToSend) {
      const token = localStorage.getItem('accessToken');
      
      const headers = {
        'Content-Type': 'application/json',
      };
      
      // Only add Authorization if token exists
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/analytics/track/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(event),  // ✅ Send individual event object
      });

      if (!response.ok) {
        console.error('Failed to track event:', event.event_type);
        // Re-queue failed event
        this.eventQueue.push(event);
      } else {
        console.log('✅ Event tracked:', event.event_type);
      }
    }
  } catch (error) {
    console.error('Error flushing events:', error);
    // Re-queue all events
    this.eventQueue = eventsToSend.concat(this.eventQueue);
  }
}


  /**
   * Start periodic event flushing
   */
  startEventFlushing() {
    setInterval(() => {
      if (this.isOnline && this.eventQueue.length > 0) {
        this.flushEvents();
      }
    }, this.flushInterval);
  }

  /**
   * Track page view
   */
  trackPageView(pageName) {
    this.trackEvent('page_view', {
      page: pageName,
    });
  }

  /**
   * Track search
   */
  trackSearch(query, resultCount) {
    this.trackEvent('search_query', {
      query,
      resultCount,
    });
  }

  /**
   * Track product view
   */
  trackProductView(productId, productName) {
    this.trackEvent('product_view', {
      productId,
      productName,
    });
  }

  /**
   * Track menu click
   */
  trackMenuClick(menuItem) {
    this.trackEvent('menu_click', {
      menuItem,
    });
  }

  /**
   * Track add to cart
   */
  trackAddToCart(productId, quantity, price) {
    this.trackEvent('add_to_cart', {
      productId,
      quantity,
      price,
    });
  }

  /**
   * Track cart abandonment
   */
  trackCartAbandonment(cartValue, itemsCount) {
    this.trackEvent('cart_abandonment', {
      cartValue,
      itemsCount,
    });
  }

  /**
   * Connect to SSE stream for real-time analytics
   */
  connectToSSE() {
    if (this.sseConnection) {
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      this.sseConnection = new EventSource(
        `${API_BASE_URL}/api/analytics/stream/`
      );

      this.sseConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📊 Real-time analytics:', data);
          // Dispatch custom event for components to listen to
          window.dispatchEvent(
            new CustomEvent('analyticsUpdate', { detail: data })
          );
        } catch (error) {
          console.error('SSE parse error:', error);
        }
      };

      this.sseConnection.onerror = () => {
        console.error('SSE connection error');
        this.sseConnection.close();
        this.sseConnection = null;
      };
    } catch (error) {
      console.error('SSE connection failed:', error);
    }
  }

  /**
   * Disconnect SSE
   */
  disconnectSSE() {
    if (this.sseConnection) {
      this.sseConnection.close();
      this.sseConnection = null;
    }
  }

  /**
   * Get analytics dashboard
   */
  async getDashboard() {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/api/analytics/dashboard/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to load dashboard');

      return await response.json();
    } catch (error) {
      console.error('Dashboard error:', error);
      return null;
    }
  }
}

export default new AnalyticsService();
