/**
 * @fileoverview Integration Tests for AllProducts Component
 * Tests Phase 1 Implementation in Component Context
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import AllProducts from '../Products';
import { ProductService } from '../../services/api/productService';

jest.mock('../../services/api/productService');

// Mock AOS
jest.mock('aos', () => ({
  init: jest.fn(),
}));

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('AllProducts Component - Phase 1 Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading skeleton initially', () => {
    ProductService.getProducts.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<AllProducts />, { wrapper: createTestWrapper() });

    // Should show loading skeleton (you need to add testid to skeleton)
    expect(screen.getByTestId('products-skeleton')).toBeInTheDocument();
  });

  it('should render products after successful fetch', async () => {
    const mockData = {
      products: [
        { id: 1, name: 'Test Product 1', price: '10.99', color: 'Red', image: '/test1.jpg' },
        { id: 2, name: 'Test Product 2', price: '20.99', color: 'Blue', image: '/test2.jpg' },
      ],
      total: 2,
      page: 1,
    };

    ProductService.getProducts.mockResolvedValue(mockData);

    render(<AllProducts />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    expect(screen.getByText('Showing 2 products')).toBeInTheDocument();
  });

  it('should render error state on fetch failure', async () => {
    const error = new Error('Network error');
    ProductService.getProducts.mockRejectedValue(error);

    render(<AllProducts />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('should render empty state when no products', async () => {
    ProductService.getProducts.mockResolvedValue({
      products: [],
      total: 0,
      page: 1,
    });

    render(<AllProducts />, { wrapper: createTestWrapper() });

    await waitFor(() => {
      expect(screen.getByText('No Products Available')).toBeInTheDocument();
    });
  });
});
