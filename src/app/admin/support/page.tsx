'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useSupportRequests } from '@/hooks/useData';

export default function AdminSupportRequests() {
  const { supportRequests, loading, refresh } = useSupportRequests();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  
  const [replyMessage, setReplyMessage] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isThreadFullscreen, setIsThreadFullscreen] = useState(false);

  const handleSendReply = async () => {
    if (!selectedRequest?.userId || !replyMessage.trim()) return;

    setIsReplying(true);
    try {
      await api.post('/messages', {
        userId: selectedRequest.userId,
        message: replyMessage,
      });

      alert('Reply sent successfully!');
      setReplyMessage('');
      if (selectedRequest.userId) {
        await loadThreadMessages(selectedRequest.userId);
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to send reply. Please try again.');
    } finally {
      setIsReplying(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!selectedRequest?.id) return;

    setIsClosing(true);
    try {
      await api.patch(`/support-requests/${selectedRequest.id}`, { status: 'CLOSED' });
      alert('Ticket closed successfully.');
      await refresh();
      setSelectedRequest((prev: any) => ({ ...prev, status: 'CLOSED' }));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to close ticket. Please try again.');
    } finally {
      setIsClosing(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedRequest?.id) return;
    if (!confirm('Delete this ticket permanently? This cannot be undone.')) return;

    setIsDeleting(true);
    try {
      await api.delete(`/support-requests/${selectedRequest.id}`);
      alert('Ticket deleted successfully.');
      await refresh();
      setSelectedRequest(null);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.error || 'Failed to delete ticket. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const loadThreadMessages = async (userId: string) => {
    setMessagesLoading(true);
    try {
      const response = await api.get(`/messages?userId=${userId}`);
      setThreadMessages(response.data);
    } catch (err) {
      console.error('Failed to load ticket messages', err);
      setThreadMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (selectedRequest?.userId) {
      loadThreadMessages(selectedRequest.userId);
    } else {
      setThreadMessages([]);
    }
  }, [selectedRequest]);

  if (loading && supportRequests.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-20">
      {/* Header */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-bold text-[#1a2a2a] tracking-tight mb-1">Support Inbox</h2>
          <p className="text-sm font-medium text-gray-500">View and manage customer support tickets.</p>
        </div>
        <button 
          onClick={refresh}
          className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50/50 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <th className="px-8 py-5">Date</th>
              <th className="px-8 py-5">User ID</th>
              <th className="px-8 py-5 w-1/3">Subject & Message</th>
              <th className="px-8 py-5">Attachment</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {supportRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-16 text-center text-gray-400 font-medium">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    No support requests found.
                  </div>
                </td>
              </tr>
            ) : (
              supportRequests.map((req: any) => (
                <tr key={req.id} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6 text-xs text-gray-400 font-medium whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {req.userId ? req.userId.substring(0, 8) + '...' : 'Unknown User'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-bold text-[#1a2a2a] mb-1">{req.subject}</div>
                    <div className="text-[11px] text-gray-500 font-medium line-clamp-2 pr-4">{req.message}</div>
                  </td>
                  <td className="px-8 py-6">
                    {req.attachmentUrl ? (
                      <a 
                        href={req.attachmentUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl hover:ring-2 ring-green-500 overflow-hidden relative group/img transition-all"
                        title={req.attachmentName || 'View Attachment'}
                      >
                        <img src={req.attachmentUrl} alt="Attachment" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </a>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">None</span>
                    )}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                      req.status === 'OPEN' ? 'bg-orange-50 text-orange-600' : 
                      req.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 
                      'bg-green-50 text-green-600'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedRequest(req)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-[10px] font-bold transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-lg text-[#1a2a2a]">Ticket Details</h3>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-2 rounded-full shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                    selectedRequest.status === 'OPEN' ? 'bg-orange-50 text-orange-600' : 
                    selectedRequest.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600' : 
                    'bg-green-50 text-green-600'
                  }`}>
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date Submitted</p>
                  <p className="text-sm font-bold text-[#1a2a2a]">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">User ID</p>
                  <p className="text-sm font-medium text-gray-600">{selectedRequest.userId || 'Anonymous'}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Subject</p>
                <p className="text-lg font-bold text-[#1a2a2a]">{selectedRequest.subject}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Message</p>
                <div className="bg-gray-50/50 p-5 rounded-xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-600 whitespace-pre-wrap leading-relaxed">{selectedRequest.message}</p>
                </div>
              </div>

              {selectedRequest.attachmentUrl && (
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Attachment ({selectedRequest.attachmentName || 'Image'})</p>
                  <a href={selectedRequest.attachmentUrl} target="_blank" rel="noreferrer" className="block w-full max-w-sm rounded-xl overflow-hidden border border-gray-200 hover:ring-4 ring-green-500/20 transition-all">
                    <img src={selectedRequest.attachmentUrl} alt="Attachment" className="w-full h-auto" />
                  </a>
                </div>
              )}

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticket Chat</p>
                  <button
                    type="button"
                    onClick={() => setIsThreadFullscreen(true)}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1c352d] bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Expand
                  </button>
                </div>
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="text-sm text-gray-500">Loading chat...</div>
                  ) : selectedRequest.userId ? (
                    threadMessages.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
                        No chat messages have been sent for this ticket yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {threadMessages.map((msg) => (
                          <div key={msg.id} className={`p-4 rounded-2xl ${msg.isFromAdmin ? 'bg-blue-50 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>
                            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                              {msg.isFromAdmin ? 'Admin' : 'User'} • {new Date(msg.createdAt).toLocaleString()}
                            </div>
                            <div className="text-sm leading-6 whitespace-pre-wrap">{msg.message}</div>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
                      This ticket has no linked user, so no chat thread is available.
                    </div>
                  )}
                </div>
              </div>

              {isThreadFullscreen && (
                <div className="fixed inset-0 z-[110] bg-black/80 p-4 overflow-y-auto">
                  <div className="relative mx-auto max-w-6xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-slate-50">
                      <div>
                        <p className="text-sm font-bold text-[#1a2a2a]">Ticket Chat</p>
                        <p className="text-xs text-gray-500">Full-screen view for {selectedRequest.subject}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsThreadFullscreen(false)}
                        className="rounded-full bg-gray-100 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-200"
                      >
                        Close
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      {messagesLoading ? (
                        <div className="text-sm text-gray-500">Loading chat...</div>
                      ) : threadMessages.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500">
                          No chat messages have been sent for this ticket yet.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {threadMessages.map((msg) => (
                            <div key={msg.id} className={`p-5 rounded-3xl ${msg.isFromAdmin ? 'bg-blue-50 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>
                              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">
                                {msg.isFromAdmin ? 'Admin' : 'User'} • {new Date(msg.createdAt).toLocaleString()}
                              </div>
                              <div className="text-sm leading-7 whitespace-pre-wrap">{msg.message}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Reply Section */}
              {selectedRequest.userId && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Send Reply to User</p>
                  <div className="flex flex-col gap-3">
                    <textarea 
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your response here... It will appear in their Messages tab."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 min-h-[100px] resize-y"
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handleSendReply}
                        disabled={isReplying || !replyMessage.trim()}
                        className="bg-[#1c352d] hover:bg-[#152a23] disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                      >
                        {isReplying ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-wrap justify-between gap-3">
              <div className="flex flex-wrap gap-3">
                {selectedRequest.status !== 'CLOSED' && (
                  <button
                    onClick={handleCloseTicket}
                    disabled={isClosing || isDeleting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                  >
                    {isClosing ? 'Closing...' : 'Close Ticket'}
                  </button>
                )}
                <button
                  onClick={handleDeleteTicket}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Ticket'}
                </button>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
