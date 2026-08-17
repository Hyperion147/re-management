import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Veyro - On-Demand Real Estate Services | Book Verified Agents",
    template: "%s | Veyro"
  },
  description: "India's first on-demand real estate platform. Book verified agents for showings, tours, and consultations. Transparent pricing, no commissions, no contracts. Available in 15+ cities.",
  keywords: [
    "real estate agents",
    "property showings",
    "home tours",
    "real estate services",
    "on-demand agents",
    "property consultation",
    "Mumbai real estate",
    "Delhi real estate",
    "Bangalore real estate",
    "verified agents",
    "flat fee agents",
    "no commission",
  ],
  authors: [{ name: "Veyro" }],
  creator: "Veyro",
  publisher: "Veyro",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://veyro.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    title: "Veyro - On-Demand Real Estate Services",
    description: "Book verified agents for showings, tours, and consultations. No commissions, no long-term contracts.",
    siteName: "Veyro",
    images: [
      {
        url: "/re-logo.png",
        width: 1200,
        height: 630,
        alt: "Veyro - On-Demand Real Estate Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Veyro - On-Demand Real Estate Services",
    description: "Book verified agents for showings, tours, and consultations. No commissions.",
    images: ["/re-logo.png"],
    creator: "@veyro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "scroll-smooth", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
