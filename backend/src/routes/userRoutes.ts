import { Router } from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getProfile
} from '../controllers/userController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Private profile route
router.get('/profile', verifyToken, getProfile);

// Admin-only routes
router.get('/', verifyToken, isAdmin, getUsers);
router.get('/:id', verifyToken, isAdmin, getUserById);
router.patch('/:id', verifyToken, isAdmin, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);

export default router;
