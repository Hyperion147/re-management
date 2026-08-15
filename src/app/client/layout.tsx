'use client';

import { ReactNode } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import DashboardNavbar from '@/components/DashboardNavbar';
import DashboardFooter from '@/components/DashboardFooter';

export default function ClientLayout({
  children,
}: {
  children: ReactNode;
}) {
  usePushNotifications();

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      <DashboardNavbar />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col relative w-full overflow-x-hidden">
        {children}
      </main>

      <DashboardFooter />
    </div>
  );
}
