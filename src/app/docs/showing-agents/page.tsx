import React from 'react';

export default function ShowingAgentsDocs() {
  return (
    <div className="space-y-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
        <a href="/" className="hover:text-green-600">Home</a>
        <span>/</span>
        <a href="/docs" className="hover:text-green-600">Docs</a>
        <span>/</span>
        <span className="text-gray-900">For Showing Agents</span>
      </div>

      <div className="space-y-4">
        <h1 className="text-4xl lg:text-5xl font-bold text-[#1a2a2a] tracking-tight">For Showing Agents</h1>
        <p className="text-lg text-gray-400 font-medium leading-relaxed">
          Requirements, conduct guidelines, visit summaries, and payment information for Veyro agents.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">Requirements</h2>
        <ul className="space-y-4 list-disc pl-5 text-gray-500 font-medium text-sm">
          <li>Active real estate license in your state (must be in good standing)</li>
          <li>Government-issued photo ID for identity verification</li>
          <li>Professional attire — business casual minimum</li>
          <li>Reliable transportation and punctuality (arrive 5 min early)</li>
          <li>Smartphone with camera for post-visit photos</li>
        </ul>
      </div>

      {/* Danger Box */}
      <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex gap-4 items-start">
        <span className="text-xl">⚠️</span>
        <p className="text-sm text-red-800 font-medium leading-relaxed">
          Agents with expired or suspended licenses are removed from the platform immediately. Keep your license status current in your profile.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">During a Visit</h2>
        <ul className="space-y-4 list-disc pl-5 text-gray-500 font-medium text-sm">
          <li>Greet visitors professionally and introduce yourself as a Veyro agent.</li>
          <li>Follow all access instructions provided in the assignment (lockbox code, parking, etc.).</li>
          <li>Do not share your personal contact details with visitors — all follow-ups go through the platform.</li>
          <li>Collect visitor names and contact info if requested by the property manager.</li>
          <li>Note any property issues, damage, or safety concerns in your summary.</li>
        </ul>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">After-Visit Summary</h2>
        <p className="text-sm text-gray-500 font-medium italic">Submit your summary within 2 hours of the visit ending. Include:</p>
        <div className="space-y-8">
          <DocsStepLarge 
            num={1} 
            title="Visitor count" 
            desc="Total number of people who toured the property." 
          />
          <DocsStepLarge 
            num={2} 
            title="Interest level" 
            desc="Overall impression — High, Medium, or Low interest from visitors." 
          />
          <DocsStepLarge 
            num={3} 
            title="Photos" 
            desc="At least 2 photos confirming your presence and property condition." 
          />
          <DocsStepLarge 
            num={4} 
            title="Issues observed" 
            desc="Any maintenance issues, damage, or safety concerns you noticed." 
          />
          <DocsStepLarge 
            num={5} 
            title="Follow-up notes" 
            desc="Any questions or requests visitors made that need the owner's attention." 
          />
        </div>
      </div>

      {/* Tip Box */}
      <div className="bg-[#f0f9f9] border border-green-100 p-6 rounded-2xl flex gap-4 items-start">
        <span className="text-xl">💡</span>
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          Summaries submitted late (2+ hours after the visit) may delay your payment. Set a reminder before starting each visit.
        </p>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-[#1a2a2a]">Payment</h2>
        <p className="text-gray-500 font-medium leading-relaxed text-sm">
          Payments are processed after the visit summary is reviewed and approved by the property manager — typically within <span className="font-bold text-[#1a2a2a]">1–2 business days</span> via direct deposit.
        </p>
        <ul className="space-y-4 text-gray-500 font-medium text-sm">
          <li>• Showing: $35–$150 (set by the requester, negotiable via counter-offer)</li>
          <li>• Open House: $75–$300</li>
          <li>• Lockbox Drop: $28–$60</li>
          <li>• Photography: $50–$200</li>
          <li>• Property Report: $40–$120</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="pt-12 border-t border-gray-50 flex justify-start items-center">
        <a href="/docs/getting-started" className="group flex items-center gap-6 p-6 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 group-hover:-translate-x-1 transition-transform">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Previous</span>
            <span className="text-sm font-bold text-[#1a2a2a]">Getting Started</span>
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
