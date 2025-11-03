import React, { useEffect } from 'react';
import { MODEL_OPTIONS, PHOTOGRAPHY_OPTIONS, STYLING_OPTIONS, PRE_BUILT_BACKGROUNDS } from '../constants';
import type { ModelConfig, PhotographyConfig, StylingConfig } from '../types';
import { CameraIcon, SwatchIcon, UserIcon, PhotoIcon, WandSparklesIcon, XMarkIcon } from './icons';

interface Props {
  modelConfig: ModelConfig;
  setModelConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
  stylingConfig: StylingConfig;
  setStylingConfig: React.Dispatch<React.SetStateAction<StylingConfig>>;
  photographyConfig: PhotographyConfig;
  setPhotographyConfig: React.Dispatch<React.SetStateAction<PhotographyConfig>>;
  onGetSuggestions: (suggestionType: 'styling' | 'photography') => void;
}

const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <details className="bg-gray-800/50 rounded-xl ring-1 ring-gray-700/50 overflow-hidden" open>
        <summary className="p-4 font-semibold cursor-pointer flex items-center gap-3">
            {icon}
            {title}
        </summary>
        <div className="p-4 border-t border-gray-700/50 space-y-4">
            {children}
        </div>
    </details>
)

const Select: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; children: React.ReactNode, disabled?: boolean }> = ({ label, value, onChange, children, disabled = false }) => (
    <div>
        <label className={`block text-sm font-medium mb-1 ${disabled ? 'text-gray-500' : 'text-gray-400'}`}>{label}</label>
        <select value={value} onChange={onChange} disabled={disabled} className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-800/50 disabled:text-gray-500 disabled:cursor-not-allowed">
            {children}
        </select>
    </div>
);

const TextArea: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string; }> = ({ label, value, onChange, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <textarea 
            value={value} 
            onChange={onChange} 
            placeholder={placeholder}
            rows={3}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-indigo-500 focus:border-indigo-500 transition placeholder:text-gray-500"
        />
    </div>
);

// Reusable Tab components for better organization
const TabContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex space-x-2 bg-gray-700/50 p-1 rounded-lg mb-4">
        {children}
    </div>
);

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600/50'}`}
    >
        {children}
    </button>
);


export const CustomizationPanel = ({
  modelConfig,
  setModelConfig,
  stylingConfig,
  setStylingConfig,
  photographyConfig,
  setPhotographyConfig,
  onGetSuggestions,
}: Props) => {
    const handleBackgroundFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setPhotographyConfig(prev => ({
                ...prev,
                backgroundType: 'upload',
                uploadedBackground: file,
                uploadedBackgroundPreview: previewUrl,
                preBuiltBackgroundId: null,
            }));
        }
    };

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        const previewUrl = photographyConfig.uploadedBackgroundPreview;
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [photographyConfig.uploadedBackgroundPreview]);


  return (
    <div className="space-y-6">
      {/* Model Customization */}
      <Section title="Model Details" icon={<UserIcon className="w-5 h-5 text-indigo-400" />}>
        <p className="text-xs text-gray-500 -mt-2">
            These options apply to 'Pre-built' models and can modify 'Uploaded' models. They are ignored if you 'Describe' a model from scratch.
        </p>
        <Select label="Ethnicity" value={modelConfig.ethnicity} onChange={e => setModelConfig(p => ({...p, ethnicity: e.target.value}))} disabled={modelConfig.type === 'description'}>
            {MODEL_OPTIONS.ethnicities.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Body Type" value={modelConfig.bodyType} onChange={e => setModelConfig(p => ({...p, bodyType: e.target.value}))} disabled={modelConfig.type === 'description'}>
            {MODEL_OPTIONS.bodyTypes.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Hairstyle" value={modelConfig.hairstyle} onChange={e => setModelConfig(p => ({...p, hairstyle: e.target.value}))} disabled={modelConfig.type === 'description'}>
            {MODEL_OPTIONS.hairstyles.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
         <Select label="Age" value={modelConfig.age} onChange={e => setModelConfig(p => ({...p, age: e.target.value}))} disabled={modelConfig.type === 'description'}>
            {MODEL_OPTIONS.ages.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Skin Tone" value={modelConfig.skinTone} onChange={e => setModelConfig(p => ({...p, skinTone: e.target.value}))} disabled={modelConfig.type === 'description'}>
            {MODEL_OPTIONS.skinTones.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <TextArea 
            label="Description Modifier"
            value={modelConfig.modelDescription}
            onChange={e => setModelConfig(p => ({...p, modelDescription: e.target.value}))}
            placeholder="Add details to modify the uploaded model (e.g., 'give them glasses'). This is ignored for 'Pre-built' models."
        />
      </Section>

      {/* Styling Customization */}
       <Section title="Styling & Fit" icon={<SwatchIcon className="w-5 h-5 text-indigo-400" />}>
        <Select label="Fit" value={stylingConfig.fit} onChange={e => setStylingConfig(p => ({...p, fit: e.target.value}))}>
            {STYLING_OPTIONS.fits.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
         <Select label="Style" value={stylingConfig.style} onChange={e => setStylingConfig(p => ({...p, style: e.target.value}))}>
            {STYLING_OPTIONS.styles.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Brand Inspiration" value={stylingConfig.brand} onChange={e => setStylingConfig(p => ({...p, brand: e.target.value}))}>
            {STYLING_OPTIONS.brands.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <TextArea 
            label="Style Description"
            value={stylingConfig.styleDescription}
            onChange={e => setStylingConfig(p => ({...p, styleDescription: e.target.value}))}
            placeholder="Or describe the outfit in detail (e.g., 'a vintage 1970s-style denim jacket with intricate embroidery'). This will override the selections above."
        />
        <button onClick={() => onGetSuggestions('styling')} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-md bg-indigo-600/50 hover:bg-indigo-600/80 transition-all duration-200 ring-1 ring-indigo-500/50">
            <WandSparklesIcon className="w-4 h-4" />
            Get AI Suggestions
        </button>
      </Section>
      
      {/* Photography Customization */}
      <Section title="Photography" icon={<CameraIcon className="w-5 h-5 text-indigo-400" />}>
        <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Aspect Ratio</label>
            <div className="grid grid-cols-2 gap-2">
                {PHOTOGRAPHY_OPTIONS.aspectRatios.map(ratio => (
                    <button key={ratio.value} onClick={() => setPhotographyConfig(p => ({...p, aspectRatio: ratio.value}))} className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${photographyConfig.aspectRatio === ratio.value ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                       {ratio.name} <span className="text-xs text-gray-400">({ratio.value})</span>
                    </button>
                ))}
            </div>
        </div>
        <Select label="Camera" value={photographyConfig.camera} onChange={e => setPhotographyConfig(p => ({...p, camera: e.target.value}))}>
            {PHOTOGRAPHY_OPTIONS.cameras.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Lens" value={photographyConfig.lens} onChange={e => setPhotographyConfig(p => ({...p, lens: e.target.value}))}>
            {PHOTOGRAPHY_OPTIONS.lenses.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Look" value={photographyConfig.look} onChange={e => setPhotographyConfig(p => ({...p, look: e.target.value}))}>
            {PHOTOGRAPHY_OPTIONS.looks.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
        <Select label="Lighting" value={photographyConfig.lighting} onChange={e => setPhotographyConfig(p => ({...p, lighting: e.target.value}))}>
            {PHOTOGRAPHY_OPTIONS.lightings.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>
         <Select label="Mood" value={photographyConfig.mood} onChange={e => setPhotographyConfig(p => ({...p, mood: e.target.value}))}>
            {PHOTOGRAPHY_OPTIONS.moods.map(o => <option key={o} value={o}>{o}</option>)}
        </Select>

        {/* New Background Selection UI */}
        <div className="bg-gray-800/50 rounded-xl p-4 ring-1 ring-gray-700/50">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <PhotoIcon className="w-6 h-6 text-indigo-400" />
                Background
            </h3>
            <TabContainer>
                <TabButton
                    isActive={photographyConfig.backgroundType === 'pre-built'}
                    onClick={() => setPhotographyConfig(prev => ({ ...prev, backgroundType: 'pre-built', uploadedBackground: null, uploadedBackgroundPreview: undefined }))}
                >
                    Scenes
                </TabButton>
                <TabButton
                    isActive={photographyConfig.backgroundType === 'upload'}
                    onClick={() => setPhotographyConfig(prev => ({ ...prev, backgroundType: 'upload' }))}
                >
                    Upload
                </TabButton>
                <TabButton
                    isActive={photographyConfig.backgroundType === 'description'}
                    onClick={() => setPhotographyConfig(prev => ({ ...prev, backgroundType: 'description', uploadedBackground: null, uploadedBackgroundPreview: undefined, preBuiltBackgroundId: null }))}
                >
                    Describe
                </TabButton>
            </TabContainer>
            
            <div>
                {photographyConfig.backgroundType === 'pre-built' && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {PRE_BUILT_BACKGROUNDS.map(bg => (
                            <button key={bg.id} onClick={() => setPhotographyConfig(prev => ({ ...prev, preBuiltBackgroundId: bg.id }))} className={`relative rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 ${photographyConfig.preBuiltBackgroundId === bg.id ? 'ring-4 ring-indigo-500' : 'ring-2 ring-transparent'}`}>
                                <img src={bg.image} alt={bg.name} className="w-full h-auto aspect-[3/4] object-cover" />
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-semibold text-sm truncate">{bg.name}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
                
                {photographyConfig.backgroundType === 'upload' && (
                    <div className="flex items-center justify-center w-full">
                        {photographyConfig.uploadedBackgroundPreview ? (
                            <div className="w-full relative group">
                                <div className="aspect-[3/4] rounded-lg overflow-hidden ring-4 ring-indigo-500 transition-all">
                                    <img src={photographyConfig.uploadedBackgroundPreview} alt="Uploaded background preview" className="w-full h-full object-cover" />
                                </div>
                                <label htmlFor="background-file-change" className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                                    <div className="text-center text-white font-semibold p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                                        <p>Change Photo</p>
                                    </div>
                                    <input id="background-file-change" type="file" className="hidden" onChange={handleBackgroundFileChange} accept="image/png, image/jpeg, image/webp" />
                                </label>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setPhotographyConfig(prev => ({
                                            ...prev,
                                            uploadedBackground: null,
                                            uploadedBackgroundPreview: undefined,
                                        }))
                                    }}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-gray-300 hover:bg-black/80 hover:text-white transition-all z-10"
                                    aria-label="Remove uploaded background"
                                >
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <label htmlFor="background-file-initial" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                                </div>
                                <input id="background-file-initial" type="file" className="hidden" onChange={handleBackgroundFileChange} accept="image/png, image/jpeg, image/webp" />
                            </label>
                        )}
                    </div>
                )}

                {photographyConfig.backgroundType === 'description' && (
                    <TextArea 
                        label="Scene Description"
                        value={photographyConfig.backgroundDescription}
                        onChange={e => setPhotographyConfig(p => ({...p, backgroundDescription: e.target.value}))}
                        placeholder="Describe the background in detail (e.g., 'a futuristic neon-lit alleyway in Tokyo at night')."
                    />
                )}
            </div>
        </div>
        <button onClick={() => onGetSuggestions('photography')} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-md bg-indigo-600/50 hover:bg-indigo-600/80 transition-all duration-200 ring-1 ring-indigo-500/50">
            <WandSparklesIcon className="w-4 h-4" />
            Get AI Suggestions
        </button>
      </Section>
    </div>
  );
};