-- Library Management System Database Schema (PostgreSQL)

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(30) UNIQUE NOT NULL,
    genre VARCHAR(100) NOT NULL,
    publish_year INTEGER NOT NULL,
    copies_available INTEGER NOT NULL DEFAULT 1,
    total_copies INTEGER NOT NULL DEFAULT 1,
    spine_color VARCHAR(50) DEFAULT '#7A1C29',
    cover_style VARCHAR(50) DEFAULT 'leather-burgundy',
    description TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    is_favorite BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index frequently searched and filtered fields
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
