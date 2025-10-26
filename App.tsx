import React, { useState, useCallback, useRef, useEffect } from 'react';
import { searchWithAi } from './services/geminiService';
import type { SearchResultItem } from './types';
import SearchInput from './components/SearchInput';
import SearchResult from './components/SearchResult';
import LoadingSpinner from './components/LoadingSpinner';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [searchResults]);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) return;

    setIsLoading(true);
    setError(null);
    setCurrentQuery(query);
    
    try {
      const { response, sources } = await searchWithAi(query);
      const newResult: SearchResultItem = {
        id: `${query}-${Date.now()}`,
        query,
        response,
        sources,
      };
      setSearchResults(prevResults => [newResult, ...prevResults]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
      setCurrentQuery('');
    }
  }, []);

  const renderContent = () => {
    const showWelcome = !isLoading && searchResults.length === 0;
    
    if (showWelcome) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              AI Fact-Checker
            </h1>
            <p className="text-gray-400 mt-4 max-w-md">
              Ask anything. Get fact-checked answers with sources, powered by Google Gemini.
            </p>
        </div>
      );
    }

    return (
       <div className="divide-y divide-gray-700/50">
            {isLoading && (
                 <div className="py-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold text-gray-100">{currentQuery}</h2>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                          <LogoIcon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 pt-2">
                            <LoadingSpinner className="w-6 h-6 text-gray-400" />
                        </div>
                    </div>
                </div>
            )}
            {searchResults.map((result) => (
              <SearchResult key={result.id} result={result} />
            ))}
        </div>
    );
  };
  
  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col h-screen">
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto"
      >
        <main className="container mx-auto px-4 max-w-3xl">
          {renderContent()}
        </main>
      </div>

      <footer className="w-full shrink-0 py-4 md:py-6 bg-gray-900/80 backdrop-blur-md border-t border-gray-800">
        <div className="container mx-auto px-4 max-w-3xl">
          <SearchInput onSubmit={handleSearch} isLoading={isLoading} />
          {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}
        </div>
      </footer>
    </div>
  );
};

export default App;