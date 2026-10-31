import React from 'react';
import { AlignLeft, ListCollapse, FileSpreadsheet } from 'lucide-react';

export default function LengthSelector({ selectedLength, onChange, disabled = false }) {
  const options = [
    {
      id: 'short',
      label: 'Short',
      icon: ListCollapse,
      target: '~20% length',
      desc: 'Rapid bullet takeaways & key executive points',
    },
    {
      id: 'medium',
      label: 'Medium',
      icon: AlignLeft,
      target: '~40% length',
      desc: 'Balanced synthesis with main supporting arguments',
    },
    {
      id: 'detailed',
      label: 'Detailed',
      icon: FileSpreadsheet,
      target: '~65% length',
      desc: 'Comprehensive summary preserving deep context & data',
    },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Summary Length
        </label>
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
          {options.find((o) => o.id === selectedLength)?.target}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {options.map((option) => {
          const isSelected = selectedLength === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.id)}
              className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                isSelected
                  ? 'bg-indigo-50/90 dark:bg-indigo-950/70 border-indigo-500 dark:border-indigo-500 text-indigo-950 dark:text-indigo-100 shadow-xs ring-1 ring-indigo-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="flex items-center gap-1.5 font-semibold text-sm">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                  {option.label}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-pulse"></span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                {option.desc}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
