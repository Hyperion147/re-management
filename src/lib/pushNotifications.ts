'use client';

import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';
import { supabase } from '@/lib/supabase';
import api from '@/lib/axios';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

let registrationPromise: Promise<boolean> | null = null;
let foregroundListenerBound = false;

function bindForegroundListener() {
  if (foregroundListenerBound || !messaging) return;

  onMessage(messaging, (payload) => {
    console.log('[FCM] Foreground message received:', payload);
    const title = payload.notification?.title || 'New job available';
    const body = payload.notification?.body || 'A new showing request is available.';

    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/next.svg',
      });

      notification.onclick = () => {
        window.focus();
        window.location.href = '/client/opportunities';
      };
    }
  });

  foregroundListenerBound = true;
}

export async function ensurePushNotificationsRegistered() {
  if (typeof window === 'undefined') return false;
  if (registrationPromise) return registrationPromise;

  registrationPromise = (async () => {
    if (!VAPID_KEY) {
      console.warn('[FCM] NEXT_PUBLIC_FIREBASE_VAPID_KEY is not set.');
      return false;
    }

    if (!messaging) {
      console.warn('[FCM] Firebase messaging is not initialized.');
      return false;
    }

    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('[FCM] This browser does not support web push notifications.');
      return false;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.debug('[FCM] User not authenticated. Skipping registration.');
      return false;
    }

    if (Notification.permission === 'denied') {
      console.info('[FCM] Notification permission was previously denied.');
      return false;
    }

    const permission = Notification.permission === 'granted'
      ? 'granted'
      : await Notification.requestPermission();

    if (permission !== 'granted') {
      console.info('[FCM] User did not grant notification permission.');
      return false;
    }

    await navigator.serviceWorker.register('/api/firebase-sw', { scope: '/' });
    const serviceWorkerRegistration = await navigator.serviceWorker.ready;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration,
    });

    if (!token) {
      console.warn('[FCM] Firebase returned an empty token.');
      return false;
    }

    await api.patch(`/users/${user.id}`, { fcmToken: token });
    bindForegroundListener();

    console.info('[FCM] Push notifications registered successfully.');
    return true;
  })().catch((error) => {
    registrationPromise = null;
    console.error('[FCM] Failed to register push notifications:', error);
    return false;
  });

  return registrationPromise;
}
