import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check, X, Award, TrendingUp, User as UserIcon } from 'lucide-react';
import { RootState, AppDispatch } from '../../app/store';
import { respondToConnectionRequest, PendingRequest } from '../../features/chat/chatSlice';
import { RankTier } from '../../types';

export const PendingRequests: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingRequests } = useSelector((state: RootState) => state.chat);

  const handleRespond = (connectionId: string, decision: 'ACCEPTED' | 'REJECTED') => {
    dispatch(respondToConnectionRequest({ connectionId, decision }));
  };

  const renderRankBadge = (tier: RankTier) => {
    if (tier === 'MASTER_TRADER') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-purple-100 text-purple-800 border border-purple-200">
          <Award className="w-2.5 h-2.5 text-purple-600" />
          <span>Master</span>
        </span>
      );
    }
    if (tier === 'PRO_TRADER') {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
          <TrendingUp className="w-2.5 h-2.5 text-indigo-600" />
          <span>Pro</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
        <UserIcon className="w-2.5 h-2.5 text-slate-500" />
        <span>Novice</span>
      </span>
    );
  };

  if (pendingRequests.length === 0) {
    return <div className="text-center py-8 text-xs text-slate-400 font-medium">No pending connection requests.</div>;
  }

  return (
    <div className="space-y-2 h-full overflow-y-auto pr-1">
      {pendingRequests.map((req: PendingRequest) => (
        <div
          key={req.connectionId}
          className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
              {req.requester.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 text-left">
              <div className="text-xs font-bold text-slate-900 truncate">{req.requester.name}</div>
              <div className="mt-0.5">{renderRankBadge(req.requester.rankTier)}</div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleRespond(req.connectionId, 'ACCEPTED')}
              className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              title="Accept Connection"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleRespond(req.connectionId, 'REJECTED')}
              className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-lg text-xs font-bold transition-colors"
              title="Reject Request"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
