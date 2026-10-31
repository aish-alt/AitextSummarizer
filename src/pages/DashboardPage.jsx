import React, { useState, useEffect, useCallback } from 'react';
import TextInputCard from '../components/dashboard/TextInputCard';
import LengthSelector from '../components/dashboard/LengthSelector';
import SummaryOutputCard from '../components/dashboard/SummaryOutputCard';
import HistoryPanel from '../components/dashboard/HistoryPanel';
import BackendConfigModal from '../components/dashboard/BackendConfigModal';
import BackendStatusBadge from '../components/common/BackendStatusBadge';
import { summarizeText } from '../services/summaryService';
import { fetchHistory, saveHistoryItem, deleteHistoryItem, clearAllHistory } from '../services/historyService';
import { useToast } from '../context/ToastContext';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { addToast } = useToast();

  // Input states
  const [inputText, setInputText] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [selectedLength, setSelectedLength] = useState('medium'); // 'short' | 'medium' | 'detailed'

  // Summary generation states
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // History states
  const [historyItems, setHistoryItems] = useState([]);
  const [isSyncedWithBackend, setIsSyncedWithBackend] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Backend config modal state
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);

  // Load history on mount
  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetchHistory();
      setHistoryItems(res.items || []);
      setIsSyncedWithBackend(res.syncedWithBackend);
    } catch (e) {
      console.warn('Failed to fetch history:', e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // Execute summarization
  const handleSummarize = async () => {
    // Validation
    const trimmed = inputText.trim();
    if (!trimmed) {
      addToast('Please enter or paste text to summarize.', 'error');
      setError({ message: 'Input text is empty. Please paste your document before summarizing.' });
      return;
    }

    const words = trimmed.split(/\s+/).filter(Boolean).length;
    if (words < 15) {
      addToast('Input text is too short (min. 15 words).', 'error');
      setError({
        message: `Your input contains only ${words} words. Please provide at least 15 words to generate a meaningful summary.`,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await summarizeText({
      text: trimmed,
      length: selectedLength,
      title: docTitle.trim() || undefined,
    });

    setIsLoading(false);

    if (result.success) {
      setSummaryData(result.data);
      addToast('Summary generated successfully!', 'success');

      // Save to History (dual MongoDB + local storage)
      try {
        const saveRes = await saveHistoryItem(result.data);
        setIsSyncedWithBackend(saveRes.syncedWithBackend);
        // Refresh local history list
        setHistoryItems((prev) => [saveRes.item, ...prev.filter((i) => i.id !== saveRes.item.id)]);
      } catch (err) {
        console.warn('Could not auto-save to history:', err);
      }
    } else {
      setError({
        message: result.error,
        isNetworkError: result.isNetworkError,
        status: result.status,
      });
      addToast(result.error, 'error');
    }
  };

  // Re-open item from history
  const handleSelectHistoryItem = (item) => {
    setInputText(item.originalText || '');
    setDocTitle(item.title || '');
    setSelectedLength(item.length || 'medium');
    setSummaryData({
      id: item.id || item._id,
      title: item.title,
      summary: item.summary,
      length: item.length || 'medium',
      originalWordCount: item.originalWordCount,
      summaryWordCount: item.summaryWordCount,
      createdAt: item.createdAt,
      originalText: item.originalText,
    });
    setError(null);
    addToast(`Loaded "${item.title || 'Summary'}" into workspace`, 'info');

    // Smooth scroll up to workspace
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete single history item
  const handleDeleteHistoryItem = async (id) => {
    const res = await deleteHistoryItem(id);
    setHistoryItems((prev) => prev.filter((item) => item.id !== id && item._id !== id));
    setIsSyncedWithBackend(res.syncedWithBackend);
  };

  // Clear all history
  const handleClearAllHistory = async () => {
    const res = await clearAllHistory();
    setHistoryItems([]);
    setIsSyncedWithBackend(res.syncedWithBackend);
  };

  const handleClearInput = () => {
    setInputText('');
    setDocTitle('');
    setError(null);
  };

  return (
    <div className="min-h-screen py-8 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Summarization Studio
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Paste documents, choose depth, and distill essential insights instantly with Google Gemini.
          </p>
        </div>

        {/* Backend Status indicator with guide modal button */}
        <div className="flex items-center gap-3">
          <BackendStatusBadge onOpenConfigModal={() => setIsBackendModalOpen(true)} />
        </div>
      </div>

      {/* Length selector */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <LengthSelector
          selectedLength={selectedLength}
          onChange={setSelectedLength}
          disabled={isLoading}
        />
      </div>

      {/* Main Dual-Pane Summarization Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Pane: Input Document */}
        <div className="h-full">
          <TextInputCard
            text={inputText}
            setText={setInputText}
            title={docTitle}
            setTitle={setDocTitle}
            onSummarize={handleSummarize}
            isLoading={isLoading}
            selectedLength={selectedLength}
            onClear={handleClearInput}
          />
        </div>

        {/* Right Pane: Summary Output */}
        <div className="h-full">
          <SummaryOutputCard
            summaryData={summaryData}
            isLoading={isLoading}
            error={error}
            onRetry={handleSummarize}
            onOpenBackendGuide={() => setIsBackendModalOpen(true)}
          />
        </div>
      </div>

      {/* Summary History Section */}
      <div className="pt-4">
        <HistoryPanel
          historyItems={historyItems}
          onSelectHistoryItem={handleSelectHistoryItem}
          onDeleteItem={handleDeleteHistoryItem}
          onClearAll={handleClearAllHistory}
          isSyncedWithBackend={isSyncedWithBackend}
          onRefreshHistory={loadHistory}
          isLoadingHistory={isLoadingHistory}
        />
      </div>

      {/* Backend Integration Guide Modal */}
      <BackendConfigModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />
    </div>
  );
}
