import { Response } from 'express';
import { executeDailyDigestProcess } from '../services/emailCron';
import { dbStockDigest } from '../config/storage';
import { AuthenticatedRequest } from '../types/index';

export const triggerManualDigest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const result = await executeDailyDigestProcess();
    res.json({
      message: `Manual daily digest execution completed. Processed ${result.processedCount} users, Sent ${result.successCount} emails.`,
      result,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Manual digest trigger failed.' });
  }
};

export const getDigestHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const history = await dbStockDigest.findByUserId(req.user.userId);
    res.json({ history });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching digest history.' });
  }
};
