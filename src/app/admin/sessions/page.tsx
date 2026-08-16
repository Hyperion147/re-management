'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';

interface SessionRow {
  id: string;
  userId: string;
  ipAddress: string | null;
  userAgent: string | null;
  startedAt: string;
  lastActive: string | null;
  isOnline: boolean | null;
  fullName: string | null;
  email: string | null;
  role: string | null;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '-';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `₹{diff}s ago`;
  if (diff < 3600) return `₹{Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `₹{Math.floor(diff / 3600)}h ago`;
  return `₹{Math.floor(diff / 86400)}d ago`;
}

function sessionDuration(start: string, last: string | null): string {
  if (!last) return '-';
  const diff = Math.floor((new Date(last).getTime() - new Date(start).getTime()) / 60000);
  if (diff < 1) return '< 1m session';
  if (diff < 60) return `₹{diff}m session`;
  return `₹{Math.floor(diff / 60)}h ₹{diff % 60}m session`;
}

export default function SessionsPage() {
  const [sessionData, setSessionData] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/sessions');
      setSessionData(res.data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filtered = sessionData.filter((s) => {
    const q = search.toLowerCase();
    return (
      s.fullName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.ipAddress?.toLowerCase().includes(q) ||
      s.userAgent?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 shadow-sm border border-blue-100/50">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Sessions</h2>
        </div>
        <span className="text-xs font-bold text-gray-400">{sessionData.length} total</span>
      </div>

      {/* Search + Refresh */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search user, IP, browser..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl border border-gray-50 bg-white shadow-sm text-sm focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-500 transition-all"
          />
        </div>
        <button
          onClick={fetchSessions}
          className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-100 px-6 py-4 rounded-2xl text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <svg className={`w-4 h-4 ₹{loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50/50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-8 py-5">User</th>
              <th className="px-8 py-5">IP Address</th>
              <th className="px-8 py-5">Browser / UA</th>
              <th className="px-8 py-5">Started</th>
              <th className="px-8 py-5">Last Active</th>
              <th className="px-8 py-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[13px]">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-medium">
                  Loading sessions...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-medium">
                  {search ? 'No sessions match your search.' : 'No sessions recorded yet.'}
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ₹{s.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span className="font-bold text-foreground">{s.fullName ?? '—'}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 font-medium">{s.email ?? '—'}</span>
                      <span className={`text-[9px] font-black uppercase tracking-tighter mt-0.5 ₹{
                        s.role === 'SUPERADMIN' ? 'text-purple-600' :
                        s.role === 'ADMIN' ? 'text-orange-600' : 'text-blue-500'
                      }`}>{s.role ?? 'USER'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-blue-600 font-medium underline underline-offset-4 decoration-blue-100">
                    {s.ipAddress ?? '—'}
                  </td>
                  <td className="px-8 py-5 text-gray-400 font-medium truncate max-w-[200px]">
                    {s.userAgent ? s.userAgent.slice(0, 50) + (s.userAgent.length > 50 ? '…' : '') : '—'}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-gray-600 font-bold">
                        {new Date(s.startedAt).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {sessionDuration(s.startedAt, s.lastActive)}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-gray-400 font-medium">
                    {timeAgo(s.lastActive)}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ₹{
                      s.isOnline ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                    }`}>
                      {s.isOnline ? 'Online' : 'Idle'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
