import React from 'react';
import { INSPIRATION_GALLERY_ITEMS } from '../constants';
import type { ModelConfig, PhotographyConfig, StylingConfig, InspirationItem } from '../types';
import { LightBulbIcon } from './icons';

interface Props {
  setModelConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  setStylingConfig: React.Dispatch<React.SetStateAction<StylingConfig>>;
  setPhotographyConfig: React.Dispatch<React.SetStateAction<PhotographyConfig>>;
}

interface InspirationCardProps {
  item: InspirationItem;
  onApply: () => void;
}

// FIX: Define props interface and use React.FC to correctly type the component, resolving the error with the `key` prop.
const InspirationCard: React.FC<InspirationCardProps> = ({ item, onApply }) => (
  <div 
    className="w-36 flex-shrink-0 rounded-lg overflow-hidden relative group cursor-pointer shadow-lg" 
    onClick={onApply}
    role="button"
    aria-label={`Apply ${item.title} style`}
  >
    <img 
      src={item.image} 
      alt={item.title} 
      className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2 transition-all duration-300">
      <h4 className="font-bold text-white text-sm drop-shadow-md">{item.title}</h4>
      <p className="text-xs text-gray-300 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-300 overflow-hidden">{item.description}</p>
      <button 
        onClick={(e) => { e.stopPropagation(); onApply(); }} 
        className="mt-2 w-full text-xs py-1.5 px-2 rounded-md bg-indigo-600 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-indigo-500 transform group-hover:translate-y-0 translate-y-2"
      >
        Apply Style
      </button>
    </div>
  </div>
);


export const InspirationGallery = ({ setModelConfig, setStylingConfig, setPhotographyConfig }: Props) => {
    const handleApply = (inspirationConfig: InspirationItem['config']) => {
        if (inspirationConfig.modelConfig) {
            setModelConfig(prev => ({...prev, ...inspirationConfig.modelConfig}));
        }
        if (inspirationConfig.stylingConfig) {
            setStylingConfig(prev => ({...prev, ...inspirationConfig.stylingConfig}));
        }
        if (inspirationConfig.photographyConfig) {
            setPhotographyConfig(prev => ({...prev, ...inspirationConfig.photographyConfig}));
        }
    };

    return (
        <details className="bg-gray-800/50 rounded-xl ring-1 ring-gray-700/50 overflow-hidden" open>
            <summary className="p-4 font-semibold cursor-pointer flex items-center gap-3">
                <LightBulbIcon className="w-5 h-5 text-indigo-400" />
                Inspiration Gallery
            </summary>
            <div className="p-4 border-t border-gray-700/50">
                <div className="flex gap-4 overflow-x-auto pb-2 -mb-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {INSPIRATION_GALLERY_ITEMS.map(item => (
                        <InspirationCard key={item.id} item={item} onApply={() => handleApply(item.config)} />
                    ))}
                </div>
            </div>
        </details>
    );
};