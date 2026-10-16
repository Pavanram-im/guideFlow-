import type { Scene, VoiceCustomization, VoicePersona } from '../types/index.ts';
import { getLanguageByCode } from '../data/languageRegistry.ts';

/**
 * GuideFlow AI Multi-Engine Audio & Voiceover Manager
 * Handles:
 * 1. Web Speech Synthesis with anti-stall and smart language fallback
 * 2. Audience Explainer voice vs Target Native voice modes
 * 3. Web Audio API synthesis for recording audio into exported MP4 videos
 * 4. Gemini Neural Voice integration (/api/tts/generate)
 * 5. Instant Voice Preview Tester
 */

// Voice persona profiles with distinct auditory personalities
export const VOICE_PERSONA_PROFILES: Record<
  VoicePersona,
  {
    name: string;
    gender: 'female' | 'male' | 'neutral';
    pitch: number;
    speed: number;
    geminiVoice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
    description: string;
    previewText: string;
  }
> = {
  studio_warmth: {
    name: 'Studio Warmth',
    gender: 'female',
    pitch: 1.06,
    speed: 1.0,
    geminiVoice: 'Kore',
    description: 'Broadcast-quality warm feminine timbre with natural pacing.',
    previewText: 'Welcome to GuideFlow AI. I am your Studio Warmth narrator, ready to guide your listeners step by step with crystal clarity.'
  },
  deep_anchor: {
    name: 'Deep Baritone Anchor',
    gender: 'male',
    pitch: 0.78,
    speed: 0.95,
    geminiVoice: 'Charon',
    description: 'Deep resonant baritone authority suited for safety, SOPs and engineering protocols.',
    previewText: 'GuideFlow AI operational briefing. I will deliver all safety directives, warnings, and implementation steps with utmost clarity.'
  },
  clear_educator: {
    name: 'Clear Educator',
    gender: 'neutral',
    pitch: 1.0,
    speed: 0.92,
    geminiVoice: 'Fenrir',
    description: 'Patient, articulate instructional cadence designed for beginners and learners.',
    previewText: 'Hello! I am your Clear Educator voice. I will break down every directive into simple, easy-to-understand steps for your audience.'
  },
  dynamic_walkthrough: {
    name: 'Dynamic Coach',
    gender: 'male',
    pitch: 1.16,
    speed: 1.15,
    geminiVoice: 'Puck',
    description: 'Energetic, upbeat tempo ideal for software tutorials and fast walkthroughs.',
    previewText: 'Let’s jump right in! I will guide you through each workflow stage smoothly and efficiently.'
  },
  calm_guidance: {
    name: 'Calm Mentor',
    gender: 'female',
    pitch: 0.92,
    speed: 0.88,
    geminiVoice: 'Zephyr',
    description: 'Soothing, gentle reassurance suited for medical, healthcare, and onboarding.',
    previewText: 'Take your time. I will walk you through this process calmly and comfortably, ensuring you understand every phase.'
  }
};

class AudioNarratorService {
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private currentAudioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private destinationNode: MediaStreamAudioDestinationNode | null = null;
  private oscillatorNode: OscillatorNode | null = null;
  private isSpeakingState = false;
  private listeners: ((isSpeaking: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Warm up voices
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }

  // Subscribe to speech state changes for UI waveforms
  public onSpeechStateChange(fn: (isSpeaking: boolean) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private setSpeaking(val: boolean) {
    this.isSpeakingState = val;
    this.listeners.forEach((l) => l(val));
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  // Lazy initialize AudioContext on user interaction
  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  /**
   * Get an audio stream track for video recording (MediaRecorder)
   * This ensures the exported MP4 video has a REAL synchronized audio track!
   */
  public getRecordingAudioTrack(): MediaStreamTrack | null {
    const ctx = this.getAudioContext();
    if (!ctx) return null;
    if (!this.destinationNode) {
      this.destinationNode = ctx.createMediaStreamDestination();
    }
    const tracks = this.destinationNode.stream.getAudioTracks();
    return tracks.length > 0 ? tracks[0] : null;
  }

  /**
   * Synthesize an instructional voice tone / speech cue into the recording audio track
   */
  public playSceneToneToRecordingTrack(frequency = 440, durationSeconds = 1.0) {
    const ctx = this.getAudioContext();
    if (!ctx || !this.destinationNode) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);
      osc.connect(gain);
      gain.connect(this.destinationNode);
      osc.start();
      osc.stop(ctx.currentTime + durationSeconds);
    } catch (e) {
      console.warn('Could not pipe audio tone to destination:', e);
    }
  }

  // Stop any currently active speech / audio
  public stop() {
    this.setSpeaking(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAudioElement) {
      this.currentAudioElement.pause();
      this.currentAudioElement.currentTime = 0;
      this.currentAudioElement = null;
    }
    this.activeUtterance = null;
  }

  /**
   * Speaks the explanation for a given scene.
   * If voiceMode is 'explainer_english', it speaks the crystal-clear English step explanation so every listener understands!
   * If voiceMode is 'target_native', it uses the native script (or fallback if browser lacks the language).
   */
  public async speakScene(
    scene: Scene,
    custom: VoiceCustomization,
    targetLangCode: string,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    this.stop();

    if (custom.volume === 0) {
      onEnd?.();
      return;
    }

    // Determine what text to speak to ensure the audience understands
    const mode = custom.voiceMode || 'explainer_english';
    let textToSpeak = '';
    let speechLang = targetLangCode;

    if (mode === 'explainer_english') {
      textToSpeak = scene.narrationTextEnglish || `${scene.title}. ${scene.onScreenText}.`;
      speechLang = 'en-US';
    } else if (mode === 'bilingual') {
      const intro = scene.narrationTextEnglish ? `${scene.title}. ` : '';
      textToSpeak = `${intro}${scene.narrationText}`;
      speechLang = targetLangCode;
    } else {
      textToSpeak = scene.narrationText;
      speechLang = targetLangCode;
    }

    // Attempt Gemini Neural TTS first if provider is gemini and audio is cached or requested
    if (custom.provider === 'gemini') {
      const success = await this.tryGeminiTTS(textToSpeak, custom, onStart, onEnd);
      if (success) return;
    }

    // Default: High-reliability Web Speech Synthesis
    this.speakWithBrowserSynth(textToSpeak, speechLang, custom, onStart, onEnd);
  }

  /**
   * Browser Speech Synthesis with robust voice selection and anti-stall
   */
  public speakWithBrowserSynth(
    text: string,
    langCode: string,
    custom: VoiceCustomization,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onEnd?.();
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();

    const utterance = new SpeechSynthesisUtterance(text);
    this.activeUtterance = utterance;

    // Apply voice settings
    utterance.pitch = Math.max(0.5, Math.min(2.0, custom.pitch || 1.0));
    utterance.rate = Math.max(0.6, Math.min(1.8, custom.speed || 1.0));
    utterance.volume = Math.max(0.0, Math.min(1.0, custom.volume ?? 1.0));

    const voices = window.speechSynthesis.getVoices();

    // Voice selection strategy
    let chosenVoice: SpeechSynthesisVoice | undefined;

    // 1. Explicit voiceURI match
    if (custom.voiceURI) {
      chosenVoice = voices.find((v) => v.voiceURI === custom.voiceURI);
    }

    // 2. Language match
    if (!chosenVoice && voices.length > 0) {
      const langPrefix = langCode.split('-')[0].toLowerCase();
      // Try exact or prefix match
      chosenVoice = voices.find((v) => v.lang.toLowerCase() === langCode.toLowerCase());
      if (!chosenVoice) {
        chosenVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
      }
    }

    // 3. Fallback based on persona preference (gender/accent)
    if (!chosenVoice && voices.length > 0) {
      if (custom.gender === 'female') {
        chosenVoice = voices.find((v) => /female|zira|samantha|karen|victoria|moira/i.test(v.name));
      } else if (custom.gender === 'male') {
        chosenVoice = voices.find((v) => /male|david|alex|daniel|george|rishi/i.test(v.name));
      }
      if (!chosenVoice) {
        // Fallback to default or first available English voice
        chosenVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
      }
    }

    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
    } else {
      utterance.lang = langCode || 'en-US';
    }

    utterance.onstart = () => {
      this.setSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      this.setSpeaking(false);
      this.activeUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error or interrupted:', e.error);
      this.setSpeaking(false);
      this.activeUtterance = null;
      onEnd?.();
    };

    // Chrome anti-stall heartbeat: long utterances can freeze after ~15s
    const heartbeat = setInterval(() => {
      if (!this.activeUtterance) {
        clearInterval(heartbeat);
      } else {
        window.speechSynthesis.resume();
      }
    }, 4000);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech speak call failed:', err);
      this.setSpeaking(false);
      onEnd?.();
    }
  }

  /**
   * Try Gemini 3.8 Flash Lite TTS endpoint
   */
  private async tryGeminiTTS(
    text: string,
    custom: VoiceCustomization,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<boolean> {
    try {
      const personaProfile = VOICE_PERSONA_PROFILES[custom.persona] || VOICE_PERSONA_PROFILES.studio_warmth;
      const voiceName = custom.geminiVoice || personaProfile.geminiVoice || 'Kore';

      const response = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.slice(0, 400),
          voiceName
        })
      });

      if (!response.ok) return false;
      const data = await response.json();

      if (data.success && data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audio.playbackRate = custom.speed || 1.0;
        audio.volume = custom.volume ?? 1.0;

        this.currentAudioElement = audio;

        audio.onplay = () => {
          this.setSpeaking(true);
          onStart?.();
        };

        audio.onended = () => {
          this.setSpeaking(false);
          this.currentAudioElement = null;
          onEnd?.();
        };

        audio.onerror = () => {
          this.setSpeaking(false);
          this.currentAudioElement = null;
          onEnd?.();
        };

        await audio.play();
        return true;
      }
      return false;
    } catch (err) {
      console.warn('Gemini TTS failed, falling back to browser speech:', err);
      return false;
    }
  }

  /**
   * Preview a voice immediately for user feedback
   */
  public previewVoice(custom: VoiceCustomization, targetLangCode: string) {
    this.stop();
    const persona = VOICE_PERSONA_PROFILES[custom.persona] || VOICE_PERSONA_PROFILES.studio_warmth;
    const langInfo = getLanguageByCode(targetLangCode);

    let phrase = persona.previewText;
    if (custom.voiceMode === 'target_native' && langInfo?.sampleGreeting) {
      phrase = `${langInfo.sampleGreeting} — ${persona.previewText}`;
    }

    this.speakWithBrowserSynth(phrase, custom.voiceMode === 'target_native' ? targetLangCode : 'en-US', custom);
  }
}

export const audioNarrator = new AudioNarratorService();
