import mongoose from 'mongoose';
import { User, IUser } from '../models/User';
import { Portfolio, IPortfolio } from '../models/Portfolio';
import { ChatMessage, IChatMessage } from '../models/ChatMessage';
import { Watchlist, IWatchlist } from '../models/Watchlist';
import { StockAnalysisCache, IStockAnalysisCache } from '../models/StockAnalysisCache';
import { StockDigest, IStockDigest } from '../models/StockDigest';

// In-Memory Storage Repositories
const inMemoryUsers = new Map<string, any>();
const inMemoryPortfolios = new Map<string, any>();
const inMemoryChatMessages: any[] = [];
const inMemoryWatchlists: any[] = [];
const inMemoryAnalysisCache = new Map<string, any>();
const inMemoryDigests: any[] = [];

export const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

// USER REPOSITORY
export const dbUser = {
  async findOneByEmail(email: string) {
    if (isMongoConnected()) {
      try {
        return await User.findOne({ email: email.toLowerCase() }).lean();
      } catch (e) {}
    }
    const target = email.toLowerCase();
    for (const u of inMemoryUsers.values()) {
      if (u.email === target) return u;
    }
    return null;
  },

  async findById(id: string) {
    if (isMongoConnected()) {
      try {
        return await User.findById(id).select('-passwordHash').lean();
      } catch (e) {}
    }
    const u = inMemoryUsers.get(id.toString());
    if (!u) return null;
    const copy = { ...u };
    delete copy.passwordHash;
    return copy;
  },

  async create(data: { email: string; passwordHash: string; name: string; avatarUrl?: string; emailDigestOptIn?: boolean }) {
    const id = new mongoose.Types.ObjectId().toString();
    const doc = {
      _id: id,
      email: data.email.toLowerCase(),
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

  async updateProfile(id: string, updates: { name?: string; avatarUrl?: string; emailDigestOptIn?: boolean }) {
    if (isMongoConnected()) {
      try {
        const updated = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
        if (updated) return updated;
      } catch (e) {}
    }

    const u = inMemoryUsers.get(id.toString());
    if (u) {
      if (updates.name !== undefined) u.name = updates.name;
      if (updates.avatarUrl !== undefined) u.avatarUrl = updates.avatarUrl;
      if (updates.emailDigestOptIn !== undefined) u.emailDigestOptIn = updates.emailDigestOptIn;
      u.updatedAt = new Date();
      return u;
    }
    return null;
  },

  async findOptInUsers() {
    if (isMongoConnected()) {
      try {
        return await User.find({ emailDigestOptIn: true }).lean();
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

// CHAT MESSAGE REPOSITORY
export const dbChatMessage = {
  async create(data: { userId: string; ticker: string; content: string; roiAtSend: number; rankTier: string }) {
    const id = new mongoose.Types.ObjectId().toString();
    const doc = {
      _id: id,
      userId: data.userId.toString(),
      ticker: data.ticker.toUpperCase(),
      content: data.content,
      roiAtSend: data.roiAtSend,
      rankTier: data.rankTier,
      createdAt: new Date(),
    };

    if (isMongoConnected()) {
      try {
        await ChatMessage.create(doc);
      } catch (e) {}
    }

    inMemoryChatMessages.push(doc);
    return doc;
  },

  async findByTicker(ticker: string, limit = 50) {
    const symbol = ticker.toUpperCase();
    if (isMongoConnected()) {
      try {
        const msgs = await ChatMessage.find({ ticker: symbol })
          .sort({ createdAt: -1 })
          .limit(limit)
          .populate('userId', 'name avatarUrl')
          .lean();
        if (msgs.length > 0) return msgs.reverse();
      } catch (e) {}
    }

    const filtered = inMemoryChatMessages
      .filter((m) => m.ticker === symbol)
      .slice(-limit)
      .map((m) => {
        const u = inMemoryUsers.get(m.userId.toString());
        return {
          ...m,
          userId: {
            _id: m.userId,
            name: u?.name || 'Trader',
            avatarUrl: u?.avatarUrl || '',
          },
        };
      });

    return filtered;
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
    const symbol = ticker.toUpperCase();
    if (isMongoConnected()) {
      try {
        const doc = await Watchlist.findOneAndUpdate(
          { userId, ticker: symbol },
          { userId, ticker: symbol, notes },
          { upsert: true, new: true }
        ).lean();
        if (doc) return doc;
      } catch (e) {}
    }

    const existingIdx = inMemoryWatchlists.findIndex(
      (w) => w.userId.toString() === userId.toString() && w.ticker === symbol
    );
    const item = {
      _id: new mongoose.Types.ObjectId().toString(),
      userId: userId.toString(),
      ticker: symbol,
      notes,
      createdAt: new Date(),
    };

    if (existingIdx >= 0) {
      inMemoryWatchlists[existingIdx] = item;
    } else {
      inMemoryWatchlists.push(item);
    }
    return item;
  },

  async delete(userId: string, ticker: string) {
    const symbol = ticker.toUpperCase();
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

// STOCK ANALYSIS CACHE REPOSITORY
export const dbAnalysisCache = {
  async findByTicker(ticker: string) {
    const symbol = ticker.toUpperCase();
    if (isMongoConnected()) {
      try {
        const doc = await StockAnalysisCache.findOne({ ticker: symbol }).lean();
        if (doc) return doc;
      } catch (e) {}
    }
    return inMemoryAnalysisCache.get(symbol) || null;
  },

  async upsert(data: any) {
    const symbol = data.ticker.toUpperCase();
    if (isMongoConnected()) {
      try {
        await StockAnalysisCache.findOneAndUpdate({ ticker: symbol }, data, { upsert: true });
      } catch (e) {}
    }
    inMemoryAnalysisCache.set(symbol, data);
    return data;
  },
};

// STOCK DIGEST LOG REPOSITORY
export const dbStockDigest = {
  async create(data: any) {
    if (isMongoConnected()) {
      try {
        await StockDigest.create(data);
      } catch (e) {}
    }
    inMemoryDigests.push(data);
    return data;
  },

  async findByUserId(userId: string) {
    if (isMongoConnected()) {
      try {
        const list = await StockDigest.find({ userId }).sort({ sentAt: -1 }).limit(10).lean();
        if (list.length > 0) return list;
      } catch (e) {}
    }
    return inMemoryDigests.filter((d) => d.userId?.toString() === userId.toString()).slice(-10);
  },
};
