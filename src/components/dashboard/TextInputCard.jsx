import React, { useRef } from 'react';
import { countWords, countCharacters } from '../../utils/textMetrics';
import { SAMPLE_TEXTS } from '../../utils/sampleTexts';
import { Trash2, Clipboard, Sparkles, FileText, Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function TextInputCard({
  text,
  setText,
  title,
  setTitle,
  onSummarize,
  isLoading,
  selectedLength,
  onClear,
}) {
  const { addToast } = useToast();
  const textareaRef = useRef(null);

  const wordCount = countWords(text);
  const charCount = countCharacters(text, true);

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        setText(clipText);
        addToast('Pasted text from clipboard', 'info');
      }
    } catch {
      addToast('Clipboard access denied. Please paste using Ctrl+V or Cmd+V', 'info');
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && text.trim()) {
        onSummarize();
      }
    }
  };

  const loadSample = (sample) => {
    setText(sample.content);
    setTitle(sample.title);
    addToast(`Loaded sample: "${sample.title}"`, 'info');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-full transition-colors">
      {/* Top Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 bg-slate-50/60 dark:bg-slate-900/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Input Document
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Paste or type your text below
            </p>
          </div>
        </div>

        {/* Action buttons & samples */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Quick sample loader dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Load Sample</span>
            </button>
            <div className="absolute right-0 mt-1 w-64 p-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 hidden group-hover:block transition-all">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                Try a sample article
              </div>
              {SAMPLE_TEXTS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => loadSample(sample)}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 transition-colors"
                >
                  <div className="font-semibold">{sample.title}</div>
                  <div className="text-[10px] text-slate-400">
                    {sample.category} • ~{sample.words} words
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handlePaste}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Paste from clipboard"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paste</span>
          </button>

          {text && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-lg hover:bg-rose-100 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional Title input */}
      <div className="px-5 pt-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document Title (optional, e.g. 'Quarterly Research Notes')"
          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
        />
      </div>

      {/* Textarea */}
      <div className="p-5 flex-1 flex flex-col">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste or write the text you want to condense here... (min. 15 words)

Tip: Articles, research abstracts, executive memos, transcripts, and study notes work best."
          className="w-full flex-1 min-h-[260px] p-4 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors leading-relaxed font-normal"
          aria-label="Text to summarize"
        />

        {/* Text Metrics & Bottom Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <strong className="text-slate-700 dark:text-slate-200 font-semibold">{wordCount}</strong> words
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <strong className="text-slate-700 dark:text-slate-200 font-semibold">{charCount}</strong> characters
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden lg:inline text-[11px] text-slate-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">Ctrl+Enter</kbd>
            </span>

            <button
              type="button"
              onClick={onSummarize}
              disabled={isLoading || wordCount < 5}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all duration-200 shadow-md ${
                isLoading || wordCount < 5
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Summarizing with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Summarize Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
