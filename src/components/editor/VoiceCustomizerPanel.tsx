import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Mic, Sliders, Play, Check, X, RotateCcw, Headphones, Globe2 } from 'lucide-react';
import { VoiceCustomization, VoicePersona } from '../../types/index.ts';
import { getLanguageByCode } from '../../data/languageRegistry.ts';
import { VOICE_PERSONA_PROFILES, audioNarrator } from '../../utils/audioNarrator.ts';

interface VoiceCustomizerPanelProps {
  customization: VoiceCustomization;
  targetLanguageCode: string;
  onUpdate: (newCustomization: VoiceCustomization) => void;
  onClose: () => void;
  currentSceneNarration?: string;
  onPreviewVoice: (custom: VoiceCustomization) => void;
}

const PERSONA_LIST: {
  id: VoicePersona;
  color: string;
  badge: string;
}[] = [
  {
    id: 'studio_warmth',
    color: 'border-purple-500/60 bg-purple-950/30 text-purple-200',
    badge: 'Popular Studio'
  },
  {
    id: 'deep_anchor',
    color: 'border-blue-500/60 bg-blue-950/30 text-blue-200',
    badge: 'Deep Baritone'
  },
  {
    id: 'clear_educator',
    color: 'border-cyan-500/60 bg-cyan-950/30 text-cyan-200',
    badge: 'Educational'
  },
  {
    id: 'dynamic_walkthrough',
    color: 'border-emerald-500/60 bg-emerald-950/30 text-emerald-200',
    badge: 'Energetic'
  },
  {
    id: 'calm_guidance',
    color: 'border-amber-500/60 bg-amber-950/30 text-amber-200',
    badge: 'Gentle & Calm'
  }
];

export const VoiceCustomizerPanel: React.FC<VoiceCustomizerPanelProps> = ({
  customization,
  targetLanguageCode,
  onUpdate,
  onClose,
  currentSceneNarration,
  onPreviewVoice
}) => {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const targetLang = getLanguageByCode(targetLanguageCode);

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      }
    };

    loadVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const matchingVoices = availableVoices.filter(
    (v) =>
      v.lang.toLowerCase().startsWith(targetLanguageCode.toLowerCase()) ||
      v.lang.toLowerCase().replace('_', '-').startsWith(targetLanguageCode.split('-')[0].toLowerCase())
  );

  const handleSelectPreset = (personaId: VoicePersona) => {
    const profile = VOICE_PERSONA_PROFILES[personaId];
    const updated: VoiceCustomization = {
      ...customization,
      persona: personaId,
      pitch: profile.pitch,
      speed: profile.speed,
      gender: profile.gender,
      geminiVoice: profile.geminiVoice
    };
    onUpdate(updated);
    onPreviewVoice(updated);
  };

  const handleModeChange = (mode: 'explainer_english' | 'target_native' | 'bilingual') => {
    const updated: VoiceCustomization = {
      ...customization,
      voiceMode: mode
    };
    onUpdate(updated);
    onPreviewVoice(updated);
  };

  const handleReset = () => {
    const defaultCustom: VoiceCustomization = {
      persona: 'studio_warmth',
      pitch: 1.05,
      speed: 1.0,
      volume: 1.0,
      gender: 'female',
      provider: 'browser',
      voiceMode: 'explainer_english',
      geminiVoice: 'Kore'
    };
    onUpdate(defaultCustom);
    onPreviewVoice(defaultCustom);
  };

  return (
    <div className="w-full rounded-2xl bg-[#0f172a] border border-purple-500/30 p-5 sm:p-6 shadow-2xl animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/40">
            <Mic className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Live Narrator Voice Customizer</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Real-Time Audio
              </span>
            </h3>
            <p className="text-xs text-slate-300">
              Customize voices on-the-fly while the video is playing to give your audience the clearest guidance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Reset to default voice settings"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 1. Voice Language Mode (Ensures Listeners Understand the Process) */}
      <div className="mt-5">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block mb-2">
          Step Narration Delivery Mode (For Listeners / Audience)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => handleModeChange('explainer_english')}
            className={`p-3 rounded-xl border text-left transition-all ${
              customization.voiceMode === 'explainer_english' || !customization.voiceMode
                ? 'border-purple-500 bg-purple-950/40 text-white ring-1 ring-purple-400'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/5 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-purple-300 flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5" />
                Audience Explainer Voice
              </span>
              {(customization.voiceMode === 'explainer_english' || !customization.voiceMode) && (
                <Check className="h-3.5 w-3.5 text-purple-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              Speaks clear English step-by-step guidance so every listener fully understands the instructions.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('target_native')}
            className={`p-3 rounded-xl border text-left transition-all ${
              customization.voiceMode === 'target_native'
                ? 'border-cyan-500 bg-cyan-950/40 text-white ring-1 ring-cyan-400'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/5 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-cyan-300 flex items-center gap-1.5">
                <Globe2 className="h-3.5 w-3.5" />
                Native Script Voice ({targetLang?.name})
              </span>
              {customization.voiceMode === 'target_native' && (
                <Check className="h-3.5 w-3.5 text-cyan-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              Speaks native {targetLang?.nativeName || targetLang?.name} text with local language speech synthesis.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleModeChange('bilingual')}
            className={`p-3 rounded-xl border text-left transition-all ${
              customization.voiceMode === 'bilingual'
                ? 'border-emerald-500 bg-emerald-950/40 text-white ring-1 ring-emerald-400'
                : 'border-white/10 bg-white/[0.02] hover:bg-white/5 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Bilingual Step Narration
              </span>
              {customization.voiceMode === 'bilingual' && (
                <Check className="h-3.5 w-3.5 text-emerald-400" />
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-snug">
              Combines English step title and summary with detailed native script narration.
            </p>
          </button>
        </div>
      </div>

      {/* 2. Voice Personas Strip */}
      <div className="mt-5">
        <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider block mb-2.5">
          Select Narrator Persona & Timbre
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {PERSONA_LIST.map((item) => {
            const profile = VOICE_PERSONA_PROFILES[item.id];
            const isSelected = customization.persona === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPreset(item.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? `${item.color} ring-2 ring-purple-400 shadow-lg scale-[1.02]`
                    : 'border-white/10 bg-white/[0.02] hover:bg-white/5 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-white">{profile.name}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-purple-300" />}
                </div>
                <div className="text-[10px] text-slate-300 mt-1 line-clamp-2">
                  {profile.description}
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-purple-200">{item.badge}</span>
                  <span>{profile.pitch.toFixed(2)}x pitch</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Fine-Tuning Sliders */}
      <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Pitch Slider */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-200">Voice Pitch</span>
            <span className="font-mono text-purple-400 font-bold">{customization.pitch.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.70"
            max="1.30"
            step="0.05"
            value={customization.pitch}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              const updated = { ...customization, pitch: val };
              onUpdate(updated);
            }}
            className="w-full accent-purple-500 h-2 bg-white/10 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
            <span>Deep Baritone (0.7x)</span>
            <span>Balanced (1.0x)</span>
            <span>Bright Treble (1.3x)</span>
          </div>
        </div>

        {/* Speech Rate Slider */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-slate-200">Narration Speed</span>
            <span className="font-mono text-cyan-400 font-bold">{customization.speed.toFixed(2)}x</span>
          </div>
          <input
            type="range"
            min="0.75"
            max="1.40"
            step="0.05"
            value={customization.speed}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              const updated = { ...customization, speed: val };
              onUpdate(updated);
            }}
            className="w-full accent-cyan-500 h-2 bg-white/10 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
            <span>Slow & Patient (0.75x)</span>
            <span>Natural (1.0x)</span>
            <span>Brisk (1.40x)</span>
          </div>
        </div>

        {/* Voice Engine & Hardware Voice */}
        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label className="font-semibold text-slate-200">
              Synthesizer Voice Device
            </label>
            <span className="text-[10px] text-emerald-400 font-mono">
              {availableVoices.length} Voices Detected
            </span>
          </div>
          <select
            value={customization.voiceURI || ''}
            onChange={(e) => {
              const val = e.target.value;
              const selectedVoice = availableVoices.find((v) => v.voiceURI === val);
              const updated: VoiceCustomization = {
                ...customization,
                voiceURI: val,
                voiceName: selectedVoice?.name || 'Default System Voice'
              };
              onUpdate(updated);
              onPreviewVoice(updated);
            }}
            className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="">Auto-Select Best Voice ({targetLang?.name || 'English'})</option>
            {matchingVoices.length > 0 ? (
              matchingVoices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))
            ) : (
              availableVoices.slice(0, 20).map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))
            )}
          </select>
          <span className="text-[10px] text-slate-400 mt-1">
            {matchingVoices.length > 0
              ? `Native ${targetLang?.name} voice available on device`
              : `Automatic high-clarity voice engine with phonetics`}
          </span>
        </div>

      </div>

      {/* Test Playback Action Bar */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-300 flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-purple-400 animate-pulse" />
          <span>
            Active: <strong className="text-white uppercase">{customization.persona.replace('_', ' ')}</strong> ·{' '}
            Mode: <strong className="text-purple-300">
              {customization.voiceMode === 'target_native' ? `${targetLang?.name} Script` : 'Audience Explainer (English)'}
            </strong>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onPreviewVoice(customization)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>🔊 Test Live Voice Now</span>
        </button>
      </div>
    </div>
  );
};
