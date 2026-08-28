import React from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Layers, 
  LayoutGrid, 
  ListOrdered, 
  Bookmark, 
  RotateCcw, 
  BarChart3,
  X,
  SlidersHorizontal,
  Check
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
  viewMode = 'shelf',
  setViewMode,
  onOpenAddModal,
  onOpenStatsModal,
  onResetSeed,
  isMuted,
  onToggleSound,
  totalBooksCount = 0,
  availableCount = 0
}) {
  return (
    <header className="modern-header-glass">
      {/* Top Navbar Row: Brand, Counters, View Switcher & Action CTAs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        
        {/* Brand & Live Counter Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div className="brand-identity">
            <div className="brand-icon-box">
              <BookOpen size={24} color="#f59e0b" />
            </div>
            <div>
              <h1 className="brand-title-text">BOOK TRACKING SYSTEM</h1>
              <p className="brand-subtitle-text">Curated Book & Digital Resource Tracker</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="header-stat-chip">
              <strong>{totalBooksCount}</strong> Books
            </span>
            <span className="header-stat-chip available">
              <strong>{availableCount}</strong> Available
            </span>
          </div>
        </div>

        {/* Center: View Switcher (Shelf / Grid / Table) */}
        {setViewMode && (
          <div className="view-mode-switcher">
            <button
              className={`view-mode-btn ${viewMode === 'shelf' ? 'active' : ''}`}
              onClick={() => {
                sound.playPageFlip();
                setViewMode('shelf');
              }}
              title="3D Bookshelf View"
            >
              <Layers size={16} />
              <span>Shelf</span>
            </button>

            <button
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => {
                sound.playPageFlip();
                setViewMode('grid');
              }}
              title="Modern Showcase Grid View"
            >
              <LayoutGrid size={16} />
              <span>Grid</span>
            </button>

            <button
              className={`view-mode-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => {
                sound.playPageFlip();
                setViewMode('table');
              }}
              title="Catalog Table Ledger"
            >
              <ListOrdered size={16} />
              <span>Catalog</span>
            </button>
          </div>
        )}

        {/* Right Actions: Sound, Stats, Reset, Add Tome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            className="btn-glass"
            onClick={onToggleSound}
            title={isMuted ? 'Unmute library soundscapes' : 'Mute library acoustics'}
            style={{ padding: '0.55rem 0.75rem' }}
          >
            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} color="#fbbf24" />}
          </button>

          <button
            className="btn-glass"
            onClick={onOpenStatsModal}
            title="Open Library Ledger & Analytics"
          >
            <BarChart3 size={17} color="#818cf8" />
            <span>Ledger</span>
          </button>

          <button
            className="btn-glass"
            onClick={() => {
              sound.playWaxStamp();
              onResetSeed();
            }}
            title="Restore Default Classic Library Archive"
          >
            <RotateCcw size={15} />
            <span>Reset</span>
          </button>

          <button
            className="btn-primary-gradient"
            onClick={() => {
              sound.playPageFlip();
              onOpenAddModal();
            }}
          >
            <Plus size={18} />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div 
        style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.85rem', 
          marginTop: '1.25rem',
          paddingTop: '1.15rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          alignItems: 'center'
        }}
      >
        {/* Search Input */}
        <div className="modern-search-box">
          <Search size={17} color="#f59e0b" />
          <input
            type="text"
            className="modern-search-input"
            placeholder="Search by title, author, genre, or ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Quick Toggle Filters */}
        <button
          className={`filter-toggle-pill ${filterAvailable ? 'active' : ''}`}
          onClick={() => {
            sound.playPageFlip();
            setFilterAvailable(!filterAvailable);
          }}
        >
          <Check size={14} color={filterAvailable ? '#34d399' : 'currentColor'} />
          <span>Available Now</span>
        </button>

        <button
          className={`filter-toggle-pill ${filterFavorite ? 'active-fav' : ''}`}
          onClick={() => {
            sound.playWaxStamp();
            setFilterFavorite(!filterFavorite);
          }}
        >
          <Bookmark size={14} color={filterFavorite ? '#fbbf24' : 'currentColor'} />
          <span>Bookmarked</span>
        </button>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
          <SlidersHorizontal size={15} color="#94a3b8" />
          <select
            className="modern-select"
            value={sortBy}
            onChange={(e) => {
              sound.playPageFlip();
              setSortBy(e.target.value);
            }}
          >
            <option value="newest">Recent Registry</option>
            <option value="rating">Highest Rating ★</option>
            <option value="title">Title (A-Z)</option>
            <option value="author">Author (A-Z)</option>
            <option value="year_desc">Year (Newest First)</option>
            <option value="year_asc">Year (Oldest First)</option>
          </select>
        </div>
      </div>

      {/* Genre Pills Carousel */}
      <div className="genre-pills-row" style={{ marginTop: '0.85rem' }}>
        <button
          className={`genre-pill-btn ${selectedGenre === 'All' ? 'active' : ''}`}
          onClick={() => {
            sound.playPageFlip();
            setSelectedGenre('All');
          }}
        >
          All Categories
        </button>
        {genres.map((g) => (
          <button
            key={g}
            className={`genre-pill-btn ${selectedGenre === g ? 'active' : ''}`}
            onClick={() => {
              sound.playPageFlip();
              setSelectedGenre(g);
            }}
          >
            {g}
          </button>
        ))}
      </div>
    </header>
  );
}
