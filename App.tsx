
import React, { useState, useCallback } from 'react';
import type { ProductInfo, GroundingChunk, BulkResultItem, Language } from './types';
import { findProductInfo } from './services/geminiService';
import { SearchBar } from './components/SearchBar';
import { ProductCard } from './components/ProductCard';
import { Loader } from './components/Loader';
import { ErrorMessage } from './components/ErrorMessage';
import { BoxIcon } from './components/icons/BoxIcon';
import { InputModeSwitcher } from './components/InputModeSwitcher';
import { BulkInput } from './components/BulkInput';
import { ResultsTable } from './components/ResultsTable';
import { DownloadButtons } from './components/DownloadButtons';
import { LanguageSelector } from './components/LanguageSelector';

type ViewMode = 'single' | 'bulk';

export default function App(): React.ReactNode {
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [language, setLanguage] = useState<Language>('en');

  // State for single query mode
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);

  // State for bulk processing mode
  const [isBulkLoading, setIsBulkLoading] = useState<boolean>(false);
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkResults, setBulkResults] = useState<BulkResultItem[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setProductInfo(null);
    setSources([]);

    try {
      const result = await findProductInfo(query, language);
      if (result.product) {
        setProductInfo(result.product);
        setSources(result.sources);
      } else {
        setError("The AI could not structure the product data. Try a different query.");
      }
    } catch (e: unknown) {
      console.error(e);
      setError("Failed to retrieve product information. The product may not be found or an API error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  const parseBulkInput = (text: string): string[] => {
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'string')) {
            return parsed;
        }
    } catch (e) {
        // Not a valid JSON array, treat as lines of text
    }
    return text.split('\n').map(line => line.trim()).filter(Boolean);
  };

  const handleBulkSearch = useCallback(async (inputText: string) => {
    const queries = parseBulkInput(inputText);
    if (queries.length === 0) {
        setBulkError("Input is empty or invalid. Please provide a list of queries.");
        return;
    }

    setIsBulkLoading(true);
    setBulkError(null);
    setBulkResults([]);
    setProgress({ current: 0, total: queries.length });

    await Promise.all(
        queries.map(async (query) => {
            let resultItem: BulkResultItem;
            try {
                const res = await findProductInfo(query, language);
                resultItem = {
                    query: query,
                    product: res.product,
                    sources: res.sources,
                    error: res.product ? undefined : "AI could not structure data for this item.",
                };
            } catch (e) {
                 resultItem = {
                    query: query,
                    product: null,
                    sources: [],
                    error: e instanceof Error ? e.message : 'An unknown error occurred.',
                };
            }
            // Update progress and results as each promise resolves
            setBulkResults(prevResults => [...prevResults, resultItem]);
            setProgress(prev => ({ ...prev, current: prev.current + 1 }));
        })
    );

    setIsBulkLoading(false);
  }, [language]);

  const renderSingleMode = () => (
    <div className="w-full flex flex-col items-center gap-6">
       <div className="w-full max-w-2xl flex flex-col items-center gap-4">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        <LanguageSelector language={language} setLanguage={setLanguage} />
      </div>
      <div className="w-full flex-grow flex items-center justify-center min-h-[400px]">
        {isLoading && <Loader text="AI is analyzing information..." />}
        {error && !isLoading && <ErrorMessage message={error} />}
        {!isLoading && !error && productInfo && (
          <ProductCard product={productInfo} sources={sources} />
        )}
        {!isLoading && !error && !productInfo && (
          <div className="text-center text-slate-500 flex flex-col items-center gap-4">
            <BoxIcon className="w-24 h-24" />
            <p className="text-xl">Start searching to see results here</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderBulkMode = () => (
     <div className="w-full flex flex-col items-center gap-6">
        <div className="w-full max-w-3xl flex flex-col gap-4 items-center">
            <BulkInput onSearch={handleBulkSearch} isLoading={isBulkLoading} />
            <LanguageSelector language={language} setLanguage={setLanguage} />
        </div>
        <div className="w-full flex-grow flex items-center justify-center min-h-[400px]">
            {isBulkLoading && <Loader text={`Processing ${progress.current} of ${progress.total}...`} />}
            {bulkError && !isBulkLoading && <ErrorMessage message={bulkError} />}
            {!isBulkLoading && bulkResults.length > 0 && (
                <div className="w-full flex flex-col gap-4 items-center">
                    <ResultsTable results={bulkResults} />
                    <DownloadButtons results={bulkResults} />
                </div>
            )}
             {!isBulkLoading && !bulkError && bulkResults.length === 0 && (
                <div className="text-center text-slate-500 flex flex-col items-center gap-4">
                    <BoxIcon className="w-24 h-24" />
                    <p className="text-xl">Enter queries above to start bulk processing</p>
                </div>
            )}
        </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-6xl mx-auto flex flex-col items-center gap-8">
        <header className="text-center w-full">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Product Spec Finder
          </h1>
          <p className="mt-2 text-lg text-slate-400 max-w-2xl mx-auto">
            Use AI to find product info. Switch between a single query or bulk processing.
          </p>
        </header>

        <InputModeSwitcher mode={viewMode} setMode={setViewMode} />

        {viewMode === 'single' ? renderSingleMode() : renderBulkMode()}
        
      </main>
      <footer className="w-full max-w-4xl mx-auto text-center py-4 mt-8">
        <p className="text-sm text-slate-600">Powered by Gemini API</p>
      </footer>
    </div>
  );
}