import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export const AiAnalysisCard: React.FC = () => {
  return (
    <div className="absolute top-[48%] left-[-10%] sm:left-[-15%] transform rotate-[-4deg] z-20 w-[240px] sm:w-[260px] bg-white rounded-2xl shadow-xl p-5 border border-slate-100/90 transition-transform hover:rotate-[-2deg] duration-300">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-[#1E1B3A]">AI Analysis: AAPL</span>
        <Sparkles className="w-4 h-4 text-[#5B4FE0]" />
      </div>

      {/* Body Text */}
      <p className="text-xs text-[#6B7280] leading-relaxed">
        Strong Q4 earnings reported. Expanding margins in services segment.
      </p>

      {/* Verdict Panel */}
      <div className="bg-green-50 rounded-xl px-4 py-3 mt-3 flex items-center justify-between border border-green-100">
        <div>
          <div className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">Verdict</div>
          <div className="text-sm font-bold text-gray-900">Invest</div>
        </div>

        <button className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-800 hover:scale-105 transition-transform">
          <ArrowUpRight className="w-4 h-4 text-gray-800" />
        </button>
      </div>
    </div>
  );
};
