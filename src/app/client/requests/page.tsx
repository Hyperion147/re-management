'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRequests } from '@/hooks/useData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequestChatModal from '@/components/RequestChatModal';

type TabType = 'All' | 'Active' | 'Completed' | 'Cancelled' | 'As Agent';

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const { requests, loading, updateRequestStatus } = useRequests();
  const [chatRequest, setChatRequest] = useState<{ id: string; address: string } | null>(null);

  const filteredRequests = requests.filter((req: any) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') return req.status === 'PENDING' || req.status === 'ACTIVE';
    if (activeTab === 'Completed') return req.status === 'COMPLETED';
    if (activeTab === 'Cancelled') return req.status === 'CANCELLED';
    if (activeTab === 'As Agent') return !!req.agentId; // requests where user is the agent
    return true;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a2a2a] tracking-tight">My Bookings</h2>
        <Link 
          href="/client/new-request"
          className="bg-[#d69e5e] hover:bg-[#c58d4d] text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-orange-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-xl leading-none font-light">+</span> New Request
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-gray-100 pb-px">
        <Tab label="All" active={activeTab === 'All'} onClick={() => setActiveTab('All')} />
        <Tab label="Active" active={activeTab === 'Active'} onClick={() => setActiveTab('Active')} />
        <Tab label="Completed" active={activeTab === 'Completed'} onClick={() => setActiveTab('Completed')} />
        <Tab label="Cancelled" active={activeTab === 'Cancelled'} onClick={() => setActiveTab('Cancelled')} />
        <Tab label="As Agent" active={activeTab === 'As Agent'} onClick={() => setActiveTab('As Agent')} />
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50/50 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400 font-medium italic">Loading your bookings...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px]">
            <div className="w-20 h-20 bg-orange-50 rounded-[2rem] flex items-center justify-center text-orange-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-base text-[#1a2a2a] font-bold">No bookings found.</p>
              <p className="text-sm text-gray-400 font-medium">You haven't made any requests yet.</p>
            </div>
            <Link 
              href="/client/new-request"
              className="bg-[#416450] hover:bg-[#345140] text-white px-10 py-4 rounded-[1.25rem] text-sm font-bold shadow-xl shadow-green-900/20 transition-all hover:scale-[1.03] active:scale-[0.97]"
            >
              Create your first request
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredRequests.map((req: any) => (
              <BookingRow
                key={req.id}
                req={req}
                onUpdateStatus={(status) => updateRequestStatus(req.id, status)}
                onChat={() => setChatRequest({ id: req.id, address: req.address })}
              />
            ))}
          </div>
        )}
      </div>

      {chatRequest && (
        <RequestChatModal
          requestId={chatRequest.id}
          requestAddress={chatRequest.address}
          isOpen={true}
          onClose={() => setChatRequest(null)}
        />
      )}
    </div>
  );
}

function BookingRow({ req, onUpdateStatus, onChat }: { req: any; onUpdateStatus: (status: string) => void; onChat: () => void }) {
  return (
    <div className="flex items-center justify-between p-8 hover:bg-gray-50/50 transition-colors">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
          req.serviceType === 'Showing' ? 'bg-blue-50 text-blue-500' :
          req.serviceType === 'Open House' ? 'bg-orange-50 text-orange-500' :
          'bg-green-50 text-green-500'
        }`}>
          {req.serviceType === 'Showing' ? <HomeIcon /> : <OpenHouseIcon />}
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-bold text-[#1a2a2a]">{req.address}</h4>
          <p className="text-xs text-gray-400 font-medium">{req.city}, {req.state} {req.zip}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-12">
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
          <p className="text-sm font-bold text-[#1a2a2a]">{new Date(req.date).toLocaleDateString()}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time</p>
          <p className="text-sm font-bold text-[#1a2a2a]">{req.startTime} - {req.endTime}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fee</p>
          <p className="text-sm font-bold text-green-600">${req.compensation}</p>
        </div>
        <div className="flex items-center gap-3 justify-end">
          {req.agentId && (
            <button
              onClick={onChat}
              className="flex items-center gap-1.5 bg-[#e8f3f0] text-[#0b5b41] hover:bg-[#d6f7ee] px-3 py-2 rounded-xl text-[10px] font-bold transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat
            </button>
          )}
          <div className="w-36">
            <Select value={req.status} onValueChange={(value) => onUpdateStatus(value)}>
              <SelectTrigger
                className={`h-8 text-[10px] font-black uppercase tracking-widest px-3 rounded-lg border-none focus:ring-0 focus:ring-offset-0 ${
                  req.status === 'PENDING' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' :
                  req.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' :
                  req.status === 'COMPLETED' ? 'bg-green-50 text-green-600 hover:bg-green-100' :
                  'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING" className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">PENDING</SelectItem>
                <SelectItem value="ACTIVE" className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">ACTIVE</SelectItem>
                <SelectItem value="COMPLETED" className="text-[10px] font-bold text-green-600 uppercase tracking-widest">COMPLETED</SelectItem>
                <SelectItem value="CANCELLED" className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">CANCELLED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative pb-4 text-xs font-bold transition-all ${
        active ? 'text-[#416450]' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#416450] rounded-full" />
      )}
    </button>
  );
}

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const OpenHouseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v20M16 14v20M3 14h18M12 3l9 11h-18l9-11z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22h6v8H9v-8z" /></svg>
);
