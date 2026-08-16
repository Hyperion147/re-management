'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function LoggedInHomePage() {
  const { user: currentUser } = useCurrentUser();
  const firstName = currentUser?.fullName?.split(' ')[0] || '';

  const quickAccessLinks = [
    { name: 'My Requests', icon: CalendarIcon, href: '/client/requests' },
    { name: 'Messages', icon: ChatIcon, href: '/client/messages' },
    { name: 'Job Feed', icon: BriefcaseIcon, href: '/client/opportunities' },
    { name: 'Availability', icon: CheckCircleIcon, href: '/client/availability' },
  ];

  return (
    <div className="flex flex-col w-full pb-20 relative">
      {/* Hero Section */}
      <section className="bg-primary pt-16 pb-32 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-[2.75rem] font-bold text-white tracking-tight mb-2">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-300 text-lg">
            What do you need help with today?
          </p>
        </div>
      </section>

      {/* Overlapping Action Cards */}
      <section className="px-8 -mt-14 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionCard
            title="Home Showing"
            icon={<EyeIcon />}
            href="/client/new-request?type=Private%20Home%20Showing"
          />
          <ActionCard
            title="Open House"
            icon={<ListIcon />}
            href="/client/new-request?type=Open%20House%20Hosting"
          />
          <ActionCard
            title="Lockbox Access"
            icon={<UserIcon />}
            href="/client/new-request?type=Lockbox%20Access%20Support"
          />
          <ActionCard
            title="Market Analysis"
            icon={<ChartIcon />}
            href="/client/new-request?type=Market%20Analysis%20(CMA)"
          />
        </div>
      </section>

      {/* Main Content Two-Column Layout */}
      <section className="px-8 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Quick Access Sidebar */}
          <div className="w-full lg:w-1/3 xl:w-1/4 flex-shrink-0">
            <h2 className="text-foreground font-bold text-[17px] mb-4">Quick Access</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              {quickAccessLinks.map((link, idx) => (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className={`flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors group ₹{
                    idx !== quickAccessLinks.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 text-foreground font-semibold text-[13px]">
                    <span className="text-gray-500 group-hover:text-gray-900 transition-colors">
                      <link.icon />
                    </span>
                    {link.name}
                  </div>
                  <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Requests */}
          <div className="flex-1 w-full">
            <h2 className="text-foreground font-bold text-[17px] mb-4">Recent Requests</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[140px] flex items-center justify-center">
              <p className="text-sm font-medium text-gray-500 text-center">
                No requests yet. Start by booking a service above!
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

function ActionCard({ title, icon, href }: { title: string; icon: React.ReactNode; href: string }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-primary border border-primary/40 rounded-[1.25rem] p-6 shadow-xl shadow-black/5 hover:bg-primary/90 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col items-center justify-center gap-3 h-[110px]">
        <div className="text-white/80 group-hover:text-white transition-colors">
          {icon}
        </div>
        <span className="text-white font-bold text-[13px] tracking-wide whitespace-nowrap">
          {title}
        </span>
      </div>
    </Link>
  );
}

// Icons matching the screenshot
const EyeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);
const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
);
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
);
const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
);
const BriefcaseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
