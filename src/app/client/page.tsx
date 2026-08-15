'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useRequests, useMessages } from '@/hooks/useData';
import { supabase } from '@/lib/supabase';
import api from '@/lib/axios';
import PaymentsSection from '@/components/PaymentsSection';

type Tab = 'Requests' | 'Messages' | 'Payments';

export default function Dashboard() {
  const { user: currentUser, initial } = useCurrentUser();
  const { requests } = useRequests();
  const { messages, sendMessage } = useMessages();
  const [activeTab, setActiveTab] = useState<Tab>('Requests');
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [connectStatus, setConnectStatus] = useState<'not_connected' | 'pending' | 'active' | null>(null);

  useEffect(() => {
    async function fetchPaymentStatus() {
      try {
        const { data } = await api.get('/payments/connect');
        setConnectStatus(data.status);
      } catch {
        setConnectStatus('not_connected');
      }
    }
    fetchPaymentStatus();
  }, []);

  const myRequests = requests.filter((r: any) =>
    r.clientId === currentUser?.id || r.agentId === currentUser?.id
  );
  const activeRequests = myRequests.filter((r: any) => r.status === 'PENDING' || r.status === 'ACTIVE').length;
  const completedRequests = myRequests.filter((r: any) => r.status === 'COMPLETED').length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setIsSending(true);
    try {
      await sendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error(error);
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const paymentDot =
    connectStatus === 'active' ? 'bg-green-500' :
    connectStatus === 'pending' ? 'bg-orange-400' :
    connectStatus === 'not_connected' ? 'bg-red-400' : null;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-8 py-10 space-y-8">

      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-700">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a2a2a]">{currentUser?.fullName || 'Loading...'}</h1>
            <p className="text-sm text-gray-500 font-medium">{currentUser?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
          <span className="text-3xl font-bold text-[#d69e5e] mb-1">{activeRequests}</span>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Active Requests</span>
        </div>
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center border border-gray-100 shadow-sm">
          <span className="text-3xl font-bold text-[#1a2a2a] mb-1">{completedRequests}</span>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Completed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#f4f3ef] p-1.5 rounded-full w-fit">
        <button
          onClick={() => setActiveTab('Requests')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full transition-all ${
            activeTab === 'Requests'
              ? 'bg-white text-[#1a2a2a] shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          My Requests
        </button>

        <button
          onClick={() => setActiveTab('Messages')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full transition-all ${
            activeTab === 'Messages'
              ? 'bg-white text-[#1a2a2a] shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Messages
        </button>

        <button
          onClick={() => setActiveTab('Payments')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full transition-all ${
            activeTab === 'Payments'
              ? 'bg-white text-[#1a2a2a] shadow-sm ring-1 ring-black/5'
              : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          <span className="relative flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Payments
            {paymentDot && connectStatus !== 'active' && (
              <span className={`w-2 h-2 rounded-full ${paymentDot} shrink-0`} />
            )}
          </span>
        </button>
      </div>

      {/* Content Area */}
      <div className={`bg-white rounded-3xl border border-gray-100 shadow-sm ${
        activeTab === 'Requests'
          ? 'flex flex-col items-center justify-center min-h-[400px] p-12 text-center'
          : activeTab === 'Messages'
          ? 'flex flex-col overflow-hidden'
          : 'p-10'
      }`}>
        {activeTab === 'Requests' && (
          <>
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a2a2a] mb-2">No service requests</h3>
            <p className="text-gray-500 font-medium mb-8">Book an agent for showings, offers, and more.</p>
            <Link
              href="/"
              className="border border-gray-200 text-[#1a2a2a] font-bold text-sm px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              Browse Services
            </Link>
          </>
        )}

        {activeTab === 'Messages' && (
          <div className="flex flex-col h-[500px]">
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#1a2a2a] mb-2">No messages</h3>
                  <p className="text-gray-500 font-medium">You don&apos;t have any active conversations.</p>
                </div>
              ) : (
                messages.map((msg: any) => (
                  <div key={msg.id} className={`flex flex-col ${msg.isFromAdmin ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-[13px] font-medium leading-relaxed ${
                      msg.isFromAdmin
                        ? 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-tl-sm'
                        : 'bg-[#1c352d] text-white rounded-tr-sm shadow-md'
                    }`}>
                      {msg.message}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold mt-2 px-1">
                      {msg.isFromAdmin ? 'Support' : 'You'} • {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm font-medium focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
                <button
                  type="submit"
                  disabled={isSending || !newMessage.trim()}
                  className="bg-[#1c352d] hover:bg-[#152a23] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                >
                  <span>{isSending ? 'Sending...' : 'Send'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'Payments' && (
          <PaymentsSection userId={currentUser?.id ?? ''} />
        )}
      </div>

    </div>
  );
}
