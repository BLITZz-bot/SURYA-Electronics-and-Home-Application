import { Router } from 'express';
import { 
  getOrders, 
  getOrderById, 
  updateOrder, 
  deleteOrder,
  getMyOrders,
  createOrder
} from '../controllers/orderController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Private routes
router.get('/my-orders', verifyToken, getMyOrders);
router.post('/', verifyToken, createOrder);

// Admin-only routes
router.get('/', verifyToken, isAdmin, getOrders);
router.get('/:id', verifyToken, isAdmin, getOrderById);
router.patch('/:id', verifyToken, isAdmin, updateOrder);
router.delete('/:id', verifyToken, isAdmin, deleteOrder);

export default router;
