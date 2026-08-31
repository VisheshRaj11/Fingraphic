import mongoose, { Schema, Document, Types } from 'mongoose';
import { HoldingSide } from '../types/index';

export interface IHolding {
  _id?: Types.ObjectId;
  ticker: string;
  quantity: number;
  avgBuyPrice: number;
  side: HoldingSide;
}

export interface IPortfolio extends Document {
  userId: Types.ObjectId;
  initialCapital: number;
  cashBalance: number;
  holdings: IHolding[];
  createdAt: Date;
  updatedAt: Date;
}

const HoldingSchema = new Schema<IHolding>({
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  avgBuyPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  side: {
    type: String,
    enum: ['BUY', 'SELL'],
    default: 'BUY',
  },
});

const PortfolioSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    initialCapital: {
      type: Number,
      default: 100000,
    },
    cashBalance: {
      type: Number,
      default: 100000,
    },
    holdings: [HoldingSchema],
  },
  {
    timestamps: true,
  }
);

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
