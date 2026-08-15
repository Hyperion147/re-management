'use client';

import React, { useState } from 'react';
import { useRequests } from '@/hooks/useData';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from '@/lib/supabase';
import RequestChatModal from '@/components/RequestChatModal';

type FilterType = 'All Types' | 'Showing' | 'Open House' | 'Lockbox Drop' | 'Photography' | 'Property Report';

export default function OpportunitiesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All Types');
  const { requests, loading, refresh, updateRequestStatus } = useRequests();
  const [chatRequest, setChatRequest] = useState<{ id: string; address: string } | null>(null);

  const filteredRequests = requests.filter((req: any) => {
    // Only show pending requests
    if (req.status !== 'PENDING') return false;
    
    if (activeFilter === 'All Types') return true;
    return req.serviceType === activeFilter;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a2a2a] tracking-tight">Showing Opportunities</h2>
        <button 
          onClick={() => refresh()}
          className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 py-2 overflow-x-auto no-scrollbar">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2">Filter:</span>
        <FilterButton label="All Types" active={activeFilter === 'All Types'} onClick={() => setActiveFilter('All Types')} />
        <FilterButton label="Showing" icon="🏠" active={activeFilter === 'Showing'} onClick={() => setActiveFilter('Showing')} />
        <FilterButton label="Open House" icon="🏡" active={activeFilter === 'Open House'} onClick={() => setActiveFilter('Open House')} />
        <FilterButton label="Lockbox Drop" icon="🔑" active={activeFilter === 'Lockbox Drop'} onClick={() => setActiveFilter('Lockbox Drop')} />
        <FilterButton label="Photography" icon="📸" active={activeFilter === 'Photography'} onClick={() => setActiveFilter('Photography')} />
        <FilterButton label="Property Report" icon="📄" active={activeFilter === 'Property Report'} onClick={() => setActiveFilter('Property Report')} />
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50/50 min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-full min-h-[400px] text-gray-400 font-medium italic">Scanning for opportunities...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
            <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center text-blue-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <p className="text-base text-[#1a2a2a] font-bold">No open opportunities match your filter right now.</p>
              <p className="text-sm text-gray-400 font-medium">Check back soon — new requests come in throughout the day.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-10">
            {filteredRequests.map((req: any) => (
              <OpportunityCard
                key={req.id}
                req={req}
                onChat={() => setChatRequest({ id: req.id, address: req.address })}
                onApply={async () => {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (user) {
                    await updateRequestStatus(req.id, 'ACTIVE', user.id);
                    alert("You have successfully applied for this opportunity!");
                  } else {
                    alert("Please log in to apply.");
                  }
                }}
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

function OpportunityCard({ req, onApply, onChat }: { req: any; onApply: () => Promise<void>; onChat: () => void }) {
  const [isApplying, setIsApplying] = useState(false);
  const [open, setOpen] = useState(false);

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await onApply();
      setOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between h-full">
        <div className="space-y-6">
          <div className="flex justify-between items-start">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              req.serviceType === 'Showing' ? 'bg-blue-50 text-blue-500' :
              req.serviceType === 'Open House' ? 'bg-orange-50 text-orange-500' :
              'bg-green-50 text-green-500'
            }`}>
              <span className="text-xl">
                {req.serviceType === 'Showing' ? '🏠' : 
                 req.serviceType === 'Open House' ? '🏡' : 
                 req.serviceType === 'Lockbox Drop' ? '🔑' : 
                 req.serviceType === 'Photography' ? '📸' : '📄'}
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fee</p>
              <p className="text-xl font-black text-green-600 tracking-tight">${req.compensation}</p>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#1a2a2a] group-hover:text-green-800 transition-colors">{req.address}</h4>
            <p className="text-xs text-gray-400 font-medium">{req.city}, {req.state}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date</p>
              <p className="text-xs font-bold text-[#1a2a2a]">{new Date(req.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Time Window</p>
              <p className="text-xs font-bold text-[#1a2a2a]">{req.startTime} - {req.endTime}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onChat}
            className="flex items-center justify-center gap-2 flex-1 border border-gray-200 hover:border-gray-300 bg-white text-gray-600 hover:text-gray-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Chat
          </button>
          <DialogTrigger asChild>
            <button className="flex-[2] bg-[#1a2a2a] hover:bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-gray-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
              View Details & Apply
            </button>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="sm:max-w-[500px] p-8 rounded-[2rem]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1a2a2a]">{req.serviceType} Details</DialogTitle>
          <DialogDescription className="text-gray-500 font-medium">
            Review the details below before applying for this opportunity.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Address</p>
              <p className="text-sm font-bold text-[#1a2a2a]">{req.address}, {req.city}, {req.state} {req.zip}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Schedule</p>
                <p className="text-sm font-bold text-[#1a2a2a]">{new Date(req.date).toLocaleDateString()}</p>
                <p className="text-xs text-gray-500 font-medium">{req.startTime} - {req.endTime}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Compensation</p>
                <p className="text-xl font-black text-green-600">${req.compensation}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {req.mlsNumber && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">MLS Number</p>
                <p className="text-sm font-bold text-[#1a2a2a]">{req.mlsNumber}</p>
              </div>
            )}
            {req.accessNotes && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Access Notes</p>
                <p className="text-sm text-gray-600 bg-orange-50/50 p-3 rounded-xl border border-orange-100/50">{req.accessNotes}</p>
              </div>
            )}
            {req.additionalNotes && (
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Additional Notes</p>
                <p className="text-sm text-gray-600 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">{req.additionalNotes}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <button 
            onClick={() => setOpen(false)}
            className="text-xs font-bold text-gray-500 hover:text-gray-700 px-4 py-3"
          >
            Cancel
          </button>
          <button 
            onClick={handleApply}
            disabled={isApplying}
            className="bg-[#416450] hover:bg-[#345140] text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {isApplying ? 'Applying...' : 'Confirm & Apply'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FilterButton({ label, icon, active, onClick }: { label: string; icon?: string; active?: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${
        active 
          ? 'bg-[#1a2a2a] text-white border-[#1a2a2a] shadow-md' 
          : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
      }`}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {label}
    </button>
  );
}
