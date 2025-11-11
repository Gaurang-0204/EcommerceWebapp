import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';

/**
 * StockBadge Component
 * 
 * Displays real-time stock status for a product
 * 
 * Features:
 * - Shows current stock quantity
 * - Color-coded status (green/yellow/red)
 * - Animated badge for out-of-stock
 * - Low stock warning icon
 */

export const StockBadge = ({ productId, productName, className = '' }) => {
  const { inventoryData, getInventoryStatus, outOfStockItems, lowStockAlerts } = useInventory();

  const status = getInventoryStatus(productId);
  const inventory = inventoryData[productName];

  // Status badge styling
  const statusStyles = {
    in_stock: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'In Stock',
      icon: '✅',
    },
    low_stock: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Low Stock',
      icon: '⚠️',
    },
    out_of_stock: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Out of Stock',
      icon: '❌',
      animation: 'animate-pulse',
    },
  };

  const currentStyle = statusStyles[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentStyle.bg} ${currentStyle.text} ${currentStyle.animation || ''} ${className}`}>
      <span>{currentStyle.icon}</span>
      <span>{currentStyle.label}</span>
      {inventory && <span className="ml-1 text-xs">({inventory.quantity})</span>}
    </div>
  );
};

/**
 * OutOfStockOverlay Component
 * 
 * Shows overlay when product is out of stock
 * Disables purchase functionality
 */
export const OutOfStockOverlay = ({ isOutOfStock, children }) => {
  if (!isOutOfStock) return children;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-black bg-opacity-60 rounded-lg flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-white text-4xl mb-2">❌</div>
          <div className="text-white font-semibold">Out of Stock</div>
        </div>
      </div>
    </div>
  );
};

/**
 * LowStockWarning Component
 * 
 * Shows warning banner when product is low on stock
 */
export const LowStockWarning = ({ isLowStock, quantity }) => {
  if (!isLowStock) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-3">
      <span className="text-yellow-600 text-xl">⚠️</span>
      <div>
        <p className="text-yellow-800 font-semibold">Low Stock Warning</p>
        <p className="text-yellow-700 text-sm">Only {quantity} item(s) available. Order soon!</p>
      </div>
    </div>
  );
};
