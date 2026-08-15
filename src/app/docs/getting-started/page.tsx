import React from 'react';

export default function GettingStartedDocs() {
  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        <a href="/" className="hover:text-green-600">Home</a>
        <span>/</span>
        <a href="/docs" className="hover:text-green-600">Docs</a>
        <span>/</span>
        <span className="text-gray-900">Getting Started</span>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1a2a2a] tracking-tight">Getting Started</h1>
        <p className="text-lg text-gray-400 font-medium leading-relaxed">
          Set up your account and book your first showing in under five minutes.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">Account setup</h2>
        <div className="space-y-8">
          <DocsStepLarge 
            num={1} 
            title="Create an account" 
            desc={<><a href="/client/new-request" className="text-green-700 underline underline-offset-4 decoration-green-100 font-bold">Sign up</a> with your work email and choose a password (8+ characters). It's free — no credit card required.</>} 
          />
          <DocsStepLarge 
            num={2} 
            title="Complete your profile" 
            desc="Add your name, job title, and contact info so agents know who they're working with." 
          />
          <DocsStepLarge 
            num={3} 
            title="Book a service" 
            desc={<>From your <a href="/client" className="text-green-700 underline underline-offset-4 decoration-green-100 font-bold">dashboard</a>, choose a service type, enter the property address, and set your agent fee.</>} 
          />
          <DocsStepLarge 
            num={4} 
            title="Get matched" 
            desc="Licensed local agents are notified instantly. Most requests are accepted within 3 minutes." 
          />
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">Tips for best results</h2>
        <ul className="space-y-4 list-disc pl-5 text-gray-500 font-medium text-sm">
          <li>For same-day showings, submit your request at least 3 hours in advance.</li>
          <li>Provide clear access instructions — lockbox code, parking, entry notes.</li>
          <li>Ask agents to collect lead info and interest level during open houses.</li>
          <li>Review the post-visit summary within 24 hours for best follow-up timing.</li>
        </ul>
      </div>

      {/* Warning Box */}
      <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex gap-4 items-start">
        <span className="text-xl">📋</span>
        <p className="text-sm text-orange-800 font-medium leading-relaxed">
          Your account starts as a standard <span className="font-bold">user</span> role. Contact your team admin if you need elevated permissions for the dashboard or admin panel.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">Pricing</h2>
        <p className="text-gray-500 font-medium leading-relaxed text-sm">
          Veyro is pay-per-showing with no monthly fees or contracts. You set the agent fee when booking. Agents can accept at your rate or counter-propose a different amount.
        </p>
        <ul className="space-y-4 text-gray-500 font-medium text-sm">
          <li>• Showings: $35–$150</li>
          <li>• Open Houses: $75–$300</li>
          <li>• Lockbox Drop: $28–$60</li>
          <li>• Photography: $50–$200</li>
          <li>• Property Report: $40–$120</li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#1a2a2a]">Common questions</h3>
        <p className="text-sm text-gray-500 font-medium">
          See the site <a href="/#faq" className="text-green-700 underline underline-offset-4 decoration-green-100 font-bold">FAQ</a> for quick answers about coverage, agents, and payment.
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-12 border-t border-gray-50 flex justify-between items-center">
        <a href="/docs" className="group flex items-center gap-6 p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:-translate-x-1 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Previous</span>
            <span className="text-sm font-bold text-[#1a2a2a]">Overview</span>
          </div>
        </a>

        <a href="/docs/showing-agents" className="group flex items-center gap-6 p-6 rounded-2xl border border-gray-100 hover:border-green-100 hover:bg-[#f0f9f9]/50 transition-all">
          <div className="text-right">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Next</span>
            <span className="text-sm font-bold text-[#1a2a2a]">For Showing Agents</span>
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

function DocsStepLarge({ num, title, desc }: { num: number; title: string; desc: React.ReactNode }) {
  return (
    <div className="flex gap-6 items-start pb-8 border-b border-gray-50 last:border-0 last:pb-0">
      <div className="w-10 h-10 rounded-xl bg-[#112424] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-black/5">
        {num}
      </div>
      <div className="space-y-2">
        <h4 className="font-bold text-[#1a2a2a] text-base">{title}</h4>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
