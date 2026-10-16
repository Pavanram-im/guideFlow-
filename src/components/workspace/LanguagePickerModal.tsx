import React, { useState } from 'react';
import { Search, X, Volume2, Check, AlertCircle, Sparkles } from 'lucide-react';
import { LANGUAGE_REGISTRY, filterLanguages } from '../../data/languageRegistry.ts';
import { LanguageInfo, RegionCategory } from '../../types/index.ts';

interface LanguagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguageCode: string;
  onSelectLanguage: (language: LanguageInfo) => void;
  title?: string;
  isTarget?: boolean;
}

export const LanguagePickerModal: React.FC<LanguagePickerModalProps> = ({
  isOpen,
  onClose,
  selectedLanguageCode,
  onSelectLanguage,
  title = 'Select Target Video Language',
  isTarget = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegion, setActiveRegion] = useState<RegionCategory>('all');
  const [audioPreviewText, setAudioPreviewText] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredLanguages = filterLanguages(searchQuery, activeRegion);

  const handlePlaySample = (lang: LanguageInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window && lang.capabilities.speech) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lang.sampleGreeting);
      utterance.lang = lang.code;
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      setAudioPreviewText(lang.sampleGreeting);
      setTimeout(() => setAudioPreviewText(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div 
        className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl bg-[#111827] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#172033]/60">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span>22 Eighth Schedule Indian Languages</span>
              <span aria-hidden="true">·</span>
              <span>English Regional Accents</span>
              <span aria-hidden="true">·</span>
              <span>European & Global Languages</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close language picker"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search & Region Filter Bar */}
        <div className="p-4 border-b border-white/10 bg-[#080B14]/40 flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by English name (e.g. Telugu, Hindi) or native script (తెలుగు, हिन्दी, தமிழ்)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              autoFocus
            />
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Languages' },
              { id: 'indian', label: 'Indian (22 Scheduled)' },
              { id: 'english', label: 'English Variants' },
              { id: 'european', label: 'Major European' },
              { id: 'asian_middle_east', label: 'Middle East & Asia' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveRegion(tab.id as RegionCategory)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                  activeRegion === tab.id
                    ? 'bg-purple-600 text-white font-medium shadow-sm'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Audio feedback notice if playing */}
        {audioPreviewText && (
          <div className="px-6 py-2 bg-purple-950/60 border-b border-purple-500/20 text-xs text-purple-200 flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-purple-400 animate-pulse" />
            <span>Playing audio sample: &quot;{audioPreviewText}&quot;</span>
          </div>
        )}

        {/* Language Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLanguageCode.toLowerCase() === lang.code.toLowerCase();
            return (
              <div
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang);
                  onClose();
                }}
                className={`group relative flex flex-col justify-between p-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-purple-950/30 border-purple-500 ring-1 ring-purple-500/50'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-semibold text-white group-hover:text-purple-300 transition-colors flex items-center gap-2">
                        <span>{lang.name}</span>
                        {isSelected && <Check className="h-4 w-4 text-purple-400 shrink-0" />}
                      </div>
                      <div className="text-lg font-medium text-purple-400/90 mt-0.5" dir={lang.rtl ? 'rtl' : 'ltr'}>
                        {lang.nativeName}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                      {lang.code}
                    </span>
                  </div>

                  <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <span>{lang.script} script</span>
                    {lang.rtl && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-400">RTL</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Capability Matrix & Sample Listen */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className={lang.capabilities.speech ? 'text-emerald-400' : 'text-slate-400'}>
                      {lang.capabilities.speech ? 'Voice Ready' : 'Subtitles Only'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">Auto Subtitles</span>
                  </div>

                  {lang.capabilities.speech && (
                    <button
                      type="button"
                      onClick={(e) => handlePlaySample(lang, e)}
                      title="Play sample greeting"
                      className="p-1.5 rounded-md bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {!lang.capabilities.speech && (
                  <div className="mt-1 text-[10px] text-amber-300/80 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>Uses high-fidelity subtitles & native typography fallback</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-white/10 bg-[#172033]/40 flex items-center justify-between text-xs text-slate-400">
          <span>{filteredLanguages.length} languages available</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
