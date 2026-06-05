import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import '../css/Header.css';

function Header() {
  const { lang, changeLang, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className={`site-header ${isHomePage ? 'home-header' : ''}`}>
      <div className="nav-container">
        <div className="logo-container">
          <a href="/" onClick={closeMenu}>
            <img src="/logo.png" alt="Bờm Logo" className="logo-img" />
          </a>
        </div>

        <div className="mobile-menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? '✖' : '☰'}
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <a href="/about-us" onClick={closeMenu} className={window.location.pathname === '/about-us' ? 'active' : ''}>
              {t.navAbout}
            </a>
          </li>
          <li>
            <a href="/menu" onClick={closeMenu} className={window.location.pathname === '/menu' ? 'active' : ''}>
              {t.navMenu}
            </a>
          </li>
          <li>
            <a href="/events" onClick={closeMenu} className={window.location.pathname === '/events' ? 'active' : ''}>
              {t.navEvents}
            </a>
          </li>
          <li>
            <a href="/press" onClick={closeMenu} className={window.location.pathname === '/press' ? 'active' : ''}>
              {t.navPress}
            </a>
          </li>
          <li>
            <a href="/reservations" onClick={closeMenu} className={window.location.pathname === '/reservations' ? 'active' : ''}>
              {t.navReservations}
            </a>
          </li>
        </ul>

        <div className="nav-right">
          <div className="language-selector">
            <div className="current-lang">
              {lang}
            </div>
            <div className="lang-dropdown-wrapper">
              <ul className="lang-dropdown">
                <li onClick={() => { changeLang('EN'); closeMenu(); }}>English</li>
                <li onClick={() => { changeLang('VN'); closeMenu(); }}>Vietnamese</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
