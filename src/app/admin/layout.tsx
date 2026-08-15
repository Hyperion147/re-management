'use client';

import React, { useEffect, useState } from 'react';
import { useAdminRole } from '@/hooks/useData';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function AdminCPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin, isSuperAdmin, loading } = useAdminRole();
  const { user, initial } = useCurrentUser();
  const [pendingAgents, setPendingAgents] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;
    fetch('/api/admin/agents')
      .then(r => r.json())
      .then(d => {
        const pending = (d.applications || []).filter((a: any) => a.status === 'PENDING').length;
        setPendingAgents(pending);
      })
      .catch(() => {});
  }, [isAdmin]);

  // Only ADMIN and SUPERADMIN can enter /admin — plain USERs get redirected
  useEffect(() => {
    if (!loading && !isAdmin) {
      window.location.href = '/no-access';
    }
  }, [isAdmin, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafb]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#f8fafb] font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* AdminCP Sidebar */}
      <aside className="w-68 bg-[#112424] text-[#94a3a3] flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-900/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight tracking-tight">Veyro</h1>
              <p className="text-[11px] text-[#5e7171] font-semibold uppercase tracking-wider">AdminCP</p>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <p className="text-[10px] font-bold text-[#4a5e5e] mb-5 tracking-[0.2em] uppercase opacity-60">Management</p>
              <nav className="space-y-2">
                <SidebarItem href="/admin" icon={<UsersIcon />} label="Users" />
                <SidebarItem href="/admin/agents" icon={<AgentIcon />} label="Agents" iconClass="text-amber-400" badge={pendingAgents} />
                <SidebarItem href="/admin/sessions" icon={<SessionsIcon />} label="Sessions" />
                <SidebarItem href="/admin/support" icon={<SupportIcon />} label="Support" iconClass="text-blue-400" />
                {/* Create User is only available to SUPERADMIN */}
                {isSuperAdmin && (
                  <SidebarItem href="/admin/create-user" icon={<PlusIcon />} label="Create User" iconClass="text-purple-400" />
                )}
              </nav>
            </div>

            <div>
              <p className="text-[10px] font-bold text-[#4a5e5e] mb-5 tracking-[0.2em] uppercase opacity-60">Site</p>
              <nav className="space-y-2">
                <SidebarItem href="/" icon={<HomeIcon />} label="Homepage" iconClass="text-blue-400" />
                <SidebarItem href="/client/profile" icon={<UserIcon />} label="My Profile" iconClass="text-purple-400" />
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-auto p-6 bg-[#0d1d1d]/50 backdrop-blur-sm border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#2d4d4d] rounded-full flex items-center justify-center text-[#4fd1c5] font-bold text-sm border border-white/10 ring-4 ring-black/10">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white tracking-tight truncate">{user?.fullName ?? '...'}</p>
              <p className="text-[10px] text-gray-500 font-medium truncate">{user?.email ?? ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-68 p-12 bg-[#f8fafb]">
        {children}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, iconClass, href, badge }: { icon: React.ReactNode; label: string; active?: boolean; iconClass?: string; href: string; badge?: number }) {
  return (
    <a
      href={href}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all group ${
        active
          ? 'text-white bg-gradient-to-r from-[#1a3131] to-[#142b2b] shadow-inner border border-white/5'
          : 'hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className={`transition-transform group-hover:scale-110 duration-200 ${iconClass || 'opacity-70 group-hover:opacity-100'}`}>
        {icon}
      </span>
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </a>
  );
}

// Icons
const AgentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c0 1.306.835 2.418 2 2.83V19h-2v1h6v-1h-2v-.17A3.001 3.001 0 0015 16" /></svg>
);
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
const SessionsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
);
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
);
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const SupportIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);
