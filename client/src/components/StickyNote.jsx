import React, { useState, useEffect } from 'react';
import { 
  StickyNote as StickyIcon, 
  X, 
  Minimize2, 
  Maximize2, 
  Trash2, 
  Check, 
  Palette,
  Pin
} from 'lucide-react';
import { sound } from '../utils/audio';

const COLOR_THEMES = {
  yellow: {
    bg: '#fef08a',
    headerBg: '#fde047',
    text: '#1e293b',
    border: '#eab308',
    tape: 'rgba(253, 224, 71, 0.4)',
    accent: '#ca8a04'
  },
  blue: {
    bg: '#bae6fd',
    headerBg: '#7dd3fc',
    text: '#0f172a',
    border: '#0284c7',
    tape: 'rgba(125, 211, 252, 0.4)',
    accent: '#0369a1'
  },
  green: {
    bg: '#bbf7d0',
    headerBg: '#86efac',
    text: '#064e3b',
    border: '#16a34a',
    tape: 'rgba(134, 239, 172, 0.4)',
    accent: '#15803d'
  },
  pink: {
    bg: '#fbcfe8',
    headerBg: '#f472b6',
    text: '#831843',
    border: '#db2777',
    tape: 'rgba(244, 114, 182, 0.4)',
    accent: '#be185d'
  },
  purple: {
    bg: '#e9d5ff',
    headerBg: '#c084fc',
    text: '#4c1d95',
    border: '#9333ea',
    tape: 'rgba(192, 132, 252, 0.4)',
    accent: '#7e22ce'
  }
};

export default function StickyNote({ isOpen, onClose }) {
  const [title, setTitle] = useState(() => {
    return localStorage.getItem('athenaeum_note_title') || "Desk Memo & Reading List";
  });

  const [content, setContent] = useState(() => {
    return localStorage.getItem('athenaeum_note_content') || 
      "📌 Quick Library Reminders:\n• Return 'Dune' by Friday\n• Add new Sci-Fi recommendations\n• Check reserved books list";
  });

  const [color, setColor] = useState(() => {
    return localStorage.getItem('athenaeum_note_color') || 'yellow';
  });

  const [isMinimized, setIsMinimized] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [savedBadge, setSavedBadge] = useState(false);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('athenaeum_note_title', title);
    localStorage.setItem('athenaeum_note_content', content);
    localStorage.setItem('athenaeum_note_color', color);
    
    setSavedBadge(true);
    const timer = setTimeout(() => setSavedBadge(false), 1200);
    return () => clearTimeout(timer);
  }, [title, content, color]);

  if (!isOpen) return null;

  const currentTheme = COLOR_THEMES[color] || COLOR_THEMES.yellow;

  const handleClear = () => {
    if (window.confirm("Clear all note contents?")) {
      setContent('');
      sound.playPageFlip();
    }
  };

  return (
    <div 
      className={`sticky-note-wrapper ${isMinimized ? 'is-minimized' : ''}`}
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
        borderColor: currentTheme.border
      }}
    >
      {/* Tape effect top decoration */}
      <div 
        className="sticky-note-tape"
        style={{ backgroundColor: currentTheme.tape }}
      />

      {/* Header bar */}
      <div 
        className="sticky-note-header"
        style={{ borderBottomColor: `rgba(0,0,0,0.08)` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Pin size={14} style={{ color: currentTheme.accent, transform: 'rotate(-45deg)' }} />
          <input
            type="text"
            className="sticky-note-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title..."
            style={{ color: currentTheme.text }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {savedBadge && (
            <span className="sticky-note-saved-tag" style={{ color: currentTheme.accent }}>
              <Check size={11} /> Saved
            </span>
          )}

          <button
            type="button"
            className="sticky-note-action-btn"
            onClick={() => setShowColorPicker(!showColorPicker)}
            title="Change color"
            style={{ color: currentTheme.text }}
          >
            <Palette size={13} />
          </button>

          <button
            type="button"
            className="sticky-note-action-btn"
            onClick={() => {
              sound.playPageFlip();
              setIsMinimized(!isMinimized);
            }}
            title={isMinimized ? "Expand note" : "Minimize note"}
            style={{ color: currentTheme.text }}
          >
            {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
          </button>

          {onClose && (
            <button
              type="button"
              className="sticky-note-action-btn"
              onClick={onClose}
              title="Close sticky note"
              style={{ color: currentTheme.text }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Palette switcher popup */}
      {showColorPicker && !isMinimized && (
        <div className="sticky-color-picker-bar">
          {Object.keys(COLOR_THEMES).map((key) => (
            <button
              key={key}
              type="button"
              className={`sticky-color-dot ${color === key ? 'active' : ''}`}
              style={{ backgroundColor: COLOR_THEMES[key].bg, borderColor: COLOR_THEMES[key].border }}
              onClick={() => {
                setColor(key);
                setShowColorPicker(false);
                sound.playPageFlip();
              }}
              title={key}
            />
          ))}
        </div>
      )}

      {/* Note textarea body */}
      {!isMinimized && (
        <div className="sticky-note-body">
          <textarea
            className="sticky-note-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your notes or reminders here..."
            style={{ color: currentTheme.text }}
          />

          <div className="sticky-note-footer">
            <span className="sticky-note-char-count">
              {content.length} characters
            </span>
            <button
              type="button"
              className="sticky-note-clear-btn"
              onClick={handleClear}
              title="Clear note"
              style={{ color: currentTheme.text }}
            >
              <Trash2 size={12} />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
