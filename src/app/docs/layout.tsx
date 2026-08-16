import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F7F5] font-sans text-[#000101]">
      <Navbar />
      
      {/* Header Spacer for Sticky Navbar */}
      <div className="h-24"></div>

      <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#000101]/5 sticky top-32">
            <p className="text-[10px] font-black text-[#013D1F]/50 uppercase tracking-[0.2em] mb-6">Documentation</p>
            <nav className="space-y-2">
              <DocsSidebarLink href="/docs" label="Overview" />
              <DocsSidebarLink href="/docs/getting-started" label="Getting Started" />
              <DocsSidebarLink href="/docs/showing-agents" label="For Showing Agents" />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-3xl p-10 lg:p-16 shadow-lg border border-[#000101]/5 min-h-[800px]">
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}

function DocsSidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href} 
      className="block px-4 py-3 rounded-xl text-[13px] font-bold text-[#013D1F]/60 hover:bg-[#39FF14]/10 hover:text-[#087A32] transition-all"
    >
      {label}
    </a>
  );
}
