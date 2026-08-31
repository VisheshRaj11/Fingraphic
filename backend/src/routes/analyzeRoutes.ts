import { Router } from 'express';
import { getStockAnalysis, getRawMarketData } from '../controllers/analyzeController';

const router = Router();

router.get('/:ticker', getStockAnalysis);
router.get('/market-data/:ticker', getRawMarketData);

export default router;
