import React from 'react';
import { 
  Bookmark, 
  BookOpen, 
  CheckCircle2, 
  RotateCcw, 
  Star, 
  ExternalLink,
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
        const coverColor = book.spine_color || '#7A1C29';

        return (
          <div key={book.id} className="book-card-3d">
            {/* 3D Cover Header */}
            <div 
              className="card-cover-header"
              style={{
                background: `linear-gradient(135deg, ${coverColor} 0%, rgba(15, 23, 42, 0.95) 100%)`,
                borderBottom: `2px solid ${coverColor}`
              }}
            >
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
                  title={book.is_favorite ? 'Bookmarked favorite' : 'Bookmark this tome'}
                >
                  <Bookmark 
                    size={16} 
                    color={book.is_favorite ? '#fbbf24' : '#94a3b8'} 
                    fill={book.is_favorite ? '#fbbf24' : 'none'} 
                  />
                </button>
              </div>

              <div>
                <h3 className="card-cover-title">{book.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', color: '#fbbf24' }}>
                    <Star size={13} fill="#fbbf24" />
                  </div>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fef08a' }}>
                    {Number(book.rating || 5.0).toFixed(1)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                    • {book.publish_year}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="card-body-content">
              <div className="card-author-text">
                By <strong style={{ color: 'var(--text-primary)' }}>{book.author}</strong>
              </div>

              <p className="card-description-preview">
                {book.description || 'An esteemed classic work preserved in the Athenaeum catalog.'}
              </p>

              {/* Meta Row */}
              <div className="card-meta-row">
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  ISBN: {book.isbn ? book.isbn.slice(0, 10) + '...' : 'N/A'}
                </span>

                <span 
                  style={{ 
                    fontWeight: '600', 
                    color: isAvailable ? 'var(--emerald-400)' : 'var(--rose-400)' 
                  }}
                >
                  {isAvailable ? `${book.copies_available}/${book.total_copies || 1} Available` : 'Loaned Out'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="card-actions-row">
                <button
                  className="btn-glass"
                  style={{ flex: 1, padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    sound.playPageFlip();
                    onSelectBook(book);
                  }}
                >
                  <BookOpen size={15} color="#fbbf24" />
                  <span>Inspect</span>
                </button>

                {isAvailable ? (
                  <button
                    className="btn-primary-gradient"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onBorrow(book.id);
                    }}
                    title="Borrow a copy of this book"
                  >
                    <CheckCircle2 size={14} />
                    <span>Borrow</span>
                  </button>
                ) : (
                  <button
                    className="btn-glass"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', color: '#fb7185', borderColor: 'rgba(244,63,94,0.3)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onReturn(book.id);
                    }}
                    disabled={!canReturn}
                    title="Return a borrowed copy"
                  >
                    <RotateCcw size={14} />
                    <span>Return</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Add New Tome Card in Grid */}
      <div 
        className="book-card-3d" 
        style={{ 
          border: '2px dashed rgba(245, 158, 11, 0.3)', 
          background: 'rgba(245, 158, 11, 0.02)',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '340px',
          cursor: 'pointer'
        }}
        onClick={() => {
          sound.playPageFlip();
          onOpenAddModal();
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div 
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: 'rgba(245, 158, 11, 0.12)', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#fbbf24',
              marginBottom: '1rem' 
            }}
          >
            <Plus size={28} />
          </div>
          <h4 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.1rem', color: '#fbbf24', marginBottom: '4px' }}>
            Add a Book
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Register a new book into the library catalogue
          </p>
        </div>
      </div>
    </div>
  );
}
