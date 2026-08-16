import React from 'react';
import Navbar from '@/components/Navbar';

export default function NoAccessPage() {
  return (
    <div className="min-h-screen bg-muted font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 text-center space-y-8">
          <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto text-orange-500 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Access Denied</h1>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              The Admin Control Panel is restricted to authorized personnel only. You need administrative privileges to access this area.
            </p>
          </div>
          
          <div className="pt-4 space-y-4">
            <a 
              href="/client" 
              className="block w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-green-900/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Back to Client Dashboard
            </a>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Contact system admin to request access
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
