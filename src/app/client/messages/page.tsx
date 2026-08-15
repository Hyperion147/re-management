'use client';

import React from 'react';

export default function MessagesPage() {
  return (
    <div className="flex flex-col w-full pb-20">
      <section className="bg-[#1c352d] pt-16 pb-32 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-[2.75rem] font-bold text-white tracking-tight mb-2">
            Messages
          </h1>
          <p className="text-gray-300 text-lg">
            Communicate with your agents and clients.
          </p>
        </div>
      </section>

      <section className="px-8 -mt-14 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1a2a2a] mb-2">No Messages Yet</h3>
            <p className="text-gray-500 text-center max-w-md">
              When you have active requests or jobs, you'll be able to chat with other users here.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
