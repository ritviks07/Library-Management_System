import React from 'react';
import { 
  Bookmark, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Star, 
  CheckCircle2, 
  RotateCcw 
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function BookTableView({
  books = [],
  onSelectBook,
  onEditBook,
  onDeletePrompt,
  onToggleFavorite,
  onBorrow,
  onReturn
}) {
  return (
    <div className="table-glass-wrapper">
      <table className="modern-data-table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Rating</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const isAvailable = book.copies_available > 0;
            const canReturn = book.copies_available < (book.total_copies || 1);
            const spineColor = book.spine_color || '#6366f1';

            return (
              <tr 
                key={book.id} 
                onClick={() => {
                  sound.playPageFlip();
                  onSelectBook(book);
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* ID */}
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  #{book.id}
                </td>

                {/* Title */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span 
                      style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: spineColor,
                        display: 'inline-block',
                        flexShrink: 0
                      }} 
                    />
                    <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {book.title}
                    </span>
                  </div>
                </td>

                {/* Author */}
                <td style={{ color: 'var(--text-secondary)' }}>
                  {book.author}
                </td>

                {/* Genre */}
                <td>
                  <span 
                    style={{ 
                      background: 'var(--bg-element)', 
                      border: '1px solid var(--border-color)', 
                      padding: '2px 7px', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {book.genre}
                  </span>
                </td>

                {/* Year */}
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                  {book.publish_year}
                </td>

                {/* Rating */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--warning-text)' }}>
                    <Star size={13} fill="currentColor" />
                    <span style={{ fontWeight: '600', fontSize: '0.78rem' }}>
                      {Number(book.rating || 5.0).toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Availability */}
                <td>
                  <span className={`status-pill ${isAvailable ? 'available' : 'loaned'}`}>
                    {isAvailable ? `${book.copies_available}/${book.total_copies || 1} Available` : 'Loaned Out'}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div 
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Favorite */}
                    <button
                      className="btn-glass"
                      style={{ padding: '0.3rem 0.5rem' }}
                      onClick={() => {
                        sound.playWaxStamp();
                        onToggleFavorite(book.id);
                      }}
                      title="Bookmark"
                    >
                      <Bookmark 
                        size={13} 
                        color={book.is_favorite ? 'var(--warning-text)' : 'currentColor'} 
                        fill={book.is_favorite ? 'var(--warning-text)' : 'none'} 
                      />
                    </button>

                    {/* View */}
                    <button
                      className="btn-glass"
                      style={{ padding: '0.3rem 0.5rem' }}
                      onClick={() => onSelectBook(book)}
                      title="View Details"
                    >
                      <BookOpen size={13} />
                    </button>

                    {/* Borrow / Return */}
                    {isAvailable ? (
                      <button
                        className="btn-glass"
                        style={{ padding: '0.3rem 0.5rem', color: 'var(--success-text)' }}
                        onClick={() => onBorrow(book.id)}
                        title="Borrow"
                      >
                        <CheckCircle2 size={13} />
                      </button>
                    ) : (
                      <button
                        className="btn-glass"
                        style={{ padding: '0.3rem 0.5rem', color: 'var(--danger-text)' }}
                        onClick={() => onReturn(book.id)}
                        disabled={!canReturn}
                        title="Return"
                      >
                        <RotateCcw size={13} />
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      className="btn-glass"
                      style={{ padding: '0.3rem 0.5rem' }}
                      onClick={() => onEditBook(book)}
                      title="Edit"
                    >
                      <Edit3 size={13} />
                    </button>

                    {/* Delete */}
                    <button
                      className="btn-glass"
                      style={{ padding: '0.3rem 0.5rem', color: 'var(--danger-text)' }}
                      onClick={() => onDeletePrompt(book)}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
