import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { initialBooks } from './seed.js';

dotenv.config();

let pool = null;
let useFallback = false;

// Fallback in-memory/simulated database for zero-friction setup if Postgres isn't running
class MockBookDatabase {
  constructor() {
    this.books = initialBooks.map((book, index) => ({
      id: index + 1,
      ...book,
      created_at: new Date(Date.now() - (12 - index) * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    }));
    this.nextId = this.books.length + 1;
  }

  async query(text, params = []) {
    const trimmed = text.trim();
    const upper = trimmed.toUpperCase();

    // SELECT COUNT(*)
    if (upper.startsWith('SELECT COUNT(*)')) {
      return { rows: [{ count: this.books.length.toString() }] };
    }

    // SELECT * FROM books WHERE id = $1
    if (upper.includes('FROM BOOKS') && upper.includes('WHERE ID = $1')) {
      const id = parseInt(params[0], 10);
      const book = this.books.find(b => b.id === id);
      return { rows: book ? [book] : [] };
    }

    // SELECT * FROM books with optional WHERE, ORDER BY
    if (upper.startsWith('SELECT * FROM BOOKS') || upper.startsWith('SELECT DISTINCT GENRE')) {
      if (upper.startsWith('SELECT DISTINCT GENRE')) {
        const genres = Array.from(new Set(this.books.map(b => b.genre))).map(g => ({ genre: g }));
        return { rows: genres };
      }

      let filtered = [...this.books];

      // Handle search and filters
      if (params.length > 0) {
        let paramIdx = 0;
        if (text.includes('genre = $')) {
          const genreVal = params[paramIdx++];
          filtered = filtered.filter(b => b.genre.toLowerCase() === genreVal.toLowerCase());
        }
        if (text.includes('copies_available > 0')) {
          filtered = filtered.filter(b => b.copies_available > 0);
        }
        if (text.includes('is_favorite = TRUE')) {
          filtered = filtered.filter(b => b.is_favorite);
        }
        if (text.includes('ILIKE $')) {
          const searchVal = (params[paramIdx++] || '').replace(/%/g, '').toLowerCase();
          filtered = filtered.filter(b => 
            (b.title && b.title.toLowerCase().includes(searchVal)) ||
            (b.author && b.author.toLowerCase().includes(searchVal)) ||
            (b.isbn && b.isbn.toLowerCase().includes(searchVal)) ||
            (b.description && b.description.toLowerCase().includes(searchVal))
          );
        }
      }

      // Handle sorting
      if (upper.includes('ORDER BY CREATED_AT DESC') || upper.includes('ORDER BY ID DESC')) {
        filtered.sort((a, b) => b.id - a.id);
      } else if (upper.includes('ORDER BY PUBLISH_YEAR ASC')) {
        filtered.sort((a, b) => a.publish_year - b.publish_year);
      } else if (upper.includes('ORDER BY PUBLISH_YEAR DESC')) {
        filtered.sort((a, b) => b.publish_year - a.publish_year);
      } else if (upper.includes('ORDER BY RATING DESC')) {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (upper.includes('ORDER BY TITLE ASC')) {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      } else if (upper.includes('ORDER BY AUTHOR ASC')) {
        filtered.sort((a, b) => a.author.localeCompare(b.author));
      }

      return { rows: filtered };
    }

    // INSERT INTO books
    if (upper.startsWith('INSERT INTO BOOKS')) {
      const newBook = {
        id: this.nextId++,
        title: params[0],
        author: params[1],
        isbn: params[2],
        genre: params[3],
        publish_year: parseInt(params[4], 10),
        copies_available: parseInt(params[5] ?? 1, 10),
        total_copies: parseInt(params[6] ?? params[5] ?? 1, 10),
        spine_color: params[7] || '#7A1C29',
        cover_style: params[8] || 'leather-burgundy',
        description: params[9] || '',
        rating: parseFloat(params[10] || 4.5),
        is_favorite: Boolean(params[11]),
        notes: params[12] || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.books.unshift(newBook);
      return { rows: [newBook] };
    }

    // UPDATE books
    if (upper.startsWith('UPDATE BOOKS')) {
      // Check if update by id
      const id = parseInt(params[params.length - 1], 10);
      const bookIndex = this.books.findIndex(b => b.id === id);
      if (bookIndex === -1) {
        return { rows: [] };
      }

      const book = this.books[bookIndex];

      // Handle borrow/return or full update
      if (upper.includes('COPIES_AVAILABLE = COPIES_AVAILABLE - 1')) {
        if (book.copies_available > 0) {
          book.copies_available -= 1;
          book.updated_at = new Date().toISOString();
        }
        return { rows: [book] };
      }

      if (upper.includes('COPIES_AVAILABLE = COPIES_AVAILABLE + 1')) {
        if (book.copies_available < book.total_copies) {
          book.copies_available += 1;
          book.updated_at = new Date().toISOString();
        }
        return { rows: [book] };
      }

      if (upper.includes('IS_FAVORITE = NOT IS_FAVORITE')) {
        book.is_favorite = !book.is_favorite;
        book.updated_at = new Date().toISOString();
        return { rows: [book] };
      }

      // Full update
      book.title = params[0] !== undefined ? params[0] : book.title;
      book.author = params[1] !== undefined ? params[1] : book.author;
      book.isbn = params[2] !== undefined ? params[2] : book.isbn;
      book.genre = params[3] !== undefined ? params[3] : book.genre;
      book.publish_year = params[4] !== undefined ? parseInt(params[4], 10) : book.publish_year;
      book.copies_available = params[5] !== undefined ? parseInt(params[5], 10) : book.copies_available;
      book.total_copies = params[6] !== undefined ? parseInt(params[6], 10) : book.total_copies;
      book.spine_color = params[7] !== undefined ? params[7] : book.spine_color;
      book.cover_style = params[8] !== undefined ? params[8] : book.cover_style;
      book.description = params[9] !== undefined ? params[9] : book.description;
      book.rating = params[10] !== undefined ? parseFloat(params[10]) : book.rating;
      book.is_favorite = params[11] !== undefined ? Boolean(params[11]) : book.is_favorite;
      book.notes = params[12] !== undefined ? params[12] : book.notes;
      book.updated_at = new Date().toISOString();

      return { rows: [book] };
    }

    // DELETE FROM books WHERE id = $1
    if (upper.startsWith('DELETE FROM BOOKS')) {
      const id = parseInt(params[0], 10);
      const bookIndex = this.books.findIndex(b => b.id === id);
      if (bookIndex !== -1) {
        const deleted = this.books.splice(bookIndex, 1)[0];
        return { rows: [deleted] };
      }
      return { rows: [] };
    }

    return { rows: [] };
  }

  resetSeed() {
    this.books = initialBooks.map((book, index) => ({
      id: index + 1,
      ...book,
      created_at: new Date(Date.now() - (12 - index) * 86400000).toISOString(),
      updated_at: new Date().toISOString()
    }));
    this.nextId = this.books.length + 1;
    return this.books;
  }
}

const mockDb = new MockBookDatabase();

export async function initDB() {
  const pgConfig = {
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    database: process.env.PGDATABASE || 'library_db',
    connectionTimeoutMillis: 2000
  };

  try {
    pool = new Pool(pgConfig);
    const client = await pool.connect();
    
    console.log(`[PERN Database] Successfully connected to PostgreSQL (${pgConfig.host}:${pgConfig.port}/${pgConfig.database})`);

    // Create table if not exists
    await client.query(`
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
      CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
      CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
    `);

    // Check if books table has data; if empty, seed initial books
    const checkRes = await client.query('SELECT COUNT(*) FROM books');
    if (parseInt(checkRes.rows[0].count, 10) === 0) {
      console.log('[PERN Database] Seeding initial literary collection into PostgreSQL...');
      for (const book of initialBooks) {
        await client.query(`
          INSERT INTO books (
            title, author, isbn, genre, publish_year, copies_available,
            total_copies, spine_color, cover_style, description, rating,
            is_favorite, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        `, [
          book.title, book.author, book.isbn, book.genre, book.publish_year,
          book.copies_available, book.total_copies, book.spine_color, book.cover_style,
          book.description, book.rating, book.is_favorite, book.notes
        ]);
      }
      console.log(`[PERN Database] Seeded ${initialBooks.length} books successfully.`);
    }

    client.release();
    useFallback = false;
  } catch (err) {
    console.warn(`[PERN Database: Notice] Could not connect to local PostgreSQL instance (${err.message}).`);
    console.log('[PERN Database] Activating resilient in-memory PostgreSQL emulation mode with rich seed data.');
    console.log('[PERN Database] To use live PostgreSQL, ensure PostgreSQL service is running and update server/.env');
    useFallback = true;
  }
}

export const query = async (text, params = []) => {
  if (useFallback || !pool) {
    return mockDb.query(text, params);
  }
  try {
    return await pool.query(text, params);
  } catch (err) {
    console.error('[PERN Database Query Error]', err);
    throw err;
  }
};

export const resetSeedFallback = () => {
  if (useFallback) {
    return mockDb.resetSeed();
  }
  return null;
};

export const getDBStatus = () => {
  return {
    engine: useFallback ? 'PostgreSQL-Emulation' : 'PostgreSQL-Live',
    host: process.env.PGHOST || 'localhost',
    database: process.env.PGDATABASE || 'library_db',
    active: true
  };
};
