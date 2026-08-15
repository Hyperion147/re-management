'use client';

import React from 'react';

export default function AvailabilityPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-[#1c352d] pt-16 pb-32 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-[2.75rem] font-bold text-white tracking-tight mb-2">
            Availability
          </h1>
          <p className="text-gray-300 text-lg">
            Manage when you're available to take on new showings and tasks.
          </p>
        </div>
      </section>

      <section className="px-8 -mt-14 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a2a2a] mb-2">Availability Settings</h3>
            <p className="text-gray-500 text-center max-w-md">
              Set your default working hours and block off time when you're unavailable.
              (Coming soon)
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
