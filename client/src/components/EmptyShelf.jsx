import React from 'react';
import { Sparkles, Plus, RotateCcw, SearchX } from 'lucide-react';
import { sound } from '../utils/audio';

export default function EmptyShelf({ onOpenAdd, onResetSeed, isFiltered }) {
  return (
    <div 
      style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem', 
        background: 'var(--glass-bg)', 
        backdropFilter: 'blur(16px)',
        border: '1px dashed var(--glass-border)',
        borderRadius: '20px',
        maxWidth: '580px',
        margin: '3rem auto'
      }}
    >
      <div 
        style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '18px', 
          background: 'rgba(245, 158, 11, 0.12)', 
          border: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#fbbf24',
          marginBottom: '1.25rem' 
        }}
      >
        {isFiltered ? <SearchX size={32} /> : <Sparkles size={32} />}
      </div>

      <h3 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
        {isFiltered ? 'No Books Match Your Query' : 'The Library Shelves Are Clear'}
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '440px', margin: '0 auto 1.75rem auto' }}>
        {isFiltered 
          ? 'No books in the library match the selected search or filter criteria. Try adjusting your query or resetting filters.'
          : 'Every great library begins with a single book. Add a new book to the catalog or restore the default collection.'}
      </p>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {isFiltered ? (
          <button
            className="btn-primary-gradient"
            onClick={onResetSeed}
          >
            <RotateCcw size={16} />
            <span>Reset Search & Filters</span>
          </button>
        ) : (
          <>
            <button
              className="btn-primary-gradient"
              onClick={() => {
                sound.playPageFlip();
                onOpenAdd();
              }}
            >
              <Plus size={18} />
              <span>Add a Book</span>
            </button>

            <button
              className="btn-glass"
              onClick={() => {
                sound.playWaxStamp();
                onResetSeed();
              }}
            >
              <Sparkles size={16} color="#fbbf24" />
              <span>Populate Classic Archive</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
