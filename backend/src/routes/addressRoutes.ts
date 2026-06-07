import { Router } from 'express';
import { getAddresses, createAddress, deleteAddress } from '../controllers/addressController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.use(verifyToken);

router.get('/', getAddresses);
router.post('/', createAddress);
router.delete('/:id', deleteAddress);

export default router;
