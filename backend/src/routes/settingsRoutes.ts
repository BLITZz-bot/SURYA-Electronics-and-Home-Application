import { Router } from 'express';
import { 
  getSettings, 
  updateSettings,
  getDashboardStats
} from '../controllers/settingsController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Admin-only routes
router.get('/', verifyToken, isAdmin, getSettings);
router.patch('/', verifyToken, isAdmin, updateSettings);
router.get('/stats', verifyToken, isAdmin, getDashboardStats);

export default router;
