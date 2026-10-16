import React, { useState, useEffect } from 'react';
import { Sparkles, Play, Pause, Globe, Shield, FileCheck, Volume2, Mic, Headphones, ArrowRight } from 'lucide-react';
import { audioNarrator, VOICE_PERSONA_PROFILES } from '../../utils/audioNarrator.ts';
import { VoicePersona, VoiceCustomization, Scene } from '../../types/index.ts';

interface LandingHeroProps {
  onStartGuide: () => void;
  onWatchSample: () => void;
  onExploreLanguages: () => void;
}

const SAMPLE_TELUGU_SCENE: Scene = {
  id: 'hero-preview-scene',
  sceneNumber: 1,
  title: 'Canary Deployment Protocol',
  narrationText: 'మొదటి దశ: కంటైనర్ ఇమేజ్‌ను కేవలం 10 శాతం ట్రాఫిక్ పాడ్స్‌కు మాత్రమే డిప్లాయ్ చేయండి. ప్రొమెథియస్ లాటెన్సీని ఐదు నిమిషాలు గమనించండి.',
  narrationTextEnglish: 'Step 1: Canary Release Strategy. Deploy the container image to only 10% of traffic pods. Monitor Prometheus latency for 5 minutes before expanding.',
  onScreenText: 'దశ 1: 10% ట్రాఫిక్‌తో కెనరీ డిప్లాయ్‌మెంట్',
  visualDescription: 'Cloud architecture overview with system health indicators',
  durationSeconds: 8,
  keyHighlight: '10% Traffic Canary',
  stepNumber: 1,
  isWarning: false
};

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartGuide,
  onWatchSample,
  onExploreLanguages
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePersona, setActivePersona] = useState<VoicePersona>('studio_warmth');
  const [voiceMode, setVoiceMode] = useState<'explainer_english' | 'target_native'>('explainer_english');

  useEffect(() => {
    const unsub = audioNarrator.onSpeechStateChange((speaking) => {
      setIsPlayingAudio(speaking);
    });
    return () => unsub();
  }, []);

  const getCustomization = (persona: VoicePersona = activePersona, mode = voiceMode): VoiceCustomization => {
    const profile = VOICE_PERSONA_PROFILES[persona];
    return {
      persona,
      pitch: profile.pitch,
      speed: profile.speed,
      gender: profile.gender,
      geminiVoice: profile.geminiVoice,
      provider: 'browser',
      volume: 1.0,
      voiceMode: mode
    };
  };

  const handlePlayVoiceover = () => {
    if (isPlayingAudio) {
      audioNarrator.stop();
      setIsPlayingAudio(false);
    } else {
      const custom = getCustomization();
      audioNarrator.speakScene(SAMPLE_TELUGU_SCENE, custom, 'te');
      setIsPlayingAudio(true);
    }
  };

  const handleChangePersona = (persona: VoicePersona) => {
    setActivePersona(persona);
    const custom = getCustomization(persona, voiceMode);
    audioNarrator.speakScene(SAMPLE_TELUGU_SCENE, custom, 'te');
    setIsPlayingAudio(true);
  };

  const handleToggleMode = () => {
    const nextMode = voiceMode === 'explainer_english' ? 'target_native' : 'explainer_english';
    setVoiceMode(nextMode);
    const custom = getCustomization(activePersona, nextMode);
    audioNarrator.speakScene(SAMPLE_TELUGU_SCENE, custom, 'te');
    setIsPlayingAudio(true);
  };

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 border-b border-white/10">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-600/10 blur-[130px] -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-600/10 blur-[110px] -z-10 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Tagline kicker */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-purple-400 font-bold mb-4 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30">
              <Mic className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              <span>Any Document. Any Language. One Clear Guide.</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white text-balance leading-[1.12]">
              Your Documents. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-300">
                Your Language.
              </span> <br />
              Your Video Guide.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl text-balance leading-relaxed">
              Transform PDFs, DOCX files, technical protocols, and pasted paragraphs into clear, step-by-step guidance videos with audible multilingual voiceovers in Telugu, Hindi, Tamil, English, and world languages.
            </p>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3.5">
              <button
                onClick={onStartGuide}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-xl shadow-purple-600/30 transition-all hover:shadow-purple-600/50 active:scale-98"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create Video Guide</span>
              </button>

              <button
                onClick={onWatchSample}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold border border-white/10 transition-colors"
              >
                <Play className="h-4 w-4 text-cyan-400 fill-current" />
                <span>Open Video Studio</span>
              </button>

              <button
                onClick={onExploreLanguages}
                className="flex items-center gap-2 text-xs text-slate-300 hover:text-purple-300 transition-colors py-2 px-3"
              >
                <Globe className="h-3.5 w-3.5 text-purple-400" />
                <span>22 Indian Languages + Global Catalog</span>
              </button>
            </div>

            {/* Feature badges */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <FileCheck className="h-4 w-4 text-cyan-400" />
                <span>PDF, DOCX, TXT & Paste</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-purple-400" />
                <span>Custom Voiceovers While Playing</span>
              </div>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>MP4 Video With Synchronized Audio</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Guidance Video Card with Real Audio Controls */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#0f172a] border border-purple-500/30 p-5 shadow-2xl shadow-purple-950/50">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-white">Live Voice Preview Player</span>
                </div>
                <span className="text-purple-300 font-medium px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  Telugu · తెలుగు
                </span>
              </div>

              {/* Video Frame Canvas Simulation with Real Audio */}
              <div className="relative mt-3 aspect-video w-full rounded-xl bg-[#080B14] border border-white/10 overflow-hidden flex flex-col justify-between p-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/40 via-transparent to-cyan-950/30" />

                {/* Top Badge on screen */}
                <div className="relative z-10 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-purple-300 uppercase tracking-wider">
                    GUIDEFLOW AI · SCENE 1
                  </span>
                  <span className={`px-2 py-0.5 rounded font-mono font-semibold text-[10px] ${
                    isPlayingAudio ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-white/10 text-slate-300'
                  }`}>
                    {isPlayingAudio ? '🔊 NARRATING STEP' : 'AUDIO READY'}
                  </span>
                </div>

                {/* Center Title & Native Script */}
                <div className="relative z-10 text-center my-auto">
                  <div className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                    STEP 1 DIRECTIVE
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-white mt-1">
                    దశ 1: 10% ట్రాఫిక్‌తో కెనరీ డిప్లాయ్‌మెంట్
                  </div>
                  <div className="text-xs text-slate-300 italic mt-1 line-clamp-1">
                    &quot;{SAMPLE_TELUGU_SCENE.narrationTextEnglish}&quot;
                  </div>
                </div>

                {/* Subtitle bar at bottom of frame */}
                <div className="relative z-10 bg-black/85 border border-white/10 rounded-lg py-1.5 px-3 text-[11px] text-center text-white truncate">
                  {voiceMode === 'explainer_english'
                    ? SAMPLE_TELUGU_SCENE.narrationTextEnglish
                    : SAMPLE_TELUGU_SCENE.narrationText}
                </div>
              </div>

              {/* Voiceover Customizer Strip on Hero Card */}
              <div className="mt-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Mic className="h-3.5 w-3.5 text-purple-400" />
                    Narrator Voice:
                  </span>

                  <button
                    onClick={handleToggleMode}
                    className="text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 underline flex items-center gap-1"
                  >
                    <Headphones className="h-3 w-3" />
                    <span>Mode: {voiceMode === 'explainer_english' ? 'Audience Explainer (English)' : 'Telugu Script'}</span>
                  </button>
                </div>

                {/* Persona selector pills */}
                <div className="grid grid-cols-3 gap-1.5">
                  {(['studio_warmth', 'deep_anchor', 'clear_educator'] as VoicePersona[]).map((p) => {
                    const prof = VOICE_PERSONA_PROFILES[p];
                    const isSel = activePersona === p;
                    return (
                      <button
                        key={p}
                        onClick={() => handleChangePersona(p)}
                        className={`py-1 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                          isSel
                            ? 'bg-purple-600 border-purple-400 text-white shadow-sm'
                            : 'bg-white/5 border-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {prof.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>

                {/* Play Sound Button */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handlePlayVoiceover}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all active:scale-98"
                  >
                    {isPlayingAudio ? (
                      <>
                        <Pause className="h-3.5 w-3.5" />
                        <span>Stop Voiceover</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>▶ Play Sample Voiceover Now</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={onWatchSample}
                    className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 transition-colors"
                    title="Open full interactive player and download MP4"
                  >
                    <span>Full Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
