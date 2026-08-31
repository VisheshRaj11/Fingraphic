import { Request, Response } from 'express';
import { analyzeStock } from '../services/agentService';
import { fetchMarketData } from '../services/marketDataService';

export const getStockAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawTicker = Array.isArray(req.params.ticker) ? req.params.ticker[0] : req.params.ticker;
    const ticker = (rawTicker || 'AAPL').toUpperCase().trim();
    const result = await analyzeStock(ticker);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Analysis failed.' });
  }
};

export const getRawMarketData = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawTicker = Array.isArray(req.params.ticker) ? req.params.ticker[0] : req.params.ticker;
    const ticker = (rawTicker || 'AAPL').toUpperCase().trim();
    const data = await fetchMarketData(ticker);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Market data fetch failed.' });
  }
};
