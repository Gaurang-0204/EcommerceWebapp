import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

/**
 * CarouselNavigation - Left/Right navigation arrows
 */
const CarouselNavigation = ({ 
  onPrevious, 
  onNext, 
  canScrollLeft, 
  canScrollRight,
  scrollProgress 
}) => {
  return (
    <>
      {/* Left Arrow */}
      <button
        className={`carousel-nav-btn carousel-nav-left ${!canScrollLeft ? 'disabled' : ''}`}
        onClick={onPrevious}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
      >
        <FaChevronLeft />
      </button>

      {/* Right Arrow */}
      <button
        className={`carousel-nav-btn carousel-nav-right ${!canScrollRight ? 'disabled' : ''}`}
        onClick={onNext}
        disabled={!canScrollRight}
        aria-label="Scroll right"
      >
        <FaChevronRight />
      </button>

      
    </>
  );
};

export default CarouselNavigation;
