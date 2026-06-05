import React from 'react';

function MenuSetCard({ set, expanded = false, onClick, tapHint = 'Nhấn để phóng to' }) {
  const CardTag = onClick && !expanded ? 'button' : 'div';
  const isImageOnly = !!set.isImageOnly;

  const cardProps = onClick && !expanded
    ? {
      type: 'button',
      onClick,
      className: `menu-set-card menu-set-card--${set.theme} menu-set-card--clickable ${isImageOnly ? 'menu-set-card--image-only' : ''
        }`
    }
    : {
      className: `menu-set-card menu-set-card--${set.theme} ${expanded ? 'menu-set-card--expanded' : ''
        } ${isImageOnly ? 'menu-set-card--image-only' : ''}`
    };

  if (isImageOnly) {
    return (
      <CardTag {...cardProps} style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.15)', background: 'transparent' }}>
        <img
          src={set.image}
          alt={set.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
            transition: onClick && !expanded ? 'transform 0.5s ease' : 'none'
          }}
          className="menu-set-card-img-element"
        />
      </CardTag>
    );
  }

  return (
    <CardTag {...cardProps}>
      <div
        className="menu-set-card-bg"
        style={{
          backgroundImage: `url(${set.image})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.35
        }}
        aria-hidden="true"
      />
      <div className="menu-set-card-overlay" />

      <div className="menu-set-card-inner">
        <h3 className="menu-set-card-title">{set.title}</h3>
        <div className="menu-set-pricing">
          {(set.pricing || []).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {(set.courses || []).map((course) => (
          <div key={course.label} className="menu-set-course">
            <h4>{course.label}</h4>
            {(course.items || []).map((dish) => (
              <div key={dish.name} className="menu-set-dish">
                <strong>{dish.name}</strong>
                <span>{dish.desc}</span>
              </div>
            ))}
          </div>
        ))}
        <p className="menu-set-footer">{set.footer}</p>
      </div>
    </CardTag>
  );
}

export default MenuSetCard;
