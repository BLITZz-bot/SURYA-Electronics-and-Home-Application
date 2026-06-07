import { Router } from 'express';
import { 
  getProducts, 
  createProduct, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController';
import { verifyToken, isAdmin } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', verifyToken, isAdmin, createProduct);
router.put('/:id', verifyToken, isAdmin, updateProduct);
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

export default router;
