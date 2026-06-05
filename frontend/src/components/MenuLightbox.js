import React, { useEffect } from 'react';

function MenuLightbox({
  open,
  items,
  activeIndex,
  onClose,
  onPrev,
  onNext,
  renderContent
}) {
  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < items.length - 1;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && canGoPrev) onPrev();
      if (e.key === 'ArrowRight' && canGoNext) onNext();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, onPrev, onNext, canGoPrev, canGoNext]);

  if (!open || !items[activeIndex]) return null;

  const item = items[activeIndex];

  return (
    <div className="menu-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button type="button" className="menu-lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      <button
        type="button"
        className={`menu-lightbox-nav menu-lightbox-nav--prev${canGoPrev ? '' : ' is-disabled'}`}
        onClick={(e) => {
          e.stopPropagation();
          if (canGoPrev) onPrev();
        }}
        disabled={!canGoPrev}
        aria-label="Previous"
      >
        ‹
      </button>

      <div
        key={activeIndex}
        className="menu-lightbox-content menu-lightbox-content--zoom"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent(item, true)}
      </div>

      <button
        type="button"
        className={`menu-lightbox-nav menu-lightbox-nav--next${canGoNext ? '' : ' is-disabled'}`}
        onClick={(e) => {
          e.stopPropagation();
          if (canGoNext) onNext();
        }}
        disabled={!canGoNext}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  );
}

export default MenuLightbox;
