import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can an English technical document be translated into a fluent Telugu or Hindi guidance video?',
      a: 'Yes. GuideFlow AI is engineered specifically for cross-lingual instructional adaptation. When an English document is provided, the AI pipeline extracts the core directives, preserves numbers, metrics, and commands, and generates native-script narration in Telugu (తెలుగు), Hindi (हिन्दी), Tamil (தமிழ்), or any chosen language.'
    },
    {
      q: 'How does the platform handle languages without native text-to-speech support?',
      a: 'We maintain an honest, centralized provider capability registry. Languages with verified speech providers offer natural voice narration. For languages currently lacking high-fidelity speech synthesis, GuideFlow AI provides high-contrast burned-in subtitles and native typography without making false voice claims.'
    },
    {
      q: 'Are critical warning instructions and numbers preserved accurately?',
      a: 'Yes. The extraction engine flags warnings, safety protocols, and prerequisite constraints separately. During script generation, fidelity rules enforce strict preservation of numeric thresholds, dates, software commands, and safety precautions.'
    },
    {
      q: 'What video and subtitle formats can I export?',
      a: 'You can export ready-to-watch MP4 / WebM video files rendered directly from the canvas engine, as well as standalone SubRip (.srt) subtitles, WebVTT (.vtt) caption tracks, full numbered transcripts (.txt), and complete storyboard JSON data.'
    },
    {
      q: 'Is right-to-left (RTL) script layout supported for Arabic and Urdu?',
      a: 'Yes. For Arabic, Urdu, Persian, and Hebrew, the UI, video player subtitles, and script editors automatically apply bidirectional CSS text direction (`dir="rtl"`) with appropriate Arabic/Nastaliq glyph shaping.'
    }
  ];

  return (
    <section className="py-20 border-b border-white/10 bg-[#080B14]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-10">
          <div className="text-xs uppercase tracking-widest text-purple-400 font-semibold mb-2">
            Technical & Linguistic Answers
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-[#111827] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-semibold text-white hover:text-purple-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-purple-400 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-4" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
