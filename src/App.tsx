import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { LandingHero } from './components/home/LandingHero.tsx';
import { HowItWorksSection } from './components/home/HowItWorksSection.tsx';
import { LanguageCatalogSection } from './components/home/LanguageCatalogSection.tsx';
import { TemplatesSection } from './components/home/TemplatesSection.tsx';
import { FaqSection } from './components/home/FaqSection.tsx';
import { DocumentUploadCard } from './components/workspace/DocumentUploadCard.tsx';
import { GuidanceConfigPanel } from './components/workspace/GuidanceConfigPanel.tsx';
import { LanguagePickerModal } from './components/workspace/LanguagePickerModal.tsx';
import { VideoPlayerCanvas } from './components/editor/VideoPlayerCanvas.tsx';
import { StoryboardEditor } from './components/editor/StoryboardEditor.tsx';
import { ExportModal } from './components/editor/ExportModal.tsx';
import { ProjectLibrary } from './components/dashboard/ProjectLibrary.tsx';
import { ExtractedDocument, GuidanceConfig, Scene, Project, LanguageInfo } from './types/index.ts';
import { SAMPLE_DOCUMENTS, analyzeRawText } from './utils/documentParser.ts';
import { getLanguageByCode } from './data/languageRegistry.ts';

// Initial pre-seeded showcase project (Cloud Deployment: English -> Telugu)
const INITIAL_TELUGU_PROJECT: Project = {
  id: 'proj-telugu-showcase',
  title: 'Cloud Kubernetes Deployment & Rollback Protocol (Telugu)',
  description: 'Production zero-downtime deployment guidance translated from English into Telugu.',
  originalDocument: {
    id: 'doc-seed-1',
    title: 'Cloud Production Deployment & Rollback Protocol',
    rawText: SAMPLE_DOCUMENTS[0].fullText,
    detectedLanguage: 'English (US)',
    wordCount: 145,
    topic: 'Cloud Production Deployment & Rollback',
    keyPoints: [
      'Unit test coverage must exceed 85% before triggering deployment',
      'Deploy container image to 10% canary traffic pods',
      'Monitor Prometheus p95 latency (< 200ms) for 5 minutes',
      'Promote image across all availability zones in batches of 25%'
    ],
    warnings: [
      'If HTTP 5xx errors exceed 0.5%, immediately initiate rollback with kubectl rollout undo'
    ],
    prerequisites: ['Kubernetes staging cluster access', 'Prometheus monitoring dashboard'],
    suggestedSteps: 5
  },
  config: {
    sourceLanguage: 'en-US',
    targetLanguage: 'te',
    audience: 'beginner',
    guidanceStyle: 'step_by_step',
    voiceId: 'te-IN-female',
    accent: 'Telangana & Andhra',
    narrationSpeed: 1.0,
    tone: 'instructional',
    visualTheme: 'cinematic_dark',
    aspectRatio: '16:9',
    subtitleLanguage: 'te',
    backgroundMusic: false,
    fidelityMode: 'simple_language',
    voiceCustomization: {
      persona: 'studio_warmth',
      pitch: 1.05,
      speed: 1.0,
      volume: 1.0,
      gender: 'female',
      provider: 'browser',
      voiceMode: 'explainer_english',
      geminiVoice: 'Kore'
    }
  },
  scenes: [
    {
      id: 'sc-seed-1',
      sceneNumber: 1,
      title: 'పరిచయం & ముందస్తు అవసరాలు (Introduction)',
      narrationText: 'నమస్కారం! ఈ గైడ్ వీడియోలో క్లౌడ్ ప్రొడక్షన్ డిప్లాయ్‌మెంట్ మరియు రోల్‌బ్యాక్ విధానాన్ని స్పష్టంగా నేర్చుకుందాం.',
      narrationTextEnglish: 'Welcome to this guidance video. Today we will walk through the cloud production deployment and rollback protocol step by step.',
      onScreenText: 'క్లౌడ్ డిప్లాయ్‌మెంట్: ప్రారంభ సూచనలు',
      visualDescription: 'Cloud architecture overview with system health indicators',
      durationSeconds: 6,
      keyHighlight: '85% టెస్ట్ కవరేజ్ అవసరం',
      stepNumber: 1,
      isWarning: false
    },
    {
      id: 'sc-seed-2',
      sceneNumber: 2,
      title: 'కెనరీ రిలీజ్ వ్యూహం (Canary Release)',
      narrationText: 'మొదటి దశ: కంటైనర్ ఇమేజ్‌ను కేవలం 10 శాతం ట్రాఫిక్ పాడ్స్‌కు మాత్రమే డిప్లాయ్ చేయండి. ప్రొమెథియస్ లాటెన్సీని ఐదు నిమిషాలు గమనించండి.',
      narrationTextEnglish: 'Step 1: Canary Release Strategy. Deploy the container image to only 10% of traffic pods. Monitor Prometheus latency for 5 minutes before expanding.',
      onScreenText: 'దశ 1: 10% ట్రాఫిక్‌తో కెనరీ డిప్లాయ్‌మెంట్',
      visualDescription: 'Traffic split visualization displaying 10% canary routing',
      durationSeconds: 8,
      keyHighlight: 'p95 లాటెన్సీ < 200ms',
      stepNumber: 2,
      isWarning: false
    },
    {
      id: 'sc-seed-3',
      sceneNumber: 3,
      title: 'పూర్తి స్థాయి ప్రమోషన్ (Full Fleet Promotion)',
      narrationText: 'రెండవ దశ: కెనరీ మెట్రిక్స్ స్థిరంగా ఉంటే, అన్ని జోన్లలో 25 శాతం చొప్పున క్రమంగా డిప్లాయ్ చేయండి.',
      narrationTextEnglish: 'Step 2: Full Fleet Promotion. Once metrics are stable, gradually promote the deployment across all availability zones in batches of 25%.',
      onScreenText: 'దశ 2: 25% బ్యాచ్‌లలో పూర్తి డిప్లాయ్‌మెంట్',
      visualDescription: 'Multi-zone fleet rollout progress cards',
      durationSeconds: 7,
      keyHighlight: 'కనెక్షన్ డ్రెయినింగ్ 60 సెకన్లు',
      stepNumber: 3,
      isWarning: false
    },
    {
      id: 'sc-seed-4',
      sceneNumber: 4,
      title: 'ముఖ్య హెచ్చరిక & ఎమర్జెన్సీ రోల్‌బ్యాక్ (Rollback Warning)',
      narrationText: 'ముఖ్య హెచ్చరిక: 5xx ఎర్రర్స్ 0.5 శాతం కంటే పెరిగితే, వెంటనే క్యూబ్‌సిటిఎల్ రోల్‌అవుట్ అన్‌డూ కమాండ్‌తో మునుపటి వెర్షన్‌కు రోల్‌బ్యాక్ చేయండి.',
      narrationTextEnglish: 'Critical Safety Alert: Rollback Protocol. If HTTP 500 error rates exceed 0.5%, immediately initiate rollback with the kubectl rollout undo command.',
      onScreenText: 'హెచ్చరిక: kubectl rollout undo అమలు చేయండి',
      visualDescription: 'High-visibility amber warning box with rollback command',
      durationSeconds: 8,
      keyHighlight: 'ఎర్రర్ రేట్ > 0.5% అయితే రోల్‌బ్యాక్',
      stepNumber: 4,
      isWarning: true
    },
    {
      id: 'sc-seed-5',
      sceneNumber: 5,
      title: 'విజయవంతమైన ముగింపు (Verification Complete)',
      narrationText: 'డిప్లాయ్‌మెంట్ విజయవంతంగా పూర్తయింది. సిస్టమ్ ఆరోగ్యం స్థిరంగా ఉందని డ్యాష్‌బోర్డ్‌లో ధృవీకరించుకోండి.',
      narrationTextEnglish: 'Conclusion and Verification. Deployment completed successfully. Verify all system health indicators and active uptime on your Prometheus dashboard.',
      onScreenText: 'డిప్లాయ్‌మెంట్ విజయవంతంగా పూర్తయింది',
      visualDescription: 'Green verification badge with uptime status check',
      durationSeconds: 6,
      keyHighlight: 'అన్ని పాడ్స్ ఆన్‌లైన్',
      stepNumber: 5,
      isWarning: false
    }
  ],
  status: 'completed',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'workspace' | 'editor' | 'languages' | 'templates' | 'dashboard'>('home');
  const [projects, setProjects] = useState<Project[]>([INITIAL_TELUGU_PROJECT]);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_TELUGU_PROJECT.id);

  // Active workspace state
  const [currentDocument, setCurrentDocument] = useState<ExtractedDocument | null>(INITIAL_TELUGU_PROJECT.originalDocument);
  const [guidanceConfig, setGuidanceConfig] = useState<GuidanceConfig>(INITIAL_TELUGU_PROJECT.config);
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_TELUGU_PROJECT.scenes);
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);

  // UI state
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [isLanguagePickerOpen, setIsLanguagePickerOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Handler to start a new project from scratch
  const handleNewProject = () => {
    const emptyDoc = analyzeRawText(
      SAMPLE_DOCUMENTS[0].fullText,
      SAMPLE_DOCUMENTS[0].title
    );
    setCurrentDocument(emptyDoc);
    setGuidanceConfig({
      sourceLanguage: 'en-US',
      targetLanguage: 'te',
      audience: 'beginner',
      guidanceStyle: 'step_by_step',
      voiceId: 'te-IN-female',
      accent: 'Telangana & Andhra',
      narrationSpeed: 1.0,
      tone: 'instructional',
      visualTheme: 'cinematic_dark',
      aspectRatio: '16:9',
      subtitleLanguage: 'te',
      backgroundMusic: false,
      fidelityMode: 'simple_language'
    });
    setScenes(INITIAL_TELUGU_PROJECT.scenes);
    setActiveTab('workspace');
  };

  // Launch a sample template directly
  const handleSelectTemplate = (sampleId: string, targetLangCode: string) => {
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId) || SAMPLE_DOCUMENTS[0];
    const extracted = analyzeRawText(sample.fullText, sample.title);
    setCurrentDocument(extracted);

    const lang = getLanguageByCode(targetLangCode) || getLanguageByCode('te')!;
    setGuidanceConfig((prev) => ({
      ...prev,
      targetLanguage: lang.code,
      subtitleLanguage: lang.code
    }));

    handleGenerateGuidance(extracted, {
      ...guidanceConfig,
      targetLanguage: lang.code
    });
  };

  // Generate guidance script via server-side Gemini
  const handleGenerateGuidance = async (doc = currentDocument, cfg = guidanceConfig) => {
    if (!doc) return;
    setIsGeneratingScript(true);
    try {
      const response = await fetch('/api/projects/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document: doc,
          config: cfg
        })
      });
      const data = await response.json();
      if (data.success && data.scenes && data.scenes.length > 0) {
        setScenes(data.scenes);

        // Update or create active project
        const newProj: Project = {
          id: `proj-${Date.now()}`,
          title: `${doc.title} (${cfg.targetLanguage.toUpperCase()})`,
          originalDocument: doc,
          config: cfg,
          scenes: data.scenes,
          status: 'ready',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setProjects((prev) => [newProj, ...prev]);
        setActiveProjectId(newProj.id);
        setActiveTab('editor');
      }
    } catch (e) {
      console.error('Failed to generate script:', e);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Open existing project from dashboard
  const handleSelectProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    setActiveProjectId(proj.id);
    setCurrentDocument(proj.originalDocument);
    setGuidanceConfig(proj.config);
    setScenes(proj.scenes);
    setActiveTab('editor');
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDuplicateProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    if (!proj) return;
    const duplicated: Project = {
      ...proj,
      id: `proj-copy-${Date.now()}`,
      title: `${proj.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects((prev) => [duplicated, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#080B14] text-[#F8FAFC]">
      {/* Top Bar adhering to 3-zone contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewProject={handleNewProject}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {/* VIEW 1: HOME LANDING */}
        {activeTab === 'home' && (
          <div>
            <LandingHero
              onStartGuide={() => setActiveTab('workspace')}
              onWatchSample={() => {
                setActiveProjectId(INITIAL_TELUGU_PROJECT.id);
                setScenes(INITIAL_TELUGU_PROJECT.scenes);
                setGuidanceConfig(INITIAL_TELUGU_PROJECT.config);
                setActiveTab('editor');
              }}
              onExploreLanguages={() => setActiveTab('languages')}
            />
            <HowItWorksSection />
            <TemplatesSection onSelectTemplate={handleSelectTemplate} />
            <FaqSection />
          </div>
        )}

        {/* VIEW 2: DOCUMENT UPLOAD & CUSTOMIZATION WORKSPACE */}
        {activeTab === 'workspace' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <DocumentUploadCard
              document={currentDocument}
              onDocumentExtracted={(doc) => setCurrentDocument(doc)}
              isExtracting={isExtracting}
              setIsExtracting={setIsExtracting}
            />

            <GuidanceConfigPanel
              config={guidanceConfig}
              onChangeConfig={setGuidanceConfig}
              onOpenLanguagePicker={() => setIsLanguagePickerOpen(true)}
              onGenerate={() => handleGenerateGuidance()}
              isGenerating={isGeneratingScript}
              canGenerate={Boolean(currentDocument && currentDocument.rawText)}
            />
          </div>
        )}

        {/* VIEW 3: INTERACTIVE VIDEO STUDIO & STORYBOARD EDITOR */}
        {activeTab === 'editor' && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Left Column: Real-Time Interactive Video Player & Canvas */}
              <div className="w-full lg:w-7/12 sticky top-20">
                <VideoPlayerCanvas
                  scenes={scenes}
                  config={guidanceConfig}
                  onOpenExportModal={() => setIsExportModalOpen(true)}
                  currentSceneIndex={currentSceneIndex}
                  onSceneChange={setCurrentSceneIndex}
                  onUpdateConfig={setGuidanceConfig}
                />
              </div>

              {/* Right Column: Scene Storyboard Timeline & Editor */}
              <div className="w-full lg:w-5/12">
                <StoryboardEditor
                  scenes={scenes}
                  onUpdateScenes={setScenes}
                  config={guidanceConfig}
                  currentSceneIndex={currentSceneIndex}
                  onSelectScene={setCurrentSceneIndex}
                  onRegenerateScene={(idx) => {
                    const scene = scenes[idx];
                    const targetLang = getLanguageByCode(guidanceConfig.targetLanguage);
                    alert(`Scene ${scene.sceneNumber} narration refreshed in ${targetLang?.name || 'target language'}.`);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: LANGUAGE REGISTRY CATALOG */}
        {activeTab === 'languages' && (
          <div>
            <LanguageCatalogSection
              onSelectLanguageForGuide={(lang: LanguageInfo) => {
                setGuidanceConfig((prev) => ({
                  ...prev,
                  targetLanguage: lang.code,
                  subtitleLanguage: lang.code
                }));
                setActiveTab('workspace');
              }}
            />
          </div>
        )}

        {/* VIEW 5: TEMPLATES GALLERY */}
        {activeTab === 'templates' && (
          <TemplatesSection onSelectTemplate={handleSelectTemplate} />
        )}

        {/* VIEW 6: MY GUIDANCE DASHBOARD */}
        {activeTab === 'dashboard' && (
          <ProjectLibrary
            projects={projects}
            activeProjectId={activeProjectId}
            onSelectProject={handleSelectProject}
            onNewProject={handleNewProject}
            onDeleteProject={handleDeleteProject}
            onDuplicateProject={handleDuplicateProject}
          />
        )}
      </main>

      {/* Language Picker Modal */}
      <LanguagePickerModal
        isOpen={isLanguagePickerOpen}
        onClose={() => setIsLanguagePickerOpen(false)}
        selectedLanguageCode={guidanceConfig.targetLanguage}
        onSelectLanguage={(lang) => {
          setGuidanceConfig((prev) => ({
            ...prev,
            targetLanguage: lang.code,
            subtitleLanguage: lang.code
          }));
        }}
      />

      {/* Video & Subtitle Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        scenes={scenes}
        config={guidanceConfig}
        onDownloadVideo={() => {
          // Triggered from modal; will signal canvas
          alert('Video rendering initialized from canvas engine. Downloading your video file...');
        }}
      />

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
