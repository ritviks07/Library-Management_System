import React, { useRef } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Volume2, 
  VolumeX, 
  Layers, 
  LayoutGrid, 
  ListOrdered, 
  Bookmark, 
  RotateCcw, 
  BarChart3,
  X,
  SlidersHorizontal,
  Check,
  ChevronLeft,
  ChevronRight,
  StickyNote as StickyIcon
} from 'lucide-react';
import { sound } from '../utils/audio';

export default function LibraryHeader({
  searchTerm,
  setSearchTerm,
  selectedGenre,
  setSelectedGenre,
  genres = [],
  filterAvailable,
  setFilterAvailable,
  filterFavorite,
  setFilterFavorite,
  sortBy,
  setSortBy,
  viewMode = 'table',
  setViewMode,
  onOpenAddModal,
  onOpenStatsModal,
  onResetSeed,
  isMuted,
  onToggleSound,
  totalBooksCount = 0,
  availableCount = 0,
  isStickyNoteOpen,
  onToggleStickyNote
}) {
  const genreRowRef = useRef(null);

  const scrollGenres = (direction) => {
    if (genreRowRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      genreRowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <header className="modern-header-glass">
      {/* Top Navbar Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Metrics */}
        <div className="brand-identity">
          <div className="brand-icon-box">
            <BookOpen size={18} />
          </div>
          <div>
            <h1 className="brand-title-text">Library Manager</h1>
            <p className="brand-subtitle-text">{totalBooksCount} total books · {availableCount} available</p>
          </div>
        </div>

        {/* View Mode Switcher */}
        {setViewMode && (
          <div className="view-mode-switcher">
            <button
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => { sound.playPageFlip(); setViewMode('table'); }}
              title="Table View"
            >
              <ListOrdered size={14} />
              <span>Table</span>
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => { sound.playPageFlip(); setViewMode('grid'); }}
              title="Grid View"
            >
              <LayoutGrid size={14} />
              <span>Grid</span>
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'shelf' ? 'active' : ''}`}
              onClick={() => { sound.playPageFlip(); setViewMode('shelf'); }}
              title="Shelf View"
            >
              <Layers size={14} />
              <span>Shelf</span>
            </button>
          </div>
        )}

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            className="btn-glass"
            onClick={onToggleSound}
            title={isMuted ? 'Unmute' : 'Mute'}
            style={{ padding: '0.45rem' }}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            className={`btn-glass ${isStickyNoteOpen ? 'active-sticky' : ''}`}
            onClick={() => { sound.playPageFlip(); onToggleStickyNote(); }}
            title="Toggle Sticky Memo"
          >
            <StickyIcon size={15} style={{ color: '#fde047' }} />
            <span>Sticky Note</span>
          </button>

          <button
            className="btn-glass"
            onClick={onOpenStatsModal}
          >
            <BarChart3 size={15} />
            <span>Stats</span>
          </button>

          <button
            className="btn-glass"
            onClick={() => { sound.playWaxStamp(); onResetSeed(); }}
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            className="btn-primary-gradient"
            onClick={() => { sound.playPageFlip(); onOpenAddModal(); }}
          >
            <Plus size={16} />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.65rem',
        marginTop: '1rem',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-subtle)',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div className="modern-search-box">
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            className="modern-search-input"
            placeholder="Search by title, author, genre, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        {/* Toggles */}
        <button
          className={`filter-toggle-pill ${filterAvailable ? 'active' : ''}`}
          onClick={() => { sound.playPageFlip(); setFilterAvailable(!filterAvailable); }}
        >
          <Check size={13} />
          <span>Available</span>
        </button>

        <button
          className={`filter-toggle-pill ${filterFavorite ? 'active-fav' : ''}`}
          onClick={() => { sound.playWaxStamp(); setFilterFavorite(!filterFavorite); }}
        >
          <Bookmark size={13} />
          <span>Bookmarked</span>
        </button>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <SlidersHorizontal size={14} color="var(--text-muted)" />
          <select
            className="modern-select"
            value={sortBy}
            onChange={(e) => { sound.playPageFlip(); setSortBy(e.target.value); }}
          >
            <option value="newest">Recently Added</option>
            <option value="rating">Highest Rating</option>
            <option value="title">Title (A-Z)</option>
            <option value="author">Author (A-Z)</option>
            <option value="year_desc">Year (Newest)</option>
            <option value="year_asc">Year (Oldest)</option>
          </select>
        </div>
      </div>

      {/* Genre Filter Scroller */}
      <div className="genre-scroller-container">
        <button 
          type="button"
          className="genre-scroll-arrow left"
          onClick={() => scrollGenres('left')}
          title="Scroll left"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="genre-pills-row" ref={genreRowRef}>
          <button
            className={`genre-pill-btn all-genres-pill ${selectedGenre === 'All' ? 'active' : ''}`}
            onClick={() => { sound.playPageFlip(); setSelectedGenre('All'); }}
          >
            All Genres
          </button>

          <div className="genre-pill-separator" />

          {genres.map((g) => (
            <button
              key={g}
              className={`genre-pill-btn ${selectedGenre === g ? 'active' : ''}`}
              onClick={() => { sound.playPageFlip(); setSelectedGenre(g); }}
            >
              {g}
            </button>
          ))}
        </div>

        <button 
          type="button"
          className="genre-scroll-arrow right"
          onClick={() => scrollGenres('right')}
          title="Scroll right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </header>
  );
}

