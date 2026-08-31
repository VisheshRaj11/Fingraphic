import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageSquare, Trophy, Send, Users } from 'lucide-react';
import { RootState, AppDispatch } from '../app/store';
import { setActiveTickerRoom, addMessage, setRoomHistory } from '../features/chat/chatSlice';
import { fetchLeaderboard } from '../features/leaderboard/leaderboardSlice';
import { connectSocket } from '../lib/socket';
import { RankBadge } from '../components/shared/Badge';

export const ChatLeaderboardView: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeTickerRoom, messages } = useSelector((state: RootState) => state.chat);
  const { leaderboard, isLoading: isLeaderboardLoading } = useSelector((state: RootState) => state.leaderboard);
  const { user } = useSelector((state: RootState) => state.auth);

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const rooms = ['AAPL', 'NVDA', 'MSFT', 'TSLA', 'AMZN', 'META'];

  useEffect(() => {
    dispatch(fetchLeaderboard());

    const socket = connectSocket();
    socket.emit('join_room', activeTickerRoom);

    socket.on('room_history', (data: { ticker: string; messages: any[] }) => {
      dispatch(setRoomHistory(data));
    });

    socket.on('new_message', (msg: any) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.emit('leave_room', activeTickerRoom);
      socket.off('room_history');
      socket.off('new_message');
    };
  }, [dispatch, activeTickerRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRoomChange = (room: string) => {
    const socket = connectSocket();
    socket.emit('leave_room', activeTickerRoom);
    dispatch(setActiveTickerRoom(room));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const socket = connectSocket();
    socket.emit('send_message', {
      ticker: activeTickerRoom,
      content: inputMessage.trim(),
    });

    setInputMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-100px)] font-poppins">
      {/* Ticker Community Chat Section (7 Cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
        {/* Chat Room Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">${activeTickerRoom} Trader Community</h3>
              <p className="text-xs font-semibold text-slate-500">Live Trader Discussion</p>
            </div>
          </div>

          {/* Room Selector Pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {rooms.map((r) => (
              <button
                key={r}
                onClick={() => handleRoomChange(r)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  activeTickerRoom === r
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ${r}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs font-medium space-y-2">
              <Users className="w-8 h-8 text-slate-300" />
              <p>No messages yet in ${activeTickerRoom} room. Be the first to post!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isSelf = msg.user.id === user?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">{msg.user.name}</span>
                    <RankBadge rankTier={msg.rankTier} roi={msg.roiAtSend} />
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                      isSelf
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-500/15'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            placeholder={`Share market insights in $${activeTickerRoom}...`}
            maxLength={500}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Global ROI Leaderboard Section (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Global ROI Leaderboard</h3>
              <p className="text-xs font-semibold text-slate-500">Live Global Ranking</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(fetchLeaderboard())}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            Refresh
          </button>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-2">
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
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isUserSelf
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-black flex items-center justify-center">
                      {entry.rank <= 3 ? (
                        <Trophy className={`w-3.5 h-3.5 ${entry.rank === 1 ? 'text-amber-500' : entry.rank === 2 ? 'text-slate-400' : 'text-amber-700'}`} />
                      ) : (
                        `#${entry.rank}`
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{entry.name}</span>
                        {isUserSelf && <span className="text-[10px] bg-indigo-200 text-indigo-800 font-extrabold px-1.5 py-0.2 rounded">YOU</span>}
                      </div>
                      <div className="mt-0.5">
                        <RankBadge rankTier={entry.rankTier} />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-black ${entry.roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {entry.roi >= 0 ? `+${entry.roi}%` : `${entry.roi}%`}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
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
