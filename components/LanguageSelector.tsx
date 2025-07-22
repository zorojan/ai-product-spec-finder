
import React from 'react';
import type { Language } from '../types';

interface LanguageSelectorProps {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language-select" className="text-sm font-medium text-slate-400">
        Language:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none transition"
      >
        <option value="en">English</option>
        <option value="ru">Русский</option>
      </select>
    </div>
  );
};
