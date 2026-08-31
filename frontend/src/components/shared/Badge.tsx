import React from 'react';
import { Award, TrendingUp, User, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { RankTier, Verdict } from '../../types';

interface RankBadgeProps {
  rankTier: RankTier;
  roi?: number;
  className?: string;
}

export const RankBadge: React.FC<RankBadgeProps> = ({ rankTier, roi, className = '' }) => {
  if (rankTier === 'MASTER_TRADER') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 ${className}`}
      >
        <Award className="w-3.5 h-3.5 text-amber-600" />
        <span>Master Trader</span>
        {roi !== undefined && <span className="opacity-75">({roi > 0 ? `+${roi}` : roi}%)</span>}
      </span>
    );
  }

  if (rankTier === 'PRO_TRADER') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
      >
        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
        <span>Pro Trader</span>
        {roi !== undefined && <span className="opacity-75">({roi > 0 ? `+${roi}` : roi}%)</span>}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
    >
      <User className="w-3.5 h-3.5 text-slate-500" />
      <span>Novice</span>
      {roi !== undefined && <span className="opacity-75">({roi > 0 ? `+${roi}` : roi}%)</span>}
    </span>
  );
};

interface VerdictBadgeProps {
  verdict: Verdict;
  className?: string;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, className = '' }) => {
  if (verdict === 'INVEST') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span>INVEST</span>
      </span>
    );
  }

  if (verdict === 'HOLD') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 ${className}`}
      >
        <Sparkles className="w-4 h-4 text-amber-600" />
        <span>HOLD</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 ${className}`}
    >
      <AlertTriangle className="w-4 h-4 text-rose-600" />
      <span>AVOID</span>
    </span>
  );
};
