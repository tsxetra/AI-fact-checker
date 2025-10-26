import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpIcon, MicrophoneIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

// FIX: Add types for SpeechRecognition API to the global window object.
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SearchInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null); // Use `any` for SpeechRecognition to avoid browser-specific type issues

  const isSpeechRecognitionSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(prevQuery => (prevQuery.trim() ? prevQuery + ' ' : '') + transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSpeechRecognitionSupported]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${scrollHeight}px`;
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMicClick = () => {
    if (isLoading || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl p-2 flex items-end gap-2 shadow-2xl">
      <textarea
        ref={textareaRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything..."
        className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none resize-none px-3 py-2.5 max-h-48"
        rows={1}
        disabled={isLoading}
      />
      {isSpeechRecognitionSupported && (
          <button
            type="button"
            onClick={handleMicClick}
            disabled={isLoading}
            className={`w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-700 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0 ${isListening ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
      )}
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="w-10 h-10 flex items-center justify-center bg-blue-600 rounded-full text-white hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
        aria-label="Submit query"
      >
        {isLoading ? <LoadingSpinner className="w-5 h-5" /> : <ArrowUpIcon className="w-5 h-5" />}
      </button>
    </form>
  );
};

export default SearchInput;