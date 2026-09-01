import React from 'react';
import { ChevronLeft, Grid, TrendingUp } from 'lucide-react';

export const PhoneMockup: React.FC = () => {
  return (
    <div
      className="relative w-[225px] sm:w-[245px] lg:w-[300px] aspect-[9/19] bg-neutral-900 rounded-[2.5rem] p-2 border-4 border-neutral-900 transform rotate-[15deg] hover:rotate-[-2deg] transition-transform duration-500 ease-out"
      style={{
        boxShadow: '25px 35px 50px -15px rgba(30, 27, 58, 0.35)',
        perspective: '1000px',
      }}
    >
      {/* Phone Inner Display Screen */}
      <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden p-3.5 flex flex-col justify-between border border-slate-100 relative">
        <div>
          {/* Top Notch Cutout */}
          <div className="w-14 h-3 bg-neutral-900 rounded-full mx-auto mb-2" />

          {/* Top Row Header Chrome */}
          <div className="flex items-center justify-between text-gray-800 mb-2.5 px-0.5">
            <ChevronLeft className="w-3.5 h-3.5 text-gray-800 cursor-pointer" />
            <span className="text-xs font-semibold text-gray-900">Task</span>
            <Grid className="w-3.5 h-3.5 text-gray-800 cursor-pointer" />
          </div>

          {/* Asset Row */}
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-black text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                A
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-gray-900 leading-none">Apple Inc.</div>
                <div className="text-[9px] text-gray-400 font-semibold mt-0.5">AAPL</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-gray-900">$224.20</div>
              <div className="text-[9px] font-extrabold text-[#16A34A]">+1.24%</div>
            </div>
          </div>

          {/* Stock Price Chart filling the middle screen (Replacing blank space) */}
          <div className="bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100 space-y-1.5 my-1">
            <div className="flex items-center justify-between text-[9px]">
              <span className="font-bold text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#16A34A]" /> Live Chart
              </span>
              <span className="font-extrabold text-[#16A34A] bg-green-50 px-1.5 py-0.5 rounded-md">
                +$2.75 1D
              </span>
            </div>
          

            {/* Rich Filled Stock Trend Area Graph */}
            <div className="relative pt-1">
              <svg viewBox="0 0 200 80" className="w-full h-16 overflow-visible">
                <defs>
                  <linearGradient id="phoneChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A34A" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="50" x2="200" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />

                {/* Trend Path */}
                <path
                  d="M0 65 Q 40 45, 75 55 T 140 25 L 200 8"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Gradient Fill */}
                <path
                  d="M0 65 Q 40 45, 75 55 T 140 25 L 200 8 L 200 80 L 0 80 Z"
                  fill="url(#phoneChartGradient)"
                />
                {/* Active Indicator Pulse */}
                <circle cx="200" cy="8" r="4.5" fill="#16A34A" />
                <circle cx="200" cy="8" r="8" fill="#16A34A" opacity="0.25" className="animate-ping" />
              </svg>
            </div>

            {/* Timeframe Selector Pills */}
            <div className="flex items-center justify-between text-[8px] font-extrabold text-gray-400 pt-1">
              <span className="px-1.5 py-0.5 bg-white text-gray-900 rounded-md shadow-2xs">1D</span>
              <span>1W</span>
              <span>1M</span>
              <span>1Y</span>
              <span>ALL</span>
            </div>
          </div>
        </div>
        <div>
          {/* Top Notch Cutout */}
          {/* <div className="w-14 h-3 bg-neutral-900 rounded-full mx-auto mb-2" /> */}

          {/* Top Row Header Chrome */}
          {/* <div className="flex items-center justify-between text-gray-800 mb-2.5 px-0.5"> */}
            {/* <ChevronLeft className="w-3.5 h-3.5 text-gray-800 cursor-pointer" /> */}
            {/* <span className="text-xs font-semibold text-gray-900">Task</span> */}
            {/* <Grid className="w-3.5 h-3.5 text-gray-800 cursor-pointer" /> */}
          {/* </div> */}

          {/* Asset Row */}
          <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-100 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-black text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                N
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-gray-900 leading-none">Nvda Inc.</div>
                <div className="text-[9px] text-gray-400 font-semibold mt-0.5">NVDA</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-black text-gray-900">$224.20</div>
              <div className="text-[9px] font-extrabold text-[#e81212]">+1.24%</div>
            </div>
          </div>

          {/* Stock Price Chart filling the middle screen (Replacing blank space) */}
          <div className="bg-slate-50/70 p-2.5 rounded-2xl border border-slate-100 space-y-1.5 my-1">
            <div className="flex items-center justify-between text-[9px]">
              <span className="font-bold text-gray-500 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-[#e81212]" /> Live Chart
              </span>
              <span className="font-extrabold text-[#e81212] bg-green-50 px-1.5 py-0.5 rounded-md">
                +$2.75 1D
              </span>
            </div>
          

            {/* Rich Filled Stock Trend Area Graph */}
            <div className="relative pt-1">
              <svg viewBox="0 0 200 80" className="w-full h-16 overflow-visible">
                <defs>
                  <linearGradient id="phoneChartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e81212" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="20" x2="200" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />
                <line x1="0" y1="50" x2="200" y2="50" stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" />

                {/* Trend Path */}
                <path
                  d="M0 65 Q 40 45, 75 55 T 140 25 L 200 8"
                  fill="none"
                  stroke="#16A34A"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Gradient Fill */}
                <path
                  d="M0 65 Q 40 45, 75 55 T 140 25 L 200 8 L 200 80 L 0 80 Z"
                  fill="url(#phoneChartGradient)"
                />
                {/* Active Indicator Pulse */}
                <circle cx="200" cy="8" r="4.5" fill="#16A34A" />
                <circle cx="200" cy="8" r="8" fill="#16A34A" opacity="0.25" className="animate-ping" />
              </svg>
            </div>

            {/* Timeframe Selector Pills */}
            <div className="flex items-center justify-between text-[8px] font-extrabold text-gray-400 pt-1">
              <span className="px-1.5 py-0.5 bg-white text-gray-900 rounded-md shadow-2xs">1D</span>
              <span>1W</span>
              <span>1M</span>
              <span>1Y</span>
              <span>ALL</span>
            </div>
          </div>
        </div>

        {/* Bottom Three Signal Groups */}
        <div className="flex justify-between items-center pt-2 pb-1 px-1 border-t border-slate-100 mt-1">
          <div className="text-left">
            <div className="text-xs font-bold text-gray-900">Buy</div>
            <div className="text-[8px] font-medium text-gray-400 uppercase tracking-wider">Signal</div>
          </div>

          <div className="text-center">
            <div className="text-xs font-bold text-[#16A34A]">High</div>
            <div className="text-[8px] font-medium text-gray-400 uppercase tracking-wider">Trust</div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-gray-900">Hold</div>
            <div className="text-[8px] font-medium text-gray-400 uppercase tracking-wider">Action</div>
          </div>
        </div>
      </div>
    </div>
  );
};
