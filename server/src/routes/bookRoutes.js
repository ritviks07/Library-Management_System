import express from 'express';
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  toggleFavorite,
  getGenres,
  getStats,
  seedLibrary
} from '../controllers/bookController.js';

const router = express.Router();

// Metadata & Library status
router.get('/genres', getGenres);
router.get('/stats', getStats);
router.post('/seed', seedLibrary);

// Core CRUD
router.get('/', getAllBooks);
router.get('/:id', getBookById);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

// Actions
router.post('/:id/borrow', borrowBook);
router.post('/:id/return', returnBook);
router.post('/:id/favorite', toggleFavorite);

export default router;
