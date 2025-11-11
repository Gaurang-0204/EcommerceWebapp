import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';

/**
 * InventoryContext - Manages real-time inventory state globally
 * 
 * Provides:
 * - Real-time inventory updates
 * - Out of stock alerts
 * - Low stock warnings
 * - Connection status
 */

const InventoryContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  // State management
  const [inventoryData, setInventoryData] = useState({});
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lowStockAlerts, setLowStockAlerts] = useState({});
  const [outOfStockItems, setOutOfStockItems] = useState(new Set());
  const [eventQueue, setEventQueue] = useState([]);

  // =========================================================================
  // REAL-TIME INVENTORY UPDATES
  // =========================================================================

  /**
   * Subscribe to real-time inventory updates via SSE
   * Falls back to polling if SSE is not supported
   */
  const subscribeToInventory = useCallback((productId = null, usePolling = false) => {
    const baseUrl = import.meta.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

    if (usePolling) {
      // Polling fallback
      console.log('🔄 [INVENTORY] Using polling fallback (SSE not supported)');
      return subscribeWithPolling(productId, baseUrl);
    }

    // Try SSE first
    try {
      const eventSourceUrl = productId
        ? `${baseUrl}/api/v1/events/inventory/?product_id=${productId}`
        : `${baseUrl}/api/v1/events/inventory/`;

      const eventSource = new EventSource(eventSourceUrl);

      eventSource.onopen = () => {
        console.log('✅ [INVENTORY] SSE connection established');
        setConnectionStatus('connected');
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleInventoryEvent(data);
        } catch (error) {
          console.error('❌ [INVENTORY] Failed to parse event:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ [INVENTORY] SSE error:', error);
        setConnectionStatus('error');
        eventSource.close();

        // Fallback to polling
        if (error.type === 'error') {
          console.log('⚠️ [INVENTORY] SSE failed, switching to polling');
          setTimeout(() => subscribeToInventory(productId, true), 3000);
        }
      };

      return eventSource;
    } catch (error) {
      console.error('❌ [INVENTORY] EventSource not supported, using polling:', error);
      return subscribeWithPolling(productId, baseUrl);
    }
  }, []);

  /**
   * Polling fallback when SSE is not available
   */
  const subscribeWithPolling = (productId, baseUrl) => {
    console.log('📡 [INVENTORY] Starting polling subscription');
    setConnectionStatus('polling');

    const pollInterval = setInterval(async () => {
      try {
        const since = new Date(Date.now() - 5000).toISOString(); // Last 5 seconds
        const url = new URL(`${baseUrl}/api/v1/polling/inventory/changes/`);
        url.searchParams.append('since', since);
        if (productId) {
          url.searchParams.append('product_id', productId);
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (data.events && data.events.length > 0) {
          data.events.forEach(handleInventoryEvent);
        }
      } catch (error) {
        console.error('❌ [INVENTORY] Polling error:', error);
      }
    }, 2000); // Poll every 2 seconds

    // Return cleanup function
    return { close: () => clearInterval(pollInterval) };
  };

  /**
   * Handle inventory event data
   */
  const handleInventoryEvent = (event) => {
    if (event.type === 'connection') {
      setConnectionStatus('connected');
      return;
    }

    const { id, product_name, event_type, new_quantity, previous_quantity } = event;

    // Update inventory data
    setInventoryData((prev) => ({
      ...prev,
      [product_name]: {
        ...prev[product_name],
        quantity: new_quantity,
        last_updated: new Date(),
        event_type,
      },
    }));

    // Handle specific event types
    switch (event_type) {
      case 'out_of_stock':
        setOutOfStockItems((prev) => new Set([...prev, product_name]));
        addEvent({
          type: 'alert',
          severity: 'error',
          message: `${product_name} is now out of stock`,
          timestamp: new Date(),
        });
        break;

      case 'back_in_stock':
        setOutOfStockItems((prev) => {
          const next = new Set(prev);
          next.delete(product_name);
          return next;
        });
        addEvent({
          type: 'notification',
          severity: 'success',
          message: `${product_name} is back in stock!`,
          timestamp: new Date(),
        });
        break;

      case 'low_stock_warning':
        setLowStockAlerts((prev) => ({
          ...prev,
          [product_name]: new_quantity,
        }));
        addEvent({
          type: 'warning',
          severity: 'warning',
          message: `Low stock warning: ${product_name} (${new_quantity} left)`,
          timestamp: new Date(),
        });
        break;

      case 'stock_updated':
        addEvent({
          type: 'info',
          severity: 'info',
          message: `${product_name} stock updated: ${new_quantity} available`,
          timestamp: new Date(),
        });
        break;
    }
  };

  /**
   * Add event to queue
   */
  const addEvent = (event) => {
    setEventQueue((prev) => [...prev, { ...event, id: Date.now() }].slice(-50)); // Keep last 50
  };

  /**
   * Check if product is out of stock
   */
  const isOutOfStock = (productId) => {
    return outOfStockItems.has(productId);
  };

  /**
   * Check if product is low on stock
   */
  const isLowStock = (productId) => {
    return productId in lowStockAlerts;
  };

  /**
   * Get inventory status
   */
  const getInventoryStatus = (productId) => {
    if (isOutOfStock(productId)) return 'out_of_stock';
    if (isLowStock(productId)) return 'low_stock';
    return 'in_stock';
  };

  // =========================================================================
  // CLEANUP
  // =========================================================================

  useEffect(() => {
    const connection = subscribeToInventory();

    return () => {
      if (connection && connection.close) {
        connection.close();
      }
    };
  }, [subscribeToInventory]);

  const value = {
    // State
    inventoryData,
    connectionStatus,
    lowStockAlerts,
    outOfStockItems,
    eventQueue,

    // Methods
    subscribeToInventory,
    isOutOfStock,
    isLowStock,
    getInventoryStatus,
    addEvent,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

/**
 * Hook to use Inventory Context
 */
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};
