import { Response } from 'express';
import { getConversationHistory } from '../services/chatService';
import { AuthenticatedRequest } from '../types/index';

export const getHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const rawId = req.params.userId;
    const targetUserId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!targetUserId) {
      res.status(400).json({ message: 'Target user ID is required.' });
      return;
    }

    const history = await getConversationHistory(req.user.userId, targetUserId, 50);
    res.json({ history });
  } catch (error: any) {
    const statusCode = error.message?.includes('only allowed between connected users') ? 403 : 500;
    res.status(statusCode).json({ message: error.message || 'Error fetching chat history.' });
  }
};
