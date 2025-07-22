
import React from 'react';
import type { GroundingChunk } from '../types';
import { LinkIcon } from './icons/LinkIcon';

interface SourceLinkProps {
    source: GroundingChunk;
}

export const SourceLink: React.FC<SourceLinkProps> = ({ source }) => {
    if (!source.web || !source.web.uri) {
        return null;
    }

    return (
        <a 
            href={source.web.uri} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-sky-400 text-sm px-3 py-1.5 rounded-full transition-colors duration-200"
        >
            <LinkIcon className="h-4 w-4" />
            <span>{source.web.title || new URL(source.web.uri).hostname}</span>
        </a>
    );
};
