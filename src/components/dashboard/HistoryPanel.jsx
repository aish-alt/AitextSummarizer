import React, { useState } from 'react';
import {
  History,
  Search,
  Trash2,
  Calendar,
  ArrowRight,
  Database,
  RefreshCw,
  FolderOpen,
  X,
} from 'lucide-react';
import { calculateReduction } from '../../utils/textMetrics';
import { useToast } from '../../context/ToastContext';

export default function HistoryPanel({
  historyItems,
  onSelectHistoryItem,
  onDeleteItem,
  onClearAll,
  isSyncedWithBackend,
  onRefreshHistory,
  isLoadingHistory,
}) {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const filteredItems = historyItems.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const titleMatch = (item.title || '').toLowerCase().includes(term);
    const summaryMatch = (item.summary || '').toLowerCase().includes(term);
    return titleMatch || summaryMatch;
  });

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await onDeleteItem(id);
      addToast('Summary removed from history', 'info');
    } catch {
      addToast('Failed to delete history item', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all saved summaries from history?')) {
      await onClearAll();
      addToast('All history items cleared', 'info');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Summary History
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {historyItems.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Browse, reopen, or export previous summaries
            </p>
          </div>
        </div>

        {/* Sync Status Badge & Refresh */}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
              isSyncedWithBackend
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
            title={isSyncedWithBackend ? 'Synced with MongoDB' : 'Cached locally (MongoDB offline)'}
          >
            <Database className="w-3 h-3" />
            <span>{isSyncedWithBackend ? 'MongoDB Synced' : 'Local Storage Cache'}</span>
          </span>

          <button
            onClick={onRefreshHistory}
            disabled={isLoadingHistory}
            className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Refresh history"
            aria-label="Refresh history"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingHistory ? 'animate-spin' : ''}`} />
          </button>

          {historyItems.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium px-2 py-1"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-5">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search saved summaries by title or keywords..."
          className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-colors"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* History Items Grid / List */}
      {filteredItems.length === 0 ? (
        <div className="py-12 px-4 text-center rounded-xl bg-slate-50/50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800">
          <FolderOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {searchTerm ? 'No matching summaries found' : 'No saved summaries yet'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {searchTerm
              ? 'Try adjusting your search keywords.'
              : 'Summarize your first document in the workspace above. Each completed summary will automatically be saved here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredItems.map((item) => {
            const reduction = calculateReduction(item.originalWordCount, item.summaryWordCount);
            const dateStr = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={item.id || item._id}
                onClick={() => onSelectHistoryItem(item)}
                className="group relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50">
                      {item.length || 'Medium'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, item.id || item._id)}
                      disabled={deletingId === (item.id || item._id)}
                      className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete from history"
                      aria-label="Delete history item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-1.5">
                    {item.title || 'Untitled Summary'}
                  </h3>

                  {/* Preview Text */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-3">
                    {item.summary}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{dateStr}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    {reduction > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        -{reduction}%
                      </span>
                    )}
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Open <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
