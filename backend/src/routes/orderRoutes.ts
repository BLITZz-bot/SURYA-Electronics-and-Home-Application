import { Router } from 'express';
import { 
  getOrders, 
  getOrderById, 
  updateOrder, 
  deleteOrder 
} from '../controllers/orderController';

const router = Router();

router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
