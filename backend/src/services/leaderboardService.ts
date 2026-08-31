import { dbPortfolio, dbUser } from '../config/storage';
import { zAddLeaderboard, zRevRangeLeaderboard } from '../config/redis';
import { fetchMarketData } from './marketDataService';
import { RankTier } from '../types/index';

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl: string;
  roi: number;
  rankTier: RankTier;
  portfolioValue: number;
  rank: number;
}

/**
 * Calculates current ROI percentage for a user's portfolio and syncs to Redis ZSET
 */
export async function calculateAndSyncUserROI(userId: string): Promise<{ roi: number; rankTier: RankTier; portfolioValue: number }> {
  const portfolio = await dbPortfolio.findByUserId(userId);

  if (!portfolio) {
    return { roi: 0, rankTier: 'NOVICE', portfolioValue: 100000 };
  }

  let totalHoldingsValue = 0;
  const holdings = portfolio.holdings || [];

  // Price each holding against live market data
  for (const holding of holdings) {
    if (holding.quantity > 0) {
      const marketData = await fetchMarketData(holding.ticker);
      totalHoldingsValue += holding.quantity * marketData.currentPrice;
    }
  }

  const portfolioValue = (portfolio.cashBalance || 100000) + totalHoldingsValue;
  const initialCapital = portfolio.initialCapital || 100000;
  const roi = parseFloat((((portfolioValue - initialCapital) / initialCapital) * 100).toFixed(2));

  // Determine Rank Tier
  let rankTier: RankTier = 'NOVICE';
  if (roi > 30) {
    rankTier = 'MASTER_TRADER';
  } else if (roi > 10) {
    rankTier = 'PRO_TRADER';
  }

  // Update Redis ZSET
  await zAddLeaderboard('global_leaderboard', roi, userId.toString());

  return { roi, rankTier, portfolioValue };
}

/**
 * Retrieves the top global traders from Redis ZSET with user profile details
 */
export async function getGlobalLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const zsetEntries = await zRevRangeLeaderboard('global_leaderboard', 0, limit - 1);

  if (zsetEntries.length === 0) {
    const portfolios = await dbPortfolio.findAll();
    const results: LeaderboardEntry[] = [];

    for (let i = 0; i < Math.min(portfolios.length, limit); i++) {
      const p = portfolios[i];
      const user = await dbUser.findById(p.userId);
      if (!user) continue;

      const roiData = await calculateAndSyncUserROI(p.userId.toString());
      results.push({
        userId: p.userId.toString(),
        name: user.name,
        avatarUrl: user.avatarUrl || '',
        roi: roiData.roi,
        rankTier: roiData.rankTier,
        portfolioValue: roiData.portfolioValue,
        rank: i + 1,
      });
    }

    return results.sort((a, b) => b.roi - a.roi);
  }

  const leaderboard: LeaderboardEntry[] = [];
  for (let i = 0; i < zsetEntries.length; i++) {
    const entry = zsetEntries[i];
    const user = await dbUser.findById(entry.member);
    if (!user) continue;

    const roi = entry.score;
    let rankTier: RankTier = 'NOVICE';
    if (roi > 30) rankTier = 'MASTER_TRADER';
    else if (roi > 10) rankTier = 'PRO_TRADER';

    const portfolio = await dbPortfolio.findByUserId(user._id);
    const portfolioValue = portfolio ? portfolio.cashBalance : 100000;

    leaderboard.push({
      userId: entry.member,
      name: user.name,
      avatarUrl: user.avatarUrl || '',
      roi,
      rankTier,
      portfolioValue,
      rank: i + 1,
    });
  }

  return leaderboard;
}
