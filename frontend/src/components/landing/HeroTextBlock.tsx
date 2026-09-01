import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroTextBlockProps {
  onOpenSignUp: () => void;
}

export const HeroTextBlock: React.FC<HeroTextBlockProps> = ({ onOpenSignUp }) => {
  return (
    <div className="space-y-6 text-left max-w-2xl">
      {/* 2.1 Eyebrow badge */}
      <div className="mb-6 inline-flex items-center bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs font-medium text-[#1E1B3A]/70 shadow-xs">
        The AI-Native Platform for Modern Stock Investing
      </div>

      {/* 2.2 Headline */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-[#401175] leading-[1.08] max-w-2xl">
        Bring AI-Powered Clarity To Every Stock You Trade.
      </h1>

      {/* 2.3 Subtext */}
      <p className="mt-6 text-base md:text-lg font-medium text-[#6B7280] max-w-md leading-relaxed">
        Get AI-driven verdicts on any stock, trade on a live paper portfolio, and climb the community leaderboard — all in real time.
      </p>

      {/* 2.4 CTA button */}
      <div className="mt-8 pt-2">
        <button
          onClick={onOpenSignUp}
          className="group rounded-full bg-[#5B4FE0] hover:bg-[#4B3FD1] text-white font-bold text-base px-7 py-3.5 shadow-lg shadow-purple-500/20 inline-flex items-center gap-3 transition-all transform hover:scale-105"
        >
          <span>Get Started</span>
          {/* Nested White Icon-Chip */}
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#5B4FE0] shadow-xs transition-transform group-hover:translate-x-0.5">
            <ArrowRight className="w-4 h-4 text-[#5B4FE0]" />
          </div>
        </button>
      </div>
    </div>
  );
};
