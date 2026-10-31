import React from 'react';
import { Sparkles, Sliders, History, Download } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      id: 'ai-summarization',
      title: 'Google Gemini Neural Summarization',
      description:
        'Harness the cutting-edge natural language architecture of Gemini to accurately synthesize dense texts, extract core arguments, and eliminate filler while retaining vital factual accuracy.',
      icon: Sparkles,
      color: 'indigo',
      badge: 'Core Engine',
    },
    {
      id: 'adjustable-length',
      title: 'Adjustable Summary Lengths',
      description:
        'Tailor output granularity to your exact needs. Choose between Short bullet takeaways (~20%), a balanced Medium synthesis (~40%), or a Detailed in-depth briefing (~65%).',
      icon: Sliders,
      color: 'violet',
      badge: '3 Depth Modes',
    },
    {
      id: 'summary-history',
      title: 'Smart History Archive',
      description:
        'Never lose a valuable insight. Search, review, and reopen previously generated summaries along with their original source texts anytime, prepared for MongoDB cloud persistence.',
      icon: History,
      color: 'emerald',
      badge: 'MongoDB Ready',
    },
    {
      id: 'easy-export',
      title: 'Instant Export & Clipboard Copy',
      description:
        'One-click download as clean Markdown (.md) or plain text (.txt) files complete with metadata and metrics, or copy straight to your clipboard for instant presentation.',
      icon: Download,
      color: 'amber',
      badge: 'Markdown & TXT',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-100/50 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
            Engineered For Clarity
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4 tracking-tight">
            Designed for Researchers, Students & Leaders
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Everything you need to conquer information overload and distill complex documents into clear, actionable knowledge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600/60 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
