
import React from 'react';
import type { BulkResultItem } from '../types';
import { downloadAsJson, downloadAsSimpleCsv, downloadAsExpandedCsv } from '../utils/export';

interface DownloadButtonsProps {
  results: BulkResultItem[];
}

export const DownloadButtons: React.FC<DownloadButtonsProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <button
        onClick={() => downloadAsJson(results)}
        className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-full hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200"
      >
        Download JSON
      </button>
      <button
        onClick={() => downloadAsSimpleCsv(results)}
        className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200"
      >
        Download CSV (Simple)
      </button>
      <button
        onClick={() => downloadAsExpandedCsv(results)}
        className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-full hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200"
      >
        Download CSV (Expanded)
      </button>
    </div>
  );
};