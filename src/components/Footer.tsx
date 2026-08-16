import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#000101]/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/re-logo.png" alt='Veyro logo' width={40} height={40} className='bg-[#000101] rounded-lg' />
              <span className="font-black text-2xl text-[#000101]">Veyro</span>
            </Link>
            <p className="text-[#013D1F]/60 text-sm font-medium leading-relaxed max-w-sm">
              India's first on-demand real estate platform. Book verified agents for showings, tours, consultations, and more.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon="twitter" />
              <SocialLink href="#" icon="linkedin" />
              <SocialLink href="#" icon="instagram" />
              <SocialLink href="#" icon="youtube" />
            </div>
          </div>

          {/* Platform */}
          <FooterLinks 
            title="Platform" 
            links={[
              { label: 'How It Works', href: '/#how-it-works' },
              { label: 'Services', href: '/#services' },
              { label: 'Coverage', href: '/#coverage' },
              { label: 'Pricing', href: '/#services' },
            ]} 
          />

          {/* For Agents */}
          <FooterLinks 
            title="For Agents" 
            links={[
              { label: 'Become an Agent', href: '/agent/apply' },
              { label: 'Agent Benefits', href: '/docs/showing-agents' },
              { label: 'Requirements', href: '/docs/showing-agents' },
              { label: 'FAQs', href: '/#faq' },
            ]} 
          />

          {/* Company */}
          <FooterLinks 
            title="Company" 
            links={[
              { label: 'About Us', href: '#' },
              { label: 'Contact', href: '#' },
              { label: 'Docs', href: '/docs' },
              { label: 'Assistant', href: '/assistant' },
            ]} 
          />
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-[#000101]/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#013D1F]/50 text-sm font-medium">
            © 2026 Veyro. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="#" className="text-[#013D1F]/50 hover:text-[#087A32] font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-[#013D1F]/50 hover:text-[#087A32] font-medium transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-[#013D1F]/50 hover:text-[#087A32] font-medium transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-black text-[#000101] uppercase tracking-wide">{title}</h4>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link 
              href={link.href} 
              className="text-sm font-medium text-[#013D1F]/60 hover:text-[#087A32] transition-colors block"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string; icon: string }) {
  const getIcon = () => {
    switch (icon) {
      case 'twitter':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Link 
      href={href} 
      className="w-10 h-10 rounded-xl bg-[#F5F7F5] hover:bg-[#39FF14] text-[#013D1F]/60 hover:text-[#000101] flex items-center justify-center transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
    >
      {getIcon()}
    </Link>
  );
}
