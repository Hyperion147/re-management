'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import api from '@/lib/axios';

export interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  totalEarned?: string | null;
}

const CACHE_KEY = 'veyro_current_user';

function readCache(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(user: CurrentUser) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(user));
  } catch {}
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(() => {
    // Serve cached data instantly on first render (no loading flash)
    if (typeof window !== 'undefined') return readCache();
    return null;
  });
  const [loading, setLoading] = useState(!readCache());

  useEffect(() => {
    const fetch = async () => {
      try {
        // getSession reads from local storage — no network call
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          localStorage.removeItem(CACHE_KEY);
          setUser(null);
          return;
        }

        const response = await api.get('/users/me');
        const match = response.data;
        if (match) {
          const profile: CurrentUser = {
            id: match.id,
            fullName: match.fullName ?? match.full_name ?? session.user.email ?? '',
            email: match.email ?? session.user.email ?? '',
            role: match.role ?? 'USER',
            totalEarned: match.totalEarned ?? match.total_earned ?? '0',
          };
          setUser(profile);
          writeCache(profile);
        }
      } catch {
        // keep showing cached data if fetch fails
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const initial = user?.fullName?.charAt(0).toUpperCase() ?? '?';

  return { user, loading, initial };
}
