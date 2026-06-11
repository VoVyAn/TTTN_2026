import React from 'react';

function MenuPanelCard({ panel, hoursText, onNavigate }) {
  const handleClick = () => {
    if (!panel.isInfo && panel.scrollTarget && onNavigate) {
      onNavigate(panel.scrollTarget);
    }
  };

  if (panel.isInfo) {
    return (
      <div className={`menu-panel-card menu-panel-card--${panel.theme}`}>
        <div className="menu-panel-info">
          <img src={panel.image || '/logo.png'} alt="Bờm" className="menu-panel-logo" loading="lazy" decoding="async" />
          <h3>{panel.title}</h3>
          <p>{panel.subtitle}</p>
          {hoursText && <p className="menu-panel-hours">{hoursText}</p>}
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`menu-panel-card menu-panel-card--${panel.theme}`}
      onClick={handleClick}
    >
      {panel.image ? (
        <img
          src={panel.image}
          alt=""
          className="menu-panel-bg"
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div className="menu-panel-bg" />
      )}
      <div className="menu-panel-overlay" />
      <div className="menu-panel-text">
        <h3>{panel.title}</h3>
        <p>{panel.subtitle}</p>
      </div>
    </button>
  );
}

export default MenuPanelCard;
