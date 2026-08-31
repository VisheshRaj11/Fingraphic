import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Sparkles, CheckCircle2, AlertTriangle, ArrowUpRight, ShieldAlert, Cpu } from 'lucide-react';
import { RootState, AppDispatch } from '../app/store';
import { fetchStockAnalysis, setSearchTicker } from '../features/analysis/analysisSlice';
import { VerdictBadge } from '../components/shared/Badge';
import { StockChart } from '../components/shared/StockChart';

interface AnalysisViewProps {
  onOpenTradeModal: (ticker: string) => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({ onOpenTradeModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchTicker, currentAnalysis, isLoading, activeStepNode, error } = useSelector(
    (state: RootState) => state.analysis
  );

  const [inputVal, setInputVal] = useState(searchTicker);

  useEffect(() => {
    if (!currentAnalysis && searchTicker) {
      dispatch(fetchStockAnalysis(searchTicker));
    }
  }, [dispatch, searchTicker, currentAnalysis]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      const sym = inputVal.trim().toUpperCase();
      dispatch(setSearchTicker(sym));
      dispatch(fetchStockAnalysis(sym));
    }
  };

  const quickTickers = ['NVDA', 'AAPL', 'MSFT', 'TSLA', 'AMZN', 'META'];

  const nodeSteps = [
    { title: 'Normalization', desc: 'Symbol Mapping' },
    { title: 'Overview', desc: 'Sector Scale' },
    { title: 'Position', desc: 'Moat & Market' },
    { title: 'Financials', desc: 'Margin & Growth' },
    { title: 'Risk Test', desc: 'Solvency Check' },
    { title: 'Verdict', desc: 'Final Signals' },
  ];

  return (
    <div className="space-y-6 font-poppins">
      {/* Search Header & Stepper Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl font-extrabold text-slate-900">Quantitative Signal Analysis</h2>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Automated multi-factor evaluation engine with real-time market data
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search ticker (e.g. NVDA)..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs shadow-md transition-all disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
        </div>

        {/* Quick Tickers */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Popular Signals:</span>
          {quickTickers.map((t) => (
            <button
              key={t}
              onClick={() => {
                setInputVal(t);
                dispatch(setSearchTicker(t));
                dispatch(fetchStockAnalysis(t));
              }}
              className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all border ${
                searchTicker === t
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ${t}
            </button>
          ))}
        </div>

        {/* Real-Time Node Execution Stepper */}
        {isLoading && (
          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 animate-spin text-indigo-600" />
                Running Multi-Factor Signal Analysis...
              </span>
              <span className="text-xs font-extrabold text-slate-500">Stage {activeStepNode} of 6</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {nodeSteps.map((s, idx) => {
                const stepNum = idx + 1;
                const isComplete = stepNum <= activeStepNode;
                const isCurrent = stepNum === activeStepNode;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-indigo-50 border-indigo-400 animate-pulse'
                        : isComplete
                        ? 'bg-emerald-50 border-emerald-300'
                        : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  >
                    <div
                      className={`text-[10px] font-extrabold uppercase ${
                        isCurrent ? 'text-indigo-700' : isComplete ? 'text-emerald-700' : 'text-slate-500'
                      }`}
                    >
                      Stage {stepNum}
                    </div>
                    <div className="text-xs font-bold text-slate-900 truncate mt-0.5">{s.title}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-bold text-rose-700">
          {error}
        </div>
      )}

      {/* Analysis Result Content */}
      {currentAnalysis && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-black text-slate-900">${currentAnalysis.ticker}</h3>
                <VerdictBadge verdict={currentAnalysis.verdict} />
                <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                  {currentAnalysis.metrics.recommendation}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Current Price: <span className="font-extrabold text-slate-900">${currentAnalysis.metrics.currentPrice}</span> | 12-Month Target: <span className="font-extrabold text-indigo-600">${currentAnalysis.metrics.targetMeanPrice}</span>
              </p>
            </div>

            <button
              onClick={() => onOpenTradeModal(currentAnalysis.ticker)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all text-xs flex items-center gap-2"
            >
              <span>Execute Trade for ${currentAnalysis.ticker}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive TradingView Canvas Chart */}
          <StockChart ticker={currentAnalysis.ticker} currentPrice={currentAnalysis.metrics.currentPrice} />

          {/* Executive Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-slate-900">Executive Summary & Confidence Score</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">Confidence Rating:</span>
                <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-black text-indigo-700">
                  {currentAnalysis.executiveSummary.analystConfidenceScore}%
                </span>
              </div>
            </div>
            <p className="text-xs font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {currentAnalysis.executiveSummary.summaryText}
            </p>
          </div>

          {/* 12-Key Metrics Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="text-base font-extrabold text-slate-900">Financial Performance Metrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.entries(currentAnalysis.metrics).map(([key, val]) => (
                <div key={key} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider truncate">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-xs font-black text-slate-900 mt-1 truncate">
                    {typeof val === 'number' ? `$${val}` : val}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Green Flags & Red Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Green Flags */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="text-base font-extrabold text-slate-900">Bullish Factors (Green Flags)</h4>
              </div>
              <ul className="space-y-2.5">
                {currentAnalysis.greenFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-slate-700 bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Red Flags */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h4 className="text-base font-extrabold text-slate-900">Risk Concerns (Red Flags)</h4>
              </div>
              <ul className="space-y-2.5">
                {currentAnalysis.redFlags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs font-medium text-slate-700 bg-rose-50/50 border border-rose-100 p-3 rounded-xl">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reasoning Trail */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h4 className="text-base font-extrabold text-slate-900">Complete Signal Audit Trail</h4>
            <div className="space-y-3">
              {currentAnalysis.reasoningTrail.map((step, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-xs font-extrabold text-indigo-700">{step.stepTitle}</div>
                  <p className="text-xs font-medium text-slate-700">{step.stepDetail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
