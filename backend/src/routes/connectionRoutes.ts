import { Router } from 'express';
import {
  sendRequest,
  respondRequest,
  listConnections,
  listPending,
} from '../controllers/connectionController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateJWT);

router.post('/', sendRequest);
router.patch('/:connectionId', respondRequest);
router.get('/', listConnections);
router.get('/pending', listPending);

export default router;
