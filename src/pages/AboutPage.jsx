import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Cpu,
  Database,
  GraduationCap,
  Briefcase,
  Search,
  Code2,
  ChevronDown,
  ArrowRight,
  Layers,
  CheckCircle,
} from 'lucide-react';

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does Google Gemini generate summaries?',
      a: 'The application uses abstractive summarization powered by Google Gemini. Rather than merely cutting and pasting sentences (extractive), Gemini interprets the core semantic meaning, establishes the logical hierarchy of ideas, and crafts fluent, cohesive syntheses tailored to your chosen length mode.',
    },
    {
      q: 'Why are there three summary length modes?',
      a: 'Different situations require different depths. The Short mode is ideal for quick scans and meeting agendas. Medium provides a well-rounded executive brief with supporting arguments. Detailed preserves nuanced context, statistics, and methodology—ideal for research papers and technical analyses.',
    },
    {
      q: 'Where are my summaries stored?',
      a: 'Summaries are stored in your session local storage cache and synchronized with the MongoDB database when the Express backend is running. Your data remains private to your setup.',
    },
    {
      q: 'Why are API keys not stored in the frontend?',
      a: 'In modern secure web architecture, API keys and secrets must never be embedded in client-side code. The frontend communicates with a secure Node.js/Express backend running at http://localhost:5000, which handles authentication with the Google Gemini API securely.',
    },
  ];

  return (
    <div className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>About AI Text Summarizer</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-5 leading-tight">
          Transforming Dense Information into{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
            Actionable Knowledge
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          AI Text Summarizer was engineered to solve modern information overload. By coupling Google Gemini's advanced language synthesis with an intuitive, responsive interface, we help you absorb hours of reading in minutes.
        </p>
      </div>

      {/* How AI Summarization Works: Extractive vs Abstractive */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            The Science of Summarization
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2 mb-3">
            How AI Condenses Complex Text
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Understanding the technological distinction between older keyword extraction and modern neural abstraction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Extractive Card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Traditional Method
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
              Extractive Summarization
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Older algorithms select whole sentences directly from the raw document based on statistical frequency. This often creates disjointed paragraphs, repetitive phrasing, and fragmented context.
            </p>
            <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">❌ Disjointed sentence transitions</li>
              <li className="flex items-center gap-1.5">❌ Inability to synthesize concepts across paragraphs</li>
              <li className="flex items-center gap-1.5">❌ No adaptive length modulation</li>
            </ul>
          </div>

          {/* Abstractive Card (Gemini) */}
          <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 ring-1 ring-indigo-500/20">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
              Powered by Google Gemini
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Abstractive Neural Synthesis
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Gemini reads and conceptualizes the full text, generating natural, cohesive sentences that articulate the core essence in fresh language, just like an expert researcher summarizing a paper.
            </p>
            <ul className="text-xs space-y-1.5 text-indigo-900 dark:text-indigo-200">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Fluent, cohesive narrative flow
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Intelligent concept synthesis & reduction metrics
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                3 precise summary depths (Short, Medium, Detailed)
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Target Audiences & Benefits */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Who Benefits
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Built for High-Volume Reading Workflows
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Students */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                For Students & Learners
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Condense lengthy textbook chapters, seminar readings, lecture transcriptions, and syllabus notes into quick revision flashpoints before exams.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              ⚡ 70% faster revision cycles
            </div>
          </div>

          {/* Professionals */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                For Professionals & Executives
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Rapidly evaluate quarterly financial reports, board packets, industry whitepapers, and long client email threads to make informed decisions faster.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-violet-600 dark:text-violet-400">
              ⚡ Save up to 5 hours per week
            </div>
          </div>

          {/* Researchers */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                For Researchers & Academics
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                Perform literature reviews across dozens of published articles. Extract methodology summaries and key findings without losing critical statistical rigor.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ⚡ Accelerated literature scanning
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack & Architecture */}
      <section className="bg-slate-100/60 dark:bg-slate-900/60 rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Under The Hood
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Technology Stack & Architecture
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Modern full-stack architecture built for high performance, modularity, and privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-1">
              <Code2 className="w-4 h-4 text-indigo-500" /> React 19 & Vite
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sub-millisecond hot module reload, component-driven state architecture, and fast client routing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-1">
              <Layers className="w-4 h-4 text-violet-500" /> Tailwind CSS
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Modern utility design system with complete light & dark mode support and responsive breakpoints.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-1">
              <Cpu className="w-4 h-4 text-amber-500" /> Google Gemini API
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Neural large language model delivering abstractive summarization with high fidelity and zero clutter.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white mb-1">
              <Database className="w-4 h-4 text-emerald-500" /> Node / Express & Mongo
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              REST API integration layer at http://localhost:5000 with persistent document history schema.
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <div className="text-center pt-8 pb-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-base text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 transition-all"
        >
          <span>Open Summarizer Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
