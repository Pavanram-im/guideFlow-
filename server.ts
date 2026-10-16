import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { analyzeRawText } from './src/utils/documentParser.ts';
import { getLanguageByCode } from './src/data/languageRegistry.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '15mb' }));

// Server-side Gemini initialization with required telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// 1. Document Extraction & Analysis Endpoint
app.post('/api/documents/extract', async (req: Request, res: Response) => {
  try {
    const { text, title, fileName } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required for extraction.' });
    }

    const baseline = analyzeRawText(text, title || fileName);

    if (!ai) {
      // Fallback analysis if Gemini is not yet keyed
      return res.json({
        success: true,
        document: baseline,
        provider: 'local_heuristic'
      });
    }

    const prompt = `Analyze this document to generate an educational/technical guidance video.
Document Title: ${baseline.title}
Content:
"""
${text.slice(0, 8000)}
"""

Extract structured JSON strictly with this schema:
{
  "title": "string (clear concise title)",
  "detectedLanguage": "string (language name, e.g. English, Telugu, Hindi, Spanish)",
  "detectedLanguageCode": "string (ISO 639-1 code like en, te, hi, es, ta)",
  "topic": "string (primary subject)",
  "keyPoints": ["3-5 clear bullet points"],
  "warnings": ["any critical safety, security, or error warnings mentioned"],
  "prerequisites": ["prerequisites or tools needed before starting"],
  "suggestedStepCount": 4
}
Do not hallucinate facts not present in the document. Respond only with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');

    return res.json({
      success: true,
      document: {
        id: baseline.id,
        title: parsed.title || baseline.title,
        rawText: text,
        detectedLanguage: parsed.detectedLanguage || baseline.detectedLanguage,
        detectedLanguageCode: parsed.detectedLanguageCode || 'en',
        wordCount: baseline.wordCount,
        topic: parsed.topic || baseline.topic,
        keyPoints: parsed.keyPoints?.length ? parsed.keyPoints : baseline.keyPoints,
        warnings: parsed.warnings?.length ? parsed.warnings : baseline.warnings,
        prerequisites: parsed.prerequisites?.length ? parsed.prerequisites : baseline.prerequisites,
        suggestedSteps: parsed.suggestedStepCount || baseline.suggestedSteps
      },
      provider: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Error in /api/documents/extract:', error);
    // Graceful fallback to heuristic analysis
    const baseline = analyzeRawText(req.body.text || '', req.body.title);
    return res.json({
      success: true,
      document: baseline,
      provider: 'local_fallback',
      warning: error?.message || 'Gemini API call timed out or failed; used local heuristic'
    });
  }
});

// 2. Multilingual Script & Storyboard Generation Endpoint
app.post('/api/projects/generate-script', async (req: Request, res: Response) => {
  try {
    const { document, config } = req.body;
    if (!document || !document.rawText) {
      return res.status(400).json({ error: 'Document data is required.' });
    }

    const targetLang = getLanguageByCode(config?.targetLanguage || 'te');
    const targetLangName = targetLang ? `${targetLang.name} (${targetLang.nativeName})` : config?.targetLanguage || 'Telugu';
    const targetScript = targetLang?.script || 'Native';

    if (!ai) {
      // Local structured scene generator if no API key
      const fallbackScenes = generateLocalScenes(document, config, targetLang);
      return res.json({
        success: true,
        scenes: fallbackScenes,
        targetLanguage: targetLangName,
        provider: 'local_template'
      });
    }

    const prompt = `You are GuideFlow AI, an expert instructional designer, translator, and video producer.
Transform the following source document into a scene-by-scene guidance video script.

IMPORTANT REQUIREMENTS:
1. Target Language: ${targetLangName}
   - The "narrationText" and "onScreenText" MUST be written fluently in the target language using its proper native writing script (${targetScript})!
   - For example, if target language is Telugu, write authentic Telugu (తెలుగు) script.
   - If target language is Hindi, write authentic Devanagari (हिन्दी).
   - If target language is Tamil, write authentic Tamil (தமிழ்).
2. Audience Level: ${config?.audience || 'beginner'}
3. Guidance Style: ${config?.guidanceStyle || 'step_by_step'}
4. Fidelity Mode: ${config?.fidelityMode || 'simple_language'}
5. PRESERVE all critical instructions, numbers, metrics, software commands, dates, and warnings exactly without hallucinating.
6. Generate 4 to 6 scenes. Each scene duration should be between 5 and 10 seconds.
7. Return strictly a JSON array of scene objects matching this structure:
[
  {
    "sceneNumber": 1,
    "title": "Short title in English or bilingual",
    "narrationText": "Full spoken narration sentence in ${targetLangName} (fluent, clear, matching the selected tone)",
    "narrationTextEnglish": "Crystal-clear English spoken explanation of this step for universal audience/listeners",
    "onScreenText": "Key 1-line caption or bullet to show on screen in ${targetLangName}",
    "visualDescription": "Instructions for visual diagram or icon (e.g. 'Safety alert banner with stop badge')",
    "durationSeconds": 6,
    "keyHighlight": "Core takeaway in 3-5 words",
    "stepNumber": 1,
    "isWarning": false
  }
]

SOURCE DOCUMENT:
Title: ${document.title}
Key Points: ${JSON.stringify(document.keyPoints || [])}
Warnings: ${JSON.stringify(document.warnings || [])}
Raw Text:
"""
${document.rawText.slice(0, 6000)}
"""
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const scenes = JSON.parse(response.text || '[]');
    const formattedScenes = scenes.map((s: any, idx: number) => ({
      id: `scene-${idx + 1}-${Date.now()}`,
      sceneNumber: idx + 1,
      title: s.title || `Scene ${idx + 1}`,
      narrationText: s.narrationText || '',
      narrationTextEnglish: s.narrationTextEnglish || s.title || '',
      onScreenText: s.onScreenText || s.title || '',
      visualDescription: s.visualDescription || 'Visual guidance frame',
      durationSeconds: Number(s.durationSeconds) || 6,
      keyHighlight: s.keyHighlight || '',
      stepNumber: s.stepNumber || idx + 1,
      isWarning: Boolean(s.isWarning)
    }));

    return res.json({
      success: true,
      scenes: formattedScenes,
      targetLanguage: targetLangName,
      provider: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Error in /api/projects/generate-script:', error);
    const targetLang = getLanguageByCode(req.body.config?.targetLanguage || 'te');
    const fallback = generateLocalScenes(req.body.document, req.body.config, targetLang);
    return res.json({
      success: true,
      scenes: fallback,
      targetLanguage: targetLang?.name || 'Telugu',
      provider: 'local_fallback',
      warning: error?.message || 'Using localized baseline scenes'
    });
  }
});

// Helper for realistic fallback scenes when offline or API key missing
function generateLocalScenes(doc: any, config: any, targetLang: any) {
  const isTelugu = targetLang?.code === 'te';
  const isHindi = targetLang?.code === 'hi';
  const isTamil = targetLang?.code === 'ta';

  const titlePrefix = isTelugu ? 'మార్గదర్శిని' : isHindi ? 'मार्गदर्शिका' : isTamil ? 'வழிகாட்டி' : 'Guide';

  return [
    {
      id: `scene-1-${Date.now()}`,
      sceneNumber: 1,
      title: 'Introduction & Scope',
      narrationText: isTelugu
        ? `నమస్కారం! ఈ మార్గదర్శక వీడియోలో మనం ${doc?.title || 'ఈ అంశం'} గురించి సమగ్రంగా తెలుసుకుందాం.`
        : isHindi
        ? `नमस्ते! इस मार्गदर्शन वीडियो में हम ${doc?.title || 'इस विषय'} के बारे में विस्तार से समझेंगे।`
        : isTamil
        ? `வணக்கம்! இந்த வழிகாட்டி வீடியோவில் ${doc?.title || 'இந்த தலைப்பை'} பற்றி விரிவாகக் காண்போம்.`
        : `Welcome to this guidance guide on ${doc?.title || 'the selected topic'}. Here are the essential instructions.`,
      narrationTextEnglish: `Welcome to this guidance guide on ${doc?.title || 'the selected topic'}. Here are the essential instructions.`,
      onScreenText: isTelugu ? `ప్రారంభం: ${doc?.title || 'ముఖ్య సూచనలు'}` : isHindi ? `प्रारंभ: ${doc?.title || 'मुख्य निर्देश'}` : `Introduction: ${doc?.title || 'Core Overview'}`,
      visualDescription: 'Opening title card with topic badge and high-contrast typography',
      durationSeconds: 6,
      keyHighlight: doc?.topic || 'Overview',
      stepNumber: 1,
      isWarning: false
    },
    {
      id: `scene-2-${Date.now()}`,
      sceneNumber: 2,
      title: 'Key Prerequisites & Setup',
      narrationText: isTelugu
        ? `మొదటి దశ: ప్రక్రియ ప్రారంభించే ముందు అవసరమైన అనుమతులు మరియు సామగ్రిని సిద్ధం చేసుకోండి.`
        : isHindi
        ? `पहला चरण: कार्य शुरू करने से पहले आवश्यक अनुमतियां और उपकरण तैयार रखें।`
        : isTamil
        ? `படி ஒன்று: தொடங்குவதற்கு முன் தேவையான கருவிகள் மற்றும் அனுமதிகளை தயார் செய்யவும்.`
        : `Step 1: Verify all prerequisites, access credentials, and safety standards before initiating the workflow.`,
      narrationTextEnglish: `Step 1: Verify all prerequisites, access credentials, and safety standards before initiating the workflow.`,
      onScreenText: isTelugu ? 'దశ 1: ముందస్తు సన్నాహాలు' : isHindi ? 'चरण 1: पूर्व आवश्यकताएँ' : 'Step 1: Prerequisites & Verification',
      visualDescription: 'Checklist checklist icon with verification badges',
      durationSeconds: 7,
      keyHighlight: 'Preparation',
      stepNumber: 2,
      isWarning: false
    },
    {
      id: `scene-3-${Date.now()}`,
      sceneNumber: 3,
      title: 'Core Implementation Steps',
      narrationText: isTelugu
        ? `రెండవ దశ: సూచించిన నియమాలను ఖచ్చితంగా అనుసరించండి. ప్రతి దశను జాగ్రత్తగా పూర్తి చేయండి.`
        : isHindi
        ? `दूसरा चरण: दिए गए निर्देशों का क्रमबद्ध पालन करें और हर बिंदु को ध्यान से समझें।`
        : isTamil
        ? `படி இரண்டு: வழங்கப்பட்ட வழிமுறைகளை வரிசையாகப் பின்பற்றி கவனமாக முடிக்கவும்.`
        : `Step 2: Execute each directive systematically following established protocol.`,
      narrationTextEnglish: `Step 2: Execute each directive systematically following established protocol.`,
      onScreenText: isTelugu ? 'దశ 2: అమలు విధానం' : isHindi ? 'चरण 2: क्रियान्वयन' : 'Step 2: Execution & Guidelines',
      visualDescription: 'Step-by-step flowchart diagram highlighting active stage',
      durationSeconds: 8,
      keyHighlight: 'Execution',
      stepNumber: 3,
      isWarning: false
    },
    {
      id: `scene-4-${Date.now()}`,
      sceneNumber: 4,
      title: 'Critical Warnings & Safety Protocols',
      narrationText: isTelugu
        ? `ముఖ్య గమనిక: హెచ్చరిక సూచనలను ఎల్లప్పుడూ పాటించండి. ప్రమాదాలను నివారించడానికి నియమాలను ఉల్లంఘించవద్దు.`
        : isHindi
        ? `सावधानी: सभी सुरक्षा निर्देशों का कड़ाई से पालन करें और किसी भी चेतावनी को अनदेखा न करें।`
        : isTamil
        ? `எச்சரிக்கை: பாதுகாப்பு விதிகளை கண்டிப்பாகப் பின்பற்றவும். விதிகளை புறக்கணிக்க வேண்டாம்.`
        : `Critical Alert: Always adhere to the safety precautions and monitor system alerts continuously.`,
      narrationTextEnglish: `Critical Alert: Always adhere to the safety precautions and monitor system alerts continuously.`,
      onScreenText: isTelugu ? 'హెచ్చరిక: భద్రతా సూచనలు' : isHindi ? 'चेतावनी: सुरक्षा निर्देश' : 'Safety Warning: Adhere to Protocols',
      visualDescription: 'Amber/Red warning container with critical callout badge',
      durationSeconds: 7,
      keyHighlight: 'Security & Safety',
      stepNumber: 4,
      isWarning: true
    },
    {
      id: `scene-5-${Date.now()}`,
      sceneNumber: 5,
      title: 'Verification & Completion',
      narrationText: isTelugu
        ? `ముగింపు: అన్ని దశలు పూర్తయిన తర్వాత ఫలితాలను ధృవీకరించుకోండి. మీ గైడ్ సిద్ధంగా ఉంది!`
        : isHindi
        ? `समापन: सभी चरण पूरे होने के बाद परिणामों की पुष्टि करें। आपका मार्गदर्शन पूर्ण हुआ!`
        : isTamil
        ? `முடிவு: அனைத்து படிகளும் முடிந்ததும் சரிபார்க்கவும். வழிகாட்டி நிறைவடைந்தது!`
        : `Conclusion: Review your checklist and verify complete alignment with the protocol.`,
      narrationTextEnglish: `Conclusion: Review your checklist and verify complete alignment with the protocol.`,
      onScreenText: isTelugu ? 'ముగింపు: విజయవంతమైన ధృవీకరణ' : isHindi ? 'सफल समापन' : 'Workflow Complete',
      visualDescription: 'Success summary banner with completion confirmation check',
      durationSeconds: 6,
      keyHighlight: 'Verified Complete',
      stepNumber: 5,
      isWarning: false
    }
  ];
}

// 3. Text-to-Speech Endpoint using Gemini 3.8 Flash Lite TTS or client fallback
app.post('/api/tts/generate', async (req: Request, res: Response) => {
  try {
    const { text, voiceName = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    if (!ai) {
      return res.json({
        success: false,
        useBrowserSpeech: true,
        message: 'No Gemini API key available on server; using client SpeechSynthesis engine.'
      });
    }

    // Call Gemini 3.8 Flash-Lite TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500),
              speechMetadata: {
                style: 'Clear, articulate instructional narrator'
              }
            }
          ]
        }
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || 'Kore' }
          }
        }
      }
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        success: true,
        audioBase64: base64Audio,
        mimeType: 'audio/wav',
        provider: 'gemini-3.8-flash-lite-tts'
      });
    } else {
      return res.json({
        success: false,
        useBrowserSpeech: true,
        message: 'TTS returned without audio data; falling back to client voice.'
      });
    }
  } catch (error: any) {
    console.error('TTS error:', error);
    return res.json({
      success: false,
      useBrowserSpeech: true,
      message: error?.message || 'Server TTS not available; fallback to client speech synthesis'
    });
  }
});

// Vite middleware integration for full-stack dev server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`GuideFlow AI server running at http://localhost:${PORT}`);
  });
}

startServer();
