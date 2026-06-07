import { Router } from 'express';
import { createReview, voteHelpful, deleteReview } from '../controllers/reviewController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', verifyToken, createReview);
router.post('/:reviewId/helpful', verifyToken, voteHelpful);
router.delete('/:id', verifyToken, deleteReview);

export default router;
