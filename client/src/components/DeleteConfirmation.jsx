import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { sound } from '../utils/audio';

export default function DeleteConfirmation({ book, isOpen, onClose, onConfirm }) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !book) return null;

  const handleConfirm = () => {
    sound.playTearPaper();
    setIsDeleting(true);
    setTimeout(() => {
      onConfirm(book.id);
      setIsDeleting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="library-modal-overlay" onClick={onClose}>
      <div className="modern-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px', textAlign: 'center' }}>
        <button onClick={onClose} className="modal-close-btn" title="Cancel">
          <X size={15} />
        </button>

        <div style={{
          width: '44px', height: '44px', borderRadius: '50%',
          background: 'var(--danger-bg)', border: '1px solid var(--danger-border)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--danger-text)', marginBottom: '0.85rem'
        }}>
          <AlertTriangle size={20} />
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Delete Book
        </h3>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
          Are you sure you want to delete <strong>"{book.title}"</strong>? This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-glass" onClick={onClose} disabled={isDeleting} style={{ flex: 1 }}>
            Cancel
          </button>
          <button className="btn-danger-gradient" onClick={handleConfirm} disabled={isDeleting} style={{ flex: 1 }}>
            <Trash2 size={14} />
            <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
