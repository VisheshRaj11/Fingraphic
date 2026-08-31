import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IStockDigest extends Document {
  userId: Types.ObjectId;
  tickers: string[];
  verdictJson: any;
  sentAt: Date;
  success: boolean;
  errorMsg?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StockDigestSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tickers: {
      type: [String],
      required: true,
    },
    verdictJson: {
      type: Schema.Types.Mixed,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    success: {
      type: Boolean,
      default: true,
    },
    errorMsg: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const StockDigest = mongoose.model<IStockDigest>('StockDigest', StockDigestSchema);
