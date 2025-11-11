import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook: useInventoryWebSocket
 * 
 * Manages real-time inventory updates via SSE
 * 
 * @param {string} productId - Product ID to subscribe to (optional, null = all products)
 * @param {boolean} enablePolling - Enable polling fallback
 * @returns {Object} Inventory state and methods
 */
export const useInventoryWebSocket = (productId = null, enablePolling = false) => {
  const [inventory, setInventory] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const eventSourceRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  const baseUrl = import.meta.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  // Connect via SSE
  const connectSSE = useCallback(() => {
    try {
      const url = productId
        ? `${baseUrl}/api/v1/events/inventory/?product_id=${productId}`
        : `${baseUrl}/api/v1/events/inventory/`;

      const eventSource = new EventSource(url);

      eventSource.onopen = () => {
        console.log('✅ [SSE] Connected');
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setInventory(data);
          setLastUpdate(new Date());
        } catch (err) {
          console.error('Failed to parse event:', err);
        }
      };

      eventSource.onerror = () => {
        console.error('❌ [SSE] Connection error');
        setIsConnected(false);
        eventSource.close();

        if (enablePolling) {
          console.log('Switching to polling...');
          connectPolling();
        }
      };

      eventSourceRef.current = eventSource;
      return eventSource;
    } catch (err) {
      console.error('SSE not supported:', err);
      if (enablePolling) {
        connectPolling();
      }
      return null;
    }
  }, [productId, baseUrl, enablePolling]);

  // Connect via polling
  const connectPolling = useCallback(() => {
    console.log('📡 [POLLING] Starting polling');
    setIsConnected(true);

    const poll = async () => {
      try {
        const since = new Date(Date.now() - 5000).toISOString();
        const url = new URL(`${baseUrl}/api/v1/inventory/changes/`);
        url.searchParams.append('since', since);
        if (productId) {
          url.searchParams.append('product_id', productId);
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (data.events?.length > 0) {
          setInventory(data.events[data.events.length - 1]);
          setLastUpdate(new Date());
        }
        setError(null);
      } catch (err) {
        console.error('Polling error:', err);
        setError(err.message);
      }
    };

    pollingIntervalRef.current = setInterval(poll, 2000);
  }, [productId, baseUrl]);

  // Disconnect
  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsConnected(false);
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connectSSE();
    return disconnect;
  }, [connectSSE, disconnect]);

  return {
    inventory,
    isConnected,
    error,
    lastUpdate,
    disconnect,
    reconnect: connectSSE,
  };
};

/**
 * Hook: useInventoryPoll
 * 
 * Poll inventory status at intervals (simpler alternative to SSE)
 * 
 * @param {string} productId - Product ID
 * @param {number} interval - Poll interval in ms
 * @returns {Object} Inventory state
 */
export const useInventoryPoll = (productId, interval = 5000) => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/api/v1/products/${productId}/inventory/`
      );
      if (!response.ok) throw new Error('Failed to fetch inventory');

      const data = await response.json();
      setInventory(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Inventory fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [productId, baseUrl]);

  useEffect(() => {
    fetchInventory();
    const timer = setInterval(fetchInventory, interval);
    return () => clearInterval(timer);
  }, [fetchInventory, interval]);

  return { inventory, loading, error, refetch: fetchInventory };
};
