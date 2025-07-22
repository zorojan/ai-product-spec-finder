
import React from 'react';

type ViewMode = 'single' | 'bulk';

interface InputModeSwitcherProps {
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
}

export const InputModeSwitcher: React.FC<InputModeSwitcherProps> = ({ mode, setMode }) => {
  const baseClasses = "px-4 py-2 text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200";
  const activeClasses = "bg-slate-700 text-white";
  const inactiveClasses = "bg-slate-800 text-slate-400 hover:bg-slate-700/50";

  return (
    <div className="flex items-center p-1 bg-slate-800 rounded-lg">
      <button
        onClick={() => setMode('single')}
        className={`${baseClasses} ${mode === 'single' ? activeClasses : inactiveClasses}`}
        aria-pressed={mode === 'single'}
      >
        Single Query
      </button>
      <button
        onClick={() => setMode('bulk')}
        className={`${baseClasses} ${mode === 'bulk' ? activeClasses : inactiveClasses}`}
        aria-pressed={mode === 'bulk'}
      >
        Bulk Processing
      </button>
    </div>
  );
};
