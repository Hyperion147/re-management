'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const featureTiles = [
  { label: '50+ Markets', description: 'Active coverage in major metros and growing suburban areas across the US.' },
  { label: 'Same-Day Available', description: 'Rush showings with 3+ hours notice in most covered markets.' },
  { label: '7 Days a Week', description: 'Including evenings, weekends, and holidays so your listing never waits.' },
  { label: 'Suburban Expanding', description: 'Coverage growing into secondary and suburban markets every month.' },
];

const activeMarkets = [
  'New York City, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL',
  'Houston, TX', 'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX',
  'San Diego, CA', 'Dallas, TX', 'Austin, TX', 'Denver, CO',
  'Seattle, WA', 'Boston, MA', 'Atlanta, GA', 'Tampa, FL',
  'Orlando, FL', 'Charlotte, NC', 'Nashville, TN', 'Las Vegas, NV',
  'Portland, OR', 'Minneapolis, MN', 'Detroit, MI', 'Baltimore, MD',
  'Raleigh, NC', 'Richmond, VA', 'Columbus, OH', 'Indianapolis, IN',
  'Sacramento, CA', 'Kansas City, MO', 'Louisville, KY', 'Memphis, TN',
];

const comingSoonMarkets = [
  'Salt Lake City, UT', 'San Jose, CA', 'Oklahoma City, OK', 'St. Louis, MO',
];

// ZIP prefix → city mapping for covered markets
const ZIP_COVERAGE: Record<string, string> = {
  '100': 'New York City, NY', '101': 'New York City, NY', '102': 'New York City, NY',
  '103': 'New York City, NY', '104': 'New York City, NY',
  '900': 'Los Angeles, CA', '901': 'Los Angeles, CA', '902': 'Los Angeles, CA',
  '903': 'Los Angeles, CA', '904': 'Los Angeles, CA', '905': 'Los Angeles, CA',
  '606': 'Chicago, IL', '607': 'Chicago, IL', '608': 'Chicago, IL',
  '331': 'Miami, FL', '330': 'Miami, FL', '332': 'Miami, FL', '333': 'Miami, FL',
  '770': 'Houston, TX', '772': 'Houston, TX', '773': 'Houston, TX',
  '850': 'Phoenix, AZ', '851': 'Phoenix, AZ', '852': 'Phoenix, AZ', '853': 'Phoenix, AZ',
  '191': 'Philadelphia, PA', '192': 'Philadelphia, PA', '193': 'Philadelphia, PA',
  '782': 'San Antonio, TX', '780': 'San Antonio, TX', '781': 'San Antonio, TX',
  '919': 'San Diego, CA', '920': 'San Diego, CA', '921': 'San Diego, CA', '922': 'San Diego, CA',
  '752': 'Dallas, TX', '750': 'Dallas, TX', '751': 'Dallas, TX', '753': 'Dallas, TX',
  '787': 'Austin, TX', '786': 'Austin, TX', '785': 'Austin, TX',
  '802': 'Denver, CO', '800': 'Denver, CO', '801': 'Denver, CO', '803': 'Denver, CO',
  '981': 'Seattle, WA', '980': 'Seattle, WA', '982': 'Seattle, WA', '983': 'Seattle, WA',
  '021': 'Boston, MA', '022': 'Boston, MA', '023': 'Boston, MA', '024': 'Boston, MA',
  '303': 'Atlanta, GA', '300': 'Atlanta, GA', '301': 'Atlanta, GA', '302': 'Atlanta, GA',
  '336': 'Tampa, FL', '335': 'Tampa, FL', '337': 'Tampa, FL',
  '328': 'Orlando, FL', '327': 'Orlando, FL', '329': 'Orlando, FL',
  '282': 'Charlotte, NC', '280': 'Charlotte, NC', '281': 'Charlotte, NC', '283': 'Charlotte, NC',
  '372': 'Nashville, TN', '370': 'Nashville, TN', '371': 'Nashville, TN', '373': 'Nashville, TN',
  '891': 'Las Vegas, NV', '889': 'Las Vegas, NV', '890': 'Las Vegas, NV',
  '972': 'Portland, OR', '970': 'Portland, OR', '971': 'Portland, OR', '973': 'Portland, OR',
  '554': 'Minneapolis, MN', '550': 'Minneapolis, MN', '551': 'Minneapolis, MN', '553': 'Minneapolis, MN',
  '482': 'Detroit, MI', '480': 'Detroit, MI', '481': 'Detroit, MI', '483': 'Detroit, MI',
  '212': 'Baltimore, MD', '210': 'Baltimore, MD', '211': 'Baltimore, MD', '213': 'Baltimore, MD',
  '276': 'Raleigh, NC', '275': 'Raleigh, NC', '277': 'Raleigh, NC', '278': 'Raleigh, NC',
  '232': 'Richmond, VA', '230': 'Richmond, VA', '231': 'Richmond, VA', '233': 'Richmond, VA',
  '432': 'Columbus, OH', '430': 'Columbus, OH', '431': 'Columbus, OH', '433': 'Columbus, OH',
  '462': 'Indianapolis, IN', '460': 'Indianapolis, IN', '461': 'Indianapolis, IN', '463': 'Indianapolis, IN',
  '958': 'Sacramento, CA', '956': 'Sacramento, CA', '957': 'Sacramento, CA', '959': 'Sacramento, CA',
  '641': 'Kansas City, MO', '640': 'Kansas City, MO', '642': 'Kansas City, MO',
  '402': 'Louisville, KY', '400': 'Louisville, KY', '401': 'Louisville, KY', '403': 'Louisville, KY',
  '381': 'Memphis, TN', '380': 'Memphis, TN', '382': 'Memphis, TN',
};

const ZIP_COMING_SOON: Record<string, string> = {
  '841': 'Salt Lake City, UT', '840': 'Salt Lake City, UT', '842': 'Salt Lake City, UT',
  '951': 'San Jose, CA', '950': 'San Jose, CA', '952': 'San Jose, CA',
  '731': 'Oklahoma City, OK', '730': 'Oklahoma City, OK', '732': 'Oklahoma City, OK',
  '631': 'St. Louis, MO', '630': 'St. Louis, MO', '632': 'St. Louis, MO',
};

type CoverageResult =
  | { status: 'covered'; market: string }
  | { status: 'coming-soon'; market: string }
  | { status: 'not-covered' }
  | null;

export default function CoveragePage() {
  const [zip, setZip] = useState('');
  const [result, setResult] = useState<CoverageResult>(null);
  const [checked, setChecked] = useState(false);

  const checkCoverage = () => {
    const trimmed = zip.trim();
    if (trimmed.length < 5 || !/^\d{5}$/.test(trimmed)) {
      setResult(null);
      setChecked(false);
      return;
    }
    const prefix3 = trimmed.slice(0, 3);
    const prefix2 = trimmed.slice(0, 2).padStart(3, '0');

    const coveredMarket = ZIP_COVERAGE[prefix3] || ZIP_COVERAGE[prefix2];
    if (coveredMarket) { setResult({ status: 'covered', market: coveredMarket }); setChecked(true); return; }

    const comingSoon = ZIP_COMING_SOON[prefix3] || ZIP_COMING_SOON[prefix2];
    if (comingSoon) { setResult({ status: 'coming-soon', market: comingSoon }); setChecked(true); return; }

    setResult({ status: 'not-covered' });
    setChecked(true);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#1a2a2a]">
      <Navbar />

      <main className="relative overflow-hidden">
        <section className="relative pt-28 pb-20 lg:pt-32 lg:pb-28 bg-[#1a362d] text-white">
          <div className="absolute inset-x-0 top-0 h-52 bg-[#112d24]" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-8">
                <div className="max-w-2xl space-y-4">
                  <p className="text-sm font-black uppercase tracking-[0.3em] text-[#d69e5e]">Coverage</p>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                    Agents ready in your market
                  </h1>
                  <p className="max-w-xl text-base sm:text-lg text-white/80 leading-8">
                    Our network spans 50+ markets across the US. Enter your ZIP to confirm coverage in your area.
                  </p>
                </div>

                {/* ZIP checker */}
                <div className="space-y-3">
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                    <label htmlFor="zipcode" className="sr-only">ZIP code</label>
                    <input
                      id="zipcode"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={zip}
                      onChange={e => { setZip(e.target.value.replace(/\D/g, '')); setChecked(false); setResult(null); }}
                      onKeyDown={e => e.key === 'Enter' && checkCoverage()}
                      placeholder="Enter ZIP code..."
                      className="min-w-0 rounded-full border border-white/10 bg-white/10 px-5 py-4 text-white placeholder:text-white/50 focus:border-[#d69e5e] focus:outline-none focus:ring-2 focus:ring-[#d69e5e]/20"
                    />
                    <button
                      onClick={checkCoverage}
                      disabled={zip.length !== 5}
                      className="rounded-full bg-[#d69e5e] px-6 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-[#c78f4b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Check Coverage
                    </button>
                  </div>

                  {/* Result banner */}
                  {checked && result && (
                    <div className={`rounded-2xl px-5 py-4 flex items-start gap-3 text-sm font-semibold ${
                      result.status === 'covered'
                        ? 'bg-green-500/20 border border-green-400/30 text-green-200'
                        : result.status === 'coming-soon'
                        ? 'bg-[#d69e5e]/20 border border-[#d69e5e]/30 text-[#d69e5e]'
                        : 'bg-red-500/10 border border-red-400/20 text-red-300'
                    }`}>
                      <span className="text-lg flex-shrink-0">
                        {result.status === 'covered' ? '✓' : result.status === 'coming-soon' ? '🕐' : '✗'}
                      </span>
                      <div>
                        {result.status === 'covered' && (
                          <>
                            <p className="font-bold">Coverage available in {result.market}!</p>
                            <p className="text-green-300/80 font-medium mt-0.5">Licensed agents are ready to take your showings in this area.</p>
                          </>
                        )}
                        {result.status === 'coming-soon' && (
                          <>
                            <p className="font-bold">{result.market} — Coming Soon</p>
                            <p className="text-[#d69e5e]/80 font-medium mt-0.5">We're expanding to this market. Sign up and we'll notify you when coverage is live.</p>
                          </>
                        )}
                        {result.status === 'not-covered' && (
                          <>
                            <p className="font-bold">Not yet covered in your area</p>
                            <p className="text-red-300/80 font-medium mt-0.5">We're expanding every month. Sign up to be notified when we reach your market.</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {featureTiles.map((tile) => (
                    <div key={tile.label} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                      <h2 className="text-lg font-bold text-white">{tile.label}</h2>
                      <p className="mt-3 text-sm leading-6 text-white/70">{tile.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[3rem] border border-white/10 bg-[#112424]/70 p-10 shadow-[0_45px_100px_rgba(0,0,0,0.35)]">
                <div className="space-y-6">
                  <div className="rounded-3xl bg-[#1f3f31] p-8">
                    <p className="text-sm uppercase tracking-[0.3em] text-[#8de3b8]/80">Active Markets</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                    {activeMarkets.map((market) => (
                      <span
                        key={market}
                        className={`rounded-full border px-4 py-2 text-sm font-bold shadow-sm shadow-black/10 cursor-default transition-colors ${
                          result?.status === 'covered' && (result as any).market === market
                            ? 'border-green-400/60 bg-green-500/20 text-green-200'
                            : 'border-white/10 bg-white/5 text-white'
                        }`}
                      >
                        {result?.status === 'covered' && (result as any).market === market && '✓ '}
                        {market}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-6">
                    <div className="grid gap-3 sm:grid-cols-2">
                      {comingSoonMarkets.map((market) => (
                        <span
                          key={market}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            result?.status === 'coming-soon' && (result as any).market === market
                              ? 'border-[#d69e5e]/50 bg-[#d69e5e]/10 text-[#d69e5e] font-bold'
                              : 'border-white/10 bg-white/5 text-white/60'
                          }`}
                        >
                          {market}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-white/60">
                      Don't see your market? We're expanding every month. Sign up and we'll notify you as soon as coverage reaches your area.
                    </p>
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center rounded-full bg-[#d69e5e] px-6 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white hover:bg-[#c78f4b] transition-all"
                    >
                      Join as an Agent & Expand Coverage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
