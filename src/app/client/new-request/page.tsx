"use client"

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useNewRequest, ServiceType } from '@/hooks/useNewRequest';
import { ArrowLeft, ArrowRight, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TimePicker } from '@/components/ui/time-picker';

// ── Service catalogue ─────────────────────────────────────────────────────────

const ALL_SERVICES: { name: ServiceType; description: string; price: string; emoji: string }[] = [
  { name: 'Private Home Showing',        emoji: '🏠', price: '₹40+',        description: 'Get a licensed agent to show you any property at a time that works for you.' },
  { name: 'Multi-Home Tour',             emoji: '📍', price: '₹40+/home',   description: 'Tour 2–6 properties in one booking. Bundle & save vs. separate showings.' },
  { name: 'Request a Task',             emoji: '✅', price: '₹40+',        description: 'Book a local agent to complete a quick task at your property.' },
  { name: 'Virtual Walkthrough',        emoji: '📹', price: '₹50+',        description: "Can't visit? Get a live video walkthrough with an agent." },
  { name: 'Buyer Consultation',         emoji: '🤝', price: '₹99+',        description: 'One-on-one strategy session about your buying journey.' },
  { name: 'Flat Fee Agent',             emoji: '🪪', price: 'Success Fee', description: 'Full transaction agent. Pay a small platform fee at closing.' },
  { name: 'Market Analysis (CMA)',      emoji: '📊', price: '₹60+',        description: 'Detailed comparative market analysis report for any property.' },
  { name: 'Listing Consultation',       emoji: '📋', price: '₹99+',        description: 'Expert advice on pricing, staging, and selling your home.' },
  { name: 'Open House Hosting',         emoji: '🏡', price: '₹60+',        description: 'Professionally host your open house — greet visitors, collect leads.' },
  { name: 'Property Photography',       emoji: '📸', price: '₹99+',        description: 'Professional real estate photography to showcase your home.' },
  { name: 'Move-In / Move-Out Cleaning',emoji: '🧹', price: '₹75+',        description: 'Thorough professional cleaning for move-in or move-out transitions.' },
  { name: 'Home Staging',               emoji: '🛋️', price: '₹150+',       description: 'Expert staging to attract buyers and maximize your sale price.' },
  { name: 'Inspection Coordination',    emoji: '🔍', price: '₹75+',        description: 'Coordinate property inspections with qualified inspectors.' },
  { name: 'Lockbox Access Support',     emoji: '🔑', price: '₹45+',        description: 'Licensed agent to assist with property access where legally allowed.' },
];

const VALID_TYPES = ALL_SERVICES.map((s) => s.name as string);

// ── Page wrapper (required for useSearchParams) ───────────────────────────────

export default function NewRequestPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
        </div>
      }
    >
      <NewRequestContent />
    </React.Suspense>
  );
}

// ── Main form ─────────────────────────────────────────────────────────────────

function NewRequestContent() {
  const searchParams = useSearchParams();
  const { submitRequest, loading } = useNewRequest();

  const rawType = searchParams.get('type');
  const isValidType = rawType !== null && VALID_TYPES.includes(rawType);

  const [step, setStep] = useState(() => (isValidType ? 2 : 1));
  const [selectedService, setSelectedService] = useState<ServiceType>(
    () => (isValidType ? (rawType as ServiceType) : 'Private Home Showing')
  );
  const [compensation, setCompensation] = useState(65);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zip: '',
    mlsNumber: '',
    clientName: '',
    clientPhone: '',
    accessNotes: '',
    lockboxCode: '',
    additionalNotes: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (field === 'PIN') {
      setFormData((prev) => ({ ...prev, [field]: value.replace(/\D/g, '').slice(0, 5) }));
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    if (step === 2) {
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city)    newErrors.city    = 'City is required';
      if (!formData.state)   newErrors.state   = 'State is required';
      if (!formData.zip)     newErrors.zip     = 'PIN code is required';
      else if (formData.zip.length !== 5) newErrors.zip = 'PIN code must be 5 digits';
    }
    if (step === 3) {
      if (!formData.date)      newErrors.date      = 'Date is required';
      if (!formData.startTime) newErrors.startTime = 'Start time is required';
      if (!formData.endTime)   newErrors.endTime   = 'End time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateStep()) return;
    if (step < 4) {
      setStep(step + 1);
    } else {
      try {
        await submitRequest(selectedService, compensation, formData);
        alert('Request Submitted Successfully!');
        window.location.href = '/client/requests';
      } catch (error: any) {
        alert(error.message || 'Failed to submit request. Please try again.');
      }
    }
  };

  const handleBack = () => { if (step > 1) setStep(step - 1); };

  const selectedServiceData = ALL_SERVICES.find((s) => s.name === selectedService);

  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-20">
      {/* Top Navigation */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleBack}
          disabled={step === 1}
          className="flex items-center gap-2 text-[11px] font-extrabold text-gray-500 bg-white border border-gray-100 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:shadow-sm transition-all active:scale-95 disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK
        </button>
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          New {selectedService} Request
        </h2>
      </div>

      {/* Stepper */}
      <div className="relative flex justify-between items-start max-w-4xl mx-auto px-8 pt-4">
        <div className="absolute top-[22px] left-[10%] right-[10%] h-[2px] bg-gray-100 -z-10" />
        <Step number={1} label="Service Type"     active={step === 1} completed={step > 1} />
        <Step number={2} label="Property Details" active={step === 2} completed={step > 2} />
        <Step number={3} label="Schedule & Fee"   active={step === 3} completed={step > 3} />
        <Step number={4} label="Review & Submit"  active={step === 4} completed={step > 4} />
      </div>

      {/* Card */}
      <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-50/50 min-h-[500px] flex flex-col">
        <div className="flex-1">

          {/* ── Step 1: Service Selection ───────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground tracking-tight">What service do you need?</h3>
                <p className="text-gray-400 font-medium text-sm">Select the type of assistance you require for your property.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ALL_SERVICES.map((svc) => (
                  <ServiceOption
                    key={svc.name}
                    emoji={svc.emoji}
                    title={svc.name}
                    description={svc.description}
                    price={svc.price}
                    selected={selectedService === svc.name}
                    onClick={() => setSelectedService(svc.name)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Property Details ────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-10">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Property details</h3>
              <div className="grid grid-cols-1 gap-6 max-w-2xl">
                <Input label="Street Address" placeholder="123 Main St" required value={formData.address} onChange={(v) => handleInputChange('address', v)} error={errors.address} />
                <div className="grid grid-cols-3 gap-4">
                  <Input label="City"     placeholder="Miami"  required value={formData.city}  onChange={(v) => handleInputChange('city', v)}  error={errors.city} />
                  <Input label="State"    placeholder="FL"     required value={formData.state} onChange={(v) => handleInputChange('state', v)} error={errors.state} />
                  <Input label="PIN code" placeholder="33101"  required value={formData.zip}   onChange={(v) => handleInputChange('PIN', v)}   error={errors.zip} />
                </div>
                <Input    label="MLS Number (optional)"       placeholder="A1234567"           value={formData.mlsNumber}      onChange={(v) => handleInputChange('mlsNumber', v)}      error={errors.mlsNumber} />
                <Input    label="Client Name (optional)"      placeholder="Jane Smith"          value={formData.clientName}     onChange={(v) => handleInputChange('clientName', v)}     error={errors.clientName} />
                <Input    label="Client Phone (optional)"     placeholder="(555) 000-0000"      value={formData.clientPhone}    onChange={(v) => handleInputChange('clientPhone', v)}    error={errors.clientPhone} />
                <Textarea label="Access Notes"                placeholder="Lockbox on front door, code: 1234." value={formData.accessNotes}    onChange={(v) => handleInputChange('accessNotes', v)}    error={errors.accessNotes} />
                <Input    label="Lockbox Code (if applicable)" placeholder="1234"               value={formData.lockboxCode}    onChange={(v) => handleInputChange('lockboxCode', v)}    error={errors.lockboxCode} />
                <Textarea label="Additional Notes"            placeholder="Any special instructions…"         value={formData.additionalNotes} onChange={(v) => handleInputChange('additionalNotes', v)} error={errors.additionalNotes} />
              </div>
            </div>
          )}

          {/* ── Step 3: Schedule & Fee ──────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-10">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Schedule & compensation</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                {/* Date picker */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Showing Date <span className="text-red-500">*</span>
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full px-5 py-6 justify-start text-left font-bold rounded-xl border transition-all',
                          errors.date ? 'border-red-500 bg-red-50/10' : 'border-gray-100 bg-gray-50/30',
                          !formData.date ? 'text-muted-foreground' : 'text-foreground text-sm',
                        )}
                      >
                        <CalendarIcon className={cn('mr-2 h-4 w-4', errors.date ? 'text-red-500' : 'text-gray-400')} />
                        {formData.date
                          ? format(new Date(formData.date), 'PPP')
                          : <span className="text-gray-400 text-sm">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date ? new Date(formData.date) : undefined}
                        onSelect={(date) => { if (date) handleInputChange('date', format(date, 'yyyy-MM-dd')); }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.date}</p>}
                </div>

                <TimePicker label="Start Time" value={formData.startTime} onChange={(v) => handleInputChange('startTime', v)} error={errors.startTime} />
                <div className="md:col-start-1">
                  <TimePicker label="End Time" value={formData.endTime} onChange={(v) => handleInputChange('endTime', v)} error={errors.endTime} />
                </div>
              </div>

              {/* Compensation slider */}
              <div className="space-y-6 max-w-2xl pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Agent Compensation</label>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">₹{compensation}</div>
                </div>
                <div className="space-y-3">
                  <input
                    type="range" min="35" max="150" step="1"
                    value={compensation}
                    onChange={(e) => setCompensation(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#416450]"
                  />
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>₹35</span><span>₹150</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">
                  Higher fees attract agents faster. Agents may counter-propose a different rate.
                </p>
              </div>
            </div>
          )}

          {/* ── Step 4: Review & Submit ─────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-10">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Review your request</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 max-w-3xl">
                <ReviewItem label="Service" value={
                  <div className="flex items-center gap-2">
                    <span>{selectedServiceData?.emoji ?? '📋'}</span>
                    <span>{selectedService}</span>
                  </div>
                } />
                <ReviewItem label="Address" value={`₹{formData.address}, ₹{formData.city}, ₹{formData.state} ₹{formData.zip}`} />
                <ReviewItem label="Date"        value={formData.date} />
                <ReviewItem label="Time Window" value={`₹{formData.startTime} – ₹{formData.endTime}`} />
                <div className="col-span-full">
                  <ReviewItem label="Agent Fee" value={<span className="text-2xl font-extrabold text-foreground">₹{compensation}</span>} />
                </div>
              </div>

              <div className="max-w-3xl bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                <div className="mt-0.5 text-blue-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-blue-800/80 font-medium leading-relaxed">
                  Your request will be visible to licensed agents in the area. They can accept at your listed fee or counter-propose a different rate.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-10 mt-10 border-t border-gray-50">
          <button
            onClick={handleBack}
            className={`text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2 ₹{step === 1 ? 'invisible' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 4 ? 'Edit' : 'Back'}
          </button>
          <button
            onClick={handleContinue}
            disabled={loading}
            className={`px-12 py-4 rounded-2xl text-sm font-bold shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 disabled:opacity-50 ₹{
              step === 4
                ? 'bg-accent hover:bg-accent/90 text-white shadow-orange-900/10'
                : 'bg-primary hover:bg-primary/90 text-white shadow-green-900/10'
            }`}
          >
            {loading ? 'Submitting…' : step === 3 ? 'Review' : step === 4 ? 'Submit Request' : 'Continue'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Step({ number, label, active, completed }: { number: number; label: string; active?: boolean; completed?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center min-w-[100px]">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ₹{
        completed
          ? 'bg-primary text-white shadow-md'
          : active
            ? 'bg-primary text-white ring-[6px] ring-green-50 shadow-lg shadow-green-900/10'
            : 'bg-white text-gray-300 border-2 border-gray-100'
      }`}>
        {completed ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        ) : number}
      </div>
      <p className={`text-[11px] font-bold tracking-wider uppercase transition-colors duration-300 ₹{active || completed ? 'text-foreground' : 'text-gray-400'}`}>
        {label}
      </p>
    </div>
  );
}

function ServiceOption({ emoji, title, description, price, selected, onClick }: {
  emoji: string; title: string; description: string; price: string; selected?: boolean; onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`group p-5 rounded-[1.5rem] border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ₹{
        selected
          ? 'border-[#416450] bg-green-50/10 shadow-lg shadow-green-900/5'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{emoji}</div>
      <div className="space-y-1.5">
        <h4 className="font-bold text-xs text-foreground group-hover:text-green-800 transition-colors leading-snug">{title}</h4>
        <p className="text-[10px] text-gray-400 font-medium leading-relaxed line-clamp-2">{description}</p>
        <div className="pt-1">
          <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded-lg ₹{
            selected ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-gray-500'
          }`}>{price}</span>
        </div>
      </div>
    </div>
  );
}

function Input({ label, placeholder, required, type = 'text', value, onChange, error }: {
  label: string; placeholder: string; required?: boolean; type?: string; value?: string; onChange?: (v: string) => void; error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type} placeholder={placeholder} value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full px-5 py-4 rounded-xl border text-sm text-foreground transition-all focus:outline-none focus:ring-2',
          error
            ? 'border-red-500 bg-red-50/10 focus:ring-red-500/20'
            : 'border-gray-100 bg-gray-50/30 focus:ring-green-500/20 focus:border-green-500',
        )}
      />
      {error && <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>}
    </div>
  );
}

function Textarea({ label, placeholder, value, onChange, error }: {
  label: string; placeholder: string; value?: string; onChange?: (v: string) => void; error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">{label}</label>
      <textarea
        placeholder={placeholder} rows={3} value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full px-5 py-4 rounded-xl border text-sm text-foreground transition-all resize-none focus:outline-none focus:ring-2',
          error
            ? 'border-red-500 bg-red-50/10 focus:ring-red-500/20'
            : 'border-gray-100 bg-gray-50/30 focus:ring-green-500/20 focus:border-green-500',
        )}
      />
      {error && <p className="text-[10px] font-bold text-red-500 ml-1">{error}</p>}
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <div className="text-sm font-bold text-foreground tracking-tight">{value}</div>
    </div>
  );
}
