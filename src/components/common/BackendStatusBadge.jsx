import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function BackendStatusBadge({ onOpenConfigModal }) {
  const [status, setStatus] = useState({ checking: true, online: false });

  const verifyStatus = async () => {
    setStatus((prev) => ({ ...prev, checking: true }));
    const result = await checkBackendHealth();
    setStatus({ checking: false, online: result.online });
  };

  useEffect(() => {
    verifyStatus();
    // Periodic light poll every 45s
    const interval = setInterval(verifyStatus, 45000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onOpenConfigModal}
        title="Click for Backend Integration & API Status details"
        className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
          status.checking
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            : status.online
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100'
            : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 hover:bg-amber-100'
        }`}
      >
        <span className="relative flex h-2 w-2">
          {status.online ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          )}
        </span>
        <span className="font-semibold">Backend:</span>
        <span>
          {status.checking ? 'Connecting...' : status.online ? 'Online' : 'Offline (localhost:5000)'}
        </span>
      </button>

      <button
        onClick={verifyStatus}
        disabled={status.checking}
        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full"
        title="Refresh backend status"
        aria-label="Refresh backend status"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${status.checking ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
