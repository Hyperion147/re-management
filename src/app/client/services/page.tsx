'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import ServiceRequestModal from '@/components/ServiceRequestModal';
import type { ServiceType } from '@/hooks/useNewRequest';

type Category = 'All Services' | 'Buying' | 'Selling' | 'Homeowner Tasks';

interface ServiceItem {
  name: ServiceType;
  description: string;
  price: string;
  category: Exclude<Category, 'All Services'>;
  emoji: string;
}

const MODAL_SERVICES: Record<ServiceType, { minimumCompensation: number }> = {
  'Private Home Showing': { minimumCompensation: 40 },
  'Multi-Home Tour': { minimumCompensation: 40 },
  'Request a Task': { minimumCompensation: 40 },
  'Virtual Walkthrough': { minimumCompensation: 50 },
  'Buyer Consultation': { minimumCompensation: 99 },
  'Flat Fee Agent': { minimumCompensation: 35 },
  'Market Analysis (CMA)': { minimumCompensation: 60 },
  'Listing Consultation': { minimumCompensation: 99 },
  'Open House Hosting': { minimumCompensation: 60 },
  'Property Photography': { minimumCompensation: 99 },
  'Move-In / Move-Out Cleaning': { minimumCompensation: 75 },
  'Home Staging': { minimumCompensation: 150 },
  'Inspection Coordination': { minimumCompensation: 75 },
  'Lockbox Access Support': { minimumCompensation: 45 },
};

const SERVICES: ServiceItem[] = [
  {
    name: 'Private Home Showing',
    description: 'Get a licensed agent to show you any property at a time that works for you.',
    price: 'From ₹40',
    category: 'Buying',
    emoji: '🏠',
  },
  {
    name: 'Multi-Home Tour',
    description: 'Tour 2-6 properties in one booking. Bundle & save vs. separate showings.',
    price: 'From ₹40/home',
    category: 'Buying',
    emoji: '📍',
  },
  {
    name: 'Request a Task',
    description:
      'Need someone to check on your home? Book a local agent to complete a quick task at your property.',
    price: 'From ₹40',
    category: 'Homeowner Tasks',
    emoji: '✅',
  },
  {
    name: 'Virtual Walkthrough',
    description: "Can't visit in person? Get a live video walkthrough with an agent.",
    price: 'From ₹50',
    category: 'Buying',
    emoji: '📹',
  },
  {
    name: 'Buyer Consultation',
    description: 'One-on-one strategy session with a licensed agent about your buying journey.',
    price: 'From ₹99',
    category: 'Buying',
    emoji: '🤝',
  },
  {
    name: 'Flat Fee Agent',
    description:
      'Get a licensed agent to handle your transaction end-to-end. Pay only a small platform fee at closing.',
    price: 'Success Fee Only',
    category: 'Selling',
    emoji: '🪪',
  },
  {
    name: 'Market Analysis (CMA)',
    description: 'Get a detailed comparative market analysis report for any property.',
    price: 'From ₹60',
    category: 'Selling',
    emoji: '📊',
  },
  {
    name: 'Listing Consultation',
    description: 'Get expert advice on pricing, staging, and selling your home.',
    price: 'From ₹99',
    category: 'Selling',
    emoji: '📋',
  },
  {
    name: 'Open House Hosting',
    description:
      'Book a verified agent to professionally host your open house - greet visitors, sign in guests, collect leads.',
    price: 'From ₹60',
    category: 'Selling',
    emoji: '🏡',
  },
  {
    name: 'Property Photography',
    description: 'Professional real estate photography to showcase your home in its best light.',
    price: 'From ₹99',
    category: 'Selling',
    emoji: '📸',
  },
  {
    name: 'Move-In / Move-Out Cleaning',
    description: 'Thorough professional cleaning for move-in or move-out transitions.',
    price: 'From ₹75',
    category: 'Homeowner Tasks',
    emoji: '🧹',
  },
  {
    name: 'Home Staging',
    description: 'Expert home staging to attract buyers and maximize your sale price.',
    price: 'From ₹150',
    category: 'Selling',
    emoji: '🛋️',
  },
  {
    name: 'Inspection Coordination',
    description: 'Coordinate property inspections with qualified inspectors.',
    price: 'From ₹75',
    category: 'Selling',
    emoji: '🔍',
  },
  {
    name: 'Lockbox Access Support',
    description: 'Licensed agent to assist with property access where legally allowed.',
    price: 'From ₹45',
    category: 'Buying',
    emoji: '🔑',
  },
];

const CATEGORIES: Category[] = ['All Services', 'Buying', 'Selling', 'Homeowner Tasks'];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All Services');
  const [activeModalService, setActiveModalService] = useState<ServiceType | null>(null);
  const [serviceModalVersion, setServiceModalVersion] = useState(0);

  const filtered =
    activeCategory === 'All Services'
      ? SERVICES
      : SERVICES.filter((service) => service.category === activeCategory);

  return (
    <>
      {activeModalService ? (
        <ServiceRequestModal
          key={`₹{activeModalService}-₹{serviceModalVersion}`}
          isOpen
          serviceType={activeModalService}
          minimumCompensation={MODAL_SERVICES[activeModalService].minimumCompensation}
          onClose={() => setActiveModalService(null)}
        />
      ) : null}

      <div className="mx-auto max-w-5xl space-y-8 px-8 py-10 pb-24">
        <div className="space-y-3">
          <span className="inline-block rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-accent">
            On-Demand
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Real Estate Services</h1>
          <p className="max-w-xl text-sm font-medium leading-relaxed text-gray-500">
            Instantly connect with licensed agents for{' '}
            <span className="font-bold text-accent">any</span> real estate need. Choose a
            service, pick a time, and get help on demand.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-all ₹{
                activeCategory === category
                  ? 'border-[#1a2a2a] bg-[#1a2a2a] text-white'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-4">
          <p className="text-xs font-medium text-gray-500">
            Are you a licensed agent?{' '}
            <span className="font-bold text-foreground">Earn by fulfilling these requests.</span>
          </p>
          <Link
            href="/?auth=signup"
            className="whitespace-nowrap text-xs font-black uppercase tracking-widest text-accent hover:underline"
          >
            Join as Agent &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <ServiceCard
              key={service.name}
              service={service}
              onModalServiceClick={(serviceType) => {
                setServiceModalVersion((current) => current + 1);
                setActiveModalService(serviceType);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function ServiceCard({
  service,
  onModalServiceClick,
}: {
  service: ServiceItem;
  onModalServiceClick: (serviceType: ServiceType) => void;
}) {
  const opensModal = service.name !== 'Flat Fee Agent';
  const cardClassName =
    'group block w-full rounded-2xl border border-gray-100 bg-white p-6 text-left transition-all hover:border-gray-200 hover:shadow-md';

  const content = (
    <>
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-xl transition-colors group-hover:bg-gray-200">
          {service.emoji}
        </div>
        <svg
          className="mt-1 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
      <h3 className="mb-1 text-sm font-bold text-foreground transition-colors group-hover:text-green-800">
        {service.name}
      </h3>
      <p className="mb-4 line-clamp-2 text-xs font-medium leading-relaxed text-gray-400">
        {service.description}
      </p>
      <p
        className={`text-xs font-bold ₹{
          service.price === 'Success Fee Only' ? 'text-green-600' : 'text-gray-500'
        }`}
      >
        {service.price}
      </p>
    </>
  );

  if (opensModal) {
    return (
      <button type="button" onClick={() => onModalServiceClick(service.name)} className={cardClassName}>
        {content}
      </button>
    );
  }

  return (
    <Link href={`/client/new-request?type=₹{encodeURIComponent(service.name)}`} className={cardClassName}>
      {content}
    </Link>
  );
}
