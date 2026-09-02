import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, UserPlus, MessageCircle, Clock, Award, TrendingUp, User as UserIcon } from 'lucide-react';
import { RootState, AppDispatch } from '../../app/store';
import { searchUsers, updateUserConnectionStatus, UserSummary } from '../../features/users/usersSlice';
import { sendConnectionRequest, setActiveConversation } from '../../features/chat/chatSlice';
import { RankTier } from '../../types';

export const UserDirectory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults, loading } = useSelector((state: RootState) => state.users);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(searchUsers(query));
    }, 300);
    return () => clearTimeout(timer);
  }, [query, dispatch]);

  const handleAddUser = async (userId: string) => {
    dispatch(updateUserConnectionStatus({ userId, status: 'PENDING_SENT' }));
    await dispatch(sendConnectionRequest(userId));
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

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Search Input Bar */}
      <div className="relative shrink-0">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search traders..."
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
        />
      </div>

      {/* Directory List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loading && searchResults.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">Searching directory...</div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 font-medium">No registered traders found.</div>
        ) : (
          searchResults.map((u: UserSummary) => (
            <div
              key={u.id}
              className="p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs flex items-center justify-between gap-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-slate-900 truncate">{u.name}</div>
                  <div className="mt-0.5">{renderRankBadge(u.rankTier)}</div>
                </div>
              </div>

              {/* Connection Status Action Button */}
              <div className="shrink-0">
                {u.connectionStatus === 'CONNECTED' ? (
                  <button
                    onClick={() => dispatch(setActiveConversation(u.id))}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-indigo-100 transition-colors"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>Chat</span>
                  </button>
                ) : u.connectionStatus === 'PENDING_SENT' ? (
                  <div className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-slate-200">
                    <Clock className="w-3 h-3" />
                    <span>Sent</span>
                  </div>
                ) : u.connectionStatus === 'PENDING_RECEIVED' ? (
                  <div className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-bold border border-amber-200">
                    Received
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddUser(u.id)}
                    className="px-2.5 py-1 bg-[#5B4FE0] hover:bg-[#4B3FD1] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
