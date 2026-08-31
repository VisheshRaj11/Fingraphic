import { Request } from 'express';

export type RankTier = 'MASTER_TRADER' | 'PRO_TRADER' | 'NOVICE';
export type Verdict = 'INVEST' | 'HOLD' | 'AVOID';
export type HoldingSide = 'BUY' | 'SELL';

export interface StockMetrics {
  currentPrice: number;
  targetMeanPrice: number;
  totalRevenue: string;
  grossProfits: string;
  profitMargins: string;
  earningsGrowth: string;
  revenueGrowth: string;
  freeCashflow: string;
  totalCash: string;
  totalDebt: string;
  returnOnEquity: string;
  debtToEquity: string;
  recommendation: string;
}

export interface ExecutiveSummary {
  summaryText: string;
  analystConfidenceScore: number;
}

export interface ReasoningStep {
  stepTitle: string;
  stepDetail: string;
}

export interface AnalysisResult {
  ticker: string;
  verdict: Verdict;
  metrics: StockMetrics;
  executiveSummary: ExecutiveSummary;
  greenFlags: string[];
  redFlags: string[];
  reasoningTrail: ReasoningStep[];
}

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export interface HoldingSubdocument {
  _id?: string;
  ticker: string;
  quantity: number;
  avgBuyPrice: number;
  side: HoldingSide;
}

export interface FinnhubQuote {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High
  l: number; // Low
  o: number; // Open
  pc: number; // Previous close
  t: number; // Timestamp
}

export interface FinnhubProfile {
  name: string;
  ticker: string;
  exchange: string;
  currency: string;
  marketCapitalization: number;
  shareOutstanding: number;
  logo?: string;
  finnhubIndustry?: string;
  weburl?: string;
}
