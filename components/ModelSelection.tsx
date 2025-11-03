import React, { useEffect } from 'react';
import type { ModelConfig } from '../types';
import { PRE_BUILT_MODELS } from '../constants';
import { UserIcon } from './icons';

interface Props {
  config: ModelConfig;
  setConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
}

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

export const ModelSelection = ({ config, setConfig }: Props) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const previewUrl = URL.createObjectURL(file);
            setConfig(prev => ({
                ...prev,
                type: 'upload',
                uploadedPhoto: file,
                uploadedPhotoPreview: previewUrl,
                preBuiltId: null,
            }));
        }
    };

    // Clean up object URLs to prevent memory leaks
    useEffect(() => {
        const previewUrl = config.uploadedPhotoPreview;
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [config.uploadedPhotoPreview]);

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 ring-1 ring-gray-700/50">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UserIcon className="w-6 h-6 text-indigo-400" />
                Model Selection
            </h2>
            <div className="flex space-x-2 bg-gray-700/50 p-1 rounded-lg mb-4">
                <button
                    onClick={() => setConfig(prev => ({ ...prev, type: 'pre-built', uploadedPhoto: null, uploadedPhotoPreview: undefined }))}
                    className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${config.type === 'pre-built' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600/50'}`}
                >
                    Pre-built
                </button>
                <button
                    onClick={() => setConfig(prev => ({ ...prev, type: 'upload', preBuiltId: null }))}
                    className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${config.type === 'upload' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600/50'}`}
                >
                    Upload
                </button>
                 <button
                    onClick={() => setConfig(prev => ({ ...prev, type: 'description', uploadedPhoto: null, uploadedPhotoPreview: undefined, preBuiltId: null }))}
                    className={`w-full py-2 text-sm font-medium rounded-md transition-colors ${config.type === 'description' ? 'bg-indigo-600 text-white shadow' : 'text-gray-300 hover:bg-gray-600/50'}`}
                >
                    Describe
                </button>
            </div>
            {config.type === 'pre-built' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PRE_BUILT_MODELS.map(model => (
                        <button key={model.id} onClick={() => setConfig(prev => ({ ...prev, preBuiltId: model.id, ethnicity: model.ethnicity }))} className={`relative rounded-lg overflow-hidden transition-all duration-200 transform hover:scale-105 ${config.preBuiltId === model.id ? 'ring-4 ring-indigo-500' : 'ring-2 ring-transparent'}`}>
                            <img src={model.image} alt={model.name} className="w-full h-auto aspect-[3/4] object-cover" />
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                <p className="text-white font-semibold text-sm truncate">{model.name}</p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
            {config.type === 'upload' && (
                <div className="flex items-center justify-center w-full">
                    {config.uploadedPhotoPreview ? (
                        <div className="w-full relative group">
                            <div className="aspect-[3/4] rounded-lg overflow-hidden ring-2 ring-gray-700">
                                <img src={config.uploadedPhotoPreview} alt="Uploaded model preview" className="w-full h-full object-cover" />
                            </div>
                            <label htmlFor="dropzone-file-change" className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                                <div className="text-center text-white font-semibold p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                                    <p>Change Photo</p>
                                    <p className="text-xs text-gray-300 mt-1 truncate max-w-full">{config.uploadedPhoto?.name}</p>
                                </div>
                                <input id="dropzone-file-change" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                            </label>
                        </div>
                    ) : (
                        <label htmlFor="dropzone-file-initial" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700/50 hover:bg-gray-700 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                            </div>
                            <input id="dropzone-file-initial" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
                        </label>
                    )}
                </div>
            )}
            {config.type === 'description' && (
                 <TextArea 
                    label="Model Description"
                    value={config.modelDescription}
                    onChange={e => setConfig(p => ({...p, modelDescription: e.target.value}))}
                    placeholder="Describe the model in detail (e.g., 'a person with freckles and vibrant red curly hair'). This overrides the 'Model Details' dropdowns below."
                />
            )}
        </div>
    );
};