import { query, resetSeedFallback, getDBStatus } from '../db/db.js';
import { initialBooks } from '../db/seed.js';

// ISBN validator helper (accepts ISBN-10, ISBN-13 with or without hyphens)
const isValidISBN = (isbn) => {
  if (!isbn || typeof isbn !== 'string') return false;
  const cleaned = isbn.replace(/[-\s]/g, '');
  return /^(97[89])?\d{9}[\dX]$/i.test(cleaned);
};

// GET /api/books - Get all books with search, filter, and sort
export const getAllBooks = async (req, res) => {
  try {
    const { search, genre, available, favorite, sort } = req.query;

    let sql = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (genre && genre !== 'All') {
      params.push(genre);
      sql += ` AND genre = $${params.length}`;
    }

    if (available === 'true') {
      sql += ' AND copies_available > 0';
    }

    if (favorite === 'true') {
      sql += ' AND is_favorite = TRUE';
    }

    if (search && search.trim() !== '') {
      params.push(`%${search.trim()}%`);
      const pIdx = params.length;
      sql += ` AND (title ILIKE $${pIdx} OR author ILIKE $${pIdx} OR isbn ILIKE $${pIdx} OR description ILIKE $${pIdx})`;
    }

    // Sorting
    switch (sort) {
      case 'year_asc':
        sql += ' ORDER BY publish_year ASC';
        break;
      case 'year_desc':
        sql += ' ORDER BY publish_year DESC';
        break;
      case 'rating_desc':
        sql += ' ORDER BY rating DESC';
        break;
      case 'title_asc':
        sql += ' ORDER BY title ASC';
        break;
      case 'author_asc':
        sql += ' ORDER BY author ASC';
        break;
      case 'newest':
      default:
        sql += ' ORDER BY id DESC';
        break;
    }

    const result = await query(sql, params);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve tomes from library archive.' });
  }
};

// GET /api/books/:id - Get a single book
export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM books WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Book not found in the archives.' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Error in getBookById:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve the tome.' });
  }
};

// POST /api/books - Add a new book
export const createBook = async (req, res) => {
  try {
    const {
      title,
      author,
      isbn,
      genre,
      publish_year,
      copies_available = 1,
      total_copies = 1,
      spine_color = '#7A1C29',
      cover_style = 'leather-burgundy',
      description = '',
      rating = 4.5,
      is_favorite = false,
      notes = ''
    } = req.body;

    // Validation
    const errors = [];
    if (!title || !title.trim()) errors.push('Title is required.');
    if (!author || !author.trim()) errors.push('Author is required.');
    if (!isbn || !isbn.trim()) {
      errors.push('ISBN is required.');
    } else if (!isValidISBN(isbn)) {
      errors.push('Invalid ISBN format. Expected valid ISBN-10 or ISBN-13 (e.g., 978-0743273565).');
    }
    if (!genre || !genre.trim()) errors.push('Genre is required.');
    if (publish_year === undefined || publish_year === null || isNaN(publish_year)) {
      errors.push('Publish year must be a valid integer.');
    }
    if (copies_available < 0) errors.push('Copies available cannot be negative.');

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const availableNum = parseInt(copies_available, 10);
    const totalNum = parseInt(total_copies, 10) || availableNum;

    const insertSql = `
      INSERT INTO books (
        title, author, isbn, genre, publish_year, copies_available,
        total_copies, spine_color, cover_style, description, rating,
        is_favorite, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const params = [
      title.trim(),
      author.trim(),
      isbn.trim(),
      genre.trim(),
      parseInt(publish_year, 10),
      availableNum,
      Math.max(availableNum, totalNum),
      spine_color,
      cover_style,
      description.trim(),
      parseFloat(rating) || 4.5,
      Boolean(is_favorite),
      notes.trim()
    ];

    const result = await query(insertSql, params);
    res.status(201).json({
      success: true,
      message: 'New tome inscribed into library ledger successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in createBook:', error);
    if (error.code === '23505') { // Postgres unique violation
      return res.status(400).json({ success: false, error: 'A book with this ISBN already exists in the catalog.' });
    }
    res.status(500).json({ success: false, error: 'Failed to write book into database.' });
  }
};

// PUT /api/books/:id - Update an existing book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      isbn,
      genre,
      publish_year,
      copies_available,
      total_copies,
      spine_color,
      cover_style,
      description,
      rating,
      is_favorite,
      notes
    } = req.body;

    // Check if book exists
    const existing = await query('SELECT * FROM books WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Book not found.' });
    }

    const current = existing.rows[0];

    // Validation if ISBN is being updated
    if (isbn && isbn !== current.isbn && !isValidISBN(isbn)) {
      return res.status(400).json({ success: false, error: 'Invalid ISBN format.' });
    }

    const updatedTitle = title !== undefined ? title.trim() : current.title;
    const updatedAuthor = author !== undefined ? author.trim() : current.author;
    const updatedIsbn = isbn !== undefined ? isbn.trim() : current.isbn;
    const updatedGenre = genre !== undefined ? genre.trim() : current.genre;
    const updatedYear = publish_year !== undefined ? parseInt(publish_year, 10) : current.publish_year;
    const updatedAvailable = copies_available !== undefined ? parseInt(copies_available, 10) : current.copies_available;
    const updatedTotal = total_copies !== undefined ? parseInt(total_copies, 10) : current.total_copies;
    const updatedSpineColor = spine_color !== undefined ? spine_color : current.spine_color;
    const updatedCoverStyle = cover_style !== undefined ? cover_style : current.cover_style;
    const updatedDesc = description !== undefined ? description : current.description;
    const updatedRating = rating !== undefined ? parseFloat(rating) : current.rating;
    const updatedFav = is_favorite !== undefined ? Boolean(is_favorite) : current.is_favorite;
    const updatedNotes = notes !== undefined ? notes : current.notes;

    const updateSql = `
      UPDATE books SET
        title = $1, author = $2, isbn = $3, genre = $4, publish_year = $5,
        copies_available = $6, total_copies = $7, spine_color = $8,
        cover_style = $9, description = $10, rating = $11, is_favorite = $12,
        notes = $13, updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;

    const params = [
      updatedTitle,
      updatedAuthor,
      updatedIsbn,
      updatedGenre,
      updatedYear,
      updatedAvailable,
      updatedTotal,
      updatedSpineColor,
      updatedCoverStyle,
      updatedDesc,
      updatedRating,
      updatedFav,
      updatedNotes,
      id
    ];

    const result = await query(updateSql, params);
    res.json({
      success: true,
      message: 'Tome annotations saved successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in updateBook:', error);
    res.status(500).json({ success: false, error: 'Failed to update book.' });
  }
};

// DELETE /api/books/:id - Delete a book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Book not found in archives.' });
    }

    res.json({
      success: true,
      message: 'Tome has been excised from the collection.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in deleteBook:', error);
    res.status(500).json({ success: false, error: 'Failed to delete book.' });
  }
};

// POST /api/books/:id/borrow - Borrow a copy
export const borrowBook = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await query('SELECT * FROM books WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Book not found.' });
    }

    const book = check.rows[0];
    if (book.copies_available <= 0) {
      return res.status(400).json({ success: false, error: 'All copies of this tome are currently checked out.' });
    }

    const updateSql = `
      UPDATE books 
      SET copies_available = copies_available - 1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 RETURNING *
    `;
    const result = await query(updateSql, [id]);

    res.json({
      success: true,
      message: `Checked out copy of "${book.title}". Remaining available: ${result.rows[0].copies_available}`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in borrowBook:', error);
    res.status(500).json({ success: false, error: 'Failed to borrow book.' });
  }
};

// POST /api/books/:id/return - Return a copy
export const returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const check = await query('SELECT * FROM books WHERE id = $1', [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Book not found.' });
    }

    const book = check.rows[0];
    if (book.copies_available >= book.total_copies) {
      return res.status(400).json({ success: false, error: 'All registered copies of this tome are already on the shelf.' });
    }

    const updateSql = `
      UPDATE books 
      SET copies_available = copies_available + 1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 RETURNING *
    `;
    const result = await query(updateSql, [id]);

    res.json({
      success: true,
      message: `Returned copy of "${book.title}". Available on shelf: ${result.rows[0].copies_available}`,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in returnBook:', error);
    res.status(500).json({ success: false, error: 'Failed to return book.' });
  }
};

// POST /api/books/:id/toggle-favorite - Toggle ribbon bookmark
export const toggleFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const updateSql = `
      UPDATE books 
      SET is_favorite = NOT is_favorite, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 RETURNING *
    `;
    const result = await query(updateSql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Book not found.' });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error in toggleFavorite:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle bookmark.' });
  }
};

// GET /api/books/genres - Get all distinct genres
export const getGenres = async (req, res) => {
  try {
    const result = await query('SELECT DISTINCT genre FROM books ORDER BY genre ASC');
    const genres = result.rows.map(r => r.genre).filter(Boolean);
    res.json({ success: true, data: genres });
  } catch (error) {
    console.error('Error in getGenres:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch genres.' });
  }
};

// GET /api/stats - Library statistics
export const getStats = async (req, res) => {
  try {
    const booksRes = await query('SELECT * FROM books');
    const books = booksRes.rows;

    const totalTitles = books.length;
    const totalCopies = books.reduce((acc, b) => acc + (parseInt(b.total_copies, 10) || 1), 0);
    const availableCopies = books.reduce((acc, b) => acc + (parseInt(b.copies_available, 10) || 0), 0);
    const borrowedCopies = totalCopies - availableCopies;
    const favoritesCount = books.filter(b => b.is_favorite).length;

    const genreCounts = {};
    books.forEach(b => {
      genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        totalTitles,
        totalCopies,
        availableCopies,
        borrowedCopies,
        favoritesCount,
        genreCounts,
        dbStatus: getDBStatus()
      }
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate stats.' });
  }
};

// POST /api/books/seed - Reset to classic collection
export const seedLibrary = async (req, res) => {
  try {
    resetSeedFallback();
    // Also try resetting Postgres if connected
    try {
      await query('DELETE FROM books');
      for (const book of initialBooks) {
        await query(`
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
    } catch {
      // ignore
    }

    const all = await query('SELECT * FROM books ORDER BY id ASC');
    res.json({
      success: true,
      message: 'Library restored with original classic collection.',
      data: all.rows
    });
  } catch (error) {
    console.error('Error in seedLibrary:', error);
    res.status(500).json({ success: false, error: 'Failed to reset library.' });
  }
};
