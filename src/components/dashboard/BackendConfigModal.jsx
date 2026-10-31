import React, { useState } from 'react';
import { X, Server, Copy, Check, Terminal, ExternalLink, RefreshCw } from 'lucide-react';
import { checkBackendHealth, API_BASE_URL } from '../../services/api';
import { copyToClipboard } from '../../utils/fileExport';
import { useToast } from '../../context/ToastContext';

export default function BackendConfigModal({ isOpen, onClose }) {
  const { addToast } = useToast();
  const [copiedKey, setCopiedKey] = useState(null);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleCopy = async (key, text) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopiedKey(key);
      addToast('Copied to clipboard', 'success');
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await checkBackendHealth();
    setTesting(false);
    setTestResult(result);
  };

  const sampleExpressCode = `// server.js (Express + Google Gemini + MongoDB)
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'AI Text Summarizer API' }));

// POST /api/summarize
app.post('/api/summarize', async (req, res) => {
  try {
    const { text, length = 'medium', title } = req.body;
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = \`Summarize the following text in \${length} length mode.
Provide a clear, cohesive summary capturing core arguments and conclusions:
\${text}\`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    res.json({
      success: true,
      data: {
        title: title || 'Summary Document',
        summary,
        length,
        originalWordCount: text.split(/\\s+/).length,
        summaryWordCount: summary.split(/\\s+/).length,
        createdAt: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(5000, () => console.log('Backend running on http://localhost:5000'));`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Backend API & MongoDB Integration Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Connection target: <code className="text-indigo-600 dark:text-indigo-400 font-mono">{API_BASE_URL}</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300">
          {/* Connection Test Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Live Backend Ping
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tests GET <span className="font-mono text-indigo-600 dark:text-indigo-400">{API_BASE_URL.replace('/api', '')}/health</span>
              </p>
            </div>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            {testResult && (
              <div className="w-full pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                {testResult.online ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Connected successfully to backend!
                  </span>
                ) : (
                  <span className="text-rose-600 dark:text-rose-400 font-medium">
                    ⚠️ Backend not reachable on port 5000. Start the server using <code className="font-mono">node server.js</code>.
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Endpoints specification */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
              Expected API Endpoints
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold mr-2">POST</span>
                  <span>/api/summarize</span>
                </div>
                <span className="text-slate-400 text-[11px]">Takes {`{ text, length, title }`}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-2">GET</span>
                  <span>/api/history</span>
                </div>
                <span className="text-slate-400 text-[11px]">Returns array of MongoDB summaries</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-rose-600 dark:text-rose-400 font-bold mr-2">DELETE</span>
                  <span>/api/history/:id</span>
                </div>
                <span className="text-slate-400 text-[11px]">Deletes summary by id</span>
              </div>
            </div>
          </div>

          {/* Server Reference Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                Express Server Blueprint
              </h4>
              <button
                onClick={() => handleCopy('code', sampleExpressCode)}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copiedKey === 'code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'code' ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
              {sampleExpressCode}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
