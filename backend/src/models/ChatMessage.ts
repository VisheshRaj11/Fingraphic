import mongoose, { Schema, Document, Types } from 'mongoose';
import { RankTier } from '../types/index';

export interface IChatMessage extends Document {
  userId: Types.ObjectId;
  ticker: string;
  content: string;
  roiAtSend: number;
  rankTier: RankTier;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ticker: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    roiAtSend: {
      type: Number,
      default: 0,
    },
    rankTier: {
      type: String,
      enum: ['MASTER_TRADER', 'PRO_TRADER', 'NOVICE'],
      default: 'NOVICE',
    },
  },
  {
    timestamps: true,
  }
);

ChatMessageSchema.index({ ticker: 1, createdAt: -1 });

export const ChatMessage = mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
