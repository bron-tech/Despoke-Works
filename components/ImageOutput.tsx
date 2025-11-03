import React, { useState } from 'react';
// FIX: Import AspectRatio directly to simplify type definitions and avoid potential tooling errors.
import type { AspectRatio, GeneratedImage } from '../types';
import { ArrowsPointingOutIcon, DownloadIcon, SparklesIcon, XMarkIcon } from './icons';

interface Props {
  images: GeneratedImage[];
  isLoading: boolean;
}

// FIX: Explicitly define props for AspectRatioWrapper to improve clarity and avoid potential tooling errors.
interface AspectRatioWrapperProps {
  aspectRatio: AspectRatio;
  // FIX: Make children optional to resolve spurious TypeScript error.
  children?: React.ReactNode;
}

const AspectRatioWrapper = ({ aspectRatio, children }: AspectRatioWrapperProps) => {
    const aspectClasses: Record<AspectRatio, string> = {
        '3:4': 'aspect-[3/4]',
        '1:1': 'aspect-square',
        '9:16': 'aspect-[9/16]',
        '16:9': 'aspect-[16/9]',
    }
    return <div className={`w-full ${aspectClasses[aspectRatio]}`}>{children}</div>
}

export const ImageOutput = ({ images, isLoading }: Props) => {
  const [fullscreenImage, setFullscreenImage] = useState<GeneratedImage | null>(null);

  const handleDownload = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    // Create a filename that is safe for filesystems
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    link.download = `fashion-studio-${image.format.toLowerCase()}-${timestamp}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/50 rounded-xl p-8 text-center ring-1 ring-gray-700/50">
        <SparklesIcon className="w-16 h-16 text-indigo-400 animate-pulse" />
        <h2 className="text-2xl font-bold mt-4">Generating Your Vision</h2>
        <p className="text-gray-400 mt-2">The AI is warming up the virtual studio... Please wait a moment.</p>
        <div className="w-full max-w-md bg-gray-700 rounded-full h-2.5 mt-6 overflow-hidden">
          <div className="bg-indigo-600 h-2.5 rounded-full w-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800/50 rounded-xl p-8 text-center ring-1 ring-gray-700/50">
        <div className="w-24 h-32 bg-gray-700 rounded-md -rotate-6"></div>
        <div className="w-24 h-32 bg-gray-700 rounded-md rotate-6 -ml-8 -mt-28"></div>
        <h2 className="text-2xl font-bold mt-8">Your Photoshoot Awaits</h2>
        <p className="text-gray-400 mt-2">Configure your model and style, then click "Generate" to see the magic happen.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-800/50 rounded-xl p-4 ring-1 ring-gray-700/50">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {images.map((image, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-lg">
                      <AspectRatioWrapper aspectRatio={image.aspectRatio}>
                          <img src={image.src} alt={`Generated fashion shot ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      </AspectRatioWrapper>
                      
                      {/* Hover Overlay for actions */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                          <button onClick={() => setFullscreenImage(image)} title="View Fullscreen" className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors">
                              <ArrowsPointingOutIcon className="w-6 h-6 text-white" />
                          </button>
                           <button onClick={() => handleDownload(image)} title="Download Image" className="p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors">
                              <DownloadIcon className="w-6 h-6 text-white" />
                          </button>
                      </div>

                      {/* Info overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                          <p className="font-bold text-white text-lg">{image.format}</p>
                          <p className="text-xs text-gray-300 truncate">{`${image.metadata.style}, ${image.metadata.look}`}</p>
                      </div>
                  </div>
              ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-900 rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <img 
              src={fullscreenImage.src} 
              alt={`Fullscreen view of ${fullscreenImage.format}`} 
              className="w-full h-full object-contain rounded-lg"
            />
            <button 
              onClick={() => setFullscreenImage(null)} 
              title="Close"
              className="absolute top-2 right-2 text-white bg-gray-800/50 p-2 rounded-full hover:bg-gray-700/80 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <button 
              onClick={() => handleDownload(fullscreenImage)}
              title="Download Image"
              className="absolute bottom-4 right-4 text-white bg-indigo-600 p-3 rounded-full hover:bg-indigo-500 shadow-lg transition-transform hover:scale-105"
            >
              <DownloadIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};