import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Award, TrendingUp, User as UserIcon } from 'lucide-react';
import { RootState, AppDispatch } from '../../app/store';
import { setActiveConversation, Connection } from '../../features/chat/chatSlice';
import { RankTier } from '../../types';

export const ConversationList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connections, activeConversationUserId } = useSelector((state: RootState) => state.chat);

  const renderRankBadge = (tier: RankTier) => {
    if (tier === 'MASTER_TRADER') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black bg-purple-100 text-purple-800 rounded">
          <Award className="w-2.5 h-2.5 text-purple-600" />
          <span>Master</span>
        </span>
      );
    }
    if (tier === 'PRO_TRADER') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-black bg-indigo-100 text-indigo-800 rounded">
          <TrendingUp className="w-2.5 h-2.5 text-indigo-600" />
          <span>Pro</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-extrabold bg-slate-100 text-slate-700 rounded">
        <UserIcon className="w-2.5 h-2.5 text-slate-500" />
        <span>Novice</span>
      </span>
    );
  };

  if (connections.length === 0) {
    return (
      <div className="text-center py-8 text-xs text-slate-400 font-medium">
        No active connections yet. Use "Directory" to connect with traders.
      </div>
    );
  }

  return (
    <div className="space-y-2 h-full overflow-y-auto pr-1">
      {connections.map((c: Connection) => {
        const isActive = activeConversationUserId === c.user.id;
        return (
          <button
            key={c.connectionId}
            onClick={() => dispatch(setActiveConversation(c.user.id))}
            className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between gap-3 transition-colors ${
              isActive
                ? 'bg-indigo-50/80 border-indigo-200 shadow-xs'
                : 'bg-white border-slate-200/90 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                {c.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{c.user.name}</div>
                <div className="mt-0.5">{renderRankBadge(c.user.rankTier)}</div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className={`text-[10px] font-extrabold ${c.user.roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {c.user.roi >= 0 ? '+' : ''}
                {c.user.roi.toFixed(1)}%
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
