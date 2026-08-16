import React from 'react';
import Link from 'next/link';

export default function DashboardFooter() {
  return (
    <footer className="bg-primary text-gray-400 py-6 px-8 border-t border-primary">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-sm">
            {/* Mock Logo */}
            <div className="w-5 h-6 text-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            </div>
          </div>
          <span className="text-white font-bold text-sm tracking-tight hidden">Veyro</span>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-semibold tracking-wider">
          <Link href="/#services" className="hover:text-white transition-colors">Services</Link>

          <Link href="/#how-it-works" className="hover:text-white transition-colors">How It Works</Link>
          <Link href="/#faq" className="hover:text-white transition-colors">FAQ</Link>
        </div>

        <div className="text-[11px] font-medium">
          © {new Date().getFullYear()} Veyro
        </div>
      </div>
    </footer>
  );
}
