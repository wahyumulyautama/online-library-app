import { Router } from 'express';
import { borrowBook, returnBook, getBorrowData } from '../controllers/borrowController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
const router = Router();

router.post('/borrow', authMiddleware, borrowBook);
router.post('/return', authMiddleware, returnBook);
router.get('/list', authMiddleware, getBorrowData);

export default router;
