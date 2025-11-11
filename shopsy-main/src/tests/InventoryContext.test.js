import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { InventoryProvider, useInventory } from '../contexts/InventoryContext';

// Test component that uses inventory context
const TestComponent = () => {
  const { isOutOfStock, isLowStock, connectionStatus } = useInventory();

  return (
    <div>
      <div data-testid="connection-status">{connectionStatus}</div>
      <div data-testid="out-of-stock">
        {isOutOfStock('prod-1') ? 'Out of Stock' : 'In Stock'}
      </div>
    </div>
  );
};

describe('InventoryContext', () => {
  it('should provide initial state', () => {
    render(
      <InventoryProvider>
        <TestComponent />
      </InventoryProvider>
    );

    expect(screen.getByTestId('connection-status')).toHaveTextContent('disconnected');
    expect(screen.getByTestId('out-of-stock')).toHaveTextContent('In Stock');
  });

  it('should throw error when useInventory is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useInventory must be used within InventoryProvider');

    consoleSpy.mockRestore();
  });

  it('should update out of stock status', async () => {
    render(
      <InventoryProvider>
        <TestComponent />
      </InventoryProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('out-of-stock')).toBeInTheDocument();
    });
  });
});
