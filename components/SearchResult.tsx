import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { SearchResultItem } from '../types';
import SourceLink from './SourceLink';
import { LogoIcon } from './icons';

interface SearchResultProps {
  result: SearchResultItem;
}

const SearchResult: React.FC<SearchResultProps> = ({ result }) => {
  return (
    <div className="py-8">
      {/* User Query */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">{result.query}</h2>
      </div>

      {/* AI Response */}
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <LogoIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 pt-1">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            className="prose prose-invert prose-p:leading-relaxed prose-a:text-blue-400 hover:prose-a:text-blue-300 max-w-none"
          >
            {result.response}
          </ReactMarkdown>

          {result.sources.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Sources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.sources.map((source, index) => (
                  <SourceLink key={index} source={source} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;