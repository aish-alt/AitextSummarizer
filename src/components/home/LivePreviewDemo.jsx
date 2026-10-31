import React, { useState } from 'react';
import { Sparkles, TrendingDown, Clock } from 'lucide-react';

export default function LivePreviewDemo() {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'original'

  const originalSnippet = `Artificial intelligence has fundamentally disrupted clinical diagnostic oncology. Convolutional neural networks now analyze chest radiographs, cross-sectional computed tomography (CT) scans, and histopathological tissue biopsies with diagnostic accuracy comparable to board-certified radiologists. These machine learning systems highlight minute pulmonary nodules and occult micro-fractures that human clinicians may overlook during fatigued night shifts. In predictive oncology, models continuously ingest patient electronic health record parameters to forecast septic shock up to eight hours prior to overt physiological collapse, radically reducing intensive care mortality rates.`;

  const summarySnippet = `• AI neural networks now analyze CT scans, radiographs, and biopsies with accuracy rivaling specialist physicians.
• Machine learning models detect subtle micro-nodules and occult fractures that are prone to human diagnostic oversight.
• Predictive EHR analytics alert intensive care staff to impending septic shock up to 8 hours early, significantly reducing patient mortality.`;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Top interactive preview bar */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-400"></span>
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 ml-2">
              Interactive Preview • Healthcare Research Abstract
            </span>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('original')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'original'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Original Source (108 words)
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activeTab === 'summary'
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Gemini AI Summary (42 words)</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-6 sm:p-8">
          {activeTab === 'summary' ? (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> 61% Reading Reduction
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> 18 sec read
                  </span>
                </div>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Short Keypoints Mode
                </span>
              </div>

              <div className="text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 space-y-2.5 font-normal">
                {summarySnippet.split('\n').map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-2 flex-shrink-0"></span>
                    <p>{bullet.replace(/^•\s*/, '')}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Raw Unprocessed Text
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Full context • 108 words
                </span>
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300 font-normal">
                {originalSnippet}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
