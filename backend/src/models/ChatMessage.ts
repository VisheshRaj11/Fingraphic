import mongoose, { Schema, Document } from 'mongoose';
import { RankTier } from '../types/index';

export interface IChatMessage extends Document {
  senderId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  conversationKey: string;
  content: string;
  roiAtSend: number;
  rankTier: RankTier;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    conversationKey: { type: String, required: true, index: true },
    content: { type: String, required: true, maxlength: 500 },
    roiAtSend: { type: Number, default: 0 },
    rankTier: {
      type: String,
      enum: ['MASTER_TRADER', 'PRO_TRADER', 'NOVICE'],
      default: 'NOVICE',
    },
  },
  { timestamps: true }
);

// Compound index for fast conversation history retrieval
ChatMessageSchema.index({ conversationKey: 1, createdAt: 1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
