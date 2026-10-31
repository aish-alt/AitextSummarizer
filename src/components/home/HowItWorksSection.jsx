import React from 'react';
import { FileInput, SlidersHorizontal, CheckCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Input or Paste Text',
      subtitle: 'Any length, topic, or format',
      description:
        'Paste your article, meeting transcript, thesis chapter, or research paper into the workspace. Or try one of our one-click sample articles.',
      icon: FileInput,
    },
    {
      number: '02',
      title: 'Select Summary Length',
      subtitle: 'Tailored to your schedule',
      description:
        'Choose from Short (quick bullet takeaways), Medium (balanced executive overview), or Detailed (deep comprehensive synthesis).',
      icon: SlidersHorizontal,
    },
    {
      number: '03',
      title: 'Get Insights & Export',
      subtitle: 'Copy, download, or review later',
      description:
        'View original vs. condensed word count metrics, copy key points in one click, export as Markdown or TXT, and access anytime from history.',
      icon: CheckCheck,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
            Streamlined Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4 tracking-tight">
            How It Works In Three Simple Steps
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Go from dense, overwhelming text to clear, digestible takeaways in less than five seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Step Number Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-extrabold text-2xl text-slate-300 dark:text-slate-700">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-3">
                  {step.subtitle}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Action Link */}
        <div className="mt-12 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 group"
          >
            <span>Try the summarizer workspace now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
