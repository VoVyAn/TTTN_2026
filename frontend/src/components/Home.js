import React from 'react';
import { useLanguage } from '../LanguageContext';
import '../css/pages/Home.css';

function Home() {
  const { t } = useLanguage();

  return (
    <div className="home-container">
      <video
        className="home-video-fullscreen"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/bom-intro.mp4" type="video/mp4" />
        Trình duyệt không hỗ trợ video.
      </video>
      <div className="home-bottom-bar">
        <a href="https://guide.michelin.com/gb/en/ho-chi-minh/ho-chi-minh_2978179/restaurant/bom-1205510?millesime=um3g85" target="_blank" rel="noopener noreferrer" className="home-michelin-badges">
          <img src="/michelin-2023.png" alt="Michelin Recommended 2023" className="badge-2023" />
          <img src="/michelin-2024.png" alt="Michelin Recommended 2024" className="badge-2024" />
          <img src="/michelin-2025.png" alt="Michelin Recommended 2025" className="badge-2025" />
          <img src="/michelin-2026.png" alt="Michelin Recommended 2026" className="badge-2026" />
        </a>
        <div className="home-text-center">
          <p className="home-subtitle">
            {t.homeSubtitle}
          </p>
        </div>
        <div className="home-contact-wrapper">
          <a href="/reservations" className="home-contact-btn">
            {t.homeContact}
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
