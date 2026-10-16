import type { LanguageInfo } from '../types/index.ts';

export const LANGUAGE_REGISTRY: LanguageInfo[] = [
  // --- Indian Languages (All 22 Eighth Schedule + Native Script) ---
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'te-IN-female', name: 'Divya (Telugu Natural)', gender: 'female', accent: 'Telangana & Andhra', provider: 'browser', recommended: true },
      { id: 'te-IN-male', name: 'Karthik (Telugu Clear)', gender: 'male', accent: 'Telangana & Andhra', provider: 'browser' },
      { id: 'gemini-kore', name: 'Gemini Kore (Multilingual Expressive)', gender: 'female', provider: 'gemini' }
    ],
    sampleGreeting: 'నమస్కారం! ఈ మార్గదర్శినికి స్వాగతం.'
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'hi-IN-female', name: 'Swara (Hindi Studio)', gender: 'female', accent: 'Delhi/Standard', provider: 'browser', recommended: true },
      { id: 'hi-IN-male', name: 'Madhur (Hindi Clear)', gender: 'male', accent: 'Standard', provider: 'browser' },
      { id: 'gemini-puck', name: 'Gemini Puck (Hindi Capable)', gender: 'male', provider: 'gemini' }
    ],
    sampleGreeting: 'नमस्ते! इस वीडियो गाइड में आपका स्वागत है।'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'ta-IN-female', name: 'Ananya (Tamil Fluent)', gender: 'female', accent: 'Chennai/Tamil Nadu', provider: 'browser', recommended: true },
      { id: 'ta-IN-male', name: 'Valluvar (Tamil Deep)', gender: 'male', accent: 'Tamil Nadu', provider: 'browser' },
      { id: 'gemini-kore', name: 'Gemini Kore (Tamil Articulate)', gender: 'female', provider: 'gemini' }
    ],
    sampleGreeting: 'வணக்கம்! இந்த வழிகாட்டி வீடியோவுக்கு வரவேற்கிறோம்.'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'kn-IN-female', name: 'Gowri (Kannada Melodic)', gender: 'female', accent: 'Bengaluru/Karnataka', provider: 'browser', recommended: true },
      { id: 'kn-IN-male', name: 'Chetan (Kannada Crisp)', gender: 'male', accent: 'Karnataka', provider: 'browser' }
    ],
    sampleGreeting: 'ನಮಸ್ಕಾರ! ಈ ಮಾರ್ಗದರ್ಶಿ ವೀಡಿಯೊಗೆ ಸ್ವಾಗತ.'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'ml-IN-female', name: 'Sobha (Malayalam Natural)', gender: 'female', accent: 'Kerala', provider: 'browser', recommended: true },
      { id: 'ml-IN-male', name: 'Midhun (Malayalam Clear)', gender: 'male', accent: 'Kerala', provider: 'browser' }
    ],
    sampleGreeting: 'നമസ്കാരം! ഈ ഗൈഡ് വീഡിയോയിലേക്ക് സ്വാഗതം.'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'bn-IN-female', name: 'Tanisha (Bengali Fluent)', gender: 'female', accent: 'Kolkata/West Bengal', provider: 'browser', recommended: true },
      { id: 'bn-IN-male', name: 'Bashir (Bengali Studio)', gender: 'male', accent: 'Kolkata', provider: 'browser' }
    ],
    sampleGreeting: 'নমস্কার! এই গাইড ভিডিওতে আপনাকে স্বাগতম।'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'mr-IN-female', name: 'Aarohi (Marathi Expressive)', gender: 'female', accent: 'Maharashtra', provider: 'browser', recommended: true },
      { id: 'mr-IN-male', name: 'Manohar (Marathi Clear)', gender: 'male', accent: 'Maharashtra', provider: 'browser' }
    ],
    sampleGreeting: 'नमस्कार! या मार्गदर्शन व्हिडिओमध्ये आपले स्वागत आहे.'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'gu-IN-female', name: 'Dhwani (Gujarati Vibrant)', gender: 'female', accent: 'Gujarat', provider: 'browser', recommended: true },
      { id: 'gu-IN-male', name: 'Nirav (Gujarati Clear)', gender: 'male', accent: 'Gujarat', provider: 'browser' }
    ],
    sampleGreeting: 'નમસ્તે! આ માર્ગદર્શિકા વિડિઓમાં તમારું સ્વાગત છે.'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'pa-IN-female', name: 'Ojaswini (Punjabi Warm)', gender: 'female', accent: 'Punjab', provider: 'browser', recommended: true },
      { id: 'pa-IN-male', name: 'Gurpreet (Punjabi Resonant)', gender: 'male', accent: 'Punjab', provider: 'browser' }
    ],
    sampleGreeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਇਸ ਗਾਈਡ ਵੀਡੀਓ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ।'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'or-IN-female', name: 'Subhashree (Odia Melodic)', gender: 'female', accent: 'Odisha', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'ନମସ୍କାର! ଏହି ମାର୍ଗଦର୍ଶିକା ଭିଡିଓକୁ ସ୍ୱାଗତ।'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'as-IN-female', name: 'Priyam (Assamese Clear)', gender: 'female', accent: 'Assam', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'নমস্কাৰ! এই নিৰ্দেশনা ভিডিঅ’লৈ স্বাগতম।'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic (Nastaliq)',
    region: 'indian',
    rtl: true,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'ur-IN-female', name: 'Gul (Urdu Elegant)', gender: 'female', accent: 'Indian Urdu', provider: 'browser', recommended: true },
      { id: 'ur-PK-male', name: 'Asad (Urdu Deep)', gender: 'male', accent: 'Subcontinental', provider: 'browser' }
    ],
    sampleGreeting: 'خوش آمدید! اس رہنمائی ویڈیو میں آپ کا استقبال ہے۔'
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: false, subtitles: true },
    voices: [
      { id: 'sa-fallback', name: 'Subtitled Guidance (Devanagari script)', gender: 'neutral', provider: 'none', recommended: true }
    ],
    sampleGreeting: 'सर्वेभ्यो नमो नमः। अस्मिन् मार्गदर्शकचलच्चित्रे स्वागतम्।'
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: false, subtitles: true },
    voices: [
      { id: 'mai-fallback', name: 'Subtitled Guidance (Devanagari script)', gender: 'neutral', provider: 'none', recommended: true }
    ],
    sampleGreeting: 'प्रणाम! अहि मार्गदर्शन वीडियो मे अहाँक स्वागत अछि।'
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: false, subtitles: true },
    voices: [
      { id: 'kok-fallback', name: 'Subtitled Guidance (Devanagari script)', gender: 'neutral', provider: 'none', recommended: true }
    ],
    sampleGreeting: 'नमस्कार! ह्या मार्गदर्शक व्हिडिओत तुमकां येवकार.'
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'کٲشُر / कॉशुर',
    script: 'Perso-Arabic / Devanagari',
    region: 'indian',
    rtl: true,
    capabilities: { translation: true, speech: false, subtitles: true },
    voices: [
      { id: 'ks-fallback', name: 'Subtitled Guidance (Kashmiri script)', gender: 'neutral', provider: 'none', recommended: true }
    ],
    sampleGreeting: 'سلام! اَتھ رہنمائی ویڈیوس منٛز خوش آمدید۔'
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: false, subtitles: true },
    voices: [
      { id: 'doi-fallback', name: 'Subtitled Guidance (Devanagari script)', gender: 'neutral', provider: 'none', recommended: true }
    ],
    sampleGreeting: 'नमस्ते! इस मार्गदर्शन वीडियो च तुंदा स्वागत ऐ।'
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    script: 'Devanagari',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: false, subtitles: true },
    voices: [
      { id: 'brx-fallback', name: 'Subtitled Guidance (Devanagari script)', gender: 'neutral', provider: 'none', recommended: true }
    ],
    sampleGreeting: 'खुलुमबाय! बे दिन्थिथि भिडिअआव नोंथांखौ बरायबाय।'
  },
  {
    code: 'mni',
    name: 'Manipuri (Meitei)',
    nativeName: 'মেইতেই / ꯃꯩꯇꯩꯂꯣꯟ',
    script: 'Bengali / Meitei Mayek',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: false, subtitles: true },
    voices: [
      { id: 'mni-fallback', name: 'Subtitled Guidance (Manipuri script)', gender: 'neutral', provider: 'none', recommended: true }
    ],
    sampleGreeting: 'ꯈꯨꯔꯨꯝꯖꯔꯤ! ꯃꯁꯤꯒꯤ ꯂꯃꯖꯤꯡ ꯚꯤꯗꯤꯑꯣ ꯑꯁꯤꯗ ꯇꯔꯥꯝꯅ ꯑꯣꯛꯆꯔꯤ।'
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'ne-NP-female', name: 'Sita (Nepali Natural)', gender: 'female', accent: 'Himalayan', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'नमस्ते! यो मार्गदर्शन भिडियोमा यहाँलाई स्वागत छ।'
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'संताली / ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki / Devanagari',
    region: 'indian',
    rtl: false,
    capabilities: { translation: true, speech: false, subtitles: true },
    voices: [
      { id: 'sat-fallback', name: 'Subtitled Guidance (Ol Chiki script)', gender: 'neutral', provider: 'none', recommended: true }
    ],
    sampleGreeting: 'ᱡᱚᱦᱟᱨ! ᱱᱚᱣᱟ ᱫᱤᱥᱟᱹ ᱩᱫᱩᱜ ᱵᱷᱤᱰᱤᱭᱳ ᱨᱮ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ᱾'
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'سنڌي',
    script: 'Arabic (Sindhi)',
    region: 'indian',
    rtl: true,
    capabilities: { translation: true, speech: false, subtitles: true },
    voices: [
      { id: 'sd-fallback', name: 'Subtitled Guidance (Sindhi script)', gender: 'neutral', provider: 'none', recommended: true }
    ],
    sampleGreeting: 'ڀلي ڪري آيا! هن رهنمائي وڊيو ۾ توهان جي آجيان آهي.'
  },

  // --- International English Variants ---
  {
    code: 'en-US',
    name: 'English — United States',
    nativeName: 'English (US)',
    script: 'Latin',
    region: 'english',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'gemini-kore', name: 'Kore (Studio Warmth)', gender: 'female', accent: 'American Standard', provider: 'gemini', recommended: true },
      { id: 'gemini-puck', name: 'Puck (Engaging Narrator)', gender: 'male', accent: 'American Standard', provider: 'gemini' },
      { id: 'gemini-zephyr', name: 'Zephyr (Crisp Educational)', gender: 'female', accent: 'American West Coast', provider: 'gemini' },
      { id: 'browser-us-female', name: 'Samantha (System Natural)', gender: 'female', accent: 'American', provider: 'browser' }
    ],
    sampleGreeting: 'Welcome! Here is your step-by-step guidance.'
  },
  {
    code: 'en-GB',
    name: 'English — United Kingdom',
    nativeName: 'English (UK)',
    script: 'Latin',
    region: 'english',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'en-gb-female', name: 'Victoria (Received Pronunciation)', gender: 'female', accent: 'British Standard', provider: 'browser', recommended: true },
      { id: 'en-gb-male', name: 'Oliver (Articulate British)', gender: 'male', accent: 'British Standard', provider: 'browser' },
      { id: 'gemini-fenrir', name: 'Fenrir (Deep British Tone)', gender: 'male', accent: 'British', provider: 'gemini' }
    ],
    sampleGreeting: 'Welcome! Here is your clear walkthrough guide.'
  },
  {
    code: 'en-IN',
    name: 'English — India',
    nativeName: 'English (India)',
    script: 'Latin',
    region: 'english',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'en-in-female', name: 'Neerja (Indian English Pro)', gender: 'female', accent: 'Indian Standard', provider: 'browser', recommended: true },
      { id: 'en-in-male', name: 'Prabhat (Indian English Clear)', gender: 'male', accent: 'Indian Standard', provider: 'browser' }
    ],
    sampleGreeting: 'Hello and welcome to your step-by-step walkthrough.'
  },
  {
    code: 'en-AU',
    name: 'English — Australia',
    nativeName: 'English (Australia)',
    script: 'Latin',
    region: 'english',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'en-au-female', name: 'Natasha (Australian Friendly)', gender: 'female', accent: 'Australian', provider: 'browser', recommended: true }
    ],
    sampleGreeting: "G'day and welcome to your guidance video."
  },
  {
    code: 'en-CA',
    name: 'English — Canada',
    nativeName: 'English (Canada)',
    script: 'Latin',
    region: 'english',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'en-ca-female', name: 'Clara (Canadian Clear)', gender: 'female', accent: 'Canadian', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Welcome to your concise tutorial guide.'
  },
  {
    code: 'en-IE',
    name: 'English — Ireland',
    nativeName: 'English (Ireland)',
    script: 'Latin',
    region: 'english',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'en-ie-female', name: 'Orla (Irish Warmth)', gender: 'female', accent: 'Dublin', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Welcome! Here is your step-by-step guide.'
  },
  {
    code: 'en-NZ',
    name: 'English — New Zealand',
    nativeName: 'English (New Zealand)',
    script: 'Latin',
    region: 'english',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'en-nz-female', name: 'Aroha (Kiwi Natural)', gender: 'female', accent: 'New Zealand', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Kia ora and welcome to your guide.'
  },

  // --- Major European Languages ---
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    script: 'Latin',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'fr-fr-female', name: 'Amélie (Parisian Studio)', gender: 'female', accent: 'France', provider: 'browser', recommended: true },
      { id: 'fr-fr-male', name: 'Henri (French Clear)', gender: 'male', accent: 'France', provider: 'browser' },
      { id: 'gemini-kore', name: 'Gemini Kore (French Expressive)', gender: 'female', provider: 'gemini' }
    ],
    sampleGreeting: 'Bienvenue! Voici votre guide étape par étape.'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    script: 'Latin',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'de-de-female', name: 'Marlene (German Precision)', gender: 'female', accent: 'Germany', provider: 'browser', recommended: true },
      { id: 'de-de-male', name: 'Hans (German Studio)', gender: 'male', accent: 'Germany', provider: 'browser' }
    ],
    sampleGreeting: 'Willkommen! Hier ist Ihre Schritt-für-Schritt-Anleitung.'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    script: 'Latin',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'es-es-female', name: 'Lucia (Castilian Spanish)', gender: 'female', accent: 'Spain', provider: 'browser', recommended: true },
      { id: 'es-mx-female', name: 'Sofia (Latin American Spanish)', gender: 'female', accent: 'Mexico', provider: 'browser' },
      { id: 'gemini-kore', name: 'Gemini Kore (Spanish Expressive)', gender: 'female', provider: 'gemini' }
    ],
    sampleGreeting: '¡Bienvenido! Aquí tienes tu guía paso a paso.'
  },
  {
    code: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    script: 'Latin',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'it-it-female', name: 'Elsa (Italian Studio)', gender: 'female', accent: 'Italy', provider: 'browser', recommended: true },
      { id: 'it-it-male', name: 'Cosimo (Italian Expressive)', gender: 'male', accent: 'Italy', provider: 'browser' }
    ],
    sampleGreeting: 'Benvenuto! Ecco la tua guida passo dopo passo.'
  },
  {
    code: 'pt',
    name: 'Portuguese',
    nativeName: 'Português',
    script: 'Latin',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'pt-br-female', name: 'Francisca (Brazilian Studio)', gender: 'female', accent: 'Brazil', provider: 'browser', recommended: true },
      { id: 'pt-pt-female', name: 'Raquel (European Portuguese)', gender: 'female', accent: 'Portugal', provider: 'browser' }
    ],
    sampleGreeting: 'Bem-vindo! Aqui está o seu guia passo a passo.'
  },
  {
    code: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    script: 'Latin',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'nl-nl-female', name: 'Colette (Dutch Fluent)', gender: 'female', accent: 'Netherlands', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Welkom! Hier is uw stapsgewijze handleiding.'
  },
  {
    code: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    script: 'Latin',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'pl-pl-female', name: 'Maja (Polish Studio)', gender: 'female', accent: 'Poland', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Witaj! Oto Twój przewodnik krok po kroku.'
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    script: 'Cyrillic',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'ru-ru-female', name: 'Tatyana (Russian Clear)', gender: 'female', accent: 'Russian', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Добро пожаловать! Вот ваше пошаговое руководство.'
  },
  {
    code: 'el',
    name: 'Greek',
    nativeName: 'Ελληνικά',
    script: 'Greek',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'el-gr-female', name: 'Athina (Greek Natural)', gender: 'female', accent: 'Greece', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Καλώς ήρθατε! Εδώ είναι ο βήμα προς βήμα οδηγός σας.'
  },
  {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    script: 'Latin',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'sv-se-female', name: 'Astrid (Swedish Studio)', gender: 'female', accent: 'Sweden', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Välkommen! Här är din steg-för-steg-guide.'
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    script: 'Cyrillic',
    region: 'european',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'uk-ua-female', name: 'Polina (Ukrainian Studio)', gender: 'female', accent: 'Ukraine', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Ласкаво просимо! Ось ваш покроковий посібник.'
  },

  // --- Middle East & Asian & World Languages ---
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    script: 'Arabic',
    region: 'asian_middle_east',
    rtl: true,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'ar-xa-female', name: 'Laila (Modern Standard Arabic)', gender: 'female', accent: 'Pan-Arab / MSA', provider: 'browser', recommended: true },
      { id: 'ar-xa-male', name: 'Tariq (Arabic Clear)', gender: 'male', accent: 'Pan-Arab', provider: 'browser' },
      { id: 'gemini-kore', name: 'Gemini Kore (Arabic Voice)', gender: 'female', provider: 'gemini' }
    ],
    sampleGreeting: 'أهلاً وسهلاً! إليك دليلك الإرشادي خطوة بخطوة.'
  },
  {
    code: 'he',
    name: 'Hebrew',
    nativeName: 'עברית',
    script: 'Hebrew',
    region: 'asian_middle_east',
    rtl: true,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'he-il-female', name: 'Hila (Hebrew Fluent)', gender: 'female', accent: 'Israel', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'ברוכים הבאים! הנה המדריך שלכם שלב אחר שלב.'
  },
  {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    script: 'Perso-Arabic',
    region: 'asian_middle_east',
    rtl: true,
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'fa-ir-female', name: 'Shirin (Persian Studio)', gender: 'female', accent: 'Iran', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'خوش آمدید! این راهنمای گام به گام شماست.'
  },
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    script: 'Simplified Han',
    region: 'asian_middle_east',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'zh-cn-female', name: 'Xiaoxiao (Mandarin Studio)', gender: 'female', accent: 'Standard Mandarin', provider: 'browser', recommended: true },
      { id: 'zh-cn-male', name: 'Yunxi (Mandarin Clear)', gender: 'male', accent: 'Standard Mandarin', provider: 'browser' }
    ],
    sampleGreeting: '欢迎！这是您的分步操作视频指南。'
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    script: 'Japanese (Kanji/Kana)',
    region: 'asian_middle_east',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'ja-jp-female', name: 'Nanami (Japanese Studio)', gender: 'female', accent: 'Tokyo Standard', provider: 'browser', recommended: true },
      { id: 'ja-jp-male', name: 'Keita (Japanese Articulate)', gender: 'male', accent: 'Tokyo', provider: 'browser' }
    ],
    sampleGreeting: 'ようこそ！わかりやすいステップバイステップガイドです。'
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    script: 'Hangul',
    region: 'asian_middle_east',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'ko-kr-female', name: 'SunHi (Korean Warm)', gender: 'female', accent: 'Seoul Standard', provider: 'browser', recommended: true }
    ],
    sampleGreeting: '환영합니다! 단계별 가이드 비디오입니다.'
  },
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    script: 'Latin',
    region: 'asian_middle_east',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'id-id-female', name: 'Gadis (Indonesian Clear)', gender: 'female', accent: 'Jakarta', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Selamat datang! Ini adalah panduan langkah demi langkah Anda.'
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    script: 'Latin (Quoc Ngu)',
    region: 'asian_middle_east',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'vi-vn-female', name: 'HoaiMy (Vietnamese Natural)', gender: 'female', accent: 'Hanoi', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Chào mừng! Đây là video hướng dẫn từng bước của bạn.'
  },
  {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    script: 'Latin',
    region: 'asian_middle_east',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'tr-tr-female', name: 'Emel (Turkish Studio)', gender: 'female', accent: 'Istanbul', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Hoş geldiniz! İşte adım adım video rehberiniz.'
  },
  {
    code: 'sw',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    script: 'Latin',
    region: 'others',
    capabilities: { translation: true, speech: true, subtitles: true },
    voices: [
      { id: 'sw-ke-female', name: 'Zuri (Swahili Clear)', gender: 'female', accent: 'East Africa', provider: 'browser', recommended: true }
    ],
    sampleGreeting: 'Karibu! Huu hapa mwongozo wako wa hatua kwa hatua.'
  }
];

export function getLanguageByCode(code: string): LanguageInfo | undefined {
  if (!code) return undefined;
  const normalized = code.toLowerCase().trim();
  return (
    LANGUAGE_REGISTRY.find((l) => l.code.toLowerCase() === normalized) ||
    LANGUAGE_REGISTRY.find((l) => l.code.toLowerCase().split('-')[0] === normalized.split('-')[0])
  );
}

export function filterLanguages(
  query: string,
  region: string = 'all'
): LanguageInfo[] {
  let list = LANGUAGE_REGISTRY;
  if (region !== 'all') {
    list = list.filter((l) => l.region === region);
  }
  if (!query || query.trim() === '') {
    return list;
  }
  const q = query.toLowerCase().trim();
  return list.filter(
    (l) =>
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      l.script.toLowerCase().includes(q)
  );
}
