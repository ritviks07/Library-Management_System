import React from 'react';
import BookSpine from './BookSpine';
import { Plus } from 'lucide-react';
import { sound } from '../utils/audio';

export default function Bookshelf({ books = [], selectedBook, onSelectBook, onOpenAddModal }) {
  // Break books into shelf tiers of 8 books each for clean layout
  const BOOKS_PER_SHELF = 8;
  const shelves = [];
  
  for (let i = 0; i < books.length; i += BOOKS_PER_SHELF) {
    shelves.push(books.slice(i, i + BOOKS_PER_SHELF));
  }

  // If no books in this filter/state
  if (shelves.length === 0) return null;

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

  return (
    <div className="bookshelf-section">
      {shelves.map((shelfBooks, idx) => (
        <div key={idx} className="bookshelf-unit">
          {/* Books in Row */}
          <div className="shelf-books-row">
            {shelfBooks.map((book) => (
              <BookSpine
                key={book.id}
                book={book}
                onSelect={onSelectBook}
                isActive={selectedBook && selectedBook.id === book.id}
              />
            ))}

            {/* Add Book slot on the last shelf */}
            {idx === shelves.length - 1 && (
              <div
                className="add-spine-card"
                onClick={() => {
                  sound.playPageFlip();
                  onOpenAddModal();
                }}
                title="Add a new book to the shelf"
              >
                <Plus size={22} />
                <span style={{ fontSize: '0.62rem', fontWeight: '700', letterSpacing: '1px' }}>
                  ADD BOOK
                </span>
              </div>
            )}
          </div>

          {/* Modern Walnut & Brass Shelf Plank */}
          <div className="shelf-plank">
            <div className="shelf-brass-plate">
              BAY {romanNumerals[idx] || (idx + 1)} • ARCHIVAL SHELF
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
