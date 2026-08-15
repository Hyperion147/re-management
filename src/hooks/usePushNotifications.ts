'use client';

import { useEffect, useRef } from 'react';
import { ensurePushNotificationsRegistered } from '@/lib/pushNotifications';

export function usePushNotifications() {
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current || typeof window === 'undefined') return;

    attempted.current = true;
    void ensurePushNotificationsRegistered();
  }, []);
}
