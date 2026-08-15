import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-[#1a2a2a]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1a362d] pt-36 pb-16 text-center px-6">
        <p className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em] mb-4">How It Works</p>
        <h1 className="text-4xl lg:text-6xl font-bold text-white tracking-tight mb-4">How Veyro Works</h1>
        <p className="text-white/60 font-medium max-w-xl mx-auto text-base">
          No contracts, no monthly fees. From request to completed showing —{' '}
          <span className="text-[#d69e5e] font-bold">in minutes.</span>
        </p>
      </section>

      {/* For Realtors */}
      <section className="py-20 lg:py-28 bg-white px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em] mb-2">For Property Managers & Realtors</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2a2a] mb-14">Book a showing in minutes</h2>

          <div className="space-y-8">
            {[
              {
                num: 1,
                title: 'Create Your Request',
                desc: 'From the dropdown, choose your service type (showing, open house, etc.), add your preferred date and time, and set your agent fee. Takes under 2 minutes.',
              },
              {
                num: 2,
                title: 'Agent Gets Matched',
                desc: 'Licensed real estate agents are notified instantly. Most requests accepted within 3 minutes.',
              },
              {
                num: 3,
                title: 'Showing Completed',
                desc: 'The agent arrives at the property, conducts a professional showing, and follows your specific instructions.',
              },
              {
                num: 4,
                title: 'Receive Your Summary',
                desc: 'Within 2 hours of the visit ending, the agent submits a detailed post-visit summary to your dashboard.',
              },
              {
                num: 5,
                title: 'Review & Rate',
                desc: "Review the summary, leave a rating, and book the agent's same time next time.",
              },
            ].map(step => (
              <div key={step.num} className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-[#1a362d] text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                  {step.num}
                </div>
                <div className="flex-1 border border-gray-200 rounded-2xl px-6 py-5">
                  <h3 className="font-bold text-[#1a2a2a] mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <a
              href="/signup"
              className="inline-block bg-[#d69e5e] hover:bg-[#c58d4d] text-white px-8 py-4 rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-lg"
            >
              Book Your First Showing
            </a>
          </div>
        </div>
      </section>

      {/* For Agents */}
      <section className="py-20 lg:py-28 bg-[#faf9f6] px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em] mb-2">For Showing Agents</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2a2a] mb-14">Earn on your schedule</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                num: 1,
                title: 'Apply & Get Verified',
                desc: 'Submit your application. Upload your license and complete ID verification.',
              },
              {
                num: 2,
                title: 'Browse Available Jobs',
                desc: 'Browse the request feed, filter by service type, location, date and compensation range.',
              },
              {
                num: 3,
                title: 'Accept or Counter',
                desc: 'Accept the listing for the full fee, or propose a different fee and let the requester approve.',
              },
              {
                num: 4,
                title: 'Complete the Visit',
                desc: 'Show up on time, conduct the service professionally, follow specific instructions.',
              },
              {
                num: 5,
                title: 'Submit Summary & Get Paid',
                desc: 'Within 2 hours of the visit, submit your summary. Payment processed within 1–2 business days.',
              },
            ].map(step => (
              <div key={step.num} className="flex flex-col items-center text-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#1a362d] text-white flex items-center justify-center font-bold text-sm mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-[#1a2a2a] text-sm mb-2">{step.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/agent/apply"
              className="inline-flex items-center gap-2 bg-[#d69e5e] hover:bg-[#c58d4d] text-white px-8 py-4 rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-lg"
            >
              🪪 Join as Agent
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em] mb-2 text-center">Why Veyro</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2a2a] mb-14 text-center">Built for busy real estate professionals</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: 'Instant Matching',
                desc: 'Most requests go live and are picked up in under 3 minutes, even for same-day appointments.',
              },
              {
                icon: '🪪',
                title: 'License Verified',
                desc: 'Every agent on the platform holds an active, state-verified real estate license.',
              },
              {
                icon: '💰',
                title: 'No Monthly Fees',
                desc: 'Zero subscription costs. You only pay per showing or earn per showing. Simple and fair.',
              },
              {
                icon: '📋',
                title: 'Detailed Summaries',
                desc: 'After every showing, agents submit a detailed summary with photos, visitor notes, and next steps.',
              },
              {
                icon: '⭐',
                title: 'Ratings & Reviews',
                desc: 'Every showing is rated. Top-rated agents get priority placement in the request feed.',
              },
              {
                icon: '🕐',
                title: 'Same Day Available',
                desc: 'Submit a request as little as 3 hours in advance and get matched the same day.',
              },
            ].map(f => (
              <div key={f.title} className="bg-[#faf9f6] border border-gray-100 rounded-2xl p-6 space-y-3">
                <div className="text-2xl">{f.icon}</div>
                <h3 className="font-bold text-[#1a2a2a]">{f.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a362d] py-16 text-center px-6">
        <h2 className="text-2xl lg:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
        <p className="text-white/60 font-medium mb-8 max-w-lg mx-auto">
          Join 500+ professionals already using Veyro to delegate showings and grow their business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/signup" className="bg-[#d69e5e] hover:bg-[#c58d4d] text-white px-8 py-4 rounded-2xl font-bold transition-all hover:-translate-y-1">
            Make a Booking
          </a>
          <a href="/agent/apply" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-2xl font-bold transition-all">
            🪪 Join as Agent
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
