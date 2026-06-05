import React from 'react';
import { useLanguage } from '../LanguageContext';

function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="about-us">
      <div className="hero-section">
        <video 
  className="hero-image"
  autoPlay
  loop
  muted
  playsInline
>
  <source src="/Bom-intro.mp4" type="video/mp4" />
  Trình duyệt không hỗ trợ video.
</video>
        <div className="hero-overlay">
          <h1>{t.heroTitle}</h1>
          <div className="hero-michelin-badges">
            <img src="/michelin-2023.png" alt="Michelin Recommended 2023" className="badge-2023" />
            <img src="/michelin-2024.png" alt="Michelin Recommended 2024" className="badge-2024" />
            <img src="/michelin-2025.png" alt="Michelin Recommended 2025" className="badge-2025" />
          </div>
        </div>
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