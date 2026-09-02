import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Trophy, UserPlus, Inbox, MessageCircle } from 'lucide-react';
import { RootState, AppDispatch } from '../app/store';
import { fetchLeaderboard } from '../features/leaderboard/leaderboardSlice';
import { loadConnections, loadPendingRequests } from '../features/chat/chatSlice';
import { RankBadge } from '../components/shared/Badge';
import { ConversationList } from '../components/community/ConversationList';
import { UserDirectory } from '../components/community/UserDirectory';
import { PendingRequests } from '../components/community/PendingRequests';
import { ChatWindow } from '../components/community/ChatWindow';

export const ChatLeaderboardView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { leaderboard, isLoading: isLeaderboardLoading } = useSelector((state: RootState) => state.leaderboard);
  const { user } = useSelector((state: RootState) => state.auth);
  const { pendingRequests } = useSelector((state: RootState) => state.chat);

  const [activeSideTab, setActiveSideTab] = useState<'CONNECTIONS' | 'DIRECTORY' | 'REQUESTS'>('CONNECTIONS');

  useEffect(() => {
    dispatch(fetchLeaderboard());
    dispatch(loadConnections());
    dispatch(loadPendingRequests());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-120px)] min-h-[580px] max-h-[760px] font-poppins">
      {/* 1. Left Sidebar Navigation Panel (3 Cols on lg) */}
      <div className="lg:col-span-3 h-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col p-3.5 space-y-3 overflow-hidden">
        {/* Navigation Tabs Header */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700 shrink-0">
          <button
            onClick={() => setActiveSideTab('CONNECTIONS')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeSideTab === 'CONNECTIONS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900'
            }`}
            title="Chats"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chats</span>
          </button>

          <button
            onClick={() => setActiveSideTab('DIRECTORY')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
              activeSideTab === 'DIRECTORY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900'
            }`}
            title="Directory"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Directory</span>
          </button>

          <button
            onClick={() => setActiveSideTab('REQUESTS')}
            className={`py-1.5 rounded-lg flex items-center justify-center gap-1 relative transition-all ${
              activeSideTab === 'REQUESTS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'hover:text-slate-900'
            }`}
            title="Requests"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Requests</span>
            {pendingRequests.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center -top-1 -right-1">
                {pendingRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {activeSideTab === 'CONNECTIONS' && <ConversationList />}
          {activeSideTab === 'DIRECTORY' && <UserDirectory />}
          {activeSideTab === 'REQUESTS' && <PendingRequests />}
        </div>
      </div>

      {/* 2. Center 1:1 Private Chat Window Panel (5 Cols on lg) */}
      <div className="lg:col-span-5 h-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <ChatWindow />
      </div>

      {/* 3. Right Global ROI Leaderboard Panel (4 Cols on lg) */}
      <div className="lg:col-span-4 h-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 leading-none">Global ROI Leaderboard</h3>
              <p className="text-[10px] font-semibold text-slate-500 mt-0.5">Live Global Ranking</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(fetchLeaderboard())}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Refresh
          </button>
        </div>

        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {isLeaderboardLoading ? (
            <div className="text-center py-8 text-xs font-medium text-slate-400">Loading global ranks...</div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-xs font-medium text-slate-400">No ranked traders available yet.</div>
          ) : (
            leaderboard.map((entry) => {
              const isUserSelf = entry.userId === user?.id;

              return (
                <div
                  key={entry.userId}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    isUserSelf
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-black flex items-center justify-center shrink-0">
                      {entry.rank <= 3 ? (
                        <Trophy className={`w-3.5 h-3.5 ${entry.rank === 1 ? 'text-amber-500' : entry.rank === 2 ? 'text-slate-400' : 'text-amber-700'}`} />
                      ) : (
                        `#${entry.rank}`
                      )}
                    </div>

                    <div className="min-w-0 text-left">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1 truncate">
                        <span className="truncate">{entry.name}</span>
                        {isUserSelf && <span className="text-[9px] bg-indigo-200 text-indigo-800 font-black px-1 rounded">YOU</span>}
                      </div>
                      <div className="mt-0.5">
                        <RankBadge rankTier={entry.rankTier} />
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-xs font-black ${entry.roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {entry.roi >= 0 ? `+${entry.roi}%` : `${entry.roi}%`}
                    </div>
                    <div className="text-[9px] font-semibold text-slate-500 mt-0.5">
                      ${entry.portfolioValue.toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
