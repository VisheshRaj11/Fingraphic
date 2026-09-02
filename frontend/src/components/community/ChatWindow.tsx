import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Award, TrendingUp, User as UserIcon, MessageSquare } from 'lucide-react';
import { RootState, AppDispatch } from '../../app/store';
import { loadConversationHistory, receiveMessage, ChatMessage, Connection } from '../../features/chat/chatSlice';
import { connectSocket } from '../../lib/socket';
import { RankTier } from '../../types';

export const ChatWindow: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeConversationUserId, messagesByUserId, connections } = useSelector((state: RootState) => state.chat);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePartner = connections.find((c: Connection) => c.user.id === activeConversationUserId)?.user;
  const messages = activeConversationUserId ? messagesByUserId[activeConversationUserId] || [] : [];

  useEffect(() => {
    if (activeConversationUserId) {
      dispatch(loadConversationHistory(activeConversationUserId));
    }
  }, [activeConversationUserId, dispatch]);

  useEffect(() => {
    const socket = connectSocket();
    const handleNewMessage = (msg: any) => {
      if (user?.id) {
        dispatch(receiveMessage({ currentUserId: user.id, message: msg }));
      }
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [dispatch, user?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConversationUserId) return;

    const socket = connectSocket();
    if (socket && socket.connected) {
      socket.emit('send_message', {
        recipientId: activeConversationUserId,
        content: inputText.trim(),
      });
      setInputText('');
    }
  };

  const renderMessageRankBadge = (tier: RankTier) => {
    if (tier === 'MASTER_TRADER') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-md" title="Master Trader">
          <Award className="w-2.5 h-2.5 text-purple-600" />
          <span>Master</span>
        </span>
      );
    }
    if (tier === 'PRO_TRADER') {
      return (
        <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded-md" title="Pro Trader">
          <TrendingUp className="w-2.5 h-2.5 text-indigo-600" />
          <span>Pro</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md" title="Novice">
        <UserIcon className="w-2.5 h-2.5 text-slate-500" />
        <span>Novice</span>
      </span>
    );
  };

  if (!activeConversationUserId || !activePartner) {
    return (
      <div className="h-full w-full bg-slate-50/50 flex flex-col items-center justify-center text-center p-6 space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-400">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div className="text-sm font-extrabold text-slate-800">No Active Conversation Selected</div>
        <p className="text-xs text-slate-500 max-w-xs font-medium">
          Select a connected trader from your connections list or search the directory to start private 1:1 messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-hidden bg-white">
      {/* Top Partner Header */}
      <div className="p-3.5 bg-slate-50/90 border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
            {activePartner.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-left">
            <div className="text-xs font-black text-slate-900">{activePartner.name}</div>
            <div className="mt-0.5">{renderMessageRankBadge(activePartner.rankTier)}</div>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-xs font-black ${activePartner.roi >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {activePartner.roi >= 0 ? '+' : ''}
            {activePartner.roi.toFixed(1)}% ROI
          </span>
        </div>
      </div>

      {/* Message Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/30">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-400 font-medium">
            No message history with {activePartner.name}. Say hello!
          </div>
        ) : (
          messages.map((m: ChatMessage) => {
            const isMe = m.senderId === user?.id;
            const shortName = isMe
              ? (user?.name ? user.name.split(' ')[0] : 'You')
              : (m.sender?.name ? m.sender.name.split(' ')[0] : activePartner.name.split(' ')[0]);

            return (
              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {/* Message Header (Badge + Rank + Time) */}
                <div className="flex items-center gap-1.5 mb-1">
                  {isMe ? (
                    <>
                      <span className="text-[9px] font-black bg-slate-900 text-white px-2 py-0.5 rounded-md shadow-2xs">
                        {shortName}
                      </span>
                      {renderMessageRankBadge(m.rankTier)}
                    </>
                  ) : (
                    <>
                      <span className="text-[10px] font-bold text-slate-700">
                        {shortName}
                      </span>
                      {renderMessageRankBadge(m.rankTier)}
                    </>
                  )}
                  <span className="text-[9px] font-medium text-slate-400">
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Speech Bubble */}
                <div
                  className={`px-3.5 py-2.5 rounded-2xl max-w-[80%] text-xs font-medium leading-relaxed ${
                    isMe
                      ? 'bg-[#5B4FE0] text-white rounded-tr-xs shadow-xs text-left'
                      : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs shadow-2xs text-left'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Bar (Flush with Bottom) */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Message ${activePartner.name}...`}
          maxLength={500}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 bg-[#5B4FE0] hover:bg-[#4B3FD1] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
