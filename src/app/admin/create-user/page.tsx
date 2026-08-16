'use client';

import React, { useEffect } from 'react';
import { useAdminRole } from '@/hooks/useData';

export default function CreateUserPage() {
  const { isSuperAdmin, loading } = useAdminRole();

  // ADMIN cannot access this page — only SUPERADMIN can create users
  useEffect(() => {
    if (!loading && !isSuperAdmin) {
      window.location.href = '/no-access';
    }
  }, [isSuperAdmin, loading]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 shadow-sm border border-purple-100/50">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Create User</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest border ₹{
            isSuperAdmin
              ? 'bg-purple-100 text-purple-700 border-purple-200/50'
              : 'bg-orange-100 text-orange-600 border-orange-200/50'
          }`}>
            {isSuperAdmin ? 'Superadmin' : 'Admin'}
          </span>
          <button className="bg-white hover:bg-gray-50 text-gray-600 border border-gray-100 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95">
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md">
        <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50/50 space-y-8">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-foreground">Create New User</h3>
            {!isSuperAdmin && !loading && (
              <p className="text-xs text-gray-400 font-medium">
                As an Admin, you can create Users and Admins. Only a Superadmin can create Superadmin accounts.
              </p>
            )}
          </div>

          <div className="space-y-5">
            <FormInput label="Full Name" placeholder="Jane Smith" required />
            <FormInput label="Email Address" placeholder="jane@example.com" required type="email" />
            <FormInput label="Password" placeholder="••••••••" required type="password" hint="(min 8 chars)" />

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 tracking-tight px-1 uppercase tracking-widest">
                Access Role
              </label>
              <div className="relative">
                <select className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm font-medium appearance-none focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-500 transition-all">
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  {/* SUPERADMIN cannot be created via the UI — must be set directly in the DB */}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-medium px-1 flex items-center gap-1">
                <svg className="w-3 h-3 text-orange-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Superadmin accounts are created directly in the database.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 tracking-tight px-1 uppercase tracking-widest">
                Job Title <span className="text-gray-400 font-medium lowercase">(optional)</span>
              </label>
              <div className="relative">
                <select className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm font-medium appearance-none focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-500 transition-all">
                  <option>— None —</option>
                  <option>Property Manager</option>
                  <option>Real Estate Agent</option>
                  <option>Broker</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-green-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormInput({ label, placeholder, required, type = 'text', hint }: { label: string; placeholder: string; required?: boolean; type?: string; hint?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-700 tracking-tight px-1 uppercase tracking-widest">
        {label} {required && <span className="text-red-500">*</span>}{' '}
        {hint && <span className="text-gray-400 font-medium lowercase italic text-[10px]">{hint}</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-500 transition-all"
      />
    </div>
  );
}
