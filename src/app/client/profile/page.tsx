'use client';

import React from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import PaymentsSection from '@/components/PaymentsSection';

export default function ProfilePage() {
  const { user, loading } = useCurrentUser();

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
          user?.role === 'SUPERADMIN' ? 'bg-purple-100 text-purple-700' :
          user?.role === 'ADMIN' ? 'bg-orange-100 text-orange-600' :
          'bg-blue-100 text-blue-600'
        }`}>
          {user?.role ?? '...'}
        </span>
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-[#1a2a2a] tracking-tight">My Profile</h2>
          <p className="text-gray-400 font-medium text-sm">
            Update your name, job title, or password. Changes are saved immediately.
          </p>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50/50 space-y-10">
        {/* Identity Section */}
        <div className="space-y-6">
          <SectionHeader label="Identity" />
          <div className="space-y-5">
            <ProfileInput
              label="Full Name"
              value={loading ? '' : (user?.fullName ?? '')}
              placeholder={loading ? 'Loading...' : 'Your full name'}
            />
            <div className="space-y-2">
              <ProfileInput
                label="Email Address"
                value={loading ? '' : (user?.email ?? '')}
                placeholder={loading ? 'Loading...' : 'your@email.com'}
                disabled
              />
              <p className="text-[11px] text-gray-400 font-medium px-1">
                Email cannot be changed here. Contact an admin if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Job Title Section */}
        <div className="space-y-6 pt-4 border-t border-gray-50">
          <SectionHeader label="Job Title" />
          <div className="flex items-center gap-4">
            <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="bg-green-50/50 border border-green-100 text-green-700 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {user?.role === 'SUPERADMIN' || user?.role === 'ADMIN' ? 'Administrator' : 'Agent'}
            </div>
            <button className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-6 pt-4 border-t border-gray-50">
          <SectionHeader label="Security" />
          <button className="flex items-center gap-3 text-sm font-bold text-[#1a2a2a] hover:text-orange-600 transition-colors group">
            <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            Change password (optional)
          </button>
        </div>

        {/* Payments Section */}
        {!loading && user && (
          <div id="payments" className="scroll-mt-8">
            <PaymentsSection userId={user.id} />
          </div>
        )}
      </div>

      {/* Help Text */}
      <p className="text-center text-xs font-medium text-gray-400">
        Need to change your email or have account issues?{' '}
        <a href="#" className="text-green-700 underline decoration-green-200 underline-offset-4 hover:decoration-green-700 transition-all">
          Contact support
        </a>.
      </p>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
      {label}
    </h3>
  );
}

function ProfileInput({ label, value, placeholder, disabled }: {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-700 tracking-tight px-1">
        {label}
      </label>
      <input
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-5 py-4 rounded-2xl border transition-all text-sm font-medium ${
          disabled
            ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white border-gray-100 text-[#1a2a2a] focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500'
        }`}
      />
    </div>
  );
}
