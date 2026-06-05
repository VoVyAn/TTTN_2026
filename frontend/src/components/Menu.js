import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useLanguage } from '../LanguageContext';
import MenuCarousel from './MenuCarousel';
import MenuSetCard from './MenuSetCard';
import MenuLightbox from './MenuLightbox';
import '../css/Menu.css';

function MenuDetailsCarousel({ items, onCardClick }) {
  const trackRef = React.useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollLeft: currentScrollLeft, scrollWidth, clientWidth } = track;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setActiveIndex(0);
      return;
    }
    // Calculate fractional scroll ratio
    const ratio = currentScrollLeft / maxScroll;
    // Map to active dot index
    const active = Math.min(items.length - 1, Math.max(0, Math.round(ratio * (items.length - 1))));
    setActiveIndex(active);
  }, [items.length]);

  const handleMouseDown = (e) => {
    setIsDown(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // multiplier
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  // Touch support for drag-to-swipe
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchScrollLeft, setTouchScrollLeft] = useState(0);

  const handleTouchStart = (e) => {
    setIsHovered(true);
    setTouchStartX(e.touches[0].pageX - trackRef.current.offsetLeft);
    setTouchScrollLeft(trackRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - trackRef.current.offsetLeft;
    const walk = (x - touchStartX) * 1.5;
    trackRef.current.scrollLeft = touchScrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
  };

  const handleDotClick = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const { scrollWidth, clientWidth } = track;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const targetScroll = (index / (items.length - 1)) * maxScroll;
    track.scrollTo({ left: targetScroll, behavior: 'smooth' });
    setActiveIndex(index);
  };

  // Auto-play scrolling from left to right (looping)
  useEffect(() => {
    if (items.length <= 1 || isDown || isHovered) return;

    const interval = setInterval(() => {
      const track = trackRef.current;
      if (!track) return;

      const { scrollWidth, clientWidth } = track;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) return;

      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % items.length;
        const targetScroll = (nextIndex / (items.length - 1)) * maxScroll;
        track.scrollTo({ left: targetScroll, behavior: 'smooth' });
        return nextIndex;
      });
    }, 3000); // 3 seconds interval

    return () => clearInterval(interval);
  }, [items.length, isDown, isHovered]);

  return (
    <div className="menu-detail-carousel-wrapper" style={{ position: 'relative' }}>
      <div
        ref={trackRef}
        className="menu-items"
        onMouseDown={handleMouseDown}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onScroll={handleScroll}
      >
        {items.map((item) => (
          <div
            key={item._id}
            className="menu-detail-card"
            onClick={() => onCardClick(item)}
          >
            {item.image ? (
              <img src={item.image} alt={item.name} className="menu-detail-card-img" draggable="false" />
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', color: '#666' }}>
                No image
              </div>
            )}
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div className="menu-detail-dots">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`menu-detail-dot ${activeIndex === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              style={{ border: 'none', padding: 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Menu() {
  const { t, lang } = useLanguage();
  const [menuData, setMenuData] = useState(null);

  const [sets, setSets] = useState([]);
  const [alacarte, setAlacarte] = useState([]);
  const [wine, setWine] = useState([]);
  const [khung, setKhung] = useState([]);

  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxItems, setLightboxItems] = useState([]);

  // Detail Lightbox State
  const [detailLightboxOpen, setDetailLightboxOpen] = useState(false);
  const [detailLightboxItems, setDetailLightboxItems] = useState([]);
  const [detailLightboxIndex, setDetailLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [menuRes, catRes, setsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/menu?lang=${lang}`),
          axios.get(`http://localhost:5000/api/categories?lang=${lang}`),
          axios.get(`http://localhost:5000/api/menu-sets?lang=${lang}`)
        ]);

        // Group and sort Menu detail items (bottom list)
        const grouped = menuRes.data;
        const ordered = {};
        catRes.data.forEach((cat) => {
          if (grouped[cat.name]) ordered[cat.name] = grouped[cat.name];
        });
        Object.keys(grouped).forEach((name) => {
          if (!ordered[name]) ordered[name] = grouped[name];
        });
        setMenuData(ordered);

        // Filter menu sets by type
        const allSets = setsRes.data || [];
        setSets(allSets.filter((item) => (item.menuType || 'set') === 'set'));
        setAlacarte(allSets.filter((item) => item.menuType === 'alacarte'));
        setWine(allSets.filter((item) => item.menuType === 'wine'));
        setKhung(allSets.filter((item) => item.menuType === 'khung'));

      } catch (error) {
        console.error('Lỗi tải menu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [lang]);

  const openLightbox = (itemsList, index) => {
    setLightboxItems(itemsList);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => Math.min(lightboxItems.length - 1, i + 1));
  }, [lightboxItems.length]);

  // Detail Lightbox Helpers
  const openDetailLightbox = (itemsList, selectedItem) => {
    const index = itemsList.findIndex(i => i._id === selectedItem._id);
    setDetailLightboxItems(itemsList);
    setDetailLightboxIndex(index >= 0 ? index : 0);
    setDetailLightboxOpen(true);
  };

  const goDetailPrev = useCallback(() => {
    setDetailLightboxIndex((i) => Math.max(0, i - 1));
  }, []);

  const goDetailNext = useCallback(() => {
    setDetailLightboxIndex((i) => Math.min(detailLightboxItems.length - 1, i + 1));
  }, [detailLightboxItems.length]);

  return (
    <div className="menu-page">
      {/* 1. SET MENU */}
      <section className="menu-showcase">
        <h2 className="menu-showcase-title">{t.setMenuTitle}</h2>
        {sets.length === 0 && !loading && (
          <p className="menu-empty-hint">{t.menuShowcaseEmpty}</p>
        )}
        {sets.length > 0 && (
          <MenuCarousel ariaLabel={t.setMenuTitle}>
            {sets.map((set, index) => (
              <div key={set._id} className="menu-carousel-item">
                <MenuSetCard
                  set={set}
                  tapHint={t.tapToEnlarge}
                  onClick={() => openLightbox(sets, index)}
                />
              </div>
            ))}
          </MenuCarousel>
        )}
      </section>

      {/* 2. ALACARTE MENU */}
      <section className="menu-showcase menu-showcase--alcarte">
        <h2 className="menu-showcase-title">{t.alaCarteTitle}</h2>
        {alacarte.length === 0 && !loading && (
          <p className="menu-empty-hint">{t.menuShowcaseEmpty}</p>
        )}
        {alacarte.length > 0 && (
          <MenuCarousel ariaLabel={t.alaCarteTitle}>
            {alacarte.map((item, index) => (
              <div key={item._id} className="menu-carousel-item">
                <MenuSetCard
                  set={item}
                  tapHint={t.tapToEnlarge}
                  onClick={() => openLightbox(alacarte, index)}
                />
              </div>
            ))}
          </MenuCarousel>
        )}
      </section>

      {/* 3. WINE & DRINK MENU */}
      <section className="menu-showcase">
        <h2 className="menu-showcase-title">{t.wineDrinkTitle}</h2>
        {wine.length === 0 && !loading && (
          <p className="menu-empty-hint">{t.menuShowcaseEmpty}</p>
        )}
        {wine.length > 0 && (
          <MenuCarousel ariaLabel={t.wineDrinkTitle}>
            {wine.map((item, index) => (
              <div key={item._id} className="menu-carousel-item">
                <MenuSetCard
                  set={item}
                  tapHint={t.tapToEnlarge}
                  onClick={() => openLightbox(wine, index)}
                />
              </div>
            ))}
          </MenuCarousel>
        )}
      </section>

      {/* 4. KHUNG & INFO */}
      <section className="menu-showcase menu-showcase--alcarte">
        <h2 className="menu-showcase-title">{t.khungTitle}</h2>
        {khung.length === 0 && !loading && (
          <p className="menu-empty-hint">{t.menuShowcaseEmpty}</p>
        )}
        {khung.length > 0 && (
          <MenuCarousel ariaLabel={t.khungTitle}>
            {khung.map((item, index) => (
              <div key={item._id} className="menu-carousel-item">
                <MenuSetCard
                  set={item}
                  tapHint={t.tapToEnlarge}
                  onClick={() => openLightbox(khung, index)}
                />
              </div>
            ))}
          </MenuCarousel>
        )}
      </section>

      {/* Unified Lightbox */}
      <MenuLightbox
        open={lightboxOpen}
        items={lightboxItems}
        activeIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={goPrev}
        onNext={goNext}
        renderContent={(set) => <MenuSetCard set={set} expanded />}
      />

      {/* Detail A la carte list */}
      <section className="menu-ala-carte-list">
        <h2 className="menu-showcase-title menu-showcase-title--dark">{t.menuDetailTitle}</h2>
        {loading && <p className="menu-loading">{t.menuLoading}</p>}
        {!loading && menuData && Object.entries(menuData).map(([category, items]) => {
          const lower = category.toLowerCase();
          const targetId = lower.includes('tráng') || lower.includes('dessert')
            ? 'dessert'
            : lower.includes('uống') || lower.includes('beverage') || lower.includes('wine')
              ? 'wine'
              : 'main';
          return (
            <div key={category} id={`menu-cat-${targetId}`} className="menu-category">
              <MenuDetailsCarousel
                items={items}
                onCardClick={(selectedItem) => openDetailLightbox(items, selectedItem)}
              />
            </div>
          );
        })}
      </section>

      {/* Unified Dish Details Lightbox */}
      <MenuLightbox
        open={detailLightboxOpen}
        items={detailLightboxItems}
        activeIndex={detailLightboxIndex}
        onClose={() => setDetailLightboxOpen(false)}
        onPrev={goDetailPrev}
        onNext={goDetailNext}
        renderContent={(item) => (
          <div className="menu-detail-lightbox-content">
            {item.image ? (
              <img src={item.image} alt={item.name} className="menu-detail-lightbox-img" />
            ) : (
              <div style={{ height: '65%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333', color: '#666' }}>
                No image available
              </div>
            )}
            <div className="menu-detail-lightbox-info">
              <h3>{item.name}</h3>
              <p className="price">{Number(item.price).toLocaleString()}đ</p>
              <p className="description">{item.description || 'Chưa có mô tả chi tiết cho món ăn này.'}</p>
            </div>
          </div>
        )}
      />
    </div>
  );
}

export default Menu;
