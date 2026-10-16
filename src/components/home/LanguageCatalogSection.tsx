import React, { useState } from 'react';
import { Globe, Volume2, Check, Search, Sparkles } from 'lucide-react';
import { LANGUAGE_REGISTRY, filterLanguages } from '../../data/languageRegistry.ts';
import { LanguageInfo, RegionCategory } from '../../types/index.ts';

interface LanguageCatalogSectionProps {
  onSelectLanguageForGuide: (lang: LanguageInfo) => void;
}

export const LanguageCatalogSection: React.FC<LanguageCatalogSectionProps> = ({
  onSelectLanguageForGuide
}) => {
  const [activeTab, setActiveTab] = useState<RegionCategory>('indian');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingCode, setPlayingCode] = useState<string | null>(null);

  const displayedLanguages = filterLanguages(searchQuery, activeTab);

  const handlePlayGreeting = (lang: LanguageInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window && lang.capabilities.speech) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lang.sampleGreeting);
      utterance.lang = lang.code;
      window.speechSynthesis.speak(utterance);
      setPlayingCode(lang.code);
      setTimeout(() => setPlayingCode(null), 3000);
    }
  };

  return (
    <section className="py-20 border-b border-white/10 bg-[#080B14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-2">
              Global & Regional Language Engine
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Any Language. Authentic Native Voice & Script.
            </h2>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl">
              Includes all 22 officially recognized Eighth Schedule Indian languages, international English regional variants, and world languages with verified typography and speech capability.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search language or script..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Region Filter Bar */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          {[
            { id: 'indian', label: 'Indian (22 Scheduled Languages)' },
            { id: 'english', label: 'English Variants (US, UK, IN, AU, CA)' },
            { id: 'european', label: 'Major European Languages' },
            { id: 'asian_middle_east', label: 'Middle East & Asia (Arabic RTL, etc.)' },
            { id: 'all', label: 'All Registered Languages' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as RegionCategory)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white font-medium shadow-md shadow-purple-600/25'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Language Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedLanguages.map((lang) => {
            const isPlaying = playingCode === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => onSelectLanguageForGuide(lang)}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-[#111827] border border-white/10 hover:border-purple-500/50 hover:bg-[#172033] transition-all cursor-pointer shadow-lg"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-white group-hover:text-purple-300 transition-colors">
                        {lang.name}
                      </div>
                      <div className="text-xl font-medium text-purple-400 mt-0.5" dir={lang.rtl ? 'rtl' : 'ltr'}>
                        {lang.nativeName}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      {lang.code}
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-400">
                    <span>{lang.script} script</span>
                    {lang.rtl && <span className="text-amber-400 ml-1.5 font-medium">· RTL Layout</span>}
                  </div>

                  <div className="mt-2 text-xs text-slate-300 italic bg-white/[0.03] p-2.5 rounded-lg border border-white/5 line-clamp-2">
                    &quot;{lang.sampleGreeting}&quot;
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className={lang.capabilities.speech ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                    {lang.capabilities.speech ? 'Voice Narration Ready' : 'Subtitles Only'}
                  </span>

                  {lang.capabilities.speech && (
                    <button
                      type="button"
                      onClick={(e) => handlePlayGreeting(lang, e)}
                      title="Listen to sample greeting"
                      className={`p-2 rounded-lg transition-colors ${
                        isPlaying ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
