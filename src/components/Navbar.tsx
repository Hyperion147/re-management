'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { isAdminRole } from '@/lib/roles';
import ContactSupportModal from './ContactSupportModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<any>(null);
  const { user: currentUser } = useCurrentUser();
  const isAdmin = isAdminRole(currentUser?.role);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSessionUser(session?.user || null);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null);
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const pathname = usePathname();
  const isCoverageActive = pathname === '/coverage';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl py-4 shadow-sm' : 'py-6 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center">
          {/* Left — Logo (flex-1 so it takes equal space) */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-[#3d4b5c] rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-[#1a2a2a] font-bold text-xl tracking-tight">Veyro</span>
            </Link>
          </div>

          {/* Center — Nav links (always centered) */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-1.5 py-1.5 gap-0.5 text-[13px] font-semibold">
            <NavLink href="/" isActive={pathname === '/' && !isCoverageActive}>Home</NavLink>
            <NavLink href="/#services" isActive={false}>Services</NavLink>
            <NavLink href="/coverage" isActive={isCoverageActive}>Coverage</NavLink>
            <NavLink href="/how-it-works" isActive={pathname === '/how-it-works'}>How It Works</NavLink>
            <NavLink href="/faq" isActive={pathname === '/faq'}>FAQ</NavLink>
            <NavLink href="/docs" isActive={pathname === '/docs'}>Docs</NavLink>
            <NavLink href="/assistant" isActive={pathname === '/assistant'}>Assistant</NavLink>
            {sessionUser ? (
              <Link href="/client" className="px-4 py-1.5 rounded-full bg-[#112424] text-white hover:bg-[#0d1d1d] transition-all ml-1">
                Dashboard
              </Link>
            ) : (
              <Link href="/agent/apply" className="px-4 py-1.5 rounded-full bg-[#d69e5e] text-white hover:bg-[#c58d4d] transition-all ml-1">
                Join as Agent
              </Link>
            )}
          </div>

          {/* Right — Chat + Hamburger (flex-1 justify-end) */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <button
              onClick={() => sessionUser ? setIsContactOpen(true) : (window.location.href = '/login')}
              className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full hover:bg-gray-100 text-[#1a2a2a]/50 hover:text-[#1a2a2a] transition-colors"
              aria-label="Contact Us"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
            {sessionUser && (
              <div className="hidden lg:flex w-8 h-8 rounded-full bg-[#e8f3f0] text-green-800 border border-green-200 items-center justify-center text-sm font-bold">
                {sessionUser.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}

          {/* Hamburger */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-[#1a2a2a]"
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
                <div className="lg:hidden border-b border-gray-100 py-2">
                  <DropdownLink href="/" onClick={() => setIsMenuOpen(false)}>Home</DropdownLink>
                  <DropdownLink href="/#services" onClick={() => setIsMenuOpen(false)}>Services</DropdownLink>
                  <DropdownLink href="/coverage" onClick={() => setIsMenuOpen(false)}>Coverage</DropdownLink>
                  <DropdownLink href="/#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</DropdownLink>
                  <DropdownLink href="/#faq" onClick={() => setIsMenuOpen(false)}>FAQ</DropdownLink>
                  <DropdownLink href="/docs" onClick={() => setIsMenuOpen(false)}>Docs</DropdownLink>
                </div>

                <div className="py-2">
                  {isAdmin && (
                    <DropdownLink href="/admin" onClick={() => setIsMenuOpen(false)}>Admin Dashboard</DropdownLink>
                  )}
                  {!sessionUser && (
                    <DropdownLink href="/agent/apply" onClick={() => setIsMenuOpen(false)}>
                      <span className="flex items-center gap-2">
                        <span className="text-[#d69e5e]">🪪</span> Join as Agent
                      </span>
                    </DropdownLink>
                  )}
                  {sessionUser ? (
                    <button
                      onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Log Out
                    </button>
                  ) : (
                    <DropdownLink href="/login" onClick={() => setIsMenuOpen(false)}>Sign In</DropdownLink>
                  )}
                  <button
                    onClick={() => { setIsMenuOpen(false); sessionUser ? setIsContactOpen(true) : (window.location.href = '/login'); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Contact Us
                  </button>
                  {sessionUser && (
                    <DropdownLink href="/client" onClick={() => setIsMenuOpen(false)}>Dashboard</DropdownLink>
                  )}
                </div>
              </div>
            )}
          </div>
          </div>{/* end right flex-1 */}
        </div>
      </nav>
      <ContactSupportModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}

function NavLink({ href, children, isActive }: { href: string; children: React.ReactNode; isActive?: boolean }) {
  return (
    <Link
      href={href}
      className={`px-4 py-1.5 rounded-full transition-all text-[13px] font-semibold ${
        isActive
          ? 'bg-white text-[#1a2a2a] shadow-sm'
          : 'text-[#1a2a2a]/60 hover:text-[#1a2a2a]'
      }`}
    >
      {children}
    </Link>
  );
}

function DropdownLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
    >
      {children}
    </Link>
  );
}
