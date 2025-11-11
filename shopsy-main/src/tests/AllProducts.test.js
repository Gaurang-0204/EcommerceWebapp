import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import AllProducts from '../components/Products/AllProducts';
import { InventoryProvider } from '../contexts/InventoryContext';

// Mock hooks
jest.mock('../hooks/useProducts', () => ({
  useProducts: jest.fn(),
}));

jest.mock('../contexts/InventoryContext', () => ({
  ...jest.requireActual('../contexts/InventoryContext'),
  useInventory: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

import { useProducts } from '../hooks/useProducts';
import { useInventory } from '../contexts/InventoryContext';
import { useNavigate } from 'react-router-dom';

const queryClient = new QueryClient();

const renderWithProviders = (component) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <InventoryProvider>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </InventoryProvider>
    </QueryClientProvider>
  );
};

describe('AllProducts Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(jest.fn());
  });

  it('should display loading skeleton initially', () => {
    useProducts.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    });

    useInventory.mockReturnValue({
      isOutOfStock: jest.fn(() => false),
      isLowStock: jest.fn(() => false),
      connectionStatus: 'connected',
      lowStockAlerts: {},
    });

    renderWithProviders(<AllProducts />);

    // Should show skeleton
    expect(screen.getByTestId('products-skeleton')).toBeInTheDocument();
  });

  it('should display error state', () => {
    useProducts.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: 'Network error' },
      refetch: jest.fn(),
      isFetching: false,
    });

    useInventory.mockReturnValue({
      isOutOfStock: jest.fn(() => false),
      isLowStock: jest.fn(() => false),
      connectionStatus: 'connected',
      lowStockAlerts: {},
    });

    renderWithProviders(<AllProducts />);

    expect(screen.getByText('Products Load Failed')).toBeInTheDocument();
  });

  it('should display products grid', async () => {
    useProducts.mockReturnValue({
      data: {
        products: [
          {
            id: '1',
            name: 'Product 1',
            price: 99.99,
            color: 'Red',
            image: '/image1.jpg',
          },
          {
            id: '2',
            name: 'Product 2',
            price: 49.99,
            color: 'Blue',
            image: '/image2.jpg',
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    });

    useInventory.mockReturnValue({
      isOutOfStock: jest.fn((id) => id === '2'),
      isLowStock: jest.fn(() => false),
      connectionStatus: 'connected',
      lowStockAlerts: {},
      inventoryData: {},
    });

    renderWithProviders(<AllProducts />);

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });
  });

  it('should show out of stock overlay', async () => {
    useProducts.mockReturnValue({
      data: {
        products: [
          {
            id: '1',
            name: 'Out of Stock Product',
            price: 99.99,
            color: 'Red',
            image: '/image.jpg',
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    });

    useInventory.mockReturnValue({
      isOutOfStock: jest.fn(() => true),
      isLowStock: jest.fn(() => false),
      connectionStatus: 'connected',
      lowStockAlerts: {},
      inventoryData: {},
    });

    renderWithProviders(<AllProducts />);

    await waitFor(() => {
      expect(screen.getByText('Out of Stock')).toBeInTheDocument();
    });
  });

  it('should disable add to cart for out of stock items', async () => {
    useProducts.mockReturnValue({
      data: {
        products: [
          {
            id: '1',
            name: 'Product',
            price: 99.99,
            color: 'Red',
            image: '/image.jpg',
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: jest.fn(),
      isFetching: false,
    });

    useInventory.mockReturnValue({
      isOutOfStock: jest.fn(() => true),
      isLowStock: jest.fn(() => false),
      connectionStatus: 'connected',
      lowStockAlerts: {},
      inventoryData: {},
    });

    renderWithProviders(<AllProducts />);

    await waitFor(() => {
      const addToCartBtn = screen.getByRole('button', { name: /Out of Stock/i });
      expect(addToCartBtn).toBeDisabled();
    });
  });
});
