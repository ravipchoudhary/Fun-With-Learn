import React from 'react';
import Logo from './Logo';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Branding wing */}
        <div className="space-y-4">
          <Logo className="brightness-0 invert filter" size={40} />
          <p className="text-sm leading-relaxed text-slate-400">
            Fun With Learn is India's leading self-adaptive smart learning system. We provide top tier interactive classrooms, instant live chats, custom structured video, and personalized Gemini assessments for high school mastery.
          </p>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            © 2026 Fun With Learn Inc.
          </div>
        </div>

        {/* Categories wing */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Classes Coverage</h4>
          <ul className="space-y-2.5 text-sm">
            {['Class 6 - 8 Essentials', 'Class 9 & 10 Boards Guide', 'Class 11 & 12 Science Core', 'Class 11 & 12 Commerce Support'].map((item) => (
              <li key={item}>
                <button 
                  onClick={() => setCurrentTab('courses')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources wing */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: 'Interactive Live Classes', tab: 'live' },
              { label: 'Recorded Lecturing library', tab: 'videos' },
              { label: 'Subscription Tiers', tab: 'subscription' },
              { label: 'Doubt Solving AI chatbot', tab: 'ai-assistant' },
            ].map((item) => (
              <li key={item.label}>
                <button 
                  onClick={() => setCurrentTab(item.tab)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact/Support wing */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">India Head Office</h4>
          <p className="text-sm leading-relaxed text-slate-400 mb-3">
            Fun With Learn Space, Block B, Outer Ring Road, Bengaluru, Karnataka - 560103.
          </p>
          <p className="text-sm font-semibold text-indigo-400">support@funwithlearn.edu</p>
          <p className="text-xs text-slate-500 mt-4">Simulated phone: +91 80 4390 1200</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
        <div>
          Major capability enabled: <span className="text-green-500">SERVER-SIDE GEMINI API (3.5-FLASH)</span>
        </div>
        <div className="flex gap-4">
          <a href="#privacy" className="hover:underline">Privacy Policy</a>
          <a href="#terms" className="hover:underline">Terms & Conditions</a>
          <a href="#refund" className="hover:underline">Refund Policy</a>
        </div>
      </div>
    </footer>
  );
}
