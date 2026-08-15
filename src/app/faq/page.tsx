'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Category = 'All' | 'Booking & Scheduling' | 'Agents & Quality' | 'Pricing & Payment' | 'For Showing Agents' | 'Coverage & Availability';

const faqs: { category: Exclude<Category, 'All'>; question: string; answer: string }[] = [
  // Booking & Scheduling
  {
    category: 'Booking & Scheduling',
    question: 'How quickly can I schedule a showing?',
    answer: 'Most requests are picked up within 3 minutes. For same-day showings, submit at least 3 hours in advance. Requests can be scheduled up to 30 days ahead.',
  },
  {
    category: 'Booking & Scheduling',
    question: 'Can I schedule a showing for the same day?',
    answer: 'Yes — same-day bookings are available in most markets with at least 3 hours notice. Coverage and agent availability may vary by location.',
  },
  {
    category: 'Booking & Scheduling',
    question: 'What information do I need to book?',
    answer: "You'll need the property address, your preferred date and time, service type, and access instructions (lockbox code, parking, etc.). The whole process takes under 2 minutes.",
  },
  {
    category: 'Booking & Scheduling',
    question: 'Can I reschedule or cancel after booking?',
    answer: 'Yes. You can reschedule or cancel through your dashboard. Cancellations made at least 2 hours before the appointment are free. Late cancellations may incur a partial fee.',
  },
  // Agents & Quality
  {
    category: 'Agents & Quality',
    question: 'Are the agents licensed?',
    answer: 'Yes. Every Veyro showing agent holds an active real estate license in their state, verified at signup and monitored continuously for good standing. Agents with expired or suspended licenses are removed from the platform immediately.',
  },
  {
    category: 'Agents & Quality',
    question: 'How are agents vetted?',
    answer: "Agents go through license verification, ID verification, and a profile review before they're approved. We also track ratings and completion rates to maintain quality standards.",
  },
  {
    category: 'Agents & Quality',
    question: 'What happens after the showing?',
    answer: "Within 2 hours of the visit ending, the agent submits a detailed summary including visitor count, interest level, condition photos, observed maintenance issues, and any visitor questions. You'll receive it directly in your dashboard.",
  },
  {
    category: 'Agents & Quality',
    question: 'Can I request the same agent again?',
    answer: 'Yes! If you had a great experience, you can favorite an agent and give them priority for future bookings in their service area.',
  },
  // Pricing & Payment
  {
    category: 'Pricing & Payment',
    question: 'How much does it cost?',
    answer: 'Pay-per-showing — no monthly fees, no contracts. Fees range from $28 for a lockbox drop to $367 for a complex open house. You set the agent fee when booking; agents can accept or counter-propose.',
  },
  {
    category: 'Pricing & Payment',
    question: 'Do I keep my commission?',
    answer: "Absolutely. You remain the buyer's agent of record and keep your full commission. The Veyro showing fee is a separate one-time payment made directly to the showing agent.",
  },
  {
    category: 'Pricing & Payment',
    question: 'What are the payment methods?',
    answer: 'We accept all major credit cards and ACH bank transfers. Payment is collected at time of booking confirmation.',
  },
  {
    category: 'Pricing & Payment',
    question: 'What if an agent counter-offers?',
    answer: "If an agent proposes a different rate, you'll be notified and can approve or decline the counter within the platform. You're never charged without explicit approval.",
  },
  // For Showing Agents
  {
    category: 'For Showing Agents',
    question: 'How do I become a showing agent?',
    answer: "Apply through our agent onboarding flow. You'll need an active real estate license in your state. Verification typically takes 24–48 hours.",
  },
  {
    category: 'For Showing Agents',
    question: 'How much can I earn?',
    answer: 'Agents earn $28–$367 per service, depending on type. Showings typically pay $35–$150, open houses $75–$300. You keep 97% of the agreed fee — 3% covers payment processing.',
  },
  {
    category: 'For Showing Agents',
    question: 'Are there any monthly fees for agents?',
    answer: 'None. There are zero monthly fees or subscription costs. You only earn, never pay.',
  },
  {
    category: 'For Showing Agents',
    question: 'When do I get paid?',
    answer: "Payments are processed after the requester approves your visit summary — typically within 1–2 business days via direct deposit.",
  },
  // Coverage & Availability
  {
    category: 'Coverage & Availability',
    question: 'What markets does Veyro cover?',
    answer: 'We currently operate in 50+ markets across the US, including all major metros and many suburban areas. Coverage is expanding every month.',
  },
  {
    category: 'Coverage & Availability',
    question: 'Is weekend and evening availability supported?',
    answer: 'Yes. Our agents operate 7 days a week, including evenings and holidays. Availability varies by agent and market.',
  },
  {
    category: 'Coverage & Availability',
    question: 'What if no agent accepts my request?',
    answer: "If no agent accepts within 30 minutes, we'll notify you and suggest alternatives like rescheduling or adjusting your offered fee to attract more agents.",
  },
];

const categories: Category[] = ['All', 'Booking & Scheduling', 'Agents & Quality', 'Pricing & Payment', 'For Showing Agents', 'Coverage & Availability'];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter(f => activeCategory === 'All' || f.category === activeCategory);
  const grouped = categories.slice(1).filter(cat =>
    activeCategory === 'All' || cat === activeCategory
  ) as Exclude<Category, 'All'>[];

  return (
    <div className="min-h-screen bg-white font-sans text-[#1a2a2a]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1a362d] pt-36 pb-16 text-center px-6">
        <p className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em] mb-4">FAQ</p>
        <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-4">Common Questions</h1>
        <p className="text-white/60 font-medium max-w-xl mx-auto text-base lg:text-lg">
          Everything you need to know about booking showings, agent quality, pricing, and coverage.
        </p>
      </section>

      {/* Category filters */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#1a362d] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {grouped.map(cat => {
          const items = filtered.filter(f => f.category === cat);
          if (!items.length) return null;
          const catIndex = faqs.findIndex(f => f.category === cat);
          return (
            <div key={cat}>
              <h2 className="text-xl font-bold text-[#1a2a2a] mb-6 pb-3 border-b border-gray-100">{cat}</h2>
              <div className="space-y-3">
                {items.map((item) => {
                  const idx = faqs.indexOf(item);
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                      >
                        <span className="font-bold text-sm lg:text-base text-[#1a2a2a]">{item.question}</span>
                        <svg
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-5 text-sm text-gray-500 font-medium leading-relaxed border-t border-gray-100 pt-4">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Agent CTA */}
      <section className="bg-[#112424] py-14 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em]">For Licensed Agents</p>
            <h2 className="text-xl lg:text-2xl font-bold text-white">Earn on your schedule. No monthly fees.</h2>
            <p className="text-white/60 font-medium text-sm">$28–$367 per service. Accept only what fits your calendar.</p>
          </div>
          <a href="/agent/apply" className="flex-shrink-0 inline-flex items-center gap-2 bg-[#d69e5e] hover:bg-[#c58d4d] text-white px-7 py-3.5 rounded-2xl font-bold transition-all hover:-translate-y-1 whitespace-nowrap">
            🪪 Join as Agent
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a362d] py-16 text-center px-6">
        <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">Still have questions?</h2>
        <p className="text-white/60 font-medium mb-8">Our team is here to help. Reach out anytime.</p>
        <a href="/signup" className="inline-block bg-[#d69e5e] hover:bg-[#c58d4d] text-white px-8 py-4 rounded-2xl font-bold transition-all hover:-translate-y-1">
          Get Started Free
        </a>
      </section>

      <Footer />
    </div>
  );
}
