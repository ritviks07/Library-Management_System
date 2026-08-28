import React, { useEffect, useState } from 'react';
import { 
  X, 
  Library, 
  BookOpen, 
  Bookmark, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp,
  BarChart2
} from 'lucide-react';
import { fetchStats } from '../services/api';

export default function StatsLedger({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchStats()
        .then(res => setStats(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalCopies = stats ? (stats.availableCopies + stats.borrowedCopies) : 0;
  const availablePct = totalCopies > 0 ? Math.round((stats.availableCopies / totalCopies) * 100) : 100;

  return (
    <div className="library-modal-overlay" onClick={onClose}>
      <div 
        className="modern-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '780px' }}
      >
        <button
          onClick={onClose}
          className="modal-close-btn"
          title="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <BarChart2 size={22} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-brand)', fontSize: '1.4rem', color: '#fff', lineHeight: 1.2 }}>
              Library Ledger & Telemetry
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Real-time archival metrics, inventory distribution, and database status
            </p>
          </div>
        </div>

        {loading || !stats ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            Auditing the shelves and computing collection metrics...
          </div>
        ) : (
          <div>
            {/* 4 Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              
              {/* Total Titles */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.1rem', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <Library size={18} />
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: '800', color: '#fff' }}>
                  {stats.totalTitles}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                  UNIQUE TITLES
                </div>
              </div>

              {/* Available Copies */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.1rem', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <BookOpen size={18} />
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: '800', color: '#34d399' }}>
                  {stats.availableCopies}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                  ON SHELVES
                </div>
              </div>

              {/* Borrowed Copies */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.1rem', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <TrendingUp size={18} />
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: '800', color: '#fb7185' }}>
                  {stats.borrowedCopies}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                  IN CIRCULATION
                </div>
              </div>

              {/* Bookmarked */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.1rem', textAlign: 'center' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                  <Bookmark size={18} />
                </div>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: '800', color: '#fbbf24' }}>
                  {stats.favoritesCount}
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                  BOOKMARKED
                </div>
              </div>
            </div>

            {/* Circulation Ratio Progress Bar */}
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  Shelf Availability Ratio
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#34d399' }}>
                  {availablePct}% Available ({stats.availableCopies}/{totalCopies} copies)
                </span>
              </div>
              <div style={{ width: '100%', height: '10px', background: 'rgba(244, 63, 94, 0.3)', borderRadius: '6px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${availablePct}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
                    borderRadius: '6px'
                  }} 
                />
              </div>
            </div>

            {/* Genre Distribution & DB Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {/* Genre Bars */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.1rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#fbbf24', letterSpacing: '1px', display: 'block', marginBottom: '0.85rem' }}>
                  GENRE DISTRIBUTION
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
                  {Object.entries(stats.genreCounts || {}).map(([genre, count]) => {
                    const maxGenre = Math.max(...Object.values(stats.genreCounts || { a: 1 }));
                    const pct = Math.round((count / maxGenre) * 100);
                    return (
                      <div key={genre}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{genre}</span>
                          <strong style={{ color: '#fff' }}>{count} {count === 1 ? 'tome' : 'tomes'}</strong>
                        </div>
                        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', borderRadius: '2px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Database Telemetry */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '14px', padding: '1.1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: '700', color: '#818cf8', letterSpacing: '1px', display: 'block', marginBottom: '0.85rem' }}>
                    SYSTEM ENGINE STATUS
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
                    <Database size={16} color="#34d399" />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>
                      {stats.dbEngine || 'PostgreSQL Engine'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                    The persistence tier is maintaining ACID transactions for library checkouts, book inscriptions, and real-time inventory counts.
                  </p>
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Status: <strong style={{ color: '#34d399' }}>Operational</strong></span>
                  <span>Latency: <strong>&lt; 5ms</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
