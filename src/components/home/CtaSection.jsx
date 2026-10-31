import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-700 text-white p-8 sm:p-12 md:p-16 shadow-2xl shadow-indigo-500/25 overflow-hidden text-center">
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-violet-400/20 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-indigo-100 backdrop-blur-md mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Instant AI Productivity</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
              Ready to Turn Hours of Reading Into Minutes?
            </h2>

            <p className="text-base sm:text-lg text-indigo-100 mb-8 leading-relaxed font-normal">
              Experience the power of Google Gemini. Condense articles, research notes, and dense literature with precision and clarity.
            </p>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base bg-white text-indigo-700 hover:bg-slate-50 shadow-xl hover:scale-105 active:scale-95 transition-all duration-150"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 text-indigo-600" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
