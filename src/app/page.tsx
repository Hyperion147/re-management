import React from "react";
import LandingPage from "@/components/LandingPage";
import LoggedInHomePage from "@/components/LoggedInHomePage";
import DashboardLayoutWrapper from "@/components/DashboardLayoutWrapper";
import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Veyro - India's First On-Demand Real Estate Platform",
  description: "Book verified agents for home showings, virtual tours, consultations, and more. Transparent pricing starting at ₹1,800. No commissions, no contracts. Available in Mumbai, Delhi, Bangalore, and 15+ cities.",
  openGraph: {
    title: "Veyro - On-Demand Real Estate Services",
    description: "Book verified agents for showings, tours, and consultations. Starting at ₹1,800.",
    images: ['/re-logo.png'],
  },
};

export default async function HomePage(props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;
    const code = searchParams?.code;

    if (code && typeof code === 'string') {
        redirect(`/auth/callback?code=₹{code}`);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        return (
            <DashboardLayoutWrapper>
                <LoggedInHomePage />
            </DashboardLayoutWrapper>
        );
    }

    return (
        <>
            {/* JSON-LD Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "name": "Veyro",
                        "description": "India's first on-demand real estate services platform",
                        "url": process.env.NEXT_PUBLIC_APP_URL || "https://veyro.com",
                        "logo": `${process.env.NEXT_PUBLIC_APP_URL || "https://veyro.com"}/re-logo.png`,
                        "sameAs": [
                            // Add social media links when available
                            // "https://www.facebook.com/veyro",
                            // "https://twitter.com/veyro",
                            // "https://www.linkedin.com/company/veyro",
                            // "https://www.instagram.com/veyro"
                        ],
                        "areaServed": {
                            "@type": "Country",
                            "name": "India"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "2000",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "offers": {
                            "@type": "AggregateOffer",
                            "priceCurrency": "INR",
                            "lowPrice": "1800",
                            "highPrice": "8000",
                            "offerCount": "13"
                        }
                    })
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        "name": "Veyro",
                        "url": process.env.NEXT_PUBLIC_APP_URL || "https://veyro.com",
                        "potentialAction": {
                            "@type": "SearchAction",
                            "target": {
                                "@type": "EntryPoint",
                                "urlTemplate": `${process.env.NEXT_PUBLIC_APP_URL || "https://veyro.com"}/assistant?q={search_term_string}`
                            },
                            "query-input": "required name=search_term_string"
                        }
                    })
                }}
            />
            <LandingPage />
        </>
    );
}
