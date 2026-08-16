'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import {
  Sparkles, Plus, MessageSquare, Home, DollarSign,
  MapPin, Calculator, Send, Building2, Clock, CheckCircle2,
  XCircle, ChevronRight, ArrowUpRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Message = { role: 'user' | 'assistant'; content: string; timestamp?: Date };

type Booking = {
  id: string;
  serviceType: string;
  address: string;
  city: string;
  state: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  compensation: string;
  date: string;
  createdAt: string;
};

type Conversation = { id: string; title: string; messages: Message[]; createdAt: Date };

// ─── Constants ────────────────────────────────────────────────────────────────

const SUGGESTIONS = [
  { icon: 'home',   text: 'Find me a 3 BHK home under ₹40 Lakh near good schools' },
  { icon: 'pin',    text: 'What neighborhoods in Mumbai are family-friendly?' },
  { icon: 'dollar', text: 'Compare renting vs buying in Delhi NCR' },
  { icon: 'calc',   text: 'Estimate monthly EMI for a ₹50 Lakh home' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  PENDING:   { label: 'Pending',   color: 'text-amber-600',   bg: 'bg-amber-50',   icon: Clock },
  ACTIVE:    { label: 'Active',    color: 'text-blue-600',    bg: 'bg-blue-50',    icon: ArrowUpRight },
  COMPLETED: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'text-red-500',     bg: 'bg-red-50',     icon: XCircle },
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(d: Date) {
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}
function deriveTitle(messages: Message[]) {
  const first = messages.find(m => m.role === 'user');
  if (!first) return 'New conversation';
  return first.content.slice(0, 40) + (first.content.length > 40 ? '…' : '');
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AssistantPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId) ?? null;
  const messages = activeConv?.messages ?? [];
  const isEmpty = messages.length === 0;

  // Fetch user's own bookings for sidebar
  useEffect(() => {
    (async () => {
      setBookingsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('requests')
          .select('id, service_type, address, city, state, status, compensation, date, created_at')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
        if (data) {
          setBookings(data.map((r: any) => ({
            id: r.id,
            serviceType: r.service_type,
            address: r.address,
            city: r.city,
            state: r.state,
            status: r.status,
            compensation: r.compensation,
            date: r.date,
            createdAt: r.created_at,
          })));
        }
      } catch (e) {
        console.error('Failed to load bookings', e);
      } finally {
        setBookingsLoading(false);
      }
    })();
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const newConversation = useCallback(() => {
    const id = crypto.randomUUID();
    const conv: Conversation = { id, title: 'New conversation', messages: [], createdAt: new Date() };
    setConversations(prev => [conv, ...prev]);
    setActiveConvId(id);
    setInput('');
  }, []);

  // Start with one blank conversation
  useEffect(() => {
    newConversation();
  }, []); // eslint-disable-line

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Ensure there is an active conversation
    let convId = activeConvId;
    if (!convId) {
      const id = crypto.randomUUID();
      const conv: Conversation = { id, title: trimmed.slice(0, 40), messages: [], createdAt: new Date() };
      setConversations(prev => [conv, ...prev]);
      setActiveConvId(id);
      convId = id;
    }

    const userMsg: Message = { role: 'user', content: trimmed, timestamp: new Date() };
    const nextMessages = [...messages, userMsg];

    setConversations(prev => prev.map(c =>
      c.id === convId
        ? { ...c, messages: nextMessages, title: deriveTitle(nextMessages) }
        : c
    ));
    setInput('');
    setLoading(true);

    const placeholderMsg: Message = { role: 'assistant', content: '', timestamp: new Date() };
    setConversations(prev => prev.map(c =>
      c.id === convId ? { ...c, messages: [...nextMessages, placeholderMsg] } : c
    ));

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('No response stream');

      let accumulated = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value);
        const snap = accumulated;
        setConversations(prev => prev.map(c => {
          if (c.id !== convId) return c;
          const msgs = [...c.messages];
          msgs[msgs.length - 1] = { role: 'assistant', content: snap, timestamp: new Date() };
          return { ...c, messages: msgs };
        }));
      }
    } catch (err: any) {
      const errMsg = err?.message?.includes('OPENAI_API_KEY')
        ? 'OpenAI API key is not configured.'
        : `Sorry, something went wrong: ${err?.message ?? 'Unknown error'}`;
      setConversations(prev => prev.map(c => {
        if (c.id !== convId) return c;
        const msgs = [...c.messages];
        msgs[msgs.length - 1] = { role: 'assistant', content: errMsg, timestamp: new Date() };
        return { ...c, messages: msgs };
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F7F5] font-sans overflow-hidden">
      <Navbar />

      {/* Main layout below navbar */}
      <div className="flex flex-1 overflow-hidden pt-[72px]">

        {/* ── Left Sidebar ─────────────────────────────────────────────── */}
        <aside className="w-72 shrink-0 flex flex-col bg-white border-r border-[#000101]/8 overflow-y-auto">
          {/* New Conversation */}
          <div className="p-4 border-b border-[#000101]/8">
            <button
              onClick={newConversation}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 border-dashed border-[#39FF14]/40 hover:border-[#39FF14] hover:bg-[#39FF14]/5 text-[#087A32] font-bold text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </button>
          </div>

          {/* Chat History */}
          <div className="p-4">
            <p className="text-[10px] font-black text-[#013D1F]/40 uppercase tracking-widest mb-3">Chat History</p>
            <div className="space-y-1">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                    conv.id === activeConvId
                      ? 'bg-[#39FF14]/10 text-[#087A32]'
                      : 'text-[#013D1F]/70 hover:bg-[#000101]/5'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 shrink-0 opacity-60" />
                  <span className="text-xs font-semibold truncate">{conv.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Previous Bookings */}
          <div className="p-4 border-t border-[#000101]/8 flex-1">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-black text-[#013D1F]/40 uppercase tracking-widest">Previous Bookings</p>
              <Link href="/client/requests" className="text-[10px] font-bold text-[#087A32] hover:underline">
                View all
              </Link>
            </div>

            {bookingsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse bg-[#000101]/5 rounded-2xl h-20" />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-6">
                <Building2 className="w-8 h-8 text-[#013D1F]/20 mx-auto mb-2" />
                <p className="text-xs text-[#013D1F]/40 font-medium">No bookings yet</p>
                <Link href="/#services" className="text-xs text-[#087A32] font-bold hover:underline mt-1 block">
                  Book a service →
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {bookings.map(b => {
                  const st = STATUS_CONFIG[b.status] ?? STATUS_CONFIG.PENDING;
                  const StatusIcon = st.icon;
                  return (
                    <Link
                      key={b.id}
                      href="/client/requests"
                      className="flex items-start gap-3 p-3 rounded-2xl border border-[#000101]/8 hover:border-[#39FF14]/30 hover:shadow-md transition-all bg-white group"
                    >
                      {/* Icon block */}
                      <div className="w-10 h-10 rounded-xl bg-[#F5F7F5] flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-[#013D1F]/50" />
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#000101] truncate leading-tight">{b.serviceType}</p>
                        <p className="text-[10px] text-[#013D1F]/60 truncate">{b.city}, {b.state}</p>
                        <div className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${st.bg} ${st.color}`}>
                          <StatusIcon className="w-2.5 h-2.5" />
                          {st.label}
                        </div>
                      </div>
                      {/* Meta */}
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-bold text-[#013D1F]/50">{fmt(b.createdAt)}</p>
                        <p className="text-[10px] font-bold text-[#087A32] mt-1">₹{Number(b.compensation).toLocaleString('en-IN')}</p>
                        <ChevronRight className="w-3.5 h-3.5 text-[#013D1F]/30 group-hover:text-[#087A32] ml-auto mt-1 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* ── Chat Panel ───────────────────────────────────────────────── */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {isEmpty ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center h-full text-center max-w-xl mx-auto">
                <div className="w-16 h-16 bg-[#000101] rounded-2xl flex items-center justify-center mb-6 shadow-xl">
                  <Sparkles className="w-8 h-8 text-[#39FF14]" strokeWidth={2.5} />
                </div>
                <h2 className="text-2xl font-black text-[#000101] mb-2">How can I help you?</h2>
                <p className="text-sm text-[#013D1F]/60 font-medium mb-10 leading-relaxed">
                  Ask me anything about homes, neighborhoods, prices, mortgage estimates, or real estate advice in India.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {SUGGESTIONS.map((s, i) => {
                    const Icon = s.icon === 'home' ? Home : s.icon === 'pin' ? MapPin : s.icon === 'dollar' ? DollarSign : Calculator;
                    return (
                      <button
                        key={i}
                        onClick={() => send(s.text)}
                        className="flex items-start gap-3 px-4 py-3.5 bg-white border border-[#000101]/10 hover:border-[#39FF14]/50 hover:shadow-lg rounded-2xl text-left text-sm font-semibold text-[#000101] transition-all group"
                      >
                        <span className="w-8 h-8 rounded-xl bg-[#39FF14]/10 flex items-center justify-center shrink-0 group-hover:bg-[#39FF14]/20 transition-colors">
                          <Icon className="w-4 h-4 text-[#087A32]" strokeWidth={2.5} />
                        </span>
                        <span className="leading-snug pt-0.5">{s.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Messages list */
              <div className="max-w-3xl mx-auto space-y-5">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-[#000101] flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                        <Sparkles className="w-4 h-4 text-[#39FF14]" strokeWidth={2.5} />
                      </div>
                    )}
                    <div className="flex flex-col gap-1 max-w-[75%]">
                      <div
                        className={`px-4 py-3 text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#39FF14] text-[#000101] rounded-2xl rounded-br-sm shadow-md'
                            : 'bg-white border border-[#000101]/8 text-[#000101] rounded-2xl rounded-bl-sm shadow-sm'
                        } ${msg.role === 'assistant' && !msg.content ? 'animate-pulse min-w-[120px]' : ''}`}
                      >
                        {msg.role === 'assistant' && !msg.content
                          ? <span className="text-[#013D1F]/40 text-xs">Thinking…</span>
                          : msg.content
                        }
                      </div>
                      {msg.timestamp && (
                        <span className={`text-[10px] text-[#013D1F]/30 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {fmtTime(msg.timestamp)}
                          {msg.role === 'user' && <span className="ml-1 text-[#087A32]">✓✓</span>}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="border-t border-[#000101]/8 bg-white px-6 py-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-3 bg-[#F5F7F5] rounded-2xl border border-[#000101]/10 focus-within:border-[#39FF14] focus-within:ring-2 focus-within:ring-[#39FF14]/20 transition-all px-4 py-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = Math.min(e.target.scrollHeight, 140) + 'px';
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about homes, neighborhoods, prices..."
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[#000101] text-sm font-medium focus:outline-none max-h-36 overflow-y-auto placeholder:text-[#013D1F]/40"
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className="w-9 h-9 rounded-xl bg-[#39FF14] hover:bg-[#087A32] hover:text-white flex items-center justify-center shrink-0 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4 text-[#000101] hover:text-white" strokeWidth={2.5} />
                </button>
              </div>
              <p className="text-center text-[10px] text-[#013D1F]/30 font-medium mt-2">
                AI assistant — estimates are approximate. Consult a licensed professional for advice.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
