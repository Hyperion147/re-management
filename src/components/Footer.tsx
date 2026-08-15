import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#0d1d1d] py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-16">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
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
