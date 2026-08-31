import { Router } from 'express';
import { triggerManualDigest, getDigestHistory } from '../controllers/digestController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.post('/trigger', authenticateJWT, triggerManualDigest);
router.get('/history', authenticateJWT, getDigestHistory);

export default router;
