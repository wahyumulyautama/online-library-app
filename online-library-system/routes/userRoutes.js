import { Router } from 'express';
import { getUserDetails, removeUser } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Endpoint untuk melihat detail user termasuk buku yang dipinjam
router.get('/details', authMiddleware, getUserDetails);
router.delete('/:userId', authMiddleware, removeUser);

export default router;

