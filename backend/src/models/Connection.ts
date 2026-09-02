import mongoose, { Schema, Document } from 'mongoose';

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface IConnection extends Document {
  requesterId: mongoose.Types.ObjectId;
  recipientId: mongoose.Types.ObjectId;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const ConnectionSchema: Schema = new Schema(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index to prevent duplicate requests between same pair
ConnectionSchema.index({ requesterId: 1, recipientId: 1 }, { unique: true });

export const Connection = mongoose.model<IConnection>('Connection', ConnectionSchema);
