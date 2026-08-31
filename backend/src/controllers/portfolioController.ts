import { Response } from 'express';
import { dbPortfolio, dbWatchlist } from '../config/storage';
import { fetchMarketData } from '../services/marketDataService';
import { calculateAndSyncUserROI, getGlobalLeaderboard } from '../services/leaderboardService';
import { AuthenticatedRequest, HoldingSide } from '../types/index';

export const getPortfolio = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let portfolio = await dbPortfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      portfolio = await dbPortfolio.create({
        userId: req.user.userId,
        initialCapital: 100000,
        cashBalance: 100000,
        holdings: [],
      });
    }

    // Enrich holdings with live market prices
    const holdingsList = portfolio.holdings || [];
    const enrichedHoldings = await Promise.all(
      holdingsList.map(async (h: any) => {
        const m = await fetchMarketData(h.ticker);
        const currentValue = h.quantity * m.currentPrice;
        const totalCost = h.quantity * h.avgBuyPrice;
        const unRealizedPnL = currentValue - totalCost;
        const unRealizedPnLPct = totalCost > 0 ? (unRealizedPnL / totalCost) * 100 : 0;

        return {
          _id: h._id,
          ticker: h.ticker,
          quantity: h.quantity,
          avgBuyPrice: h.avgBuyPrice,
          side: h.side,
          currentPrice: m.currentPrice,
          currentValue: parseFloat(currentValue.toFixed(2)),
          unRealizedPnL: parseFloat(unRealizedPnL.toFixed(2)),
          unRealizedPnLPct: parseFloat(unRealizedPnLPct.toFixed(2)),
        };
      })
    );

    const roiData = await calculateAndSyncUserROI(req.user.userId);

    res.json({
      portfolio: {
        id: portfolio._id,
        initialCapital: portfolio.initialCapital,
        cashBalance: portfolio.cashBalance,
        holdings: enrichedHoldings,
        portfolioValue: roiData.portfolioValue,
        roi: roiData.roi,
        rankTier: roiData.rankTier,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching portfolio.' });
  }
};

export const executeTrade = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { ticker, quantity, side } = req.body as { ticker: string; quantity: number; side: HoldingSide };

    if (!ticker || !quantity || quantity <= 0 || !['BUY', 'SELL'].includes(side)) {
      res.status(400).json({ message: 'Invalid trade parameters.' });
      return;
    }

    const symbol = ticker.toUpperCase().trim();
    const marketData = await fetchMarketData(symbol);
    const executePrice = marketData.currentPrice;
    const tradeTotal = executePrice * quantity;

    let portfolio = await dbPortfolio.findByUserId(req.user.userId);
    if (!portfolio) {
      portfolio = await dbPortfolio.create({
        userId: req.user.userId,
        initialCapital: 100000,
        cashBalance: 100000,
        holdings: [],
      });
    }

    if (!portfolio.holdings) portfolio.holdings = [];

    if (side === 'BUY') {
      if (portfolio.cashBalance < tradeTotal) {
        res.status(400).json({
          message: `Insufficient cash balance. Required: $${tradeTotal.toFixed(2)}, Available: $${portfolio.cashBalance.toFixed(2)}`,
        });
        return;
      }

      portfolio.cashBalance -= tradeTotal;

      // Check-then-update inside embedded holdings array
      const existingHoldingIndex = portfolio.holdings.findIndex((h: any) => h.ticker === symbol);
      if (existingHoldingIndex >= 0) {
        const existing = portfolio.holdings[existingHoldingIndex];
        const newTotalQty = existing.quantity + quantity;
        const newAvgPrice = (existing.quantity * existing.avgBuyPrice + tradeTotal) / newTotalQty;
        portfolio.holdings[existingHoldingIndex].quantity = newTotalQty;
        portfolio.holdings[existingHoldingIndex].avgBuyPrice = parseFloat(newAvgPrice.toFixed(2));
      } else {
        portfolio.holdings.push({
          ticker: symbol,
          quantity,
          avgBuyPrice: executePrice,
          side: 'BUY',
        });
      }
    } else {
      // SELL trade
      const existingHoldingIndex = portfolio.holdings.findIndex((h: any) => h.ticker === symbol);
      if (existingHoldingIndex < 0 || portfolio.holdings[existingHoldingIndex].quantity < quantity) {
        res.status(400).json({ message: `Insufficient shares of ${symbol} to sell.` });
        return;
      }

      portfolio.cashBalance += tradeTotal;
      const existing = portfolio.holdings[existingHoldingIndex];
      existing.quantity -= quantity;

      if (existing.quantity === 0) {
        portfolio.holdings.splice(existingHoldingIndex, 1);
      }
    }

    await dbPortfolio.save(portfolio);

    // Trigger ROI calculation and sync to Redis ZSET
    const roiData = await calculateAndSyncUserROI(req.user.userId);

    res.json({
      message: `Successfully executed ${side} trade for ${quantity} shares of ${symbol} at $${executePrice}`,
      cashBalance: portfolio.cashBalance,
      roi: roiData.roi,
      rankTier: roiData.rankTier,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Trade execution failed.' });
  }
};

export const getWatchlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const items = await dbWatchlist.findByUserId(req.user.userId);
    const enriched = await Promise.all(
      items.map(async (item: any) => {
        const m = await fetchMarketData(item.ticker);
        return {
          id: item._id,
          ticker: item.ticker,
          notes: item.notes,
          currentPrice: m.currentPrice,
          changePercent: m.changePercent,
          name: m.name,
          createdAt: item.createdAt,
        };
      })
    );

    res.json({ watchlist: enriched });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching watchlist.' });
  }
};

export const addToWatchlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { ticker, notes } = req.body;
    if (!ticker) {
      res.status(400).json({ message: 'Ticker is required.' });
      return;
    }

    const symbol = ticker.toUpperCase().trim();
    const item = await dbWatchlist.upsert(req.user.userId, symbol, notes || '');

    res.status(201).json({ item });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error adding to watchlist.' });
  }
};

export const removeFromWatchlist = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const rawTicker = Array.isArray(req.params.ticker) ? req.params.ticker[0] : req.params.ticker;
    const ticker = (rawTicker || '').toUpperCase().trim();
    await dbWatchlist.delete(req.user.userId, ticker);
    res.json({ message: `Removed ${ticker} from watchlist.` });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error removing from watchlist.' });
  }
};

export const getLeaderboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const leaderboard = await getGlobalLeaderboard(20);
    res.json({ leaderboard });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching leaderboard.' });
  }
};
