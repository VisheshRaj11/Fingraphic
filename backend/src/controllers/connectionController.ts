import { Response } from 'express';
import {
  sendConnectionRequest,
  respondToConnectionRequest,
  listConnectionsForUser,
  listPendingRequestsForUser,
} from '../services/connectionService';
import { AuthenticatedRequest } from '../types/index';

export const sendRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { recipientId } = req.body;
    if (!recipientId) {
      res.status(400).json({ message: 'Recipient ID is required.' });
      return;
    }

    const connection = await sendConnectionRequest(req.user.userId, recipientId);

    // Emit live socket event to recipient's personal room if io is attached
    const io = req.app.get('io');
    if (io) {
      io.to(`user:${recipientId}`).emit('connection_request_received', {
        connectionId: connection._id,
        requesterId: req.user.userId,
      });
    }

    res.status(201).json({ message: 'Connection request sent successfully.', connection });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to send connection request.' });
  }
};

export const respondRequest = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const rawConnId = req.params.connectionId;
    const connectionId = Array.isArray(rawConnId) ? rawConnId[0] : rawConnId;
    const { decision } = req.body;

    if (!['ACCEPTED', 'REJECTED'].includes(decision)) {
      res.status(400).json({ message: "Decision must be 'ACCEPTED' or 'REJECTED'." });
      return;
    }

    const updatedConn = await respondToConnectionRequest(connectionId, req.user.userId, decision);

    // Emit live socket event to requester if accepted
    const io = req.app.get('io');
    if (io && decision === 'ACCEPTED' && updatedConn) {
      io.to(`user:${updatedConn.requesterId}`).emit('connection_accepted', {
        connectionId: updatedConn._id,
        responderId: req.user.userId,
      });
    }

    res.json({ message: `Connection request ${decision.toLowerCase()}.`, connection: updatedConn });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Failed to respond to connection request.' });
  }
};

export const listConnections = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const connections = await listConnectionsForUser(req.user.userId);
    res.json({ connections });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching connections.' });
  }
};

export const listPending = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const pendingRequests = await listPendingRequestsForUser(req.user.userId);
    res.json({ pendingRequests });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching pending requests.' });
  }
};
