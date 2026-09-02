import { dbConnection, dbUser, dbPortfolio } from '../config/storage';
import { calculateAndSyncUserROI } from './leaderboardService';
import { ConnectionStatus } from '../models/Connection';

export type UserConnectionStatus = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'CONNECTED';

/**
 * Checks connection status between two user IDs from userIdA's perspective
 */
export async function getConnectionStatus(userIdA: string, userIdB: string): Promise<UserConnectionStatus> {
  if (userIdA.toString() === userIdB.toString()) return 'NONE';

  const conn = await dbConnection.findBetween(userIdA, userIdB);
  if (!conn) return 'NONE';

  if (conn.status === 'ACCEPTED') return 'CONNECTED';
  if (conn.status === 'PENDING') {
    if (conn.requesterId.toString() === userIdA.toString()) return 'PENDING_SENT';
    return 'PENDING_RECEIVED';
  }

  return 'NONE';
}

/**
 * Initiates a connection request from requester to recipient
 */
export async function sendConnectionRequest(requesterId: string, recipientId: string) {
  if (requesterId.toString() === recipientId.toString()) {
    throw new Error('Cannot send connection request to yourself.');
  }

  const recipient = await dbUser.findById(recipientId);
  if (!recipient) {
    throw new Error('Recipient user not found.');
  }

  const existingStatus = await getConnectionStatus(requesterId, recipientId);
  if (existingStatus === 'CONNECTED') {
    throw new Error('Users are already connected.');
  }
  if (existingStatus === 'PENDING_SENT') {
    throw new Error('Connection request already sent.');
  }
  if (existingStatus === 'PENDING_RECEIVED') {
    throw new Error('Recipient has already sent you a connection request. Please accept it.');
  }

  const newConn = await dbConnection.create({
    requesterId,
    recipientId,
    status: 'PENDING',
  });

  return newConn;
}

/**
 * Responds to an incoming connection request
 */
export async function respondToConnectionRequest(
  connectionId: string,
  responderId: string,
  decision: 'ACCEPTED' | 'REJECTED'
) {
  const conn = await dbConnection.findById(connectionId);
  if (!conn) {
    throw new Error('Connection request not found.');
  }

  if (conn.recipientId.toString() !== responderId.toString()) {
    throw new Error('Unauthorized to respond to this connection request.');
  }

  if (conn.status !== 'PENDING') {
    throw new Error(`Connection request is already ${conn.status.toLowerCase()}.`);
  }

  const updated = await dbConnection.updateStatus(connectionId, decision as ConnectionStatus);
  return updated;
}

/**
 * Retrieves all accepted connections for a user with basic profile info & rank tier
 */
export async function listConnectionsForUser(userId: string) {
  const connections = await dbConnection.listConnectionsForUser(userId);
  const results = [];

  for (const conn of connections) {
    const otherUserId =
      conn.requesterId.toString() === userId.toString()
        ? conn.recipientId.toString()
        : conn.requesterId.toString();

    const otherUser = await dbUser.findById(otherUserId);
    if (!otherUser) continue;

    const roiData = await calculateAndSyncUserROI(otherUserId);

    results.push({
      connectionId: conn._id,
      user: {
        id: otherUser._id,
        name: otherUser.name,
        avatarUrl: otherUser.avatarUrl || '',
        rankTier: roiData.rankTier,
        roi: roiData.roi,
      },
      connectedAt: conn.updatedAt || conn.createdAt,
    });
  }

  return results;
}

/**
 * Retrieves all pending incoming connection requests for a user
 */
export async function listPendingRequestsForUser(userId: string) {
  const pending = await dbConnection.listPendingRequestsForUser(userId);
  const results = [];

  for (const conn of pending) {
    const requester = await dbUser.findById(conn.requesterId);
    if (!requester) continue;

    const roiData = await calculateAndSyncUserROI(conn.requesterId.toString());

    results.push({
      connectionId: conn._id,
      requester: {
        id: requester._id,
        name: requester.name,
        avatarUrl: requester.avatarUrl || '',
        rankTier: roiData.rankTier,
        roi: roiData.roi,
      },
      createdAt: conn.createdAt,
    });
  }

  return results;
}
