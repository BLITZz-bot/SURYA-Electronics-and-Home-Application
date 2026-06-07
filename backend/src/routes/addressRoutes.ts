import { Router } from 'express';
import { 
  getAddresses, 
  createAddress, 
  deleteAddress, 
  updateAddress, 
  setDefaultAddress 
} from '../controllers/addressController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.use(verifyToken);

router.get('/', getAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.patch('/:id/default', setDefaultAddress);
router.delete('/:id', deleteAddress);

export default router;
