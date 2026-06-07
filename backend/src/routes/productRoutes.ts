import { Router } from 'express';
import { 
  getProducts, 
  createProduct, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
