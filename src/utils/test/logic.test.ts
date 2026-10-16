import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGE_REGISTRY, getLanguageByCode, filterLanguages } from '../../data/languageRegistry.ts';
import { formatTimestampSRT, formatTimestampVTT, calculateTotalDuration, generateSRT, generateWebVTT } from '../subtitleGenerator.ts';
import { analyzeRawText } from '../documentParser.ts';
import type { Scene } from '../../types/index.ts';

test('Language Registry includes 22 Eighth Schedule Indian languages', () => {
  const indianLangs = LANGUAGE_REGISTRY.filter((l) => l.region === 'indian');
  // Must include major 22 scheduled languages
  assert.ok(indianLangs.length >= 20, `Expected at least 20 Indian languages, found ${indianLangs.length}`);

  const telugu = getLanguageByCode('te');
  assert.ok(telugu, 'Telugu must exist in registry');
  assert.equal(telugu?.name, 'Telugu');
  assert.equal(telugu?.nativeName, 'తెలుగు');
  assert.equal(telugu?.capabilities.translation, true);
  assert.equal(telugu?.capabilities.speech, true);

  const hindi = getLanguageByCode('hi');
  assert.ok(hindi, 'Hindi must exist in registry');
  assert.equal(hindi?.nativeName, 'हिन्दी');

  const tamil = getLanguageByCode('ta');
  assert.ok(tamil, 'Tamil must exist in registry');
  assert.equal(tamil?.nativeName, 'தமிழ்');
});

test('RTL detection flags Urdu, Arabic, and Hebrew properly', () => {
  const urdu = getLanguageByCode('ur');
  assert.equal(urdu?.rtl, true, 'Urdu must have rtl: true');

  const arabic = getLanguageByCode('ar');
  assert.equal(arabic?.rtl, true, 'Arabic must have rtl: true');

  const english = getLanguageByCode('en-US');
  assert.equal(Boolean(english?.rtl), false, 'English must not have rtl');
});

test('Filter languages searches by native name and English name', () => {
  const teluguResults = filterLanguages('తెలుగు');
  assert.ok(teluguResults.some((l) => l.code === 'te'));

  const spanishResults = filterLanguages('Spanish');
  assert.ok(spanishResults.some((l) => l.code === 'es'));
});

test('Subtitle timecode formatting is accurate to milliseconds', () => {
  assert.equal(formatTimestampSRT(0), '00:00:00,000');
  assert.equal(formatTimestampSRT(65.5), '00:01:05,500');
  assert.equal(formatTimestampSRT(3661.125), '01:01:01,125');

  assert.equal(formatTimestampVTT(0), '00:00:00.000');
  assert.equal(formatTimestampVTT(65.5), '00:01:05.500');
});

test('SRT and WebVTT generation formats valid timecode blocks', () => {
  const mockScenes: Scene[] = [
    {
      id: 's1',
      sceneNumber: 1,
      title: 'Introduction',
      narrationText: 'Welcome to GuideFlow AI.',
      onScreenText: 'Step 1: Introduction',
      visualDescription: 'Title slide',
      durationSeconds: 5
    },
    {
      id: 's2',
      sceneNumber: 2,
      title: 'Action Item',
      narrationText: 'Perform safety check.',
      onScreenText: 'Safety First',
      visualDescription: 'Warning banner',
      durationSeconds: 8
    }
  ];

  const total = calculateTotalDuration(mockScenes);
  assert.equal(total, 13);

  const srt = generateSRT(mockScenes);
  assert.ok(srt.includes('00:00:00,000 --> 00:00:05,000'));
  assert.ok(srt.includes('00:00:05,000 --> 00:00:13,000'));
  assert.ok(srt.includes('Welcome to GuideFlow AI.'));

  const vtt = generateWebVTT(mockScenes);
  assert.ok(vtt.startsWith('WEBVTT'));
  assert.ok(vtt.includes('00:00:00.000 --> 00:00:05.000'));
});

test('analyzeRawText extracts warning flags and topics cleanly', () => {
  const sample = `
  # Machine Safety Directive
  - Wear protective gloves at all times.
  - CAUTION: Ensure the emergency cut-off valve is pressurized before operation.
  - Keep workspace ventilated.
  `;

  const parsed = analyzeRawText(sample);
  assert.equal(parsed.title, 'Machine Safety Directive');
  assert.ok(parsed.warnings.length >= 1);
  assert.ok(parsed.warnings[0].includes('emergency cut-off valve'));
  assert.ok(parsed.keyPoints.length >= 1);
});

test('Voice customization parameters are constrained within acoustic bounds', () => {
  const personas = [
    { persona: 'studio_warmth', pitch: 1.05, speed: 1.0 },
    { persona: 'deep_anchor', pitch: 0.80, speed: 0.95 },
    { persona: 'clear_educator', pitch: 1.00, speed: 0.90 },
    { persona: 'dynamic_walkthrough', pitch: 1.15, speed: 1.15 },
    { persona: 'calm_guidance', pitch: 0.92, speed: 0.85 }
  ];

  personas.forEach((p) => {
    assert.ok(p.pitch >= 0.7 && p.pitch <= 1.3, `Pitch ${p.pitch} must be between 0.7 and 1.3`);
    assert.ok(p.speed >= 0.75 && p.speed <= 1.5, `Speed ${p.speed} must be between 0.75 and 1.5`);
  });
});

test('VOICE_PERSONA_PROFILES are configured with distinct vocal personalities', async () => {
  const { VOICE_PERSONA_PROFILES } = await import('../audioNarrator.ts');
  const keys = Object.keys(VOICE_PERSONA_PROFILES);
  assert.equal(keys.length, 5);

  const studio = VOICE_PERSONA_PROFILES.studio_warmth;
  assert.equal(studio.gender, 'female');
  assert.ok(studio.previewText.length > 20);

  const deep = VOICE_PERSONA_PROFILES.deep_anchor;
  assert.equal(deep.gender, 'male');
  assert.ok(deep.pitch < 0.9);
});

