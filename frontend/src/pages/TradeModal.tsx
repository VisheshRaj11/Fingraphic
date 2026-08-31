import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { RootState, AppDispatch } from '../app/store';
import { executeTrade, clearTradeMessage } from '../features/portfolio/portfolioSlice';
import { HoldingSide } from '../types';

interface TradeModalProps {
  initialTicker: string;
  onClose: () => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({ initialTicker, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { portfolio, isTradeLoading, tradeMessage, error } = useSelector((state: RootState) => state.portfolio);

  const [ticker, setTicker] = useState(initialTicker || 'AAPL');
  const [quantity, setQuantity] = useState(10);
  const [side, setSide] = useState<HoldingSide>('BUY');

  const estimatedPrice = 180; // Estimated reference quote price
  const estimatedCost = estimatedPrice * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(executeTrade({ ticker: ticker.toUpperCase().trim(), quantity, side }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-extrabold text-slate-900">Execute Order Trade</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {tradeMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800">
            {tradeMessage}
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Side Selector Pills */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                side === 'BUY' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>BUY POSITION</span>
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
                side === 'SELL' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>SELL POSITION</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Stock Ticker</label>
            <input
              type="text"
              required
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Share Quantity</label>
            <input
              type="number"
              min={1}
              required
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Available Cash:</span>
              <span className="font-bold text-slate-900">
                ${portfolio?.cashBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Estimated Order Total:</span>
              <span className="font-bold text-blue-600">~${estimatedCost.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isTradeLoading}
            className={`w-full py-3 text-white font-extrabold rounded-2xl shadow-lg transition-all text-sm disabled:opacity-50 ${
              side === 'BUY'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
            }`}
          >
            {isTradeLoading ? 'Executing Trade...' : `Confirm ${side} Order`}
          </button>
        </form>
      </div>
    </div>
  );
};
