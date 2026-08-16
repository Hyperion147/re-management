import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-black font-sans text-white scroll-smooth">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-black pt-24 lg:pt-32 pb-20 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
                    {/* Placeholder for house image - replace with actual image */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800" />
                </div>

                <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 bg-veyro-deep/50 border border-veyro-green/20 px-4 py-2 rounded-full backdrop-blur-sm">
                                <span className="text-[10px] font-black text-veyro-green uppercase tracking-widest">
                                    ✓ TRUSTED BY 500+ REAL ESTATE PROFESSIONALS
                                </span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                                Real estate help,{" "}
                                <span className="text-veyro-green">
                                    when<br />you need it
                                </span>
                            </h1>

                            <p className="text-lg text-white/70 font-medium leading-relaxed max-w-xl">
                                From private showings to offers and open houses. Connect with licensed agents or delegate tasks on demand.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                                <a
                                    href="/signup"
                                    className="bg-veyro-green hover:bg-veyro-green/90 text-black px-8 py-4 rounded-xl text-base font-bold shadow-xl shadow-veyro-green/20 transition-all hover:scale-105 text-center"
                                >
                                    Get Started Free →
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="bg-white/5 hover:bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl text-base font-bold backdrop-blur-sm transition-all text-center flex items-center justify-center gap-2"
                                >
                                    <span>▶</span> How It Works
                                </a>
                            </div>

                            {/* Hero Stats */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 border-t border-white/10">
                                <HeroStat value="97%" label="Requests Accepted" />
                                <HeroStat value="<3 min" label="Average Match Time" />
                                <HeroStat value="4.8★" label="Agent Rating" />
                                <HeroStat value="10K+" label="Showings Completed" />
                            </div>
                        </div>

                        {/* Right Content - Property Card */}
                        <div className="relative lg:block hidden">
                            <div className="bg-veyro-deep/40 backdrop-blur-xl border border-veyro-green/20 rounded-2xl p-6 space-y-4">
                                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                                    {/* Placeholder for property image */}
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm text-white/50">Elevated Estates</div>
                                    <div className="flex items-center justify-between">
                                        <div className="text-3xl font-bold text-veyro-green">10,247+</div>
                                        <div className="text-sm text-white/70">This month</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-veyro-deep/30 backdrop-blur-sm border-y border-veyro-green/10 py-8">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatItem icon="👥" value="500+" label="Licensed<br/>Showing Agents" />
                    <StatItem icon="📍" value="50+" label="Markets<br/>Covered" />
                    <StatItem icon="💰" value="₹2,300-₹30,000" label="Per-Showing<br/>Earnings" />
                    <StatItem icon="✓" value="Zero" label="Monthly<br/>Fees" />
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="py-20 lg:py-32 bg-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-veyro-green uppercase tracking-widest">
                            WHAT WE OFFER
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white max-w-3xl">
                            Everything you need, handled by pros
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl">
                            Your agent's handle the property visits while you can focus on closing deals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Showings Card */}
                        <div className="bg-veyro-deep/20 border border-veyro-green/20 rounded-2xl p-8 space-y-6 hover:border-veyro-green/40 transition-all group">
                            <div className="w-14 h-14 bg-veyro-green/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                🏠
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white">Showings</h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Expert showings, same-home touring, and instant pre-offers at fixed or on demand.
                                </p>
                            </div>
                            <a href="/services/showings" className="inline-flex items-center text-veyro-green text-sm font-bold group-hover:translate-x-2 transition-transform">
                                Book a Showing →
                            </a>
                        </div>

                        {/* Lockbox Services Card */}
                        <div className="bg-veyro-deep/20 border border-veyro-green/20 rounded-2xl p-8 space-y-6 hover:border-veyro-green/40 transition-all group">
                            <div className="w-14 h-14 bg-veyro-green/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                🔑
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white">Lockbox Services</h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Placement, retrieval, or exchange — we handle lockbox logistics for you.
                                </p>
                            </div>
                            <a href="/services/lockbox" className="inline-flex items-center text-veyro-green text-sm font-bold group-hover:translate-x-2 transition-transform">
                                Need Lockbox →
                            </a>
                        </div>

                        {/* Flat Fee Agent Card */}
                        <div className="bg-veyro-deep/20 border border-veyro-green/20 rounded-2xl p-8 space-y-6 hover:border-veyro-green/40 transition-all group">
                            <div className="w-14 h-14 bg-veyro-green/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                🤝
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white">Flat Fee Agent</h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Need something custom? Connect with agents for specific services.
                                </p>
                            </div>
                            <a href="/services/agent" className="inline-flex items-center text-veyro-green text-sm font-bold group-hover:translate-x-2 transition-transform">
                                Request Agent →
                            </a>
                        </div>

                        {/* Property Reports */}
                        <div className="bg-veyro-deep/20 border border-veyro-green/20 rounded-2xl p-8 space-y-6 hover:border-veyro-green/40 transition-all group">
                            <div className="w-14 h-14 bg-veyro-green/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                📄
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white">Property Reports</h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Detailed reports, photos, and insights delivered after each visit.
                                </p>
                            </div>
                            <a href="/services/reports" className="inline-flex items-center text-veyro-green text-sm font-bold group-hover:translate-x-2 transition-transform">
                                Order Report →
                            </a>
                        </div>

                        {/* Income-Sharing Agent */}
                        <div className="bg-veyro-deep/20 border border-veyro-green/20 rounded-2xl p-8 space-y-6 hover:border-veyro-green/40 transition-all group">
                            <div className="w-14 h-14 bg-veyro-green/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                💼
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white">Income-Sharing Agent</h3>
                                <p className="text-sm text-white/60 leading-relaxed">
                                    Turn your overflow clients into passive revenue through our network.
                                </p>
                            </div>
                            <a href="/services/income" className="inline-flex items-center text-veyro-green text-sm font-bold group-hover:translate-x-2 transition-transform">
                                Apply Now →
                            </a>
                        </div>

                        {/* Become an Agent - CTA Card */}
                        <div className="bg-gradient-to-br from-veyro-emerald to-veyro-deep border border-veyro-green/40 rounded-2xl p-8 space-y-6 group hover:scale-[1.02] transition-all">
                            <div className="w-14 h-14 bg-veyro-green/20 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                🪪
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-bold text-white">Become a Showing Agent</h3>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    Licensed agent? Earn ₹2,300–₹30,000 per showing on your schedule.
                                </p>
                            </div>
                            <a href="/agent/apply" className="inline-flex items-center text-veyro-green text-sm font-bold group-hover:translate-x-2 transition-transform">
                                Apply Now →
                            </a>
                        </div>
                    </div>

                    <div className="text-center pt-8">
                        <a href="/services" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors">
                            Explore all services →
                        </a>
                    </div>
                </div>
            </section>

            {/* Coverage Section */}
            <section className="py-20 lg:py-32 bg-veyro-deep/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black text-veyro-green uppercase tracking-widest">
                            ADD TO WHERE
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white">
                            Nationwide reach
                        </h2>
                        <p className="text-lg text-white/60">
                            We've got you covered. Full real-time network.
                        </p>
                    </div>

                    {/* Map Visualization Placeholder */}
                    <div className="relative bg-veyro-deep/30 border border-veyro-green/20 rounded-2xl p-8 lg:p-12 min-h-[400px] flex items-center justify-center">
                        <div className="text-center space-y-4">
                            <div className="text-6xl">🗺️</div>
                            <p className="text-white/40">Interactive map visualization here</p>
                        </div>
                        {/* Location indicator */}
                        <div className="absolute bottom-8 left-8 bg-veyro-deep/80 backdrop-blur-sm border border-veyro-green/30 rounded-lg px-4 py-2">
                            <div className="text-xs text-white/50">See coverage map</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 lg:py-32 bg-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-black text-veyro-green uppercase tracking-widest">
                            HOW IT WORKS
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white">
                            Up and running in minutes
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <ProcessStep
                            icon="📝"
                            title="Create Request"
                            desc="Property details, service type, and timing"
                        />
                        <ProcessStep
                            icon="✅"
                            title="Get Matched"
                            desc="Licensed agents instantly notified"
                        />
                        <ProcessStep
                            icon="🏠"
                            title="Showing Done"
                            desc="Agent completes visit and reports"
                        />
                        <ProcessStep
                            icon="⭐"
                            title="Review & Repeat"
                            desc="Rate experience and book again"
                        />
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 lg:py-32 bg-veyro-deep/10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-black text-veyro-green uppercase tracking-widest">
                            WHAT CLIENTS SAY
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white">
                            Trusted by real estate professionals
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TestimonialCard
                            quote="The Video takes all been incredible seeing why. I can't work on 100+ clients at the same time and professional and the reports are always detailed—it took."
                            name="Jamie R."
                            role="Senior Broker, Trulia QA"
                            rating={5}
                        />
                        <TestimonialCard
                            quote="This platform made my supply I can't work online. I was with it and my clients were happy fast I work."
                            name="Monica L."
                            role="Manager, Modern, Pune"
                            rating={5}
                        />
                        <TestimonialCard
                            quote="Quick turnaround every time. Best used service online—let you me take on the admin load but old and new clients like retail."
                            name="Priya K."
                            role="Realtor, Atlas Dev, SV"
                            rating={5}
                        />
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex justify-center gap-2 pt-8">
                        <div className="w-2 h-2 rounded-full bg-veyro-green"></div>
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    </div>
                </div>
            </section>

            {/* Agent CTA Banner */}
            <section className="py-20 bg-gradient-to-br from-veyro-emerald via-veyro-deep to-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzOUZGMTQiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEG0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                
                <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <span className="text-[10px] font-black text-veyro-green uppercase tracking-widest">
                                FOR LICENSED AGENTS
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white">
                                Earn ₹2,300-₹30,000 per showing on your schedule
                            </h2>
                            <p className="text-lg text-white/70 leading-relaxed">
                                No monthly fees. No contracts. Accept only the requests that fit your schedule and earn within 1-2 business days.
                            </p>
                        </div>
                        <div className="flex justify-end">
                            <a
                                href="/agent/apply"
                                className="bg-veyro-green hover:bg-veyro-green/90 text-black px-10 py-5 rounded-xl text-lg font-bold shadow-xl shadow-veyro-green/30 transition-all hover:scale-105 inline-block"
                            >
                                Join as Agent
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 lg:py-32 bg-black">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 space-y-12">
                    <div className="text-center space-y-4">
                        <span className="text-[10px] font-black text-veyro-green uppercase tracking-widest">
                            FAQ
                        </span>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white">
                            Common questions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        <FAQItem question="Ready to reclaim your time?" />
                        <FAQItem question="How quickly can I schedule a showing?" />
                        <FAQItem question="How much does it cost?" />
                        <FAQItem question="Do I keep my commission?" />
                    </div>

                    <div className="text-center pt-8">
                        <a href="/faq" className="inline-flex items-center gap-2 text-veyro-green text-sm font-bold hover:underline">
                            View all FAQs →
                        </a>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 lg:py-32 bg-veyro-deep/20 border-t border-veyro-green/10">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-4xl lg:text-6xl font-bold text-white">
                            Ready to reclaim your time?
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                            Join real estate professionals using Veyro and take back 2.5 hours per week with Veyro
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="/signup"
                            className="bg-veyro-green hover:bg-veyro-green/90 text-black px-10 py-5 rounded-xl text-lg font-bold shadow-xl shadow-veyro-green/20 transition-all hover:scale-105"
                        >
                            Create Free Account
                        </a>
                        <a
                            href="/agent/apply"
                            className="bg-transparent hover:bg-white/5 text-white border border-white/20 px-10 py-5 rounded-xl text-lg font-bold backdrop-blur-sm transition-all flex items-center gap-2"
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

// Component Definitions

function HeroStat({ value, label }: { value: string; label: string }) {
    return (
        <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-bold text-white">
                {value}
            </div>
            <div className="text-[10px] font-medium text-white/40 uppercase tracking-wider">
                {label}
            </div>
        </div>
    );
}

function StatItem({ icon, value, label }: { icon: string; value: string; label: string }) {
    return (
        <div className="flex items-center gap-4 group">
            <div className="text-3xl group-hover:scale-110 transition-transform">{icon}</div>
            <div className="space-y-1">
                <div className="text-2xl font-bold text-veyro-green">{value}</div>
                <div 
                    className="text-[10px] text-white/50 font-medium uppercase tracking-wider leading-tight"
                    dangerouslySetInnerHTML={{ __html: label }}
                />
            </div>
        </div>
    );
}

function ProcessStep({ icon, title, desc }: { icon: string; title: string; desc: string }) {
    return (
        <div className="bg-veyro-deep/20 border border-veyro-green/20 rounded-xl p-6 space-y-4 hover:border-veyro-green/40 transition-all group">
            <div className="w-14 h-14 bg-veyro-green/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <div className="space-y-2">
                <h4 className="font-bold text-white text-lg">{title}</h4>
                <p className="text-sm text-white/60">{desc}</p>
            </div>
        </div>
    );
}

function TestimonialCard({ quote, name, role, rating }: { quote: string; name: string; role: string; rating: number }) {
    return (
        <div className="bg-veyro-deep/20 border border-veyro-green/20 rounded-xl p-8 space-y-6 hover:border-veyro-green/40 transition-all">
            <div className="flex gap-1">
                {[...Array(rating)].map((_, i) => (
                    <span key={i} className="text-veyro-green text-lg">★</span>
                ))}
            </div>
            <p className="text-white/80 leading-relaxed italic">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-veyro-emerald rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <div className="text-sm font-bold text-white">{name}</div>
                    <div className="text-xs text-white/50">{role}</div>
                </div>
            </div>
        </div>
    );
}

function FAQItem({ question }: { question: string }) {
    return (
        <button className="w-full bg-veyro-deep/20 border border-veyro-green/20 rounded-xl p-6 flex justify-between items-center hover:border-veyro-green/40 transition-all text-left group">
            <span className="text-white font-medium">{question}</span>
            <span className="text-veyro-green text-xl group-hover:translate-x-1 transition-transform">+</span>
        </button>
    );
}
