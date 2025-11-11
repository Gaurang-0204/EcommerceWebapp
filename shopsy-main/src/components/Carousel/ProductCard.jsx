import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../../contexts/InventoryContext';
import { StockBadge } from '../Inventory/StockBadge';
import { OutOfStockOverlay } from '../Inventory/StockBadge';
import { LowStockWarning } from '../Inventory/StockBadge';

/**
 * ProductCard - Optimized product card for carousel
 * 
 * Features:
 * - Real-time inventory status
 * - Lazy loaded images
 * - Hover animations
 * - Click to view details
 */
const ProductCard = memo(({ product, index, isVisible }) => {
  const navigate = useNavigate();
  const { isOutOfStock, isLowStock, getInventoryStatus } = useInventory();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
  const productId = product.id;
  const stockStatus = getInventoryStatus(productId);
  const outOfStock = isOutOfStock(productId);
  const lowStock = isLowStock(productId);

  const handleClick = () => {
    navigate(`/ProductDetails/${productId}`);
  };

  return (
    <div 
      className="carousel-product-card"
      onClick={handleClick}
      data-index={index}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out'
      }}
    >
      {/* Product Image Container */}
      <div className="product-image-container">
        {/* Lazy Load Image */}
        {isVisible && (
          <>
            {!imageLoaded && (
              <div className="image-skeleton">
                <div className="skeleton-shimmer"></div>
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className={`product-image ${imageLoaded ? 'loaded' : 'loading'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = '/placeholder-product.png';
                setImageLoaded(true);
              }}
            />
          </>
        )}
        
        {/* Stock Badge */}
        <div className="stock-badge-container">
          <StockBadge status={stockStatus} />
        </div>
        
        {/* Out of Stock Overlay */}
        {outOfStock && <OutOfStockOverlay />}
        
        {/* Low Stock Warning */}
        {lowStock && !outOfStock && (
          <div className="low-stock-indicator">
            <span className="low-stock-dot"></span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>
        
        {product.color && (
          <p className="product-color">{product.color}</p>
        )}
        
        <div className="product-footer">
          <span className="product-price">${product.price}</span>
          
          {lowStock && !outOfStock && (
            <span className="stock-warning-text">Low Stock!</span>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="hover-overlay">
        <span className="view-details-text">View Details →</span>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
