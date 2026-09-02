import mongoose from 'mongoose';
import { isMongoConnected } from './db';
import { User } from '../models/User';
import { Portfolio } from '../models/Portfolio';
import { ChatMessage } from '../models/ChatMessage';
import { Connection, ConnectionStatus } from '../models/Connection';
import { Watchlist } from '../models/Watchlist';
import { StockAnalysisCache } from '../models/StockAnalysisCache';
import { StockDigest } from '../models/StockDigest';

// In-memory Fallback Maps
const inMemoryUsers = new Map<string, any>();
const inMemoryPortfolios = new Map<string, any>();
const inMemoryConnections = new Map<string, any>();
const inMemoryChatMessages: any[] = [];
const inMemoryWatchlists: any[] = [];
const inMemoryAnalysisCache = new Map<string, any>();
const inMemoryStockDigests: any[] = [];

// USER REPOSITORY
export const dbUser = {
  async findOneByEmail(email: string) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected()) {
      try {
        const u = await User.findOne({ email: cleanEmail }).lean();
        if (u) return u;
      } catch (e) {}
    }
    return Array.from(inMemoryUsers.values()).find((u) => u.email === cleanEmail) || null;
  },

  async findById(id: string) {
    if (isMongoConnected()) {
      try {
        const u = await User.findById(id).select('-passwordHash').lean();
        if (u) return u;
      } catch (e) {}
    }
    return inMemoryUsers.get(id.toString()) || null;
  },

  async searchUsers(query: string, excludeUserId: string, limit = 20) {
    const cleanQuery = (query || '').toLowerCase().trim();
    if (isMongoConnected()) {
      try {
        const filter: any = { _id: { $ne: excludeUserId } };
        if (cleanQuery) {
          filter.$or = [
            { name: { $regex: cleanQuery, $options: 'i' } },
            { email: { $regex: cleanQuery, $options: 'i' } },
          ];
        }
        const list = await User.find(filter).select('-passwordHash').limit(limit).lean();
        if (list.length > 0) return list;
      } catch (e) {}
    }

    return Array.from(inMemoryUsers.values())
      .filter((u) => u._id.toString() !== excludeUserId.toString())
      .filter((u) => {
        if (!cleanQuery) return true;
        return (
          (u.name && u.name.toLowerCase().includes(cleanQuery)) ||
          (u.email && u.email.toLowerCase().includes(cleanQuery))
        );
      })
      .slice(0, limit);
  },

  async create(data: { email: string; passwordHash: string; name: string; avatarUrl?: string; emailDigestOptIn?: boolean }) {
    const id = new mongoose.Types.ObjectId().toString();
    const doc = {
      _id: id,
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      name: data.name,
      avatarUrl: data.avatarUrl || '',
      emailDigestOptIn: data.emailDigestOptIn ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        const created = await User.create(doc);
        return created.toObject();
      } catch (e) {}
    }

    inMemoryUsers.set(id, doc);
    return doc;
  },

  async updateProfile(userId: string, update: { name?: string; avatarUrl?: string; emailDigestOptIn?: boolean }) {
    if (isMongoConnected()) {
      try {
        const updated = await User.findByIdAndUpdate(userId, { $set: update }, { new: true }).select('-passwordHash').lean();
        if (updated) return updated;
      } catch (e) {}
    }

    const existing = inMemoryUsers.get(userId.toString());
    if (existing) {
      if (update.name !== undefined) existing.name = update.name;
      if (update.avatarUrl !== undefined) existing.avatarUrl = update.avatarUrl;
      if (update.emailDigestOptIn !== undefined) existing.emailDigestOptIn = update.emailDigestOptIn;
      existing.updatedAt = new Date();
      inMemoryUsers.set(userId.toString(), existing);
      return existing;
    }
    return null;
  },

  async findOptInUsers() {
    if (isMongoConnected()) {
      try {
        const list = await User.find({ emailDigestOptIn: true }).select('-passwordHash').lean();
        if (list.length > 0) return list;
      } catch (e) {}
    }
    return Array.from(inMemoryUsers.values()).filter((u) => u.emailDigestOptIn);
  },
};

// PORTFOLIO REPOSITORY
export const dbPortfolio = {
  async findByUserId(userId: string) {
    if (isMongoConnected()) {
      try {
        const p = await Portfolio.findOne({ userId }).lean();
        if (p) return p;
      } catch (e) {}
    }
    return inMemoryPortfolios.get(userId.toString()) || null;
  },

  async create(data: { userId: string; initialCapital?: number; cashBalance?: number; holdings?: any[] }) {
    const id = new mongoose.Types.ObjectId().toString();
    const doc = {
      _id: id,
      userId: data.userId.toString(),
      initialCapital: data.initialCapital || 100000,
      cashBalance: data.cashBalance || 100000,
      holdings: data.holdings || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        const created = await Portfolio.create(doc);
        return created.toObject();
      } catch (e) {}
    }

    inMemoryPortfolios.set(data.userId.toString(), doc);
    return doc;
  },

  async save(portfolioDoc: any) {
    if (isMongoConnected()) {
      try {
        await Portfolio.findOneAndUpdate(
          { userId: portfolioDoc.userId },
          {
            cashBalance: portfolioDoc.cashBalance,
            holdings: portfolioDoc.holdings,
          },
          { upsert: true }
        );
      } catch (e) {}
    }
    inMemoryPortfolios.set(portfolioDoc.userId.toString(), portfolioDoc);
    return portfolioDoc;
  },

  async findAll() {
    if (isMongoConnected()) {
      try {
        const list = await Portfolio.find().lean();
        if (list.length > 0) return list;
      } catch (e) {}
    }
    return Array.from(inMemoryPortfolios.values());
  },
};

// CONNECTION REPOSITORY (1:1 Connections)
export const dbConnection = {
  async findBetween(userIdA: string, userIdB: string) {
    const uA = userIdA.toString();
    const uB = userIdB.toString();
    if (isMongoConnected()) {
      try {
        const conn = await Connection.findOne({
          $or: [
            { requesterId: uA, recipientId: uB },
            { requesterId: uB, recipientId: uA },
          ],
        }).lean();
        if (conn) return conn;
      } catch (e) {}
    }

    return (
      Array.from(inMemoryConnections.values()).find(
        (c) =>
          (c.requesterId.toString() === uA && c.recipientId.toString() === uB) ||
          (c.requesterId.toString() === uB && c.recipientId.toString() === uA)
      ) || null
    );
  },

  async findById(connectionId: string) {
    if (isMongoConnected()) {
      try {
        const conn = await Connection.findById(connectionId).lean();
        if (conn) return conn;
      } catch (e) {}
    }
    return inMemoryConnections.get(connectionId.toString()) || null;
  },

  async create(data: { requesterId: string; recipientId: string; status?: ConnectionStatus }) {
    const id = new mongoose.Types.ObjectId().toString();
    const doc = {
      _id: id,
      requesterId: data.requesterId.toString(),
      recipientId: data.recipientId.toString(),
      status: data.status || 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        const created = await Connection.create(doc);
        return created.toObject();
      } catch (e) {}
    }

    inMemoryConnections.set(id, doc);
    return doc;
  },

  async updateStatus(connectionId: string, status: ConnectionStatus) {
    if (isMongoConnected()) {
      try {
        const updated = await Connection.findByIdAndUpdate(
          connectionId,
          { $set: { status } },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (e) {}
    }

    const existing = inMemoryConnections.get(connectionId.toString());
    if (existing) {
      existing.status = status;
      existing.updatedAt = new Date();
      inMemoryConnections.set(connectionId.toString(), existing);
      return existing;
    }
    return null;
  },

  async listConnectionsForUser(userId: string) {
    const uId = userId.toString();
    if (isMongoConnected()) {
      try {
        const list = await Connection.find({
          $or: [
            { requesterId: uId, status: 'ACCEPTED' },
            { recipientId: uId, status: 'ACCEPTED' },
          ],
        }).lean();
        if (list.length > 0) return list;
      } catch (e) {}
    }

    return Array.from(inMemoryConnections.values()).filter(
      (c) =>
        c.status === 'ACCEPTED' &&
        (c.requesterId.toString() === uId || c.recipientId.toString() === uId)
    );
  },

  async listPendingRequestsForUser(userId: string) {
    const uId = userId.toString();
    if (isMongoConnected()) {
      try {
        const list = await Connection.find({
          recipientId: uId,
          status: 'PENDING',
        }).lean();
        if (list.length > 0) return list;
      } catch (e) {}
    }

    return Array.from(inMemoryConnections.values()).filter(
      (c) => c.status === 'PENDING' && c.recipientId.toString() === uId
    );
  },
};

// CHAT MESSAGE REPOSITORY (1:1 Private Messaging)
export const dbChatMessage = {
  async create(data: {
    senderId: string;
    recipientId: string;
    conversationKey: string;
    content: string;
    roiAtSend: number;
    rankTier: string;
  }) {
    const id = new mongoose.Types.ObjectId().toString();
    const doc = {
      _id: id,
      senderId: data.senderId.toString(),
      recipientId: data.recipientId.toString(),
      conversationKey: data.conversationKey,
      content: data.content,
      roiAtSend: data.roiAtSend,
      rankTier: data.rankTier,
      createdAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        const created = await ChatMessage.create(doc);
        return created.toObject();
      } catch (e) {}
    }

    inMemoryChatMessages.push(doc);
    return doc;
  },

  async findByConversationKey(conversationKey: string, limit = 50) {
    if (isMongoConnected()) {
      try {
        const list = await ChatMessage.find({ conversationKey })
          .sort({ createdAt: 1 })
          .limit(limit)
          .lean();
        if (list.length > 0) return list;
      } catch (e) {}
    }

    return inMemoryChatMessages
      .filter((msg) => msg.conversationKey === conversationKey)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-limit);
  },
};

// WATCHLIST REPOSITORY
export const dbWatchlist = {
  async findByUserId(userId: string) {
    if (isMongoConnected()) {
      try {
        const list = await Watchlist.find({ userId }).lean();
        if (list.length > 0) return list;
      } catch (e) {}
    }
    return inMemoryWatchlists.filter((w) => w.userId.toString() === userId.toString());
  },

  async upsert(userId: string, ticker: string, notes = '') {
    const symbol = ticker.toUpperCase().trim();
    if (isMongoConnected()) {
      try {
        const doc = await Watchlist.findOneAndUpdate(
          { userId, ticker: symbol },
          { notes },
          { upsert: true, new: true }
        ).lean();
        if (doc) return doc;
      } catch (e) {}
    }

    const existingIdx = inMemoryWatchlists.findIndex(
      (w) => w.userId.toString() === userId.toString() && w.ticker === symbol
    );
    if (existingIdx >= 0) {
      inMemoryWatchlists[existingIdx].notes = notes;
      return inMemoryWatchlists[existingIdx];
    }

    const newDoc = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId: userId.toString(),
      ticker: symbol,
      notes,
      createdAt: new Date(),
    };
    inMemoryWatchlists.push(newDoc);
    return newDoc;
  },

  async delete(userId: string, ticker: string) {
    const symbol = ticker.toUpperCase().trim();
    if (isMongoConnected()) {
      try {
        await Watchlist.deleteOne({ userId, ticker: symbol });
      } catch (e) {}
    }

    const idx = inMemoryWatchlists.findIndex(
      (w) => w.userId.toString() === userId.toString() && w.ticker === symbol
    );
    if (idx >= 0) {
      inMemoryWatchlists.splice(idx, 1);
    }
  },
};

// ANALYSIS CACHE REPOSITORY
export const dbAnalysisCache = {
  async findByTicker(ticker: string) {
    const symbol = ticker.toUpperCase().trim();
    if (isMongoConnected()) {
      try {
        const cached = await StockAnalysisCache.findOne({ ticker: symbol }).lean();
        if (cached) return cached;
      } catch (e) {}
    }
    return inMemoryAnalysisCache.get(symbol) || null;
  },

  async upsert(data: {
    ticker: string;
    verdict: string;
    metrics: any;
    executiveSummary: any;
    greenFlags: string[];
    redFlags: string[];
    reasoningTrail: any[];
  }) {
    const symbol = data.ticker.toUpperCase().trim();
    const doc = {
      ticker: symbol,
      verdict: data.verdict,
      metrics: data.metrics,
      executiveSummary: data.executiveSummary,
      greenFlags: data.greenFlags,
      redFlags: data.redFlags,
      reasoningTrail: data.reasoningTrail,
      updatedAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        await StockAnalysisCache.findOneAndUpdate({ ticker: symbol }, doc, { upsert: true });
      } catch (e) {}
    }

    inMemoryAnalysisCache.set(symbol, doc);
    return doc;
  },
};

// STOCK DIGEST REPOSITORY
export const dbStockDigest = {
  async create(data: {
    userId: string;
    tickers: string[];
    verdictJson: any;
    sentAt: Date;
    success: boolean;
    errorMsg?: string;
  }) {
    const id = new mongoose.Types.ObjectId().toString();
    const doc = {
      _id: id,
      userId: data.userId.toString(),
      tickers: data.tickers,
      verdictJson: data.verdictJson,
      sentAt: data.sentAt,
      success: data.success,
      errorMsg: data.errorMsg || '',
    };

    if (isMongoConnected()) {
      try {
        const created = await StockDigest.create(doc);
        return created.toObject();
      } catch (e) {}
    }

    inMemoryStockDigests.push(doc);
    return doc;
  },

  async findByUserId(userId: string) {
    if (isMongoConnected()) {
      try {
        const list = await StockDigest.find({ userId }).sort({ sentAt: -1 }).lean();
        if (list.length > 0) return list;
      } catch (e) {}
    }

    return inMemoryStockDigests
      .filter((d) => d.userId.toString() === userId.toString())
      .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  },
};
