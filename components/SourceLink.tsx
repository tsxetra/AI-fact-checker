
import React from 'react';
import type { GroundingChunk } from '../types';

interface SourceLinkProps {
  source: GroundingChunk;
}

const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
  if (!source.web || !source.web.uri) {
    return null;
  }

  const { uri, title } = source.web;
  const domain = new URL(uri).hostname;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <a
      href={uri}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-2 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors duration-200"
    >
      <img src={faviconUrl} alt={`${domain} favicon`} className="w-5 h-5 rounded" />
      <div className="flex-1 overflow-hidden">
        <p className="text-sm font-medium text-gray-200 truncate">{title}</p>
        <p className="text-xs text-gray-400 truncate">{domain}</p>
      </div>
    </a>
  );
};

export default SourceLink;
