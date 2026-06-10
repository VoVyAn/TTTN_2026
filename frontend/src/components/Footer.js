import React from 'react';
import { useLanguage } from '../LanguageContext';
import '../css/components/Footer.css';

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src="/logo.png" alt="Bờm Logo" className="footer-logo" />
          <a href="https://guide.michelin.com/gb/en/ho-chi-minh/ho-chi-minh_2978179/restaurant/bom-1205510?millesime=um3g85" target="_blank" rel="noopener noreferrer" className="footer-michelin-badges">
            <img src="/michelin-2023.png" alt="Michelin Recommended 2023" className="badge-2023" />
            <img src="/michelin-2024.png" alt="Michelin Recommended 2024" className="badge-2024" />
            <img src="/michelin-2025.png" alt="Michelin Recommended 2025" className="badge-2025" />
            <img src="/michelin-2026.png" alt="Michelin Recommended 2026" className="badge-2026" />
          </a>
        </div>

        <div className="footer-links">
          <h4>{t.footerQuickLinks}</h4>
          <ul>
            <li><a href="/about-us">{t.navAbout}</a></li>
            <li><a href="/menu">{t.navMenu}</a></li>
            <li><a href="/events">{t.navEvents}</a></li>
            <li><a href="/press">{t.navPress}</a></li>
            <li><a href="/reservations">{t.navReservations}</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>{t.footerContact}</h4>
          <p>{t.footerAddress}</p>
          <p>{t.footerHotline}</p>
          <p>{t.footerEmail}</p>
        </div>

        <div className="footer-hours">
          <h4>{t.hoursTitle}</h4>
          <p>{t.hours}</p>
        </div>

        <div className="footer-follow">
          <h4>{t.footerFollowUs}</h4>
          <div className="social-links">
            <a href="https://www.facebook.com/BomKitchenWineBarOfficial" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M14 13.5h2.5l1-3H14V8.6c0-.8.2-1.1 1-1.1h1.5V4.5c-.6-.1-1.7-.2-2.8-.2-2.9 0-4.7 1.7-4.7 4.9v2.3H7v3h2.3V21h4.7v-7.5z" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@gastronomybom" target="_blank" rel="noopener noreferrer" className="social-icon tiktok" aria-label="TikTok">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.62 2.89 2.89 0 0 1 2.31-4.5 2.93 2.93 0 0 1 .77.1v-3.5a6.23 6.23 0 0 0-1.07-.1A6.34 6.34 0 0 0 3 15.67a6.34 6.34 0 0 0 6.34 6.33 6.34 6.34 0 0 0 6.34-6.33V8.89a8.14 8.14 0 0 0 5.48 2.07V7.5a4.8 4.8 0 0 1-1.57-.81z" />
              </svg>
            </a>
            <a href="https://www.instagram.com/bom.saigon/" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583 0.07-4.849 0.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19 19h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z M8 19h-3v-11h3v11z M6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t.footerCopyright}</p>
      </div>
    </footer>
  );
}

export default Footer;
