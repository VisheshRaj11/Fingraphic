import React from 'react';
import { Target } from 'lucide-react';

export const PortfolioValueCard: React.FC = () => {
  return (
    <div className="absolute top-[48%] right-[-6%] sm:right-[-12%] transform rotate-[deg] z-30 w-[190px] sm:w-[210px] bg-white rounded-2xl shadow-xl p-4 border border-slate-100/90 transition-transform hover:rotate-[3deg] duration-300 space-y-2">
      {/* Top Row: Icon Chip + Label */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
          <Target className="w-4 h-4 text-[#5B4FE0]" />
        </div>
        <span className="text-xs font-medium text-gray-500">Portfolio Value</span>
      </div>

      {/* Figures Row */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-xs font-medium text-gray-400">Total</span>
        <span className="text-xl font-extrabold text-[#1E1B3A]">$124,592</span>
        <span className="text-xs font-bold text-green-600">+14.2%</span>
      </div>

      {/* SVG Sparkline Chart */}
      <div className="pt-1">
        <svg viewBox="0 0 180 45" className="w-full h-10 overflow-visible">
          <defs>
            <linearGradient id="sparklineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16A34A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path
            d="M0 35 Q 35 20, 70 28 T 140 10 L 175 4"
            fill="none"
            stroke="#16A34A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M0 35 Q 35 20, 70 28 T 140 10 L 175 4 L 175 45 L 0 45 Z"
            fill="url(#sparklineGrad)"
          />
          <circle cx="175" cy="4" r="3.5" fill="#16A34A" />
        </svg>
      </div>
    </div>
  );
};
