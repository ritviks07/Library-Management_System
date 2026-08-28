import React, { useState, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  AlertCircle, 
  Star 
} from 'lucide-react';
import { sound } from '../utils/audio';

const LEATHER_COLORS = [
  { name: 'Crimson Ruby', hex: '#7A1C29' },
  { name: 'Royal Indigo', hex: '#1E3D59' },
  { name: 'Emerald Velvet', hex: '#1E4D36' },
  { name: 'Cognac Amber', hex: '#8C531B' },
  { name: 'Amethyst Plum', hex: '#4D2348' },
  { name: 'Obsidian Slate', hex: '#22252A' },
  { name: 'Vintage Bronze', hex: '#69381A' },
  { name: 'Deep Teal', hex: '#184A45' }
];

const GENRES = [
  'Classic Fiction',
  'Science Fiction',
  'Fantasy',
  'Dystopian',
  'Gothic Horror',
  'Romance / Classic',
  'Historical Fiction',
  'Philosophical Fiction',
  'Psychological Fiction',
  'Epic Poetry / Classic',
  'Mystery / Detective',
  'Non-Fiction / Philosophy'
];

export default function EditBookModal({ book, isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Classic Fiction',
    publish_year: 2000,
    copies_available: 1,
    total_copies: 1,
    spine_color: '#7A1C29',
    description: '',
    rating: 4.8,
    notes: '',
    is_favorite: false
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        genre: book.genre || 'Classic Fiction',
        publish_year: book.publish_year || new Date().getFullYear(),
        copies_available: book.copies_available ?? 1,
        total_copies: book.total_copies ?? book.copies_available ?? 1,
        spine_color: book.spine_color || '#7A1C29',
        description: book.description || '',
        rating: book.rating ?? 4.8,
        notes: book.notes || '',
        is_favorite: Boolean(book.is_favorite)
      });
      setErrors({});
    }
  }, [book, isOpen]);

  if (!isOpen || !book) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required.';
    if (!formData.author.trim()) errs.author = 'Author name is required.';
    if (!formData.isbn.trim()) {
      errs.isbn = 'ISBN is required.';
    }
    if (!formData.genre.trim()) errs.genre = 'Genre is required.';
    if (isNaN(formData.publish_year) || formData.publish_year < 1000) {
      errs.publish_year = 'Enter a valid 4-digit year.';
    }
    if (formData.copies_available < 0) {
      errs.copies_available = 'Copies available cannot be negative.';
    }
    if (formData.total_copies < formData.copies_available) {
      errs.total_copies = 'Total copies cannot be less than available copies.';
    }
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    sound.playQuillScratch();
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      sound.playWaxStamp();
      await onSubmit(book.id, {
        ...formData,
        publish_year: parseInt(formData.publish_year, 10),
        copies_available: parseInt(formData.copies_available, 10),
        total_copies: parseInt(formData.total_copies, 10),
        rating: parseFloat(formData.rating)
      });
      onClose();
    } catch (err) {
      setErrors({ global: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="library-modal-overlay" onClick={onClose}>
      <div 
        className="modern-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="modal-close-btn"
          title="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{ 
              width: '42px', 
              height: '42px', 
              borderRadius: '12px', 
              background: 'rgba(99, 102, 241, 0.15)', 
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#818cf8'
            }}
          >
            <Edit3 size={20} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.4rem', color: '#fff', lineHeight: 1.2 }}>
              Edit Tome Inscription
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Updating Folio #{book.id} • {book.title}
            </p>
          </div>
        </div>

        {errors.global && (
          <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.3)', color: '#fb7185', padding: '0.75rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{errors.global}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Live Spine Preview & Color Picker */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              background: 'rgba(0,0,0,0.3)', 
              border: '1px solid var(--glass-border)', 
              borderRadius: '12px', 
              padding: '1rem',
              marginBottom: '1.25rem' 
            }}
          >
            <div 
              style={{ 
                width: '48px', 
                height: '110px', 
                borderRadius: '5px',
                background: `linear-gradient(90deg, rgba(0,0,0,0.6) 0%, rgba(255,255,255,0.2) 20%, ${formData.spine_color} 50%, rgba(0,0,0,0.7) 100%)`,
                boxShadow: '0 8px 18px rgba(0,0,0,0.6)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '6px 2px',
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <div style={{ width: '80%', height: '2px', background: 'rgba(251,191,36,0.8)' }} />
              <div style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '0.55rem', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '85px', textOverflow: 'ellipsis' }}>
                {formData.title || 'Edit Tome'}
              </div>
              <div style={{ width: '80%', height: '2px', background: 'rgba(251,191,36,0.8)' }} />
            </div>

            <div style={{ flex: 1 }}>
              <span className="form-label" style={{ display: 'block', marginBottom: '6px' }}>
                Spine Finish:
              </span>
              <div className="color-swatch-row">
                {LEATHER_COLORS.map((c) => (
                  <div
                    key={c.hex}
                    className={`color-swatch-circle ${formData.spine_color === c.hex ? 'selected' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => {
                      sound.playPageFlip();
                      setFormData(prev => ({ ...prev, spine_color: c.hex }));
                    }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Tome Title *</label>
              <input
                type="text"
                name="title"
                className={`form-input ${errors.title ? 'error' : ''}`}
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span className="form-error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Author Name *</label>
              <input
                type="text"
                name="author"
                className={`form-input ${errors.author ? 'error' : ''}`}
                value={formData.author}
                onChange={handleChange}
              />
              {errors.author && <span className="form-error-text">{errors.author}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Genre Category</label>
              <select
                name="genre"
                className="modern-select"
                value={formData.genre}
                onChange={handleChange}
                style={{ width: '100%' }}
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ISBN Identifier</label>
              <input
                type="text"
                name="isbn"
                className={`form-input ${errors.isbn ? 'error' : ''}`}
                value={formData.isbn}
                onChange={handleChange}
              />
              {errors.isbn && <span className="form-error-text">{errors.isbn}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Copies Available</label>
              <input
                type="number"
                name="copies_available"
                min="0"
                className={`form-input ${errors.copies_available ? 'error' : ''}`}
                value={formData.copies_available}
                onChange={handleChange}
              />
              {errors.copies_available && <span className="form-error-text">{errors.copies_available}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Total Inventory Copies</label>
              <input
                type="number"
                name="total_copies"
                min="1"
                className={`form-input ${errors.total_copies ? 'error' : ''}`}
                value={formData.total_copies}
                onChange={handleChange}
              />
              {errors.total_copies && <span className="form-error-text">{errors.total_copies}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Rating: ★ {formData.rating}</label>
            <input
              type="range"
              name="rating"
              min="1.0"
              max="5.0"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              style={{ width: '100%', accentColor: '#f59e0b', cursor: 'pointer' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Archival Synopsis</label>
            <textarea
              name="description"
              className="form-input"
              rows="3"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notable Excerpt / Quote</label>
            <input
              type="text"
              name="notes"
              className="form-input"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
            <button
              type="button"
              className="btn-glass"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary-gradient"
              disabled={submitting}
            >
              <Edit3 size={16} />
              <span>{submitting ? 'Saving Changes...' : 'Save Inscription'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
