import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { sound } from '../utils/audio';

const GENRES = [
  'Classic Fiction',
  'Science Fiction',
  'Fantasy',
  'Dystopian',
  'Gothic Horror',
  'Romance',
  'Historical Fiction',
  'Philosophy',
  'Psychology',
  'Mystery',
  'Non-Fiction'
];

export default function AddBookModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: 'Classic Fiction',
    publish_year: new Date().getFullYear(),
    copies_available: 3,
    total_copies: 3,
    spine_color: '#6366f1',
    description: '',
    rating: 4.5,
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Title is required.';
    if (!formData.author.trim()) errs.author = 'Author is required.';
    if (!formData.isbn.trim()) {
      errs.isbn = 'ISBN is required.';
    }
    if (isNaN(formData.publish_year) || formData.publish_year < 1000) {
      errs.publish_year = 'Enter a valid 4-digit year.';
    }
    if (formData.copies_available < 1) {
      errs.copies_available = 'Must have at least 1 copy.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      sound.playWaxStamp();
      await onSubmit({
        ...formData,
        publish_year: parseInt(formData.publish_year, 10),
        copies_available: parseInt(formData.copies_available, 10),
        total_copies: parseInt(formData.total_copies || formData.copies_available, 10),
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
      <div className="modern-modal-card" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn" title="Close">
          <X size={16} />
        </button>

        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          Add New Book
        </h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Fill in the details to add a new book to the library catalog.
        </p>

        {errors.global && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger-text)', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={15} />
            <span>{errors.global}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Book title..."
                value={formData.title}
                onChange={handleChange}
              />
              {errors.title && <span className="form-error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Author *</label>
              <input
                type="text"
                name="author"
                className={`form-input ${errors.author ? 'error' : ''}`}
                placeholder="Author name..."
                value={formData.author}
                onChange={handleChange}
              />
              {errors.author && <span className="form-error-text">{errors.author}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Genre</label>
              <select name="genre" className="form-input" value={formData.genre} onChange={handleChange}>
                {GENRES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">ISBN *</label>
              <input
                type="text"
                name="isbn"
                className={`form-input ${errors.isbn ? 'error' : ''}`}
                placeholder="e.g. 978-0140449334"
                value={formData.isbn}
                onChange={handleChange}
              />
              {errors.isbn && <span className="form-error-text">{errors.isbn}</span>}
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Publish Year</label>
              <input
                type="number"
                name="publish_year"
                className={`form-input ${errors.publish_year ? 'error' : ''}`}
                value={formData.publish_year}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Copies</label>
              <input
                type="number"
                name="copies_available"
                min="1"
                className={`form-input ${errors.copies_available ? 'error' : ''}`}
                value={formData.copies_available}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10) || 1;
                  setFormData(prev => ({ ...prev, copies_available: val, total_copies: val }));
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label">Rating</label>
              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--warning-text)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                ★ {formData.rating} / 5.0
              </span>
            </div>
            <div className="custom-range-slider-container">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>1.0</span>
              <input
                type="range"
                name="rating"
                min="1.0"
                max="5.0"
                step="0.1"
                className="custom-range-slider"
                value={formData.rating}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>5.0</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input"
              rows="3"
              placeholder="Brief summary..."
              value={formData.description}
              onChange={handleChange}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button type="button" className="btn-glass" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary-gradient" disabled={submitting}>
              <Plus size={15} />
              <span>{submitting ? 'Creating...' : 'Create Book'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
