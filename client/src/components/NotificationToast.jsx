import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function NotificationToast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => onClose(), 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isError = type === 'error';

  return (
    <div className="parchment-toast">
      <div style={{
        color: isError ? 'var(--danger-text)' : 'var(--success-text)',
        display: 'flex', alignItems: 'center'
      }}>
        {isError ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
      </div>

      <span style={{ fontSize: '0.82rem', fontWeight: '500', flex: 1, color: 'var(--text-primary)' }}>{message}</span>

      <button
        onClick={onClose}
        style={{
          background: 'transparent', border: 'none', color: 'var(--text-muted)',
          cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center'
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
