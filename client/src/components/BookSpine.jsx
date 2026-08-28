import React from 'react';
import { sound } from '../utils/audio';

export default function BookSpine({ book, onSelect, isActive }) {
  // Larger spine dimensions for clearer readability & prominent shelf presentation
  const heightVariation = 290 + ((book.id * 19) % 55); // between 290px and 345px
  const widthVariation = 70 + ((book.id * 7) % 22);    // between 70px and 92px

  const spineColor = book.spine_color || '#6366f1';
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
      {/* Bookmark ribbon */}
      {book.is_favorite && (
        <div className="spine-ribbon-tag" title="Bookmarked Favorite" />
      )}

      {/* Spine Surface */}
      <div
        className="spine-surface"
        style={{
          background: `linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.22) 20%, ${spineColor} 50%, rgba(0,0,0,0.7) 100%)`,
        }}
      >
        {/* Rating */}
        <div style={{ width: '100%' }}>
          {book.rating && (
            <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#fde68a', marginTop: '4px' }}>
              ★ {Number(book.rating).toFixed(1)}
            </div>
          )}
        </div>

        {/* Vertical Title */}
        <div className="spine-title-vertical">
          {book.title}
        </div>

        {/* Bottom Metadata: Author & Availability */}
        <div style={{ width: '100%' }}>
          <div className="spine-author">
            {book.author}
          </div>

          <div 
            style={{ 
              textAlign: 'center', 
              fontSize: '0.7rem', 
              fontWeight: '600',
              color: isAvailable ? '#34d399' : '#fb7185', 
              marginTop: '4px',
              textShadow: '0 1px 2px rgba(0,0,0,0.8)'
            }}
          >
            {isAvailable ? `${book.copies_available} left` : 'Loaned'}
          </div>
        </div>
      </div>
    </div>
  );
}
