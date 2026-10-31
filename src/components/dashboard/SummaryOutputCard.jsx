import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Download,
  Clock,
  TrendingDown,
  AlertTriangle,
  RefreshCw,
  FileCheck,
  FileText,
  ServerOff,
  ExternalLink,
} from 'lucide-react';
import { calculateReduction, estimateReadingTime } from '../../utils/textMetrics';
import { exportSummaryAsText, exportSummaryAsMarkdown, copyToClipboard } from '../../utils/fileExport';
import { useToast } from '../../context/ToastContext';

export default function SummaryOutputCard({
  summaryData,
  isLoading,
  error,
  onRetry,
  onOpenBackendGuide,
}) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleCopy = async () => {
    if (!summaryData?.summary) return;
    const success = await copyToClipboard(summaryData.summary);
    if (success) {
      setCopied(true);
      addToast('Summary copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } else {
      addToast('Failed to copy text', 'error');
    }
  };

  const handleDownloadTxt = () => {
    if (!summaryData) return;
    exportSummaryAsText(summaryData);
    setShowExportMenu(false);
    addToast('Downloaded plain text summary (.txt)', 'success');
  };

  const handleDownloadMd = () => {
    if (!summaryData) return;
    exportSummaryAsMarkdown(summaryData);
    setShowExportMenu(false);
    addToast('Downloaded formatted markdown summary (.md)', 'success');
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center min-h-[440px] text-center transition-colors">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Sparkles className="w-8 h-8 animate-pulse text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 opacity-20 blur-md animate-pulse"></div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
          Generating AI Summary
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          Google Gemini is analyzing sentence structures, identifying key themes, and crafting a concise synthesis...
        </p>

        {/* Shimmer loading skeleton */}
        <div className="w-full max-w-md space-y-3">
          <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full w-full animate-pulse"></div>
          <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full w-5/6 animate-pulse"></div>
          <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full w-4/6 animate-pulse"></div>
          <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full w-3/4 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    const isNetwork = error.isNetworkError;
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-rose-200 dark:border-rose-900/60 shadow-sm p-6 sm:p-8 flex flex-col justify-between min-h-[440px] transition-colors">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 flex-shrink-0">
              {isNetwork ? <ServerOff className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400">
                {isNetwork ? 'Connection Error' : 'Summarization Error'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                {isNetwork ? 'Unable to Reach Backend Server' : 'Could Not Complete Request'}
              </h3>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-sm text-rose-800 dark:text-rose-300 leading-relaxed mb-6">
            <p className="font-semibold mb-1">Details:</p>
            <p>{error.message || 'An unknown error occurred while contacting the server.'}</p>
          </div>

          {isNetwork && (
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-2 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                How to resolve this:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Ensure your Node.js & Express server is running on port 5000.</li>
                <li>Verify your <code className="text-indigo-600 dark:text-indigo-400">.env</code> has <code className="text-indigo-600 dark:text-indigo-400">VITE_API_BASE_URL=http://localhost:5000/api</code>.</li>
                <li>Make sure your Gemini API key is configured in the backend environment.</li>
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          {onRetry && (
            <button
              onClick={onRetry}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Request</span>
            </button>
          )}

          {isNetwork && onOpenBackendGuide && (
            <button
              onClick={onOpenBackendGuide}
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-indigo-500" />
              <span>Backend Setup Guide</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. Empty State (No summary yet)
  if (!summaryData) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center min-h-[440px] text-center transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/80 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-4 shadow-sm">
          <FileText className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1.5">
          No Summary Generated Yet
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          Paste your document on the left, select your preferred summary length, and click <span className="font-semibold text-indigo-600 dark:text-indigo-400">Summarize Text</span> to generate instant insights.
        </p>

        <div className="grid grid-cols-2 gap-3 w-full max-w-xs text-xs text-left">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-0.5">3 Modes</span>
            <span className="text-slate-500 dark:text-slate-400">Short, Medium, or Detailed</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-0.5">Instant Export</span>
            <span className="text-slate-500 dark:text-slate-400">Copy, .txt, or Markdown</span>
          </div>
        </div>
      </div>
    );
  }

  // 4. Success State (Summary generated)
  const reduction = calculateReduction(
    summaryData.originalWordCount,
    summaryData.summaryWordCount
  );
  const readingTime = estimateReadingTime(summaryData.summaryWordCount);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full transition-colors overflow-hidden">
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <FileCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate max-w-[220px] sm:max-w-xs">
              {summaryData.title || 'Generated Summary'}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="capitalize font-medium text-indigo-600 dark:text-indigo-400">
                {summaryData.length} Mode
              </span>
              <span>•</span>
              <span>{summaryData.createdAt ? new Date(summaryData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Copy & Download */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              copied
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            title="Copy summary text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* Download Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-1 w-44 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20">
                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg flex items-center justify-between"
                >
                  <span>Plain Text (.txt)</span>
                  <span className="text-[10px] text-slate-400">TXT</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadMd}
                  className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg flex items-center justify-between"
                >
                  <span>Markdown (.md)</span>
                  <span className="text-[10px] text-slate-400">MD</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="px-5 py-3 bg-indigo-50/40 dark:bg-indigo-950/30 border-b border-indigo-100/50 dark:border-indigo-900/30 grid grid-cols-3 gap-2 text-center">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
            Original Words
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {summaryData.originalWordCount || 0}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
            Summary Words
          </span>
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {summaryData.summaryWordCount || 0}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
            Reading Saved
          </span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 justify-center">
            <TrendingDown className="w-3.5 h-3.5" />
            {reduction > 0 ? `${reduction}%` : 'Optimal'}
          </span>
        </div>
      </div>

      {/* Summary Content Body */}
      <div className="p-5 flex-1 overflow-y-auto max-h-[460px] text-sm leading-relaxed text-slate-800 dark:text-slate-200 space-y-3 font-normal selection:bg-indigo-500 selection:text-white">
        {summaryData.summary.split('\n\n').map((paragraph, index) => {
          if (paragraph.trim().startsWith('- ') || paragraph.trim().startsWith('* ')) {
            const bullets = paragraph.split('\n');
            return (
              <ul key={index} className="list-disc list-inside space-y-1.5 pl-1 text-slate-700 dark:text-slate-300">
                {bullets.map((b, bi) => (
                  <li key={bi} className="leading-relaxed">
                    {b.replace(/^[-*]\s*/, '')}
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={index} className="leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Est. {readingTime}</span>
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
          <Check className="w-3.5 h-3.5" /> Auto-saved to History
        </span>
      </div>
    </div>
  );
}
