import { renderHook, waitFor, act } from '@testing-library/react';
import { useInventoryWebSocket } from '../hooks/useInventoryWebSocket';

describe('useInventoryWebSocket', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  it('should initialize with disconnected state', () => {
    const { result } = renderHook(() => useInventoryWebSocket());

    expect(result.current.isConnected).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle SSE connection', async () => {
    const mockEventSource = {
      onopen: null,
      onmessage: null,
      onerror: null,
      close: jest.fn(),
    };

    global.EventSource = jest.fn(() => mockEventSource);

    const { result } = renderHook(() => useInventoryWebSocket('prod-1'));

    await act(async () => {
      // Simulate SSE connection
      if (mockEventSource.onopen) {
        mockEventSource.onopen();
      }
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });

  it('should fall back to polling on SSE error', async () => {
    const mockEventSource = {
      onopen: null,
      onmessage: null,
      onerror: null,
      close: jest.fn(),
    };

    global.EventSource = jest.fn(() => mockEventSource);
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ events: [] }),
    });

    const { result } = renderHook(() => useInventoryWebSocket('prod-1', true));

    await act(async () => {
      // Simulate SSE error
      if (mockEventSource.onerror) {
        mockEventSource.onerror();
      }
    });

    // Wait for fallback to polling
    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });
  });

  it('should parse and handle inventory events', async () => {
    const mockEventSource = {
      onopen: null,
      onmessage: null,
      onerror: null,
      close: jest.fn(),
    };

    global.EventSource = jest.fn(() => mockEventSource);

    const { result } = renderHook(() => useInventoryWebSocket());

    const testEvent = {
      data: JSON.stringify({
        event_type: 'stock_updated',
        new_quantity: 5,
        product_name: 'Test Product',
      }),
    };

    await act(async () => {
      if (mockEventSource.onopen) {
        mockEventSource.onopen();
      }
      if (mockEventSource.onmessage) {
        mockEventSource.onmessage(testEvent);
      }
    });

    await waitFor(() => {
      expect(result.current.inventory).toBeDefined();
    });
  });

  it('should disconnect on cleanup', async () => {
    const mockEventSource = {
      onopen: null,
      onmessage: null,
      onerror: null,
      close: jest.fn(),
    };

    global.EventSource = jest.fn(() => mockEventSource);

    const { unmount } = renderHook(() => useInventoryWebSocket());

    unmount();

    await waitFor(() => {
      expect(mockEventSource.close).toHaveBeenCalled();
    });
  });
});
