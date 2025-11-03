import React from 'react';
import { SparklesIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from './icons';

interface HeaderProps {
    onSave: () => void;
    onLoad: () => void;
}

export const Header = ({ onSave, onLoad }: HeaderProps) => {
  return (
    <header className="p-4 md:p-6 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1"></div> {/* Spacer */}
        <div className="flex-1 flex items-center justify-center">
            <SparklesIcon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl md:text-3xl font-bold text-center ml-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Generative Fashion Studio
            </h1>
        </div>
        <div className="flex-1 flex items-center justify-end gap-2">
            <button 
                onClick={onSave}
                title="Save Configuration"
                className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
                <ArrowDownTrayIcon className="w-6 h-6" />
            </button>
            <button 
                onClick={onLoad}
                title="Load Configuration"
                className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
                <ArrowUpTrayIcon className="w-6 h-6" />
            </button>
        </div>
      </div>
    </header>
  );
};