
import React, { useState } from 'react';

interface BulkInputProps {
  onSearch: (text: string) => void;
  isLoading: boolean;
}

export const BulkInput: React.FC<BulkInputProps> = ({ onSearch, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim()) {
      onSearch(text.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl flex flex-col gap-4 items-center">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Enter one query per line, or a JSON array of strings. e.g.,\n"Samsung Galaxy S24 Ultra"\n"Sony PlayStation 5"\n["Google Pixel 8 Pro", "MacBook Air M3"]'
        disabled={isLoading}
        className="w-full h-48 p-4 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 ease-in-out disabled:opacity-50 font-mono text-sm"
        aria-label="Bulk search queries"
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="px-8 py-3 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
      >
        {isLoading ? 'Processing...' : 'Process Batch'}
      </button>
    </form>
  );
};
