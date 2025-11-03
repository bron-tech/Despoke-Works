export type AspectRatio = '3:4' | '1:1' | '9:16' | '16:9';

export interface ModelConfig {
  type: 'pre-built' | 'upload' | 'description';
  uploadedPhoto: File | null;
  uploadedPhotoPreview?: string;
  preBuiltId: string | null;
  ethnicity: string;
  bodyType: string;
  hairstyle: string;
  age: string;
  skinTone: string;
  modelDescription: string;
}

export interface StylingConfig {
  fit: string;
  style: string;
  brand: string;
  styleDescription: string;
}

export interface PhotographyConfig {
  camera: string;
  lens: string;
  look: string;
  lighting: string;
  mood: string;
  aspectRatio: AspectRatio;
  backgroundType: 'description' | 'upload' | 'pre-built';
  uploadedBackground: File | null;
  uploadedBackgroundPreview?: string;
  preBuiltBackgroundId: string | null;
  backgroundDescription: string;
}

export interface GenerationParams {
  modelConfig: ModelConfig;
  stylingConfig: StylingConfig;
  photographyConfig: PhotographyConfig;
}

export interface GeneratedImage {
  src: string;
  format: 'Editorial' | 'E-commerce' | 'Social';
  metadata: ModelConfig & StylingConfig & PhotographyConfig;
  aspectRatio: AspectRatio;
}

export interface AISuggestion {
  title: string;
  description: string;
  config: {
    stylingConfig?: Partial<StylingConfig>;
    photographyConfig?: Partial<PhotographyConfig>;
  };
}

export interface InspirationItem {
  id: string;
  title: string;
  description: string;
  image: string;
  config: {
    modelConfig?: Partial<ModelConfig>;
    stylingConfig?: Partial<StylingConfig>;
    photographyConfig?: Partial<PhotographyConfig>;
  };
}
