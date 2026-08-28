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
            <th style={{ width: '80px' }}>ID</th>
            <th>Tome Title & Author</th>
            <th>Genre</th>
            <th>Year</th>
            <th>Rating</th>
            <th>Circulation</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => {
            const isAvailable = book.copies_available > 0;
            const canReturn = book.copies_available < (book.total_copies || 1);
            const spineColor = book.spine_color || '#7A1C29';

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
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#94a3b8' }}>
                  #{String(book.id).padStart(3, '0')}
                </td>

                {/* Title & Author */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{ 
                        width: '12px', 
                        height: '32px', 
                        borderRadius: '3px', 
                        backgroundColor: spineColor,
                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                        flexShrink: 0
                      }} 
                    />
                    <div>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                        {book.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {book.author}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Genre */}
                <td>
                  <span 
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.05)', 
                      border: '1px solid var(--glass-border)', 
                      padding: '3px 8px', 
                      borderRadius: '6px', 
                      fontSize: '0.78rem',
                      color: '#fbbf24'
                    }}
                  >
                    {book.genre}
                  </span>
                </td>

                {/* Year */}
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
                  {book.publish_year}
                </td>

                {/* Rating */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fde68a' }}>
                    <Star size={14} fill="#fde68a" />
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>
                      {Number(book.rating || 5.0).toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Availability */}
                <td>
                  <span className={`status-pill ${isAvailable ? 'available' : 'loaned'}`}>
                    <span 
                      style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        background: isAvailable ? '#34d399' : '#fb7185' 
                      }} 
                    />
                    {isAvailable ? `${book.copies_available} Available` : 'All Loaned'}
                  </span>
                </td>

                {/* Actions */}
                <td style={{ textAlign: 'right' }}>
                  <div 
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Favorite */}
                    <button
                      className="btn-glass"
                      style={{ padding: '0.35rem 0.6rem' }}
                      onClick={() => {
                        sound.playWaxStamp();
                        onToggleFavorite(book.id);
                      }}
                      title="Bookmark"
                    >
                      <Bookmark 
                        size={14} 
                        color={book.is_favorite ? '#fbbf24' : 'currentColor'} 
                        fill={book.is_favorite ? '#fbbf24' : 'none'} 
                      />
                    </button>

                    {/* Borrow / Return Quick Action */}
                    {isAvailable ? (
                      <button
                        className="btn-glass"
                        style={{ padding: '0.35rem 0.6rem', color: '#34d399' }}
                        onClick={() => onBorrow(book.id)}
                        title="Borrow 1 copy"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                    ) : (
                      <button
                        className="btn-glass"
                        style={{ padding: '0.35rem 0.6rem', color: '#fb7185' }}
                        onClick={() => onReturn(book.id)}
                        disabled={!canReturn}
                        title="Return copy"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}

                    {/* Edit */}
                    <button
                      className="btn-glass"
                      style={{ padding: '0.35rem 0.6rem' }}
                      onClick={() => onEditBook(book)}
                      title="Edit tome details"
                    >
                      <Edit3 size={14} />
                    </button>

                    {/* Delete */}
                    <button
                      className="btn-glass"
                      style={{ padding: '0.35rem 0.6rem', color: '#f43f5e' }}
                      onClick={() => onDeletePrompt(book)}
                      title="Remove tome from library"
                    >
                      <Trash2 size={14} />
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
