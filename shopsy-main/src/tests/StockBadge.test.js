import React from 'react';
import { render, screen } from '@testing-library/react';
import { InventoryProvider } from '../contexts/InventoryContext';
import { StockBadge, OutOfStockOverlay, LowStockWarning } from '../components/Inventory/StockBadge';

// Mock the useInventory hook
jest.mock('../contexts/InventoryContext', () => ({
  ...jest.requireActual('../contexts/InventoryContext'),
  useInventory: jest.fn(),
}));

import { useInventory } from '../contexts/InventoryContext';

describe('StockBadge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display in stock badge', () => {
    useInventory.mockReturnValue({
      getInventoryStatus: jest.fn(() => 'in_stock'),
      outOfStockItems: new Set(),
      lowStockAlerts: {},
      inventoryData: {},
    });

    render(<StockBadge productId="1" productName="Product" />);

    expect(screen.getByText('In Stock')).toBeInTheDocument();
    expect(screen.getByText('✅')).toBeInTheDocument();
  });

  it('should display low stock badge', () => {
    useInventory.mockReturnValue({
      getInventoryStatus: jest.fn(() => 'low_stock'),
      outOfStockItems: new Set(),
      lowStockAlerts: { Product: 5 },
      inventoryData: { Product: { quantity: 5 } },
    });

    render(<StockBadge productId="1" productName="Product" />);

    expect(screen.getByText('Low Stock')).toBeInTheDocument();
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });

  it('should display out of stock badge', () => {
    useInventory.mockReturnValue({
      getInventoryStatus: jest.fn(() => 'out_of_stock'),
      outOfStockItems: new Set(['Product']),
      lowStockAlerts: {},
      inventoryData: { Product: { quantity: 0 } },
    });

    render(<StockBadge productId="1" productName="Product" />);

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('❌')).toBeInTheDocument();
  });
});

describe('OutOfStockOverlay', () => {
  it('should show overlay when out of stock', () => {
    render(
      <OutOfStockOverlay isOutOfStock={true}>
        <div>Product Card</div>
      </OutOfStockOverlay>
    );

    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    expect(screen.getByText('Product Card')).toBeInTheDocument();
  });

  it('should not show overlay when in stock', () => {
    render(
      <OutOfStockOverlay isOutOfStock={false}>
        <div>Product Card</div>
      </OutOfStockOverlay>
    );

    expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument();
    expect(screen.getByText('Product Card')).toBeInTheDocument();
  });
});

describe('LowStockWarning', () => {
  it('should display warning when low stock', () => {
    render(<LowStockWarning isLowStock={true} quantity={3} />);

    expect(screen.getByText('Low Stock Warning')).toBeInTheDocument();
    expect(screen.getByText(/Only 3 item/)).toBeInTheDocument();
  });

  it('should not display warning when in stock', () => {
    render(<LowStockWarning isLowStock={false} quantity={10} />);

    expect(screen.queryByText('Low Stock Warning')).not.toBeInTheDocument();
  });
});
