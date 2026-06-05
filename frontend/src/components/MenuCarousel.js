import React, { useRef, useState, useEffect, useCallback } from 'react';

function MenuCarousel({ children, ariaLabel }) {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft, scrollWidth, clientWidth } = track;
    setAtStart(scrollLeft <= 2);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
  }, []);

  useEffect(() => {
    updateScrollState();
    const track = trackRef.current;
    if (!track) return undefined;

    track.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(track);

    return () => {
      track.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
      observer.disconnect();
    };
  }, [children, updateScrollState]);

  const scroll = (direction) => {
    if (direction < 0 && atStart) return;
    if (direction > 0 && atEnd) return;

    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelector('.menu-carousel-item');
    const gap = 24;
    const width = item
      ? item.getBoundingClientRect().width
      : parseInt(getComputedStyle(track).getPropertyValue('--menu-card-width'), 10) || 340;
    track.scrollBy({ left: direction * (width + gap), behavior: 'smooth' });
  };

  return (
    <div className="menu-carousel" aria-label={ariaLabel}>
      <button
        type="button"
        className={`menu-carousel-arrow menu-carousel-arrow--left${atStart ? ' is-disabled' : ''}`}
        onClick={() => scroll(-1)}
        disabled={atStart}
        aria-label="Cuộn trái"
      >
        ←
      </button>
      <div className="menu-carousel-track" ref={trackRef}>
        {children}
      </div>
      <button
        type="button"
        className={`menu-carousel-arrow menu-carousel-arrow--right${atEnd ? ' is-disabled' : ''}`}
        onClick={() => scroll(1)}
        disabled={atEnd}
        aria-label="Cuộn phải"
      >
        →
      </button>
    </div>
  );
}

export default MenuCarousel;
