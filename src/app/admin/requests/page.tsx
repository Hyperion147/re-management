'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/axios';

interface Msg {
  id: string;
  message: string;
  createdAt: string;
  senderId: string;
  senderName: string;
  senderRole: string;
}

interface Req {
  id: string;
  serviceType: string;
  address: string;
  city: string;
  state: string;
  status: string;
  compensation: string;
  date: string;
  agentId: string | null;
  clientId: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<Req | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    api.get('/requests').then((r) => setRequests(r.data)).finally(() => setLoading(false));
  }, []);

  const fetchMessages = useCallback(async (reqId: string) => {
    try {
      const { data } = await api.get(`/requests/₹{reqId}/messages`);
      setMessages(data.messages);
    } catch { /* ignore */ }
  }, []);

  const openChat = async (req: Req) => {
    setSelectedReq(req);
    setMessages([]);
    setMsgLoading(true);
    await fetchMessages(req.id);
    setMsgLoading(false);
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => fetchMessages(req.id), 4000);
  };

  useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendReply = async () => {
    if (!reply.trim() || !selectedReq || sending) return;
    setSending(true);
    try {
      await api.post(`/requests/₹{selectedReq.id}/messages`, { message: reply.trim() });
      setReply('');
      await fetchMessages(selectedReq.id);
    } finally {
      setSending(false);
    }
  };

  const filtered = requests.filter((r) => filter === 'ALL' || r.status === filter);

  const statusColor = (s: string) =>
    s === 'PENDING' ? 'bg-orange-50 text-orange-600' :
    s === 'ACTIVE' ? 'bg-blue-50 text-blue-600' :
    s === 'COMPLETED' ? 'bg-green-50 text-green-600' :
    'bg-gray-100 text-gray-500';

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Requests list */}
      <div className={`flex flex-col border-r border-gray-100 bg-white transition-all ₹{selectedReq ? 'w-1/2' : 'w-full'}`}>
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-xl font-bold text-foreground">All Requests</h2>
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ₹{
                  filter === s ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No requests found.</div>
          ) : (
            filtered.map((req) => (
              <div
                key={req.id}
                onClick={() => openChat(req)}
                className={`flex items-center justify-between px-8 py-5 border-b border-gray-50 cursor-pointer transition-colors ₹{
                  selectedReq?.id === req.id ? 'bg-[#f0faf6]' : 'hover:bg-gray-50'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{req.serviceType}</p>
                  <p className="text-xs text-gray-400 font-medium truncate">{req.address}, {req.city}, {req.state}</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">{new Date(req.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                  <span className="text-sm font-bold text-green-600">₹{req.compensation}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ₹{statusColor(req.status)}`}>
                    {req.status}
                  </span>
                  {req.agentId && (
                    <span className="text-[10px] font-bold text-primary bg-muted px-2 py-1 rounded-lg">Chat</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat panel */}
      {selectedReq && (
        <div className="flex-1 flex flex-col bg-background min-w-0">
          {/* Chat header */}
          <div className="px-6 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conversation</p>
              <p className="text-sm font-bold text-foreground truncate">{selectedReq.address}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {selectedReq.agentId
                  ? 'Client ↔ Agent conversation'
                  : 'No agent assigned yet — chat unavailable'}
              </p>
            </div>
            <button
              onClick={() => { setSelectedReq(null); if (pollRef.current) clearInterval(pollRef.current); }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
            {msgLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">Loading conversation...</div>
            ) : !selectedReq.agentId ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                Waiting for an agent to accept this request.
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-400 text-sm">No messages yet.</div>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.senderRole === 'ADMIN' || msg.senderRole === 'SUPERADMIN';
                return (
                  <div key={msg.id} className={`flex gap-2 ₹{isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ₹{
                      isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {msg.senderName?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className={`max-w-[75%] ₹{isAdmin ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                      <span className="text-[10px] text-gray-400 font-medium px-1">
                        {msg.senderName}
                        {isAdmin && <span className="ml-1 text-purple-500">· Admin</span>}
                      </span>
                      <div className={`px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed ₹{
                        isAdmin ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-white text-foreground rounded-tl-sm border border-gray-100'
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

          {/* Reply box */}
          {selectedReq.agentId && (
            <div className="px-4 py-4 border-t border-gray-100 bg-white">
              <div className="flex items-end gap-2 bg-gray-50 rounded-2xl px-4 py-3">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }}
                  placeholder="Reply as admin..."
                  rows={1}
                  className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder-gray-400 max-h-28"
                />
                <button
                  onClick={sendReply}
                  disabled={!reply.trim() || sending}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-purple-600 text-white disabled:opacity-30 hover:bg-purple-700 transition-all flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
