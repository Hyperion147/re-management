import Image from 'next/image';
import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-primary py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white">
            <Image src="/re-logo.png" alt='logo' width={50} height={50} className='bg-foreground rounded-md' />
            <span className="font-bold text-lg">Veyro</span>
          </div>
          <p className="text-white/40 text-xs font-medium leading-relaxed">
            Empowering real estate professionals with on-demand agent support. Scale your business without the overhead.
          </p>
        </div>

        <FooterLinks title="Solutions" links={['For Teams', 'For Brokerages', 'For Solo Agents']} />
        <FooterLinks title="Support" links={['Help Center', 'API Docs', 'Status Page']} />
        <FooterLinks title="Legal" links={['Privacy Policy', 'Terms of Service', 'Cookie Policy']} />
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-20 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">© 2026 Veyro. All rights reserved.</p>
        <div className="flex gap-6">
          <SocialIcon icon="X" />
          <SocialIcon icon="LI" />
          <SocialIcon icon="IG" />
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="space-y-6">
      <h4 className="text-[10px] font-black text-white/60 uppercase tracking-[0.2em]">{title}</h4>
      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="text-xs font-bold text-white/30 hover:text-white transition-colors">{link}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  return (
    <a href="#" className="text-white/20 hover:text-white transition-colors text-[10px] font-black tracking-widest">{icon}</a>
  );
}
