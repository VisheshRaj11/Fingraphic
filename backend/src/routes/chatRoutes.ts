import { Router } from 'express';
import { getHistory } from '../controllers/chatController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.get('/:userId', getHistory);

export default router;
