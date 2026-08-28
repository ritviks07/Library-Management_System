import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import LibraryHeader from './components/LibraryHeader';
import Bookshelf from './components/Bookshelf';
import BookCardGrid from './components/BookCardGrid';
import BookTableView from './components/BookTableView';
import OpenBook from './components/OpenBook';
import AddBookModal from './components/AddBookModal';
import EditBookModal from './components/EditBookModal';
import DeleteConfirmation from './components/DeleteConfirmation';
import StatsLedger from './components/StatsLedger';
import EmptyShelf from './components/EmptyShelf';
import NotificationToast from './components/NotificationToast';
import { 
  fetchBooks, 
  fetchBookById, 
  createBook, 
  updateBook, 
  deleteBook, 
  borrowBook, 
  returnBook, 
  toggleFavorite, 
  fetchGenres, 
  seedLibrary 
} from './services/api';
import { sound } from './utils/audio';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Data State
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  // View Mode: 'shelf' | 'grid' | 'table'
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('athenaeum_view_mode') || 'table';
  });

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('athenaeum_view_mode', mode);
  };

  // Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterFavorite, setFilterFavorite] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  // Modals & UI State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bookToEdit, setBookToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [isMuted, setIsMuted] = useState(sound.isMuted());

  // Show toast notification
  const notify = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Load books
  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchBooks({
        search: searchTerm,
        genre: selectedGenre,
        available: filterAvailable,
        favorite: filterFavorite,
        sort: sortBy
      });
      setBooks(res.data || []);
    } catch (err) {
      console.error(err);
      notify(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedGenre, filterAvailable, filterFavorite, sortBy]);

  // Load genres
  const loadGenres = async () => {
    try {
      const res = await fetchGenres();
      setGenres(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  useEffect(() => {
    loadGenres();
  }, []);

  // Handle URL matching for specific book
  useEffect(() => {
    const match = location.pathname.match(/\/book\/(\d+)/);
    if (match) {
      const bookId = parseInt(match[1], 10);
      const existing = books.find(b => b.id === bookId);
      if (existing) {
        setSelectedBook(existing);
      } else {
        fetchBookById(bookId)
          .then(res => setSelectedBook(res.data))
          .catch(() => {
            navigate('/');
          });
      }
    } else {
      setSelectedBook(null);
    }
  }, [location.pathname, books, navigate]);

  // Toggle Sound
  const handleToggleSound = () => {
    const newMute = sound.toggleMute();
    setIsMuted(newMute);
    if (!newMute) {
      sound.playWaxStamp();
    }
  };

  // Select Book
  const handleSelectBook = (book) => {
    setSelectedBook(book);
    navigate(`/book/${book.id}`);
  };

  // Close Book view
  const handleCloseBook = () => {
    setSelectedBook(null);
    navigate('/');
  };

  // Previous / Next Book pagination
  const currentIdx = selectedBook ? books.findIndex(b => b.id === selectedBook.id) : -1;
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx !== -1 && currentIdx < books.length - 1;

  const handlePrevBook = () => {
    if (hasPrev) {
      const prevBook = books[currentIdx - 1];
      setSelectedBook(prevBook);
      navigate(`/book/${prevBook.id}`);
    }
  };

  const handleNextBook = () => {
    if (hasNext) {
      const nextBook = books[currentIdx + 1];
      setSelectedBook(nextBook);
      navigate(`/book/${nextBook.id}`);
    }
  };

  // CREATE Book
  const handleCreateBook = async (bookData) => {
    const res = await createBook(bookData);
    notify(`"${res.data.title}" added to the archives!`, 'success');
    await loadBooks();
    await loadGenres();
    handleSelectBook(res.data);
  };

  // UPDATE Book
  const handleSaveEdit = async (id, bookData) => {
    const res = await updateBook(id, bookData);
    notify(`Changes for "${res.data.title}" saved.`, 'success');
    setSelectedBook(res.data);
    await loadBooks();
    await loadGenres();
  };

  // DELETE Book
  const handleConfirmDelete = async (id) => {
    try {
      const res = await deleteBook(id);
      notify(`"${res.data.title}" removed from the collection.`, 'success');
      setSelectedBook(null);
      navigate('/');
      await loadBooks();
      await loadGenres();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // BORROW Book
  const handleBorrow = async (id) => {
    try {
      sound.playWaxStamp();
      const res = await borrowBook(id);
      notify(res.message, 'success');
      setSelectedBook(res.data);
      setBooks(prev => prev.map(b => b.id === id ? res.data : b));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // RETURN Book
  const handleReturn = async (id) => {
    try {
      sound.playPageFlip();
      const res = await returnBook(id);
      notify(res.message, 'success');
      setSelectedBook(res.data);
      setBooks(prev => prev.map(b => b.id === id ? res.data : b));
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // FAVORITE Toggle
  const handleToggleFavorite = async (id) => {
    try {
      const res = await toggleFavorite(id);
      setSelectedBook(res.data);
      setBooks(prev => prev.map(b => b.id === id ? res.data : b));
      notify(res.data.is_favorite ? 'Added to bookmarked list.' : 'Removed bookmark.', 'success');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // SEED Reset
  const handleResetSeed = async () => {
    try {
      const res = await seedLibrary();
      notify(res.message, 'success');
      setSearchTerm('');
      setSelectedGenre('All');
      setFilterAvailable(false);
      setFilterFavorite(false);
      setSelectedBook(null);
      navigate('/');
      await loadBooks();
      await loadGenres();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  // Available count
  const availableCount = books.filter(b => b.copies_available > 0).length;

  return (
    <div className="library-desk-bg">
      <div className="ambient-glow" />

      <div className="library-container">
        {/* Floating Glass Header Navigation */}
        <LibraryHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedGenre={selectedGenre}
          setSelectedGenre={setSelectedGenre}
          genres={genres}
          filterAvailable={filterAvailable}
          setFilterAvailable={setFilterAvailable}
          filterFavorite={filterFavorite}
          setFilterFavorite={setFilterFavorite}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={handleSetViewMode}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenStatsModal={() => setIsStatsModalOpen(true)}
          onResetSeed={handleResetSeed}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          totalBooksCount={books.length}
          availableCount={availableCount}
        />

        {/* Main Content: Open Book Modal / View Mode */}
        {selectedBook ? (
          <OpenBook
            book={selectedBook}
            onClose={handleCloseBook}
            onEdit={(b) => {
              setBookToEdit(b);
              setIsEditModalOpen(true);
            }}
            onDeletePrompt={(b) => {
              setBookToDelete(b);
              setIsDeleteModalOpen(true);
            }}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
            onToggleFavorite={handleToggleFavorite}
            onPrevBook={handlePrevBook}
            onNextBook={handleNextBook}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        ) : null}

        {/* Content View Switching */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading library catalog...</p>
          </div>
        ) : books.length === 0 ? (
          <EmptyShelf
            onOpenAdd={() => setIsAddModalOpen(true)}
            onResetSeed={() => {
              setSearchTerm('');
              setSelectedGenre('All');
              setFilterAvailable(false);
              setFilterFavorite(false);
            }}
            isFiltered={Boolean(searchTerm || selectedGenre !== 'All' || filterAvailable || filterFavorite)}
          />
        ) : viewMode === 'grid' ? (
          <BookCardGrid
            books={books}
            onSelectBook={handleSelectBook}
            onToggleFavorite={handleToggleFavorite}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        ) : viewMode === 'table' ? (
          <BookTableView
            books={books}
            onSelectBook={handleSelectBook}
            onEditBook={(b) => {
              setBookToEdit(b);
              setIsEditModalOpen(true);
            }}
            onDeletePrompt={(b) => {
              setBookToDelete(b);
              setIsDeleteModalOpen(true);
            }}
            onToggleFavorite={handleToggleFavorite}
            onBorrow={handleBorrow}
            onReturn={handleReturn}
          />
        ) : (
          <Bookshelf
            books={books}
            selectedBook={selectedBook}
            onSelectBook={handleSelectBook}
            onOpenAddModal={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      {/* MODALS */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateBook}
      />

      <EditBookModal
        book={bookToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setBookToEdit(null);
        }}
        onSubmit={handleSaveEdit}
      />

      <DeleteConfirmation
        book={bookToDelete}
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBookToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <StatsLedger
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
      />

      {/* Toast Notification */}
      <NotificationToast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="*" element={<AppContent />} />
    </Routes>
  );
}
