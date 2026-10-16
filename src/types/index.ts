export type RegionCategory = 'all' | 'indian' | 'english' | 'european' | 'asian_middle_east' | 'others';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'female' | 'male' | 'neutral';
  accent?: string;
  provider: 'gemini' | 'browser' | 'none';
  recommended?: boolean;
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  region: 'indian' | 'english' | 'european' | 'asian_middle_east' | 'others';
  rtl?: boolean;
  capabilities: {
    translation: boolean;
    speech: boolean;
    subtitles: boolean;
  };
  voices: VoiceOption[];
  sampleGreeting: string;
}

export interface ExtractedDocument {
  id: string;
  title: string;
  rawText: string;
  detectedLanguage: string;
  wordCount: number;
  topic: string;
  keyPoints: string[];
  warnings: string[];
  prerequisites: string[];
  suggestedSteps: number;
}

export type AudienceType = 'beginner' | 'student' | 'professional' | 'technical' | 'general';
export type GuidanceStyle = 'step_by_step' | 'animated_explainer' | 'educational_lesson' | 'corporate_training' | 'safety_awareness' | 'technical_walkthrough';
export type VisualTheme = 'cinematic_dark' | 'clean_slate' | 'cyber_neon' | 'warm_editorial';
export type AspectRatioType = '16:9' | '9:16' | '1:1';
export type ToneType = 'friendly' | 'professional' | 'instructional' | 'authoritative';

export type VoicePersona = 'studio_warmth' | 'deep_anchor' | 'clear_educator' | 'dynamic_walkthrough' | 'calm_guidance';

export interface VoiceCustomization {
  persona: VoicePersona;
  pitch: number; // 0.7 (deep) to 1.3 (bright)
  speed: number; // 0.75 to 1.5
  volume: number; // 0.0 to 1.0
  voiceURI?: string;
  voiceName?: string;
  gender: 'female' | 'male' | 'neutral';
  provider: 'gemini' | 'browser' | 'none';
  voiceMode?: 'explainer_english' | 'target_native' | 'bilingual';
  geminiVoice?: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
}

export interface GuidanceConfig {
  sourceLanguage: string;
  targetLanguage: string;
  audience: AudienceType;
  guidanceStyle: GuidanceStyle;
  voiceId: string;
  accent: string;
  narrationSpeed: number; // 0.8 to 1.4
  tone: ToneType;
  visualTheme: VisualTheme;
  aspectRatio: AspectRatioType;
  subtitleLanguage: string;
  backgroundMusic: boolean;
  fidelityMode: 'faithful' | 'simple_language' | 'beginner_friendly' | 'technical';
  voiceCustomization?: VoiceCustomization;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  narrationText: string;
  narrationTextEnglish?: string;
  onScreenText: string;
  visualDescription: string;
  durationSeconds: number;
  keyHighlight?: string;
  stepNumber?: number;
  isWarning?: boolean;
  audioUrl?: string; // base64 or audio blob url
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  originalDocument: ExtractedDocument;
  config: GuidanceConfig;
  scenes: Scene[];
  status: 'draft' | 'analyzing' | 'scripting' | 'ready' | 'rendering' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
  videoUrl?: string;
  exportedBlobType?: string;
}

export type JobStep =
  | 'queued'
  | 'extracting_document'
  | 'analyzing'
  | 'translating'
  | 'creating_script'
  | 'generating_narration'
  | 'creating_visuals'
  | 'rendering_video'
  | 'completed'
  | 'failed';

export interface GenerationJob {
  id: string;
  projectId: string;
  step: JobStep;
  progress: number; // 0 to 100
  message: string;
  error?: string;
}
