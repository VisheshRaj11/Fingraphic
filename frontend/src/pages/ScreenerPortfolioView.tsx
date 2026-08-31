import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TrendingUp, Mail, Bookmark, Wallet, ArrowUpRight, Trash2, CheckCircle2, Plus } from 'lucide-react';
import { RootState, AppDispatch } from '../app/store';
import { fetchPortfolio, fetchWatchlist, removeFromWatchlist, addToWatchlist } from '../features/portfolio/portfolioSlice';
import { api } from '../lib/api';
import { RankBadge } from '../components/shared/Badge';

interface ScreenerPortfolioViewProps {
  onOpenTradeModal: (ticker: string) => void;
}

export const ScreenerPortfolioView: React.FC<ScreenerPortfolioViewProps> = ({ onOpenTradeModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { portfolio, watchlist, isLoading } = useSelector((state: RootState) => state.portfolio);

  const [digestStatus, setDigestStatus] = useState<string | null>(null);
  const [isDigestSending, setIsDigestSending] = useState(false);
  const [newWatchlistTicker, setNewWatchlistTicker] = useState('');

  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchWatchlist());
  }, [dispatch]);

  const topScreenerStocks = [
    { ticker: 'NVDA', name: 'NVIDIA Corp', price: 128.5, change: 3.4, verdict: 'INVEST' },
    { ticker: 'AAPL', name: 'Apple Inc.', price: 224.2, change: 1.2, verdict: 'INVEST' },
    { ticker: 'MSFT', name: 'Microsoft Corp', price: 448.9, change: 0.8, verdict: 'HOLD' },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', price: 186.4, change: 2.1, verdict: 'INVEST' },
    { ticker: 'TSLA', name: 'Tesla Inc.', price: 210.6, change: -1.8, verdict: 'AVOID' },
  ];

  const handleSendDigestNow = async () => {
    setIsDigestSending(true);
    setDigestStatus(null);
    try {
      const response = await api.post('/digest/trigger');
      setDigestStatus(response.data.message);
    } catch (err: any) {
      setDigestStatus('Failed to send email digest.');
    } finally {
      setIsDigestSending(false);
    }
  };

  const handleAddWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWatchlistTicker.trim()) {
      dispatch(addToWatchlist({ ticker: newWatchlistTicker.trim().toUpperCase() }));
      setNewWatchlistTicker('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900">Virtual Portfolio Summary</h2>
            {portfolio && <RankBadge rankTier={portfolio.rankTier} roi={portfolio.roi} />}
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Initial Capital: <span className="font-bold text-slate-800">${portfolio?.initialCapital?.toLocaleString()}</span> | Cash Balance: <span className="font-bold text-slate-800">${portfolio?.cashBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-500 uppercase">Portfolio Value</div>
            <div className="text-2xl font-black text-slate-900">
              ${portfolio?.portfolioValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '100,000.00'}
            </div>
          </div>
          <div className="text-right border-l border-slate-200 pl-6">
            <div className="text-xs font-bold text-slate-500 uppercase">ROI Performance</div>
            <div className={`text-2xl font-black ${(portfolio?.roi || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {(portfolio?.roi || 0) >= 0 ? `+${portfolio?.roi}%` : `${portfolio?.roi}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Screener & Email Digest Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-extrabold text-slate-900">Daily Screener & Email Digest</h3>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Automated Daily Signals Briefing Delivered To Your Inbox
            </p>
          </div>

          <button
            onClick={handleSendDigestNow}
            disabled={isDigestSending}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Mail className="w-4 h-4" />
            <span>{isDigestSending ? 'Sending Digest...' : 'Send Signals to Email Now'}</span>
          </button>
        </div>

        {digestStatus && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs font-bold text-blue-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span>{digestStatus}</span>
          </div>
        )}

        {/* Top Screener Table */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
                <th className="p-3">Ticker</th>
                <th className="p-3">Company Name</th>
                <th className="p-3">Market Price</th>
                <th className="p-3">24h Change</th>
                <th className="p-3">AI Verdict</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
              {topScreenerStocks.map((stock) => (
                <tr key={stock.ticker} className="hover:bg-slate-50/80">
                  <td className="p-3 font-extrabold text-blue-600">${stock.ticker}</td>
                  <td className="p-3 font-bold text-slate-900">{stock.name}</td>
                  <td className="p-3 font-black">${stock.price}</td>
                  <td className={`p-3 font-black ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        stock.verdict === 'INVEST'
                          ? 'bg-emerald-100 text-emerald-800'
                          : stock.verdict === 'HOLD'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {stock.verdict}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenTradeModal(stock.ticker)}
                      className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-extrabold text-[11px]"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Portfolio Holdings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900">Active Portfolio Holdings</h3>
          <button
            onClick={() => onOpenTradeModal('NVDA')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Trade</span>
          </button>
        </div>

        {portfolio?.holdings?.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs font-medium">
            No active stock holdings in portfolio. Execute a trade to build your position!
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-100 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-500 border-b border-slate-200">
                  <th className="p-3">Ticker</th>
                  <th className="p-3">Shares</th>
                  <th className="p-3">Avg Price</th>
                  <th className="p-3">Current Price</th>
                  <th className="p-3">Position Value</th>
                  <th className="p-3">Unrealized PnL</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
                {portfolio?.holdings?.map((h) => (
                  <tr key={h.ticker} className="hover:bg-slate-50/80">
                    <td className="p-3 font-extrabold text-blue-600">${h.ticker}</td>
                    <td className="p-3 font-black">{h.quantity}</td>
                    <td className="p-3">${h.avgBuyPrice}</td>
                    <td className="p-3 font-extrabold">${h.currentPrice}</td>
                    <td className="p-3 font-black">${h.currentValue?.toLocaleString()}</td>
                    <td className={`p-3 font-black ${h.unRealizedPnL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {h.unRealizedPnL >= 0 ? `+$${h.unRealizedPnL}` : `-$${Math.abs(h.unRealizedPnL)}`} ({h.unRealizedPnLPct}%)
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onOpenTradeModal(h.ticker)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[11px] border border-slate-300"
                      >
                        Trade
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Watchlist Manager */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Personal Watchlist</h3>
          </div>

          <form onSubmit={handleAddWatchlist} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Add Ticker (e.g. AMD)..."
              value={newWatchlistTicker}
              onChange={(e) => setNewWatchlistTicker(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white font-extrabold rounded-xl text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {watchlist.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-xl border border-slate-200 text-slate-500 text-xs font-medium">
            Your watchlist is empty. Add stock symbols to monitor price signals!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {watchlist.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-sm font-extrabold text-slate-900">${item.ticker}</div>
                  <div className="text-xs font-semibold text-slate-500">{item.name}</div>
                  <div className="text-xs font-black text-slate-900 mt-1">${item.currentPrice}</div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => dispatch(removeFromWatchlist(item.ticker))}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onOpenTradeModal(item.ticker)}
                    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg font-bold text-[10px]"
                  >
                    Trade
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
