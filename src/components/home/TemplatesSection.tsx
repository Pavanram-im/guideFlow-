import React from 'react';
import { Play, Sparkles, BookOpen, Layers, ShieldCheck, HeartPulse, Terminal } from 'lucide-react';
import { SAMPLE_DOCUMENTS } from '../../utils/documentParser.ts';

interface TemplatesSectionProps {
  onSelectTemplate: (sampleId: string, targetLang: string) => void;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 'sample-software-deployment',
      targetLang: 'te',
      targetLangName: 'Telugu (తెలుగు)',
      icon: Terminal,
      title: 'Cloud Kubernetes Deployment & Rollback Protocol',
      category: 'DevOps & Engineering SOP',
      description: 'Zero-downtime canary release protocol, p95 latency checks, and automated rollback commands translated into clear Telugu narration.'
    },
    {
      id: 'sample-first-aid',
      targetLang: 'hi',
      targetLangName: 'Hindi (हिन्दी)',
      icon: HeartPulse,
      title: 'Workplace Emergency CPR & AED Action Guide',
      category: 'Health & Workplace Safety',
      description: 'Step-by-step life saving chest compression cadence, AED voice prompt instructions, and scene safety warnings in fluent Hindi.'
    },
    {
      id: 'sample-cybersecurity',
      targetLang: 'ta',
      targetLangName: 'Tamil (தமிழ்)',
      icon: ShieldCheck,
      title: 'Enterprise Cyber Security & Phishing Defense Policy',
      category: 'Information Security & Compliance',
      description: 'Corporate spear-phishing defense, MFA fatigue attack prevention, and security escalation protocol adapted into clear Tamil.'
    }
  ];

  return (
    <section className="py-20 border-b border-white/10 bg-[#080B14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
            Turnkey Walkthroughs
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Pre-Configured Guidance Templates
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl">
            Launch complete multi-scene guidance videos immediately. Test authentic Telugu, Hindi, and Tamil narration scripts with synchronized subtitles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <div
                key={tpl.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-[#111827] border border-white/10 hover:border-purple-500/50 hover:bg-[#172033] transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-purple-400 font-medium bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-500/20">
                      {tpl.targetLangName}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-300 group-hover:text-purple-400 group-hover:bg-purple-600/10 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                    {tpl.category}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {tpl.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">4-5 Structured Scenes</span>
                  <button
                    onClick={() => onSelectTemplate(tpl.id, tpl.targetLang)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    <Play className="h-3 w-3" />
                    <span>Launch Template</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
