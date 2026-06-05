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
          <img src={panel.image || '/logo.png'} alt="Bờm" className="menu-panel-logo" />
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
      <div
        className="menu-panel-bg"
        style={{ backgroundImage: panel.image ? `url(${panel.image})` : undefined }}
      />
      <div className="menu-panel-overlay" />
      <div className="menu-panel-text">
        <h3>{panel.title}</h3>
        <p>{panel.subtitle}</p>
      </div>
    </button>
  );
}

export default MenuPanelCard;
