import mongoose, { Schema, Document } from 'mongoose';
import { Verdict, StockMetrics, ExecutiveSummary, ReasoningStep } from '../types/index';

export interface IStockAnalysisCache extends Document {
  ticker: string;
  verdict: Verdict;
  metrics: StockMetrics;
  executiveSummary: ExecutiveSummary;
  greenFlags: string[];
  redFlags: string[];
  reasoningTrail: ReasoningStep[];
  createdAt: Date;
  updatedAt: Date;
}

const ReasoningStepSchema = new Schema({
  stepTitle: { type: String, required: true },
  stepDetail: { type: String, required: true },
});

const StockAnalysisCacheSchema: Schema = new Schema(
  {
    ticker: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true,
      trim: true,
    },
    verdict: {
      type: String,
      enum: ['INVEST', 'HOLD', 'AVOID'],
      required: true,
    },
    metrics: {
      type: Schema.Types.Mixed,
      required: true,
    },
    executiveSummary: {
      summaryText: { type: String, required: true },
      analystConfidenceScore: { type: Number, required: true },
    },
    greenFlags: {
      type: [String],
      default: [],
    },
    redFlags: {
      type: [String],
      default: [],
    },
    reasoningTrail: {
      type: [ReasoningStepSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const StockAnalysisCache = mongoose.model<IStockAnalysisCache>(
  'StockAnalysisCache',
  StockAnalysisCacheSchema
);
