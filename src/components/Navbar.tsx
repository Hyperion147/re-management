'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { isAdminRole } from '@/lib/roles';
import ContactSupportModal from './ContactSupportModal';
import Image from 'next/image';

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ₹{isScrolled ? 'bg-background/90 backdrop-blur-xl py-4 shadow-sm' : 'py-6 bg-background'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center">
          {/* Left — Logo (flex-1 so it takes equal space) */}
          <div className="flex-1 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/re-logo.png" alt="Veyro logo" width={50} height={50} className="bg-foreground rounded-md" />
              <span className="text-foreground font-bold text-xl tracking-tight">Veyro</span>
            </Link>
          </div>

          {/* Center — Nav links (always centered) */}
          <div className="hidden lg:flex items-center bg-muted rounded-full px-1.5 py-1.5 gap-0.5 text-[13px] font-semibold">
            <NavLink href="/" isActive={pathname === '/' && !isCoverageActive}>Home</NavLink>
            <NavLink href="/#services" isActive={false}>Services</NavLink>
            <NavLink href="/#how-it-works" isActive={false}>How It Works</NavLink>
            <NavLink href="/#coverage" isActive={false}>Coverage</NavLink>
            <NavLink href="/#faq" isActive={false}>FAQ</NavLink>
            <NavLink href="/docs" isActive={pathname === '/docs'}>Docs</NavLink>
            <NavLink href="/assistant" isActive={pathname === '/assistant'}>Assistant</NavLink>
            {sessionUser ? (
              <Link href="/client" className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all ml-1">
                Dashboard
              </Link>
            ) : (
              <Link href="/agent/apply" className="px-4 py-1.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all ml-1">
                Join as Agent
              </Link>
            )}
          </div>

          {/* Right — Chat + Hamburger (flex-1 justify-end) */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <button
              onClick={() => sessionUser ? setIsContactOpen(true) : (window.location.href = '/login')}
              className="hidden lg:flex w-9 h-9 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Contact Us"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </button>
            {sessionUser && (
              <div className="hidden lg:flex w-8 h-8 rounded-full bg-muted text-primary border border-primary/30 items-center justify-center text-sm font-bold">
                {sessionUser.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}

            {/* Hamburger */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted border border-border text-foreground"
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
                <div className="absolute right-0 top-full mt-2 w-52 bg-background rounded-2xl shadow-xl border border-border overflow-hidden z-50">
                  {/* Mobile-only nav links */}
                  <div className="lg:hidden border-b border-border py-2">
                    <DropdownLink href="/" onClick={() => setIsMenuOpen(false)}>Home</DropdownLink>
                    <DropdownLink href="/#services" onClick={() => setIsMenuOpen(false)}>Services</DropdownLink>
                    <DropdownLink href="/#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</DropdownLink>
                    <DropdownLink href="/#coverage" onClick={() => setIsMenuOpen(false)}>Coverage</DropdownLink>
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
                          <span className="text-accent">🪪</span> Join as Agent
                        </span>
                      </DropdownLink>
                    )}
                    {sessionUser ? (
                      <button
                        onClick={() => { setIsMenuOpen(false); handleLogout(); }}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-red-50 transition-colors"
                      >
                        Log Out
                      </button>
                    ) : (
                      <DropdownLink href="/login" onClick={() => setIsMenuOpen(false)}>Sign In</DropdownLink>
                    )}
                    <button
                      onClick={() => { setIsMenuOpen(false); sessionUser ? setIsContactOpen(true) : (window.location.href = '/login'); }}
                      className="w-full text-left px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
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
      className={`px-4 py-1.5 rounded-full transition-all text-[13px] font-semibold ₹{isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-foreground/60 hover:text-foreground'
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
      className="block px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
    >
      {children}
    </Link>
  );
}
