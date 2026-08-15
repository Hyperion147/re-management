'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/axios';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface Message {
  id: string;
  message: string;
  createdAt: string;
  senderId: string;
  senderName: string;
  senderRole: string;
}

interface Props {
  requestId: string;
  requestAddress: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestChatModal({ requestId, requestAddress, isOpen, onClose }: Props) {
  const { user } = useCurrentUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const { data } = await api.get(`/requests/${requestId}/messages`);
      setMessages(data.messages);
    } catch {
      // silently fail on poll
    }
  }, [requestId]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchMessages().finally(() => setLoading(false));
    pollRef.current = setInterval(fetchMessages, 4000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isOpen, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    try {
      await api.post(`/requests/${requestId}/messages`, { message: input.trim() });
      setInput('');
      await fetchMessages();
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ maxHeight: '85vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Request Chat</p>
            <h3 className="font-bold text-[#1a2a2a] text-sm truncate max-w-xs">{requestAddress}</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <p className="text-sm text-gray-400 font-medium">No messages yet. Say hello!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === user?.id;
              return (
                <div key={msg.id} className={`flex gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    msg.senderRole === 'ADMIN' || msg.senderRole === 'SUPERADMIN'
                      ? 'bg-purple-100 text-purple-700'
                      : isMine ? 'bg-[#112424] text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {msg.senderName?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <span className="text-[10px] text-gray-400 font-medium px-1">
                      {isMine ? 'You' : msg.senderName}
                      {(msg.senderRole === 'ADMIN' || msg.senderRole === 'SUPERADMIN') && (
                        <span className="ml-1 text-purple-500">· Admin</span>
                      )}
                    </span>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ${
                      isMine
                        ? 'bg-[#112424] text-white rounded-tr-sm'
                        : 'bg-gray-100 text-[#1a2a2a] rounded-tl-sm'
                    }`}>
                      {msg.message}
                    </div>
                    <span className="text-[9px] text-gray-300 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-end gap-2 bg-gray-50 rounded-2xl px-4 py-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 bg-transparent resize-none outline-none text-sm text-[#1a2a2a] placeholder-gray-400 leading-relaxed max-h-32"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || sending}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#112424] text-white disabled:opacity-30 hover:bg-[#0d1d1d] transition-all flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center mt-2">Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
