import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';
import { dbUser } from '../config/storage';
import { saveMessage } from '../services/chatService';
import { JWTPayload } from '../types/index';

interface AuthenticatedSocket extends Socket {
  user?: JWTPayload;
}

export function setupSocketIO(io: Server): void {
  // Store io instance on app for controller access
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
    if (!socket.user?.userId) return;

    const userRoom = `user:${socket.user.userId}`;
    socket.join(userRoom);
    console.log(`[Socket.io] User connected: ${socket.user.userId} joined room ${userRoom}`);

    // Send 1:1 Private Message
    socket.on('send_message', async (data: { recipientId: string; content: string }) => {
      if (!socket.user || !data.recipientId || !data.content) {
        socket.emit('error_message', { message: 'Recipient ID and message content are required.' });
        return;
      }

      const senderId = socket.user.userId;
      const recipientId = data.recipientId.toString();
      const content = data.content.substring(0, 500);

      try {
        const sender = await dbUser.findById(senderId);
        if (!sender) {
          socket.emit('error_message', { message: 'Sender user profile not found.' });
          return;
        }

        // Save message (asserts connection server-side)
        const savedDoc = await saveMessage({ senderId, recipientId, content });

        const broadcastPayload = {
          id: savedDoc._id,
          senderId,
          recipientId,
          content: savedDoc.content,
          roiAtSend: savedDoc.roiAtSend,
          rankTier: savedDoc.rankTier,
          createdAt: savedDoc.createdAt,
          sender: {
            id: sender._id,
            name: sender.name,
            avatarUrl: sender.avatarUrl || '',
          },
        };

        // Emit new_message to BOTH personal rooms (sender & recipient)
        io.to(`user:${senderId}`).emit('new_message', broadcastPayload);
        io.to(`user:${recipientId}`).emit('new_message', broadcastPayload);
      } catch (err: any) {
        console.error(`[Socket.io] 1:1 message send error (${senderId} -> ${recipientId}):`, err.message);
        socket.emit('error_message', { message: err.message || 'Failed to send message.' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] User disconnected: ${socket.user?.userId} (${socket.id})`);
    });
  });
}
