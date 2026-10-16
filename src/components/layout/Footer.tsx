import React from 'react';
import { Video, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'workspace' | 'languages' | 'templates' | 'dashboard') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#080B14] py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Video className="h-4 w-4" />
            </span>
            <div>
              <div className="text-base font-semibold text-white">GuideFlow AI</div>
              <p className="text-xs text-slate-400">Any Document. Any Language. One Clear Guide.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Home</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('languages')} className="hover:text-white transition-colors">22 Indian Languages & World Catalog</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('templates')} className="hover:text-white transition-colors">SOP & Tutorial Templates</button>
            <span aria-hidden="true">·</span>
            <button onClick={() => onNavigate('workspace')} className="hover:text-white transition-colors">Video Studio</button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Privacy-grounded AI processing · Zero untrusted script execution · UTF-8 Full Script Support</span>
          </div>
          <div>
            © {new Date().getFullYear()} GuideFlow AI. Built with precision for multilingual education.
          </div>
        </div>
      </div>
    </footer>
  );
};
