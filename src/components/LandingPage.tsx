'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ServiceRequestModal from '@/components/ServiceRequestModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Home, 
  Video, 
  Briefcase, 
  BarChart3, 
  Calendar, 
  Camera,
  Target,
  Handshake,
  Sparkles,
  Star
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<{
    type: string;
    compensation: number;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  const openModal = (type: string, compensation: number) => {
    setSelectedService({ type, compensation });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Small delay to ensure DOM is fully painted before GSAP reads positions
    const ctx = gsap.context(() => {

      // Hero parallax — only run if hero is tall enough
      if (heroRef.current) {
        gsap.to('.hero-content', {
          y: 80,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // Stats counter animation
      document.querySelectorAll('.stat-number').forEach((stat) => {
        const target = parseInt(stat.getAttribute('data-target') || '0');
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            once: true,
          },
          onUpdate() {
            stat.textContent = Math.round(obj.val).toString();
          },
        });
      });

      // Bento grid — each card individually, guaranteed visible on completion
      document.querySelectorAll('.bento-card').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: i * 0.08,
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              once: true,
            },
          }
        );
      });

    });

    return () => ctx.revert(); // clean up all ScrollTriggers on unmount
  }, [mounted]);

  return (
    <div className="relative min-h-screen bg-[#F5F7F5] font-sans text-[#000101] overflow-hidden scroll-smooth">
      <Navbar />
      
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #013D1F 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating gradient orbs */}
      <div className="fixed top-20 right-20 w-96 h-96 bg-[#39FF14]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-40 left-20 w-80 h-80 bg-[#087A32]/3 rounded-full blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 md:px-8 pt-20">
        <div className="hero-content relative z-10 max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#39FF14]/20 shadow-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
            <span className="text-[#013D1F] text-sm font-semibold">India's First On-Demand Real Estate Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 tracking-tight">
            Real Estate Services,
            <br />
            <span className="text-[#39FF14]">On Demand</span>
          </h1>

          <p className="text-lg md:text-xl text-[#013D1F]/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Book verified agents for showings, tours, and consultations. Pay only for the services you need—no commissions, no long-term contracts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <button
              onClick={() => openModal('Home Showings', 2300)}
              className="group px-10 py-5 bg-[#39FF14] hover:bg-[#087A32] text-[#000101] hover:text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Book a Service
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <Link
              href="/agent/apply"
              className="px-10 py-5 bg-white hover:bg-[#000101] text-[#000101] hover:text-white border-2 border-[#000101]/10 hover:border-[#000101] rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg"
            >
              Become an Agent
            </Link>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: 500, suffix: '+', label: 'Verified Agents' },
              { value: 2000, suffix: '+', label: 'Services Completed' },
              { value: 15, suffix: '+', label: 'Cities Covered' },
              { value: 98, suffix: '%', label: 'Satisfaction Rate' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-[#39FF14] mb-2">
                  <span className="stat-number" data-target={stat.value} suppressHydrationWarning>
                    {mounted ? 0 : stat.value}
                  </span>
                  {stat.suffix}
                </div>
                <div className="text-sm text-[#013D1F]/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Section - Services Showcase */}
      <section id="services" ref={bentoRef} className="relative py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Services <span className="text-[#39FF14]">On Your Terms</span>
            </h2>
            <p className="text-xl text-[#013D1F]/70 max-w-2xl mx-auto">
              Professional real estate services without traditional commitments
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Large Featured Card */}
            <div className="bento-card md:col-span-2 md:row-span-2 bg-linear-to-br from-[#39FF14] to-[#087A32] rounded-3xl p-8 relative overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Home className="w-7 h-7 text-white" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">Home Showings</h3>
                  <p className="text-white/80 text-lg mb-6">Professional agents show you properties on your schedule. Available 7 days a week with flexible timing options.</p>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-bold mb-1">Starting from</p>
                    <div className="text-4xl font-black text-white">₹2,300</div>
                  </div>
                  <button 
                    onClick={() => openModal('Home Showings', 2300)}
                    className="px-6 py-3 bg-white text-[#087A32] hover:bg-[#000101] hover:text-[#39FF14] rounded-xl font-bold transition-all">
                    Book Now
                  </button>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            </div>

            {/* Virtual Tours */}
            <div 
              onClick={() => openModal('Virtual Tours', 1800)}
              className="bento-card bg-white rounded-3xl p-6 border border-[#000101]/5 hover:border-[#39FF14]/30 hover:shadow-xl transition-all duration-500 cursor-pointer group">
              <div className="w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center mb-3">
                <Video className="w-6 h-6 text-[#087A32]" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">Virtual Tours</h3>
              <p className="text-[#013D1F]/60 text-sm mb-4">Live video walkthroughs from anywhere</p>
              <div className="text-2xl font-black text-[#39FF14]">₹1,800</div>
            </div>

            {/* Buyer Consultation */}
            <div 
              onClick={() => openModal('Buyer Consultations', 3500)}
              className="bento-card bg-[#013D1F] text-white rounded-3xl p-6 hover:shadow-xl transition-all duration-500 cursor-pointer group">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-3">
                <Briefcase className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">Consultations</h3>
              <p className="text-white/70 text-sm mb-4">Expert guidance for buyers & sellers</p>
              <div className="text-2xl font-black text-[#39FF14]">₹3,500</div>
            </div>

            {/* CMA Reports */}
            <div 
              onClick={() => openModal('CMA Reports', 4500)}
              className="bento-card bg-white rounded-3xl p-6 border border-[#000101]/5 hover:border-[#39FF14]/30 hover:shadow-xl transition-all duration-500 cursor-pointer">
              <div className="w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center mb-3">
                <BarChart3 className="w-6 h-6 text-[#087A32]" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">CMA Reports</h3>
              <p className="text-[#013D1F]/60 text-sm mb-4">Detailed market analysis reports</p>
              <div className="text-2xl font-black text-[#39FF14]">₹4,500</div>
            </div>

            {/* Open House */}
            <div 
              onClick={() => openModal('Open House Hosting', 8000)}
              className="bento-card md:col-span-2 bg-gradient-to-br from-white to-[#F5F7F5] rounded-3xl p-8 border border-[#000101]/5 hover:border-[#39FF14]/30 hover:shadow-xl transition-all duration-500 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-[#39FF14]/10 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-[#087A32]" strokeWidth={2.5} />
                </div>
                <span className="px-3 py-1 bg-[#39FF14]/10 text-[#013D1F] rounded-full text-xs font-bold">Popular</span>
              </div>
              <h3 className="text-2xl font-black mb-2">Open House Hosting</h3>
              <p className="text-[#013D1F]/60 mb-4">Professional hosting for your property with full support and reporting</p>
              <div className="text-3xl font-black text-[#39FF14]">₹8,000</div>
            </div>

            {/* Photography */}
            <div 
              onClick={() => openModal('Photography', 5500)}
              className="bento-card bg-white rounded-3xl p-6 border border-[#000101]/5 hover:border-[#39FF14]/30 hover:shadow-xl transition-all duration-500 cursor-pointer">
              <div className="w-12 h-12 bg-[#39FF14]/10 rounded-xl flex items-center justify-center mb-3">
                <Camera className="w-6 h-6 text-[#087A32]" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-bold mb-2">Photography</h3>
              <p className="text-[#013D1F]/60 text-sm mb-4">Professional property photography</p>
              <div className="text-2xl font-black text-[#39FF14]">₹5,500</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-40 px-4 md:px-8 bg-gradient-to-b from-white via-[#F5F7F5] to-white overflow-hidden">

        {/* Layered decorative backgrounds */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at 20% 30%, rgba(57,255,20,0.06) 0%, transparent 50%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(circle at 80% 70%, rgba(8,122,50,0.04) 0%, transparent 50%)' }} />
        </div>

        {/* Floating accent circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#39FF14]/5 rounded-full blur-2xl" />
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-[#087A32]/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto relative z-10">

          {/* Header */}
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white border border-[#39FF14]/25 shadow-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
              <span className="text-xs font-black text-[#087A32] uppercase tracking-[0.2em]">Simple Process</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-[#000101] mb-6 leading-[1.1]">
              How <span className="text-[#39FF14]">It Works</span>
            </h2>
            <p className="text-xl text-[#013D1F]/70 max-w-2xl mx-auto leading-relaxed">
              From booking to completion in four simple steps.<br />
              Professional service delivery, every single time.
            </p>
          </div>

          {/* Cards Container */}
          <div className="grid md:grid-cols-4 gap-8 relative">

            {/* Animated connector line (desktop) */}
            <div className="hidden md:block absolute top-[72px] left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#39FF14]/20 via-[#39FF14]/30 to-[#39FF14]/20" />

            {/* Connector dots between cards */}
            {[0, 1, 2].map(i => (
              <div 
                key={i} 
                className="hidden md:flex absolute items-center justify-center z-20" 
                style={{ left: `calc(${(i + 1) * 25}% - 4px)`, top: '70px' }}
              >
                <div className="w-3 h-3 rounded-full bg-white border-2 border-[#39FF14] shadow-lg" />
              </div>
            ))}

            {[
              {
                step: '01',
                title: 'Choose Service',
                desc: 'Browse and select from 13+ professional real estate services. Pick the perfect one for your unique requirements.',
                icon: Target,
                badge: '13+ Services Available',
                badgeIcon: Target,
                gradient: 'from-[#39FF14]/5 to-transparent',
              },
              {
                step: '02',
                title: 'Match Agent',
                desc: 'Our system instantly connects you with verified, licensed agents in your city with proven track records.',
                icon: Handshake,
                badge: 'Verified & Licensed',
                badgeIcon: Handshake,
                gradient: 'from-[#087A32]/5 to-transparent',
              },
              {
                step: '03',
                title: 'Get Service',
                desc: 'Professional agent delivers the service at your scheduled time with complete quality assurance.',
                icon: Sparkles,
                badge: 'Quality Assured',
                badgeIcon: Sparkles,
                gradient: 'from-[#39FF14]/5 to-transparent',
              },
              {
                step: '04',
                title: 'Pay & Review',
                desc: 'Pay only for completed services using secure payment. Rate your experience and help others choose better.',
                icon: Star,
                badge: 'Secure & Transparent',
                badgeIcon: Star,
                gradient: 'from-[#013D1F]/5 to-transparent',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const BadgeIcon = item.badgeIcon;
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-[28px] border-2 border-[#000101]/8 p-8 hover:border-[#39FF14]/50 hover:shadow-2xl transition-all duration-500 flex flex-col gap-6 cursor-default transform hover:-translate-y-2"
                >
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 rounded-[28px] bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10 flex flex-col gap-6 h-full">
                    {/* Step number badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#39FF14] tracking-[0.15em]">{item.step}</span>
                      <div className="w-8 h-8 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
                      </div>
                    </div>

                    {/* Icon container */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#39FF14]/10 to-[#39FF14]/5 border border-[#39FF14]/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#39FF14]/15 group-hover:border-[#39FF14]/40 transition-all duration-500 shadow-sm">
                      <Icon className="w-8 h-8 text-[#087A32]" strokeWidth={2} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-[#000101] mb-3 group-hover:text-[#087A32] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[#013D1F]/70 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Bottom badge with subtle separation */}
                    <div className="pt-6 border-t border-[#000101]/8">
                      <div className="flex items-center gap-2.5 text-xs font-bold text-[#087A32] bg-[#39FF14]/5 px-3 py-2 rounded-xl border border-[#39FF14]/15">
                        <BadgeIcon className="w-4 h-4 text-[#39FF14]" strokeWidth={2.5} />
                        <span>{item.badge}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA hint */}
          <div className="text-center mt-20">
            <p className="text-[#013D1F]/50 text-sm font-medium mb-4">Ready to experience the difference?</p>
            <button
              onClick={() => openModal('Home Showings', 2300)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#39FF14] hover:bg-[#087A32] text-[#000101] hover:text-white rounded-2xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>Get Started Now</span>
              <span className="text-lg">→</span>
            </button>
          </div>

        </div>
      </section>

      {/* Coverage Section */}
      <section id="coverage" className="relative py-24 px-4 md:px-8 bg-[#F5F7F5]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-[#39FF14]">15+ Cities</span> and Counting
            </h2>
            <p className="text-xl text-[#013D1F]/70">Expanding across India's major metros</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { city: 'Mumbai', state: 'Maharashtra', agents: '150+', color: 'from-[#39FF14] to-[#087A32]' },
              { city: 'Delhi NCR', state: 'National Capital', agents: '120+', color: 'from-[#087A32] to-[#013D1F]' },
              { city: 'Bangalore', state: 'Karnataka', agents: '100+', color: 'from-[#013D1F] to-[#39FF14]' },
              { city: 'Hyderabad', state: 'Telangana', agents: '80+', color: 'from-[#39FF14] to-[#013D1F]' },
              { city: 'Pune', state: 'Maharashtra', agents: '70+', color: 'from-[#087A32] to-[#39FF14]' },
              { city: 'Chennai', state: 'Tamil Nadu', agents: '65+', color: 'from-[#013D1F] to-[#087A32]' },
            ].map((city, i) => (
              <div
                key={i}
                className="relative bg-white rounded-2xl p-8 border border-[#000101]/5 hover:border-[#39FF14]/30 hover:shadow-xl transition-all duration-500 cursor-pointer group overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${city.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-1">{city.city}</h3>
                  <p className="text-[#013D1F]/60 text-sm mb-4">{city.state}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#39FF14]/10 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
                    <span className="text-sm font-bold text-[#013D1F]">{city.agents} agents</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-24 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              Common <span className="text-[#39FF14]">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'How does pricing work?', a: 'Simple flat fees per service. No hidden costs or commissions.' },
              { q: 'Are agents verified?', a: 'Yes, all agents are licensed and background-checked.' },
              { q: 'Can I cancel a booking?', a: 'Free cancellation up to 24 hours before service.' },
              { q: 'What areas do you cover?', a: 'Currently available in 15+ major Indian cities.' },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-[#F5F7F5] hover:bg-white border border-[#000101]/5 hover:border-[#39FF14]/30 rounded-2xl p-6 cursor-pointer transition-all duration-300"
              >
                <summary className="text-lg font-bold flex items-center justify-between">
                  {faq.q}
                  <span className="text-[#39FF14] text-2xl group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-[#013D1F]/70">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4 md:px-8 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 text-[#000101]">
            Ready to Get Started?
          </h2>
          <p className="text-xl md:text-2xl text-[#013D1F]/70 mb-12 leading-relaxed max-w-3xl mx-auto">
            Join thousands using India's most innovative real estate platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => openModal('Home Showings', 2300)}
              className="px-12 py-5 bg-[#39FF14] hover:bg-[#087A32] text-[#000101] hover:text-white rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Book Your First Service
            </button>
            <Link
              href="/agent/apply"
              className="px-12 py-5 bg-white hover:bg-[#000101] text-[#000101] hover:text-white border-2 border-[#000101]/10 hover:border-[#000101] rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg"
            >
              Become an Agent
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {showModal && selectedService && (
        <ServiceRequestModal 
          isOpen={showModal}
          serviceType={selectedService.type as any}
          minimumCompensation={selectedService.compensation}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
