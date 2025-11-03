import React from 'react';
import type { AISuggestion } from '../types';
import { SparklesIcon, XMarkIcon, WandSparklesIcon } from './icons';

interface SuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    suggestions: AISuggestion[];
    onApply: (suggestion: AISuggestion) => void;
    error: string | null;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
    isOpen,
    onClose,
    isLoading,
    suggestions,
    onApply,
    error,
}) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col ring-1 ring-gray-700/50"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                    <div className="flex items-center gap-3">
                        <WandSparklesIcon className="w-6 h-6 text-indigo-400" />
                        <h2 className="text-xl font-bold">AI Creative Suggestions</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        aria-label="Close suggestions"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center text-center py-12">
                            <SparklesIcon className="w-12 h-12 text-indigo-400 animate-pulse" />
                            <p className="mt-4 font-semibold">Your AI creative director is brainstorming...</p>
                            <p className="text-sm text-gray-400">This may take a moment.</p>
                        </div>
                    )}
                    
                    {error && (
                         <div className="flex flex-col items-center justify-center text-center py-12 bg-red-900/20 rounded-lg">
                            <p className="font-semibold text-red-400">Oops! Something went wrong.</p>
                            <p className="text-sm text-gray-400 mt-2">{error}</p>
                        </div>
                    )}

                    {!isLoading && !error && suggestions.length > 0 && (
                        <div className="space-y-4">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="bg-gray-900/50 p-4 rounded-lg ring-1 ring-gray-700/50 transition-all hover:ring-indigo-500/50 hover:shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-indigo-300">{suggestion.title}</h3>
                                            <p className="text-sm text-gray-300 mt-1">{suggestion.description}</p>
                                        </div>
                                        <button 
                                            onClick={() => onApply(suggestion)}
                                            className="ml-4 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors flex-shrink-0"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                     {!isLoading && !error && suggestions.length === 0 && (
                         <div className="flex flex-col items-center justify-center text-center py-12">
                            <p className="font-semibold">No suggestions available.</p>
                            <p className="text-sm text-gray-400 mt-2">Try changing some options to get new ideas.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
