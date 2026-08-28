import React, { useEffect, useState } from 'react';
import { X, Library, BookOpen, Bookmark, Database, TrendingUp, BarChart2, CheckCircle2 } from 'lucide-react';
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

  const statCards = stats ? [
    { label: 'Total Titles',     value: stats.totalTitles,      color: 'var(--accent-primary)',  Icon: Library },
    { label: 'Available Copies', value: stats.availableCopies,  color: 'var(--success-text)',    Icon: BookOpen },
    { label: 'In Circulation',   value: stats.borrowedCopies,   color: 'var(--danger-text)',     Icon: TrendingUp },
    { label: 'Bookmarked',       value: stats.favoritesCount,   color: 'var(--warning-text)',    Icon: Bookmark },
  ] : [];

  return (
    <div className="library-modal-overlay" onClick={onClose}>
      <div
        className="modern-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '720px' }}
      >
        <button onClick={onClose} className="modal-close-btn" title="Close"><X size={16} /></button>

        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
            background: 'var(--accent-subtle)', border: '1px solid var(--accent-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)'
          }}>
            <BarChart2 size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              System Analytics
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time inventory & circulation metrics
            </p>
          </div>
        </div>

        {loading || !stats ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Loading metrics...</p>
          </div>
        ) : (
          <div>
            {/* Stat Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1.25rem'
            }}>
              {statCards.map(({ label, value, color, Icon }) => (
                <div key={label} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center'
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-element)',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '6px', color
                  }}>
                    <Icon size={16} />
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Availability Progress Bar */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.8rem' }}>
                <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>
                  Availability Ratio
                </span>
                <span style={{ fontWeight: '600', color: 'var(--success-text)' }}>
                  {availablePct}% ({stats.availableCopies}/{totalCopies} copies)
                </span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--bg-element)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  width: `${availablePct}%`, height: '100%',
                  background: 'var(--accent-primary)',
                  borderRadius: '3px'
                }} />
              </div>
            </div>

            {/* Genre Distribution & Database Engine */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', padding: '1rem'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
                  Genre Breakdown
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '160px', overflowY: 'auto' }}>
                  {Object.entries(stats.genreCounts || {}).map(([genre, count]) => {
                    const maxGenre = Math.max(...Object.values(stats.genreCounts || { a: 1 }));
                    const pct = Math.round((count / maxGenre) * 100);
                    return (
                      <div key={genre}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{genre}</span>
                          <strong style={{ color: 'var(--text-primary)' }}>{count}</strong>
                        </div>
                        <div style={{ width: '100%', height: '3px', background: 'var(--bg-element)', borderRadius: '2px' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-primary)', borderRadius: '2px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
              }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.75rem' }}>
                    Database Telemetry
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                    <Database size={14} color="var(--success-text)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {stats.dbEngine || 'PostgreSQL Engine'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    Relational database storing books, circulation state, genres, and metadata.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--success-text)', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <CheckCircle2 size={13} />
                  <span>Operational</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
