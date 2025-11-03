import React, { useState, useCallback } from 'react';
import { CameraIcon, SparklesIcon, XMarkIcon } from './components/icons';
import { CustomizationPanel } from './components/CustomizationPanel';
import { Header } from './components/Header';
import { ImageOutput } from './components/ImageOutput';
import { ModelSelection } from './components/ModelSelection';
import type { ModelConfig, PhotographyConfig, StylingConfig, GeneratedImage, AISuggestion } from './types';
import { generateImages, getSuggestions } from './services/geminiService';
import { InspirationGallery } from './components/InspirationGallery';
import { SuggestionModal } from './components/SuggestionModal';

const LOCAL_STORAGE_KEY = 'generativeFashionStudioConfig';

export default function App() {
  const [modelConfig, setModelConfig] = useState<ModelConfig>({
    type: 'pre-built',
    uploadedPhoto: null,
    preBuiltId: 'model-1',
    ethnicity: 'White',
    bodyType: 'Slim',
    hairstyle: 'Long Straight',
    age: '20s',
    skinTone: 'Fair',
    modelDescription: '',
  });

  const [stylingConfig, setStylingConfig] = useState<StylingConfig>({
    fit: 'Modern Casual',
    style: 'Summer Streetwear',
    brand: 'Classic',
    styleDescription: '',
  });

  const [photographyConfig, setPhotographyConfig] = useState<PhotographyConfig>({
    camera: 'Leica',
    lens: 'Fixed 50mm',
    look: 'Editorial',
    lighting: 'Golden Hour',
    mood: 'Candid',
    aspectRatio: '3:4',
    backgroundType: 'description',
    uploadedBackground: null,
    preBuiltBackgroundId: null,
    backgroundDescription: 'An urban city street.',
  });

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for AI Suggestions
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const images = await generateImages({
        modelConfig,
        stylingConfig,
        photographyConfig,
      });
      setGeneratedImages(images);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [modelConfig, stylingConfig, photographyConfig]);

  const handleGetSuggestions = useCallback(async (suggestionType: 'styling' | 'photography') => {
    setIsSuggestionModalOpen(true);
    setIsSuggesting(true);
    setSuggestionError(null);
    setAiSuggestions([]);
    try {
      const suggestions = await getSuggestions({ modelConfig, stylingConfig, photographyConfig }, suggestionType);
      setAiSuggestions(suggestions);
    } catch (err) {
      setSuggestionError(err instanceof Error ? err.message : 'Failed to get suggestions.');
    } finally {
      setIsSuggesting(false);
    }
  }, [modelConfig, stylingConfig, photographyConfig]);

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.config.stylingConfig) {
        setStylingConfig(prev => ({...prev, ...suggestion.config.stylingConfig}));
    }
    if (suggestion.config.photographyConfig) {
        setPhotographyConfig(prev => ({...prev, ...suggestion.config.photographyConfig}));
    }
    setIsSuggestionModalOpen(false);
  };

  const handleSaveConfiguration = () => {
    try {
      // Create copies of the configs and remove non-serializable File objects
      const savableModelConfig = { ...modelConfig, uploadedPhoto: null, uploadedPhotoPreview: undefined };
      const savablePhotographyConfig = { ...photographyConfig, uploadedBackground: null, uploadedBackgroundPreview: undefined };

      const configuration = {
        modelConfig: savableModelConfig,
        stylingConfig,
        photographyConfig: savablePhotographyConfig,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configuration));
      alert('Configuration saved successfully!');
    } catch (e) {
      console.error("Failed to save configuration:", e);
      alert('Error: Could not save configuration.');
    }
  };

  const handleLoadConfiguration = () => {
    try {
      const savedConfigJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedConfigJSON) {
        const savedConfig = JSON.parse(savedConfigJSON);
        // Ensure file-related fields are reset upon loading
        setModelConfig({ ...savedConfig.modelConfig, uploadedPhoto: null, uploadedPhotoPreview: undefined });
        setStylingConfig(savedConfig.stylingConfig);
        setPhotographyConfig({ ...savedConfig.photographyConfig, uploadedBackground: null, uploadedBackgroundPreview: undefined });
        alert('Configuration loaded successfully! Please re-upload any custom images.');
      } else {
        alert('No saved configuration found.');
      }
    } catch (e) {
      console.error("Failed to load configuration:", e);
      alert('Error: Could not load or parse the saved configuration.');
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header onSave={handleSaveConfiguration} onLoad={handleLoadConfiguration} />
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">
        {/* --- Left Column: Controls --- */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6 h-full">
          <InspirationGallery
            setModelConfig={setModelConfig}
            setStylingConfig={setStylingConfig}
            setPhotographyConfig={setPhotographyConfig}
          />
          <ModelSelection config={modelConfig} setConfig={setModelConfig} />
          <CustomizationPanel
            modelConfig={modelConfig}
            setModelConfig={setModelConfig}
            stylingConfig={stylingConfig}
            setStylingConfig={setStylingConfig}
            photographyConfig={photographyConfig}
            setPhotographyConfig={setPhotographyConfig}
            onGetSuggestions={handleGetSuggestions}
          />
        </div>

        {/* --- Right Column: Output --- */}
        <div className="lg:col-span-8 xl:col-span-9 h-full flex flex-col">
          <ImageOutput images={generatedImages} isLoading={isLoading} />
        </div>
      </main>

      {/* --- Sticky Footer Action Button --- */}
      <footer className="sticky bottom-0 left-0 right-0 z-10 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700/50 flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full max-w-sm flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-white rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-600/30"
        >
          {isLoading ? (
            <>
              <SparklesIcon className="w-6 h-6 animate-pulse" />
              Generating Your Vision...
            </>
          ) : (
            <>
              <CameraIcon className="w-6 h-6" />
              Generate Photoshoot
            </>
          )}
        </button>
      </footer>
       {error && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-red-800/90 text-white p-4 rounded-lg shadow-xl flex items-center gap-4">
            <span>Error: {error}</span>
            <button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-red-700">
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        <SuggestionModal 
            isOpen={isSuggestionModalOpen}
            onClose={() => setIsSuggestionModalOpen(false)}
            isLoading={isSuggesting}
            suggestions={aiSuggestions}
            onApply={handleApplySuggestion}
            error={suggestionError}
        />
    </div>
  );
}