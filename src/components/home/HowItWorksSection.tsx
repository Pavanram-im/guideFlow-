import React from 'react';
import { Upload, Brain, Languages, Film, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Upload,
      title: 'Upload or Paste Document',
      description: 'Upload PDF, DOCX, TXT, or Markdown documents, or paste any operational procedure, medical SOP, tutorial, or technical policy.'
    },
    {
      step: '02',
      icon: Brain,
      title: 'Analyze & Extract Facts',
      description: 'AI extracts step-by-step directives, prerequisites, safety cautions, and critical facts without inventing facts or hallucinating.'
    },
    {
      step: '03',
      icon: Languages,
      title: 'Select Target Language & Voice',
      description: 'Choose from Telugu, Hindi, Tamil, English regional variants, or world languages. Customize pace, pedagogical audience, and tone.'
    },
    {
      step: '04',
      icon: Film,
      title: 'Preview, Edit & Export Video',
      description: 'Review scene-by-scene storyboard, edit captions, preview synchronized audio narration, and export high-definition video with subtitles.'
    }
  ];

  return (
    <section className="py-20 border-b border-white/10 bg-[#080B14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <div className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-2">
            Systematic Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            How GuideFlow AI Works
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl">
            From complex written documentation to clear, accessible video guides in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#111827] border border-white/10 relative group hover:border-purple-500/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-purple-400 font-bold bg-purple-950/40 px-2 py-1 rounded border border-purple-500/20">
                      STEP {item.step}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-300 group-hover:text-purple-400 group-hover:bg-purple-600/10 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
