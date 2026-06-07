import { Router } from 'express';
import { getOffers, getActiveOffers, createOffer, updateOffer, deleteOffer } from '../controllers/offerController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public route
router.get('/active', getActiveOffers);

// Admin-only routes
router.get('/', verifyToken, isAdmin, getOffers);
router.post('/', verifyToken, isAdmin, createOffer);
router.patch('/:id', verifyToken, isAdmin, updateOffer);
router.delete('/:id', verifyToken, isAdmin, deleteOffer);

export default router;
