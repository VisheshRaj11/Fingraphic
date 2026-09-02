import { Response } from 'express';
import { dbUser } from '../config/storage';
import { calculateAndSyncUserROI } from '../services/leaderboardService';
import { getConnectionStatus } from '../services/connectionService';
import { AuthenticatedRequest } from '../types/index';

export const searchUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const query = typeof req.query.query === 'string' ? req.query.query : '';
    const users = await dbUser.searchUsers(query, req.user.userId, 20);

    const results = [];
    for (const u of users) {
      const uId = u._id.toString();
      const roiData = await calculateAndSyncUserROI(uId);
      const connStatus = await getConnectionStatus(req.user.userId, uId);

      results.push({
        id: uId,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatarUrl || '',
        rankTier: roiData.rankTier,
        roi: roiData.roi,
        connectionStatus: connStatus,
      });
    }

    res.json({ users: results });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error searching user directory.' });
  }
};
