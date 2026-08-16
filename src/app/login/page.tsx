'use client';

import React, { useState } from 'react';
import { getAuthCallbackUrl } from '@/lib/authRedirect';
import { ensurePushNotificationsRegistered } from '@/lib/pushNotifications';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      await ensurePushNotificationsRegistered();
      window.location.href = '/client';
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: getAuthCallbackUrl() },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Column */}
      <div className="hidden lg:flex w-1/2 bg-primary p-24 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="relative z-10 space-y-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-900/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Veyro</span>
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">Welcome back to Veyro</h1>
            <p className="text-lg text-white/60 font-medium leading-relaxed max-w-md">
              Access your dashboard to manage showings, review reports, and grow your real estate business.
            </p>
          </div>
          <ul className="space-y-6">
            <FeatureItem text="Self-serve showing scheduling, 24/7" />
            <FeatureItem text="Verified, licensed showing agents" />
            <FeatureItem text="Live updates and post-visit reports" />
            <FeatureItem text="Counter-offer negotiation built in" />
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex-1 bg-muted flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[2.5rem] p-10 lg:p-12 shadow-sm border border-gray-50/50 space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-foreground tracking-tight">Sign In</h2>
              <p className="text-sm text-gray-400 font-medium">Welcome back. Enter your credentials to continue.</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-xs text-red-600 font-bold">
                {error}
              </div>
            )}

            {/* Google OAuth */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading || loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-foreground border border-gray-200 py-4 rounded-2xl text-sm font-bold shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {googleLoading ? (
                <svg className="w-5 h-5 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : (
                <GoogleIcon />
              )}
              {googleLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Email / Password */}
            <form action={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-widest px-1">Email address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@work.com"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white text-foreground text-sm font-medium focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-500 transition-all shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[11px] font-bold text-green-700 hover:underline">Forgot password?</a>
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-white text-foreground text-sm font-medium focus:outline-none focus:ring-4 focus:ring-green-500/5 focus:border-green-500 transition-all shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-2xl text-sm font-bold shadow-xl shadow-green-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center">
              <p className="text-xs text-gray-400 font-medium">
                Don&apos;t have an account?{' '}
                <a href="/signup" className="text-green-700 font-bold hover:underline">Create one free</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-4 group">
      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-sm text-white/80 font-medium tracking-wide group-hover:text-white transition-colors">{text}</span>
    </li>
  );
}
