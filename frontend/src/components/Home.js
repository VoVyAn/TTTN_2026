import React from 'react';
import '../css/Home.css';

function Home() {
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
        <div className="home-michelin-badges">
          <img src="/michelin-2023.png" alt="Michelin Recommended 2023" className="badge-2023" />
          <img src="/michelin-2024.png" alt="Michelin Recommended 2024" className="badge-2024" />
          <img src="/michelin-2025.png" alt="Michelin Recommended 2025" className="badge-2025" />
        </div>
        <div className="home-text-center">
          <p className="home-subtitle">
            Bờm Kitchen &amp; Wine Bar offers versatile spaces for every occasion, with Bờm Dining at its heart—where refined contemporary Vietnamese tasting menus turn every gathering into a memorable experience.
          </p>
        </div>
        <div className="home-contact-wrapper">
          <a href="/reservations" className="home-contact-btn">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
}

export default Home;
