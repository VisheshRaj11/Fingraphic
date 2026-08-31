export type RankTier = 'MASTER_TRADER' | 'PRO_TRADER' | 'NOVICE';
export type Verdict = 'INVEST' | 'HOLD' | 'AVOID';
export type HoldingSide = 'BUY' | 'SELL';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  emailDigestOptIn: boolean;
}

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

export interface Holding {
  _id?: string;
  ticker: string;
  quantity: number;
  avgBuyPrice: number;
  side: HoldingSide;
  currentPrice: number;
  currentValue: number;
  unRealizedPnL: number;
  unRealizedPnLPct: number;
}

export interface Portfolio {
  id: string;
  initialCapital: number;
  cashBalance: number;
  holdings: Holding[];
  portfolioValue: number;
  roi: number;
  rankTier: RankTier;
}

export interface WatchlistItem {
  id: string;
  ticker: string;
  notes?: string;
  currentPrice: number;
  changePercent: number;
  name: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  ticker: string;
  content: string;
  roiAtSend: number;
  rankTier: RankTier;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl: string;
  roi: number;
  rankTier: RankTier;
  portfolioValue: number;
  rank: number;
}
