import { Router } from 'express';
import { addBook, getBooks, updateBook, removeBook } from '../controllers/bookController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Rute untuk mendapatkan daftar buku
router.get('/', authMiddleware, getBooks);

// Rute untuk menambahkan buku
router.post('/', authMiddleware, addBook);

// Rute untuk memperbarui buku berdasarkan ID buku
router.put('/:bookId', authMiddleware, updateBook);

// Rute untuk menghapus buku berdasarkan ID buku
router.delete('/:bookId', authMiddleware, removeBook);

export default router;
