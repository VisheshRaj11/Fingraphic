import { dbChatMessage, dbUser } from '../config/storage';
import { getConnectionStatus } from './connectionService';
import { calculateAndSyncUserROI } from './leaderboardService';

/**
 * Builds a deterministic conversation key from two user IDs sorted alphabetically
 */
export function buildConversationKey(userIdA: string, userIdB: string): string {
  const ids = [userIdA.toString(), userIdB.toString()].sort();
  return `${ids[0]}_${ids[1]}`;
}

/**
 * Throws if the two users are not connected
 */
export async function assertUsersConnected(userIdA: string, userIdB: string): Promise<void> {
  const status = await getConnectionStatus(userIdA, userIdB);
  if (status !== 'CONNECTED') {
    throw new Error('Private messaging is only allowed between connected users.');
  }
}

/**
 * Saves a 1:1 private message between two connected users
 */
export async function saveMessage(data: { senderId: string; recipientId: string; content: string }) {
  const { senderId, recipientId, content } = data;

  if (!content || content.trim().length === 0) {
    throw new Error('Message content cannot be empty.');
  }

  if (content.length > 500) {
    throw new Error('Message content exceeds 500 characters limit.');
  }

  // Server-side enforcement of connection constraint
  await assertUsersConnected(senderId, recipientId);

  const conversationKey = buildConversationKey(senderId, recipientId);
  const senderRoiData = await calculateAndSyncUserROI(senderId);

  const savedMsg = await dbChatMessage.create({
    senderId,
    recipientId,
    conversationKey,
    content: content.trim(),
    roiAtSend: senderRoiData.roi,
    rankTier: senderRoiData.rankTier,
  });

  return savedMsg;
}

/**
 * Retrieves conversation history between two connected users
 */
export async function getConversationHistory(userIdA: string, userIdB: string, limit = 50) {
  await assertUsersConnected(userIdA, userIdB);

  const conversationKey = buildConversationKey(userIdA, userIdB);
  const rawMessages = await dbChatMessage.findByConversationKey(conversationKey, limit);

  const formatted = [];
  for (const msg of rawMessages) {
    const sender = await dbUser.findById(msg.senderId);
    formatted.push({
      id: msg._id,
      senderId: msg.senderId.toString(),
      recipientId: msg.recipientId.toString(),
      content: msg.content,
      roiAtSend: msg.roiAtSend,
      rankTier: msg.rankTier,
      createdAt: msg.createdAt,
      sender: {
        id: sender?._id || msg.senderId,
        name: sender?.name || 'Trader',
        avatarUrl: sender?.avatarUrl || '',
      },
    });
  }

  return formatted;
}
