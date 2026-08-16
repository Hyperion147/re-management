'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { isAdminRole } from '@/lib/roles';
import { supabase } from '@/lib/supabase';
import ContactSupportModal from './ContactSupportModal';

export default function DashboardNavbar() {
  const pathname = usePathname();
  const { initial, user: currentUser } = useCurrentUser();
  const isAdmin = isAdminRole(currentUser?.role);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/client/services' },
    { name: 'Coverage', href: '/coverage' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'Docs', href: '/docs' },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const isLinkActive = (link: { name: string; href: string }) => {
    const isHome = link.href === '/';
    const isServices = link.name === 'Services';
    const isSupport = link.name === 'Support';
    return (
      (isHome && pathname === '/') ||
      (isServices && pathname.startsWith('/client/services')) ||
      (isSupport && pathname === '/client/support') ||
      (pathname === link.href && !isHome && !isServices && !isSupport)
    );
  };

  return (
    <>
      <nav className="bg-background border-b border-gray-100 py-4 px-6 flex items-center">
        {/* Left — Logo */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-8 text-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">Veyro</span>
          </Link>
        </div>

        {/* Center — Nav links */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-full px-1.5 py-1.5 gap-0.5 text-[13px] font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-1.5 rounded-full transition-all text-[13px] font-semibold ₹{
                isLinkActive(link) ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link href="/assistant" className="px-4 py-1.5 rounded-full bg-accent text-white hover:bg-accent/90 transition-all ml-1 text-[13px] font-semibold flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            AI Assistant
          </Link>
          <Link href="/client" className="px-4 py-1.5 rounded-full bg-primary text-white hover:bg-primary/90 transition-all ml-1 text-[13px] font-semibold">
            Dashboard
          </Link>
        </div>

        {/* Right — Chat + Avatar + Hamburger */}
        <div className="flex-1 flex items-center justify-end gap-2" ref={menuRef}>
          <button
            onClick={() => setIsContactOpen(true)}
            className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
            aria-label="Contact Us"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </button>

          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
            {initial || 'V'}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 text-gray-700"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {/* Mobile-only nav links */}
                <div className="md:hidden border-b border-gray-100 py-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-semibold transition-colors ₹{
                        isLinkActive(link) ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div className="py-2">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Log Out
                  </button>
                  <button
                    onClick={() => { setIsMenuOpen(false); setIsContactOpen(true); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Contact Us
                  </button>
                  <Link
                    href="/assistant"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-semibold text-accent hover:bg-orange-50 transition-colors"
                  >
                    ✦ AI Assistant
                  </Link>
                  <Link
                    href="/client"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <ContactSupportModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}
