import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafb] font-sans text-[#1a2a2a]">
      <Navbar />
      
      {/* Header Spacer for Sticky Navbar */}
      <div className="h-24 bg-[#112424]"></div>

      <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col lg:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-50/50 sticky top-32">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Documentation</p>
            <nav className="space-y-2">
              <DocsSidebarLink href="/docs" label="Overview" />
              <DocsSidebarLink href="/docs/getting-started" label="Getting Started" />
              <DocsSidebarLink href="/docs/showing-agents" label="For Showing Agents" />
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white rounded-[2.5rem] p-10 lg:p-16 shadow-sm border border-gray-50/50 min-h-[800px]">
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
      className="block px-4 py-3 rounded-xl text-[13px] font-bold text-gray-500 hover:bg-[#f0f9f9] hover:text-[#416450] transition-all"
    >
      {label}
    </a>
  );
}
