import React from 'react';
import { 
  Bookmark, 
  BookOpen, 
  CheckCircle2, 
  RotateCcw, 
  Star, 
  Plus
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function BookCardGrid({ 
  books = [], 
  onSelectBook, 
  onToggleFavorite, 
  onBorrow, 
  onReturn, 
  onOpenAddModal 
}) {
  return (
    <div className="modern-grid-container">
      {books.map((book) => {
        const isAvailable = book.copies_available > 0;
        const canReturn = book.copies_available < (book.total_copies || 1);
        const accentColor = book.spine_color || '#6366f1';

        return (
          <div key={book.id} className="book-card-3d">
            {/* Header */}
            <div className="card-cover-header">
              <div className="card-badge-row">
                <span className="card-genre-tag">
                  {book.genre}
                </span>

                <button
                  className="card-favorite-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    sound.playWaxStamp();
                    onToggleFavorite(book.id);
                  }}
                  title="Bookmark"
                >
                  <Bookmark 
                    size={14} 
                    color={book.is_favorite ? 'var(--warning-text)' : 'var(--text-muted)'} 
                    fill={book.is_favorite ? 'var(--warning-text)' : 'none'} 
                  />
                </button>
              </div>

              <div>
                <h3 className="card-cover-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '6px', height: '14px', borderRadius: '2px', backgroundColor: accentColor, display: 'inline-block' }} />
                  {book.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', color: 'var(--warning-text)' }}>
                    <Star size={12} fill="currentColor" />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                    {Number(book.rating || 5.0).toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    • {book.publish_year}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="card-body-content">
              <div className="card-author-text">
                by <strong style={{ color: 'var(--text-primary)' }}>{book.author}</strong>
              </div>

              <p className="card-description-preview">
                {book.description || 'No description available for this book entry.'}
              </p>

              <div className="card-meta-row">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  ISBN: {book.isbn ? book.isbn.slice(0, 13) : 'N/A'}
                </span>

                <span className={`status-pill ${isAvailable ? 'available' : 'loaned'}`}>
                  {isAvailable ? `${book.copies_available} left` : 'Loaned Out'}
                </span>
              </div>

              {/* Actions */}
              <div className="card-actions-row">
                <button
                  className="btn-glass"
                  style={{ flex: 1, padding: '0.4rem 0.6rem', fontSize: '0.78rem' }}
                  onClick={() => {
                    sound.playPageFlip();
                    onSelectBook(book);
                  }}
                >
                  <BookOpen size={14} />
                  <span>View</span>
                </button>

                {isAvailable ? (
                  <button
                    className="btn-primary-gradient"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBorrow(book.id);
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>Borrow</span>
                  </button>
                ) : (
                  <button
                    className="btn-glass"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem', color: 'var(--danger-text)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReturn(book.id);
                    }}
                    disabled={!canReturn}
                  >
                    <RotateCcw size={13} />
                    <span>Return</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Book Card */}
      <div 
        className="book-card-3d" 
        style={{ 
          border: '1px dashed var(--border-color)', 
          background: 'var(--bg-surface)',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '280px',
          cursor: 'pointer'
        }}
        onClick={() => {
          sound.playPageFlip();
          onOpenAddModal();
        }}
      >
        <div style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div 
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              marginBottom: '0.75rem' 
            }}
          >
            <Plus size={20} />
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
            Add New Book
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Create a new book entry in the library
          </p>
        </div>
      </div>
    </div>
  );
}
