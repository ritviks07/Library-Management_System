import React from 'react';
import { sound } from '../utils/audio';

export default function BookSpine({ book, onSelect, isActive }) {
  // Deterministic realistic height and width variation
  const heightVariation = 245 + ((book.id * 17) % 45); // between 245px and 290px
  const widthVariation = 56 + ((book.id * 7) % 18);    // between 56px and 74px

  const spineColor = book.spine_color || '#7A1C29';
  const isAvailable = book.copies_available > 0;

  const handleMouseEnter = () => {
    sound.playBookThud();
  };

  const handleClick = () => {
    sound.playPageFlip();
    onSelect(book);
  };

  return (
    <div
      className={`book-spine-card ${isActive ? 'is-active' : ''}`}
      style={{
        height: `${heightVariation}px`,
        width: `${widthVariation}px`,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      title={`${book.title} by ${book.author} (${book.publish_year}) - Click to inspect`}
    >
      {/* Bookmark ribbon peeking out top */}
      {book.is_favorite && (
        <div className="spine-ribbon-tag" title="Bookmarked Favorite" />
      )}

      {/* 3D Spine Surface with modern lighting and leather gradient */}
      <div
        className="spine-surface"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.22) 20%, ${spineColor} 50%, rgba(0,0,0,0.7) 100%)`,
        }}
      >
        {/* Top Gold Embossed Ribs & Rating */}
        <div style={{ width: '100%' }}>
          <div className="spine-rib" />
          <div className="spine-rib" />
          {book.rating && (
            <div style={{ textAlign: 'center', fontSize: '0.68rem', fontWeight: '700', color: '#fde68a', marginTop: '3px' }}>
              ★ {Number(book.rating).toFixed(1)}
            </div>
          )}
        </div>

        {/* Vertical Foil Title */}
        <div className="spine-title-vertical">
          {book.title}
        </div>

        {/* Bottom Metadata: Author & Availability Indicator */}
        <div style={{ width: '100%' }}>
          <div className="spine-author">
            {book.author}
          </div>

          <div 
            style={{ 
              textAlign: 'center', 
              fontSize: '0.6rem', 
              fontWeight: '600',
              color: isAvailable ? '#34d399' : '#fb7185', 
              marginTop: '3px',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            {isAvailable ? `${book.copies_available} left` : 'Loaned'}
          </div>

          <div className="spine-rib" style={{ marginTop: '5px' }} />
          <div className="spine-rib" />
        </div>
      </div>
    </div>
  );
}
