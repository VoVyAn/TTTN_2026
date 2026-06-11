import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import '../css/pages/AboutUs.css';

function AboutUs() {
  const { t } = useLanguage();


  return (
    <div className="about-us">
      <div className="hero-section">
        <div 
          dangerouslySetInnerHTML={{ 
            __html: `
              <video 
                class="hero-image" 
                autoplay 
                loop 
                muted 
                playsinline 
                preload="auto"
              >
                <source src="/bom-intro.mp4" type="video/mp4" />
              </video>
            `
          }} 
        />
        <div className="hero-overlay">
          <h1>{t.heroTitle}</h1>
          <a href="https://guide.michelin.com/gb/en/ho-chi-minh/ho-chi-minh_2978179/restaurant/bom-1205510?millesime=um3g85" target="_blank" rel="noopener noreferrer" className="hero-michelin-badges">
            <img src="/michelin-2023.png" alt="Michelin Recommended 2023" className="badge-2023" />
            <img src="/michelin-2024.png" alt="Michelin Recommended 2024" className="badge-2024" />
            <img src="/michelin-2025.png" alt="Michelin Recommended 2025" className="badge-2025" />
            <img src="/michelin-2026.png" alt="Michelin Recommended 2026" className="badge-2026" />
          </a>
        </div>
      </div>
      
      <div className="chef-section">
        <picture>
          <source media="(max-width: 1024px)" srcSet="/chef-mobile.png" />
          <img src="/chef.png" alt="Executive Chef" className="chef-image" />
        </picture>
      </div>

      <div className="about-content">
        <div className="description">
          <h2>{t.aboutTitle}</h2>
          <p>{t.aboutDesc1}</p>
          <p>{t.aboutDesc2}</p>
        </div>
        
        <div className="info-section">
          <div className="hours">
            <h3>{t.hoursTitle}</h3>
            <p>{t.hours}</p>
          </div>
          
          <div className="address">
            <h3>{t.addressTitle}</h3>
            <p>24 Nguyễn Thị Nghĩa, Phường Bến Thành, Thành Phố Hồ Chí Minh</p>
            <p>Hotline: (+84) 82 399 9980</p>
            <p>Contact: booking@bomhospitality.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;