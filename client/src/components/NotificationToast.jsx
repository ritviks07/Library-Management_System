import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';

export default function NotificationToast({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="parchment-toast">
      <div 
        style={{ 
          width: '28px', 
          height: '28px', 
          borderRadius: '50%', 
          background: type === 'error' ? 'rgba(244,63,94,0.2)' : 'rgba(16,185,129,0.2)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {type === 'error' ? (
          <AlertCircle size={16} color="#fb7185" />
        ) : (
          <CheckCircle2 size={16} color="#34d399" />
        )}
      </div>

      <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{message}</span>

      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '6px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
