'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useNewRequest, type ServiceType } from '@/hooks/useNewRequest';
import {
  X, MapPin, Calendar, Clock, FileText, IndianRupee,
  ChevronDown, Home, CheckCircle2, ArrowRight
} from 'lucide-react';

type ServiceRequestModalProps = {
  isOpen: boolean;
  serviceType: ServiceType;
  minimumCompensation: number;
  onClose: () => void;
};

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa',
  'Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
  'Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
  'Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Puducherry','Chandigarh',
  'Jammu and Kashmir','Ladakh',
];

type FormState = {
  streetAddress: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
  mlsNumber: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  customAmount: string;
  allowCounterOffer: boolean;
};

const INITIAL_FORM: FormState = {
  streetAddress: '', unit: '', city: '', state: '', zip: '',
  mlsNumber: '', preferredDate: '', preferredTime: '',
  notes: '', customAmount: '', allowCounterOffer: false,
};

function buildQuickAmounts(min: number) {
  return [min, min + 500, min + 1000, min + 2000, min + 3500];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function inputCls(error?: string) {
  return [
    'w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-[#000101]',
    'placeholder:text-[#013D1F]/30 outline-none transition-all',
    'focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/20',
    error ? 'border-red-400 bg-red-50/30' : 'border-[#000101]/10 hover:border-[#000101]/20',
  ].filter(Boolean).join(' ');
}

function selectCls(error?: string) {
  return inputCls(error) + ' appearance-none pr-10 cursor-pointer';
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg bg-[#39FF14]/10 flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-[#087A32]" strokeWidth={2.5} />
      </div>
      <h3 className="text-sm font-black text-[#000101] uppercase tracking-wide">{title}</h3>
    </div>
  );
}

function FieldLabel({ children, required, error }: { children: React.ReactNode; required?: boolean; error?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-bold text-[#013D1F]/70 uppercase tracking-wide">
        {children}{required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {error && <span className="block text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServiceRequestModal({
  isOpen, serviceType, minimumCompensation, onClose,
}: ServiceRequestModalProps) {
  const { submitRequest, loading, error } = useNewRequest();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [selectedAmount, setSelectedAmount] = useState<number>(minimumCompensation);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const quickAmounts = useMemo(() => buildQuickAmounts(minimumCompensation), [minimumCompensation]);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [isOpen, onClose]);

  const finalAmount = useMemo(() => {
    const parsed = Number(form.customAmount);
    return Number.isFinite(parsed) && parsed >= minimumCompensation ? parsed : selectedAmount;
  }, [form.customAmount, minimumCompensation, selectedAmount]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(f => ({ ...f, [key]: value }));
    setFieldErrors(e => { const n = { ...e }; delete n[key]; return n; });
  };

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.streetAddress.trim()) errs.streetAddress = 'Required';
    if (!form.city.trim()) errs.city = 'Required';
    if (!form.state) errs.state = 'Required';
    if (!form.zip.trim()) errs.zip = 'Required';
    else if (form.zip.trim().length !== 6) errs.zip = 'Must be 6 digits';
    if (!form.preferredDate) errs.preferredDate = 'Required';
    if (!form.preferredTime) errs.preferredTime = 'Required';
    if (form.customAmount && finalAmount < minimumCompensation)
      errs.customAmount = `Minimum is ₹${minimumCompensation.toLocaleString('en-IN')}`;
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    const [h, m] = form.preferredTime.split(':');
    const end = new Date();
    end.setHours(Number(h) + 1, Number(m), 0, 0);
    const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

    const combinedNotes = [
      form.notes.trim(),
      form.allowCounterOffer ? 'Counter offers allowed before acceptance.' : '',
    ].filter(Boolean).join('\n\n');

    try {
      await submitRequest(serviceType, finalAmount, {
        address: form.unit.trim()
          ? `${form.streetAddress.trim()}, Unit ${form.unit.trim()}`
          : form.streetAddress.trim(),
        city: form.city.trim(),
        state: form.state,
        zip: form.zip.trim(),
        mlsNumber: form.mlsNumber.trim(),
        clientName: '', clientPhone: '', accessNotes: '', lockboxCode: '',
        additionalNotes: combinedNotes,
        date: form.preferredDate,
        startTime: form.preferredTime,
        endTime,
      });
      setSubmitted(true);
    } catch {
      // error surfaced by hook
    }
  };

  if (!isOpen) return null;

  // ── Success state ──
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-12 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#39FF14] to-[#087A32] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-[#000101] mb-3">Request Submitted!</h2>
          <p className="text-[#013D1F]/60 text-sm font-medium mb-8 leading-relaxed">
            Your <strong className="text-[#000101]">{serviceType}</strong> request is live.
            Verified agents in your area have been notified and will respond shortly.
          </p>
          <button
            onClick={() => { setSubmitted(false); onClose(); window.location.href = '/client/requests'; }}
            className="w-full py-4 bg-[#39FF14] hover:bg-[#087A32] text-[#000101] hover:text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            View My Requests <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => { setSubmitted(false); onClose(); }} className="mt-3 w-full py-3 text-sm font-semibold text-[#013D1F]/50 hover:text-[#013D1F] transition-colors">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#F5F7F5] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-8 py-6 bg-white border-b border-[#000101]/8 shrink-0">
          <div>
            <p className="text-xs font-bold text-[#013D1F]/50 uppercase tracking-widest mb-1">New Booking</p>
            <h2 className="text-xl font-black text-[#000101] tracking-tight">{serviceType}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-xl bg-[#F5F7F5] hover:bg-[#000101]/10 flex items-center justify-center text-[#013D1F]/60 hover:text-[#000101] transition-all"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-8 py-6 space-y-8">

            {/* Property Address */}
            <div className="bg-white rounded-2xl p-6 border border-[#000101]/8 shadow-sm">
              <SectionHeader icon={Home} title="Property Address" />

              <div className="space-y-4">
                <div className="grid grid-cols-[1fr_140px] gap-3">
                  <div>
                    <FieldLabel required error={fieldErrors.streetAddress}>Street Address</FieldLabel>
                    <input
                      type="text"
                      value={form.streetAddress}
                      onChange={e => set('streetAddress', e.target.value)}
                      placeholder="123 MG Road"
                      className={inputCls(fieldErrors.streetAddress)}
                    />
                  </div>
                  <div>
                    <FieldLabel>Unit / Flat</FieldLabel>
                    <input
                      type="text"
                      value={form.unit}
                      onChange={e => set('unit', e.target.value)}
                      placeholder="Flat 4B"
                      className={inputCls()}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <FieldLabel required error={fieldErrors.city}>City</FieldLabel>
                    <input
                      type="text"
                      value={form.city}
                      onChange={e => set('city', e.target.value)}
                      placeholder="Mumbai"
                      className={inputCls(fieldErrors.city)}
                    />
                  </div>
                  <div>
                    <FieldLabel required error={fieldErrors.state}>State</FieldLabel>
                    <div className="relative">
                      <select
                        value={form.state}
                        onChange={e => set('state', e.target.value)}
                        className={selectCls(fieldErrors.state)}
                      >
                        <option value="">Select state</option>
                        {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#013D1F]/40" strokeWidth={2} />
                    </div>
                  </div>
                  <div>
                    <FieldLabel required error={fieldErrors.zip}>PIN Code</FieldLabel>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={form.zip}
                      onChange={e => set('zip', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="400001"
                      className={inputCls(fieldErrors.zip)}
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>MLS / Property ID (optional)</FieldLabel>
                  <input
                    type="text"
                    value={form.mlsNumber}
                    onChange={e => set('mlsNumber', e.target.value)}
                    placeholder="e.g. MLS-1234567"
                    className={inputCls()}
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl p-6 border border-[#000101]/8 shadow-sm">
              <SectionHeader icon={Calendar} title="Schedule" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required error={fieldErrors.preferredDate}>Preferred Date</FieldLabel>
                  <input
                    type="date"
                    value={form.preferredDate}
                    onChange={e => set('preferredDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={inputCls(fieldErrors.preferredDate)}
                  />
                </div>
                <div>
                  <FieldLabel required error={fieldErrors.preferredTime}>Preferred Time</FieldLabel>
                  <div className="relative">
                    <input
                      type="time"
                      value={form.preferredTime}
                      onChange={e => set('preferredTime', e.target.value)}
                      className={inputCls(fieldErrors.preferredTime)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 border border-[#000101]/8 shadow-sm">
              <SectionHeader icon={FileText} title="Additional Notes" />
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Any specific requirements, access instructions, or details about the property..."
                className={inputCls() + ' resize-none leading-relaxed'}
              />
            </div>

            {/* Payout Amount */}
            <div className="bg-white rounded-2xl p-6 border border-[#000101]/8 shadow-sm">
              <SectionHeader icon={IndianRupee} title="Agent Payout" />

              <p className="text-xs text-[#013D1F]/60 font-medium mb-5">
                Minimum ₹{minimumCompensation.toLocaleString('en-IN')}. Higher offers get accepted faster.
              </p>

              {/* Quick amount chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {quickAmounts.map(amount => {
                  const active = !form.customAmount && selectedAmount === amount;
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => { setSelectedAmount(amount); set('customAmount', ''); }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        active
                          ? 'bg-[#39FF14] text-[#000101] shadow-md shadow-[#39FF14]/20'
                          : 'bg-[#F5F7F5] text-[#013D1F] border border-[#000101]/10 hover:border-[#39FF14]/50 hover:bg-[#39FF14]/5'
                      }`}
                    >
                      ₹{amount.toLocaleString('en-IN')}
                    </button>
                  );
                })}
              </div>

              {/* Custom amount */}
              <div>
                <FieldLabel error={fieldErrors.customAmount}>Custom Amount</FieldLabel>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base text-[#013D1F]/40 font-bold">₹</span>
                  <input
                    type="number"
                    min={minimumCompensation}
                    step={100}
                    value={form.customAmount}
                    onChange={e => set('customAmount', e.target.value)}
                    placeholder={`Enter amount (min ₹${minimumCompensation.toLocaleString('en-IN')})`}
                    className={inputCls(fieldErrors.customAmount) + ' pl-8'}
                  />
                </div>
              </div>

              {/* Counter offer toggle */}
              <button
                type="button"
                onClick={() => set('allowCounterOffer', !form.allowCounterOffer)}
                className={`mt-4 w-full flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition-all ${
                  form.allowCounterOffer
                    ? 'border-[#39FF14]/40 bg-[#39FF14]/5'
                    : 'border-[#000101]/8 bg-[#F5F7F5] hover:bg-white hover:border-[#000101]/15'
                }`}
              >
                <span className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  form.allowCounterOffer ? 'border-[#087A32] bg-[#087A32]' : 'border-[#013D1F]/30'
                }`}>
                  {form.allowCounterOffer && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2.3 6.1 4.7 8.5 9.7 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <div>
                  <p className="text-sm font-bold text-[#000101]">Allow counter offer</p>
                  <p className="text-xs text-[#013D1F]/60 mt-0.5 leading-relaxed">
                    Agents can propose a different rate before accepting your request.
                  </p>
                </div>
              </button>
            </div>

          </div>

          {/* ── Footer ── */}
          <div className="px-8 pb-8 shrink-0">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            {/* Summary pill */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-white rounded-2xl border border-[#000101]/8 mb-4 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-[#013D1F]/60 font-medium">
                <MapPin className="w-4 h-4 text-[#087A32]" strokeWidth={2.5} />
                {form.city || 'City not set'}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#013D1F]/60 font-medium">
                <Clock className="w-4 h-4 text-[#087A32]" strokeWidth={2.5} />
                {form.preferredDate ? new Date(form.preferredDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Date not set'}
              </div>
              <div className="flex items-center gap-1.5 font-black text-[#000101]">
                <IndianRupee className="w-4 h-4 text-[#39FF14]" strokeWidth={2.5} />
                {finalAmount.toLocaleString('en-IN')}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#39FF14] hover:bg-[#087A32] text-[#000101] hover:text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-[#39FF14]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>Confirm Booking <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
