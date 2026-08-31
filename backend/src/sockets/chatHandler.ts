import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { dbChatMessage, dbUser } from '../config/storage';
import { calculateAndSyncUserROI } from '../services/leaderboardService';
import { JWTPayload } from '../types/index';

interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

export function setupSocketIO(io: Server): void {
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const decoded = jwt.verify(token, ENV.JWT_SECRET as string) as JWTPayload;
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Invalid or expired socket token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`[Socket.io] User connected: ${socket.user?.userId} (${socket.id})`);

    // Join Ticker Room
    socket.on('join_room', async (ticker: string) => {
      if (!ticker) return;
      const symbol = ticker.toUpperCase().trim();
      const room = `room:${symbol}`;
      socket.join(room);
      console.log(`[Socket.io] User ${socket.user?.userId} joined ${room}`);

      try {
        const history = await dbChatMessage.findByTicker(symbol, 50);
        const formatted = history.map((msg: any) => ({
          id: msg._id,
          ticker: msg.ticker,
          content: msg.content,
          roiAtSend: msg.roiAtSend,
          rankTier: msg.rankTier,
          createdAt: msg.createdAt,
          user: {
            id: msg.userId?._id || msg.userId,
            name: msg.userId?.name || 'Trader',
            avatarUrl: msg.userId?.avatarUrl || '',
          },
        }));

        socket.emit('room_history', { ticker: symbol, messages: formatted });
      } catch (err: any) {
        console.error(`[Socket.io] Error fetching room history for ${symbol}:`, err.message);
      }
    });

    // Leave Ticker Room
    socket.on('leave_room', (ticker: string) => {
      if (!ticker) return;
      const room = `room:${ticker.toUpperCase().trim()}`;
      socket.leave(room);
      console.log(`[Socket.io] User ${socket.user?.userId} left ${room}`);
    });

    // Send Room Message
    socket.on('send_message', async (data: { ticker: string; content: string }) => {
      if (!socket.user || !data.ticker || !data.content) return;

      const symbol = data.ticker.toUpperCase().trim();
      const content = data.content.substring(0, 500);

      try {
        const user = await dbUser.findById(socket.user.userId);
        if (!user) return;

        const roiData = await calculateAndSyncUserROI(socket.user.userId);

        const chatDoc = await dbChatMessage.create({
          userId: socket.user.userId,
          ticker: symbol,
          content,
          roiAtSend: roiData.roi,
          rankTier: roiData.rankTier,
        });

        const broadcastPayload = {
          id: chatDoc._id,
          ticker: symbol,
          content,
          roiAtSend: roiData.roi,
          rankTier: roiData.rankTier,
          createdAt: chatDoc.createdAt,
          user: {
            id: user._id,
            name: user.name,
            avatarUrl: user.avatarUrl || '',
          },
        };

        const room = `room:${symbol}`;
        io.to(room).emit('new_message', broadcastPayload);
      } catch (err: any) {
        console.error(`[Socket.io] Error processing message send for ${symbol}:`, err.message);
        socket.emit('error_message', { message: 'Failed to broadcast message.' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] User disconnected: ${socket.user?.userId} (${socket.id})`);
    });
  });
}
