import React from 'react';

export default function DocsOverview() {
  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        <a href="/" className="hover:text-green-600">Home</a>
        <span>/</span>
        <a href="/docs" className="hover:text-green-600">Docs</a>
        <span>/</span>
        <span className="text-gray-900">Overview</span>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1a2a2a] tracking-tight">Veyro Documentation</h1>
        <p className="text-lg text-gray-400 font-medium leading-relaxed">
          Everything you need to schedule showings, manage open houses, and review post-visit reports.
        </p>
      </div>

      {/* Tip Box */}
      <div className="bg-[#f0f9f9] border border-green-100 p-6 rounded-2xl flex gap-4 items-start">
        <span className="text-xl">💡</span>
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          New here? Start with <a href="/docs/getting-started" className="text-green-700 underline underline-offset-4 decoration-green-200 hover:decoration-green-500 font-bold">Getting Started</a> to set up your account in minutes.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">Who these docs are for</h2>
        <p className="text-gray-500 font-medium leading-relaxed">
          Veyro serves property professionals across every role in the rental and sales workflow:
        </p>
        <ul className="space-y-4 list-disc pl-5 text-gray-500 font-medium text-sm">
          <li><span className="font-bold text-[#1a2a2a]">Property Managers & Landlords</span> — schedule showings and open houses, reduce time-to-rent.</li>
          <li><span className="font-bold text-[#1a2a2a]">Realtors & Leasing Teams</span> — delegate tours while staying focused on high-value work.</li>
          <li><span className="font-bold text-[#1a2a2a]">Showing Agents</span> — accept assignments, conduct tours, and submit summaries.</li>
        </ul>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">What's in these docs</h2>
        <ul className="space-y-4 text-gray-500 font-medium text-sm">
          <li>
            <a href="/docs/getting-started" className="text-green-700 font-bold hover:underline">Getting Started</a> — create your account, complete your profile, book your first service.
          </li>
          <li>
            <a href="/docs/showing-agents" className="text-green-700 font-bold hover:underline">For Showing Agents</a> — licensing requirements, visit summaries, and payment info.
          </li>
        </ul>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">Next steps</h2>
        <div className="space-y-6">
          <DocsStep num={1} text={<>Read <a href="/docs/getting-started" className="text-green-700 underline underline-offset-4 decoration-green-100 font-bold">Getting Started</a> to set up your account.</>} />
          <DocsStep num={2} text="Invite teammates and define their roles in the dashboard." />
          <DocsStep num={3} text={<>Book your first showing or open house from the <a href="/client" className="text-green-700 underline underline-offset-4 decoration-green-100 font-bold">Dashboard</a>.</>} />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-12 border-t border-gray-50 flex justify-end">
        <a href="/docs/getting-started" className="group flex items-center gap-6 p-6 rounded-2xl border border-gray-100 hover:border-green-100 hover:bg-[#f0f9f9]/50 transition-all">
          <div className="text-right">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Next</span>
            <span className="text-sm font-bold text-[#1a2a2a]">Getting Started</span>
          </div>
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600 group-hover:translate-x-1 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      </div>
    </div>
  );
}

function DocsStep({ num, text }: { num: number; text: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-[#112424] text-white flex items-center justify-center font-bold text-xs shrink-0">
        {num}
      </div>
      <p className="text-sm text-gray-500 font-medium">{text}</p>
    </div>
  );
}
