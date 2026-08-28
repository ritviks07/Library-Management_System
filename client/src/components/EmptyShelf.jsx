import React from 'react';
import { BookOpen, Plus, RotateCcw, SearchX } from 'lucide-react';
import { sound } from '../utils/audio';

export default function EmptyShelf({ onOpenAdd, onResetSeed, isFiltered }) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'var(--bg-surface)',
      border: '1px border var(--border-color)',
      borderRadius: 'var(--radius-lg)',
      maxWidth: '520px',
      margin: '2rem auto'
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', marginBottom: '1rem'
      }}>
        {isFiltered ? <SearchX size={24} /> : <BookOpen size={24} />}
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
        {isFiltered ? 'No Books Found' : 'No Books in Library'}
      </h3>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: '1.5', maxWidth: '380px', margin: '0 auto 1.5rem auto' }}>
        {isFiltered
          ? 'No books match the specified search or filter parameters. Try clearing your search.'
          : 'Start by adding a new book to the library or loading default data.'
        }
      </p>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {isFiltered ? (
          <button className="btn-primary-gradient" onClick={onResetSeed}>
            <RotateCcw size={14} />
            <span>Reset Search & Filters</span>
          </button>
        ) : (
          <>
            <button className="btn-primary-gradient" onClick={() => { sound.playPageFlip(); onOpenAdd(); }}>
              <Plus size={15} />
              <span>Add Book</span>
            </button>
            <button className="btn-glass" onClick={() => { sound.playWaxStamp(); onResetSeed(); }}>
              <RotateCcw size={14} />
              <span>Load Defaults</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
