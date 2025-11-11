import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useHorizontalScroll - Custom hook for horizontal scrolling
 * 
 * Features:
 * - Smooth scroll animation
 * - Touch/swipe support
 * - Scroll progress tracking
 * - Edge detection
 */
export const useHorizontalScroll = (scrollContainerRef, itemWidth = 280) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Check scroll position
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    
    // Calculate scroll progress (0-100)
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  }, [scrollContainerRef]);

  // Scroll to position with smooth animation
  const scrollTo = useCallback((position) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      left: position,
      behavior: 'smooth'
    });
  }, [scrollContainerRef]);

  // Scroll by amount
  const scrollBy = useCallback((amount) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const newPosition = container.scrollLeft + amount;
    scrollTo(newPosition);
  }, [scrollContainerRef, scrollTo]);

  // Scroll to next items
  const scrollNext = useCallback(() => {
    scrollBy(itemWidth * 3); // Scroll 3 items at a time
  }, [scrollBy, itemWidth]);

  // Scroll to previous items
  const scrollPrevious = useCallback(() => {
    scrollBy(-itemWidth * 3);
  }, [scrollBy, itemWidth]);

  // Mouse drag support
  const handleMouseDown = useCallback((e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDragging(true);
    startX.current = e.pageX - container.offsetLeft;
    scrollLeft.current = container.scrollLeft;
  }, [scrollContainerRef]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;

    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll speed
    container.scrollLeft = scrollLeft.current - walk;
  }, [isDragging, scrollContainerRef]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch/swipe support
  const handleTouchStart = useCallback((e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    startX.current = e.touches[0].pageX - container.offsetLeft;
    scrollLeft.current = container.scrollLeft;
  }, [scrollContainerRef]);

  const handleTouchMove = useCallback((e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const x = e.touches[0].pageX - container.offsetLeft;
    const walk = (x - startX.current) * 2;
    container.scrollLeft = scrollLeft.current - walk;
  }, [scrollContainerRef]);

  // Setup event listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScrollPosition);
    checkScrollPosition();

    return () => {
      container.removeEventListener('scroll', checkScrollPosition);
    };
  }, [scrollContainerRef, checkScrollPosition]);

  return {
    canScrollLeft,
    canScrollRight,
    scrollProgress,
    scrollNext,
    scrollPrevious,
    scrollTo,
    isDragging,
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
    }
  };
};
