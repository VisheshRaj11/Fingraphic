import { Router } from 'express';
import {
  getPortfolio,
  executeTrade,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getLeaderboard,
} from '../controllers/portfolioController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateJWT, getPortfolio);
router.post('/trade', authenticateJWT, executeTrade);
router.get('/watchlist', authenticateJWT, getWatchlist);
router.post('/watchlist', authenticateJWT, addToWatchlist);
router.delete('/watchlist/:ticker', authenticateJWT, removeFromWatchlist);
router.get('/leaderboard', getLeaderboard);

export default router;
