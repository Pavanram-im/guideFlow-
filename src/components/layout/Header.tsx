import React, { useState } from 'react';
import { Video, Globe, FileText, Sparkles, FolderOpen, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeTab: 'home' | 'workspace' | 'editor' | 'languages' | 'templates' | 'dashboard';
  setActiveTab: (tab: 'home' | 'workspace' | 'editor' | 'languages' | 'templates' | 'dashboard') => void;
  onNewProject: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onNewProject }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'workspace' | 'editor' | 'languages' | 'templates' | 'dashboard') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#080B14]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 text-left text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/20">
            <Video className="h-5 w-5" />
          </span>
          <span className="font-semibold tracking-tight text-white">
            GuideFlow <span className="text-purple-400">AI</span>
          </span>
        </button>

        {/* Zone 2: 4-5 clean single-line nav links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('home')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'home' ? 'text-purple-400' : 'text-slate-300'
            }`}
          >
            Product
          </button>
          <button
            onClick={() => handleNavClick('workspace')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'workspace' ? 'text-purple-400' : 'text-slate-300'
            }`}
          >
            Create Guide
          </button>
          <button
            onClick={() => handleNavClick('languages')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'languages' ? 'text-purple-400' : 'text-slate-300'
            }`}
          >
            Languages
          </button>
          <button
            onClick={() => handleNavClick('templates')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'templates' ? 'text-purple-400' : 'text-slate-300'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-white ${
              activeTab === 'dashboard' ? 'text-purple-400' : 'text-slate-300'
            }`}
          >
            My Guides
          </button>
        </nav>

        {/* Zone 3: Primary Action + Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onNewProject();
              setMobileMenuOpen(false);
            }}
            className="hidden sm:flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-purple-600/25 hover:bg-purple-500 transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            <span>Create My First Guide</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0e1422] px-4 py-4 space-y-2 text-sm animate-in fade-in duration-200">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'home' ? 'bg-purple-600/20 text-purple-300 font-medium' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            Product
          </button>
          <button
            onClick={() => handleNavClick('workspace')}
            className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'workspace' ? 'bg-purple-600/20 text-purple-300 font-medium' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            Create Guide
          </button>
          <button
            onClick={() => handleNavClick('languages')}
            className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'languages' ? 'bg-purple-600/20 text-purple-300 font-medium' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            Languages (22 Indian + Global)
          </button>
          <button
            onClick={() => handleNavClick('templates')}
            className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'templates' ? 'bg-purple-600/20 text-purple-300 font-medium' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`w-full text-left py-2 px-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-purple-600/20 text-purple-300 font-medium' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            My Guides
          </button>
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                onNewProject();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 text-white font-medium text-xs shadow-md"
            >
              <Sparkles className="h-4 w-4" />
              <span>Create My First Guide</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
