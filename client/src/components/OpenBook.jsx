import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Bookmark, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  Star,
  Quote,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function OpenBook({
  book,
  onClose,
  onEdit,
  onDeletePrompt,
  onBorrow,
  onReturn,
  onToggleFavorite,
  onPrevBook,
  onNextBook,
  hasPrev,
  hasNext
}) {
  const [turningPage, setTurningPage] = useState(false);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sound.playPageFlip();
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        handlePrev();
      } else if (e.key === 'ArrowRight' && hasNext) {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, onClose]);

  if (!book) return null;

  const isAvailable = book.copies_available > 0;
  const canReturn = book.copies_available < (book.total_copies || 1);
  const leatherColor = book.spine_color || '#7a1c29';
  const totalCopies = book.total_copies || 1;
  const availablePercentage = Math.round((book.copies_available / totalCopies) * 100);

  const handlePrev = () => {
    if (!hasPrev) return;
    sound.playPageFlip();
    setTurningPage(true);
    setTimeout(() => {
      onPrevBook();
      setTurningPage(false);
    }, 180);
  };

  const handleNext = () => {
    if (!hasNext) return;
    sound.playPageFlip();
    setTurningPage(true);
    setTimeout(() => {
      onNextBook();
      setTurningPage(false);
    }, 180);
  };

  return (
    <div className="open-book-viewport" onClick={onClose}>
      {/* Tome Nav Left */}
      <button
        className="tome-nav-arrow tome-nav-left"
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        disabled={!hasPrev}
        title="Previous Tome in Archive (Left Arrow)"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Tome Nav Right */}
      <button
        className="tome-nav-arrow tome-nav-right"
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        disabled={!hasNext}
        title="Next Tome in Archive (Right Arrow)"
      >
        <ChevronRight size={24} />
      </button>

      <div 
        className="grand-tome-wrapper"
        style={{ 
          backgroundColor: leatherColor,
          boxShadow: `0 35px 70px -15px rgba(0, 0, 0, 0.9), 0 0 50px ${leatherColor}44`
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Silk Bookmark Ribbon */}
        <div
          className="silk-bookmark-ribbon"
          onClick={() => {
            sound.playWaxStamp();
            onToggleFavorite(book.id);
          }}
          title={book.is_favorite ? 'Bookmarked favorite' : 'Bookmark this tome'}
        >
          <Bookmark 
            size={18} 
            color={book.is_favorite ? '#3a200a' : '#fff'} 
            fill={book.is_favorite ? '#3a200a' : 'none'} 
          />
        </div>

        {/* Dual Page Spread */}
        <div className="book-spread-container">
          {/* Center Gutter */}
          <div className="spine-center-gutter" />

          {/* LEFT PAGE: Metadata, Identification, Rating & Circulation */}
          <div className="left-book-page">
            {/* Header: Back Button & Archive Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => {
                  sound.playPageFlip();
                  onClose();
                }}
                className="btn-glass"
                style={{ 
                  color: '#4a3e36', 
                  borderColor: '#d5c4a5', 
                  background: 'rgba(0,0,0,0.04)',
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem'
                }}
              >
                <ArrowLeft size={14} />
                <span>Back to Shelf</span>
              </button>

              <span 
                style={{ 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  color: '#8c531b',
                  background: '#ecdcc0',
                  padding: '3px 10px',
                  borderRadius: '6px'
                }}
              >
                ARCHIVE #{String(book.id).padStart(3, '0')}
              </span>
            </div>

            {/* Title & Author Info */}
            <div style={{ margin: '1.5rem 0 1rem 0', textAlign: 'center' }}>
              <span 
                style={{ 
                  fontFamily: 'var(--font-sans)', 
                  fontSize: '0.78rem', 
                  color: '#8c651b', 
                  letterSpacing: '1.5px', 
                  textTransform: 'uppercase',
                  fontWeight: '700'
                }}
              >
                {book.genre}
              </span>

              <h2 
                style={{ 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '2rem', 
                  color: '#1a1512', 
                  lineHeight: '1.2', 
                  margin: '0.5rem 0 0.35rem 0',
                  fontWeight: '700'
                }}
              >
                {book.title}
              </h2>

              <p 
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontStyle: 'italic', 
                  fontSize: '1.15rem', 
                  color: '#5c4a3d' 
                }}
              >
                Penned by {book.author}
              </p>

              {/* Rating Stars */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginTop: '0.75rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    fill={star <= Math.round(book.rating || 5) ? '#d97706' : '#d1c7b7'} 
                    color={star <= Math.round(book.rating || 5) ? '#d97706' : '#d1c7b7'} 
                  />
                ))}
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#8c531b', marginLeft: '6px' }}>
                  {Number(book.rating || 5.0).toFixed(1)} / 5.0
                </span>
              </div>
            </div>

            {/* Circulation Meter Box */}
            <div 
              style={{ 
                background: 'rgba(230, 218, 195, 0.45)', 
                border: '1px solid #d8c8ab', 
                borderRadius: '10px', 
                padding: '1.1rem',
                margin: '1rem 0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#4a3e36' }}>
                  Circulation Status
                </span>
                <span 
                  style={{ 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    color: isAvailable ? '#15803d' : '#b91c1c' 
                  }}
                >
                  {isAvailable ? `${book.copies_available} of ${totalCopies} Available` : 'All Copies on Loan'}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', background: '#d5c5a8', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${availablePercentage}%`, 
                    height: '100%', 
                    background: isAvailable ? 'linear-gradient(90deg, #10b981, #059669)' : '#ef4444',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease'
                  }} 
                />
              </div>

              {/* Quick Borrow / Return Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '1rem' }}>
                <button
                  className="btn-primary-gradient"
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.82rem' }}
                  onClick={() => onBorrow(book.id)}
                  disabled={!isAvailable}
                >
                  <CheckCircle2 size={15} />
                  <span>Borrow Copy</span>
                </button>

                <button
                  className="btn-glass"
                  style={{ 
                    flex: 1, 
                    padding: '0.5rem', 
                    fontSize: '0.82rem', 
                    color: '#4a3e36', 
                    borderColor: '#d5c4a5', 
                    background: 'rgba(0,0,0,0.05)' 
                  }}
                  onClick={() => onReturn(book.id)}
                  disabled={!canReturn}
                >
                  <RotateCcw size={15} />
                  <span>Return Copy</span>
                </button>
              </div>
            </div>

            {/* Footer Metadata */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#7a6859', borderTop: '1px solid #e0d1b9', paddingTop: '0.75rem' }}>
              <span>Published: <strong>{book.publish_year}</strong></span>
              <span>ISBN: <strong>{book.isbn}</strong></span>
            </div>
          </div>

          {/* RIGHT PAGE: Synopsis, Quotes & Management */}
          <div className="right-book-page">
            {/* Header: Page Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', letterSpacing: '1px', color: '#8c531b' }}>
                ARCHIVAL SYNOPSIS
              </span>
              <span style={{ fontSize: '0.75rem', color: '#8c651b' }}>
                FOLIO • {book.id}
              </span>
            </div>

            {/* Synopsis Content with Drop Cap */}
            <div style={{ margin: '1.25rem 0', flex: 1 }}>
              <p 
                style={{ 
                  fontFamily: 'var(--font-serif)', 
                  fontSize: '1.12rem', 
                  lineHeight: '1.75', 
                  color: '#2a221b',
                  textAlign: 'justify'
                }}
              >
                <span 
                  style={{ 
                    float: 'left', 
                    fontSize: '3.2rem', 
                    lineHeight: '0.85', 
                    fontFamily: 'var(--font-display)', 
                    fontWeight: '700', 
                    color: leatherColor, 
                    paddingRight: '8px', 
                    paddingTop: '4px' 
                  }}
                >
                  {book.description ? book.description.charAt(0) : 'T'}
                </span>
                {book.description ? book.description.slice(1) : 'his volume holds an enduring place in literary heritage, preserved in the Athenaeum registry for scholars and avid readers alike.'}
              </p>

              {/* Literary Quote / Excerpt Box */}
              {book.notes && (
                <div 
                  style={{ 
                    marginTop: '1.25rem', 
                    padding: '0.85rem 1.1rem', 
                    background: 'rgba(216, 195, 160, 0.3)', 
                    borderLeft: `4px solid ${leatherColor}`, 
                    borderRadius: '0 8px 8px 0',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: '0.98rem',
                    color: '#423326'
                  }}
                >
                  <Quote size={16} color={leatherColor} style={{ marginBottom: '4px' }} />
                  <div>"{book.notes}"</div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Edit & Delete */}
            <div 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderTop: '1px solid #ded0b6', 
                paddingTop: '1rem',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#7a6859' }}>
                Use <strong>← / →</strong> keys to navigate
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-glass"
                  style={{ 
                    color: '#382f28', 
                    borderColor: '#d5c4a5', 
                    background: 'rgba(0,0,0,0.04)',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem'
                  }}
                  onClick={() => onEdit(book)}
                >
                  <Edit3 size={14} color="#8c531b" />
                  <span>Edit Details</span>
                </button>

                <button
                  className="btn-glass"
                  style={{ 
                    color: '#b91c1c', 
                    borderColor: '#fca5a5', 
                    background: 'rgba(239, 68, 68, 0.08)',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.82rem'
                  }}
                  onClick={() => onDeletePrompt(book)}
                >
                  <Trash2 size={14} />
                  <span>Excise Volume</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
