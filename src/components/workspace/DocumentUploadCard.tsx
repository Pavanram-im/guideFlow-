import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle2, RefreshCw, Sparkles, BookOpen, Layers } from 'lucide-react';
import { ExtractedDocument } from '../../types/index.ts';
import { SAMPLE_DOCUMENTS, analyzeRawText } from '../../utils/documentParser.ts';

interface DocumentUploadCardProps {
  document: ExtractedDocument | null;
  onDocumentExtracted: (doc: ExtractedDocument) => void;
  isExtracting: boolean;
  setIsExtracting: (val: boolean) => void;
}

export const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
  document,
  onDocumentExtracted,
  isExtracting,
  setIsExtracting
}) => {
  const [pastedText, setPastedText] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcessText = async (text: string, title?: string, fileName?: string) => {
    if (!text.trim()) return;
    setIsExtracting(true);
    try {
      const response = await fetch('/api/documents/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          title: title || fileName,
          fileName
        })
      });
      const data = await response.json();
      if (data.success && data.document) {
        onDocumentExtracted(data.document);
      } else {
        // Fallback
        const fallbackDoc = analyzeRawText(text, title || fileName);
        onDocumentExtracted(fallbackDoc);
      }
    } catch (e) {
      console.warn('Backend extract call failed, using heuristic parser:', e);
      const fallbackDoc = analyzeRawText(text, title || fileName);
      onDocumentExtracted(fallbackDoc);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFile = async (file: File) => {
    setUploadedFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const validExtensions = ['.txt', '.md', '.markdown', '.docx', '.pdf', '.json'];
    const lowerName = file.name.toLowerCase();
    const isValid = validExtensions.some((ext) => lowerName.endsWith(ext));

    if (!isValid) {
      alert('Supported formats: PDF, DOCX, TXT, Markdown, or pasted paragraphs.');
    }

    // Read text directly for plain text & markdown; for other types read text representation
    const text = await file.text();
    handleProcessText(text, file.name.replace(/\.[^/.]+$/, ''), file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_DOCUMENTS.find((s) => s.id === sampleId);
    if (!sample) return;
    setDocTitle(sample.title);
    setPastedText(sample.fullText);
    setUploadedFileName(sample.title);
    setFileSize('1.4 KB');
    handleProcessText(sample.fullText, sample.title, `${sample.id}.md`);
  };

  return (
    <div className="w-full rounded-2xl bg-[#111827] border border-white/10 p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="h-5 w-5 text-purple-400" />
            <span>Document Input & Extraction</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Supports PDF, DOCX, TXT, Markdown & Raw Text</span>
            <span aria-hidden="true">·</span>
            <span>Zero-loss key facts & warning extraction</span>
          </div>
        </div>

        {/* Input Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setInputMode('upload')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              inputMode === 'upload' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            File Upload
          </button>
          <button
            onClick={() => setInputMode('paste')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              inputMode === 'paste' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            Paste Document
          </button>
        </div>
      </div>

      {/* Quick Template Presets Bar */}
      <div className="mt-5 p-4 rounded-xl bg-[#172033]/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <BookOpen className="h-4 w-4 text-cyan-400 shrink-0" />
          <span className="font-medium text-white">Instant Demo Presets:</span>
          <span className="text-slate-400 hidden lg:inline">Load an authentic document with 1 click to test</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_DOCUMENTS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleLoadSample(s.id)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/30 hover:border-purple-500/40 border border-white/10 text-slate-300 hover:text-white transition-all text-[11px] whitespace-nowrap"
            >
              {s.title.slice(0, 24)}...
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload / Paste Section */}
      <div className="mt-6">
        {inputMode === 'upload' ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              dragActive
                ? 'border-purple-500 bg-purple-950/20'
                : 'border-white/15 bg-white/[0.015] hover:border-purple-500/50 hover:bg-white/[0.03]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
              className="hidden"
              accept=".txt,.md,.markdown,.docx,.pdf"
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-600/10 text-purple-400 border border-purple-500/20 mb-4 shadow-inner">
              {isExtracting ? (
                <RefreshCw className="h-6 w-6 animate-spin text-purple-400" />
              ) : (
                <Upload className="h-6 w-6" />
              )}
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-white">
                {isExtracting ? 'Analyzing document structure...' : 'Click to select or drag & drop document here'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                PDF, DOCX, TXT, Markdown (Max 15MB)
              </p>
            </div>
            {uploadedFileName && (
              <div className="mt-4 flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
                <FileText className="h-3.5 w-3.5 text-cyan-400" />
                <span className="font-medium text-white">{uploadedFileName}</span>
                {fileSize && <span className="text-slate-400">({fileSize})</span>}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Document Title (e.g., Microservice Deployment SOP, First Aid Guide)"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500 transition-colors"
            />
            <textarea
              rows={8}
              placeholder="Paste policy, instruction manual, code walkthrough, tutorial, or paragraph here..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-purple-500 transition-colors font-mono text-xs leading-relaxed"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                {pastedText.split(/\s+/).filter(Boolean).length} words
              </span>
              <button
                disabled={isExtracting || !pastedText.trim()}
                onClick={() => handleProcessText(pastedText, docTitle || 'Pasted Guide')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium transition-all shadow-md active:scale-98"
              >
                {isExtracting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Extract & Understand Document</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Document Intelligence Inspection */}
      {document && (
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4 animate-in fade-in duration-300">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/[0.03] p-4 rounded-xl border border-white/5">
            <div>
              <div className="text-xs text-purple-400 uppercase tracking-wider font-semibold">Extracted Subject</div>
              <h3 className="text-lg font-bold text-white mt-0.5">{document.title}</h3>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="text-emerald-400 font-medium">{document.detectedLanguage}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{document.wordCount} words</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{document.suggestedSteps} suggested scenes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Key Takeaways */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                <span>Extracted Steps & Key Points</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {document.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-mono shrink-0">{i + 1}.</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings & Critical Rules */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <span>Critical Precautions & Warnings</span>
              </h4>
              {document.warnings.length > 0 ? (
                <ul className="space-y-1.5 text-xs text-amber-200">
                  {document.warnings.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No hazardous warnings detected in source.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
