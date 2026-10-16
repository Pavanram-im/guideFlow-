import React, { useState } from 'react';
import { X, Download, FileText, Subtitles, Code, Film, Check, Mic, Sliders, Volume2 } from 'lucide-react';
import { Scene, GuidanceConfig } from '../../types/index.ts';
import { getLanguageByCode } from '../../data/languageRegistry.ts';
import { generateSRT, generateWebVTT, generateTranscript, calculateTotalDuration } from '../../utils/subtitleGenerator.ts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenes: Scene[];
  config: GuidanceConfig;
  onDownloadVideo: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  scenes,
  config,
  onDownloadVideo
}) => {
  const [selectedQuality, setSelectedQuality] = useState<'1080p' | '720p'>('1080p');
  const [audioTrackMode, setAudioTrackMode] = useState<'custom_voice' | 'studio_ambience' | 'muted'>('custom_voice');

  if (!isOpen) return null;

  const targetLang = getLanguageByCode(config.targetLanguage);
  const totalDuration = calculateTotalDuration(scenes);
  const voice = config.voiceCustomization || {
    persona: 'studio_warmth',
    pitch: 1.05,
    speed: config.narrationSpeed || 1.0,
    volume: 1.0,
    gender: 'female',
    provider: 'browser'
  };

  const downloadTextFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSRT = () => {
    const srt = generateSRT(scenes);
    downloadTextFile(srt, `GuideFlow_${targetLang?.code || 'subtitles'}.srt`, 'text/plain;charset=utf-8');
  };

  const handleDownloadVTT = () => {
    const vtt = generateWebVTT(scenes);
    downloadTextFile(vtt, `GuideFlow_${targetLang?.code || 'subtitles'}.vtt`, 'text/vtt;charset=utf-8');
  };

  const handleDownloadTranscript = () => {
    const transcript = generateTranscript(scenes, targetLang?.name || 'Localized');
    downloadTextFile(transcript, `GuideFlow_Transcript_${targetLang?.code || 'lang'}.txt`, 'text/plain;charset=utf-8');
  };

  const handleDownloadJSON = () => {
    const data = JSON.stringify({ config, scenes, generatedAt: new Date().toISOString() }, null, 2);
    downloadTextFile(data, `GuideFlow_Storyboard_${targetLang?.code || 'project'}.json`, 'application/json');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
      <div 
        className="relative flex flex-col w-full max-w-2xl rounded-2xl bg-[#111827] border border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#172033]/60">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-400" />
              <span>Export & Downloads</span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Target: {targetLang?.name} ({targetLang?.nativeName})</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{Math.round(totalDuration)}s runtime</span>
              <span aria-hidden="true">·</span>
              <span>{scenes.length} scenes</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content options */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* 1. MP4 Video Download with Voice Customization Info */}
          <div className="p-5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Film className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Full Guidance Video (MP4 / WebM)</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    High-definition video with burned-in native subtitles and customized voice narration.
                  </p>
                </div>
              </div>
            </div>

            {/* Voice & Video Options inside MP4 download card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-purple-500/20 text-xs">
              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-1.5 text-purple-300 font-semibold mb-1">
                  <Mic className="h-3.5 w-3.5" />
                  <span>Customized Voice Narration</span>
                </div>
                <div className="text-white capitalize font-medium">
                  {voice.persona.replace('_', ' ')} ({voice.gender})
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Pitch: {voice.pitch.toFixed(2)}x · Speed: {voice.speed.toFixed(2)}x
                </div>
              </div>

              <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-1.5 text-cyan-300 font-semibold mb-1">
                  <Sliders className="h-3.5 w-3.5" />
                  <span>Audio Narration Track</span>
                </div>
                <select
                  value={audioTrackMode}
                  onChange={(e) => setAudioTrackMode(e.target.value as any)}
                  className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-[11px] focus:outline-none"
                >
                  <option value="custom_voice">Custom Voice (Embedded Audio)</option>
                  <option value="studio_ambience">Custom Voice + Ambient Bed</option>
                  <option value="muted">Muted (Subtitles Only)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Resolution:</span>
                <button
                  onClick={() => setSelectedQuality('1080p')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    selectedQuality === '1080p' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  1080p Full HD
                </button>
                <button
                  onClick={() => setSelectedQuality('720p')}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    selectedQuality === '720p' ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  720p HD
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onDownloadVideo();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-98"
              >
                <Download className="h-4 w-4" />
                <span>Export MP4 Video</span>
              </button>
            </div>
          </div>

          {/* 2. Subtitle Files (SRT & VTT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <Subtitles className="h-5 w-5 text-cyan-400" />
                <div>
                  <h4 className="font-semibold text-white text-xs">Subtitles (SRT)</h4>
                  <p className="text-[11px] text-slate-400">Standard SubRip format</p>
                </div>
              </div>
              <button
                onClick={handleDownloadSRT}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                title="Download SRT"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <Subtitles className="h-5 w-5 text-cyan-400" />
                <div>
                  <h4 className="font-semibold text-white text-xs">Subtitles (WebVTT)</h4>
                  <p className="text-[11px] text-slate-400">Web video player captions</p>
                </div>
              </div>
              <button
                onClick={handleDownloadVTT}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                title="Download WebVTT"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 3. Text Transcript & Storyboard JSON */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-white text-xs">Transcript (TXT)</h4>
                  <p className="text-[11px] text-slate-400">Numbered timecodes & script</p>
                </div>
              </div>
              <button
                onClick={handleDownloadTranscript}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                title="Download Transcript"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <Code className="h-5 w-5 text-amber-400" />
                <div>
                  <h4 className="font-semibold text-white text-xs">Storyboard Data (JSON)</h4>
                  <p className="text-[11px] text-slate-400">Complete raw project scenes</p>
                </div>
              </div>
              <button
                onClick={handleDownloadJSON}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                title="Download Storyboard JSON"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#172033]/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
