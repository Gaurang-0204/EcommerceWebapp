import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { useInventory } from '../../contexts/InventoryContext';
import { useHorizontalScroll } from '../../hooks/useHorizontalScroll';
import ProductCard from './ProductCard';
import CarouselNavigation from './CarouselNavigation';
import './carousel.css';
import { Link } from 'react-router-dom';

/**
 * HorizontalProductCarousel - Horizontal scrolling product carousel
 * 
 * Features:
 * - Real-time inventory integration
 * - Performance optimized (virtualization)
 * - Touch/swipe support
 * - Responsive design
 * - Lazy loading images
 */
const HorizontalProductCarousel = ({ 
  title = "Trending Products",
  category = null,
  limit = 20,
  autoScroll = false,
  autoScrollInterval = 5000
}) => {
  const scrollContainerRef = useRef(null);
  const [visibleItems, setVisibleItems] = useState(new Set());
  const observerRef = useRef(null);

  // Fetch products
  const { data, isLoading, isError } = useProducts({
    page: 1,
    limit: limit,
    category: category
  });

  const products = data?.products || [];

  // Inventory context
  const { connectionStatus } = useInventory();

  // Horizontal scroll hook
  const {
    canScrollLeft,
    canScrollRight,
    scrollProgress,
    scrollNext,
    scrollPrevious,
    isDragging,
    handlers
  } = useHorizontalScroll(scrollContainerRef, 280);

  // Auto-scroll functionality
  useEffect(() => {
    if (!autoScroll) return;

    const interval = setInterval(() => {
      if (canScrollRight) {
        scrollNext();
      } else {
        // Loop back to start
        scrollContainerRef.current?.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }
    }, autoScrollInterval);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollInterval, canScrollRight, scrollNext]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index);
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      {
        root: scrollContainerRef.current,
        rootMargin: '200px', // Load items 200px before visible
        threshold: 0.1
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Observe product cards
  useEffect(() => {
    const cards = scrollContainerRef.current?.querySelectorAll('.carousel-product-card');
    
    cards?.forEach((card) => {
      observerRef.current?.observe(card);
    });

    return () => {
      cards?.forEach((card) => {
        observerRef.current?.unobserve(card);
      });
    };
  }, [products]);

  // Loading state
  if (isLoading) {
    return (
      <div className="carousel-container">
        <div className="carousel-header">
          <h2>{title}</h2>
        </div>
        <div className="carousel-loading">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="product-card-skeleton">
              <div className="skeleton-image"></div>
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="carousel-container">
        <div className="carousel-error">
          <p>Failed to load products. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container">
      {/* Header */}
      <div className="carousel-header">
        <h2 className="carousel-title">{title}</h2>
        
        {/* Connection Status Indicator */}
        {connectionStatus && (
          <div className={`connection-status ${connectionStatus}`}>
            <span className="status-dot"></span>
            <span className="status-text">
              {connectionStatus === 'connected' ? 'Live' : 
               connectionStatus === 'polling' ? 'Updating' : 
               'Offline'}
            </span>
          </div>
        )}
      </div>

      {/* Carousel Wrapper */}
      <div className="carousel-wrapper">
        {/* Navigation Buttons */}
        <CarouselNavigation
          onPrevious={scrollPrevious}
          onNext={scrollNext}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollProgress={scrollProgress}
        />

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className={`carousel-scroll-container ${isDragging ? 'dragging' : ''}`}
          {...handlers}
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isVisible={visibleItems.has(index)}
            />
          ))}
        </div>

        {/* View All Button */}
      <div className="flex justify-center mt-10 mb-4">
        <Link to="/products">
          <button className="text-center cursor-pointer bg-primary text-white py-2 px-6 rounded-md hover:bg-primary-dark transition-colors duration-300">
            View All Products
          </button>
        </Link>
      </div>
      </div>
    </div>
  );
};

export default HorizontalProductCarousel;
