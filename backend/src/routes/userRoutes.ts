import { Router } from 'express';
import { searchUsers } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);
router.get('/', searchUsers);

export default router;
