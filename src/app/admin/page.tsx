'use client';

import React, { useEffect, useState } from 'react';
import { useRequests, useUsers, useAdminRole } from '@/hooks/useData';
import api from '@/lib/axios';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminCPDashboard() {
  const { users, loading: usersLoading, refresh: refreshUsers } = useUsers();
  const { requests, loading: requestsLoading, refresh: refreshRequests } = useRequests();
  const { role: currentRole, isSuperAdmin } = useAdminRole();
  const [pendingAgents, setPendingAgents] = useState(0);
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/agents')
      .then(r => r.json())
      .then(d => setPendingAgents((d.applications || []).filter((a: any) => a.status === 'PENDING').length))
      .catch(() => {});
  }, []);

  const loading = usersLoading || requestsLoading;

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const refreshAll = () => {
    refreshUsers();
    refreshRequests();
  };

  const sendTestNotification = async () => {
    try {
      setSendingTest(true);
      setTestResult(null);

      const response = await api.post('/notifications/test', {});
      const {
        successCount,
        failureCount,
        invalidTokensRemoved,
        attemptedCount,
      } = response.data;

      setTestResult(
        `Sent to ${successCount}/${attemptedCount} devices` +
          (failureCount ? `, ${failureCount} failed` : '') +
          (invalidTokensRemoved ? `, removed ${invalidTokensRemoved} invalid token${invalidTokensRemoved === 1 ? '' : 's'}` : '')
      );
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Failed to send test notification.';
      setTestResult(message);
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-20">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#1a2a2a] tracking-tight">Admin Overview</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={sendTestNotification}
            disabled={sendingTest}
            className="bg-[#112424] hover:bg-[#0d1d1d] text-white border border-[#112424] px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
          >
            {sendingTest ? 'Sending Test...' : 'Send Test Notification'}
          </button>
          <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border border-orange-200/50">
            Admin
          </span>
          <button 
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/login';
            }}
            className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
          >
            Log Out
          </button>
        </div>
      </div>
      {testResult && (
        <div className="bg-white border border-gray-100 rounded-2xl px-5 py-4 text-sm font-medium text-gray-700 shadow-sm">
          {testResult}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard value={users.length.toString()} label="Total Users" />
        <StatCard value={requests.length.toString()} label="Total Requests" />
        <StatCard value={pendingAgents.toString()} label="Agents Pending" highlight={pendingAgents > 0} href="/admin/agents" />
        <StatCard value={requests.filter((r: any) => r.status === 'ACTIVE').length.toString()} label="Live Shows" />
      </div>

      {/* Users Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-xl text-[#1a2a2a] tracking-tight">User Management</h3>
          <button 
            onClick={refreshAll}
            className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
          >
            Refresh All
          </button>
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50/50 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Last IP</th>
                <th className="px-8 py-5">Last Seen</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-medium">
                    No users found in database.
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <UserRow 
                    key={user.id}
                    name={user.fullName} 
                    email={user.email} 
                    role={user.role} 
                    roleColor={user.role === 'ADMIN' || user.role === 'SUPERADMIN' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}
                    status={user.status} 
                    ip={user.lastIp || '-'} 
                    lastSeen={new Date(user.lastSeen).toLocaleDateString()}
                    verified={true}
                    currentRole={currentRole}
                    isSuperAdmin={isSuperAdmin}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-xl text-[#1a2a2a] tracking-tight">Recent Requests</h3>
          <Link href="/admin/requests" className="text-xs font-bold text-green-600 uppercase tracking-widest">View All</Link>
        </div>
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50/50 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Service</th>
                <th className="px-8 py-5">Property</th>
                <th className="px-8 py-5">Date</th>
                <th className="px-8 py-5">Compensation</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-medium">
                    No requests found in database.
                  </td>
                </tr>
              ) : (
                requests.slice(0, 10).map((req: any) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 font-bold text-[#1a2a2a] text-sm">{req.serviceType}</td>
                    <td className="px-8 py-6">
                      <div className="text-sm font-bold text-[#1a2a2a]">{req.address}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{req.city}, {req.state}</div>
                    </td>
                    <td className="px-8 py-6 text-xs text-gray-500 font-medium">{new Date(req.date).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-sm font-bold text-green-600">${req.compensation}</td>
                    <td className="px-8 py-6">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${
                        req.status === 'PENDING' ? 'bg-orange-50 text-orange-600' : 
                        req.status === 'ACTIVE' ? 'bg-blue-50 text-blue-600' : 
                        'bg-green-50 text-green-600'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-[10px] font-bold">Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, highlight, href }: { value: string; label: string; highlight?: boolean; href?: string }) {
  const inner = (
    <div className={`bg-white p-6 rounded-2xl shadow-sm border flex items-center gap-6 group hover:shadow-md transition-all ${highlight ? 'border-amber-200 bg-amber-50/40' : 'border-gray-50'}`}>
      <div className={`text-3xl font-extrabold group-hover:scale-110 transition-transform ${highlight ? 'text-amber-600' : 'text-[#1a2a2a]'}`}>{value}</div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      {highlight && <span className="ml-auto text-[10px] font-black text-amber-500 uppercase tracking-widest">Review →</span>}
    </div>
  );
  return href ? <a href={href}>{inner}</a> : inner;
}

function UserRow({ name, email, role, roleColor, status, ip, lastSeen, verified, tag, currentRole, isSuperAdmin }: any) {
  // Permission matrix:
  // SUPERADMIN → can edit/disable/delete anyone
  // ADMIN      → read-only; no mutations at all
  const canMutate = isSuperAdmin;

  return (
    <tr className="group hover:bg-gray-50/50 transition-colors">
      <td className="px-8 py-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1a2a2a]">{name}</span>
            {tag && <span className="text-[9px] font-black text-pink-600 uppercase italic tracking-tighter">{tag}</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400 font-medium">{email}</span>
            {verified && (
              <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest ${roleColor}`}>
          {role}
        </span>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-[11px] font-bold text-gray-600">{status}</span>
        </div>
      </td>
      <td className="px-8 py-6 text-xs text-blue-600 font-medium underline underline-offset-4 decoration-blue-100">{ip}</td>
      <td className="px-8 py-6 text-xs text-gray-400 font-medium">{lastSeen}</td>
      <td className="px-8 py-6 text-right">
        {canMutate ? (
          <div className="flex items-center justify-end gap-2">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all">Edit</button>
            <button className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all">Disable</button>
            <button className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all">Delete</button>
          </div>
        ) : (
          <span
            title="Read-only — Superadmin access required to modify users"
            className="text-[10px] font-bold text-gray-300 uppercase tracking-widest select-none"
          >
            View only
          </span>
        )}
      </td>
    </tr>
  );
}
