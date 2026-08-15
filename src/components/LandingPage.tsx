import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-[#1a2a2a] scroll-smooth">
            <Navbar />

            {/* Hero Section */}
            <section
                id="solutions"
                className="relative bg-[#1a362d] pt-32 lg:pt-44 pb-12 lg:pb-16 overflow-hidden"
            >
                {/* Grid Background Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03] pointer-events-none"
                ></div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl space-y-6 lg:space-y-8">
                        <div className="inline-flex items-center gap-2 bg-[#2a453c]/50 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                            <span className="text-[10px] font-black text-white/90 uppercase tracking-[0.2em]">
                                🤝 TRUSTED BY 500+ REAL ESTATE PROFESSIONALS
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                            Real estate help,{" "}
                            <span className="text-[#d69e5e]">
                                when you need it
                            </span>
                        </h1>

                        <p className="text-base lg:text-lg text-white/80 font-medium leading-relaxed max-w-2xl">
                            From private showings to offers and open houses. Connect with licensed agents or delegate tasks on demand.
                        </p>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                            <a
                                href="/signup"
                                className="bg-[#d69e5e] hover:bg-[#c58d4d] text-white px-8 py-4 rounded-2xl text-base font-bold shadow-xl shadow-black/10 transition-all hover:-translate-y-1 text-center"
                            >
                                Get Started Free
                            </a>
                            <a
                                href="/login"
                                className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 py-4 rounded-2xl text-base font-bold backdrop-blur-sm transition-all text-center"
                            >
                                Sign In
                            </a>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pt-8 lg:pt-10 border-t border-white/5">
                            <HeroStat value="97%" label="Request pickup rate" />
                            <HeroStat
                                value="<3 min"
                                label="Average match time"
                            />
                            <HeroStat value="4.8★" label="Agent rating" />
                            <HeroStat value="10K+" label="Showings completed" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Row */}
            <section className="bg-[#fcfaf7] py-12 lg:py-16 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    <SmallStat value="500+" label="Licensed Showing Agents" />
                    <SmallStat value="50+" label="Markets Covered" />
                    <SmallStat value="$28–$367" label="Per-Showing Earnings" />
                    <SmallStat value="Zero" label="Monthly Fees" />
                </div>
            </section>



            {/* Services Section */}
            <section id="services" className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16 lg:space-y-20">
                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em]">
                            What we offer
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#1a2a2a]">
                            Every showing service, covered by licensed
                            professionals
                        </h2>
                        <p className="text-sm lg:text-base text-gray-400 font-medium max-w-2xl mx-auto">
                            From a single buyer tour to a full open house
                            weekend — Veyro agents handle it all so you can
                            focus on closing deals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        <ServiceCard
                            icon="🏠"
                            title="Buyer Showings"
                            desc="A licensed agent meets your client, conducts a professional tour, and submits a detailed visit summary — you keep your commission."
                            linkText="Book a Showing →"
                        />
                        <ServiceCard
                            icon="🏡"
                            title="Open House Hosting"
                            desc="Professional agents greet visitors, collect leads, answer questions, and deliver post-event reports."
                            linkText="Book a Host →"
                        />
                        <ServiceCard
                            icon="📄"
                            title="Property Reports"
                            desc="Detailed condition reports with photos, repair notes, and interest assessments — advise clients remotely with confidence."
                            linkText="Order a Report →"
                        />
                        <ServiceCard
                            icon="🔑"
                            title="Lockbox Services"
                            desc="Lockbox placement, retrieval, or exchange. Our agents handle logistical tasks so you don't need to make unnecessary trips."
                            linkText="Book Lockbox →"
                        />
                        <ServiceCard
                            icon="🤝"
                            title="Flat Fee Agent"
                            desc="Connect with a licensed real estate agent for specific services at transparent flat rate pricing."
                            linkText="Request a Flat Fee Agent →"
                        />
                        <div className="bg-[#112424] p-8 lg:p-10 rounded-[2.5rem] shadow-xl text-white space-y-6 flex flex-col justify-between group hover:scale-[1.02] transition-transform">
                            <div className="space-y-4">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">
                                    🪪
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">
                                    Become a Showing Agent
                                </h3>
                                <p className="text-white/60 font-medium leading-relaxed">
                                    Licensed agent? Earn $28–$367 per showing on
                                    a flexible schedule. Accept only what fits
                                    your calendar.
                                </p>
                            </div>
                            <a
                                href="/signup"
                                className="text-white font-bold group-hover:translate-x-2 transition-transform"
                            >
                                Apply Now →
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coverage Section */}
            <section id="coverage" className="py-20 lg:py-32 bg-[#faf9f6]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em]">
                            Coverage
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#1a2a2a]">
                            Nationwide reach
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                        <CoverageCard
                            icon="🏙️"
                            title="Major Metros"
                            desc="Comprehensive coverage in top 50 MSAs with sub-10 minute match times."
                            color="bg-[#e8f3f0]"
                        />
                        <CoverageCard
                            icon="🏘️"
                            title="Suburbs & Exurbs"
                            desc="Reliable network of agents willing to travel for your remote listings."
                            color="bg-[#fff9eb]"
                        />
                        <CoverageCard
                            icon="🗺️"
                            title="Expanding Daily"
                            desc="Don't see your market? Request it. We launch new markets based on demand."
                            color="bg-[#f0f4f8]"
                        />
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section
                id="how-it-works"
                className="py-20 lg:py-32 bg-[#faf9f6]"
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-12 lg:space-y-16">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em]">
                            Simple Process
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#1a2a2a]">
                            Up and running in minutes
                        </h2>
                        <p className="text-sm lg:text-base text-gray-400 font-medium">
                            No contracts, no monthly fees. Pay only for the
                            showings you book.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-6 lg:top-7 left-[10%] right-[10%] h-[1px] bg-[#112424]/20 -z-10" />

                        <ProcessStep
                            num={1}
                            title="Create Your Request"
                            desc="Enter the property, service type, date, and agent fee. Takes under 2 minutes."
                        />
                        <ProcessStep
                            num={2}
                            title="Agent Gets Matched"
                            desc="Licensed local agents are notified instantly. Most requests accepted within 3 minutes."
                        />
                        <ProcessStep
                            num={3}
                            title="Showing Completed"
                            desc="Agent conducts the showing and submits a detailed post-visit summary with photos."
                        />
                        <ProcessStep
                            num={4}
                            title="Review & Rate"
                            desc="Review the summary, leave feedback for the agent, and book your next showing instantly."
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-12 lg:space-y-20">
                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em]">
                            What agents say
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-[#1a2a2a]">
                            Trusted by real estate professionals
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        <TestimonialCard
                            name="Jamie R."
                            role="Property Manager, Miami FL"
                            initials="JR"
                            quote="Veyro helped us keep tours moving during peak season — zero scheduling headaches. The agents are professional and the summaries are genuinely useful."
                        />
                        <TestimonialCard
                            name="Monica L."
                            role="Listing Lead, Chicago IL"
                            initials="ML"
                            quote="The post-tour notes make it easy to follow up with prospects. I can manage twice as many buyers now without burning out."
                        />
                        <TestimonialCard
                            name="Priya K."
                            role="Realtor, Austin TX"
                            initials="PK"
                            quote="Open house hosts were professional and on time. My clients couldn't tell the difference. I made an extra $18K this quarter."
                        />
                    </div>
                </div>
            </section>

            {/* Agent Pitch Banner */}
            <section className="bg-[#112424] py-14 lg:py-20">
                <div className="max-w-5xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-3 text-center md:text-left">
                        <p className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em]">For Licensed Agents</p>
                        <h2 className="text-2xl lg:text-3xl font-bold text-white">Earn $28–$367 per showing on your schedule</h2>
                        <p className="text-white/60 font-medium text-sm max-w-lg">
                            No monthly fees. No contracts. Accept only the jobs you want. Get paid within 1–2 business days.
                        </p>
                    </div>
                    <div className="flex-shrink-0">
                        <a
                            href="/agent/apply"
                            className="inline-flex items-center gap-2 bg-[#d69e5e] hover:bg-[#c58d4d] text-white px-8 py-4 rounded-2xl font-bold transition-all hover:-translate-y-1 shadow-xl whitespace-nowrap"
                        >
                            🪪 Join as Agent
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 lg:py-32 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12 lg:space-y-16">
                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-black text-[#d69e5e] uppercase tracking-[0.2em]">
                            FAQ
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-[#1a2a2a]">
                            Common questions
                        </h2>
                    </div>

                    <div className="space-y-4 lg:space-y-4">
                        <FAQItem
                            question="How quickly can I schedule a showing?"
                            answer="Most requests are accepted within 3 minutes. For same-day requests, we recommend providing at least 3 hours of notice."
                        />
                        <FAQItem
                            question="Are the agents licensed?"
                            answer="Yes, all agents on the Veyro platform are verified, licensed real estate professionals in their respective markets."
                        />
                        <FAQItem
                            question="How much does it cost?"
                            answer="Payments are handled securely through our platform once the visit summary is submitted and approved."
                        />
                        <FAQItem
                            question="Do I keep my commission?"
                            answer="You can cancel a request at any time. Cancellation fees may apply if an agent has already been matched and is on their way."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[#1a362d] py-20 lg:py-32">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
                        Ready to reclaim your time?
                    </h2>
                    <p className="text-base lg:text-lg text-white/60 font-medium max-w-2xl mx-auto">
                        Join 500+ real estate professionals delegating showings, growing their client base, and closing more deals with Veyro.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <a
                            href="/signup"
                            className="bg-[#d69e5e] hover:bg-[#c58d4d] text-white px-8 py-4 rounded-2xl text-base font-bold shadow-xl shadow-orange-900/20 transition-all hover:-translate-y-1"
                        >
                            Create Free Account
                        </a>
                        <a
                            href="/agent/apply"
                            className="bg-transparent hover:bg-white/5 text-white border border-white/20 px-8 py-4 rounded-2xl text-base font-bold transition-all"
                        >
                            Join as Agent →
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <div className="p-4 lg:p-6 rounded-xl border border-gray-200 bg-white flex justify-between items-center hover:border-gray-300 transition-all cursor-pointer">
            <h4 className="font-bold text-[#1a2a2a] text-sm lg:text-base">
                {question}
            </h4>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );
}

function HeroStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="space-y-1">
            <div className="text-xl lg:text-2xl font-bold text-white">
                {value}
            </div>
            <div className="text-[9px] lg:text-[10px] font-black text-white/40 uppercase tracking-widest leading-tight">
                {label}
            </div>
        </div>
    );
}

function SmallStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center space-y-2">
            <div className="text-3xl lg:text-5xl font-bold text-[#d69e5e] tracking-tight">
                {value}
            </div>
            <div className="text-[10px] lg:text-[11px] font-bold text-gray-500 uppercase tracking-[0.1em]">
                {label}
            </div>
        </div>
    );
}

function CoverageCard({
    icon,
    title,
    desc,
    color,
}: {
    icon: string;
    title: string;
    desc: string;
    color: string;
}) {
    return (
        <div
            className={`${color} p-6 lg:p-8 rounded-[2.5rem] border shadow-sm space-y-4 hover:translate-y-[-4px] transition-all duration-300`}
        >
            <div className="text-2xl">{icon}</div>
            <div className="space-y-1">
                <h4 className="font-bold text-[#1a2a2a] text-sm">{title}</h4>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    );
}

function ProcessStep({
    num,
    title,
    desc,
}: {
    num: number;
    title: string;
    desc: string;
}) {
    return (
        <div className="space-y-4 lg:space-y-6">
            <div
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center text-base lg:text-lg font-bold mx-auto transition-all bg-[#112424] text-white"
            >
                {num}
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-[#1a2a2a] text-sm lg:text-base">
                    {title}
                </h4>
                <p className="text-[10px] lg:text-[11px] text-gray-400 font-medium leading-relaxed max-w-[200px] mx-auto">
                    {desc}
                </p>
            </div>
        </div>
    );
}

function ServiceCard({
    icon,
    title,
    desc,
    linkText,
}: {
    icon: string;
    title: string;
    desc: string;
    linkText: string;
}) {
    return (
        <div className="bg-white p-8 lg:p-10 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-6 group hover:shadow-xl hover:border-gray-100 transition-all duration-500 hover:-translate-y-1">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#1a2a2a] tracking-tight group-hover:text-green-800 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                    {desc}
                </p>
            </div>
            <a
                href="/signup"
                className="inline-block text-[11px] font-black text-green-700 uppercase tracking-widest group-hover:translate-x-1 transition-transform"
            >
                {linkText}
            </a>
        </div>
    );
}

function TestimonialCard({
    name,
    role,
    quote,
    initials,
}: {
    name: string;
    role: string;
    quote: string;
    initials: string;
}) {
    return (
        <div className="bg-white p-8 lg:p-10 rounded-2xl border border-[#d69e5e]/40 shadow-sm space-y-6 lg:space-y-8">
            <div className="text-[#d69e5e] text-[10px] tracking-widest font-black">
                ★★★★★
            </div>
            <p className="text-sm text-[#1a2a2a]/80 font-medium leading-relaxed italic">
                "{quote}"
            </p>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#112424] rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {initials}
                </div>
                <div>
                    <div className="text-xs font-bold text-[#1a2a2a]">
                        {name}
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium">
                        {role}
                    </div>
                </div>
            </div>
        </div>
    );
}
