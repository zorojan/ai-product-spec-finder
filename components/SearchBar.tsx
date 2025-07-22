
import React, { useState } from 'react';
import { SearchIcon } from './icons/SearchIcon';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="e.g., Samsung Galaxy S24 Ultra"
        disabled={isLoading}
        className="w-full pl-5 pr-28 py-4 bg-slate-800 border border-slate-700 rounded-full text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none transition duration-200 ease-in-out disabled:opacity-50"
        aria-label="Search for a product"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="absolute inset-y-0 right-2 my-2 flex items-center justify-center px-6 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200"
        aria-label="Find"
      >
        {isLoading ? (
          "Searching..."
        ) : (
          <>
            <SearchIcon className="h-5 w-5 mr-2" />
            Find
          </>
        )}
      </button>
    </form>
  );
};