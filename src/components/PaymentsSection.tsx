'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

interface PaymentMethod {
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface ConnectStatus {
  status: 'not_connected' | 'pending' | 'active';
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  status: string;
  createdAt: string;
  fromUserId: string | null;
  toUserId: string | null;
}

export default function PaymentsSection({ userId }: { userId: string }) {
  const [savedCard, setSavedCard] = useState<PaymentMethod | null>(null);
  const [connectStatus, setConnectStatus] = useState<ConnectStatus>({ status: 'not_connected' });
  const [connectLoading, setConnectLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [ready, setReady] = useState(false);

  const fetchConnectStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/payments/connect');
      setConnectStatus(data);
    } catch {
      setConnectStatus({ status: 'not_connected' });
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await api.get('/payments/history');
      setTransactions(data);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('connect') === 'success') {
      toast.success('Payout account connected!');
      window.history.replaceState({}, '', window.location.pathname);
    }
    Promise.all([fetchConnectStatus(), fetchHistory()]).finally(() => setReady(true));
  }, [fetchConnectStatus, fetchHistory]);

  const handleConnectOnboard = async () => {
    setConnectLoading(true);
    try {
      const { data } = await api.post('/payments/connect');
      window.location.href = data.url;
    } catch {
      toast.error('Could not start payout setup. Try again.');
      setConnectLoading(false);
    }
  };

  const handleAddCard = async () => {
    const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!stripeKey || stripeKey.includes('REPLACE_ME')) {
      toast.error('Stripe is not configured yet. Add your publishable key to .env.local.');
      return;
    }

    try {
      const { data } = await api.post('/payments/setup-intent');
      const { loadStripe } = await import('@stripe/stripe-js');
      const stripe = await loadStripe(stripeKey);
      if (!stripe) { toast.error('Stripe failed to load.'); return; }

      // Open Stripe hosted setup flow
      toast.info('Stripe setup intent created. Integrate Stripe Elements to collect card details.');
    } catch {
      toast.error('Could not start card setup. Try again.');
    }
  };

  if (!ready) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-1/3" />
        <div className="h-12 bg-gray-50 rounded-2xl" />
        <div className="h-4 bg-gray-100 rounded w-1/3 mt-6" />
        <div className="h-12 bg-gray-50 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl">

      {/* ── Payment Method ── */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Payment Method</h3>
          <p className="text-xs text-gray-400 mt-1">Used to escrow funds when booking a service</p>
        </div>

        {savedCard ? (
          <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-[#1a2a2a] rounded-md flex items-center justify-center">
                <span className="text-white text-[9px] font-black uppercase">{savedCard.brand.slice(0, 4)}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">•••• •••• •••• {savedCard.last4}</p>
                <p className="text-xs text-gray-400 font-medium">
                  Expires {savedCard.expMonth}/{savedCard.expYear}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSavedCard(null)}
              className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Replace
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddCard}
            className="flex items-center gap-3 w-full p-4 rounded-2xl border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group text-left"
          >
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Add a card</p>
              <p className="text-xs text-gray-400 font-medium">Visa, Mastercard, Amex accepted</p>
            </div>
          </button>
        )}
      </div>

      {/* ── Payout Account ── */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Payout Account</h3>
          <p className="text-xs text-gray-400 mt-1">Bank account for receiving payment after job approval</p>
        </div>

        {connectStatus.status === 'active' ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl border border-green-100 bg-green-50">
            <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-green-800">Payout account active</p>
              <p className="text-xs text-green-600 font-medium">Payments transfer automatically after admin approval.</p>
            </div>
          </div>
        ) : connectStatus.status === 'pending' ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 rounded-2xl border border-orange-100 bg-orange-50">
              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-orange-800">Verification in progress</p>
                <p className="text-xs text-orange-600 font-medium">Complete the setup to enable payouts.</p>
              </div>
            </div>
            <button
              onClick={handleConnectOnboard}
              disabled={connectLoading}
              className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors disabled:opacity-50"
            >
              {connectLoading ? 'Redirecting…' : 'Continue setup →'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnectOnboard}
            disabled={connectLoading}
            className="flex items-center gap-3 w-full p-4 rounded-2xl border border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group text-left disabled:opacity-50"
          >
            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {connectLoading ? 'Redirecting to Stripe…' : 'Connect bank account'}
              </p>
              <p className="text-xs text-gray-400 font-medium">Enter your banking details to receive payouts</p>
            </div>
          </button>
        )}
      </div>

      {/* ── Transaction History ── */}
      <div className="space-y-4 pt-6 border-t border-gray-100">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Transaction History</h3>

        {txLoading ? (
          <div className="space-y-2">
            {[1, 2].map(i => <div key={i} className="h-14 bg-gray-50 rounded-2xl animate-pulse" />)}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50">
            <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm text-gray-400 font-medium">No transactions yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((tx) => {
              const isIncoming = tx.toUserId === userId;
              return (
                <div key={tx.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ₹{
                      tx.type === 'ESCROW' ? 'bg-blue-50 text-blue-500' :
                      tx.type === 'RELEASE' ? 'bg-green-50 text-green-600' :
                      'bg-red-50 text-red-500'
                    }`}>
                      {tx.type === 'ESCROW' ? '↑' : tx.type === 'RELEASE' ? '↓' : '↩'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        {tx.type === 'ESCROW' ? 'Payment Held' : tx.type === 'RELEASE' ? 'Payment Released' : 'Refund'}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-black ₹{isIncoming ? 'text-green-600' : 'text-foreground'}`}>
                      {isIncoming ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                    </p>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ₹{
                      tx.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
