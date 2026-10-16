import React from 'react';
import { Globe, Users, Film, Sliders, Volume2, Sparkles, Check, ChevronDown, AlertCircle } from 'lucide-react';
import { GuidanceConfig, LanguageInfo } from '../../types/index.ts';
import { getLanguageByCode } from '../../data/languageRegistry.ts';

interface GuidanceConfigPanelProps {
  config: GuidanceConfig;
  onChangeConfig: (newConfig: GuidanceConfig) => void;
  onOpenLanguagePicker: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

export const GuidanceConfigPanel: React.FC<GuidanceConfigPanelProps> = ({
  config,
  onChangeConfig,
  onOpenLanguagePicker,
  onGenerate,
  isGenerating,
  canGenerate
}) => {
  const targetLang = getLanguageByCode(config.targetLanguage) || {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    code: 'te',
    capabilities: { speech: true, translation: true, subtitles: true },
    script: 'Telugu',
    voices: []
  };

  const update = (partial: Partial<GuidanceConfig>) => {
    onChangeConfig({ ...config, ...partial });
  };

  return (
    <div className="w-full rounded-2xl bg-[#111827] border border-white/10 p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="h-5 w-5 text-purple-400" />
            <span>Guidance Video Customization</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure target language, voice narration, pedagogical style, and visual framing.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* 1. Target Language Card */}
        <div className="flex flex-col justify-between p-5 rounded-xl bg-white/[0.02] border border-white/10">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="h-4 w-4" />
                <span>Target Language</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                {targetLang.code}
              </span>
            </div>
            
            <button
              onClick={onOpenLanguagePicker}
              className="mt-3 w-full flex items-center justify-between p-3.5 rounded-xl bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/30 text-left transition-all group"
            >
              <div>
                <div className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                  {targetLang.name}
                </div>
                <div className="text-lg font-medium text-purple-400 mt-0.5">
                  {targetLang.nativeName}
                </div>
              </div>
              <ChevronDown className="h-5 w-5 text-purple-400 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
              <span className={targetLang.capabilities.speech ? 'text-emerald-400' : 'text-slate-400'}>
                {targetLang.capabilities.speech ? '✓ Voice Narration Ready' : '• Subtitled Guidance'}
              </span>
              <span aria-hidden="true">·</span>
              <span>{targetLang.script} Script</span>
            </div>
          </div>
        </div>

        {/* 2. Audience & Pedagogical Style */}
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>Audience & Guidance Style</span>
            </span>

            <div className="mt-3 space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Audience</label>
                <select
                  value={config.audience}
                  onChange={(e) => update({ audience: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="beginner">Beginner (Step-by-step clarity)</option>
                  <option value="student">Student / Academic (Conceptual foundations)</option>
                  <option value="professional">Professional / Workplace (Corporate standards)</option>
                  <option value="technical">Technical / Developer (Precise terminology)</option>
                  <option value="general">General Audience (Simple & engaging)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Guidance Format</label>
                <select
                  value={config.guidanceStyle}
                  onChange={(e) => update({ guidanceStyle: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="step_by_step">Step-by-Step Practical Tutorial</option>
                  <option value="animated_explainer">Animated Explainer & Concepts</option>
                  <option value="safety_awareness">Safety SOP & Emergency Protocol</option>
                  <option value="corporate_training">Corporate Policy & Compliance</option>
                  <option value="technical_walkthrough">Engineering & System Walkthrough</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Voice, Tone & Speed */}
        <div className="p-5 rounded-xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Volume2 className="h-4 w-4" />
              <span>Voice Narration & Tone</span>
            </span>

            <div className="mt-3 space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Narrator Persona & Timbre</label>
                <select
                  value={config.voiceCustomization?.persona || 'studio_warmth'}
                  onChange={(e) => {
                    const persona = e.target.value as any;
                    const pitch = persona === 'deep_anchor' ? 0.8 : persona === 'dynamic_walkthrough' ? 1.15 : persona === 'calm_guidance' ? 0.92 : 1.05;
                    update({
                      voiceCustomization: {
                        persona,
                        pitch,
                        speed: config.narrationSpeed || 1.0,
                        volume: 1.0,
                        gender: persona === 'deep_anchor' || persona === 'dynamic_walkthrough' ? 'male' : 'female',
                        provider: 'browser'
                      }
                    });
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 font-medium"
                >
                  <option value="studio_warmth">Studio Warmth (Female · Articulate broadcast)</option>
                  <option value="deep_anchor">Deep Anchor (Male · Authoritative baritone)</option>
                  <option value="clear_educator">Clear Educator (Neutral · Patient cadence)</option>
                  <option value="dynamic_walkthrough">Dynamic Walkthrough (Male · Fast paced)</option>
                  <option value="calm_guidance">Calm Guidance (Female · Soothing tone)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Narration Tone</label>
                <select
                  value={config.tone}
                  onChange={(e) => update({ tone: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="instructional">Instructional & Clear</option>
                  <option value="friendly">Friendly & Warm</option>
                  <option value="professional">Professional & Authoritative</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Narration Pace</span>
                  <span className="font-mono text-purple-400">{config.narrationSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.3"
                  step="0.05"
                  value={config.narrationSpeed}
                  onChange={(e) => update({ narrationSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Framing & Fidelity Bar */}
      <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div>
          <label className="text-slate-400 block mb-1.5 font-medium">Video Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: '16:9', label: '16:9 (Landscape / YouTube)' },
              { id: '9:16', label: '9:16 (Shorts / Mobile)' },
              { id: '1:1', label: '1:1 (Square)' }
            ].map((ar) => (
              <button
                key={ar.id}
                onClick={() => update({ aspectRatio: ar.id as any })}
                className={`py-2 px-2 text-center rounded-lg border transition-colors ${
                  config.aspectRatio === ar.id
                    ? 'bg-purple-600/30 border-purple-500 text-white font-medium'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                {ar.id}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1.5 font-medium">Visual Presentation Theme</label>
          <select
            value={config.visualTheme}
            onChange={(e) => update({ visualTheme: e.target.value as any })}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="cinematic_dark">Cinematic Dark SaaS (Studio Violet)</option>
            <option value="clean_slate">Clean Technical Slate (DevOps Cyan)</option>
            <option value="cyber_neon">High-Contrast Alert (Safety Emerald/Amber)</option>
            <option value="warm_editorial">Warm Editorial (Education & SOP)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1.5 font-medium">Translation Fidelity</label>
          <select
            value={config.fidelityMode}
            onChange={(e) => update({ fidelityMode: e.target.value as any })}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="simple_language">Simple-Language Explanation (Recommended)</option>
            <option value="faithful">Strict Faithful Translation (Preserve all terms)</option>
            <option value="beginner_friendly">Beginner-Friendly Walkthrough</option>
            <option value="technical">Technical In-Depth Specification</option>
          </select>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-purple-400" />
          <span>Produces authentic {targetLang.nativeName} ({targetLang.name}) narration script and synchronized visuals</span>
        </div>

        <button
          disabled={!canGenerate || isGenerating}
          onClick={onGenerate}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/25 disabled:opacity-50 transition-all active:scale-98"
        >
          {isGenerating ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating {targetLang.name} Guidance Video...</span>
            </>
          ) : (
            <>
              <Film className="h-4 w-4" />
              <span>Create {targetLang.name} Guidance Video</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
