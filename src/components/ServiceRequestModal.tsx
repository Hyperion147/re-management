'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useNewRequest, type ServiceType } from '@/hooks/useNewRequest';

type ServiceRequestModalProps = {
  isOpen: boolean;
  serviceType: ServiceType;
  minimumCompensation: number;
  onClose: () => void;
};

const STATES = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
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
  streetAddress: '',
  unit: '',
  city: '',
  state: '',
  zip: '',
  mlsNumber: '',
  preferredDate: '',
  preferredTime: '',
  notes: '',
  customAmount: '',
  allowCounterOffer: false,
};

function buildQuickAmounts(minimumCompensation: number) {
  return [
    minimumCompensation,
    minimumCompensation + 10,
    minimumCompensation + 20,
    minimumCompensation + 35,
    minimumCompensation + 60,
  ];
}

export default function ServiceRequestModal({
  isOpen,
  serviceType,
  minimumCompensation,
  onClose,
}: ServiceRequestModalProps) {
  const { submitRequest, loading, error } = useNewRequest();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [selectedAmount, setSelectedAmount] = useState<number>(minimumCompensation);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const quickAmounts = useMemo(
    () => buildQuickAmounts(minimumCompensation),
    [minimumCompensation]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const finalAmount = useMemo(() => {
    const parsed = Number(form.customAmount);
    if (Number.isFinite(parsed) && parsed >= minimumCompensation) {
      return parsed;
    }

    return selectedAmount;
  }, [form.customAmount, minimumCompensation, selectedAmount]);

  const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) {
        return current;
      }

      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.streetAddress.trim()) nextErrors.streetAddress = 'Required';
    if (!form.city.trim()) nextErrors.city = 'Required';
    if (!form.state.trim()) nextErrors.state = 'Required';
    if (!form.zip.trim()) nextErrors.zip = 'Required';
    else if (form.zip.trim().length !== 5) nextErrors.zip = 'Use 5 digits';
    if (!form.preferredDate) nextErrors.preferredDate = 'Required';
    if (!form.preferredTime) nextErrors.preferredTime = 'Required';
    if (form.customAmount && finalAmount < minimumCompensation) {
      nextErrors.customAmount = `Minimum is $${minimumCompensation}`;
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const [hoursText, minutesText] = form.preferredTime.split(':');
    const endDate = new Date();
    endDate.setHours(Number(hoursText) || 0, Number(minutesText) || 0, 0, 0);
    endDate.setHours(endDate.getHours() + 1);

    const endTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(
      endDate.getMinutes()
    ).padStart(2, '0')}`;

    const combinedNotes = [
      form.notes.trim(),
      form.allowCounterOffer ? 'Counter offers allowed before acceptance.' : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await submitRequest(serviceType, finalAmount, {
        address: form.unit.trim()
          ? `${form.streetAddress.trim()}, Unit ${form.unit.trim()}`
          : form.streetAddress.trim(),
        city: form.city.trim(),
        state: form.state,
        zip: form.zip.trim(),
        mlsNumber: form.mlsNumber.trim(),
        clientName: '',
        clientPhone: '',
        accessNotes: '',
        lockboxCode: '',
        additionalNotes: combinedNotes,
        date: form.preferredDate,
        startTime: form.preferredTime,
        endTime,
      });

      onClose();
      window.location.href = '/client/requests';
    } catch {
      // surfaced by hook error state
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(20,24,24,0.48)] px-4 py-6 backdrop-blur-[3px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[446px] overflow-hidden rounded-[18px] bg-[#fbfaf7] shadow-[0_30px_80px_rgba(0,0,0,0.28)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#efe6da] px-6 py-5">
          <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-[#173f33]">
            Book: {serviceType}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${serviceType} form`}
            className="rounded-full p-1 text-[#7e8f8b] transition hover:bg-[#f2ede6] hover:text-[#173f33]"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path
                d="M5 5 15 15M15 5 5 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="max-h-[86vh] overflow-y-auto px-6 py-5">
          <section className="space-y-4">
            <h3 className="text-[15px] font-semibold text-[#29473e]">Property Address</h3>

            <div className="grid grid-cols-[minmax(0,1fr)_102px] gap-3">
              <Field label="Street Address" required error={fieldErrors.streetAddress}>
                <input
                  type="text"
                  value={form.streetAddress}
                  onChange={(event) => handleChange('streetAddress', event.target.value)}
                  placeholder="123 Main St"
                  className={inputClass(fieldErrors.streetAddress)}
                />
              </Field>
              <Field label="Unit">
                <input
                  type="text"
                  value={form.unit}
                  onChange={(event) => handleChange('unit', event.target.value)}
                  placeholder="Apt 4B"
                  className={inputClass()}
                />
              </Field>
            </div>

            <Field label="City" required error={fieldErrors.city}>
              <input
                type="text"
                value={form.city}
                onChange={(event) => handleChange('city', event.target.value)}
                placeholder="Austin"
                className={inputClass(fieldErrors.city)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="State" required error={fieldErrors.state}>
                <div className="relative">
                  <select
                    value={form.state}
                    onChange={(event) => handleChange('state', event.target.value)}
                    className={inputClass(fieldErrors.state, true)}
                  >
                    <option value="">State</option>
                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8aa09a]"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="m4 6 4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Field>

              <Field label="ZIP Code" required error={fieldErrors.zip}>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={form.zip}
                  onChange={(event) =>
                    handleChange('zip', event.target.value.replace(/\D/g, '').slice(0, 5))
                  }
                  placeholder="78701"
                  className={inputClass(fieldErrors.zip)}
                />
              </Field>
            </div>

            <Field label="MLS Number (optional)">
              <input
                type="text"
                value={form.mlsNumber}
                onChange={(event) => handleChange('mlsNumber', event.target.value)}
                placeholder="e.g. MLS-1234567"
                className={inputClass()}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Preferred Date" required error={fieldErrors.preferredDate}>
                <input
                  type="date"
                  value={form.preferredDate}
                  onChange={(event) => handleChange('preferredDate', event.target.value)}
                  className={inputClass(fieldErrors.preferredDate)}
                />
              </Field>

              <Field label="Preferred Time" required error={fieldErrors.preferredTime}>
                <input
                  type="time"
                  value={form.preferredTime}
                  onChange={(event) => handleChange('preferredTime', event.target.value)}
                  className={inputClass(fieldErrors.preferredTime)}
                />
              </Field>
            </div>

            <Field label="Notes (optional)">
              <textarea
                rows={4}
                value={form.notes}
                onChange={(event) => handleChange('notes', event.target.value)}
                placeholder="Any details about your request..."
                className={`${inputClass()} min-h-[110px] resize-y py-3`}
              />
            </Field>
          </section>

          <section className="mt-6 rounded-[16px] border border-[#efe6da] bg-white px-4 py-4">
            <h3 className="text-[15px] font-semibold text-[#29473e]">
              Payout Amount <span className="text-[#de6f63]">*</span>
            </h3>
            <p className="mt-1 text-[13px] text-[#80948d]">
              Minimum ${minimumCompensation}. Offer more to get accepted faster.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {quickAmounts.map((amount) => {
                const active = !form.customAmount && selectedAmount === amount;

                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amount);
                      handleChange('customAmount', '');
                    }}
                    className={`min-w-[64px] rounded-[12px] border px-4 py-2 text-[14px] font-semibold transition ${
                      active
                        ? 'border-[#173f33] bg-[#173f33] text-white'
                        : 'border-[#e6dccf] bg-[#fbfaf7] text-[#29473e] hover:border-[#cfc0ad]'
                    }`}
                  >
                    ${amount}
                  </button>
                );
              })}
            </div>

            <div className="mt-3">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[22px] text-[#90a19b]">
                  $
                </span>
                <input
                  type="number"
                  min={minimumCompensation}
                  step={1}
                  value={form.customAmount}
                  onChange={(event) => handleChange('customAmount', event.target.value)}
                  placeholder={`Custom amount (min $${minimumCompensation})`}
                  className={`${inputClass(fieldErrors.customAmount)} pl-9`}
                />
              </div>
              {fieldErrors.customAmount ? (
                <p className="mt-1 text-[11px] font-medium text-[#cc5f5f]">
                  {fieldErrors.customAmount}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => handleChange('allowCounterOffer', !form.allowCounterOffer)}
              className={`mt-4 flex w-full items-start gap-3 rounded-[14px] border px-4 py-4 text-left transition ${
                form.allowCounterOffer
                  ? 'border-[#d8cab9] bg-[#faf7f2]'
                  : 'border-[#efe6da] bg-[#fffdfb]'
              }`}
            >
              <span
                className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border ${
                  form.allowCounterOffer
                    ? 'border-[#173f33] bg-[#173f33]'
                    : 'border-[#cdbfae] bg-white'
                }`}
              >
                {form.allowCounterOffer ? (
                  <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M2.3 6.1 4.7 8.5 9.7 3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </span>
              <span>
                <span className="block text-[14px] font-semibold text-[#29473e]">
                  Allow counter offer
                </span>
                <span className="mt-1 block text-[13px] leading-5 text-[#80948d]">
                  Agents may propose a different rate before accepting.
                </span>
              </span>
            </button>
          </section>

          {error ? (
            <div className="mt-4 rounded-[14px] border border-[#efc7c7] bg-[#fff2f2] px-4 py-3 text-[12px] font-medium text-[#b24040]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex h-[52px] w-full items-center justify-center rounded-[14px] bg-[#173f33] text-[15px] font-semibold text-white transition hover:bg-[#123429] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Submitting...' : 'Submit & Pay ->'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[14px] font-medium text-[#29473e]">
        {label}
        {required ? <span className="text-[#de6f63]"> *</span> : null}
      </span>
      {children}
      {error ? <span className="text-[11px] font-medium text-[#cc5f5f]">{error}</span> : null}
    </label>
  );
}

function inputClass(error?: string, isSelect = false) {
  return [
    'h-[44px] w-full rounded-[14px] border bg-white px-4 text-[14px] text-[#173f33] outline-none transition',
    'placeholder:text-[#93a39f] focus:border-[#173f33] focus:ring-3 focus:ring-[#173f33]/8',
    isSelect ? 'appearance-none pr-10 text-[#6f8780]' : '',
    error ? 'border-[#d97a7a]' : 'border-[#dfd5c8]',
  ]
    .filter(Boolean)
    .join(' ');
}
