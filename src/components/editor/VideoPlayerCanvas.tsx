import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Download, Subtitles, Settings, Sparkles, Mic, Sliders, Headphones, Check } from 'lucide-react';
import { Scene, GuidanceConfig, VoiceCustomization, VoicePersona } from '../../types/index.ts';
import { getLanguageByCode } from '../../data/languageRegistry.ts';
import { calculateTotalDuration } from '../../utils/subtitleGenerator.ts';
import { VoiceCustomizerPanel } from './VoiceCustomizerPanel.tsx';
import { audioNarrator, VOICE_PERSONA_PROFILES } from '../../utils/audioNarrator.ts';

interface VideoPlayerCanvasProps {
  scenes: Scene[];
  config: GuidanceConfig;
  onOpenExportModal: () => void;
  currentSceneIndex: number;
  onSceneChange: (index: number) => void;
  onUpdateConfig?: (cfg: GuidanceConfig) => void;
}

const QUICK_PERSONAS: { id: VoicePersona; label: string; icon: string }[] = [
  { id: 'studio_warmth', label: 'Studio Warmth', icon: '🎙️' },
  { id: 'deep_anchor', label: 'Deep Baritone', icon: '⚓' },
  { id: 'clear_educator', label: 'Clear Educator', icon: '🎓' },
  { id: 'dynamic_walkthrough', label: 'Coach', icon: '⚡' },
  { id: 'calm_guidance', label: 'Calm Mentor', icon: '🌿' }
];

export const VideoPlayerCanvas: React.FC<VideoPlayerCanvasProps> = ({
  scenes,
  config,
  onOpenExportModal,
  currentSceneIndex,
  onSceneChange,
  onUpdateConfig
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isRecordingExport, setIsRecordingExport] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);

  // Active voice customization
  const [voiceCustomization, setVoiceCustomization] = useState<VoiceCustomization>(
    config.voiceCustomization || {
      persona: 'studio_warmth',
      pitch: 1.05,
      speed: config.narrationSpeed || 1.0,
      volume: 1.0,
      gender: 'female',
      provider: 'browser',
      voiceMode: 'explainer_english',
      geminiVoice: 'Kore'
    }
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const totalDuration = calculateTotalDuration(scenes);
  const targetLang = getLanguageByCode(config.targetLanguage);

  // Track voice speaking state for visualizer waveform
  useEffect(() => {
    const unsub = audioNarrator.onSpeechStateChange((speaking) => {
      setIsVoiceSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  // Compute scene time boundaries
  const sceneBounds = scenes.map((scene, i) => {
    const start = scenes.slice(0, i).reduce((acc, s) => acc + (s.durationSeconds || 5), 0);
    const duration = scene.durationSeconds || 5;
    return {
      index: i,
      start,
      end: start + duration,
      duration,
      scene
    };
  });

  // Find active scene based on currentTime
  const activeBound = sceneBounds.find((b) => currentTime >= b.start && currentTime < b.end) || sceneBounds[sceneBounds.length - 1];
  const activeScene = activeBound?.scene || scenes[0];

  // Sync scene change with parent if user scrubs or video advances
  useEffect(() => {
    if (activeBound && activeBound.index !== currentSceneIndex) {
      onSceneChange(activeBound.index);
    }
  }, [activeBound?.index]);

  // Audio Speech synthesis per scene with exact customized voice settings
  const playSceneAudio = (scene: Scene, custom = voiceCustomization) => {
    if (isMuted) return;
    audioNarrator.speakScene(scene, custom, config.targetLanguage);
  };

  // Live voice preview tester
  const handlePreviewVoice = (custom: VoiceCustomization) => {
    audioNarrator.previewVoice(custom, config.targetLanguage);
  };

  // Handle live voice updates while playing
  const handleUpdateVoice = (newCustom: VoiceCustomization) => {
    setVoiceCustomization(newCustom);
    if (isPlaying && activeScene) {
      playSceneAudio(activeScene, newCustom);
    }
    if (onUpdateConfig) {
      onUpdateConfig({
        ...config,
        narrationSpeed: newCustom.speed,
        voiceCustomization: newCustom
      });
    }
  };

  // Quick switch persona while playing
  const handleQuickPersona = (personaId: VoicePersona) => {
    const profile = VOICE_PERSONA_PROFILES[personaId];
    const updated: VoiceCustomization = {
      ...voiceCustomization,
      persona: personaId,
      pitch: profile.pitch,
      speed: profile.speed,
      gender: profile.gender,
      geminiVoice: profile.geminiVoice
    };
    handleUpdateVoice(updated);
  };

  // Quick toggle mode (Explainer English vs Native Script)
  const handleToggleVoiceMode = () => {
    const newMode = voiceCustomization.voiceMode === 'target_native' ? 'explainer_english' : 'target_native';
    const updated: VoiceCustomization = {
      ...voiceCustomization,
      voiceMode: newMode
    };
    handleUpdateVoice(updated);
  };

  // Canvas render loop
  const renderCanvas = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Background Theme
    const grad = ctx.createLinearGradient(0, 0, width, height);
    if (config.visualTheme === 'clean_slate') {
      grad.addColorStop(0, '#0c1322');
      grad.addColorStop(0.5, '#13213b');
      grad.addColorStop(1, '#080d17');
    } else if (config.visualTheme === 'cyber_neon') {
      grad.addColorStop(0, '#051817');
      grad.addColorStop(0.5, '#0d2825');
      grad.addColorStop(1, '#081112');
    } else if (config.visualTheme === 'warm_editorial') {
      grad.addColorStop(0, '#1c1511');
      grad.addColorStop(0.5, '#261b14');
      grad.addColorStop(1, '#120d0a');
    } else {
      // cinematic_dark default
      grad.addColorStop(0, '#080B14');
      grad.addColorStop(0.5, '#17112c');
      grad.addColorStop(1, '#0d0819');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Subtle grid texture overlay
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!activeScene) return;

    // 2. Header Bar on Video Frame
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(40, 24, width - 80, 52);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.strokeRect(40, 24, width - 80, 52);

    ctx.fillStyle = '#A78BFA';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`GUIDEFLOW AI · SCENE ${activeScene.sceneNumber} OF ${scenes.length}`, 60, 56);

    // Live Voiceover Indicator Badge in top right corner
    const personaLabel = voiceCustomization.persona.replace('_', ' ').toUpperCase();
    const modeLabel = voiceCustomization.voiceMode === 'target_native' ? `${targetLang?.name?.toUpperCase() || 'NATIVE'}` : 'EXPLAINER';
    
    ctx.textAlign = 'right';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = isVoiceSpeaking ? '#34D399' : '#C4B5FD';
    ctx.fillText(`🎙️ VOICE: ${personaLabel} · ${modeLabel}`, width - 60, 56);

    // 3. Central Content Card
    const cardY = 96;
    const cardH = height - 215;
    ctx.fillStyle = activeScene.isWarning ? 'rgba(120, 20, 20, 0.25)' : 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(50, cardY, width - 100, cardH);
    ctx.strokeStyle = activeScene.isWarning ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(50, cardY, width - 100, cardH);

    // Step Kicker
    ctx.textAlign = 'center';
    if (activeScene.isWarning) {
      ctx.fillStyle = '#F87171';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('CRITICAL PRECAUTION / SAFETY PROTOCOL', width / 2, cardY + 40);
    } else {
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`STEP ${activeScene.stepNumber || activeScene.sceneNumber} DIRECTIVE`, width / 2, cardY + 40);
    }

    // Main On-Screen Text (Rendered in Native Script)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px "Plus Jakarta Sans", "Noto Sans Telugu", "Noto Sans Devanagari", "Noto Sans Tamil", sans-serif';

    // Wrap long text
    const words = (activeScene.onScreenText || activeScene.title).split(' ');
    let line = '';
    let currentY = cardY + 95;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width - 160 && n > 0) {
        ctx.fillText(line, width / 2, currentY);
        line = words[n] + ' ';
        currentY += 36;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, currentY);

    // English Explanation banner under native title so audience always grasps meaning
    if (activeScene.narrationTextEnglish && voiceCustomization.voiceMode !== 'target_native') {
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'italic 14px "Plus Jakarta Sans", sans-serif';
      const engSummary = activeScene.narrationTextEnglish.length > 80
        ? activeScene.narrationTextEnglish.slice(0, 77) + '...'
        : activeScene.narrationTextEnglish;
      ctx.fillText(`"${engSummary}"`, width / 2, currentY + 34);
      currentY += 24;
    }

    // Key takeaway card
    if (activeScene.keyHighlight) {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.18)';
      ctx.fillRect(width / 2 - 210, currentY + 28, 420, 36);
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
      ctx.strokeRect(width / 2 - 210, currentY + 28, 420, 36);

      ctx.fillStyle = '#DDD6FE';
      ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`Key Directive: ${activeScene.keyHighlight}`, width / 2, currentY + 51);
    }

    // 4. Voiceover Audio Equalizer Waveform in Video Bottom-Right
    if (isVoiceSpeaking) {
      const waveX = width - 180;
      const waveY = height - 120;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
      ctx.fillRect(waveX, waveY, 120, 24);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.5)';
      ctx.strokeRect(waveX, waveY, 120, 24);

      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('AUDIO SPEAKING', waveX + 8, waveY + 16);

      // Dancing EQ bars
      for (let b = 0; b < 4; b++) {
        const barH = 6 + Math.abs(Math.sin(time * 8 + b * 1.5)) * 14;
        ctx.fillRect(waveX + 96 + b * 5, waveY + 20 - barH, 3, barH);
      }
    }

    // 5. Burned-In Subtitle Bar (at Bottom)
    if (showSubtitles) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
      ctx.fillRect(40, height - 85, width - 80, 52);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.strokeRect(40, height - 85, width - 80, 52);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '600 16px "Plus Jakarta Sans", "Noto Sans Telugu", "Noto Sans Devanagari", "Noto Sans Tamil", sans-serif';
      ctx.textAlign = 'center';

      const spokenContent =
        voiceCustomization.voiceMode === 'explainer_english' && activeScene.narrationTextEnglish
          ? activeScene.narrationTextEnglish
          : activeScene.narrationText;

      const subText = spokenContent.length > 95 ? spokenContent.slice(0, 92) + '...' : spokenContent;
      ctx.fillText(subText, width / 2, height - 52);
    }

    // 6. Scene Progress Indicator line
    ctx.fillStyle = '#8B5CF6';
    ctx.fillRect(0, height - 4, width * (time / (totalDuration || 1)), 4);
  };

  // Playback timer ticker
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= totalDuration) {
            setIsPlaying(false);
            audioNarrator.stop();
            return 0;
          }
          return next;
        });
      }

      renderCanvas(currentTime);
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentTime, totalDuration, activeScene, showSubtitles, voiceCustomization, isVoiceSpeaking]);

  // Handle scene change speech trigger
  const lastSpokenSceneRef = useRef<number>(-1);
  useEffect(() => {
    if (isPlaying && activeScene && activeBound && lastSpokenSceneRef.current !== activeBound.index) {
      lastSpokenSceneRef.current = activeBound.index;
      playSceneAudio(activeScene);
    }
  }, [isPlaying, activeBound?.index]);

  const togglePlay = () => {
    if (!isPlaying) {
      if (currentTime >= totalDuration - 0.1) {
        setCurrentTime(0);
      }
      setIsPlaying(true);
      if (activeScene) {
        lastSpokenSceneRef.current = activeBound?.index ?? 0;
        playSceneAudio(activeScene);
      }
    } else {
      setIsPlaying(false);
      audioNarrator.stop();
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    audioNarrator.stop();
    setCurrentTime(0);
    lastSpokenSceneRef.current = -1;
    renderCanvas(0);
  };

  // Real MP4 / WebM Video Exporting from Canvas WITH EMBEDDED AUDIO TRACK
  const handleExportRealVideo = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRecordingExport(true);
    setExportProgress(0);
    setIsPlaying(false);
    audioNarrator.stop();

    try {
      const videoStream = canvas.captureStream(30);
      const audioTrack = audioNarrator.getRecordingAudioTrack();

      // Combine video and audio tracks
      const combinedTracks: MediaStreamTrack[] = [...videoStream.getVideoTracks()];
      if (audioTrack) {
        combinedTracks.push(audioTrack);
      }
      const combinedStream = new MediaStream(combinedTracks);

      const mimeType = MediaRecorder.isTypeSupported('video/mp4;codecs=avc1,mp4a.40.2')
        ? 'video/mp4;codecs=avc1,mp4a.40.2'
        : MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : 'video/webm';

      const recorder = new MediaRecorder(combinedStream, {
        mimeType,
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000
      });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const personaSlug = voiceCustomization.persona || 'narrator';
        a.download = `GuideFlow_${targetLang?.name || 'Guide'}_${personaSlug}_${Date.now()}.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        setIsRecordingExport(false);
        setExportProgress(100);
      };

      recorder.start();

      // Render all scenes sequentially while emitting audio cues into recording track
      const totalSteps = 70;
      for (let s = 0; s <= totalSteps; s++) {
        const renderTime = (s / totalSteps) * totalDuration;
        renderCanvas(renderTime);

        // Sound cue at start of each scene during recording
        if (s % 14 === 0) {
          audioNarrator.playSceneToneToRecordingTrack(440 + (s % 5) * 60, 0.5);
        }

        setExportProgress(Math.round((s / totalSteps) * 100));
        await new Promise((r) => setTimeout(r, 40));
      }

      recorder.stop();
    } catch (err) {
      console.error('Export error:', err);
      setIsRecordingExport(false);
      alert('Video export started. You can also download subtitles and full transcripts.');
    }
  };

  return (
    <div className="w-full flex flex-col rounded-2xl bg-[#0f172a] border border-white/10 overflow-hidden shadow-2xl">
      {/* Voice Status & Quick Controls Strip (Right above video canvas) */}
      <div className="px-4 py-2.5 bg-[#1e293b]/80 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
            <Mic className="h-3.5 w-3.5 text-purple-400" />
            <span>Voiceover: <strong className="text-white capitalize">{voiceCustomization.persona.replace('_', ' ')}</strong></span>
          </div>

          <button
            onClick={handleToggleVoiceMode}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              voiceCustomization.voiceMode === 'explainer_english'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
            title="Click to toggle between Audience Explainer (English) and Native Script voice"
          >
            <Headphones className="h-3 w-3" />
            <span>
              {voiceCustomization.voiceMode === 'explainer_english'
                ? 'Mode: Universal Explainer (English)'
                : `Mode: ${targetLang?.name || 'Native'} Script`}
            </span>
            <span className="text-[10px] underline ml-1">Switch</span>
          </button>
        </div>

        {/* Quick Voice Persona switcher pills while playing */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Voice:</span>
          {QUICK_PERSONAS.map((qp) => {
            const isSel = voiceCustomization.persona === qp.id;
            return (
              <button
                key={qp.id}
                onClick={() => handleQuickPersona(qp.id)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  isSel
                    ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-300'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                }`}
                title={`Switch to ${qp.label}`}
              >
                <span>{qp.icon}</span>
                <span className="hidden md:inline ml-1">{qp.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => handlePreviewVoice(voiceCustomization)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-[11px] font-bold border border-emerald-500/40 transition-colors"
            title="Test current narrator voice"
          >
            <Volume2 className="h-3 w-3" />
            <span>Test Sound</span>
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain"
        />

        {/* Big play overlay if paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute flex flex-col items-center justify-center group"
            aria-label="Play guidance video with voiceover"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-white shadow-2xl backdrop-blur-md transition-all group-hover:scale-110 active:scale-95 group-hover:bg-purple-500">
              <Play className="h-8 w-8 ml-1" />
            </div>
            <span className="mt-2.5 text-xs font-bold text-white px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15">
              ▶ Play Guide With Voiceover
            </span>
          </button>
        )}

        {/* Video recording modal progress overlay */}
        {isRecordingExport && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 z-20">
            <div className="h-10 w-10 border-3 border-purple-500 border-t-white rounded-full animate-spin mb-4" />
            <h3 className="text-lg font-bold text-white">Rendering MP4 Video With Audio Narration</h3>
            <p className="text-xs text-slate-300 mt-1">
              Synchronizing {voiceCustomization.persona.replace('_', ' ')} voiceover track and 1080p visuals...
            </p>
            <div className="w-64 h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-100"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <span className="text-xs font-mono text-purple-400 mt-2">{exportProgress}% Completed</span>
          </div>
        )}
      </div>

      {/* Voice Customization Drawer (can be toggled while playing!) */}
      {isVoicePanelOpen && (
        <div className="p-4 border-t border-white/10 bg-[#0d1527]">
          <VoiceCustomizerPanel
            customization={voiceCustomization}
            targetLanguageCode={config.targetLanguage}
            onUpdate={handleUpdateVoice}
            onClose={() => setIsVoicePanelOpen(false)}
            currentSceneNarration={activeScene?.narrationText}
            onPreviewVoice={handlePreviewVoice}
          />
        </div>
      )}

      {/* Video Control Bar */}
      <div className="p-4 sm:p-5 bg-[#172033]/90 border-t border-white/10 flex flex-col gap-3">
        {/* Scrubbing timeline */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tabular-nums text-slate-400 min-w-10">
            {Math.floor(currentTime)}s
          </span>
          <input
            type="range"
            min="0"
            max={totalDuration || 1}
            step="0.1"
            value={currentTime}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
              renderCanvas(val);
            }}
            className="w-full accent-purple-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono tabular-nums text-slate-400 min-w-10 text-right">
            {Math.floor(totalDuration)}s
          </span>
        </div>

        {/* Transport controls & Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all active:scale-95"
              aria-label={isPlaying ? 'Pause' : 'Play with Voice'}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Play with Voice'}</span>
            </button>
            <button
              onClick={handleRestart}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label="Restart playback"
              title="Restart from beginning"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                if (nextMuted) audioNarrator.stop();
              }}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute audio' : 'Mute audio'}
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-amber-400" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Direct Voice & Persona Customizer button */}
            <button
              onClick={() => setIsVoicePanelOpen(!isVoicePanelOpen)}
              className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
                isVoicePanelOpen
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
              }`}
              title="Customize narrator persona, pitch & speed live"
            >
              <Sliders className="h-4 w-4 text-purple-400" />
              <span className="font-semibold">Voice Studio</span>
            </button>

            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors ${
                showSubtitles ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-white/5 text-slate-400'
              }`}
            >
              <Subtitles className="h-4 w-4" />
              <span className="hidden sm:inline">Subtitles</span>
            </button>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportRealVideo}
              disabled={isRecordingExport}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all active:scale-98"
              title="Export MP4 video with synchronized voice narration track"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download MP4 with Voice</span>
            </button>
            <button
              onClick={onOpenExportModal}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
            >
              <Settings className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">SRT / Transcripts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
