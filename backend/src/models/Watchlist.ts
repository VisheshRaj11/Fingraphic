import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWatchlist extends Document {
  userId: Types.ObjectId;
  ticker: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistSchema: Schema = new Schema(
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
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

WatchlistSchema.index({ userId: 1, ticker: 1 }, { unique: true });

export const Watchlist = mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
