import { Router } from 'express';
import { getCart, addToCart, removeFromCart } from '../controllers/cartController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.use(verifyToken);

router.get('/', getCart);
router.post('/', addToCart);
router.delete('/:id', removeFromCart);

export default router;
