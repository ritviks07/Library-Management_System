import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw,
  Star
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
  const [opening, setOpening] = useState(true);

  // Play page flip sound & trigger opening animation when book changes
  useEffect(() => {
    sound.playPageFlip();
    setOpening(true);
    const timer = setTimeout(() => setOpening(false), 550);
    return () => clearTimeout(timer);
  }, [book?.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        sound.playPageFlip();
        onClose();
      } else if (e.key === 'ArrowLeft' && hasPrev) {
        onPrevBook();
      } else if (e.key === 'ArrowRight' && hasNext) {
        onNextBook();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, onClose, onPrevBook, onNextBook]);

  if (!book) return null;

  const isAvailable = book.copies_available > 0;
  const canReturn = book.copies_available < (book.total_copies || 1);
  const totalCopies = book.total_copies || 1;
  const availablePercentage = Math.round((book.copies_available / totalCopies) * 100);

  return (
    <div className="open-book-viewport" onClick={onClose}>
      <button
        className="tome-nav-arrow tome-nav-left"
        onClick={(e) => { e.stopPropagation(); onPrevBook(); }}
        disabled={!hasPrev}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        className="tome-nav-arrow tome-nav-right"
        onClick={(e) => { e.stopPropagation(); onNextBook(); }}
        disabled={!hasNext}
      >
        <ChevronRight size={20} />
      </button>

      <div 
        className={`grand-tome-wrapper ${opening ? 'is-opening' : ''}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="book-spread-container">
          
          {/* Left Page (Flips open from spine right) */}
          <div className="left-book-page book-page-animated">
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button
                  onClick={() => { sound.playPageFlip(); onClose(); }}
                  className="btn-glass"
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>

                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  ID #{book.id}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <span className="card-genre-tag" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                  {book.genre}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {book.title}
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  by {book.author}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem', color: 'var(--warning-text)' }}>
                  <Star size={14} fill="currentColor" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                    {Number(book.rating || 5.0).toFixed(1)} / 5.0
                  </span>
                </div>
              </div>
            </div>

            {/* Availability Box */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.85rem',
              margin: '0.75rem 0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Circulation</span>
                <span className={`status-pill ${isAvailable ? 'available' : 'loaned'}`}>
                  {isAvailable ? `${book.copies_available}/${totalCopies} Available` : 'Loaned Out'}
                </span>
              </div>

              <div style={{ width: '100%', height: '6px', background: 'var(--bg-element)', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                <div style={{
                  width: `${availablePercentage}%`,
                  height: '100%',
                  background: isAvailable ? 'var(--success-text)' : 'var(--danger-text)',
                  transition: 'width 0.4s ease'
                }} />
              </div>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn-primary-gradient"
                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                  onClick={() => onBorrow(book.id)}
                  disabled={!isAvailable}
                >
                  <CheckCircle2 size={14} />
                  <span>Borrow</span>
                </button>

                <button
                  className="btn-glass"
                  style={{ flex: 1, padding: '0.45rem', fontSize: '0.8rem' }}
                  onClick={() => onReturn(book.id)}
                  disabled={!canReturn}
                >
                  <RotateCcw size={14} />
                  <span>Return</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Published: {book.publish_year}</span>
              <span>ISBN: {book.isbn || 'N/A'}</span>
            </div>
          </div>

          {/* Right Page (Flips open from spine left) */}
          <div className="right-book-page book-page-animated">
            <div>
              <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Description
              </h4>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                {book.description || 'No description available for this volume.'}
              </p>

              {book.notes && (
                <div style={{
                  padding: '0.75rem',
                  background: 'var(--bg-surface)',
                  borderLeft: '3px solid var(--accent-primary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
                  fontStyle: 'italic',
                  marginBottom: '1rem'
                }}>
                  "{book.notes}"
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
              <button
                className="btn-glass"
                onClick={() => {
                  sound.playWaxStamp();
                  onToggleFavorite(book.id);
                }}
              >
                <Bookmark size={14} color={book.is_favorite ? 'var(--warning-text)' : 'currentColor'} />
                <span>{book.is_favorite ? 'Bookmarked' : 'Bookmark'}</span>
              </button>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn-glass"
                  onClick={() => onEdit(book)}
                >
                  <Edit3 size={14} />
                  <span>Edit</span>
                </button>

                <button
                  className="btn-glass"
                  style={{ color: 'var(--danger-text)' }}
                  onClick={() => onDeletePrompt(book)}
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
