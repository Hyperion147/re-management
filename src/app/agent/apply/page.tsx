'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const SERVICES = [
  'Home Showings', 'Multi-Home Tours', 'Virtual Tours', 'Writing Offers',
  'CMA Reports', 'Buyer Consultations', 'Listing Consultations', 'Open House Hosting',
  'Rental Showings', 'Inspection Coordination', 'Photography', 'Move-In/Out Cleaning',
  'Home Staging',
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SPECIALTIES = ['Buyers', 'Investors', 'Luxury', 'Rentals', 'First-Time Buyers', 'Relocations'];

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

const TERMS = [
  "I agree to Veyro's platform rules and agent code of conduct.",
  "I confirm I am operating as an independent contractor, not an employee of Veyro.",
  "I confirm I am in compliance with my brokerage, local real estate laws, and licensing requirements.",
  "I agree to pay Veyro's Platform Success Fee for transactions successfully completed through the platform. Fee structure: Under ₹2.5 Cr → ₹16,500 | ₹2.5 Cr–₹5.8 Cr → ₹33,000 | ₹5.8 Cr+ → ₹58,000.",
];

type FormData = {
  // Step 1
  fullName: string; email: string; phone: string;
  // Step 2
  licenseNumber: string; licenseState: string; brokerageName: string; mlsId: string;
  // Step 3
  services: string[];
  // Step 4
  PINCode: string; radiusMiles: number; willingToTravel: boolean;
  // Step 5
  availableDays: string[]; acceptSameDay: boolean;
  // Step 6 — Agent Profile
  photoUrl: string; photoFile: File | null;
  bio: string; specialties: string[]; languages: string; yearsOfExperience: string;
  // Step 7 — Terms
  agreedTerms: boolean[];
};

const INITIAL: FormData = {
  fullName: '', email: '', phone: '',
  licenseNumber: '', licenseState: '', brokerageName: '', mlsId: '',
  services: [],
  PINCode: '', radiusMiles: 25, willingToTravel: false,
  availableDays: [], acceptSameDay: false,
  photoUrl: '', photoFile: null,
  bio: '', specialties: [], languages: '', yearsOfExperience: '',
  agreedTerms: [false, false, false, false],
};

const STEP_LABELS = ['Basic Info', 'License', 'Services', 'Service Area', 'Availability', 'Profile', 'Terms'];

const STEP_ICONS = [
  <svg key="0" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  <svg key="1" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  <svg key="2" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  <svg key="3" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key="4" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  <svg key="5" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key="6" className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
];

export default function AgentApplyPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 7;
  const progress = ((step + 1) / totalSteps) * 100;

  const update = (patch: Partial<FormData>) => setForm(f => ({ ...f, ...patch }));

  const toggleService = (s: string) =>
    update({ services: form.services.includes(s) ? form.services.filter(x => x !== s) : [...form.services, s] });

  const toggleDay = (d: string) =>
    update({ availableDays: form.availableDays.includes(d) ? form.availableDays.filter(x => x !== d) : [...form.availableDays, d] });

  const toggleSpecialty = (s: string) =>
    update({ specialties: form.specialties.includes(s) ? form.specialties.filter(x => x !== s) : [...form.specialties, s] });

  const toggleTerm = (i: number) => {
    const next = [...form.agreedTerms];
    next[i] = !next[i];
    update({ agreedTerms: next });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    update({ photoFile: file, photoUrl: URL.createObjectURL(file) });
  };

  const allTermsAgreed = form.agreedTerms.every(Boolean);

  const handleSubmit = async () => {
    if (!allTermsAgreed) { setError('Please agree to all terms before submitting.'); return; }
    setSubmitting(true);
    setError(null);
    try {
      let uploadedPhotoUrl = '';
      if (form.photoFile) {
        const ext = form.photoFile.name.split('.').pop();
        const filename = `agent-photos/₹{Date.now()}.₹{ext}`;
        const { data, error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(filename, form.photoFile, { upsert: true });
        if (!uploadErr && data) {
          const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(data.path);
          uploadedPhotoUrl = urlData.publicUrl;
        }
      }

      const res = await fetch('/api/agent/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName, email: form.email, phone: form.phone,
          licenseNumber: form.licenseNumber, licenseState: form.licenseState,
          brokerageName: form.brokerageName, mlsId: form.mlsId,
          services: form.services,
          zip: form.PINCode, radiusMiles: form.radiusMiles, willingToTravel: form.willingToTravel,
          availableDays: form.availableDays, acceptSameDay: form.acceptSameDay,
          photoUrl: uploadedPhotoUrl,
          bio: form.bio, specialties: form.specialties,
          languages: form.languages, yearsOfExperience: form.yearsOfExperience,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F5F7F5] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 pt-24">
          <div className="max-w-md w-full bg-white rounded-3xl p-12 text-center shadow-xl border border-[#000101]/5 space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#39FF14] to-[#087A32] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg className="w-10 h-10 text-[#000101]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-black text-[#000101]">Application Submitted!</h2>
              <p className="text-[#013D1F]/60 text-base font-medium">
                Thank you, {form.fullName.split(' ')[0]}! We'll review your application and get back to you within 24–48 hours.
              </p>
            </div>
            <Link href="/" className="inline-block bg-[#39FF14] hover:bg-[#087A32] text-[#000101] hover:text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5">
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F5] font-sans flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-12">
        {/* Header */}
        <div className="text-center pt-6 pb-8 px-4">
          <h1 className="text-4xl lg:text-5xl font-black text-[#000101] mb-3">Become an Agent on Veyro</h1>
          <p className="text-lg text-[#087A32] font-semibold">Earn by helping buyers, sellers, and renters with on-demand real estate services.</p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto px-4 mb-8">
          <div className="flex items-center justify-between mb-3 text-sm font-bold text-[#013D1F]/60">
            <span>Step {step + 1} of {totalSteps}</span>
            <span className="text-[#087A32]">{STEP_LABELS[step]}</span>
          </div>
          <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-[#39FF14] to-[#087A32] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex items-center justify-between mt-6">
            {STEP_ICONS.map((icon, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all shadow-sm ${
                  i < step ? 'bg-gradient-to-br from-[#39FF14] to-[#087A32] border-[#39FF14] text-[#000101]'
                    : i === step ? 'bg-white border-[#39FF14] text-[#087A32]'
                    : 'bg-white border-[#000101]/20 text-[#013D1F]/30'
                }`}
              >
                {icon}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="max-w-2xl mx-auto px-4 pb-12">
          <div className="bg-white rounded-3xl shadow-xl border border-[#000101]/5 p-8 lg:p-10">
          {step === 0 && <Step1 form={form} update={update} />}
          {step === 1 && <Step2 form={form} update={update} />}
          {step === 2 && <Step3 form={form} toggleService={toggleService} />}
          {step === 3 && <Step4 form={form} update={update} />}
          {step === 4 && <Step5 form={form} update={update} toggleDay={toggleDay} />}
          {step === 5 && <Step6Profile form={form} update={update} fileInputRef={fileInputRef} handlePhotoChange={handlePhotoChange} toggleSpecialty={toggleSpecialty} />}
          {step === 6 && <Step7Terms form={form} toggleTerm={toggleTerm} />}
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700 font-bold">{error}</div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm font-bold text-[#013D1F]/60 hover:text-[#087A32] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          {step < totalSteps - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#087A32] text-[#000101] hover:text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg hover:-translate-y-0.5"
            >
              Continue
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !allTermsAgreed}
              className="flex items-center gap-2 bg-[#39FF14] hover:bg-[#087A32] text-[#000101] hover:text-white px-8 py-4 rounded-2xl text-sm font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  </div>
  );
}

/* ── Shared helpers ── */

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-bold text-foreground mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a362d]/20 focus:border-primary transition-all bg-white"
    />
  );
}

/* ── Steps ── */

function Step1({ form, update }: { form: FormData; update: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">Basic Information</h2>
      <div><FieldLabel required>Full Name</FieldLabel><TextInput value={form.fullName} onChange={v => update({ fullName: v })} placeholder="Jane Smith" /></div>
      <div><FieldLabel required>Email</FieldLabel><TextInput type="email" value={form.email} onChange={v => update({ email: v })} placeholder="jane@example.com" /></div>
      <div><FieldLabel required>Phone Number</FieldLabel><TextInput type="tel" value={form.phone} onChange={v => update({ phone: v })} placeholder="(555) 000-0000" /></div>
    </div>
  );
}

function Step2({ form, update }: { form: FormData; update: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">License Verification</h2>
      <div><FieldLabel required>License Number</FieldLabel><TextInput value={form.licenseNumber} onChange={v => update({ licenseNumber: v })} placeholder="e.g. CA-DRE-12345678" /></div>
      <div>
        <FieldLabel required>License State</FieldLabel>
        <select
          value={form.licenseState}
          onChange={e => update({ licenseState: e.target.value })}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a362d]/20 focus:border-primary transition-all bg-white"
        >
          <option value="">e.g. California</option>
          {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div><FieldLabel required>Brokerage Name</FieldLabel><TextInput value={form.brokerageName} onChange={v => update({ brokerageName: v })} placeholder="e.g. Keller Williams" /></div>
      <div><FieldLabel>MLS ID (optional)</FieldLabel><TextInput value={form.mlsId} onChange={v => update({ mlsId: v })} placeholder="Optional" /></div>
    </div>
  );
}

function Step3({ form, toggleService }: { form: FormData; toggleService: (s: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Services You Offer</h2>
        <p className="text-xs text-gray-500 font-medium mt-1">Select all that apply. You can update this later.</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {SERVICES.map(s => {
          const checked = form.services.includes(s);
          return (
            <button key={s} type="button" onClick={() => toggleService(s)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-sm font-semibold text-left transition-all ₹{
                checked ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ₹{checked ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                {checked && <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
              </span>
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step4({ form, update }: { form: FormData; update: (p: Partial<FormData>) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">Service Area</h2>
      <p className="text-xs text-primary font-semibold">Enter a PIN code and select how far you'll travel.</p>

      <div className="rounded-2xl overflow-hidden border border-gray-200 bg-[#e8eeea] h-44 flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `repeating-linear-gradient(0deg,#1a362d 0px,#1a362d 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#1a362d 0px,#1a362d 1px,transparent 1px,transparent 40px)`,
        }} />
        <div className="relative text-center space-y-2">
          <svg className="w-8 h-8 text-primary/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-xs text-primary/50 font-medium">Coverage map preview</p>
        </div>
      </div>

      <div className="border border-gray-200 rounded-2xl p-4 space-y-4">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Coverage Zone</p>
        <div>
          <FieldLabel>PIN code</FieldLabel>
          <div className="flex gap-2">
            <input type="text" value={form.PINCode} onChange={e => update({ PINCode: e.target.value })} placeholder="e.g. 400001" maxLength={6}
              className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a362d]/20 focus:border-primary transition-all" />
            <button className="flex items-center gap-1.5 px-4 py-3 rounded-2xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              Find
            </button>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <FieldLabel>Radius</FieldLabel>
            <span className="text-sm font-bold text-primary">{form.radiusMiles} miles</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium">5 mi</span>
            <input type="range" min={5} max={100} step={5} value={form.radiusMiles} onChange={e => update({ radiusMiles: parseInt(e.target.value) })} className="flex-1 accent-[#1a362d]" />
            <span className="text-xs text-gray-400 font-medium">100 mi</span>
          </div>
        </div>
      </div>

      <button type="button" onClick={() => update({ willingToTravel: !form.willingToTravel })}
        className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border text-sm font-semibold text-left transition-all ₹{form.willingToTravel ? 'border-accent bg-accent/5' : 'border-gray-200'}`}
      >
        <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ₹{form.willingToTravel ? 'border-accent bg-accent' : 'border-gray-300'}`}>
          {form.willingToTravel && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
        </span>
        <div>
          <p className="font-bold text-foreground">Willing to travel farther for higher pay</p>
          <p className="text-xs text-accent font-medium mt-0.5">You'll see requests outside your radius with a travel premium</p>
        </div>
      </button>
    </div>
  );
}

function Step5({ form, update, toggleDay }: { form: FormData; update: (p: Partial<FormData>) => void; toggleDay: (d: string) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Availability</h2>
        <p className="text-xs text-gray-500 font-medium mt-1">Which days are you generally available?</p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {DAYS.map(d => {
          const checked = form.availableDays.includes(d);
          return (
            <button key={d} type="button" onClick={() => toggleDay(d)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all ₹{
                checked ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ₹{checked ? 'border-primary bg-primary' : 'border-gray-300'}`} />
              {d}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={() => update({ acceptSameDay: !form.acceptSameDay })}
        className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border text-sm font-semibold text-left transition-all ₹{form.acceptSameDay ? 'border-accent bg-accent/5' : 'border-gray-200'}`}
      >
        <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ₹{form.acceptSameDay ? 'border-accent bg-accent' : 'border-gray-300'}`}>
          {form.acceptSameDay && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
        </span>
        <div>
          <p className="font-bold text-foreground">Accept same-day requests</p>
          <p className="text-xs text-gray-500 font-medium mt-0.5">You'll be notified and can accept or decline</p>
        </div>
      </button>
    </div>
  );
}

function Step6Profile({ form, update, fileInputRef, handlePhotoChange, toggleSpecialty }: {
  form: FormData;
  update: (p: Partial<FormData>) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handlePhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleSpecialty: (s: string) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Your Agent Profile</h2>

      {/* Photo */}
      <div>
        <p className="text-sm font-bold text-foreground mb-3">Profile Photo</p>
        <div className="flex items-center gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-primary/40 transition-colors overflow-hidden"
          >
            {form.photoUrl ? (
              <img src={form.photoUrl} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-foreground hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Upload Photo
            </button>
            <p className="text-xs text-gray-400 font-medium mt-1.5">JPG, PNG or WEBP. Max 5MB.</p>
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
      </div>

      {/* Bio */}
      <div>
        <FieldLabel>Bio</FieldLabel>
        <textarea
          value={form.bio}
          onChange={e => update({ bio: e.target.value })}
          placeholder="Tell clients about your experience and approach..."
          rows={4}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1a362d]/20 focus:border-primary transition-all resize-none"
        />
      </div>

      {/* Specialties */}
      <div>
        <FieldLabel>Specialties</FieldLabel>
        <div className="flex flex-wrap gap-2 mt-1">
          {SPECIALTIES.map(s => {
            const active = form.specialties.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggleSpecialty(s)}
                className={`px-4 py-1.5 rounded-full border text-xs font-bold transition-all ₹{
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Languages + Years */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel>Languages (comma separated)</FieldLabel>
          <TextInput value={form.languages} onChange={v => update({ languages: v })} placeholder="English, Spanish" />
        </div>
        <div>
          <FieldLabel>Years of Experience</FieldLabel>
          <TextInput type="number" value={form.yearsOfExperience} onChange={v => update({ yearsOfExperience: v })} placeholder="5" />
        </div>
      </div>
    </div>
  );
}

function Step7Terms({ form, toggleTerm }: { form: FormData; toggleTerm: (i: number) => void }) {
  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-foreground">Terms & Compliance</h2>
      <div className="space-y-3">
        {TERMS.map((term, i) => {
          const checked = form.agreedTerms[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggleTerm(i)}
              className={`w-full flex items-start gap-3 px-4 py-4 rounded-2xl border text-left transition-all ₹{
                checked ? 'border-primary/30 bg-primary/5' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all ₹{
                checked ? 'border-primary bg-primary' : 'border-gray-300'
              }`}>
                {checked && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium text-gray-700 leading-relaxed">{term}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
