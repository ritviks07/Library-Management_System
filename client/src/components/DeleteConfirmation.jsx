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
    }, 400);
  };

  return (
    <div className="library-modal-overlay" onClick={onClose}>
      <div 
        className="modern-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', textAlign: 'center' }}
      >
        <button
          onClick={onClose}
          className="modal-close-btn"
          title="Cancel"
        >
          <X size={18} />
        </button>

        {/* Warning Icon */}
        <div 
          style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: '16px', 
            background: 'rgba(244, 63, 94, 0.15)', 
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#fb7185',
            marginBottom: '1rem' 
          }}
        >
          <AlertTriangle size={28} />
        </div>

        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fb7185', letterSpacing: '1.5px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
          Permanent Removal Confirmation
        </span>

        <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.45rem', color: '#fff', margin: '0.25rem 0 0.75rem 0' }}>
          Excise Volume #{book.id}?
        </h3>

        <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '0.75rem 0 1.5rem 0' }}>
          You are about to permanently remove <strong>"{book.title}"</strong> by <em>{book.author}</em> from The Athenaeum collection. This action cannot be reversed.
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            className="btn-glass"
            onClick={onClose}
            disabled={isDeleting}
            style={{ flex: 1 }}
          >
            Cancel & Keep
          </button>

          <button
            className="btn-danger-gradient"
            onClick={handleConfirm}
            disabled={isDeleting}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Removing...' : 'Excise Volume'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
