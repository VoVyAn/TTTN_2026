import React, { useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import '../css/pages/Home.css';

function Home() {
  const { t } = useLanguage();


  const videoRef = useRef(null);

  useEffect(() => {
    const playVideo = () => {
      if (videoRef.current) {
        videoRef.current.muted = true;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            console.log("Autoplay blocked initially, waiting for interaction.");
          });
        }
      }
    };

    // Cố gắng phát ngay lập tức
    playVideo();

    // Bắt buộc phát khi người dùng tương tác lần đầu (Vượt rào Zalo)
    const handleInteraction = () => {
      playVideo();
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };

    document.addEventListener('touchstart', handleInteraction, { once: true });
    document.addEventListener('click', handleInteraction, { once: true });
    document.addEventListener('scroll', handleInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', handleInteraction);
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  return (
    <div className="home-container">
      <video
        ref={videoRef}
        className="home-video-fullscreen"
        autoPlay
        loop
        muted
        defaultMuted
        playsInline
        webkit-playsinline="true"
        poster="/home-dining.png"
        style={{ objectFit: 'cover', width: '100%', height: '100%', backgroundColor: '#000' }}
      >
        <source src={`${window.location.origin}/bom-intro.mp4`} type="video/mp4" />
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
