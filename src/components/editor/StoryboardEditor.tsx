import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Volume2, AlertTriangle, RefreshCw, Headphones } from 'lucide-react';
import { Scene, GuidanceConfig } from '../../types/index.ts';
import { getLanguageByCode } from '../../data/languageRegistry.ts';
import { audioNarrator } from '../../utils/audioNarrator.ts';

interface StoryboardEditorProps {
  scenes: Scene[];
  onUpdateScenes: (scenes: Scene[]) => void;
  config: GuidanceConfig;
  currentSceneIndex: number;
  onSelectScene: (index: number) => void;
  onRegenerateScene: (index: number) => void;
}

export const StoryboardEditor: React.FC<StoryboardEditorProps> = ({
  scenes,
  onUpdateScenes,
  config,
  currentSceneIndex,
  onSelectScene,
  onRegenerateScene
}) => {
  const targetLang = getLanguageByCode(config.targetLanguage);

  const handleUpdateScene = (id: string, partial: Partial<Scene>) => {
    const updated = scenes.map((s) => (s.id === id ? { ...s, ...partial } : s));
    onUpdateScenes(updated);
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= scenes.length) return;

    const copy = [...scenes];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reindexed = copy.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    onUpdateScenes(reindexed);
    onSelectScene(targetIndex);
  };

  const handleDeleteScene = (index: number) => {
    if (scenes.length <= 1) {
      alert('The guidance video must contain at least one scene.');
      return;
    }
    const updated = scenes.filter((_, i) => i !== index).map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    onUpdateScenes(updated);
    if (currentSceneIndex >= updated.length) {
      onSelectScene(updated.length - 1);
    }
  };

  const handleAddScene = () => {
    const newSceneNumber = scenes.length + 1;
    const isTelugu = config.targetLanguage === 'te';
    const isHindi = config.targetLanguage === 'hi';

    const newScene: Scene = {
      id: `scene-manual-${Date.now()}`,
      sceneNumber: newSceneNumber,
      title: `Step ${newSceneNumber}: Action Directive`,
      narrationText: isTelugu
        ? `దశ ${newSceneNumber}: ఈ సూచనను శ్రద్ధగా పూర్తి చేసి తదుపరి దశకు కొనసాగించండి.`
        : isHindi
        ? `चरण ${newSceneNumber}: इस निर्देश को ध्यानपूर्वक पूरा करें।`
        : `Step ${newSceneNumber}: Follow this instruction carefully to complete the procedure.`,
      narrationTextEnglish: `Step ${newSceneNumber}: Execute this action directive carefully to proceed with the workflow.`,
      onScreenText: isTelugu ? `దశ ${newSceneNumber}: కీలక సూచన` : `Step ${newSceneNumber}: Directive`,
      visualDescription: 'Instructional process diagram',
      durationSeconds: 6,
      keyHighlight: `Step ${newSceneNumber}`,
      stepNumber: newSceneNumber,
      isWarning: false
    };

    onUpdateScenes([...scenes, newScene]);
    onSelectScene(scenes.length);
  };

  const playSceneVoice = (scene: Scene) => {
    audioNarrator.speakScene(
      scene,
      config.voiceCustomization || {
        persona: 'studio_warmth',
        pitch: 1.05,
        speed: config.narrationSpeed || 1.0,
        volume: 1.0,
        gender: 'female',
        provider: 'browser',
        voiceMode: 'explainer_english'
      },
      config.targetLanguage
    );
  };

  return (
    <div className="w-full flex flex-col rounded-2xl bg-[#0f172a] border border-white/10 p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <span>Storyboard & Scene Timeline</span>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-500/30">
              {scenes.length} Scenes
            </span>
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
            <span>Target Script: <strong className="text-white">{targetLang?.name || 'Target'} ({targetLang?.nativeName || ''})</strong></span>
            <span aria-hidden="true">·</span>
            <span>Audience voiceover narration included</span>
          </div>
        </div>

        <button
          onClick={handleAddScene}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Scene</span>
        </button>
      </div>

      {/* Scene Cards List */}
      <div className="mt-5 space-y-4">
        {scenes.map((scene, idx) => {
          const isActive = idx === currentSceneIndex;

          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(idx)}
              className={`p-4 sm:p-5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-purple-950/30 border-purple-500/80 ring-1 ring-purple-500/40 shadow-lg shadow-purple-950/20'
                  : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-600/30 text-purple-300 font-mono text-xs font-bold">
                    {scene.sceneNumber}
                  </span>
                  <span className="font-semibold text-white text-sm">
                    {scene.title}
                  </span>
                  {scene.isWarning && (
                    <span className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30 font-semibold">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Safety Warning</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => playSceneVoice(scene)}
                    title="Speak this scene narration aloud"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 font-medium transition-colors"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span className="text-[11px]">Play Voice</span>
                  </button>
                  <button
                    onClick={() => onRegenerateScene(idx)}
                    title="Regenerate scene text"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveScene(idx, 'up')}
                    title="Move scene earlier"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={idx === scenes.length - 1}
                    onClick={() => handleMoveScene(idx, 'down')}
                    title="Move scene later"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteScene(idx)}
                    title="Delete scene"
                    className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs" onClick={(e) => e.stopPropagation()}>
                {/* Spoken Narrations */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-purple-300 block mb-1">
                      Native Script Narration ({targetLang?.name || 'Localized'})
                    </label>
                    <textarea
                      rows={2}
                      value={scene.narrationText}
                      onChange={(e) => handleUpdateScene(scene.id, { narrationText: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1 mb-1">
                      <Headphones className="h-3 w-3" />
                      Universal Audience Explanation (English Spoken Voice)
                    </label>
                    <textarea
                      rows={2}
                      value={scene.narrationTextEnglish || ''}
                      placeholder="Clear English spoken guide explaining this step to listeners..."
                      onChange={(e) => handleUpdateScene(scene.id, { narrationTextEnglish: e.target.value })}
                      className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>

                {/* On-Screen Text & Parameters */}
                <div className="flex flex-col justify-between gap-2">
                  <div>
                    <label className="text-[11px] font-semibold text-amber-300 block mb-1">
                      On-Screen Caption / Visual Card
                    </label>
                    <input
                      type="text"
                      value={scene.onScreenText}
                      onChange={(e) => handleUpdateScene(scene.id, { onScreenText: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Duration (Seconds)</label>
                      <input
                        type="number"
                        min="3"
                        max="25"
                        value={scene.durationSeconds}
                        onChange={(e) => handleUpdateScene(scene.id, { durationSeconds: parseInt(e.target.value) || 5 })}
                        className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">Protocol Type</label>
                      <button
                        onClick={() => handleUpdateScene(scene.id, { isWarning: !scene.isWarning })}
                        className={`w-full py-1.5 px-3 rounded-lg border text-center transition-colors text-xs font-medium ${
                          scene.isWarning
                            ? 'bg-amber-950/40 border-amber-500 text-amber-300'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        {scene.isWarning ? '⚠️ Safety Alert' : 'Standard Step'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
